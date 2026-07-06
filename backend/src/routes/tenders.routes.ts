// routes/tenders.routes.ts
import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { createTender, getTenders, getTenderById, broadcastTender, getTenderBids, awardBid, requestRebid, getAdminWorkspaces, } from "../controllers/tenders.controllers";
import { allowRoles } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";

const router = express.Router();

router.post( "/", authMiddleware, allowRoles(Role.ADMIN), createTender);
router.get( "/", authMiddleware, allowRoles(Role.ADMIN), getTenders);
router.get( "/workspaces", authMiddleware, allowRoles(Role.ADMIN), getAdminWorkspaces);
router.patch( "/:id/broadcast", authMiddleware, allowRoles(Role.ADMIN), broadcastTender);
router.patch( "/:id/rebid", authMiddleware, allowRoles(Role.ADMIN), requestRebid);
router.get( "/:id/bids", authMiddleware, allowRoles(Role.ADMIN), getTenderBids);
router.patch( "/:tenderId/award/:bidId", authMiddleware, allowRoles(Role.ADMIN), awardBid);
router.get( "/:id", authMiddleware, allowRoles(Role.ADMIN), getTenderById);

export default router;