/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Plus, 
  ArrowUpRight, 
  Eye, 
  Edit, 
  Users, 
  FileSpreadsheet, 
  MessageSquare, 
  CheckCircle2, 
  Award, 
  ShieldCheck, 
  Activity, 
  Globe2, 
  Building2, 
  Check, 
  HelpCircle,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  LockKeyhole
} from "lucide-react";
import { ActiveTab, ConsultationStatus, TenderStatus } from "../types";
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
  // Profile score interactive simulation state

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. HERO SECTION (Stripe-Style Slate Layout with Premium Polish) */}
      <section 
        id="dashboard-hero-section"
        className="relative overflow-hidden rounded-[2rem] bg-slate-900 px-8 py-11 text-white shadow-[0_20px_50px_-20px_rgba(15,23,42,0.4)] border border-slate-800"
      >
        <div className="absolute top-0 right-0 -mr-16 -mt-16 h-72 w-72 rounded-full bg-cyan-500/15 blur-3xl animate-pulse" />
        <div className="absolute bottom-0 left-1/3 -ml-16 -mb-16 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl font-light" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/10 px-3.5 py-1 text-4xs font-bold text-cyan-400 border border-cyan-400/20 uppercase tracking-widest font-mono">
              <span className="h-1.5 w-1.5 bg-cyan-400 rounded-full animate-ping" />
              GMAA Gold Alliance Verified
            </div>
            <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
              Welcome Back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-200 to-white">{vendorName}</span>
            </h1>
            <p className="text-slate-300 font-sans font-light text-sm max-w-xl leading-relaxed">
              Your facility is synchronized. Monitor live global assistance cohorts, compete for specialized patient treatment tenders, and manage consultations securely.
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
    className={`inline-flex items-center gap-2 rounded-xl px-5.5 py-3 text-xs font-semibold transition-all ${
      isApprovedVendor
        ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400 active:scale-95 shadow-lg shadow-cyan-500/15"
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
    className={`inline-flex items-center gap-2 rounded-xl px-5.5 py-3 text-xs font-semibold transition-all ${
      isApprovedVendor
        ? "bg-slate-800/80 text-slate-100 hover:bg-slate-700 active:scale-95 border border-slate-700/60"
        : "bg-slate-800/60 text-slate-400 border border-slate-700 cursor-not-allowed"
    }`}
  >
    {isApprovedVendor ? (
      <>
        Participate in Tenders
        <ArrowRight className="h-4 w-4 text-cyan-400 animate-pulse" />
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

        {/* Quick Summary Widget Grid */}
        {isApprovedVendor && (
        <div className="relative mt-10 pt-8 border-t border-slate-800/75 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-950/45 rounded-2xl border border-slate-800/60 transition-all hover:bg-slate-950/70">
            <span className="text-4xs font-bold uppercase tracking-widest text-slate-400 font-mono">New Actions</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              <p className="text-xs font-semibold text-slate-100">12 New Consultations</p>
            </div>
          </div>
          <div className="p-4 bg-slate-950/45 rounded-2xl border border-slate-800/60 transition-all hover:bg-slate-950/70">
            <span className="text-4xs font-bold uppercase tracking-widest text-slate-400 font-mono">Tenders Pipeline</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              <p className="text-xs font-semibold text-slate-100 font-sans">8 Open Tenders</p>
            </div>
          </div>
          <div className="p-4 bg-slate-950/45 rounded-2xl border border-slate-800/60 transition-all hover:bg-slate-950/70">
            <span className="text-4xs font-bold uppercase tracking-widest text-slate-400 font-mono">Direct Channel</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
              <p className="text-xs font-semibold text-slate-100">4 Unread Messages</p>
            </div>
          </div>
          <div className="p-4 bg-slate-950/45 rounded-2xl border border-slate-800/60 transition-all hover:bg-slate-950/70">
            <span className="text-4xs font-bold uppercase tracking-widest text-slate-400 font-mono">GMAA Contracts</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <p className="text-xs font-semibold text-slate-100">2 Active Projects</p>
            </div>
          </div>
        </div>
        )}
      </section>

      <div className="relative">
        <div className={ !isApprovedVendor ? "blur-md pointer-events-none select-none" : "" }>
      {/* 2. KPI CARDS SECTION (Exquisite Premium Bento Style Layout) */}
      
      < section id="dashboard-kpis-grid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" >
        
        {/* Card 1: Profile Views */}
        <div 
          id="kpi-card-profile-views"
          className="group relative overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_2px_12px_-5px_rgba(0,0,0,0.04),0_8px_32px_-4px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-cyan-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest font-mono">{MOCK_KPIS.profileViews.label}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 transition-colors group-hover:bg-cyan-100">
              <Eye className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-5 flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold tracking-tight text-slate-950">{MOCK_KPIS.profileViews.value}</span>
            <span className="text-3xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center shrink-0">
              <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
              {MOCK_KPIS.profileViews.change}
            </span>
          </div>
          <p className="mt-2.5 text-2xs text-slate-400 font-sans font-light">Marketplace impressions this month</p>
        </div>

        {/* Card 2: Consultation Requests */}
        <div 
          id="kpi-card-consultations"
          className="group relative overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_2px_12px_-5px_rgba(0,0,0,0.04),0_8px_32px_-4px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-blue-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest font-mono">{MOCK_KPIS.consultations.label}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
              <Users className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-5 flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold tracking-tight text-slate-950">{MOCK_KPIS.consultations.value}</span>
            <span className="text-3xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center shrink-0">
              <TrendingUp className="h-2.5 w-2.5 mr-0.5" />
              {MOCK_KPIS.consultations.change}
            </span>
          </div>
          <p className="mt-2.5 text-2xs text-slate-400 font-sans font-light">Direct referral files assigned</p>
        </div>

        {/* Card 3: Tender Invitations */}
        <div 
          id="kpi-card-tenders-invites"
          className="group relative overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_2px_12px_-5px_rgba(0,0,0,0.04),0_8px_32px_-4px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-indigo-500/20"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest font-mono">{MOCK_KPIS.tenders.label}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
              <FileSpreadsheet className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-5 flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold tracking-tight text-slate-950">{MOCK_KPIS.tenders.value}</span>
            <span className="text-3xs font-extrabold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md shrink-0">
              {MOCK_KPIS.tenders.change}
            </span>
          </div>
          <p className="mt-2.5 text-2xs text-slate-400 font-sans font-light">Corporate tenders matching specs</p>
        </div>

        {/* Card 4: Projects Awarded */}
        <div 
          id="kpi-card-awarded"
          className="group relative overflow-hidden rounded-[1.75rem] border border-slate-100 bg-white p-6 shadow-[0_2px_12px_-5px_rgba(0,0,0,0.04),0_8px_32px_-4px_rgba(0,0,0,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-slate-800"
        >
          <div className="flex items-center justify-between">
            <span className="text-3xs font-extrabold text-slate-400 uppercase tracking-widest font-mono">{MOCK_KPIS.awards.label}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-955 bg-slate-950 text-cyan-400 transition-colors">
              <Award className="h-4.5 w-4.5" />
            </div>
          </div>
          <div className="mt-5 flex items-baseline gap-2">
            <span className="font-display text-3xl font-semibold tracking-tight text-slate-950">{MOCK_KPIS.awards.value}</span>
            <span className="text-3xs font-extrabold text-cyan-400 bg-slate-900 px-2 py-0.5 rounded-md shrink-0">
              {MOCK_KPIS.awards.change}
            </span>
          </div>
          <p className="mt-2.5 text-2xs text-slate-400 font-sans font-light">Active SLA agreements successfully won</p>
        </div>

      </section>

      {/* 3. DYNAMIC QUICK ACTION LINKS */}
      <section id="dashboard-quick-actions-bar" className="bg-slate-100/50 p-4 rounded-2xl border border-slate-200/50">
        <span className="text-3xs font-semibold text-slate-400 uppercase tracking-widest block mb-3 pl-1 font-display">Fast Operations Dial</span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <button
            id="action-btn-public-prof"
            onClick={openPublicProfileModal}
            className="flex items-center gap-2.5 rounded-xl bg-white p-3 text-xs font-medium text-slate-700 hover:text-slate-900 shadow-3xs border border-slate-200 hover:border-cyan-200 transition-all text-left"
          >
            <Globe2 className="h-4 w-4 text-cyan-500" />
            <span>Public Profile</span>
          </button>
          <button
            id="action-btn-edit-prof"
            onClick={() => setActiveTab(ActiveTab.ProfileManagement)}
            className="flex items-center gap-2.5 rounded-xl bg-white p-3 text-xs font-medium text-slate-700 hover:text-slate-900 shadow-3xs border border-slate-200 hover:border-cyan-200 transition-all text-left"
          >
            <Edit className="h-4 w-4 text-indigo-500" />
            <span>Edit Profile</span>
          </button>
          <button
            id="action-btn-open-tenders"
            onClick={() => setActiveTab(ActiveTab.MyTenders)}
            className="flex items-center gap-2.5 rounded-xl bg-white p-3 text-xs font-medium text-slate-700 hover:text-slate-900 shadow-3xs border border-slate-200 hover:border-cyan-200 transition-all text-left"
          >
            <FileSpreadsheet className="h-4 w-4 text-blue-500" />
            <span>Open Tenders</span>
          </button>
          <button
            id="action-btn-view-cons"
            onClick={() => setActiveTab(ActiveTab.Consultations)}
            className="flex items-center gap-2.5 rounded-xl bg-white p-3 text-xs font-medium text-slate-700 hover:text-slate-900 shadow-3xs border border-slate-200 hover:border-cyan-200 transition-all text-left"
          >
            <Users className="h-4 w-4 text-pink-500" />
            <span>Consultations</span>
          </button>
          <button
            id="action-btn-quick-msgs"
            onClick={() => setActiveTab(ActiveTab.Messages)}
            className="col-span-2 sm:col-span-1 flex items-center gap-2.5 rounded-xl bg-white p-3 text-xs font-medium text-slate-700 hover:text-slate-900 shadow-3xs border border-slate-200 hover:border-cyan-200 transition-all text-left"
          >
            <MessageSquare className="h-4 w-4 text-violet-500" />
            <span>Open Inbox</span>
          </button>
        </div>
      </section>

      {/* 4. PERFORMANCE FUNNEL AND TENDER STAGE DIAGRAMS */}
      <section id="dashboard-performance-section" className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Consultation Performance Funnel Widget */}
        <div className="rounded-[2rem] border border-slate-100 bg-white p-7.5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03),0_12px_40px_-4px_rgba(0,0,0,0.015)]">
          <div className="flex items-center justify-between mb-7">
            <div>
              <h3 className="font-display font-semibold text-base text-slate-950 tracking-tight">Consultation Performance Funnel</h3>
              <p className="text-2xs text-slate-400 font-sans mt-0.5 font-light">Patient cohort processing efficiency</p>
            </div>
            <span className="text-[10px] font-bold font-mono px-2.5 py-1 bg-slate-50 text-slate-500 border border-slate-200/50 rounded-lg">THIS QUARTER</span>
          </div>

          <div className="space-y-5">
            
            {/* Stage: Received */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-2xs font-medium text-slate-650">
                <span className="flex items-center gap-2 font-sans">
                  <span className="h-2 w-2 rounded-full bg-cyan-400" />
                  Received Inquiries
                </span>
                <span className="font-bold text-slate-950 font-mono">{MOCK_FUNNEL.received} Cases</span>
              </div>
              <div className="h-2.5 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 rounded-full transition-all duration-1000" style={{ width: "100%" }} />
              </div>
            </div>

            {/* Stage: Contacted */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-2xs font-medium text-slate-650">
                <span className="flex items-center gap-2 font-sans pl-2">
                  <span className="h-2 w-2 rounded-full bg-blue-400" />
                  Initial Response & Contacted
                </span>
                <span className="font-bold text-slate-950 font-mono">{MOCK_FUNNEL.contacted} Cases ({Math.round((MOCK_FUNNEL.contacted/MOCK_FUNNEL.received)*100)}%)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000" style={{ width: `${(MOCK_FUNNEL.contacted/MOCK_FUNNEL.received)*100}%` }} />
              </div>
            </div>

            {/* Stage: Qualified */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-2xs font-medium text-slate-650">
                <span className="flex items-center gap-2 font-sans pl-4">
                  <span className="h-2 w-2 rounded-full bg-indigo-400" />
                  Medical Committee Qualified
                </span>
                <span className="font-bold text-slate-950 font-mono">{MOCK_FUNNEL.qualified} Cases ({Math.round((MOCK_FUNNEL.qualified/MOCK_FUNNEL.received)*100)}%)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-all duration-1000" style={{ width: `${(MOCK_FUNNEL.qualified/MOCK_FUNNEL.received)*100}%` }} />
              </div>
            </div>

            {/* Stage: Converted */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-2xs font-medium text-slate-650">
                <span className="flex items-center gap-2 font-sans pl-6">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  Successfully Converted & Checked-In
                </span>
                <span className="font-bold text-slate-950 font-mono">{MOCK_FUNNEL.converted} Cases ({Math.round((MOCK_FUNNEL.converted/MOCK_FUNNEL.received)*100)}%)</span>
              </div>
              <div className="h-2.5 w-full bg-slate-50 border border-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full transition-all duration-1000" style={{ width: `${(MOCK_FUNNEL.converted/MOCK_FUNNEL.received)*100}%` }} />
              </div>
            </div>

          </div>

          <div className="mt-7 pt-5 border-t border-slate-100 flex items-center justify-between text-2xs text-slate-400 font-sans">
            <span className="flex items-center gap-1 font-light">
              Average turnaround speed: <strong className="font-semibold text-slate-700">1.4 hours</strong>
            </span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              Top 15% overall partner conversion
            </span>
          </div>
        </div>

        {/* Tender Performance Stage Progress */}
        <div className="rounded-[2rem] border border-slate-100 bg-white p-7.5 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.03),0_12px_40px_-4px_rgba(0,0,0,0.015)] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-semibold text-base text-slate-950 tracking-tight">Alliance Tender Activity</h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5 font-light">Commercial bidding milestones won</p>
              </div>
              <span className="text-3xs font-extrabold text-cyan-600 bg-cyan-50/75 border border-cyan-150 px-2.5 py-1 rounded-lg uppercase tracking-wider font-mono">Rank: L1 Leader</span>
            </div>

            <p className="text-slate-500 font-sans text-2xs leading-relaxed bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
              <span className="font-semibold text-slate-800">Compliance Code:</span> GMAA protects provider privacy. Competitor bidding prices inside alliance workflows are strictly anonymized. Only aggregate performance metrics shown.
            </p>

            <div className="grid grid-cols-4 gap-3 text-center my-5.5">
              <div className="bg-slate-50/40 p-3.5 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Invited</p>
                <p className="text-xl font-bold text-slate-850 mt-1.5 font-display">{MOCK_TENDER_PERFORMANCE.invited}</p>
              </div>
              <div className="bg-slate-50/40 p-3.5 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Submitted</p>
                <p className="text-xl font-bold text-cyan-600 mt-1.5 font-display">{MOCK_TENDER_PERFORMANCE.submitted}</p>
              </div>
              <div className="bg-slate-50/40 p-3.5 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Ranking</p>
                <p className="text-xl font-bold text-indigo-600 mt-1.5 font-display">{MOCK_TENDER_PERFORMANCE.l1Ranking}</p>
              </div>
              <div className="bg-slate-50/40 p-3.5 rounded-2xl border border-slate-100">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono">Awarded</p>
                <p className="text-xl font-bold text-emerald-600 mt-1.5 font-display">{MOCK_TENDER_PERFORMANCE.awarded}</p>
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-4 border-t border-slate-150">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400 font-light text-2xs">Corporate Bidding Conversion Yield</span>
              <span className="font-bold text-slate-800 font-mono text-2xs">40% Submission Lead</span>
            </div>
            <div className="w-full bg-slate-50 border border-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-400" style={{ width: "40%" }} />
            </div>
          </div>

        </div>
      </section>

      {/* 7. COMPETITIVE INSIGHTS & RECENT ACTIVITY DUAL GRID */}
      <section id="dashboard-insights-activities" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Competitive Insights without exposing competitors */}
        <div className="lg:col-span-1 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-slate-900 mb-1">Elite Performance Insights</h3>
            <p className="text-xs text-slate-400 font-sans mb-5">Your alliance rank without exposed name disclosures</p>

            <div className="space-y-4">
              {MOCK_COMPETITIVE_INSIGHTS.map((insight, idx) => (
                <div 
                  key={idx} 
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 relative group hover:border-cyan-200 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-800 font-sans">{insight.title}</span>
                    <span className={`text-3xs font-bold px-2 py-0.5 rounded font-mono ${
                      insight.rating === "Outstanding" ? "bg-emerald-50 text-emerald-600" :
                      insight.rating === "Excellent" ? "bg-blue-50 text-blue-600" :
                      "bg-cyan-50 text-cyan-600"
                    }`}>
                      {insight.rating}
                    </span>
                  </div>
                  <p className="text-2xs text-slate-400 mt-1 leading-normal font-sans">{insight.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-4 rounded-2xl text-white mt-6 border border-slate-800">
            <h4 className="text-2xs font-semibold text-cyan-400 tracking-wide uppercase font-display">Optimization Plan</h4>
            <p className="text-3xs text-slate-300 mt-1 font-sans font-light">Reduce your average email response speed from 1.4 hours down to under 30 minutes to capture the top 5% badge category!</p>
          </div>
        </div>

        {/* Recent Activity Feed */}
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-display font-bold text-slate-900">Recent Marketplace Activities</h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">Real-time alerts aligned to Global Medical Alliance workflows</p>
            </div>
            <button 
              onClick={() => setActiveTab(ActiveTab.Messages)} 
              className="text-2xs font-semibold text-cyan-600 hover:text-cyan-700 flex items-center gap-1"
            >
              View System Logs
              <ArrowUpRight className="h-3 w-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {MOCK_ACTIVITIES.map((act) => (
              <div key={act.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                <div className={`h-8.5 w-8.5 rounded-xl flex items-center justify-center shrink-0 border ${
                  act.type === "consultation" ? "bg-pink-50 border-pink-100 text-pink-600" :
                  act.type === "tender_invitation" ? "bg-amber-50 border-amber-100 text-amber-600" :
                  act.type === "bid_submitted" ? "bg-blue-50 border-blue-100 text-blue-600" :
                  act.type === "tender_awarded" ? "bg-emerald-50 border-emerald-100 text-emerald-600" :
                  "bg-purple-50 border-purple-100 text-purple-600"
                }`}>
                  {act.type === "consultation" && <Users className="h-4 w-4" />}
                  {act.type === "tender_invitation" && <FileSpreadsheet className="h-4 w-4" />}
                  {act.type === "bid_submitted" && <Clock className="h-4 w-4" />}
                  {act.type === "tender_awarded" && <Award className="h-4 w-4" />}
                  {act.type === "profile_update" && <ShieldCheck className="h-4 w-4" />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-slate-800 leading-normal truncate">{act.text}</p>
                    <span className="text-3xs text-slate-400 font-mono shrink-0 ml-4">{act.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-3xs uppercase tracking-wider text-slate-400 font-bold font-mono">
                      {act.type.replace("_", " ")}
                    </span>
                    {act.unread && (
                      <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </section>

    </div>
    {!isApprovedVendor && (
  <ApprovalPendingOverlay
    onProfileClick={() =>
      setActiveTab(ActiveTab.ProfileManagement)
    }
    onMessagesClick={() =>
      setActiveTab(ActiveTab.Messages)
    }
  />
)}
</div>
</div>

  );
}
