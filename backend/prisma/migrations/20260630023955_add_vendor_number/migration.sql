/*
  Warnings:

  - A unique constraint covering the columns `[vendorNumber]` on the table `Vendor` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "vendorNumber" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Vendor_vendorNumber_key" ON "Vendor"("vendorNumber");
