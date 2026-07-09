import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../configs/db";
import { mockVendors } from "../seed/marketplace/vendors";
import { generateBusinessNumber } from "../utils/businessNumberGenerator";
import { ACCREDITATIONS } from "../seed/marketplace/accreditations";
import { TESTIMONIALS } from "../seed/marketplace/testimonials";
import { getRandomGalleryImages } from "../seed/marketplace/galleryHelper";
import { uploadMarketplaceAsset } from "../seed/marketplace/uploadMarketplaceAssets";
import {
  DEFAULT_PROFILE,
  WEBSITE_PROFILE_CONTENT,
} from "../seed/marketplace/websiteProfiles";

export const seedMarketplace = async (req: Request, res: Response) => {
  try {
    let created = 0;

    for (const vendor of mockVendors) {
      const existing = await prisma.vendor.findFirst({
        where: {
          companyName: vendor.companyName,
        },
      });

      if (existing) {
        continue;
      }

      const passwordHash = await bcrypt.hash("MockVendor@123", 10);

      const user = await prisma.user.create({
        data: {
          email: `${vendor.companyName
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "")}@mock.globalmaa.com`,
          password: passwordHash,
          role: "VENDOR",
          vendorStatus: "ACTIVE",
        },
      });

      const vendorNumber = await generateBusinessNumber(
        "VND",
        prisma.vendor,
        "vendorNumber",
      );

      const createdVendor = await prisma.vendor.create({
        data: {
          vendorNumber,
          userId: user.id,
          companyName: vendor.companyName,

          isMock: true,

          verificationStatus: "APPROVED",

          mainCategory: vendor.mainCategory,
          subCategory: vendor.subCategory,
          specialty: vendor.specialty,

          rating: vendor.rating,

          country: vendor.country,
          state: vendor.state,
          city: vendor.city,
        },
      });

      const profile =
        WEBSITE_PROFILE_CONTENT[vendor.subCategory] ?? DEFAULT_PROFILE;

      await prisma.websiteProfile.create({
        data: {
          vendorId: createdVendor.id,

          profileHeadline: profile.headline,

          description: profile.description,

          highlights: profile.keyHighlights,

          seoTitle: vendor.companyName,

          seoDescription: `${vendor.companyName} is listed on the GlobalMaa Healthcare Marketplace.`,

          status: "PUBLISHED",
        },
      });

      await prisma.websiteService.createMany({
        data: profile.services.map((service, index) => ({
          vendorId: createdVendor.id,
          name: service,
          sortOrder: index + 1,
        })),
      });

      const accreditationCount = Math.floor(Math.random() * 3) + 2;

      const shuffledAccreditations = [...ACCREDITATIONS]
        .sort(() => Math.random() - 0.5)
        .slice(0, accreditationCount);

      await prisma.websiteAccreditation.createMany({
        data: shuffledAccreditations.map((title, index) => ({
          vendorId: createdVendor.id,
          title,
          sortOrder: index + 1,
        })),
      });

      const testimonialCount = Math.floor(Math.random() * 2) + 2; // 2–3

      const shuffledTestimonials = [...TESTIMONIALS]
        .sort(() => Math.random() - 0.5)
        .slice(0, testimonialCount);

      await prisma.websiteTestimonial.createMany({
        data: shuffledTestimonials.map((testimonial, index) => ({
          vendorId: createdVendor.id,
          patientName: testimonial.author,
          country: testimonial.country,
          testimonial: testimonial.content,
          sortOrder: index + 1,
        })),
      });

      const galleryFolder = profile.galleryFolder;

      let coverImageUrl: string | null = null;

      const galleryImages = getRandomGalleryImages(galleryFolder, 6);

      let gallerySortOrder = 1;

      for (const image of galleryImages) {
        const imageUrl = await uploadMarketplaceAsset(
          image.localFilePath,
          image.folder,
        );

        if (!coverImageUrl) {
          coverImageUrl = imageUrl;
        }

        await prisma.websiteGallery.create({
          data: {
            vendorId: createdVendor.id,
            imageUrl,
            caption: image.caption,
            sortOrder: gallerySortOrder++,
          },
        });

        await prisma.websiteProfile.update({
          where: {
            vendorId: createdVendor.id,
          },
          data: {
            coverImage: coverImageUrl,
          },
        });
      }

      created++;
    }

    return res.json({
      success: true,
      created,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Marketplace seeding failed",
    });
  }
};

export const clearMarketplace = async (req: Request, res: Response) => {
  try {
    const mockVendors = await prisma.vendor.findMany({
      where: {
        isMock: true,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    const vendorIds = mockVendors.map((v) => v.id);
    const userIds = mockVendors.map((v) => v.userId);

    await prisma.websiteProfile.deleteMany({
      where: {
        vendorId: {
          in: vendorIds,
        },
      },
    });

    await prisma.vendor.deleteMany({
      where: {
        isMock: true,
      },
    });

    await prisma.user.deleteMany({
      where: {
        id: {
          in: userIds,
        },
      },
    });

    return res.json({
      success: true,
      deleted: mockVendors.length,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to clear marketplace",
    });
  }
};
