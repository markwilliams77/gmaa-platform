/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";
import { vendorService } from "../../services/vendorService";

interface SubmitCardProps {
  verificationStatus?: string;
}

export default function SubmitCard({
  verificationStatus,
}: SubmitCardProps) {
  const handleSubmit = async () => {
    try {
      const response = await vendorService.submitVerification();
      alert(response.message);
    } catch (error: any) {
      alert(error?.response?.data?.message ?? "Failed to submit verification.");
    }
  };

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-sm text-slate-800">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-2 max-w-xl">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#2E5B9A] font-mono">
            Review & Submit
          </p>

          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Ready for Verification?
          </h2>

          <p className="text-xs leading-relaxed text-slate-400 font-sans font-light">
            Once all required credentials has been completed, submit your organization for verification. The GMAA compliance desk will verify your application and notify you.
          </p>
        </div>

        {/* Process status diagnostics pill box */}
        <div className="w-full max-w-sm rounded-2xl border border-slate-100 bg-slate-50/50 p-6 shrink-0">
          <div className="space-y-4 text-xs font-sans">
            
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-slate-500">Organization Profile</span>
              </div>
              <span className="text-[10px] font-bold text-[#D91B24] bg-[#D91B24]/10 border border-[#D91B24]/20 px-2 py-0.5 rounded-md font-mono uppercase">Incomplete</span>
            </div>

            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                <span className="text-slate-500">Verification Documents</span>
              </div>
              <span className="text-[10px] font-bold text-[#D91B24] bg-[#D91B24]/10 border border-[#D91B24]/20 px-2 py-0.5 rounded-md font-mono">0 / 5</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <span className="text-slate-500">Verification Status</span>
              </div>
              <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded-md font-mono uppercase">Pending</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full rounded-xl bg-[#2E5B9A] hover:bg-[#3b6eae] py-3.5 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-blue-500/10"
          >
            Submit for Verification
          </button>
        </div>
      </div>
    </div>
  );
}