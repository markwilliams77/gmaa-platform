import { VENDOR_CATEGORIES } from "../constants/vendorCategories";

export const categoryCards = VENDOR_CATEGORIES.map((category) => ({
  id: category.mainCategory,
  title: category.mainCategory,
  slug: category.mainCategory.toLowerCase().replace(/\s+/g, "-"),
  subcategories: category.subCategories.map((sub) => sub.name),
  specialties: category.subCategories.flatMap((sub) => sub.specialties),
  icon:
    category.mainCategory === "Hospitals & Medical Providers"
      ? "🏥"
      : category.mainCategory === "Emergency & Medical Transportation"
        ? "🚑"
        : category.mainCategory === "Home Healthcare & Senior Care"
          ? "🏠"
          : category.mainCategory === "Diagnostics & Laboratories"
            ? "🧪"
            : category.mainCategory ===
                "Pharmaceuticals, Medical Equipment & Supplies"
              ? "💊"
              : category.mainCategory ===
                  "Medical Tourism & International Patient Services"
                ? "🌍"
                : category.mainCategory === "Insurance, Assistance & Claims"
                  ? "🛡️"
                  : category.mainCategory === "Telemedicine & Digital Health"
                    ? "💻"
                    : category.mainCategory ===
                        "Wellness, Rehabilitation & Preventive Care"
                      ? "💚"
                      : category.mainCategory ===
                          "Healthcare Business Solutions"
                        ? "🏢"
                        : category.mainCategory ===
                            "Government, NGOs & Public Health"
                          ? "🏛️"
                          : category.mainCategory ===
                              "Funeral & Repatriation Services"
                            ? "🕊️"
                            : "🏥",
  description:
    category.subCategories.length > 0
      ? category.subCategories
          .map((sub) => sub.name)
          .slice(0, 2)
          .join(" • ")
      : "Explore verified providers",
  providerCount: 0,
}));
