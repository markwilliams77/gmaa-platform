import { Router } from "express";
import {
  createVendorDocument,
  getVendorDocuments,
  deleteVendorDocument,
} from "../controllers/vendorDocuments.controller";
import { generateUploadUrl } from "../services/document.service";
import { generateDocumentKey } from "../utils/s3";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";
import { prisma } from "../configs/db";

const router = Router();

router.post("/", authMiddleware, allowRoles(Role.VENDOR), createVendorDocument);

router.post(
  "/upload-url",
  authMiddleware,
  allowRoles(Role.VENDOR),
  async (req, res) => {
    try {
      const { folder, fileName, contentType } = req.body;
      const user = (req as any).user;
      const vendor = await prisma.vendor.findUnique({
        where: {
          userId: user.id,
        },
      });

      if (!vendor) {
        return res.status(404).json({
          message: "Vendor not found",
        });
      }

      if (!folder || !fileName || !contentType) {
        return res.status(400).json({
          message: "folder, fileName and contentType are required",
        });
      }

      const s3Key = generateDocumentKey({
        module: "vendors",
        ownerId: vendor.id,
        folder,
        fileName,
      });

      const uploadUrl = await generateUploadUrl("private", s3Key, contentType);

      return res.json({
        uploadUrl,
        s3Key,
      });
    } catch (error) {
      console.error(error);

      return res.status(500).json({
        message: "Failed to generate upload URL",
      });
    }
  },
);

router.get("/me", authMiddleware, allowRoles(Role.VENDOR), getVendorDocuments);
router.delete(
  "/:id",
  authMiddleware,
  allowRoles(Role.VENDOR),
  deleteVendorDocument,
);

export default router;
