import { calculateNextOccurrence } from "../../utils/helper";
import { db } from "../../config/firebase.config";

export const processRecurringTransactions = async () => {
  const now = new Date();
  let processedCount = 0;
  let failedCount = 0;

  try {
    const snapshot = await db.collection("transactions")
      .where("isRecurring", "==", true)
      .where("nextRecurringDate", "<=", now)
      .get();

    console.log("Starting recurring process");

    for (const doc of snapshot.docs) {
      const tx = doc.data();
      const nextDate = calculateNextOccurrence(
        tx.nextRecurringDate.toDate ? tx.nextRecurringDate.toDate() : new Date(tx.nextRecurringDate),
        tx.recurringInterval
      );

      const batch = db.batch();
      try {
        const newTxRef = db.collection("transactions").doc();
        batch.set(newTxRef, {
          ...tx,
          _id: newTxRef.id,
          title: `Recurring - ${tx.title}`,
          date: tx.nextRecurringDate,
          isRecurring: false,
          nextRecurringDate: null,
          recurringInterval: null,
          lastProcessed: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        });

        batch.update(doc.ref, {
          nextRecurringDate: nextDate,
          lastProcessed: now,
          updatedAt: new Date(),
        });

        await batch.commit();
        processedCount++;
      } catch (error: any) {
        failedCount++;
        console.log(`Failed recurring tx: ${tx._id}`, error);
      }
    }

    console.log(`✅Processed: ${processedCount} transaction`);
    console.log(`❌ Failed: ${failedCount} transaction`);

    return {
      success: true,
      processedCount,
      failedCount,
    };
  } catch (error: any) {
    console.error("Error occur processing transaction", error);

    return {
      success: false,
      error: error?.message,
    };
  }
};
