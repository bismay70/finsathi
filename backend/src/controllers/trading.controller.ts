import { NextFunction, Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";
import { executeTradeService } from "../services/trading.service";
import { HTTPSTATUS } from "../config/http.config";

export const tradeController = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { symbol, quantity, type } = req.body;
    const userId = req.user?._id;

    if (!userId) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
    }

    if (!["buy", "sell"].includes(type)) {
       return res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Invalid trade type" });
    }

    const transaction = await executeTradeService(userId, symbol, quantity, type);

    res.status(HTTPSTATUS.OK).json({
      message: `Successfully executed ${type} for ${quantity}x ${symbol}`,
      data: transaction,
    });
  }
);
