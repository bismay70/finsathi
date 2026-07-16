import { Request, Response, NextFunction } from "express";
import { firebaseAuth } from "../config/firebase.config";
import { UnauthorizedException } from "../utils/app-error";
import { db } from "../config/firebase.config";

export const firebaseAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedException("No token provided");
    }

    const token = authHeader.split("Bearer ")[1];
    const decodedToken = await firebaseAuth.verifyIdToken(token);

    if (!decodedToken || !decodedToken.uid) {
      throw new UnauthorizedException("Invalid token");
    }

    const userDoc = await db.collection("users").doc(decodedToken.uid).get();
    const user = userDoc.exists ? userDoc.data() : null;
    
    if (!user) {
      throw new UnauthorizedException("User not found in local database");
    }

    // Attach user to request object (simulating what passport did)
    req.user = user;
    
    next();
  } catch (error) {
    console.error("Firebase auth error:", error);
    next(new UnauthorizedException("Invalid or expired token"));
  }
};
