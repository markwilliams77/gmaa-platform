/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Plus, 
  ArrowUpRight, 
  Eye, 
  Edit, 
  Users, 
  FileSpreadsheet, 
  MessageSquare, 
  Award, 
  ShieldCheck, 
  Clock,
  ArrowRight,
  LockKeyhole,
  TrendingUp,
  Globe2,
  Activity
} from "lucide-react";
import { ActiveTab } from "../types";
import { 
  MOCK_KPIS, 
  MOCK_FUNNEL, 
  MOCK_TENDER_PERFORMANCE, 
  MOCK_ACTIVITIES,
  MOCK_COMPETITIVE_INSIGHTS,
} from "../mockData";
import ApprovalPendingOverlay from "./ApprovalPendingOverlay";

interface DashboardHomeProps {
  vendorName: string;
  setActiveTab: (tab: ActiveTab) => void;
  openPublicProfileModal: () => void;
  onQuickSearchTreatment: (term: string) => void;
  isApprovedVendor: boolean;
  showToast: (
    message: string,
    type?: "success" | "info" | "warning"
  ) => void;
}

export default function DashboardHome({
  vendorName,
  setActiveTab,
  openPublicProfileModal,
  onQuickSearchTreatment,
  isApprovedVendor,
  showToast,
}: DashboardHomeProps) {

  return (
    <div className="space-y-8 animate-fade-in text-slate-800">
      
      {/* 1. HERO SECTION (Custom Tailored GMAA Deep Blue Theme) */}
      <section 
        id="dashboard-hero-section"
        className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1a30] to-[#12284c] px-8 py-10 text-white shadow-xl border border-blue-900/40"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/3 -ml-16 -mb-16 h-72 w-72 rounded-full bg-[#D91B24]/5 blur-3xl" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-400/10 px-3 py-1 text-[10px] font-bold text-blue-300 border border-blue-400/20 uppercase tracking-wider">
              <span className="h-1.5 w-1.5 bg-[#D91B24] rounded-full animate-pulse" />
              GMAA Gold Alliance Verified
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-sky-100 to-white">{vendorName}! 👋</span>
            </h1>
            <p className="text-slate-300 font-sans font-light text-xs max-w-xl leading-relaxed">
              Your facility portal is synchronized with Global Med Access Alliance. Monitor live international assistance files, compete for specialized treatment tenders, and manage consultations.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              id="hero-quick-profile-btn"
              onClick={() => {
                if (!isApprovedVendor) {
                  showToast(
                    "Your public listing will be available after your organization has been approved.",
                    "info"
                  );
                  return;
                }
                openPublicProfileModal();
              }}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold transition-all ${
                isApprovedVendor
                  ? "bg-[#2E5B9A] text-white hover:bg-[#3b6eae] active:scale-95 shadow-lg shadow-blue-500/15"
                  : "bg-slate-800/60 text-slate-400 border border-slate-700 cursor-not-allowed"
              }`}
            >
              {isApprovedVendor ? (
                <Eye className="h-4 w-4" />
              ) : (
                <LockKeyhole className="h-4 w-4 text-amber-400" />
              )}
              View Public Listing
            </button>

            <button
              id="hero-tenders-jump-btn"
              onClick={() => {
                if (!isApprovedVendor) {
                  showToast(
                    "Tender participation will unlock after your organization has been approved.",
                    "info"
                  );
                  return;
                }
                setActiveTab(ActiveTab.MyTenders);
              }}
              className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold transition-all ${
                isApprovedVendor
                  ? "bg-slate-800/80 text-slate-100 hover:bg-slate-700 active:scale-95 border border-slate-700/60"
                  : "bg-slate-800/60 text-slate-400 border border-slate-700 cursor-not-allowed"
              }`}
            >
              {isApprovedVendor ? (
                <>
                  Participate in Tenders
                  <ArrowRight className="h-4 w-4 text-blue-400" />
                </>
              ) : (
                <>
                  <LockKeyhole className="h-4 w-4 text-amber-400" />
                  Participate in Tenders
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Summary Widgets */}
        {isApprovedVendor && (
          <div className="relative mt-8 pt-6 border-t border-slate-800/70 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/55">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">New Actions</span>
              <p className="text-xs font-semibold text-slate-100 mt-1">12 New Consultations</p>
            </div>
            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/55">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Tenders Pipeline</span>
              <p className="text-xs font-semibold text-slate-100 mt-1">8 Open Tenders</p>
            </div>
            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/55">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">Direct Channel</span>
              <p className="text-xs font-semibold text-slate-100 mt-1">4 Unread Messages</p>
            </div>
            <div className="p-3 bg-slate-950/40 rounded-xl border border-slate-800/55">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-medium">GMAA Contracts</span>
              <p className="text-xs font-semibold text-slate-100 mt-1">2 Active Projects</p>
            </div>
          </div>
        )}
      </section>

      {/* BLUR CONTAINER FOR NON-APPROVED VENDORS */}
      <div className="relative">
        <div className={!isApprovedVendor ? "blur-md pointer-events-none select-none" : ""}>
          
          {/* 2. CORE METRICS GRID (Polished Slate Bento Cards matched to GMAA Colors) */}
          <section id="dashboard-kpis-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Active Leads (Mapped to Consultations) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md">
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-medium">Active Leads</span>
                <h3 className="text-2xl font-bold text-slate-900">{MOCK_KPIS.consultations.value}</h3>
                <div className="flex items-center space-x-1 text-[10px]">
                  <span className="text-[#2E5B9A] font-semibold flex items-center">
                    <TrendingUp className="h-3 w-3 mr-0.5" />
                    {MOCK_KPIS.consultations.change}
                  </span>
                  <span className="text-slate-400">vs last 30 days</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#2E5B9A] flex items-center justify-center text-lg">
                <Users className="h-5 w-5" />
              </div>
            </div>

            {/* Tender Invitations */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md">
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-medium">Tender Invitations</span>
                <h3 className="text-2xl font-bold text-slate-900">{MOCK_KPIS.tenders.value}</h3>
                <div className="flex items-center space-x-1 text-[10px]">
                  <span className="text-[#2E5B9A] font-semibold flex items-center">
                    <TrendingUp className="h-3 w-3 mr-0.5" />
                    + 14%
                  </span>
                  <span className="text-slate-400">vs last 30 days</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-[#EBF3FC] text-[#2E5B9A] flex items-center justify-center text-lg">
                <FileSpreadsheet className="h-5 w-5" />
              </div>
            </div>

            {/* Profile Views */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md">
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-medium">Profile Views</span>
                <h3 className="text-2xl font-bold text-slate-900">{MOCK_KPIS.profileViews.value}</h3>
                <div className="flex items-center space-x-1 text-[10px]">
                  <span className="text-[#2E5B9A] font-semibold flex items-center">
                    <TrendingUp className="h-3 w-3 mr-0.5" />
                    {MOCK_KPIS.profileViews.change}
                  </span>
                  <span className="text-slate-400">vs last 30 days</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-lg">
                <Eye className="h-5 w-5" />
              </div>
            </div>

            {/* Awards / Projects Awarded */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between transition-all hover:shadow-md">
              <div className="space-y-2">
                <span className="text-xs text-slate-400 font-medium">Projects Awarded</span>
                <h3 className="text-2xl font-bold text-slate-900">{MOCK_KPIS.awards.value}</h3>
                <div className="flex items-center space-x-1 text-[10px]">
                  <span className="text-emerald-600 font-semibold flex items-center">
                    <TrendingUp className="h-3 w-3 mr-0.5" />
                    + 22%
                  </span>
                  <span className="text-slate-400">vs last 30 days</span>
                </div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-lg">
                <Award className="h-5 w-5" />
              </div>
            </div>

          </section>

          {/* 3. PERFORMANCE CHART AND RECENT ACTIVITY ROW */}
          <section id="dashboard-performance-section" className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            
            {/* Marketplace Performance Metric Graphic */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Marketplace Performance</h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Profile Views <span className="text-[#2E5B9A] font-bold">{MOCK_KPIS.profileViews.value}</span> ({MOCK_KPIS.profileViews.change} from last month)
                  </p>
                </div>
                <div className="text-[10px] font-bold font-mono px-2.5 py-1.5 bg-slate-50 text-[#2E5B9A] border border-blue-100 rounded-lg">
                  THIS QUARTER
                </div>
              </div>

              {/* Responsive SVG Line Chart in GMAA Brand Blues */}
              <div className="h-44 w-full relative mb-6">
                <svg className="w-full h-full" viewBox="0 0 500 150" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2E5B9A" stopOpacity="0.2"/>
                      <stop offset="100%" stopColor="#2E5B9A" stopOpacity="0.0"/>
                    </linearGradient>
                  </defs>
                  <line x1="0" y1="30" x2="500" y2="30" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="70" x2="500" y2="70" stroke="#f1f5f9" strokeWidth="1" />
                  <line x1="0" y1="110" x2="500" y2="110" stroke="#f1f5f9" strokeWidth="1" />
                  <path
                    d="M 0,110 Q 75,70 150,100 T 300,60 T 425,75 T 500,30 L 500,150 L 0,150 Z"
                    fill="url(#chartGradient)"
                  />
                  <path
                    d="M 0,110 Q 75,70 150,100 T 300,60 T 425,75 T 500,30"
                    fill="none"
                    stroke="#2E5B9A"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                  <circle cx="500" cy="30" r="4" fill="#2E5B9A" />
                </svg>
                <div className="flex justify-between text-[10px] text-slate-400 mt-2">
                  <span>Apr 15</span>
                  <span>Apr 22</span>
                  <span>Apr 29</span>
                  <span>May 6</span>
                  <span>May 13</span>
                </div>
              </div>

              {/* Sub-Metric Rows */}
              <div className="grid grid-cols-4 gap-4 border-t pt-6 border-slate-100">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Referral Files</p>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{MOCK_FUNNEL.received} <span className="text-[#2E5B9A] text-[10px]">▲ 22%</span></h4>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Responded</p>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{MOCK_FUNNEL.contacted} <span className="text-[#2E5B9A] text-[10px]">▲ 16%</span></h4>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Qualified</p>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{MOCK_FUNNEL.qualified} <span className="text-[#2E5B9A] text-[10px]">▲ 31%</span></h4>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Profile Progress</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#2E5B9A] h-full rounded-full" style={{ width: '85%' }}></div>
                    </div>
                    <span className="text-[11px] font-bold text-slate-800">85%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Marketplace Activity Logs */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-bold text-slate-900">Recent Activity</h3>
                <button 
                  onClick={() => setActiveTab(ActiveTab.Messages)}
                  className="text-[11px] text-[#2E5B9A] font-bold hover:underline"
                >
                  View All
                </button>
              </div>
              
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[280px]">
                {MOCK_ACTIVITIES.slice(0, 5).map((act) => (
                  <div key={act.id} className="flex items-start justify-between text-xs py-1">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm shrink-0 ${
                        act.type === "consultation" ? "bg-pink-50 text-pink-600" :
                        act.type === "tender_invitation" ? "bg-blue-50 text-[#2E5B9A]" :
                        act.type === "bid_submitted" ? "bg-[#EBF3FC] text-[#2E5B9A]" :
                        act.type === "tender_awarded" ? "bg-emerald-50 text-emerald-600" :
                        "bg-purple-50 text-purple-600"
                      }`}>
                        {act.type === "consultation" && <Users className="h-4 w-4" />}
                        {act.type === "tender_invitation" && <FileSpreadsheet className="h-4 w-4" />}
                        {act.type === "bid_submitted" && <Clock className="h-4 w-4" />}
                        {act.type === "tender_awarded" && <Award className="h-4 w-4" />}
                        {act.type === "profile_update" && <ShieldCheck className="h-4 w-4" />}
                      </div>
                      <div className="min-w-0">
                        <h5 className="font-semibold text-slate-850 leading-tight truncate">{act.text}</h5>
                        <p className="text-[10px] text-slate-400 mt-0.5 capitalize">{act.type.replace("_", " ")}</p>
                      </div>
                    </div>
                    <span className="text-[9px] text-slate-400 shrink-0 font-medium pl-2">{act.time}</span>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => setActiveTab(ActiveTab.Messages)}
                className="w-full border border-slate-100 hover:bg-[#EBF3FC]/30 text-[11px] font-bold py-2.5 rounded-xl text-[#2E5B9A] transition-all mt-4"
              >
                View System Logs →
              </button>
            </div>
          </section>

          {/* 4. OPPORTUNITIES, BENTO MODULES, AND PROGRESS SECTION */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            
            {/* Opportunities at a Glance */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-6">Opportunities at a Glance</h3>
                <div className="space-y-4">
                  {/* Tenders Mini Tracker */}
                  <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Tenders Activity</p>
                      <h4 className="text-xl font-bold text-slate-900 mt-1">{MOCK_TENDER_PERFORMANCE.invited}</h4>
                      <p className="text-[10px] text-slate-400">Pending Invitations</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab(ActiveTab.MyTenders)}
                      className="bg-white border border-slate-100 text-[11px] font-bold px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-700 shadow-sm"
                    >
                      View Tenders →
                    </button>
                  </div>

                  {/* Consultations Mini Tracker */}
                  <div className="bg-slate-50 p-4 rounded-xl flex justify-between items-center border border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Leads & Inquiries</p>
                      <h4 className="text-xl font-bold text-slate-900 mt-1">{MOCK_FUNNEL.received}</h4>
                      <p className="text-[10px] text-slate-400">Total Referrals Assigned</p>
                    </div>
                    <button 
                      onClick={() => setActiveTab(ActiveTab.Consultations)}
                      className="bg-white border border-slate-100 text-[11px] font-bold px-4 py-2 rounded-xl hover:bg-slate-100 text-slate-700 shadow-sm"
                    >
                      View Leads →
                    </button>
                  </div>
                </div>
              </div>

              {/* Fast Operations Dial */}
              <div className="mt-6 border-t pt-6 border-slate-100">
                <h4 className="text-xs font-bold text-slate-900 mb-3">Quick Actions</h4>
                <div className="grid grid-cols-5 gap-2">
                  <button 
                    onClick={openPublicProfileModal}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-base">🌐</span>
                    <span className="text-[8px] text-slate-500 font-bold mt-1 text-center truncate w-full">Public Profile</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab(ActiveTab.ProfileManagement)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-base">✏️</span>
                    <span className="text-[8px] text-slate-500 font-bold mt-1 text-center truncate w-full">Edit Profile</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab(ActiveTab.MyTenders)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-base">📋</span>
                    <span className="text-[8px] text-slate-500 font-bold mt-1 text-center truncate w-full">Tenders</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab(ActiveTab.Consultations)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-base">👥</span>
                    <span className="text-[8px] text-slate-500 font-bold mt-1 text-center truncate w-full">Referrals</span>
                  </button>
                  <button 
                    onClick={() => setActiveTab(ActiveTab.Messages)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <span className="text-base">✉️</span>
                    <span className="text-[8px] text-slate-500 font-bold mt-1 text-center truncate w-full">Messages</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Profile & Website Status Bento Module */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-6">Profile & Website Status</h3>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                    <span className="text-slate-400">Website Status</span>
                    <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full font-bold text-[10px]">Published</span>
                  </div>
                  <div className="pb-2 border-b border-slate-100">
                    <div className="flex justify-between items-center text-xs mb-2">
                      <span className="text-slate-400">Profile Completeness</span>
                      <span className="font-bold text-slate-700">85%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-[#2E5B9A] h-full rounded-full" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-100">
                    <span className="text-slate-400">Verification Status</span>
                    <span className="bg-blue-50 text-[#2E5B9A] px-2 py-0.5 rounded-full font-bold text-[10px]">Verified</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Featured Status</span>
                    <span className="bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full font-bold text-[10px]">Featured</span>
                  </div>
                </div>
              </div>

              {/* Secure Subscription Verification tailored to Logo Red Accent */}
              <div className="bg-blue-50/30 p-4 rounded-xl border border-blue-500/10 mt-6">
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="font-bold text-slate-800">Alliance Gold Plan</span>
                  <span className="bg-[#D91B24]/10 text-[#D91B24] text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">Active</span>
                </div>
                <p className="text-[10px] text-slate-400 mb-3">Compliance Verified Profile</p>
                <div className="grid grid-cols-2 gap-1.5 text-[9px] text-slate-600">
                  <span className="bg-white/70 py-1 px-2 rounded border border-slate-100 text-center truncate">Priority Bidding</span>
                  <span className="bg-white/70 py-1 px-2 rounded border border-slate-100 text-center truncate">Global Cohorts</span>
                </div>
              </div>
            </div>

            {/* Performance Conversion CTA */}
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 p-6 rounded-2xl shadow-sm border border-slate-200/50 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-md mb-4 text-[#D91B24] text-2xl border border-slate-100">
                ✓
              </div>
              <h3 className="text-sm font-bold text-slate-900 mb-1">Great job!</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs mb-6">
                Your profiles are globally broadcasted to secure regional clusters. Review live layouts instantly.
              </p>
              <button 
                onClick={() => {
                  if (isApprovedVendor) {
                    openPublicProfileModal();
                  } else {
                    showToast("Profile listing will unlock after verification.", "info");
                  }
                }}
                className="bg-white border hover:bg-slate-50 text-xs font-bold py-2.5 px-6 rounded-xl text-slate-700 shadow-sm transition-colors w-full"
              >
                Preview Website ↗
              </button>
            </div>

          </section>

          {/* 5. ANONYMIZED COMPETITIVE INSIGHTS BAR (GMAA Red Accent Bullet Dots) */}
          <section id="dashboard-insights-bar" className="mt-8 bg-slate-100/50 p-4 rounded-2xl border border-slate-200/50">
            <span className="text-3xs font-semibold text-slate-400 uppercase tracking-widest block mb-3 pl-1 font-display">
              Alliance Intelligence Optimization
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {MOCK_COMPETITIVE_INSIGHTS.map((insight, idx) => (
                <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200/50 flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2E5B9A] flex items-center justify-center text-sm shrink-0">
                    💡
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-800">{insight.title}</h5>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">{insight.description}</p>
                    <span className="inline-block mt-2 text-[9px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono font-bold">
                      {insight.rating}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

        </div>

        {/* APPROVAL PENDING OVERLAY RENDERING */}
        {!isApprovedVendor && (
          <ApprovalPendingOverlay
            onProfileClick={() => setActiveTab(ActiveTab.ProfileManagement)}
            onMessagesClick={() => setActiveTab(ActiveTab.Messages)}
          />
        )}
      </div>
    </div>
  );
}