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
  Compass, 
  ArrowRight,
  TrendingDown,
  Percent
} from "lucide-react";
import { 
  MOCK_KPIS, 
  MOCK_GEOGRAPHY_COUNTRIES, 
  MOCK_GEOGRAPHY_CITIES, 
  MOCK_SEARCHED_SERVICES,
  MOCK_TOP_TREATMENTS 
} from "../mockData";

export default function AnalyticsView() {
  const [timeRange, setTimeRange] = useState("Last 30 Days");

  // Mock charts details (Coordinates of beautiful Stripe line chart curve representation)
  const lineChartPoints = "10,90 40,50 80,75 120,30 160,40 200,15 240,45 280,10 320,35 360,20 400,5 440,25 480,15 520,30 560,5";
  const barChartValues = [
    { label: "01 Jun", value: 45 },
    { label: "03 Jun", value: 68 },
    { label: "05 Jun", value: 52 },
    { label: "07 Jun", value: 89 },
    { label: "09 Jun", value: 74 },
    { label: "11 Jun", value: 92 },
    { label: "13 Jun", value: 81 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans uppercase tracking-widest">
            <span>Marketplace intelligence</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-650">Analytics & Conversion Rates</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mt-1">Provider Metrics Studio</h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Identify patient search intents, country demographics, and conversions within GMAA networks.
          </p>
        </div>

        {/* Period toggle selector */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-white border border-slate-200 text-xs font-semibold font-sans px-3 py-1.5 rounded-xl hover:border-slate-350 focus:outline-none"
        >
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>Last Quarter</option>
          <option>Fiscal Year 2026</option>
        </select>
      </div>

      {/* 1. TRAFFIC OVERVIEW PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core numbers */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-3xs flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-display font-semibold text-slate-950 font-sans text-sm">Audience Traffic Summary</h3>
            <p className="text-2xs text-slate-400 font-sans leading-normal">
              Marketplace crawl impressions, profile clicks, and average user dwell time of GMAA assistants finding specialists.
            </p>

            <div className="divide-y divide-slate-100">
              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest font-display block">Total Clicks</span>
                  <p className="font-display text-lg font-bold text-slate-950 mt-1">12,486 Views</p>
                </div>
                <span className="text-2xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+18% MoM</span>
              </div>

              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest font-display block">Unique Evac Inquiries</span>
                  <p className="font-display text-lg font-bold text-slate-950 mt-1">426 Submissions</p>
                </div>
                <span className="text-2xs font-semibold text-emerald-650 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+12.4%</span>
              </div>

              <div className="py-3.5 flex items-center justify-between">
                <div>
                  <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest font-display block">Avg Engagement Dwell</span>
                  <p className="font-display text-lg font-bold text-slate-950 mt-1">4m 32s</p>
                </div>
                <span className="text-2xs font-semibold text-emerald-650 text-slate-400 bg-slate-100 px-2 py-0.5 rounded">Steady</span>
              </div>
            </div>

          </div>

          <div className="mt-6 pt-5 border-t border-slate-150">
            <span className="text-3xs uppercase tracking-wide text-slate-400 font-display font-semibold block mb-2">Search Conversion Ratio</span>
            <div className="flex items-center justify-between font-sans text-xs">
              <span className="text-slate-500 font-light">Impressions to Consultation</span>
              <strong className="text-slate-900 font-semibold">3.41% Yield</strong>
            </div>
          </div>
        </div>

        {/* Stripe style curved trend chart */}
        <div className="lg:col-span-2 bg-slate-950 text-white rounded-3xl p-6 shadow-md border border-slate-900 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <span className="text-3xs font-semibold text-cyan-400 uppercase tracking-widest font-display">Live Clicks Stream</span>
              <h3 className="font-display font-bold text-lg text-white">Daily Marketplace Clicks Curve</h3>
            </div>
            <span className="text-2xs font-sans text-slate-400 font-semibold">Active: {timeRange}</span>
          </div>

          {/* SVG Line representation */}
          <div className="relative h-44 w-full my-4 flex items-end">
            <svg viewBox="0 0 600 100" className="w-full h-full stroke-cyan-400 stroke-2" fill="none">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#0B132B" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path d={`M ${lineChartPoints}`} className="stroke-cyan-400 stroke-[2.5]" />
              {/* Filled gradient area under line */}
              <path d={`M 10,100 L ${lineChartPoints} L 560,100 Z`} fill="url(#chartGrad)" stroke="none" />
            </svg>
          </div>

          {/* Grid dates strip */}
          <div className="flex justify-between text-4xs font-mono text-slate-500 border-t border-slate-900 pt-3">
            <span>WEEK 01</span>
            <span>WEEK 02</span>
            <span>WEEK 03</span>
            <span>WEEK 04</span>
          </div>
        </div>

      </div>

      {/* 2. GEOGRAPHIES AND SEARCH ANALYTICS GRAPHICS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Country Demographics */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-slate-900 text-sm">Country Lead Distribution</h3>
              <Globe2 className="h-4.5 w-4.5 text-cyan-600" />
            </div>

            <p className="text-2xs text-slate-400 leading-normal font-sans mb-6">
              Geographical hotspots initiating direct emergency / planned treatment requests on GMAA.
            </p>

            <div className="space-y-4">
              {MOCK_GEOGRAPHY_COUNTRIES.map((cnt) => (
                <div key={cnt.country} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-700 font-sans font-semibold flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: cnt.color }} />
                      {cnt.country}
                    </span>
                    <span className="text-slate-800 font-semibold">{cnt.percentage}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ backgroundColor: cnt.color, width: `${cnt.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-slate-100 flex items-center gap-2">
            <span className="text-3xs text-slate-400">Hub coverage:</span>
            <span className="text-2xs font-semibold font-sans bg-cyan-50 text-cyan-600 border border-cyan-100 px-2 py-0.5 rounded">Europe</span>
            <span className="text-2xs font-semibold font-sans bg-cyan-50 text-cyan-600 border border-cyan-100 px-2 py-0.5 rounded">Africa</span>
            <span className="text-2xs font-semibold font-sans bg-cyan-50 text-cyan-600 border border-cyan-100 px-2 py-0.5 rounded">GCC</span>
          </div>
        </div>

        {/* Hotspot Cities bar representation */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-slate-900 text-sm">Target Hotspot Cities</h3>
              <MapPin className="h-4.5 w-4.5 text-cyan-500" />
            </div>

            <p className="text-2xs text-slate-400 leading-normal font-sans mb-6">
              Active metro hubs routing continuous corporate referrals down to gold partner clinics.
            </p>

            <div className="space-y-4">
              {MOCK_GEOGRAPHY_CITIES.map((city) => (
                <div key={city.name} className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-100 group hover:border-cyan-200 transition-all text-xs">
                  <div className="space-y-0.5">
                    <p className="font-semibold text-slate-800">{city.name}</p>
                    <p className="text-3xs text-slate-400 font-sans">Territory Core: {city.region}</p>
                  </div>
                  <strong className="text-slate-900 font-bold">{city.count} Inquiries</strong>
                </div>
              ))}
            </div>
          </div>

          <p className="text-4xs text-slate-400 font-sans italic mt-4">
            *Aggregated values updated in real time via GMAA geo-location logs.
          </p>
        </div>

        {/* Service searched bar percentages */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-3xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-semibold text-slate-900 text-sm">Top Services Searched</h3>
              <Activity className="h-4.5 w-4.5 text-indigo-600" />
            </div>

            <p className="text-2xs text-slate-400 leading-normal font-sans mb-6">
              Total member search intentions inside GMAA platform directory.
            </p>

            <div className="space-y-3.5">
              {MOCK_SEARCHED_SERVICES.map((srv, idx) => (
                <div key={srv.name} className="flex items-center justify-between group">
                  <span className="text-xs font-semibold text-slate-700 min-w-32 font-sans">{srv.name}</span>
                  
                  {/* Dynamic percentage bar */}
                  <div className="flex-1 mx-3 bg-slate-50 h-3 rounded overflow-hidden relative">
                    <div 
                      className={`h-full ${
                        idx === 0 ? "bg-cyan-500" :
                        idx === 1 ? "bg-blue-500" :
                        idx === 2 ? "bg-indigo-500" :
                        idx === 3 ? "bg-cyan-400" :
                        "bg-slate-300"
                      }`} 
                      style={{ width: `${srv.percentage}%` }} 
                    />
                  </div>

                  <span className="text-2xs font-semibold text-slate-500 font-mono w-8 text-right">{srv.percentage}%</span>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full h-8.5 rounded-xl border border-slate-200 hover:border-cyan-300 text-2xs font-semibold text-slate-650 hover:text-slate-900 flex items-center justify-center gap-1.5 transition-all mt-6">
            View Specialty Report
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

      </div>

      {/* 3. MULTI-STEP CONVERSION ANALYSIS PIPELINE */}
      <section id="conversion-analytics-widget" className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
        <div>
          <h3 className="font-display font-bold text-slate-900">Multi-Step Funnel Conversion Pipeline</h3>
          <p className="text-xs text-slate-400 font-sans mt-0.5">Understand how marketplace profile views convert down to successfully awarded project value.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative font-sans text-xs">
          
          {/* Step 1 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 relative">
            <div className="flex justify-between items-center">
              <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest font-display">Step 1: Exposure</span>
              <span className="text-3xs font-bold text-cyan-600 bg-cyan-50 border border-cyan-100 px-1.5 py-0.2 rounded font-mono">Stage: Views to Inquiries</span>
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-slate-900 font-display">12,486 views</p>
              <p className="text-slate-500 text-2xs font-light">Total times hospital profile arose in marketplace search.</p>
            </div>
            
            <div className="pt-3 border-t border-slate-200/50 flex justify-between text-2xs text-slate-450 text-slate-500">
              <span>Primary Conversion:</span>
              <strong className="text-cyan-600 font-bold">12.8% Conversion</strong>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-3 relative">
            <div className="flex justify-between items-center">
              <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest font-display">Step 2: Engagement</span>
              <span className="text-3xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-1.5 py-0.2 rounded font-mono">Stage: Inquiries to Direct Class</span>
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-slate-900 font-display">34 consultations</p>
              <p className="text-slate-500 text-2xs font-light">Patients actively allocated / self-referred to clinical coordinators.</p>
            </div>
            
            <div className="pt-3 border-t border-slate-200/50 flex justify-between text-2xs text-slate-500">
              <span>Medical Qualification:</span>
              <strong className="text-blue-600 font-bold">26.4% Qualification</strong>
            </div>
          </div>

          {/* ... Step 3 */}
          <div className="p-4 rounded-2xl bg-slate-950 text-white border border-slate-900 space-y-3 relative">
            <div className="flex justify-between items-center">
              <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest font-display">Step 3: Revenue</span>
              <span className="text-3xs font-bold text-emerald-400 bg-emerald-900/40 border border-emerald-500/20 px-1.5 py-0.2 rounded font-mono">Stage: Bids to Awarded</span>
            </div>
            <div className="space-y-1">
              <p className="text-xl font-bold text-white font-display">4 Projects Won</p>
              <p className="text-slate-400 text-2xs font-light">Total commercial bids successfully cleared by the audit unit.</p>
            </div>
            
            <div className="pt-3 border-t border-slate-900/60 flex justify-between text-2xs text-slate-400">
              <span>Overall Revenue Won:</span>
              <strong className="text-emerald-400 font-bold">$1,760,000 Volume</strong>
            </div>
          </div>

        </div>

      </section>

    </div>
  );
}
