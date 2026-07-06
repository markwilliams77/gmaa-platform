import express from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import {
  getMe,
  getVendorTenders,
  getVendorTenderById,
  submitBid,
  getVendorBids,
  getMyTenders,
  getMyWorkspaces,
  getVendorConsultations,
  updateConsultationStatus,
  submitVerification,
} from "../controllers/vendorDashboard.controller";
import { allowRoles } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";

const router = express.Router();

router.get("/me", authMiddleware, allowRoles(Role.VENDOR), getMe);
router.get("/tenders",authMiddleware,allowRoles(Role.VENDOR),getVendorTenders,);
router.get("/tenders/:id",authMiddleware,allowRoles(Role.VENDOR),getVendorTenderById,);
router.post("/bids", authMiddleware, allowRoles(Role.VENDOR), submitBid);
router.get("/bids", authMiddleware, allowRoles(Role.VENDOR), getVendorBids);
router.get("/my-tenders",authMiddleware, allowRoles(Role.VENDOR),getMyTenders,);
router.get("/workspaces",authMiddleware, allowRoles(Role.VENDOR),getMyWorkspaces,);
router.get("/consultations",authMiddleware, allowRoles(Role.VENDOR),getVendorConsultations,);
router.patch("/consultations/:id/status",authMiddleware, allowRoles(Role.VENDOR),updateConsultationStatus,);
router.post("/verification/submit", authMiddleware, allowRoles(Role.VENDOR), submitVerification);

export default router;
