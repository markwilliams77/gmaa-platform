-- CreateEnum
CREATE TYPE "WebsiteProfileStatus" AS ENUM ('DRAFT', 'READY_FOR_REVIEW', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "VendorWebsiteProfile" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "status" "WebsiteProfileStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "profileHeadline" TEXT,
    "description" TEXT,
    "mission" TEXT,
    "vision" TEXT,
    "whyChooseUs" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "coverImage" TEXT,
    "brochureUrl" TEXT,
    "yearsExperience" TEXT,
    "specialists" TEXT,
    "countriesServed" TEXT,
    "annualPatients" TEXT,
    "hasConcierge" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "publishedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VendorWebsiteProfile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VendorWebsiteProfile_vendorId_key" ON "VendorWebsiteProfile"("vendorId");

-- AddForeignKey
ALTER TABLE "VendorWebsiteProfile" ADD CONSTRAINT "VendorWebsiteProfile_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
