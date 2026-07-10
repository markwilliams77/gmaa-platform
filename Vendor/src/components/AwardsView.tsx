/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Award, 
  ChevronRight, 
  CheckCircle, 
  Activity, 
  MapPin, 
  Calendar, 
  FileCheck2, 
  ExternalLink,
  ShieldCheck,
  Zap,
  TrendingUp,
  Briefcase
} from "lucide-react";
import { AwardedProject } from "../types";

interface AwardsViewProps {
  awards: AwardedProject[];
}

export default function AwardsView({ awards }: AwardsViewProps) {
  // Aggregate stats (Preserves original code logic)
  const totalValue = awards.reduce((sum, item) => sum + item.projectValue, 0);
  const activeCount = awards.filter(a => a.status === "Active").length;

  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans uppercase tracking-widest">
            <span>Alliance Core Achievements</span>
            <ChevronRight className="h-3 w-3 text-[#2E5B9A]" />
            <span className="text-[#2E5B9A] font-semibold">Won Projects Portfolio</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mt-1">SLA Awards Desk</h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Review secured GMAA corporate healthcare contracts, overall won assets, and active delivery statuses.
          </p>
        </div>
        
        <div className="text-[10px] font-bold font-mono px-3 py-1.5 bg-[#EBF3FC] text-[#2E5B9A] border border-blue-100 rounded-lg flex items-center gap-1.5 self-start sm:self-auto">
          <ShieldCheck className="h-3.5 w-3.5" />
          SECURED CONTRACT HUB
        </div>
      </div>

      {/* DYNAMIC METRIC PANELS (HUD Style) */}
      <div id="awards-aggregate-row" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* SLA Value Card */}
        <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center justify-between hover:shadow-md hover:border-[#2E5B9A]/15 transition-all duration-300">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Won SLA Volume</span>
            <p className="text-xl font-bold text-[#2E5B9A] mt-1.5">${totalValue.toLocaleString()} USD</p>
            <p className="text-3xs text-slate-450 text-slate-400 mt-1 font-sans">Accumulated contract assets</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#EBF3FC] border border-blue-100 text-[#2E5B9A] flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        {/* Active Evacuations Card */}
        <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center justify-between hover:shadow-md hover:border-[#2E5B9A]/15 transition-all duration-300">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Active Evacuations</span>
            <p className="text-xl font-bold text-slate-900 mt-1.5">{activeCount} Tenders</p>
            <p className="text-3xs text-emerald-600 font-semibold mt-1 font-sans flex items-center gap-0.5">
              <CheckCircle className="h-3.5 w-3.5 text-emerald-500" />
              100% SLA Compliance
            </p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        {/* Win Ratio Card */}
        <div className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center justify-between hover:shadow-md hover:border-[#2E5B9A]/15 transition-all duration-300">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Win Ratio</span>
            <p className="text-xl font-bold text-slate-900 mt-1.5">22%</p>
            <p className="text-3xs text-slate-400 mt-1 font-sans">Outperforming regional benchmark</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 text-[#2E5B9A] flex items-center justify-center">
            <Zap className="h-5 w-5" />
          </div>
        </div>

        {/* GMAA Tier-1 Partner Card (GMAA Red Accent Glow) */}
        <div className="p-5 rounded-2xl border border-blue-900/40 bg-gradient-to-br from-[#0c1a30] to-[#12284c] text-white shadow-lg flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-blue-300 uppercase tracking-widest font-mono">Quality Status</span>
            <p className="text-sm font-bold text-white mt-2 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#D91B24] animate-pulse" />
              GMAA Tier-1 Partner
            </p>
            <p className="text-[9px] text-slate-400 mt-1.5 font-mono tracking-widest uppercase">Verified Cohort Hub</p>
          </div>
          <div className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 text-white flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* PORTFOLIO LIST LOG */}
      <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
        
        {/* Log Table Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-slate-900 text-sm">Winning Projects Log</h3>
            <p className="text-2xs text-slate-400 font-sans mt-0.5">Formal awards published by the GMAA Board</p>
          </div>
          <span className="text-3xs bg-slate-50 border border-slate-250/50 rounded-lg px-2.5 py-1 text-slate-500 font-mono font-bold uppercase">
            Total Secured: {awards.length} Contracts
          </span>
        </div>

        {/* Tactile Log Items */}
        <div className="divide-y divide-slate-100 font-sans text-xs">
          {awards.map((project) => (
            <div 
              key={project.id} 
              id={`award-row-${project.id}`}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#EBF3FC]/20 transition-all duration-200 group relative border-l-2 border-transparent hover:border-l-[#2E5B9A]"
            >
              
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap text-[10px]">
                  <span className="font-mono font-bold bg-[#EBF3FC] text-[#2E5B9A] border border-blue-100 px-2 py-0.5 rounded-md">
                    {project.id}
                  </span>
                  <span className="text-slate-400 text-3xs font-mono">• Tender Ref: {project.tenderId}</span>
                  <span className="text-slate-400 text-3xs font-mono">• Won Date: {project.awardDate}</span>
                </div>
                
                <h4 className="font-display font-semibold text-base text-slate-900 leading-normal truncate group-hover:text-[#2E5B9A] transition-colors">
                  {project.title}
                </h4>

                <div className="flex items-center gap-4 text-3xs text-slate-400">
                  <span className="font-bold text-slate-500 uppercase tracking-wider font-mono bg-slate-100 px-1.5 py-0.5 rounded">{project.category}</span>
                  <span className="flex items-center gap-0.5 font-medium text-slate-500">
                    <MapPin className="h-3.5 w-3.5 text-[#2E5B9A]" />
                    {project.region}
                  </span>
                </div>
              </div>

              {/* Status and value right side */}
              <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                <p className="text-base font-bold text-slate-900 font-display">${project.projectValue.toLocaleString()} USD</p>
                <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    project.status === "Active" ? "bg-emerald-500 animate-pulse" :
                    project.status === "Completed" ? "bg-blue-500" :
                    "bg-amber-400"
                  }`} />
                  <span className={`text-[9px] font-bold uppercase tracking-widest font-mono ${
                    project.status === "Active" ? "text-emerald-600" :
                    project.status === "Completed" ? "text-blue-600" :
                    "text-amber-600"
                  }`}>
                    {project.status}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

    </div>
  );
}