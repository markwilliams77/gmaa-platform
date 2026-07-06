import { Request, Response } from "express";
import { prisma } from "../../configs/db";

const DEFAULT_VENDOR_IMAGE = "https://via.placeholder.com/800";

const isStatsRecord = (value: unknown): value is Record<string, string> => {
  return (
    Boolean(value) &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    Object.values(value as Record<string, unknown>).every(
      (item) => typeof item === "string",
    )
  );
};

export const getVendorDetails = async (req: Request, res: Response) => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

  if (!id) {
    return res.status(400).json({ message: "Vendor id is required" });
  }

  try {
    const vendor = await prisma.vendor.findUnique({
      where: { id },
      include: {
        user: true,
        websiteProfile: true,
        websiteServices: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        websiteAccreditations: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        websiteGallery: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        websiteTestimonials: {
          orderBy: {
            sortOrder: "asc",
          },
        },
      },
    });

    if (
      !vendor ||
      vendor.verificationStatus !== "APPROVED" ||
      vendor.user.vendorStatus !== "ACTIVE"
    ) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const primaryService =
      vendor.websiteServices[0]?.name ?? "Healthcare Provider";

    res.json({
      id: vendor.id,
      name: vendor.companyName,
      location: `${vendor.city}, ${vendor.country}`,
      country: vendor.country,
      state: vendor.state,
      city: vendor.city,

      mainCategory: vendor.mainCategory ?? primaryService,

      specialty: vendor.specialty ?? primaryService,

      rating: vendor.rating,

      image:
        vendor.websiteProfile?.coverImage ??
        vendor.image ??
        DEFAULT_VENDOR_IMAGE,

      profileHeadline: vendor.websiteProfile?.profileHeadline,

      description: vendor.websiteProfile?.description ?? "",

      fullServices: vendor.websiteServices.map((service) => service.name),

      accreditation: vendor.websiteAccreditations.map((item) => item.title),

      gallery: vendor.websiteGallery,

      testimonials: vendor.websiteTestimonials,

      stats: isStatsRecord(vendor.websiteProfile?.highlights)
        ? vendor.websiteProfile.highlights
        : {},

      staffCount: vendor.staffCount,

      hasConcierge: vendor.websiteProfile?.hasConcierge ?? false,
    });
  } catch (error) {
    console.error("Failed to fetch vendor details:", error);
    res.status(500).json({ message: "Failed to fetch vendor details" });
  }
};
