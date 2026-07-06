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
  Inbox
} from "lucide-react";
import { AwardedProject } from "../types";

interface AwardsViewProps {
  awards: AwardedProject[];
}

export default function AwardsView({ awards }: AwardsViewProps) {
  // Aggregate stats
  const totalValue = awards.reduce((sum, item) => sum + item.projectValue, 0);
  const activeCount = awards.filter(a => a.status === "Active").length;

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Title */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-sans uppercase tracking-widest">
          <span>Alliance Core Achievements</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-600">Won Projects Portfolio</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900 mt-1">SLA Awards Desk</h2>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          Review secured GMAA corporate healthcare contracts, overall won assets, and delivery statuses.
        </p>
      </div>

      {/* Stats row headers */}
      <div id="awards-aggregate-row" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-3xs flex items-center justify-between">
          <div>
            <span className="text-3xs font-semibold text-slate-400 uppercase tracking-wider font-display">Won SLA Volume</span>
            <p className="text-xl font-bold text-slate-900 mt-1">${totalValue.toLocaleString()} USD</p>
            <p className="text-3xs text-slate-400 mt-1 font-sans">Accumulated contract assets</p>
          </div>
          <div className="h-10 w-10 text-xs font-bold rounded-xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center">
            <TrendingUp className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-3xs flex items-center justify-between">
          <div>
            <span className="text-3xs font-semibold text-slate-400 uppercase tracking-wider font-display">Active Evacuations</span>
            <p className="text-xl font-bold text-slate-900 mt-1">{activeCount} Tenders</p>
            <p className="text-3xs text-emerald-500 font-semibold mt-1 font-sans flex items-center gap-0.5">
              <CheckCircle className="h-3.5 w-3.5" />
              100% SLA compliance score
            </p>
          </div>
          <div className="h-10 w-10 text-xs font-bold rounded-xl bg-emerald-50 border border-emerald-100/50 text-emerald-600 flex items-center justify-center">
            <Activity className="h-5 w-5 animate-pulse" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-3xs flex items-center justify-between">
          <div>
            <span className="text-3xs font-semibold text-slate-400 uppercase tracking-wider font-display">Assistance Win Ratio</span>
            <p className="text-xl font-bold text-slate-900 mt-1">22%</p>
            <p className="text-3xs text-slate-400 mt-1 font-sans">Beating regional network benchmark</p>
          </div>
          <div className="h-10 w-10 text-xs font-bold rounded-xl bg-blue-50 border border-blue-100/50 text-blue-600 flex items-center justify-center">
            <Zap className="h-5 w-5" />
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-slate-200 bg-slate-950 text-white shadow-3xs flex items-center justify-between">
          <div>
            <span className="text-3xs font-semibold text-slate-400 uppercase tracking-wider font-display">Quality Badge Status</span>
            <p className="text-base font-bold text-cyan-400 mt-1">GMAA Tier-1 Partner</p>
            <p className="text-4xs text-slate-400 mt-1 font-mono tracking-widest">VERIFIED COHORT HUB</p>
          </div>
          <div className="h-10 w-10 text-xs font-bold rounded-xl bg-slate-900 border border-slate-800 text-cyan-400 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>

      </div>

      {/* Portfolio List */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-display font-semibold text-slate-900 text-sm">Winning Projects Log</h3>
            <p className="text-2xs text-slate-400 font-sans">Formal awards published by the GMAA Board</p>
          </div>
          <span className="text-2xs bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-slate-500 font-sans">
            Total Won: {awards.length} Contracts
          </span>
        </div>

        <div className="divide-y divide-slate-100 font-sans text-xs">
          {awards.map((project) => (
            <div 
              key={project.id} 
              id={`award-row-${project.id}`}
              className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-all cursor-pointer"
            >
              
              <div className="min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-mono text-3xs font-bold bg-cyan-100 text-cyan-700 px-1.5 py-0.2 rounded">
                    {project.id}
                  </span>
                  <span className="text-3xs text-slate-400">• Tender: {project.tenderId}</span>
                  <span className="text-3xs text-slate-400">• Won Date: {project.awardDate}</span>
                </div>
                
                <h4 className="font-display font-semibold text-base text-slate-900 leading-normal truncate">
                  {project.title}
                </h4>

                <div className="flex items-center gap-4 text-3xs text-slate-400">
                  <span className="font-bold text-slate-500 uppercase tracking-wider">{project.category}</span>
                  <span className="flex items-center gap-0.5">
                    <MapPin className="h-3 w-3 text-cyan-500" />
                    {project.region}
                  </span>
                </div>
              </div>

              {/* Status and value right side */}
              <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2">
                <p className="text-base font-bold text-slate-900 font-display">${project.projectValue.toLocaleString()} USD</p>
                <div className="flex items-center gap-2">
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    project.status === "Active" ? "bg-emerald-500 animate-pulse" :
                    project.status === "Completed" ? "bg-blue-500" :
                    "bg-amber-400"
                  }`} />
                  <span className={`text-3xs font-bold uppercase tracking-wider ${
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
