import { Request, Response } from "express";
import { prisma } from "../configs/db";

export const getAdminStats = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (user.role !== "ADMIN") {
      return res.status(403).json({
        message: "Only admin can access stats",
      });
    }

    const [
      vendors,
      approvedVendors,
      tenders,
      activeTenders,
      awardedTenders,
      bids,
    ] = await Promise.all([
      prisma.vendor.count(),
      prisma.vendor.count({
        where: {
          user: {
            vendorStatus: "ACTIVE",
          },
        },
      }),
      prisma.tender.count(),
      prisma.tender.count({
        where: {
          status: "BROADCASTED",
        },
      }),
      prisma.tender.count({
        where: {
          status: "AWARDED",
        },
      }),
      prisma.bid.count(),
    ]);

    return res.json({
      vendors,
      approvedVendors,
      tenders,
      activeTenders,
      awardedTenders,
      bids,
    });
  } catch (error) {
    console.error("getAdminStats error:", error);

    return res.status(500).json({
      message: "Failed to load dashboard stats",
    });
  }
};
