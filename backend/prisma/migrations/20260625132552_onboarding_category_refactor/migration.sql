/*
  Warnings:

  - You are about to drop the column `orgType` on the `VendorOnboarding` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "VendorOnboarding" DROP COLUMN "orgType",
ADD COLUMN     "mainCategory" TEXT,
ADD COLUMN     "subCategory" TEXT;
