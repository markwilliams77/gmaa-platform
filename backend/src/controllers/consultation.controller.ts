import { Request, Response } from "express";
import { prisma } from "../configs/db";
import { createLeadActivity } from "../services/activity.service";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

countries.registerLocale(en);

export const createConsultation = async (req: Request, res: Response) => {
  try {
    const {
      name,
      email,
      phone,

      category,

      service,
      country,
      state,
      city,

      vendorId,
      vendorName,

      details,
    } = req.body;

    const parsedPhone = phone ? parsePhoneNumberFromString(phone) : undefined;

    const detectedCountryCode = parsedPhone?.country;

    const detectedCountry = detectedCountryCode
      ? countries.getName(detectedCountryCode, "en")
      : country;

    if (!name || !email) {
      return res.status(400).json({
        message: "name and email are required",
      });
    }

    const consultation = await prisma.consultation.create({
      data: {
        name,
        email,
        phone,

        category,

        service,
        country: country || detectedCountry || "",
        state: state ?? "",
        city: city ?? "",

        vendorId,
        vendorName,

        details,
      },
    });

    return res.status(201).json(consultation);
  } catch (error) {
    console.error("createConsultation error:", error);

    return res.status(500).json({
      message: "Failed to create consultation",
    });
  }
};

export const getConsultations = async (req: Request, res: Response) => {
  try {
    const consultations = await prisma.consultation.findMany({
      include: {
        notes: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return res.json(consultations);
  } catch (error) {
    console.error("getConsultations error:", error);

    return res.status(500).json({
      message: "Failed to fetch consultations",
    });
  }
};

export const updateConsultation = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);

    const existing = await prisma.consultation.findUnique({
      where: { id },
    });

    if (existing?.status === "CONVERTED") {
      return res.status(400).json({
        message: "Converted consultations cannot be modified",
      });
    }

    const { status, note, createdBy = "Admin" } = req.body;

    const result = await prisma.$transaction(async (tx) => {
      const consultation = await tx.consultation.update({
        where: { id },
        data: {
          status,
        },
      });

      if (note?.trim()) {
        await tx.consultationNote.create({
          data: {
            consultationId: id,
            note,
            createdBy,
          },
        });
      }

      return consultation;
    });

    return res.json(result);
  } catch (error) {
    console.error("updateConsultation error:", error);

    return res.status(500).json({
      message: "Failed to update consultation",
    });
  }
};

export const convertConsultationToLead = async (
  req: Request,
  res: Response,
) => {
  try {
    const id = String(req.params.id);

    const consultation = await prisma.consultation.findUnique({
      where: { id },
    });

    if (!consultation) {
      return res.status(404).json({
        message: "Consultation not found",
      });
    }

    if (consultation.status === "CONVERTED") {
      return res.status(400).json({
        message: "Consultation already converted",
      });
    }

    const year = new Date().getFullYear();

    const leadCount = await prisma.lead.count();

    const leadNumber = `GMAA-${year}-${String(leadCount + 1).padStart(4, "0")}`;

    const lead = await prisma.lead.create({
      data: {
        leadNumber,
        name: consultation.name || "Unknown",
        email: consultation.email,
        patientPhone: consultation.phone || null,
        serviceCategory: consultation.service || "Not Specified",
        country: consultation.country || "N/A",
        city: consultation.city || "N/A",
        source: "HOMEPAGE_ENQUIRY",
        leadType: "DIRECT",
        routingType: "DIRECT",
      },
    });

    await createLeadActivity({
      leadId: lead.id,
      activity: "LEAD_CREATED",
      description: `Lead ${lead.leadNumber} created from consultation`,
      createdBy: "SYSTEM",
    });

    await prisma.consultation.update({
      where: { id },
      data: {
        status: "CONVERTED",
      },
    });

    return res.status(201).json({
      success: true,
      lead,
    });
  } catch (error) {
    //console.error("convertConsultationToLead error:", error);
    console.error("🔥 CONVERT LEAD ERROR FULL:", error);
    console.error("🔥 STACK:", (error as any)?.stack);

    return res.status(500).json({
      message: "Failed to convert consultation",
      error: (error as any)?.message,
    });
    //return res.status(500).json({
    //message: "Failed to convert consultation",
    //});
  }
};
