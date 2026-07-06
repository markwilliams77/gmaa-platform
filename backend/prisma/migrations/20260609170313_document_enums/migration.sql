/*
  Warnings:

  - The `visibility` column on the `LeadDocument` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `category` column on the `LeadDocument` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('CLIENT_DOCUMENT', 'VENDOR_DOCUMENT', 'QUOTATION', 'INVOICE', 'CONTRACT', 'AGREEMENT', 'LICENSE', 'PRESCRIPTION', 'TREATMENT_PLAN', 'DIAGNOSTIC_REPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "DocumentVisibility" AS ENUM ('ADMIN_ONLY', 'CLIENT_ONLY', 'VENDOR_ONLY', 'CLIENT_AND_ADMIN', 'VENDOR_AND_ADMIN', 'SHARED');

-- AlterTable
ALTER TABLE "LeadDocument" DROP COLUMN "visibility",
ADD COLUMN     "visibility" "DocumentVisibility" NOT NULL DEFAULT 'SHARED',
DROP COLUMN "category",
ADD COLUMN     "category" "DocumentCategory";
