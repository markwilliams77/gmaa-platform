/*
  Warnings:

  - You are about to drop the column `message` on the `Consultation` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Consultation` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ConsultationStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'REJECTED', 'CONVERTED');

-- AlterTable
ALTER TABLE "Consultation" DROP COLUMN "message",
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "region" TEXT,
ADD COLUMN     "service" TEXT,
ADD COLUMN     "status" "ConsultationStatus" NOT NULL DEFAULT 'NEW',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vendorId" TEXT,
ADD COLUMN     "vendorName" TEXT;
