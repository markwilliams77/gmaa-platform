import { Request, Response } from "express";
import { prisma } from "../../configs/db";

const DEFAULT_VENDOR_IMAGE = "https://via.placeholder.com/800";

const toPositiveInt = (value: unknown, fallback: number) => {
  const parsed = Number(value);

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const mapVendorListItem = (vendor: {
  id: string;
  companyName: string;
  country: string | null;
  state: string | null;
  city: string | null;
  websiteProfile: {
    coverImage: string | null;
  } | null;
  mainCategory: string | null;
  subCategory: string | null;
  specialty: string | null;
  rating: number | null;

  websiteAccreditations: {
    title: string;
  }[];

  websiteServices: {
    name: string;
  }[];

  user: {
    email: string;
  };
}) => {
  const services = vendor.websiteServices.map((service) => service.name);

  const primaryService = services[0] ?? "Healthcare Provider";

  return {
    id: vendor.id,
    name: vendor.companyName,
    email: vendor.user.email,
    location: `${vendor.city}, ${vendor.country}`,
    country: vendor.country,
    state: vendor.state,
    city: vendor.city,
    mainCategory: vendor.mainCategory ?? "Hospitals & Medical Providers",
    subCategory: vendor.subCategory ?? primaryService,
    image: vendor.websiteProfile?.coverImage ?? DEFAULT_VENDOR_IMAGE,
    accreditation:
      vendor.websiteAccreditations.length > 0
        ? vendor.websiteAccreditations.map((item) => item.title)
        : ["Verified Provider"],
    specialty: vendor.specialty ?? primaryService,
    rating: vendor.rating ?? 4.8,
    services,
  };
};

export const getDirectoryVendors = async (req: Request, res: Response) => {
  const { search, category, country, state, city } = req.query;
  const page = toPositiveInt(req.query.page, 1);
  const limit = Math.min(toPositiveInt(req.query.limit, 10), 50);

  const searchText = typeof search === "string" ? search.trim() : "";
  const categoryText = typeof category === "string" ? category.trim() : "";
  const countryText = typeof country === "string" ? country.trim() : "";

  const stateText = typeof state === "string" ? state.trim() : "";

  const cityText = typeof city === "string" ? city.trim() : "";

  try {
    const where = {
      verificationStatus: "APPROVED" as const,
      user: {
        vendorStatus: "ACTIVE" as const,
      },

      ...(searchText && {
        OR: [
          {
            companyName: {
              contains: searchText,
              mode: "insensitive" as const,
            },
          },
          {
            specialty: {
              contains: searchText,
              mode: "insensitive" as const,
            },
          },
          {
            mainCategory: {
              contains: searchText,
              mode: "insensitive" as const,
            },
          },
          {
            subCategory: {
              contains: searchText,
              mode: "insensitive" as const,
            },
          },
          {
            websiteServices: {
              some: {
                name: {
                  contains: searchText,
                  mode: "insensitive" as const,
                },
              },
            },
          },
        ],
      }),

      ...(categoryText && {
        OR: [
          {
            mainCategory: categoryText,
          },
          {
            subCategory: categoryText,
          },
          {
            websiteServices: {
              some: {
                name: {
                  equals: categoryText,
                  mode: "insensitive" as const,
                },
              },
            },
          },
        ],
      }),

      ...(countryText &&
        countryText !== "Global" && {
          country: countryText,
        }),

      ...(stateText && {
        state: stateText,
      }),

      ...(cityText && {
        city: cityText,
      }),
    };

    const [vendors, total] = await prisma.$transaction([
      prisma.vendor.findMany({
        where,
        select: {
          id: true,
          vendorNumber: true,
          companyName: true,
          country: true,
          state: true,
          city: true,
          image: true,
          mainCategory: true,
          subCategory: true,
          specialty: true,
          rating: true,

          websiteServices: {
            orderBy: {
              sortOrder: "asc",
            },
            select: {
              name: true,
            },
          },

          websiteProfile: {
            select: {
              coverImage: true,
            },
          },

          websiteAccreditations: {
            orderBy: {
              sortOrder: "asc",
            },
            select: {
              title: true,
            },
          },

          user: {
            select: {
              email: true,
            },
          },
        },

        orderBy: {
          companyName: "asc",
        },

        skip: (page - 1) * limit,
        take: limit,
      }),

      prisma.vendor.count({
        where,
      }),
    ]);

    res.json({
      data: vendors.map(mapVendorListItem),

      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Failed to fetch directory vendors:", error);

    res.status(500).json({
      message: "Failed to fetch vendors",
    });
  }
};
