import React from "react";
import Hero from "./Hero";
import StatusCards from "./StatusCards";
import OrganizationForm from "./OrganizationForm";
import DocumentsSection from "./DocumentsSection";
import SubmitCard from "./SubmitCard";
import LogoUploadCard from "./LogoUploadCard";
import { useEffect, useState } from "react";
import { vendorService } from "../../services/vendorService";

export default function OrganizationProfileView() {
  const docs = [
    "Company Registration / Business License",
    "Tax Registration (GST / VAT / Tax ID)",
    "Authorized Signatory ID",
    "Business Address Proof",
    "Bank Account Verification",
  ];

  const [vendor, setVendor] = useState<any>(null);

  useEffect(() => {
    const loadVendor = async () => {
      try {
        const data = await vendorService.getMe();
        setVendor(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadVendor();
  }, []);

  return (
    <>
      <Hero />

      <StatusCards />

      <LogoUploadCard />

      <OrganizationForm />

      <DocumentsSection verificationStatus={vendor?.verificationStatus} />
      <SubmitCard verificationStatus={vendor?.verificationStatus} />
    </>
  );
}
