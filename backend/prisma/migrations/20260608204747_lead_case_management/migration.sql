/*
  Warnings:

  - The `status` column on the `Lead` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `password` on the `VendorLoginInfo` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[leadNumber]` on the table `Lead` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Lead` table without a default value. This is not possible if the table is not empty.
  - Added the required column `region` to the `Tender` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Tender` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `VendorLoginInfo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "LeadPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'UNDER_REVIEW', 'ASSIGNED', 'BROADCASTED', 'ACKNOWLEDGED', 'DOCUMENTS_REQUESTED', 'IN_PROGRESS', 'COMPLETED', 'CLOSED');

-- CreateEnum
CREATE TYPE "TenderStatus" AS ENUM ('DRAFT', 'BROADCASTED', 'CLOSED', 'AWARDED');

-- CreateEnum
CREATE TYPE "BidStatus" AS ENUM ('SUBMITTED', 'SHORTLISTED', 'REJECTED', 'AWARDED');

-- CreateEnum
CREATE TYPE "LeadRoutingType" AS ENUM ('DIRECT', 'TENDER');

-- CreateEnum
CREATE TYPE "LeadSource" AS ENUM ('HOMEPAGE_ENQUIRY', 'VENDOR_ENQUIRY', 'DIRECT_CALL', 'MANUAL_ADMIN');

-- CreateEnum
CREATE TYPE "LeadType" AS ENUM ('DIRECT', 'VENDOR_ENQUIRY', 'TENDER');

-- AlterTable
ALTER TABLE "Bid" ADD COLUMN     "proposal" TEXT,
ADD COLUMN     "status" "BidStatus" NOT NULL DEFAULT 'SUBMITTED';

-- AlterTable
ALTER TABLE "Lead" ADD COLUMN     "assignedToUserId" TEXT,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "leadNumber" TEXT,
ADD COLUMN     "leadType" "LeadType" NOT NULL DEFAULT 'DIRECT',
ADD COLUMN     "patientPhone" TEXT,
ADD COLUMN     "priority" "LeadPriority" NOT NULL DEFAULT 'MEDIUM',
ADD COLUMN     "routingType" "LeadRoutingType" NOT NULL DEFAULT 'DIRECT',
ADD COLUMN     "selectedVendorId" TEXT,
ADD COLUMN     "serviceCategory" TEXT,
ADD COLUMN     "source" "LeadSource" NOT NULL DEFAULT 'HOMEPAGE_ENQUIRY',
ADD COLUMN     "title" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vendorId" TEXT,
ADD COLUMN     "vendorName" TEXT,
DROP COLUMN "status",
ADD COLUMN     "status" "LeadStatus" NOT NULL DEFAULT 'NEW';

-- AlterTable
ALTER TABLE "Tender" ADD COLUMN     "awardedVendorId" TEXT,
ADD COLUMN     "leadId" TEXT,
ADD COLUMN     "region" TEXT NOT NULL,
ADD COLUMN     "serviceCategory" TEXT,
ADD COLUMN     "status" "TenderStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "VendorLoginInfo" DROP COLUMN "password",
ADD COLUMN     "email" TEXT,
ADD COLUMN     "passwordHash" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "LeadDocument" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "documentType" TEXT NOT NULL,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadActivity" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "activity" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadActivity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadNote" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "note" TEXT NOT NULL,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadTimeline" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadTimeline_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeadDocument_leadId_idx" ON "LeadDocument"("leadId");

-- CreateIndex
CREATE INDEX "LeadActivity_leadId_idx" ON "LeadActivity"("leadId");

-- CreateIndex
CREATE UNIQUE INDEX "Lead_leadNumber_key" ON "Lead"("leadNumber");

-- AddForeignKey
ALTER TABLE "Bid" ADD CONSTRAINT "Bid_tenderId_fkey" FOREIGN KEY ("tenderId") REFERENCES "Tender"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadDocument" ADD CONSTRAINT "LeadDocument_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadActivity" ADD CONSTRAINT "LeadActivity_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadNote" ADD CONSTRAINT "LeadNote_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
