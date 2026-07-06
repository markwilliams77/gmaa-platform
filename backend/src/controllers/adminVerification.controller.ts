import { Request, Response } from "express";
import { prisma } from "../configs/db";

export const getPendingVerifications = async (req: Request, res: Response) => {
  try {
    const vendors = await prisma.vendor.findMany({
      where: {
        verificationStatus: "PENDING_REVIEW",
      },
      select: {
        id: true,
        vendorNumber: true,
        companyName: true,
        image: true,
        mainCategory: true,
        country: true,
        state: true,
        city: true,
        verificationStatus: true,
        verificationSubmittedAt: true,
        user: {
          select: {
            email: true,
          },
        },
      },
    });

    return res.json({
      data: vendors,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to load pending verifications",
    });
  }
};

export const getVerificationDetails = async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.vendorId as string;

    const vendor = await prisma.vendor.findUnique({
      where: {
        id: vendorId,
      },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        documents: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    return res.json({
      data: vendor,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to load verification details",
    });
  }
};

export const rejectVerification = async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.vendorId as string;

    const { remarks } = req.body;

    const admin = (req as any).user;

    if (!remarks || !remarks.trim()) {
      return res.status(400).json({
        message: "Remarks are required.",
      });
    }

    const vendor = await prisma.vendor.findUnique({
      where: {
        id: vendorId,
      },
    });

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found.",
      });
    }

    if (vendor.verificationStatus !== "PENDING_REVIEW") {
      return res.status(400).json({
        message: "Vendor is not awaiting verification review.",
      });
    }

    await prisma.$transaction([
      prisma.vendor.update({
        where: {
          id: vendorId,
        },
        data: {
          verificationStatus: "REJECTED",
          verificationReviewedAt: new Date(),
          verificationReviewedBy: admin.id,
          verificationRemarks: remarks.trim(),
        },
      }),

      prisma.user.update({
        where: {
          id: vendor.userId,
        },
        data: {
          vendorStatus: "UNDER_REVIEW",
        },
      }),
    ]);

    return res.json({
      message: "Vendor verification rejected successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to reject verification",
    });
  }
};

export const approveVerification = async (req: Request, res: Response) => {
  try {
    const vendorId = req.params.vendorId as string;

    const { remarks } = req.body;

    const admin = (req as any).user;

    const vendor = await prisma.vendor.findUnique({
      where: {
        id: vendorId,
      },
    });

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found.",
      });
    }

    if (vendor.verificationStatus !== "PENDING_REVIEW") {
      return res.status(400).json({
        message: "Vendor is not awaiting verification review.",
      });
    }

    await prisma.$transaction([
      prisma.vendor.update({
        where: {
          id: vendorId,
        },
        data: {
          verificationStatus: "APPROVED",
          verificationReviewedAt: new Date(),
          verificationReviewedBy: admin.id,
          verificationRemarks: remarks?.trim() || null,
        },
      }),

      prisma.user.update({
        where: {
          id: vendor.userId,
        },
        data: {
          vendorStatus: "ACTIVE",
        },
      }),
    ]);

    return res.json({
      message: "Vendor verification approved successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to approve verification",
    });
  }
};

export const getVerificationStats = async (req: Request, res: Response) => {
  try {
    const [pending, approved, rejected, total] = await Promise.all([
      prisma.vendor.count({
        where: {
          verificationStatus: "PENDING_REVIEW",
        },
      }),

      prisma.vendor.count({
        where: {
          verificationStatus: "APPROVED",
        },
      }),

      prisma.vendor.count({
        where: {
          verificationStatus: "REJECTED",
        },
      }),

      prisma.vendor.count(),
    ]);

    return res.json({
      pending,
      approved,
      rejected,
      total,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to load verification statistics",
    });
  }
};
