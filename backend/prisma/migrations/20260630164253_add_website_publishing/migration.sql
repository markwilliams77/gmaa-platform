/*
  Warnings:

  - You are about to drop the column `accreditation` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `services` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `startingPrice` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `stats` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the `VendorWebsiteProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "VendorWebsiteProfile" DROP CONSTRAINT "VendorWebsiteProfile_vendorId_fkey";

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "accreditation",
DROP COLUMN "description",
DROP COLUMN "services",
DROP COLUMN "startingPrice",
DROP COLUMN "stats";

-- DropTable
DROP TABLE "VendorWebsiteProfile";

-- CreateTable
CREATE TABLE "WebsiteProfile" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "status" "WebsiteProfileStatus" NOT NULL DEFAULT 'DRAFT',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "profileHeadline" TEXT,
    "description" TEXT,
    "coverImage" TEXT,
    "brochureUrl" TEXT,
    "yearsExperience" TEXT,
    "specialists" TEXT,
    "countriesServed" TEXT,
    "annualPatients" TEXT,
    "hasConcierge" BOOLEAN NOT NULL DEFAULT false,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "publishedAt" TIMESTAMP(3),
    "publishedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteService" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteGallery" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteGallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteAccreditation" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteAccreditation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebsiteTestimonial" (
    "id" TEXT NOT NULL,
    "vendorId" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "country" TEXT,
    "testimonial" TEXT NOT NULL,
    "imageUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WebsiteTestimonial_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WebsiteProfile_vendorId_key" ON "WebsiteProfile"("vendorId");

-- AddForeignKey
ALTER TABLE "WebsiteProfile" ADD CONSTRAINT "WebsiteProfile_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsiteService" ADD CONSTRAINT "WebsiteService_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsiteGallery" ADD CONSTRAINT "WebsiteGallery_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsiteAccreditation" ADD CONSTRAINT "WebsiteAccreditation_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WebsiteTestimonial" ADD CONSTRAINT "WebsiteTestimonial_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
