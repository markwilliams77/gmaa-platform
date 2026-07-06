-- CreateEnum
CREATE TYPE "VendorVerificationStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "Vendor" ADD COLUMN     "verificationRemarks" TEXT,
ADD COLUMN     "verificationReviewedAt" TIMESTAMP(3),
ADD COLUMN     "verificationReviewedBy" TEXT,
ADD COLUMN     "verificationStatus" "VendorVerificationStatus" NOT NULL DEFAULT 'DRAFT',
ADD COLUMN     "verificationSubmittedAt" TIMESTAMP(3);
