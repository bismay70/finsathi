import { Request, Response } from "express";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";
import { HTTPSTATUS } from "../config/http.config";
import { chatService } from "../services/chat.service";

export const chatController = asyncHandler(async (req: Request, res: Response) => {
    const { query } = req.body;
    if (!query) {
        res.status(HTTPSTATUS.BAD_REQUEST).json({ message: "Query is required" });
        return;
    }
    const answer = await chatService(query as string);
    res.status(HTTPSTATUS.OK).json({ answer });
});
