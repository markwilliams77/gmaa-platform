import { Request, Response } from "express";
import { prisma } from "../configs/db";
import { createLeadActivity } from "../services/activity.service";

export const createLead = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      patientPhone,
      title,
      description,
      serviceCategory,
      country,
      city,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        message: "name and email are required",
      });
    }

    const year = new Date().getFullYear();

    const leadCount = await prisma.lead.count();

    const leadNumber = `GMAA-${year}-${String(
      leadCount + 1
    ).padStart(4, "0")}`;

    const lead = await prisma.lead.create({
      data: {
        leadNumber,
        name,
        email,
        patientPhone,
        title,
        description,
        serviceCategory,
        country,
        city,
      },
    });

    await createLeadActivity({
      leadId: lead.id,
      activity: "LEAD_CREATED",
      description: `Lead ${lead.leadNumber} created`,
      createdBy: "SYSTEM" ,
    });

console.log("Default folders created for lead:", lead.id);

    return res.status(201).json(lead);
  } catch (error) {
    console.error("createLead error:", error);

    return res.status(500).json({
      message: "Failed to create lead",
    });
  }
};

export const getLeads = async (_req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(leads);
  } catch (error) {
    console.error("getLeads error:", error);

    return res.status(500).json({
      message: "Failed to fetch leads",
    });
  }
};

export const getLeadById = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const lead = await prisma.lead.findUnique({
      where: { id, },
      include: {
        activities: {
          orderBy: {
            createdAt: "desc",
          },
        },
        notes: {
          orderBy: { createdAt: "desc",
          },
        },
      }
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    return res.json(lead);
  } catch (error) {
    console.error("getLeadById error:", error);

    return res.status(500).json({
      message: "Failed to fetch lead",
    });
  }
};

export const updateLeadRouting = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const { routingType } = req.body;

    if (
      routingType !== "DIRECT" &&
      routingType !== "TENDER"
    ) {
      return res.status(400).json({
        message: "routingType must be DIRECT or TENDER",
      });
    }

    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    if (lead.routingType === routingType) {
      return res.json(lead);
    }

    const updatedLead = await prisma.lead.update({
      where: { id },
      data: {
        routingType,
      },
    });

    await createLeadActivity({
        leadId: id,
        activity: "ROUTING_UPDATED",
        description: `Routing changed to ${routingType}`,
        createdBy: "SYSTEM",
    });

    return res.json(updatedLead);
  } catch (error) {
    console.error("updateLeadRouting error:", error);

    return res.status(500).json({
      message: "Failed to update routing",
    });
  }
};

export const assignVendorToLead = async (
  req: Request,
  res: Response
) => {
  try {
    const id = String(req.params.id);

    const { vendorId } = req.body;

    if (!vendorId) {
      return res.status(400).json({
        message: "vendorId is required",
      });
    }

    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return res.status(404).json({
        message: "Lead not found",
      });
    }

    if (lead.routingType !== "DIRECT") {
      return res.status(400).json({
        message:
          "Vendor assignment only allowed for DIRECT leads",
      });
    }

    const vendor = await prisma.vendor.findUnique({
      where: {
        id: vendorId,
      },
    });

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found",
      });
    }

    const updatedLead = await prisma.lead.update({
  where: { id },
  data: {
    selectedVendorId: vendor.id,
    vendorId: vendor.id,
    vendorName: vendor.companyName,
  },
});

    await createLeadActivity({
        leadId: id,
        activity: "VENDOR_ASSIGNED",
        description: `Vendor assigned: ${vendor.companyName}`,
        createdBy: "SYSTEM",
    });
    
    return res.json(updatedLead);
  } catch (error) {
    console.error("assignVendorToLead error:", error);

    return res.status(500).json({
      message: "Failed to assign vendor",
    });
  }
};