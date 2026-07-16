import { Router } from "express";
import { syncUserController } from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/sync-user", syncUserController);

export default authRoutes;
