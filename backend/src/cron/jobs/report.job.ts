import { endOfMonth, format, startOfMonth, subMonths } from "date-fns";
import { generateReportService } from "../../services/report.service";
import { calulateNextReportDate } from "../../utils/helper";
import { sendReportEmail } from "../../mailers/report.mailer";
import { db } from "../../config/firebase.config";

export const processReportJob = async () => {
  const now = new Date();

  let processedCount = 0;
  let failedCount = 0;

  const from = startOfMonth(subMonths(now, 1));
  const to = endOfMonth(subMonths(now, 1));

  try {
    const snapshot = await db.collection("report_settings")
      .where("isEnabled", "==", true)
      .where("nextReportDate", "<=", now)
      .get();

    console.log("Running report");

    for (const doc of snapshot.docs) {
      const setting: any = doc.data();
      const userDoc = await db.collection("users").doc(setting.userId).get();
      
      if (!userDoc.exists) {
        console.log(`User not found for setting: ${doc.id}`);
        continue;
      }
      
      const user: any = userDoc.data();

      try {
        const report = await generateReportService(user.firebaseUid, from, to);
        console.log(report, "report data");

        let emailSent = false;
        if (report) {
          try {
            await sendReportEmail({
              email: user.email!,
              username: user.name!,
              report: {
                period: report.period,
                totalIncome: report.summary.income,
                totalExpenses: report.summary.expenses,
                availableBalance: report.summary.balance,
                savingsRate: report.summary.savingsRate,
                topSpendingCategories: report.summary.topCategories,
                insights: report.insights,
              },
              frequency: setting.frequency!,
            });
            emailSent = true;
          } catch (error) {
            console.log(`Email failed for ${user.firebaseUid}`);
          }
        }

        const batch = db.batch();

        if (report && emailSent) {
          const newReportRef = db.collection("reports").doc();
          batch.set(newReportRef, {
            _id: newReportRef.id,
            userId: user.firebaseUid,
            sentDate: now,
            period: report.period,
            status: "SENT",
            createdAt: now,
            updatedAt: now,
          });

          batch.update(doc.ref, {
            lastSentDate: now,
            nextReportDate: calulateNextReportDate(now),
            updatedAt: now,
          });
        } else {
          const newReportRef = db.collection("reports").doc();
          batch.set(newReportRef, {
            _id: newReportRef.id,
            userId: user.firebaseUid,
            sentDate: now,
            period: report?.period || `${format(from, "MMMM d")}–${format(to, "d, yyyy")}`,
            status: report ? "FAILED" : "NO_ACTIVITY",
            createdAt: now,
            updatedAt: now,
          });

          batch.update(doc.ref, {
            lastSentDate: null,
            nextReportDate: calulateNextReportDate(now),
            updatedAt: now,
          });
        }

        await batch.commit();
        processedCount++;
      } catch (error) {
        console.log(`Failed to process report`, error);
        failedCount++;
      }
    }

    console.log(`✅Processed: ${processedCount} report`);
    console.log(`❌ Failed: ${failedCount} report`);

    return {
      success: true,
      processedCount,
      failedCount,
    };
  } catch (error) {
    console.error("Error processing reports", error);
    return {
      success: false,
      error: "Report process failed",
    };
  }
};
