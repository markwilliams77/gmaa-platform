import { Request, Response } from "express";
import { prisma } from "../configs/db";
import { DocumentCategory, DocumentVisibility } from "@prisma/client";
import { deleteFileFromS3 } from "../services/document.service";
import { createLeadActivity } from "../services/activity.service";

export const createDocument = async (req: Request, res: Response) => {
  try {
    const {
      leadId,
      folderId,
      fileName,
      s3Key,
      category,
      subCategory,
      visibility,
      uploadedByRole,
      uploadedById,
      uploadedByName,
    } = req.body;

    if (!leadId || !fileName || !s3Key) {
      return res.status(400).json({
        message: "leadId, fileName and s3Key are required",
      });
    }

    const document = await prisma.leadDocument.create({
      data: {
        leadId,
        folderId,
        fileName,
        s3Key,
        category,
        subCategory,
        fileUrl: `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
        visibility: visibility ?? "SHARED",
        uploadedByRole,
        uploadedById,
        uploadedByName,
      },
    });

    await createLeadActivity({
      leadId,
      activity: "DOCUMENT_UPLOADED",
      description: `${fileName} uploaded`,
      createdBy: uploadedByName || uploadedByRole,
    });

    return res.status(201).json(document);
  } catch (error: any) {
    console.error(error);

    if (error?.message?.includes("Expected DocumentCategory")) {
      return res.status(400).json({
        message: "Invalid document category",
      });
    }

    if (error?.message?.includes("Expected DocumentVisibility")) {
      return res.status(400).json({
        message: "Invalid document visibility",
      });
    }

    return res.status(500).json({
      message: "Failed to create document",
    });
  }
};

export const createWorkspaceDocument = async (req: Request, res: Response) => {
  try {
    const {
      threadId,
      fileName,
      s3Key,
      documentType,
      uploadedByRole,
      uploadedById,
      uploadedByName,
    } = req.body;

    if (!threadId || !fileName || !s3Key) {
      return res.status(400).json({
        message: "threadId, fileName and s3Key are required",
      });
    }

    const document = await prisma.workspaceDocument.create({
      data: {
        threadId,
        fileName,
        s3Key,
        documentType,
        fileUrl: `https://${process.env.BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${s3Key}`,
        uploadedByRole,
        uploadedById,
        uploadedByName,
      },
    });

    return res.status(201).json(document);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create workspace document",
    });
  }
};

export const getLeadDocuments = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const folders = await prisma.leadFolder.findMany({
      where: {
        leadId: id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const documents = await prisma.leadDocument.findMany({
      where: {
        leadId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      folders,
      documents,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to fetch documents",
    });
  }
};

export const getWorkspaceDocuments = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const documents = await prisma.workspaceDocument.findMany({
      where: {
        threadId: id,
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
      message: "Failed to fetch workspace documents",
    });
  }
};

export const deleteWorkspaceDocument = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const document = await prisma.workspaceDocument.findUnique({
      where: {
        id,
      },
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    await deleteFileFromS3(document.s3Key);

    await prisma.workspaceDocument.delete({
      where: {
        id,
      },
    });

    return res.json({
      message: "Document deleted",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete workspace document",
    });
  }
};

export const deleteDocument = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const document = await prisma.leadDocument.findUnique({
      where: {
        id,
      },
    });

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    await deleteFileFromS3(document.s3Key);

    await prisma.leadDocument.delete({
      where: {
        id,
      },
    });

    await createLeadActivity({
      leadId: document.leadId,
      activity: "DOCUMENT_DELETED",
      description: `${document.fileName} deleted`,
      createdBy: "SYSTEM",
    });

    return res.json({
      message: "Document deleted",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete document",
    });
  }
};
