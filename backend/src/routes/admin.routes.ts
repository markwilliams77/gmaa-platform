import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getAdminStats } from "../controllers/admin.controller";

const router = express.Router();

router.get(
  "/stats",
  authMiddleware,
  getAdminStats
);

export default router;