/*
  Warnings:

  - You are about to drop the column `serviceCategory` on the `Tender` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tender" DROP COLUMN "serviceCategory",
ADD COLUMN     "mainCategory" TEXT;
