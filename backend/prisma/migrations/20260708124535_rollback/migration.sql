/*
  Warnings:

  - You are about to drop the column `vendorType` on the `Vendor` table. All the data in the column will be lost.
  - Made the column `userId` on table `Vendor` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Vendor" DROP CONSTRAINT "Vendor_userId_fkey";

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "vendorType",
ALTER COLUMN "userId" SET NOT NULL;

-- DropEnum
DROP TYPE "VendorType";

-- AddForeignKey
ALTER TABLE "Vendor" ADD CONSTRAINT "Vendor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
