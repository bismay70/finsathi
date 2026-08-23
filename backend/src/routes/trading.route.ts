import { Router } from "express";
import { tradeController } from "../controllers/trading.controller";

const tradingRoutes = Router();

tradingRoutes.post("/execute", tradeController);

export default tradingRoutes;
