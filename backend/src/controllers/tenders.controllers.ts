// controllers/tenders.controller.ts
import { Request, Response } from "express";
import { prisma } from "../configs/db";
import { createLeadActivity } from "../services/activity.service";

export const createTender = async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (user.role !== "ADMIN") {
    return res.status(403).json({ message: "Only admin can create tenders" });
  }

  const { service, description, category, deadline } = req.body.tenderData;

  console.log("CREATE TENDER BODY", req.body);

  if (!category) {
    return res.status(400).json({
      message: "Category is required",
    });
  }

  const tenderCount = await prisma.tender.count();

  const tenderNumber = `TND-${new Date().getFullYear()}-${String(
    tenderCount + 1,
  ).padStart(6, "0")}`;

  const tender = await prisma.tender.create({
    data: {
      tenderNumber,
      title: service,
      description,
      mainCategory: category,
      createdBy: user.id,
      deadline: deadline ? new Date(deadline) : null,
    },
  });

  res.json(tender);
};

// Everyone authenticated: list tenders
export const getTenders = async (req: Request, res: Response) => {
  const tenders = await prisma.tender.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          bids: true,
        },
      },
    },
  });

  res.json(tenders);
};

// Get single tender
export const getTenderById = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admin can view tender details",
      });
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({
        message: "Tender id is required",
      });
    }

    const tender = await prisma.tender.findUnique({
      where: {
        id,
      },
    });

    if (!tender) {
      return res.status(404).json({
        message: "Tender not found",
      });
    }

    const currentRound = await prisma.tenderRound.findFirst({
      where: {
        tenderId: tender.id,
      },
      orderBy: {
        roundNumber: "desc",
      },
    });

    const allBids = await prisma.bid.findMany({
      where: {
        tenderId: tender.id,
      },
      include: {
        vendor: true,
        round: true,
      },
    });

    const latestBidPerVendor = new Map();

    const sortedBids = [...allBids].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    );

    for (const bid of sortedBids) {
      if (!latestBidPerVendor.has(bid.vendorId)) {
        latestBidPerVendor.set(bid.vendorId, bid);
      }
    }

    const rankings = Array.from(latestBidPerVendor.values())
      .sort((a, b) => a.amount - b.amount)
      .map((bid, index) => {
        const vendorBidHistory = allBids
          .filter((b) => b.vendorId === bid.vendorId)
          .sort((a, b) => a.round.roundNumber - b.round.roundNumber)
          .map((b) => ({
            round: b.round.roundNumber,
            amount: b.amount,
          }));

        return {
          position: `L${index + 1}`,
          vendorId: bid.vendorId,
          vendorName: bid.vendor.companyName,

          latestBid: bid.amount,

          bidHistory: vendorBidHistory,
        };
      });

    const workspaces = await prisma.supportThread.findMany({
      where: {
        tenderId: tender.id,
      },
      include: {
        vendor: true,
      },
    });

    return res.json({
      tender,

      currentRound,

      rankings,

      workspaces: workspaces.map((workspace) => ({
        workspaceId: workspace.id,
        vendorId: workspace.vendorId,
        vendorName: workspace.vendor?.companyName,
        status: workspace.status,
      })),
    });
  } catch (error) {
    console.error("getTenderById error:", error);

    return res.status(500).json({
      message: "Failed to load tender details",
    });
  }
};

export const broadcastTender = async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Only admin can broadcast tenders",
    });
  }

  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({
        message: "Tender id is required",
      });
    }

    const existingRound = await prisma.tenderRound.findFirst({
      where: {
        tenderId: id,
      },
    });

    if (existingRound) {
      return res.status(400).json({
        message: "Tender already has rounds",
      });
    }

    const tenderRecord = await prisma.tender.findUnique({
      where: {
        id,
      },
    });

    if (!tenderRecord) {
      return res.status(404).json({
        message: "Tender not found",
      });
    }

    const eligibleVendors = await prisma.vendor.findMany({
      where: {
        verificationStatus: "APPROVED",

        user: {
          vendorStatus: "ACTIVE",
        },

        mainCategory: {
          equals: tenderRecord.mainCategory,
          mode: "insensitive",
        },
      },
    });

    const round = await prisma.tenderRound.create({
      data: {
        tenderId: id,
        roundNumber: 1,
        status: "OPEN",
      },
    });

    console.log("ROUND CREATED:", round.id);
    console.log("ELIGIBLE VENDORS:", eligibleVendors.length); //test

    if (eligibleVendors.length > 0) {
      await prisma.roundParticipant.createMany({
        data: eligibleVendors.map((vendor) => ({
          roundId: round.id,
          vendorId: vendor.id,
        })),
      });

      console.log(
        "THREAD DATA",
        eligibleVendors.map((vendor) => ({
          tenderId: tenderRecord.id,
          vendorId: vendor.id,
          createdBy: user.id,
        })),
      );

      await prisma.supportThread.createMany({
        data: eligibleVendors.map((vendor) => ({
          tenderId: tenderRecord.id,
          vendorId: vendor.id,
          createdBy: user.id,
        })),
      });
    }

    const tender = await prisma.tender.update({
      where: {
        id,
      },
      data: {
        status: "BROADCASTED",
      },
    });

    return res.json(tender);
  } catch (error) {
    console.error("broadcastTender error:", error);

    return res.status(500).json({
      message: "Failed to broadcast tender",
    });
  }
};

export const requestRebid = async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Only admin can request rebid",
    });
  }

  try {
    const { vendorIds } = req.body;

    if (!Array.isArray(vendorIds) || vendorIds.length === 0) {
      return res.status(400).json({
        message: "vendorIds are required",
      });
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({
        message: "Tender id is required",
      });
    }

    const tender = await prisma.tender.findUnique({
      where: {
        id,
      },
    });

    if (!tender) {
      return res.status(404).json({
        message: "Tender not found",
      });
    }

    if (tender.status === "AWARDED") {
      return res.status(400).json({
        message: "Cannot request rebid for awarded tender",
      });
    }

    const currentRound = await prisma.tenderRound.findFirst({
      where: {
        tenderId: id,
        status: "OPEN",
      },
      orderBy: {
        roundNumber: "desc",
      },
    });

    if (!currentRound) {
      return res.status(400).json({
        message: "No active round found",
      });
    }

    const nextRound = await prisma.$transaction(async (tx) => {
      await tx.tenderRound.update({
        where: {
          id: currentRound.id,
        },
        data: {
          status: "CLOSED",
        },
      });

      const round = await tx.tenderRound.create({
        data: {
          tenderId: id,
          roundNumber: currentRound.roundNumber + 1,
          status: "OPEN",
        },
      });

      if (Array.isArray(vendorIds) && vendorIds.length > 0) {
        await tx.roundParticipant.createMany({
          data: vendorIds.map((vendorId: string) => ({
            roundId: round.id,
            vendorId,
          })),
        });
      }

      return round;
    });
    return res.json({
      message: "Rebid round created successfully",
    });
  } catch (error) {
    console.error("requestRebid error:", error);

    return res.status(500).json({});
  }
};

export const getTenderBids = async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Only admin can view bids",
    });
  }

  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({
        message: "Tender id is required",
      });
    }

    const bids = await prisma.bid.findMany({
      where: {
        tenderId: id,
      },

      include: {
        vendor: {
          select: {
            vendorNumber: true,
            companyName: true,
          },
        },

        round: {
          select: {
            roundNumber: true,
          },
        },
      },

      orderBy: {
        amount: "asc",
      },
    });

    return res.json(bids);
  } catch (error) {
    console.error("getTenderBids error:", error);

    return res.status(500).json({
      message: "Failed to load bids",
    });
  }
};

export const awardBid = async (req: Request, res: Response) => {
  const user = (req as any).user;

  if (user.role !== "ADMIN") {
    return res.status(403).json({
      message: "Only admin can award bids",
    });
  }

  try {
    const tenderId = Array.isArray(req.params.tenderId)
      ? req.params.tenderId[0]
      : req.params.tenderId;

    const bidId = Array.isArray(req.params.bidId)
      ? req.params.bidId[0]
      : req.params.bidId;

    if (!tenderId || !bidId) {
      return res.status(400).json({
        message: "tenderId and bidId are required",
      });
    }

    const bid = await prisma.bid.findUnique({
      where: {
        id: bidId,
      },
    });

    if (!bid) {
      return res.status(404).json({
        message: "Bid not found",
      });
    }

    await prisma.$transaction(async (tx) => {
      await tx.bid.update({
        where: {
          id: bidId,
        },
        data: {
          status: "AWARDED",
        },
      });

      await tx.tender.update({
        where: {
          id: tenderId,
        },
        data: {
          status: "AWARDED",
          awardedVendorId: bid.vendorId,
        },
      });

      await tx.tenderRound.updateMany({
        where: {
          tenderId,
        },
        data: {
          status: "CLOSED",
        },
      });

      await tx.supportThread.updateMany({
        where: {
          tenderId,
        },
        data: {
          status: "CLOSED",
        },
      });
    });

    return res.json({
      message: "Vendor awarded successfully",
    });
  } catch (error) {
    console.error("awardBid error:", error);

    return res.status(500).json({
      message: "Failed to award bid",
    });
  }
};

export const getAdminWorkspaces = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admin can access workspaces",
      });
    }

    const workspaces = await prisma.supportThread.findMany({
      include: {
        tender: true,
        vendor: true,
      },
      orderBy: {
        id: "desc",
      },
    });

    return res.json({
      success: true,
      data: workspaces.map((workspace) => ({
        workspaceId: workspace.id,

        tenderId: workspace.tenderId,
        tenderTitle: workspace.tender?.title,

        vendorId: workspace.vendorId,
        vendorName: workspace.vendor?.companyName,

        status: workspace.status,
      })),
    });
  } catch (error) {
    console.error("getAdminWorkspaces error:", error);

    return res.status(500).json({
      message: "Failed to load workspaces",
    });
  }
};
