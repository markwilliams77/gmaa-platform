import express from "express";
import {
  completeVendorDocument,
  createRazorpayOrder,
  createVendorOnboarding,
  findVendorOnboardingByEmail,
  getVendorOnboarding,
  getVendorStatus,
  presignVendorDocument,
  submitVendorOnboarding,
  updateVendorOnboarding,
  verifyRazorpayPayment,
  approveVendor,
  createVendorLogin,
  listVendorOnboardings,
  getAdminVendorOnboarding,
  updateVendorStatus,getAdminVendors,createVendorLoginPublic,
} from "../controllers/vendors.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";

const router = express.Router();

router.get("/ping", (req, res) => {
  res.json({
    success: true,
    source: "vendors.routes.ts",
  });
});
router.post("/onboarding", createVendorOnboarding);
router.get("/onboarding", findVendorOnboardingByEmail);
router.get("/:vendorId/onboarding", getVendorOnboarding);
router.get("/admin/vendors", authMiddleware, allowRoles(Role.ADMIN), getAdminVendors,);
router.get("/admin/vendor-onboardings", authMiddleware, allowRoles(Role.ADMIN), listVendorOnboardings,);
router.get("/admin/vendor-onboardings/:id", authMiddleware, allowRoles(Role.ADMIN), getAdminVendorOnboarding);
router.patch("/:vendorId/onboarding", updateVendorOnboarding);
router.post("/:vendorId/documents/presign", presignVendorDocument);
router.post("/:vendorId/documents/complete", completeVendorDocument);
router.post("/:vendorId/payments/razorpay/order", createRazorpayOrder);
router.post("/:vendorId/payments/razorpay/verify", verifyRazorpayPayment);
router.post("/:vendorId/submit", submitVendorOnboarding);
router.get("/:vendorId/status", getVendorStatus);
router.patch("/:vendorId/approve", authMiddleware, allowRoles(Role.ADMIN), approveVendor);
router.post("/:vendorId/login-info", authMiddleware, allowRoles(Role.ADMIN), createVendorLogin);
router.post( "/:vendorId/login-info-public",createVendorLoginPublic );
router.patch("/admin/vendors/:vendorId/status", authMiddleware, allowRoles(Role.ADMIN), updateVendorStatus,);
export default router;
