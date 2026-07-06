import { Request, Response } from "express";
import { generateDocumentKey } from "../utils/s3";
import { generateUploadUrl, getBucketName } from "../services/document.service";

export const generatePresignedUploadUrl = async (
  req: Request,
  res: Response,
) => {
  try {
    const { module, ownerId, folder, fileName, contentType } = req.body;

    const user = (req as any).user;
    if (user.role === "VENDOR" && ownerId !== user.vendorId) {
      return res.status(403).json({
        message: "You can only upload files for your own account.",
      });
    }

    if (!module || !ownerId || !folder || !fileName || !contentType) {
      return res.status(400).json({
        message:
          "module, ownerId, folder, fileName and contentType are required",
      });
    }

    const key = generateDocumentKey({
      module,
      ownerId,
      folder,
      fileName,
    });

    const bucketType = module === "website" ? "public" : "private";

    const uploadUrl = await generateUploadUrl(bucketType, key, contentType);

    const bucketName = getBucketName(bucketType);

    const fileUrl = `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return res.json({
      uploadUrl,
      key,
      fileUrl,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to generate upload URL",
    });
  }
};
