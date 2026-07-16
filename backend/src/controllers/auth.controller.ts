import { Request, Response } from "express";
import { HTTPSTATUS } from "../config/http.config";
import { asyncHandler } from "../middlewares/asyncHandler.middlerware";
import { syncUserService } from "../services/auth.service";

export const syncUserController = asyncHandler(
  async (req: Request, res: Response) => {
    // req.user might already exist if it's an existing user, 
    // but the token is verified in the middleware. 
    // Wait, firebaseAuthMiddleware throws if user doesn't exist in DB.
    // For sync-user, it might be a NEW user! 
    // We need a specific middleware or logic in controller for syncing.
    // Let's modify the controller to extract the token directly.
    const authHeader = req.headers.authorization;
    const token = authHeader?.split("Bearer ")[1];
    
    if (!token) {
      return res.status(HTTPSTATUS.UNAUTHORIZED).json({ message: "No token provided" });
    }

    const { user, reportSetting } = await syncUserService(token, req.body);

    return res.status(HTTPSTATUS.OK).json({
      message: "User synced successfully",
      user,
      reportSetting,
    });
  }
);
