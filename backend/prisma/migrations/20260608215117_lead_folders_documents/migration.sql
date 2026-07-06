/*
  Warnings:

  - You are about to drop the column `uploadedBy` on the `LeadDocument` table. All the data in the column will be lost.
  - Added the required column `s3Key` to the `LeadDocument` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LeadDocument" DROP COLUMN "uploadedBy",
ADD COLUMN     "folderId" TEXT,
ADD COLUMN     "s3Key" TEXT NOT NULL,
ADD COLUMN     "uploadedById" TEXT,
ADD COLUMN     "uploadedByName" TEXT,
ADD COLUMN     "uploadedByRole" TEXT,
ADD COLUMN     "visibility" TEXT NOT NULL DEFAULT 'SHARED',
ALTER COLUMN "documentType" DROP NOT NULL;

-- CreateTable
CREATE TABLE "LeadFolder" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadFolder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeadFolder_leadId_idx" ON "LeadFolder"("leadId");

-- CreateIndex
CREATE INDEX "LeadDocument_folderId_idx" ON "LeadDocument"("folderId");

-- AddForeignKey
ALTER TABLE "LeadDocument" ADD CONSTRAINT "LeadDocument_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "LeadFolder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeadFolder" ADD CONSTRAINT "LeadFolder_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
