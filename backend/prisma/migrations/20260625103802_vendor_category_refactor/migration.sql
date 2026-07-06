/*
  Warnings:

  - You are about to drop the column `category` on the `Vendor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Vendor" DROP COLUMN "category",
ADD COLUMN     "mainCategory" TEXT,
ADD COLUMN     "subCategory" TEXT;
