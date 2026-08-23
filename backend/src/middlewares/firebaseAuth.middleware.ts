import { Request, Response, NextFunction } from "express";
import { firebaseAuth } from "../config/firebase.config";
import { UnauthorizedException } from "../utils/app-error";
import { db } from "../config/firebase.config";

export const firebaseAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // MOCK USER FOR DEVELOPMENT
  req.user = {
    uid: "mock-user-id",
    email: "mock@example.com",
    name: "Mock User",
  } as any;
  return next();
};
