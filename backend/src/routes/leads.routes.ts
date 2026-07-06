import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";

import { createLead, getLeads, getLeadById, updateLeadRouting, assignVendorToLead, } from "../controllers/leads.controllers";

const router = express.Router();

router.post("/", authMiddleware, allowRoles(Role.ADMIN), createLead);
router.get("/", authMiddleware, allowRoles(Role.ADMIN), getLeads);
router.get("/:id", authMiddleware, allowRoles(Role.ADMIN), getLeadById);
router.patch("/:id/routing", authMiddleware, allowRoles(Role.ADMIN), updateLeadRouting,);
router.patch("/:id/assign-vendor", authMiddleware, allowRoles(Role.ADMIN), assignVendorToLead,);

export default router;