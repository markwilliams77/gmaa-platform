import { Router } from "express";
import { Role } from "@prisma/client";

import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";

import { getPendingVerifications, getVerificationDetails, rejectVerification, approveVerification, getVerificationStats, } from "../controllers/adminVerification.controller";

const router = Router();

router.get("/stats",authMiddleware,allowRoles(Role.ADMIN),getVerificationStats);
router.get("/",authMiddleware,allowRoles(Role.ADMIN),getPendingVerifications,);
router.get("/:vendorId",authMiddleware,allowRoles(Role.ADMIN),getVerificationDetails);
router.patch("/:vendorId/reject",authMiddleware,allowRoles(Role.ADMIN),rejectVerification);
router.patch("/:vendorId/approve",authMiddleware,allowRoles(Role.ADMIN),approveVerification);

export default router;
