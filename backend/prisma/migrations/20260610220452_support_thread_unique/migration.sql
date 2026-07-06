/*
  Warnings:

  - A unique constraint covering the columns `[tenderId,vendorId]` on the table `SupportThread` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SupportThread_tenderId_vendorId_key" ON "SupportThread"("tenderId", "vendorId");
