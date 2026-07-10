/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { LockKeyhole, Award, ShieldCheck, ChevronRight, Activity } from "lucide-react";

export default function Hero() {
  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0c1a30] to-[#12284c] p-8 md:p-10 text-white shadow-xl border border-blue-900/40">
      {/* Light glow backdrops */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-64 w-64 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
      <div className="absolute bottom-0 left-1/3 -ml-16 -mb-16 h-64 w-64 rounded-full bg-[#D91B24]/5 blur-3xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        {/* Left Side: Copy */}
        <div className="max-w-2xl space-y-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-300 font-mono">
            Organization Verification
          </p>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-[#D91B24]/10 px-3.5 py-1 text-[10px] font-bold text-[#D91B24] border border-[#D91B24]/20 uppercase tracking-wider font-mono">
            <span className="h-1.5 w-1.5 bg-[#D91B24] rounded-full animate-pulse" />
            Documents Pending
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Complete your verification
          </h1>

          <p className="text-slate-350 font-sans font-light text-xs md:text-sm max-w-xl leading-relaxed">
            Complete your organization profile and upload the required verification documents to unlock the GMAA Vendor Marketplace.
          </p>
        </div>

        {/* Right Side: Glass Progress HUD Panel */}
        <div className="w-full lg:w-96 rounded-2xl border border-blue-950/60 bg-slate-950/40 p-6 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Verification Progress
            </span>
            <span className="text-3xl font-bold text-white font-display">0%</span>
          </div>

          {/* Progress bar channel */}
          <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-900 border border-blue-950">
            <div className="h-full w-0 rounded-full bg-gradient-to-r from-[#2E5B9A] to-[#4A90E2] transition-all" />
          </div>

          <div className="mt-6 space-y-3 font-sans text-xs">
            <div className="flex justify-between items-center py-0.5 border-b border-white/5">
              <span className="text-slate-400">Organization Info</span>
              <span className="text-xs font-bold text-[#D91B24] bg-[#D91B24]/10 border border-[#D91B24]/20 px-2 py-0.5 rounded-md font-mono">Incomplete</span>
            </div>

            <div className="flex justify-between items-center py-0.5 border-b border-white/5">
              <span className="text-slate-400">Documents Stack</span>
              <span className="text-xs font-bold text-[#D91B24] bg-[#D91B24]/10 border border-[#D91B24]/20 px-2 py-0.5 rounded-md font-mono">0 / 5</span>
            </div>

            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-400">Board Review</span>
              <span className="text-xs font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md font-mono">Pending</span>
            </div>
          </div>

          <button className="mt-6 w-full rounded-xl bg-[#2E5B9A] hover:bg-[#3b6eae] py-3 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-blue-500/10">
            Continue Verification
          </button>
        </div>
      </div>
    </div>
  );
}