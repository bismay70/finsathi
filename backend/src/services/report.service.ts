import { NotFoundException } from "../utils/app-error";
import { calulateNextReportDate } from "../utils/helper";
import { UpdateReportSettingType } from "../validators/report.validator";
import { convertToDollarUnit } from "../utils/format-currency";
import { format } from "date-fns";
import { genAI, genAIModel } from "../config/google-ai.config";
import { createUserContent } from "@google/genai";
import { reportInsightPrompt } from "../utils/prompt";
import { db } from "../config/firebase.config";

export const getAllReportsService = async (
  userId: string,
  pagination: {
    pageSize: number;
    pageNumber: number;
  }
) => {
  const query = db.collection("reports").where("userId", "==", userId);

  const { pageSize, pageNumber } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  const countSnapshot = await query.count().get();
  const totalCount = countSnapshot.data().count;

  const snapshot = await query
    .orderBy("createdAt", "desc")
    .offset(skip)
    .limit(pageSize)
    .get();

  const reports = snapshot.docs.map((doc) => doc.data());
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    reports,
    pagination: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};

export const updateReportSettingService = async (
  userId: string,
  body: UpdateReportSettingType
) => {
  const { isEnabled } = body;
  let nextReportDate: Date | null = null;

  const docRef = db.collection("report_settings").doc(userId);
  const doc = await docRef.get();
  
  if (!doc.exists) throw new NotFoundException("Report setting not found");
  
  const existingReportSetting: any = doc.data();

  if (isEnabled) {
    // Handle Firestore timestamp parsing safely
    const currentNextReportDate = existingReportSetting.nextReportDate?.toDate 
        ? existingReportSetting.nextReportDate.toDate() 
        : (existingReportSetting.nextReportDate ? new Date(existingReportSetting.nextReportDate) : null);
        
    const lastSentDate = existingReportSetting.lastSentDate?.toDate
        ? existingReportSetting.lastSentDate.toDate()
        : (existingReportSetting.lastSentDate ? new Date(existingReportSetting.lastSentDate) : null);

    const now = new Date();
    if (!currentNextReportDate || currentNextReportDate <= now) {
      nextReportDate = calulateNextReportDate(lastSentDate);
    } else {
      nextReportDate = currentNextReportDate;
    }
  }

  console.log(nextReportDate, "nextReportDate");

  await docRef.update({
    ...body,
    nextReportDate,
    updatedAt: new Date(),
  });
};

export const generateReportService = async (
  userId: string,
  fromDate: Date,
  toDate: Date
) => {
  
  const snapshot = await db.collection("transactions")
    .where("userId", "==", userId)
    .where("date", ">=", fromDate)
    .where("date", "<=", toDate)
    .get();

  const transactions = snapshot.docs.map(doc => doc.data());

  if (transactions.length === 0) return null;

  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryMap: Record<string, number> = {};

  transactions.forEach((tx: any) => {
    if (tx.type === "INCOME") {
      totalIncome += Math.abs(tx.amount || 0);
    } else if (tx.type === "EXPENSE") {
      const amt = Math.abs(tx.amount || 0);
      totalExpenses += amt;
      const cat = tx.category || "Uncategorized";
      categoryMap[cat] = (categoryMap[cat] || 0) + amt;
    }
  });

  if (totalIncome === 0 && totalExpenses === 0) return null;

  const sortedCategories = Object.entries(categoryMap)
    .map(([name, total]) => ({ _id: name, total }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const byCategory = sortedCategories.reduce(
    (acc: any, { _id, total }: any) => {
      acc[_id] = {
        amount: convertToDollarUnit(total),
        percentage:
          totalExpenses > 0 ? Math.round((total / totalExpenses) * 100) : 0,
      };
      return acc;
    },
    {} as Record<string, { amount: number; percentage: number }>
  );

  const availableBalance = totalIncome - totalExpenses;
  const savingsRate = calculateSavingRate(totalIncome, totalExpenses);

  const periodLabel = `${format(fromDate, "MMMM d")} - ${format(toDate, "d, yyyy")}`;

  const insights = await generateInsightsAI({
    totalIncome,
    totalExpenses,
    availableBalance,
    savingsRate,
    categories: byCategory,
    periodLabel: periodLabel,
  });

  return {
    period: periodLabel,
    summary: {
      income: convertToDollarUnit(totalIncome),
      expenses: convertToDollarUnit(totalExpenses),
      balance: convertToDollarUnit(availableBalance),
      savingsRate: Number(savingsRate.toFixed(1)),
      topCategories: Object.entries(byCategory)?.map(([name, cat]: any) => ({
        name,
        amount: cat.amount,
        percent: cat.percentage,
      })),
    },
    insights,
  };
};

async function generateInsightsAI({
  totalIncome,
  totalExpenses,
  availableBalance,
  savingsRate,
  categories,
  periodLabel,
}: {
  totalIncome: number;
  totalExpenses: number;
  availableBalance: number;
  savingsRate: number;
  categories: Record<string, { amount: number; percentage: number }>;
  periodLabel: string;
}) {
  try {
    const prompt = reportInsightPrompt({
      totalIncome: convertToDollarUnit(totalIncome),
      totalExpenses: convertToDollarUnit(totalExpenses),
      availableBalance: convertToDollarUnit(availableBalance),
      savingsRate: Number(savingsRate.toFixed(1)),
      categories,
      periodLabel,
    });

    const result = await genAI.models.generateContent({
      model: genAIModel,
      contents: [createUserContent([prompt])],
      config: {
        responseMimeType: "application/json",
      },
    });

    const response = result.text;
    const cleanedText = response?.replace(/```(?:json)?\n?/g, "").trim();

    if (!cleanedText) return [];

    const data = JSON.parse(cleanedText);
    return data;
  } catch (error) {
    return [];
  }
}

function calculateSavingRate(totalIncome: number, totalExpenses: number) {
  if (totalIncome <= 0) return 0;
  const savingRate = ((totalIncome - totalExpenses) / totalIncome) * 100;
  return parseFloat(savingRate.toFixed(2));
}
