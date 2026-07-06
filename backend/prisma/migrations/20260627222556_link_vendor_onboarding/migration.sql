/*
  Warnings:

  - You are about to drop the column `status` on the `Vendor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[vendorId]` on the table `VendorOnboarding` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "status";

-- AlterTable
ALTER TABLE "VendorOnboarding" ADD COLUMN     "vendorId" TEXT;

-- DropEnum
DROP TYPE "VendorStatus";

-- CreateIndex
CREATE UNIQUE INDEX "VendorOnboarding_vendorId_key" ON "VendorOnboarding"("vendorId");

-- AddForeignKey
ALTER TABLE "VendorOnboarding" ADD CONSTRAINT "VendorOnboarding_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "Vendor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
