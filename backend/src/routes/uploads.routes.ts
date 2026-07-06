import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { generatePresignedUploadUrl } from "../controllers/uploads.controller";

const router = Router();

router.get("/test", (_req, res) => {
  res.json({
    message: "Uploads route working",
  });
});

router.post(
  "/presigned-url",
  authMiddleware,
  generatePresignedUploadUrl
);

export default router;