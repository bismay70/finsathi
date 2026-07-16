import { DateRangeEnum, DateRangePreset } from "../enums/date-range.enum";
import { getDateRange } from "../utils/date";
import { differenceInDays, subDays, subYears } from "date-fns";
import { convertToDollarUnit } from "../utils/format-currency";
import { db } from "../config/firebase.config";
import { format } from "date-fns";

export const summaryAnalyticsService = async (
  userId: string,
  dateRangePreset?: DateRangePreset,
  customFrom?: Date,
  customTo?: Date
) => {
  const range = getDateRange(dateRangePreset, customFrom, customTo);
  const { from, to, value: rangeValue } = range;

  let query: FirebaseFirestore.Query = db.collection("transactions").where("userId", "==", userId);
  
  if (from && to) {
    query = query.where("date", ">=", from).where("date", "<=", to);
  }

  const snapshot = await query.get();
  const transactions = snapshot.docs.map(doc => doc.data());

  let totalIncome = 0;
  let totalExpenses = 0;
  const transactionCount = transactions.length;

  transactions.forEach((tx: any) => {
    if (tx.type === "INCOME") {
      totalIncome += Math.abs(tx.amount || 0);
    } else if (tx.type === "EXPENSE") {
      totalExpenses += Math.abs(tx.amount || 0);
    }
  });

  const availableBalance = totalIncome - totalExpenses;
  
  let savingsPercentage = 0;
  let expenseRatio = 0;
  if (totalIncome > 0) {
    savingsPercentage = ((totalIncome - totalExpenses) / totalIncome) * 100;
    expenseRatio = (totalExpenses / totalIncome) * 100;
  }

  let percentageChange: any = {
    income: 0,
    expenses: 0,
    balance: 0,
    prevPeriodFrom: null,
    prevPeriodTo: null,
    previousValues: {
      incomeAmount: 0,
      expenseAmount: 0,
      balanceAmount: 0,
    },
  };

  if (from && to && rangeValue !== DateRangeEnum.ALL_TIME) {
    const period = differenceInDays(to, from) + 1;
    const isYearly = [DateRangeEnum.LAST_YEAR, DateRangeEnum.THIS_YEAR].includes(rangeValue);

    const prevPeriodFrom = isYearly ? subYears(from, 1) : subDays(from, period);
    const prevPeriodTo = isYearly ? subYears(to, 1) : subDays(to, period);

    const prevSnapshot = await db.collection("transactions")
      .where("userId", "==", userId)
      .where("date", ">=", prevPeriodFrom)
      .where("date", "<=", prevPeriodTo)
      .get();
      
    const prevTransactions = prevSnapshot.docs.map(doc => doc.data());

    let prevIncome = 0;
    let prevExpenses = 0;

    prevTransactions.forEach((tx: any) => {
      if (tx.type === "INCOME") prevIncome += Math.abs(tx.amount || 0);
      else if (tx.type === "EXPENSE") prevExpenses += Math.abs(tx.amount || 0);
    });

    const prevBalance = prevIncome - prevExpenses;

    percentageChange = {
      income: calaulatePercentageChange(prevIncome, totalIncome),
      expenses: calaulatePercentageChange(prevExpenses, totalExpenses),
      balance: calaulatePercentageChange(prevBalance, availableBalance),
      prevPeriodFrom,
      prevPeriodTo,
      previousValues: {
        incomeAmount: prevIncome,
        expenseAmount: prevExpenses,
        balanceAmount: prevBalance,
      },
    };
  }

  return {
    availableBalance: convertToDollarUnit(availableBalance),
    totalIncome: convertToDollarUnit(totalIncome),
    totalExpenses: convertToDollarUnit(totalExpenses),
    savingRate: {
      percentage: parseFloat(savingsPercentage.toFixed(2)),
      expenseRatio: parseFloat(expenseRatio.toFixed(2)),
    },
    transactionCount,
    percentageChange: {
      ...percentageChange,
      previousValues: {
        incomeAmount: convertToDollarUnit(percentageChange.previousValues.incomeAmount),
        expenseAmount: convertToDollarUnit(percentageChange.previousValues.expenseAmount),
        balanceAmount: convertToDollarUnit(percentageChange.previousValues.balanceAmount),
      },
    },
    preset: {
      ...range,
      value: rangeValue || DateRangeEnum.ALL_TIME,
      label: range?.label || "All Time",
    },
  };
};

export const chartAnalyticsService = async (
  userId: string,
  dateRangePreset?: DateRangePreset,
  customFrom?: Date,
  customTo?: Date
) => {
  const range = getDateRange(dateRangePreset, customFrom, customTo);
  const { from, to, value: rangeValue } = range;

  let query: FirebaseFirestore.Query = db.collection("transactions").where("userId", "==", userId);
  
  if (from && to) {
    query = query.where("date", ">=", from).where("date", "<=", to);
  }

  const snapshot = await query.get();
  
  const dailyData: Record<string, any> = {};
  let totalIncomeCount = 0;
  let totalExpenseCount = 0;

  snapshot.docs.forEach(doc => {
    const tx = doc.data();
    // Safely parse Firestore timestamp or JS Date
    const dateObj = tx.date?.toDate ? tx.date.toDate() : new Date(tx.date);
    const dateStr = format(dateObj, "yyyy-MM-dd");

    if (!dailyData[dateStr]) {
      dailyData[dateStr] = { date: dateStr, income: 0, expenses: 0, incomeCount: 0, expenseCount: 0 };
    }

    if (tx.type === "INCOME") {
      dailyData[dateStr].income += Math.abs(tx.amount || 0);
      dailyData[dateStr].incomeCount += 1;
      totalIncomeCount++;
    } else if (tx.type === "EXPENSE") {
      dailyData[dateStr].expenses += Math.abs(tx.amount || 0);
      dailyData[dateStr].expenseCount += 1;
      totalExpenseCount++;
    }
  });

  const sortedDates = Object.keys(dailyData).sort();
  const transaformedData = sortedDates.map(date => ({
    date,
    income: convertToDollarUnit(dailyData[date].income),
    expenses: convertToDollarUnit(dailyData[date].expenses),
  }));

  return {
    chartData: transaformedData,
    totalIncomeCount,
    totalExpenseCount,
    preset: {
      ...range,
      value: rangeValue || DateRangeEnum.ALL_TIME,
      label: range?.label || "All Time",
    },
  };
};

export const expensePieChartBreakdownService = async (
  userId: string,
  dateRangePreset?: DateRangePreset,
  customFrom?: Date,
  customTo?: Date
) => {
  const range = getDateRange(dateRangePreset, customFrom, customTo);
  const { from, to, value: rangeValue } = range;

  let query: FirebaseFirestore.Query = db.collection("transactions")
    .where("userId", "==", userId)
    .where("type", "==", "EXPENSE");
  
  if (from && to) {
    query = query.where("date", ">=", from).where("date", "<=", to);
  }

  const snapshot = await query.get();
  
  const categoryTotals: Record<string, number> = {};
  let totalSpent = 0;

  snapshot.docs.forEach(doc => {
    const tx = doc.data();
    const cat = tx.category || "Uncategorized";
    const amt = Math.abs(tx.amount || 0);
    
    if (!categoryTotals[cat]) {
      categoryTotals[cat] = 0;
    }
    categoryTotals[cat] += amt;
    totalSpent += amt;
  });

  const sortedCategories = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  const topThree = sortedCategories.slice(0, 3);
  const others = sortedCategories.slice(3);

  let othersValue = 0;
  others.forEach(c => othersValue += c.value);

  const breakdown = [...topThree];
  if (othersValue > 0) {
    breakdown.push({ name: "others", value: othersValue });
  }

  const finalBreakdown = breakdown.map(cat => ({
    name: cat.name,
    value: convertToDollarUnit(cat.value),
    percentage: totalSpent === 0 ? 0 : Math.round((cat.value / totalSpent) * 100)
  }));

  return {
    totalSpent: convertToDollarUnit(totalSpent),
    breakdown: finalBreakdown,
    preset: {
      ...range,
      value: rangeValue || DateRangeEnum.ALL_TIME,
      label: range?.label || "All Time",
    },
  };
};

function calaulatePercentageChange(previous: number, current: number) {
  if (previous === 0) return current === 0 ? 0 : 100;
  const changes = ((current - previous) / Math.abs(previous)) * 100;
  const cappedChange = Math.min(Math.max(changes, -100), 100);
  return parseFloat(cappedChange.toFixed(2));
}
