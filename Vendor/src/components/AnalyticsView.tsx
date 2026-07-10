/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  BarChart3, 
  MapPin, 
  ChevronRight, 
  TrendingUp, 
  Eye, 
  Users, 
  Award, 
  Globe2, 
  Activity, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Info
} from "lucide-react";
import { 
  MOCK_GEOGRAPHY_COUNTRIES, 
  MOCK_GEOGRAPHY_CITIES, 
  MOCK_SEARCHED_SERVICES,
} from "../mockData";

export default function AnalyticsView() {
  const [timeRange, setTimeRange] = useState("Last 30 Days");

  // Coordinates of Stripe line chart curve representation
  const lineChartPoints = "10,90 40,50 80,75 120,30 160,40 200,15 240,45 280,10 320,35 360,20 400,5 440,25 480,15 520,30 560,5";

  const timeRanges = ["Last 7 Days", "Last 30 Days", "Last Quarter", "Fiscal Year 2026"];

  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      
      {/* COMMAND CENTER HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono uppercase tracking-widest">
            <span>Marketplace Intelligence</span>
            <ChevronRight className="h-3 w-3 text-[#2E5B9A]" />
            <span className="text-[#2E5B9A] font-semibold">Live Analytics Hub</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
            Provider Metrics Studio
            <span className="inline-flex h-2 w-2 rounded-full bg-[#D91B24] animate-pulse" />
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time tracking of patient search intents, geographic routing, and conversion metrics.
          </p>
        </div>

        {/* Futuristic Tab Pill Switcher (Preserves timeRange state reactivity) */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/50 self-start lg:self-auto overflow-x-auto max-w-full">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-300 ${
                timeRange === range
                  ? "bg-white text-[#2E5B9A] shadow-xs border border-slate-200/30"
                  : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* 1. TRAFFIC TELEMETRY PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Metrics Box */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between hover:border-[#2E5B9A]/30 transition-all duration-300 group">
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-semibold text-slate-900 text-sm">Audience Traffic Summary</h3>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            </div>
            <p className="text-2xs text-slate-400 font-sans leading-relaxed">
              Global marketplace crawl impressions, profile clicks, and average user dwell time of active GMAA referral coordinators.
            </p>

            <div className="divide-y divide-slate-100 font-sans">
              <div className="py-3 flex items-center justify-between group-hover:bg-slate-50/40 px-2 rounded-lg transition-colors">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Total Clicks</span>
                  <p className="text-lg font-bold text-[#2E5B9A] mt-0.5">12,486 Views</p>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center border border-emerald-100">
                  <TrendingUp className="h-3 w-3 mr-0.5 animate-bounce" />
                  +18% MoM
                </span>
              </div>

              <div className="py-3 flex items-center justify-between group-hover:bg-slate-50/40 px-2 rounded-lg transition-colors">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Unique Evac Inquiries</span>
                  <p className="text-lg font-bold text-[#2E5B9A] mt-0.5">426 Submissions</p>
                </div>
                <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center border border-emerald-100">
                  <TrendingUp className="h-3 w-3 mr-0.5 animate-bounce" />
                  +12.4%
                </span>
              </div>

              <div className="py-3 flex items-center justify-between group-hover:bg-slate-50/40 px-2 rounded-lg transition-colors">
                <div>
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Avg Engagement Dwell</span>
                  <p className="text-lg font-bold text-slate-900 mt-0.5">4m 32s</p>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">Steady</span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-light">Search Conversion Ratio</span>
            <strong className="text-slate-900 font-bold bg-[#EBF3FC] text-[#2E5B9A] px-3 py-1 rounded-xl text-3xs border border-blue-100">3.41% Yield</strong>
          </div>
        </div>

        {/* Telemetry Chart Curve (Stripe Deep Blue Gradient) */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#0c1a30] to-[#12284c] text-white rounded-3xl p-6 shadow-xl border border-blue-900/40 flex flex-col justify-between relative overflow-hidden group">
          {/* Subtle grid layout backdrop for futuristic HUD feel */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
          
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div>
              <span className="text-3xs font-semibold text-blue-300 uppercase tracking-widest font-mono">Live Click Stream</span>
              <h3 className="font-display font-bold text-lg text-white">Daily Marketplace Clicks Curve</h3>
            </div>
            <span className="text-3xs font-mono text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">Active: {timeRange}</span>
          </div>

          {/* Interactive SVG representation with glows */}
          <div className="relative h-44 w-full my-4 flex items-end z-10">
            <svg viewBox="0 0 600 100" className="w-full h-full stroke-[#4A90E2] stroke-2" fill="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2E5B9A" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#0c1a30" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={`M ${lineChartPoints}`} className="stroke-blue-400 stroke-[2.5] drop-shadow-[0_2px_10px_rgba(59,98,173,0.5)]" />
              <path d={`M 10,100 L ${lineChartPoints} L 560,100 Z`} fill="url(#chartGrad)" stroke="none" />
              <circle cx="560" cy="5" r="4.5" fill="#D91B24" className="animate-pulse" />
            </svg>
          </div>

          {/* Grid dates strip */}
          <div className="flex justify-between text-[9px] font-mono text-slate-500 border-t border-blue-950/60 pt-3 relative z-10">
            <span>PERIOD 01</span>
            <span>PERIOD 02</span>
            <span>PERIOD 03</span>
            <span>PERIOD 04</span>
          </div>
        </div>

      </div>

      {/* 2. GEOGRAPHIES AND SEARCH ANALYTICS MODULES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Country Demographics (Bento Panel) */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between h-full hover:shadow-md hover:border-[#2E5B9A]/10 transition-all duration-300 group">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-slate-900 text-sm">Country Lead Distribution</h3>
              <Globe2 className="h-5 w-5 text-[#2E5B9A] group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <p className="text-2xs text-slate-400 leading-relaxed mb-6">
              Geographical routing of planned or emergency medical evacuation inquiries to partner clinics.
            </p>

            <div className="space-y-4">
              {MOCK_GEOGRAPHY_COUNTRIES.map((cnt) => (
                <div key={cnt.country} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-700 font-sans font-semibold flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cnt.color === '#06b6d4' ? '#2E5B9A' : cnt.color }} />
                      {cnt.country}
                    </span>
                    <span className="text-slate-800 font-semibold font-mono">{cnt.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ 
                        backgroundColor: cnt.color === '#06b6d4' ? '#2E5B9A' : cnt.color, 
                        width: `${cnt.percentage}%` 
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center gap-2">
            <span className="text-3xs text-slate-400 font-mono">COVERED:</span>
            <span className="text-3xs font-semibold bg-[#EBF3FC] text-[#2E5B9A] border border-blue-100 px-2 py-0.5 rounded-md uppercase">Europe</span>
            <span className="text-3xs font-semibold bg-[#EBF3FC] text-[#2E5B9A] border border-blue-100 px-2 py-0.5 rounded-md uppercase">Africa</span>
            <span className="text-3xs font-semibold bg-[#EBF3FC] text-[#2E5B9A] border border-blue-100 px-2 py-0.5 rounded-md uppercase">GCC</span>
          </div>
        </div>

        {/* Hotspot Cities (With hover interactive scale effect) */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#2E5B9A]/10 transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-slate-900 text-sm">Target Hotspot Cities</h3>
              <MapPin className="h-5 w-5 text-[#2E5B9A]" />
            </div>
            <p className="text-2xs text-slate-400 leading-relaxed mb-6">
              Active metro hubs routing continuous patient referrals directly down to your clinics.
            </p>

            <div className="space-y-3">
              {MOCK_GEOGRAPHY_CITIES.map((city) => (
                <div 
                  key={city.name} 
                  className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100/60 hover:scale-[1.015] hover:border-blue-200 hover:bg-slate-50/30 transition-all duration-200 text-xs cursor-default"
                >
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-800">{city.name}</p>
                    <p className="text-[10px] text-slate-400 font-sans">Core: {city.region}</p>
                  </div>
                  <strong className="text-[#2E5B9A] font-bold bg-[#EBF3FC] px-2.5 py-1 rounded-md text-[10px] border border-blue-100">{city.count} Inquiries</strong>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[9px] text-slate-400 font-sans italic mt-4 flex items-center gap-1">
            <Info className="h-3 w-3 text-slate-400" />
            Values auto-verified via secure GMAA server logs.
          </p>
        </div>

        {/* Top Services (With Interactive Dynamic Bar Scaling) */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#2E5B9A]/10 transition-all duration-300 group">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-slate-900 text-sm">Top Services Searched</h3>
              <Activity className="h-5 w-5 text-[#2E5B9A]" />
            </div>
            <p className="text-2xs text-slate-400 leading-relaxed mb-6">
              Primary service category keywords queried inside GMAA corporate medical portals.
            </p>

            <div className="space-y-3.5">
              {MOCK_SEARCHED_SERVICES.map((srv, idx) => (
                <div key={srv.name} className="flex items-center justify-between group/item">
                  <span className="text-xs font-semibold text-slate-700 min-w-32 transition-colors group-hover/item:text-[#2E5B9A]">{srv.name}</span>
                  
                  {/* Hover interactive expanding bar container */}
                  <div className="flex-1 mx-3 bg-slate-50 h-3 rounded-lg overflow-hidden relative border border-slate-100">
                    <div 
                      className={`h-full transition-all duration-500 group-hover/item:brightness-105 ${
                        idx === 0 ? "bg-[#2E5B9A]" :
                        idx === 1 ? "bg-[#3b6eae]" :
                        idx === 2 ? "bg-[#4A90E2]" :
                        idx === 3 ? "bg-[#8bb4e7]" :
                        "bg-slate-300"
                      }`} 
                      style={{ width: `${srv.percentage}%` }} 
                    />
                  </div>

                  <span className="text-2xs font-bold text-[#2E5B9A] font-mono w-8 text-right">{srv.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full h-9 rounded-xl border border-slate-200 hover:border-[#2E5B9A] hover:text-[#2E5B9A] text-2xs font-semibold text-slate-600 flex items-center justify-center gap-1.5 transition-all mt-6 shadow-xs">
            View Specialty Report
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

      {/* 3. MULTI-STEP PIPELINE TRACKER */}
      <section id="conversion-analytics-widget" className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-6 relative overflow-hidden">
        <div>
          <h3 className="font-display font-bold text-slate-900">Multi-Step Funnel Conversion Pipeline</h3>
          <p className="text-xs text-slate-400 mt-0.5">Track how global medical search impressions convert cleanly down to successfully won patient casework.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative font-sans text-xs">
          
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-4 hover:border-blue-200 hover:bg-slate-50/50 transition-all duration-300 relative group">
            <div className="flex justify-between items-center">
              <span className="text-4xs font-mono font-bold text-slate-400 uppercase tracking-widest">Step 01: Exposure</span>
              <span className="text-3xs font-bold text-[#2E5B9A] bg-[#EBF3FC] border border-blue-100 px-2 py-0.5 rounded-md">Views to Inquiries</span>
            </div>
            <div className="space-y-1.5">
              <p className="text-2xl font-bold text-[#2E5B9A] font-display">12,486 views</p>
              <p className="text-slate-500 text-2xs leading-relaxed font-light">Total times hospital profile arose in active medical searches.</p>
            </div>
            
            <div className="pt-3.5 border-t border-slate-200/50 flex justify-between text-2xs text-slate-500 items-center">
              <span>Conversion Yield:</span>
              <strong className="text-[#2E5B9A] font-bold bg-[#EBF3FC] px-2 py-0.5 rounded-md border border-blue-150">12.8% Rate</strong>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100/80 space-y-4 hover:border-blue-200 hover:bg-slate-50/50 transition-all duration-300 relative group">
            <div className="flex justify-between items-center">
              <span className="text-4xs font-mono font-bold text-slate-400 uppercase tracking-widest">Step 02: Action</span>
              <span className="text-3xs font-bold text-[#3b6eae] bg-blue-50/60 border border-blue-100 px-2 py-0.5 rounded-md">Referrals Registered</span>
            </div>
            <div className="space-y-1.5">
              <p className="text-2xl font-bold text-slate-900 font-display">34 consultations</p>
              <p className="text-slate-500 text-2xs leading-relaxed font-light font-sans">Patients actively allocated or referred to clinical coordinators.</p>
            </div>
            
            <div className="pt-3.5 border-t border-slate-200/50 flex justify-between text-2xs text-slate-500 items-center">
              <span>Referral Qualification:</span>
              <strong className="text-[#3b6eae] font-bold bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md">26.4% Qual</strong>
            </div>
          </div>

          {/* Step 3: GMAA Heartbeat Red Glow Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-[#0e1726] text-white border border-slate-800 space-y-4 hover:border-[#D91B24]/40 transition-all duration-300 relative group">
            {/* Soft futuristic backdrop pulse glow */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#D91B24]/10 rounded-full blur-xl group-hover:bg-[#D91B24]/15 transition-all" />
            
            <div className="flex justify-between items-center relative z-10">
              <span className="text-4xs font-mono font-bold text-slate-500 uppercase tracking-widest">Step 03: Completed</span>
              <span className="text-3xs font-bold text-[#D91B24] bg-[#D91B24]/10 border border-[#D91B24]/20 px-2 py-0.5 rounded-md flex items-center gap-1">
                <Zap className="h-3 w-3 animate-bounce" />
                Awarded Casework
              </span>
            </div>
            <div className="space-y-1.5 relative z-10">
              <p className="text-2xl font-bold text-white font-display">4 Projects Won</p>
              <p className="text-slate-400 text-2xs leading-relaxed font-light">Commercial service bids successfully processed by billing units.</p>
            </div>
            
            <div className="pt-3.5 border-t border-slate-800 flex justify-between text-2xs text-slate-400 items-center relative z-10">
              <span>Overall Captured Volume:</span>
              <strong className="text-[#D91B24] font-bold bg-[#D91B24]/10 px-2.5 py-0.5 rounded-md border border-[#D91B24]/30">$1,760,000</strong>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}