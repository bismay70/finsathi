import axios from "axios";
import { BadRequestException, NotFoundException } from "../utils/app-error";
import { calculateNextOccurrence } from "../utils/helper";
import {
  CreateTransactionType,
  UpdateTransactionType,
} from "../validators/transaction.validator";
import { genAI, genAIModel } from "../config/google-ai.config";
import { createPartFromBase64, createUserContent } from "@google/genai";
import { receiptPrompt } from "../utils/prompt";
import { db } from "../config/firebase.config";

export const createTransactionService = async (
  body: CreateTransactionType,
  userId: string
) => {
  let nextRecurringDate: Date | undefined;
  const currentDate = new Date();

  if (body.isRecurring && body.recurringInterval) {
    const calulatedDate = calculateNextOccurrence(
      body.date,
      body.recurringInterval
    );

    nextRecurringDate =
      calulatedDate < currentDate
        ? calculateNextOccurrence(currentDate, body.recurringInterval)
        : calulatedDate;
  }

  const newTxRef = db.collection("transactions").doc();
  const transaction = {
    ...body,
    _id: newTxRef.id,
    userId,
    category: body.category,
    amount: Number(body.amount),
    isRecurring: body.isRecurring || false,
    recurringInterval: body.recurringInterval || null,
    nextRecurringDate: nextRecurringDate || null,
    lastProcessed: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await newTxRef.set(transaction);

  return transaction;
};

export const getAllTransactionService = async (
  userId: string,
  filters: {
    keyword?: string;
    type?: string;
    recurringStatus?: "RECURRING" | "NON_RECURRING";
  },
  pagination: {
    pageSize: number;
    pageNumber: number;
  }
) => {
  const { keyword, type, recurringStatus } = filters;

  let query: FirebaseFirestore.Query = db.collection("transactions").where("userId", "==", userId);

  if (type) {
    query = query.where("type", "==", type);
  }

  if (recurringStatus) {
    if (recurringStatus === "RECURRING") {
      query = query.where("isRecurring", "==", true);
    } else if (recurringStatus === "NON_RECURRING") {
      query = query.where("isRecurring", "==", false);
    }
  }

  // Note: Keyword search across multiple fields is not natively supported in Firestore like in MongoDB.
  // We'll apply the keyword filter in memory after fetching, which is a compromise for this migration.
  // We'll fetch more data than requested and paginate manually if keyword is present.
  
  if (keyword) {
     const snapshot = await query.orderBy("createdAt", "desc").get();
     let allTransactions = snapshot.docs.map(doc => doc.data() as any);
     
     const lowerKeyword = keyword.toLowerCase();
     allTransactions = allTransactions.filter(tx => 
        (tx.title && tx.title.toLowerCase().includes(lowerKeyword)) ||
        (tx.category && tx.category.toLowerCase().includes(lowerKeyword))
     );
     
     const totalCount = allTransactions.length;
     const { pageSize, pageNumber } = pagination;
     const totalPages = Math.ceil(totalCount / pageSize);
     const skip = (pageNumber - 1) * pageSize;
     
     const transations = allTransactions.slice(skip, skip + pageSize);
     
     return {
        transations,
        pagination: {
          pageSize,
          pageNumber,
          totalCount,
          totalPages,
          skip,
        },
      };
  }

  const { pageSize, pageNumber } = pagination;
  const skip = (pageNumber - 1) * pageSize;

  const countSnapshot = await query.count().get();
  const totalCount = countSnapshot.data().count;

  const snapshot = await query
    .orderBy("createdAt", "desc")
    .offset(skip)
    .limit(pageSize)
    .get();

  const transations = snapshot.docs.map((doc) => doc.data());
  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    transations,
    pagination: {
      pageSize,
      pageNumber,
      totalCount,
      totalPages,
      skip,
    },
  };
};

export const getTransactionByIdService = async (
  userId: string,
  transactionId: string
) => {
  const docRef = db.collection("transactions").doc(transactionId);
  const doc = await docRef.get();
  
  if (!doc.exists) throw new NotFoundException("Transaction not found");
  
  const transaction = doc.data();
  if (transaction?.userId !== userId) throw new NotFoundException("Transaction not found");

  return transaction;
};

export const duplicateTransactionService = async (
  userId: string,
  transactionId: string
) => {
  const docRef = db.collection("transactions").doc(transactionId);
  const doc = await docRef.get();
  
  if (!doc.exists) throw new NotFoundException("Transaction not found");
  
  const transaction: any = doc.data();
  if (transaction.userId !== userId) throw new NotFoundException("Transaction not found");

  const newTxRef = db.collection("transactions").doc();
  const duplicated = {
    ...transaction,
    _id: newTxRef.id,
    title: `Duplicate - ${transaction.title}`,
    description: transaction.description
      ? `${transaction.description} (Duplicate)`
      : "Duplicated transaction",
    isRecurring: false,
    recurringInterval: null,
    nextRecurringDate: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  await newTxRef.set(duplicated);
  return duplicated;
};

export const updateTransactionService = async (
  userId: string,
  transactionId: string,
  body: UpdateTransactionType
) => {
  const docRef = db.collection("transactions").doc(transactionId);
  const doc = await docRef.get();
  
  if (!doc.exists) throw new NotFoundException("Transaction not found");
  
  const existingTransaction: any = doc.data();
  if (existingTransaction.userId !== userId) throw new NotFoundException("Transaction not found");

  const now = new Date();
  const isRecurring = body.isRecurring ?? existingTransaction.isRecurring;

  const date =
    body.date !== undefined ? body.date : existingTransaction.date;

  const recurringInterval =
    body.recurringInterval || existingTransaction.recurringInterval;

  let nextRecurringDate: Date | null = null;

  if (isRecurring && recurringInterval) {
    const calulatedDate = calculateNextOccurrence(date, recurringInterval);

    nextRecurringDate =
      calulatedDate < now
        ? calculateNextOccurrence(now, recurringInterval)
        : calulatedDate;
  }

  const updateData: any = {
    ...(body.title ? { title: body.title } : {}),
    ...(body.description ? { description: body.description } : {}),
    ...(body.category ? { category: body.category } : {}),
    ...(body.type ? { type: body.type } : {}),
    ...(body.paymentMethod ? { paymentMethod: body.paymentMethod } : {}),
    ...(body.amount !== undefined ? { amount: Number(body.amount) } : {}),
    date,
    isRecurring,
    recurringInterval,
    nextRecurringDate,
    updatedAt: new Date(),
  };

  await docRef.update(updateData);
  return;
};

export const deleteTransactionService = async (
  userId: string,
  transactionId: string
) => {
  const docRef = db.collection("transactions").doc(transactionId);
  const doc = await docRef.get();
  
  if (!doc.exists || doc.data()?.userId !== userId) {
    throw new NotFoundException("Transaction not found");
  }

  await docRef.delete();
  return;
};

export const bulkDeleteTransactionService = async (
  userId: string,
  transactionIds: string[]
) => {
  const batch = db.batch();
  
  // We should theoretically check if all belong to userId, but for bulk delete we can just query them
  const snapshot = await db.collection("transactions")
    .where("userId", "==", userId)
    .where("_id", "in", transactionIds)
    .get();

  if (snapshot.empty) throw new NotFoundException("No transations found");

  snapshot.docs.forEach(doc => {
    batch.delete(doc.ref);
  });

  await batch.commit();

  return {
    success: true,
    deletedCount: snapshot.size,
  };
};

export const bulkTransactionService = async (
  userId: string,
  transactions: CreateTransactionType[]
) => {
  try {
    const batch = db.batch();
    
    transactions.forEach(tx => {
      const ref = db.collection("transactions").doc();
      batch.set(ref, {
        ...tx,
        _id: ref.id,
        userId,
        isRecurring: false,
        nextRecurringDate: null,
        recurringInterval: null,
        lastProcessed: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    await batch.commit();

    return {
      insertedCount: transactions.length,
      success: true,
    };
  } catch (error) {
    throw error;
  }
};

export const scanReceiptService = async (
  file: Express.Multer.File | undefined
) => {
  if (!file) throw new BadRequestException("No file uploaded");

  try {
    if (!file.path) throw new BadRequestException("failed to upload file");

    console.log(file.path);

    const responseData = await axios.get(file.path, {
      responseType: "arraybuffer",
    });
    const base64String = Buffer.from(responseData.data).toString("base64");

    if (!base64String) throw new BadRequestException("Could not process file");

    const result = await genAI.models.generateContent({
      model: genAIModel,
      contents: [
        createUserContent([
          receiptPrompt,
          createPartFromBase64(base64String, file.mimetype),
        ]),
      ],
      config: {
        temperature: 0,
        topP: 1,
        responseMimeType: "application/json",
      },
    });

    const response = result.text;
    const cleanedText = response?.replace(/```(?:json)?\n?/g, "").trim();

    if (!cleanedText)
      return {
        error: "Could not read reciept  content",
      };

    const data = JSON.parse(cleanedText);

    if (!data.amount || !data.date) {
      return { error: "Reciept missing required information" };
    }

    return {
      title: data.title || "Receipt",
      amount: data.amount,
      date: data.date,
      description: data.description,
      category: data.category,
      paymentMethod: data.paymentMethod,
      type: data.type,
      receiptUrl: file.path,
    };
  } catch (error) {
    return { error: "Reciept scanning  service unavailable" };
  }
};
