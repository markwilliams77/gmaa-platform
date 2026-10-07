ALTER TABLE "Consultation"
ADD COLUMN "consentAcceptedAt" TIMESTAMP(3),
ADD COLUMN "consentPolicyVersion" TEXT;

ALTER TABLE "VendorOnboarding"
ADD COLUMN "consentAcceptedAt" TIMESTAMP(3),
ADD COLUMN "consentPolicyVersion" TEXT;
