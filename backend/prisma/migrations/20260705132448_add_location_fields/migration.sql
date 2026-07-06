/*
  Warnings:

  - You are about to drop the column `region` on the `Consultation` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `Vendor` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `VendorOnboarding` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Consultation" DROP COLUMN "region",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "state" TEXT;

-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "region",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "state" TEXT;

-- AlterTable
ALTER TABLE "VendorOnboarding" DROP COLUMN "region",
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "state" TEXT;
