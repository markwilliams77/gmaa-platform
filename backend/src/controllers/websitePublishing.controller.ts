import { Request, Response } from "express";
import { prisma } from "../configs/db";

export const getWebsitePublishingVendors = async (
  req: Request,
  res: Response,
) => {
  try {
    const vendors = await prisma.vendor.findMany({
      orderBy: {
        companyName: "asc",
      },
      include: {
        websiteProfile: true,
      },
    });

    const data = vendors.map((vendor) => ({
      id: vendor.id,
      vendorNumber: vendor.vendorNumber,
      companyName: vendor.companyName,
      category: vendor.mainCategory,
      specialty: vendor.specialty,
      country: vendor.country,
      state: vendor.state,
      city: vendor.city,
      location: `${vendor.city}, ${vendor.country}`,
      verificationStatus: vendor.verificationStatus,

      websiteStatus: vendor.websiteProfile?.status ?? "DRAFT",
      featured: vendor.websiteProfile?.featured ?? false,
      publishedAt: vendor.websiteProfile?.publishedAt ?? null,
    }));

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error loading website publishing vendors:", error);

    return res.status(500).json({
      message: "Failed to load vendors.",
    });
  }
};

export const getWebsiteProfile = async (req: Request, res: Response) => {
  try {
    const vendorId = Array.isArray(req.params.vendorId)
      ? req.params.vendorId[0]
      : req.params.vendorId;

    const vendor = await prisma.vendor.findUnique({
      where: {
        id: vendorId,
      },
      include: {
        websiteProfile: true,
      },
    });

    if (!vendor) {
      return res.status(404).json({
        message: "Vendor not found.",
      });
    }

    let profile = vendor.websiteProfile;

    if (!profile) {
      profile = await prisma.websiteProfile.create({
        data: {
          vendorId: vendor.id,
        },
      });
    }

    return res.status(200).json({
      ...profile,

      vendor: {
        id: vendor.id,
        companyName: vendor.companyName,
        mainCategory: vendor.mainCategory,
        specialty: vendor.specialty,
        country: vendor.country,
        state: vendor.state,
        city: vendor.city,
        location: `${vendor.city}, ${vendor.country}`,
      },
    });
  } catch (error) {
    console.error("Error loading website profile:", error);

    return res.status(500).json({
      message: "Failed to load website profile.",
    });
  }
};

export const updateWebsiteProfile = async (req: Request, res: Response) => {
  try {
    const vendorId = Array.isArray(req.params.vendorId)
      ? req.params.vendorId[0]
      : req.params.vendorId;

    const existingProfile = await prisma.websiteProfile.findUnique({
      where: {
        vendorId,
      },
    });

    if (!existingProfile) {
      return res.status(404).json({
        message: "Website profile not found.",
      });
    }

    const allowedTransitions: Record<string, string[]> = {
      DRAFT: ["READY_FOR_REVIEW", "PUBLISHED"],
      READY_FOR_REVIEW: ["DRAFT", "PUBLISHED", "ARCHIVED"],
      PUBLISHED: ["DRAFT", "ARCHIVED"],
      ARCHIVED: ["DRAFT"],
    };

    const {
      profileHeadline,
      description,
      profileTemplate,
      coverImage,
      brochureUrl,
      highlights,
      hasConcierge,
      featured,
      displayOrder,
      status,
      seoTitle,
      seoDescription,
    } = req.body;

    if (existingProfile && status && existingProfile.status !== status) {
      const allowed = allowedTransitions[existingProfile.status] ?? [];

      if (!allowed.includes(status)) {
        return res.status(400).json({
          message: `Invalid status transition from ${existingProfile.status} to ${status}.`,
        });
      }
    }

    let publishData: Record<string, any> = {};

    if (
      existingProfile &&
      status === "PUBLISHED" &&
      existingProfile.status !== "PUBLISHED"
    ) {
      publishData = {
        publishedAt: new Date(),
        publishedById: (req as any).user.id,
      };
    }

    if (
      existingProfile &&
      existingProfile.status === "PUBLISHED" &&
      status !== "PUBLISHED"
    ) {
      publishData = {
        publishedAt: null,
        publishedById: null,
      };
    }

    const profile = await prisma.websiteProfile.update({
      where: {
        vendorId,
      },
      data: {
        profileHeadline,
        description,
        profileTemplate,
        coverImage,
        brochureUrl,
        highlights,
        hasConcierge,
        featured,
        displayOrder,
        status,
        seoTitle,
        seoDescription,

        ...publishData,
      },
    });

    return res.status(200).json(profile);
  } catch (error) {
    console.error("Error updating website profile:", error);

    return res.status(500).json({
      message: "Failed to update website profile.",
    });
  }
};

export const getWebsiteServices = async (req: Request, res: Response) => {
  try {
    const vendorId = Array.isArray(req.params.vendorId)
      ? req.params.vendorId[0]
      : req.params.vendorId;

    const services = await prisma.websiteService.findMany({
      where: { vendorId },
      orderBy: {
        sortOrder: "asc",
      },
    });

    return res.status(200).json(services);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to load services.",
    });
  }
};

export const createWebsiteService = async (req: Request, res: Response) => {
  try {
    const vendorId = Array.isArray(req.params.vendorId)
      ? req.params.vendorId[0]
      : req.params.vendorId;

    const name = req.body.name?.trim();

    if (!name) {
      return res.status(400).json({
        message: "Service name is required.",
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        message: "Service name cannot exceed 100 characters.",
      });
    }

    const duplicate = await prisma.websiteService.findFirst({
      where: {
        vendorId,
        name: {
          equals: name,
          mode: "insensitive",
        },
      },
    });

    if (duplicate) {
      return res.status(409).json({
        message: "Service already exists.",
      });
    }

    const count = await prisma.websiteService.count({
      where: { vendorId },
    });

    const service = await prisma.websiteService.create({
      data: {
        vendorId,
        name,
        sortOrder: count + 1,
      },
    });

    return res.status(201).json(service);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create service.",
    });
  }
};

export const updateWebsiteService = async (req: Request, res: Response) => {
  try {
    const serviceId = Array.isArray(req.params.serviceId)
      ? req.params.serviceId[0]
      : req.params.serviceId;

    const { name, sortOrder } = req.body;

    const trimmedName = name?.trim();

    if (!trimmedName) {
      return res.status(400).json({
        message: "Service name is required.",
      });
    }

    const existing = await prisma.websiteService.findUnique({
      where: {
        id: serviceId,
      },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Service not found.",
      });
    }

    const duplicate = await prisma.websiteService.findFirst({
      where: {
        vendorId: existing.vendorId,
        id: {
          not: serviceId,
        },
        name: {
          equals: trimmedName,
          mode: "insensitive",
        },
      },
    });

    if (duplicate) {
      return res.status(409).json({
        message: "Service already exists.",
      });
    }

    const service = await prisma.websiteService.update({
      where: {
        id: serviceId,
      },
      data: {
        name: trimmedName,
        sortOrder,
      },
    });

    return res.status(200).json(service);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update service.",
    });
  }
};

export const deleteWebsiteService = async (req: Request, res: Response) => {
  try {
    const serviceId = Array.isArray(req.params.serviceId)
      ? req.params.serviceId[0]
      : req.params.serviceId;

    await prisma.websiteService.delete({
      where: {
        id: serviceId,
      },
    });

    return res.status(200).json({
      message: "Service deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete service.",
    });
  }
};

export const getWebsiteGallery = async (req: Request, res: Response) => {
  try {
    const vendorId = Array.isArray(req.params.vendorId)
      ? req.params.vendorId[0]
      : req.params.vendorId;

    const gallery = await prisma.websiteGallery.findMany({
      where: {
        vendorId,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    return res.status(200).json(gallery);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to load gallery.",
    });
  }
};

export const createWebsiteGalleryImage = async (
  req: Request,
  res: Response,
) => {
  try {
    const vendorId = Array.isArray(req.params.vendorId)
      ? req.params.vendorId[0]
      : req.params.vendorId;

    const imageUrl = req.body.imageUrl?.trim();
    const caption = req.body.caption?.trim() || null;

    if (!imageUrl) {
      return res.status(400).json({
        message: "Image URL is required.",
      });
    }

    const count = await prisma.websiteGallery.count({
      where: {
        vendorId,
      },
    });

    const image = await prisma.websiteGallery.create({
      data: {
        vendorId,
        imageUrl,
        caption,
        sortOrder: count + 1,
      },
    });

    return res.status(201).json(image);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create gallery image.",
    });
  }
};

export const updateWebsiteGalleryImage = async (
  req: Request,
  res: Response,
) => {
  try {
    const galleryId = Array.isArray(req.params.galleryId)
      ? req.params.galleryId[0]
      : req.params.galleryId;

    const existing = await prisma.websiteGallery.findUnique({
      where: {
        id: galleryId,
      },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Gallery image not found.",
      });
    }

    const image = await prisma.websiteGallery.update({
      where: {
        id: galleryId,
      },
      data: {
        imageUrl: req.body.imageUrl?.trim(),
        caption: req.body.caption?.trim() || null,
        sortOrder: req.body.sortOrder,
      },
    });

    return res.status(200).json(image);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update gallery image.",
    });
  }
};

export const deleteWebsiteGalleryImage = async (
  req: Request,
  res: Response,
) => {
  try {
    const galleryId = Array.isArray(req.params.galleryId)
      ? req.params.galleryId[0]
      : req.params.galleryId;

    await prisma.websiteGallery.delete({
      where: {
        id: galleryId,
      },
    });

    return res.status(200).json({
      message: "Gallery image deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete gallery image.",
    });
  }
};

export const getWebsiteAccreditations = async (req: Request, res: Response) => {
  try {
    const vendorId = Array.isArray(req.params.vendorId)
      ? req.params.vendorId[0]
      : req.params.vendorId;

    const accreditations = await prisma.websiteAccreditation.findMany({
      where: {
        vendorId,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    return res.status(200).json(accreditations);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to load accreditations.",
    });
  }
};

export const createWebsiteAccreditation = async (
  req: Request,
  res: Response,
) => {
  try {
    const vendorId = Array.isArray(req.params.vendorId)
      ? req.params.vendorId[0]
      : req.params.vendorId;

    const title = req.body.title?.trim();
    const imageUrl = req.body.imageUrl?.trim() || null;

    if (!title) {
      return res.status(400).json({
        message: "Title is required.",
      });
    }

    if (title.length > 100) {
      return res.status(400).json({
        message: "Title cannot exceed 100 characters.",
      });
    }

    const duplicate = await prisma.websiteAccreditation.findFirst({
      where: {
        vendorId,
        title: {
          equals: title,
          mode: "insensitive",
        },
      },
    });

    if (duplicate) {
      return res.status(409).json({
        message: "Accreditation already exists.",
      });
    }

    const count = await prisma.websiteAccreditation.count({
      where: {
        vendorId,
      },
    });

    const accreditation = await prisma.websiteAccreditation.create({
      data: {
        vendorId,
        title,
        imageUrl,
        sortOrder: count + 1,
      },
    });

    return res.status(201).json(accreditation);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create accreditation.",
    });
  }
};

export const updateWebsiteAccreditation = async (
  req: Request,
  res: Response,
) => {
  try {
    const accreditationId = Array.isArray(req.params.accreditationId)
      ? req.params.accreditationId[0]
      : req.params.accreditationId;

    const existing = await prisma.websiteAccreditation.findUnique({
      where: {
        id: accreditationId,
      },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Accreditation not found.",
      });
    }

    const title = req.body.title?.trim();

    if (!title) {
      return res.status(400).json({
        message: "Title is required.",
      });
    }

    if (title.length > 100) {
      return res.status(400).json({
        message: "Title cannot exceed 100 characters.",
      });
    }

    const duplicate = await prisma.websiteAccreditation.findFirst({
      where: {
        vendorId: existing.vendorId,
        id: {
          not: accreditationId,
        },
        title: {
          equals: title,
          mode: "insensitive",
        },
      },
    });

    if (duplicate) {
      return res.status(409).json({
        message: "Accreditation already exists.",
      });
    }

    const accreditation = await prisma.websiteAccreditation.update({
      where: {
        id: accreditationId,
      },
      data: {
        title,
        imageUrl: req.body.imageUrl?.trim() || null,
        sortOrder: req.body.sortOrder,
      },
    });

    return res.status(200).json(accreditation);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update accreditation.",
    });
  }
};

export const deleteWebsiteAccreditation = async (
  req: Request,
  res: Response,
) => {
  try {
    const accreditationId = Array.isArray(req.params.accreditationId)
      ? req.params.accreditationId[0]
      : req.params.accreditationId;

    await prisma.websiteAccreditation.delete({
      where: {
        id: accreditationId,
      },
    });

    return res.status(200).json({
      message: "Accreditation deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete accreditation.",
    });
  }
};

export const getWebsiteTestimonials = async (req: Request, res: Response) => {
  try {
    const vendorId = Array.isArray(req.params.vendorId)
      ? req.params.vendorId[0]
      : req.params.vendorId;

    const testimonials = await prisma.websiteTestimonial.findMany({
      where: {
        vendorId,
      },
      orderBy: {
        sortOrder: "asc",
      },
    });

    return res.status(200).json(testimonials);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to load testimonials.",
    });
  }
};

export const createWebsiteTestimonial = async (req: Request, res: Response) => {
  try {
    const vendorId = Array.isArray(req.params.vendorId)
      ? req.params.vendorId[0]
      : req.params.vendorId;

    const patientName = req.body.patientName?.trim();
    const country = req.body.country?.trim() || null;
    const testimonial = req.body.testimonial?.trim();
    const imageUrl = req.body.imageUrl?.trim() || null;

    if (!patientName) {
      return res.status(400).json({
        message: "Patient name is required.",
      });
    }

    if (patientName.length > 100) {
      return res.status(400).json({
        message: "Patient name cannot exceed 100 characters.",
      });
    }

    if (!testimonial) {
      return res.status(400).json({
        message: "Testimonial is required.",
      });
    }

    if (testimonial.length > 2000) {
      return res.status(400).json({
        message: "Testimonial cannot exceed 2000 characters.",
      });
    }

    const count = await prisma.websiteTestimonial.count({
      where: {
        vendorId,
      },
    });

    const created = await prisma.websiteTestimonial.create({
      data: {
        vendorId,
        patientName,
        country,
        testimonial,
        imageUrl,
        sortOrder: count + 1,
      },
    });

    return res.status(201).json(created);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to create testimonial.",
    });
  }
};

export const updateWebsiteTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonialId = Array.isArray(req.params.testimonialId)
      ? req.params.testimonialId[0]
      : req.params.testimonialId;

    const existing = await prisma.websiteTestimonial.findUnique({
      where: {
        id: testimonialId,
      },
    });

    if (!existing) {
      return res.status(404).json({
        message: "Testimonial not found.",
      });
    }

    const patientName = req.body.patientName?.trim();
    const testimonial = req.body.testimonial?.trim();

    if (!patientName) {
      return res.status(400).json({
        message: "Patient name is required.",
      });
    }

    if (!testimonial) {
      return res.status(400).json({
        message: "Testimonial is required.",
      });
    }

    const updated = await prisma.websiteTestimonial.update({
      where: {
        id: testimonialId,
      },
      data: {
        patientName,
        country: req.body.country?.trim() || null,
        testimonial,
        imageUrl: req.body.imageUrl?.trim() || null,
        sortOrder: req.body.sortOrder,
      },
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to update testimonial.",
    });
  }
};

export const deleteWebsiteTestimonial = async (req: Request, res: Response) => {
  try {
    const testimonialId = Array.isArray(req.params.testimonialId)
      ? req.params.testimonialId[0]
      : req.params.testimonialId;

    await prisma.websiteTestimonial.delete({
      where: {
        id: testimonialId,
      },
    });

    return res.status(200).json({
      message: "Testimonial deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Failed to delete testimonial.",
    });
  }
};
