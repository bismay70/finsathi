import { BadRequestException } from "../utils/app-error";
import { db } from "../config/firebase.config";
import { getSocketIO } from "../socket";

export const executeTradeService = async (userId: string, symbol: string, quantity: number, type: "buy" | "sell") => {
  // In a real app, we'd fetch the current market price from a reliable source.
  // Here we'll simulate a random current price for the transaction.
  // In reality, it should match the socket broadcast.
  const currentPrice = 150.0 + Math.random() * 50; 
  const totalAmount = currentPrice * quantity;

  // Record the trade transaction
  const newTxRef = db.collection("transactions").doc();
  const transaction = {
    _id: newTxRef.id,
    userId,
    title: `Trade: ${type.toUpperCase()} ${quantity}x ${symbol}`,
    description: `Algorithmic trade execution at $${currentPrice.toFixed(2)}`,
    category: "Trading",
    paymentMethod: "Trading Account",
    type: type === "buy" ? "expense" : "income",
    amount: Number(totalAmount.toFixed(2)),
    isRecurring: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    tradeDetails: {
      symbol,
      quantity,
      price: currentPrice,
      action: type
    }
  };

  await newTxRef.set(transaction);

  // Emit event
  try {
    getSocketIO().emit("transaction_update", { type: "create", data: transaction });
  } catch (e) {
    console.error("Socket error", e);
  }

  return transaction;
};
