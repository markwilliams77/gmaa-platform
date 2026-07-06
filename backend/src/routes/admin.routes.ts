import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { getAdminStats } from "../controllers/admin.controller";
import { allowRoles } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";


const router = express.Router();

router.get(
  "/stats",
  authMiddleware,
  allowRoles(Role.ADMIN),
  getAdminStats
);

export default router;