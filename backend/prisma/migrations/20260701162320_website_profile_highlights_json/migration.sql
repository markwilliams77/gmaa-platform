/*
  Warnings:

  - You are about to drop the column `annualPatients` on the `WebsiteProfile` table. All the data in the column will be lost.
  - You are about to drop the column `countriesServed` on the `WebsiteProfile` table. All the data in the column will be lost.
  - You are about to drop the column `specialists` on the `WebsiteProfile` table. All the data in the column will be lost.
  - You are about to drop the column `yearsExperience` on the `WebsiteProfile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "WebsiteProfile" DROP COLUMN "annualPatients",
DROP COLUMN "countriesServed",
DROP COLUMN "specialists",
DROP COLUMN "yearsExperience",
ADD COLUMN     "highlights" JSONB;
