import { Router } from "express";
import { randomUUID } from "crypto";
import { generateUploadUrl } from "../services/document.service";
import { generateDocumentKey } from "../utils/s3";
import {
  createDocument,
  getLeadDocuments,
  deleteDocument,
  createWorkspaceDocument,
  getWorkspaceDocuments,
  deleteWorkspaceDocument,
} from "../controllers/documents.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { allowRoles } from "../middlewares/role.middleware";
import { Role } from "@prisma/client";

const router = Router();

router.get("/check", async (req, res) => {
  res.json({
    module: "documents",
    status: "working",
  });
});

router.post("/upload-url", async (req, res) => {
  try {
    const { leadId, fileName, contentType } = req.body;

    if (!leadId || !fileName || !contentType) {
      return res.status(400).json({
        error: "leadId, fileName and contentType are required",
      });
    }

    const s3Key = generateDocumentKey({
      module: "leads",
      ownerId: leadId,
      folder: "documents",
      fileName,
    });

    const uploadUrl = await generateUploadUrl("private", s3Key, contentType);

    return res.json({
      uploadUrl,
      s3Key,
    });
  } catch (error) {
    console.error("Upload URL Error:", error);

    return res.status(500).json({
      error: "Failed to generate upload URL",
    });
  }
});

router.post("/", authMiddleware, allowRoles(Role.ADMIN), createDocument);
router.get(
  "/lead/:id",
  authMiddleware,
  allowRoles(Role.ADMIN),
  getLeadDocuments,
);
router.delete("/:id", authMiddleware, allowRoles(Role.ADMIN), deleteDocument);
router.post(
  "/workspace",
  authMiddleware,
  allowRoles(Role.ADMIN, Role.VENDOR),
  createWorkspaceDocument,
);
router.get(
  "/workspace/:id",
  authMiddleware,
  allowRoles(Role.ADMIN, Role.VENDOR),
  getWorkspaceDocuments,
);
router.delete(
  "/workspace/:id",
  authMiddleware,
  allowRoles(Role.ADMIN, Role.VENDOR),
  deleteWorkspaceDocument,
);

export default router;
