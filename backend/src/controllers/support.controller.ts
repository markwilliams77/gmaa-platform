import { Request, Response } from "express";
import { prisma } from "../configs/db";

export const sendMessage = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;

    const threadId = Array.isArray(req.params.threadId)
  ? req.params.threadId[0]
  : req.params.threadId;
    const { content } = req.body;

    if (!threadId) {
      return res.status(400).json({
        message: "threadId is required",
      });
    }

    if (!content) {
      return res.status(400).json({
        message: "content is required",
      });
    }

    const thread = await prisma.supportThread.findUnique({
      where: {
        id: threadId,
      },
    });

    if (!thread) {
      return res.status(404).json({
        message: "Support thread not found",
      });
    }

    if (thread.status === "CLOSED") {
      return res.status(400).json({
        message: "Conversation is closed",
      });
    }

    const message = await prisma.message.create({
      data: {
        threadId,
        senderId: user.id,
        content,
      },
    });

    return res.json(message);
  } catch (error) {
    console.error("sendMessage error:", error);

    return res.status(500).json({
      message: "Failed to send message",
    });
  }
};

export const getMessages = async (
  req: Request,
  res: Response
) => {
  try {
    const threadId = Array.isArray(req.params.threadId)
      ? req.params.threadId[0]
      : req.params.threadId;

    if (!threadId) {
      return res.status(400).json({
        message: "threadId is required",
      });
    }

    const thread = await prisma.supportThread.findUnique({
      where: {
        id: threadId,
      },
    });

    if (!thread) {
      return res.status(404).json({
        message: "Support thread not found",
      });
    }

    const messages = await prisma.message.findMany({
      where: {
        threadId,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    return res.json(messages);
  } catch (error) {
    console.error("getMessages error:", error);

    return res.status(500).json({
      message: "Failed to load messages",
    });
  }
};

export const getThreads = async (
  req: Request,
  res: Response
) => {
  try {
    const user = (req as any).user;

    if (user.role === "ADMIN") {
      const threads = await prisma.supportThread.findMany({
        include: {
          tender: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
          vendor: {
            select: {
              id: true,
              vendorNumber: true,
              companyName: true,
            },
          },
          messages: {
            take: 1,
            orderBy: {
              createdAt: "desc",
            },
            select: {
              content: true,
              createdAt: true,
            },
          },
        },
      });

      return res.json(threads);
    } else if (user.role === "VENDOR") {
      const vendor = await prisma.vendor.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (!vendor) {
        return res.status(404).json({
          message: "Vendor not found",
        });
      }

      const threads = await prisma.supportThread.findMany({
        where: {
          vendorId: vendor.id,
        },
        include: {
          tender: {
            select: {
              id: true,
              title: true,
              status: true,
            },
          },
        },
      });

      return res.json(threads);
    }

    return res.status(403).json({
      message: "Unauthorized",
    });
  } catch (error) {
    console.error("getThreads error:", error);

    return res.status(500).json({
      message: "Failed to load threads",
    });
  }
};