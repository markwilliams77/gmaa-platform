/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import Hero from "./Hero";
import StatusCards from "./StatusCards";
import OrganizationForm from "./OrganizationForm";
import DocumentsSection from "./DocumentsSection";
import SubmitCard from "./SubmitCard";
import LogoUploadCard from "./LogoUploadCard";
import { vendorService } from "../../services/vendorService";

export default function OrganizationProfileView() {
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
    <div className="space-y-8">
      {/* 1. Header Banner */}
      <Hero />

      {/* 2. Bento Quick Counters */}
      <StatusCards />

      {/* 3. Logo Branding Module */}
      <LogoUploadCard />

      {/* 4. Complete Company Profile Form */}
      <OrganizationForm />

      {/* 5. Verification Document Grid Uploads */}
      <DocumentsSection verificationStatus={vendor?.verificationStatus} />
      
      {/* 6. Review Action Card */}
      <SubmitCard verificationStatus={vendor?.verificationStatus} />
    </div>
  );
}