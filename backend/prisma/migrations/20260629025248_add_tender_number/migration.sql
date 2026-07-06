/*
  Warnings:

  - A unique constraint covering the columns `[tenderNumber]` on the table `Tender` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenderNumber` to the `Tender` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tender" ADD COLUMN     "tenderNumber" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tender_tenderNumber_key" ON "Tender"("tenderNumber");
