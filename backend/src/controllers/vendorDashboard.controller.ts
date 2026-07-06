import { Request, Response } from "express";
import { prisma } from "../configs/db";

export const getMe = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const vendor = await prisma.vendor.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        user: {
          select: {
            vendorStatus: true,
          },
        },
      },
    });

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    return res.json(vendor);
  } catch (error) {
    console.error("getMe error:", error);

    return res.status(500).json({
      message: "Failed to load vendor profile",
    });
  }
};

export const getVendorTenders = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const vendor = await prisma.vendor.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
      },
    });

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    const tenders = await prisma.tender.findMany({
      where: {
        status: "BROADCASTED",

        bids: {
          none: {
            vendorId: vendor.id,
          },
        },
      },
      include: {
        rounds: {
          where: {
            status: "OPEN",
          },
          orderBy: {
            roundNumber: "desc",
          },
          take: 1,
        },
        bids: {
          where: {
            vendorId: vendor.id,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const marketplace = tenders.map((tender) => {
  
      const isEligible =
        vendor.user.vendorStatus === "ACTIVE" &&
        vendor.mainCategory?.toLowerCase() ===
          tender.mainCategory?.toLowerCase();

      return {
        id: tender.id,
        tenderNumber: tender.tenderNumber,
        title: tender.title,
        description: tender.description,
        mainCategory: tender.mainCategory,
        status: tender.status,
        deadline: tender.deadline,
        createdAt: tender.createdAt,

        isEligible,

        currentRound: tender.rounds[0]?.roundNumber ?? 1,
      };
    });
    return res.json({
      data: marketplace,
    });
  } catch (error) {
    console.error("getVendorTenders error:", error);

    return res.status(500).json({
      message: "Failed to load marketplace",
    });
  }
};

export const getVendorTenderById = async (req: Request, res: Response) => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id) {
      return res.status(400).json({
        message: "Tender id is required",
      });
    }

    const tender = await prisma.tender.findFirst({
      where: {
        id,
        status: "BROADCASTED",
      },
    });

    if (!tender) {
      return res.status(404).json({
        message: "Tender not found",
      });
    }

    const user = (req as any).user;

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

    const currentRound = await prisma.tenderRound.findFirst({
      where: {
        tenderId: tender.id,
      },
      orderBy: {
        roundNumber: "desc",
      },
    });

    const myBids = await prisma.bid.findMany({
      where: {
        tenderId: tender.id,
        vendorId: vendor.id,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    const workspace = await prisma.supportThread.findUnique({
      where: {
        tenderId_vendorId: {
          tenderId: tender.id,
          vendorId: vendor.id,
        },
      },
    });

    const allTenderBids = await prisma.bid.findMany({
      where: {
        tenderId: tender.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const latestBidPerVendor = new Map();

    for (const bid of allTenderBids) {
      if (!latestBidPerVendor.has(bid.vendorId)) {
        latestBidPerVendor.set(bid.vendorId, bid);
      }
    }

    const rankedBids = Array.from(latestBidPerVendor.values()).sort(
      (a, b) => a.amount - b.amount,
    );

    const myRankIndex = rankedBids.findIndex(
      (bid) => bid.vendorId === vendor.id,
    );

    const myPosition = myRankIndex >= 0 ? `L${myRankIndex + 1}` : null;

    return res.json({
      tender,
      currentRound,
      myBidCount: myBids.length,
      myPosition,
      workspace: workspace
        ? {
            id: workspace.id,
            hasWorkspace: true,
          }
        : {
            hasWorkspace: false,
          },
      myBids,
    });
  } catch (error) {
    console.error("getVendorTenderById error:", error);

    return res.status(500).json({
      message: "Failed to load tender",
    });
  }
};

export const submitBid = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const { tenderId, amount, proposal } = req.body;

    if (!tenderId || !amount) {
      return res.status(400).json({
        message: "tenderId and amount are required",
      });
    }

    const vendor = await prisma.vendor.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        user: true,
      },
    });

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    const tender = await prisma.tender.findUnique({
      where: {
        id: tenderId,
      },
    });

    if (!tender) {
      return res.status(404).json({
        message: "Tender not found",
      });
    }

    const isEligible =
      vendor.user.vendorStatus === "ACTIVE" &&
      vendor.mainCategory?.toLowerCase() === tender.mainCategory?.toLowerCase();

      console.log("Vendor category:", vendor.mainCategory);
console.log("Tender category:", tender.mainCategory);

    if (!isEligible) {
      return res.status(403).json({
        message: "You are not eligible to bid on this tender",
      });
    }

    if (tender.status !== "BROADCASTED") {
      return res.status(400).json({
        message: "Tender is not open for bidding",
      });
    }

    const openRound = await prisma.tenderRound.findFirst({
      where: {
        tenderId,
        status: "OPEN",
      },
      orderBy: {
        roundNumber: "desc",
      },
    });

    if (!openRound) {
      return res.status(400).json({
        message: "No active bidding round found",
      });
    }

    const participant = await prisma.roundParticipant.findUnique({
      where: {
        roundId_vendorId: {
          roundId: openRound.id,
          vendorId: vendor.id,
        },
      },
    });

    if (!participant) {
      return res.status(403).json({
        message: "You are not allowed to bid in this round",
      });
    }

    const existingThread = await prisma.supportThread.findUnique({
      where: {
        tenderId_vendorId: {
          tenderId,
          vendorId: vendor.id,
        },
      },
    });

    if (!existingThread) {
      await prisma.supportThread.create({
        data: {
          tenderId,
          vendorId: vendor.id,
          createdBy: user.id,
        },
      });
    }

    const bid = await prisma.bid.create({
      data: {
        tenderId,
        roundId: openRound.id,
        vendorId: vendor.id,
        amount: Number(amount),
        proposal,
      },
    });

    return res.json(bid);
  } catch (error) {
    console.error("submitBid error:", error);

    return res.status(500).json({
      message: "Failed to submit bid",
    });
  }
};

export const getVendorBids = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

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

    const bids = await prisma.bid.findMany({
      where: {
        vendorId: vendor.id,
      },
      include: {
        tender: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(bids);
  } catch (error) {
    console.error("getVendorBids error:", error);

    return res.status(500).json({
      message: "Failed to load bids",
    });
  }
};

export const getMyTenders = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

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

    const bids = await prisma.bid.findMany({
      where: {
        vendorId: vendor.id,
      },
      include: {
        tender: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const uniqueTenderIds = [...new Set(bids.map((bid) => bid.tenderId))];

    const myTenders = [];

    for (const tenderId of uniqueTenderIds) {
      const tender = await prisma.tender.findUnique({
        where: {
          id: tenderId,
        },
      });

      const thread = await prisma.supportThread.findFirst({
        where: {
          tenderId,
          vendorId: vendor.id,
        },
      });

      if (!tender) {
        continue;
      }

      const currentRound = await prisma.tenderRound.findFirst({
        where: {
          tenderId,
        },
        orderBy: {
          roundNumber: "desc",
        },
      });

      const myBids = await prisma.bid.findMany({
        where: {
          tenderId,
          vendorId: vendor.id,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      const allTenderBids = await prisma.bid.findMany({
        where: {
          tenderId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const latestBidPerVendor = new Map();

      for (const bid of allTenderBids) {
        if (!latestBidPerVendor.has(bid.vendorId)) {
          latestBidPerVendor.set(bid.vendorId, bid);
        }
      }

      const rankedBids = Array.from(latestBidPerVendor.values()).sort(
        (a, b) => a.amount - b.amount,
      );

      const myRankIndex = rankedBids.findIndex(
        (bid) => bid.vendorId === vendor.id,
      );

      const myPosition = myRankIndex >= 0 ? `L${myRankIndex + 1}` : null;

      let vendorStatus = "Closed";
      let canSubmitBid = false;
      if (tender.status === "AWARDED") {
        vendorStatus = "Awarded";
      } else if (currentRound?.status === "OPEN") {
        canSubmitBid = true;

        vendorStatus =
          (currentRound.roundNumber ?? 1) > 1
            ? "Open for Re-bidding"
            : "Open for Bidding";
      }

      myTenders.push({
        id: tender.id,
        tenderNumber: tender.tenderNumber,
        title: tender.title,
        description: tender.description,
        mainCategory: tender.mainCategory,
        deadline: tender.deadline,
        status: tender.status,
        vendorStatus,
        canSubmitBid,
        currentRoundStatus: currentRound?.status ?? "CLOSED",
        currentRound: currentRound?.roundNumber ?? 1,
        myPosition,
        myBidCount: myBids.length,
        myLatestBid: myBids.length > 0 ? myBids[myBids.length - 1] : null,
        bidHistory: myBids,
        threadId: thread?.id ?? null,
      });
    }

    return res.json({
      success: true,
      data: myTenders,
    });
  } catch (error) {
    console.error("getMyTenders error:", error);

    return res.status(500).json({
      message: "Failed to load my tenders",
    });
  }
};

export const getMyWorkspaces = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

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

    const workspaces = await prisma.supportThread.findMany({
      where: {
        vendorId: vendor.id,
      },
      include: {
        tender: true,
      },
    });

    return res.json({
      success: true,
      data: workspaces.map((workspace) => ({
        workspaceId: workspace.id,
        tenderId: workspace.tenderId,
        title: workspace.tender?.title,
        status: workspace.status,
      })),
    });
  } catch (error) {
    console.error("getMyWorkspaces error:", error);

    return res.status(500).json({
      message: "Failed to load workspaces",
    });
  }
};

export const getVendorConsultations = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

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

    const consultations = await prisma.lead.findMany({
      where: {
        vendorId: vendor.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json({
      success: true,
      data: consultations,
    });
  } catch (error) {
    console.error("getVendorConsultations error:", error);

    return res.status(500).json({
      message: "Failed to load consultations",
    });
  }
};

export const updateConsultationStatus = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    const { status } = req.body;

    const allowedStatuses = [
      "ACKNOWLEDGED",
      "DOCUMENTS_REQUESTED",
      "IN_PROGRESS",
      "COMPLETED",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

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

    const lead = await prisma.lead.findFirst({
      where: {
        id,
        vendorId: vendor.id,
      },
    });

    if (!lead) {
      return res.status(404).json({
        message: "Consultation not found",
      });
    }

    const updatedLead = await prisma.lead.update({
      where: {
        id,
      },
      data: {
        status,
      },
    });

    return res.json({
      success: true,
      data: updatedLead,
    });
  } catch (error) {
    console.error("updateConsultationStatus error:", error);

    return res.status(500).json({
      message: "Failed to update status",
    });
  }
};

export const submitVerification = async (req: Request, res: Response) => {
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

    const requiredDocuments = [
      "COMPANY_REGISTRATION",
      "TAX_REGISTRATION",
      "SIGNATORY_ID",
      "ADDRESS_PROOF",
      "BANK_VERIFICATION",
    ];

    const documents = await prisma.vendorDocument.findMany({
      where: {
        vendorId: vendor.id,
      },
    });

    const uploadedTypes = documents.map((doc) => doc.documentType);

    const missingDocuments = requiredDocuments.filter(
      (type) => !uploadedTypes.includes(type as any),
    );

    if (missingDocuments.length > 0) {
      return res.status(400).json({
        message: "Please upload all required documents.",
        missingDocuments,
      });
    }

    if (vendor.verificationStatus === "PENDING_REVIEW") {
      return res.status(400).json({
        message: "Verification is already under review.",
      });
    }

    if (vendor.verificationStatus === "APPROVED") {
      return res.status(400).json({
        message: "Vendor is already verified.",
      });
    }

    await prisma.vendor.update({
      where: {
        id: vendor.id,
      },
      data: {
        verificationStatus: "PENDING_REVIEW",
        verificationSubmittedAt: new Date(),
        verificationReviewedAt: null,
        verificationReviewedBy: null,
        verificationRemarks: null,
      },
    });

    return res.json({
      message: "Verification submitted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to submit verification",
    });
  }
};
