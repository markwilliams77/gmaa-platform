/*
  Warnings:

  - The values [DOCUMENTS_PENDING,PAYMENT_COMPLETED,UNDER_REVIEW,PENDING_ACTIVATION,ACTIVE,REJECTED] on the enum `VendorOnboardingStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "VendorUserStatus" AS ENUM ('DOCUMENTS_PENDING', 'UNDER_REVIEW', 'ACTIVE', 'SUSPENDED', 'REJECTED');

-- AlterEnum
BEGIN;
CREATE TYPE "VendorOnboardingStatus_new" AS ENUM ('DRAFT', 'PAYMENT_PENDING', 'PAYMENT_SUCCESS', 'CANCELLED');
ALTER TABLE "VendorOnboarding" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "VendorOnboarding" ALTER COLUMN "status" TYPE "VendorOnboardingStatus_new" USING ("status"::text::"VendorOnboardingStatus_new");
ALTER TYPE "VendorOnboardingStatus" RENAME TO "VendorOnboardingStatus_old";
ALTER TYPE "VendorOnboardingStatus_new" RENAME TO "VendorOnboardingStatus";
DROP TYPE "VendorOnboardingStatus_old";
ALTER TABLE "VendorOnboarding" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- AlterEnum
ALTER TYPE "VendorStatus" ADD VALUE 'SUSPENDED';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "vendorStatus" "VendorUserStatus" NOT NULL DEFAULT 'DOCUMENTS_PENDING';
