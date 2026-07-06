import { Request, Response } from "express";
import { prisma } from "../configs/db";
import { deleteFileFromS3 } from "../services/document.service";

export const createVendorDocument = async (req: Request, res: Response) => {
  try {
    const { documentType, fileName, fileSize, s3Key } = req.body;
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

    if (
      vendor.verificationStatus === "PENDING_REVIEW" ||
      vendor.verificationStatus === "APPROVED"
    ) {
      return res.status(403).json({
        message:
          "Verification documents are locked while verification is in progress.",
      });
    }

    if (!documentType || !fileName || !s3Key) {
      return res.status(400).json({
        message: "documentType, fileName and s3Key are required",
      });
    }

    const existingDocument = await prisma.vendorDocument.findFirst({
      where: {
        vendorId: vendor.id,
        documentType,
      },
    });

    if (existingDocument) {
      await deleteFileFromS3(existingDocument.s3Key);

      await prisma.vendorDocument.delete({
        where: {
          id: existingDocument.id,
        },
      });
    }

    const document = await prisma.vendorDocument.create({
      data: {
        vendorId: vendor.id,
        documentType,
        fileName,
        fileSize,
        s3Key,
        fileUrl: `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
        uploadedById: user.id,
        uploadedByName: user.username,
        uploadedByRole: user.role,
      },
    });

    return res.status(201).json(document);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create vendor document",
    });
  }
};

export const getVendorDocuments = async (req: Request, res: Response) => {
  try {
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

    const documents = await prisma.vendorDocument.findMany({
      where: {
        vendorId: vendor.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      documents,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch vendor documents",
    });
  }
};

export const deleteVendorDocument = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
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

    if (
      vendor.verificationStatus === "PENDING_REVIEW" ||
      vendor.verificationStatus === "APPROVED"
    ) {
      return res.status(403).json({
        message:
          "Verification documents are locked while verification is in progress.",
      });
    }

    const document = await prisma.vendorDocument.findFirst({
      where: {
        id,
        vendorId: vendor.id,
      },
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    await deleteFileFromS3(document.s3Key);

    await prisma.vendorDocument.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Vendor document deleted",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete vendor document",
    });
  }
};
