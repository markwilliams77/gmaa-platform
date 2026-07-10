/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  FileSpreadsheet,
  MapPin,
  DollarSign,
  ChevronRight,
  Search,
  Filter,
  Download,
  UploadCloud,
  Award,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  Clock,
  ShieldCheck,
  User,
  Zap,
  Info
} from "lucide-react";
import {
  ActiveTab,
  Tender,
  TenderStatus,
  TenderRequirement,
  Message,
} from "../types";
import { vendorService } from "../services/vendorService";

interface TendersViewProps {
  tenders: Tender[];
  setTenders: React.Dispatch<React.SetStateAction<Tender[]>>;
  addSystemMessage: (msg: Message) => void;
  showToast?: (message: string, type?: "success" | "info" | "warning") => void;
  setActiveTab: React.Dispatch<React.SetStateAction<ActiveTab>>;
}

export default function TendersView({
  tenders,
  setTenders,
  addSystemMessage,
  showToast,
  setActiveTab,
}: TendersViewProps) {
  // Navigation sub-state: selected tender details page
  const [selectedTenderId, setSelectedTenderId] = useState<string | null>(null);

  // Search and filter sub-states
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  // Bid submission form states
  const [bidPrice, setBidPrice] = useState("");
  const [bidDoctor, setBidDoctor] = useState("");
  const [bidInclusions, setBidInclusions] = useState("");
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);
  const [bidSuccess, setBidSuccess] = useState(false);

  // Drag and drop simulation state
  const [isDragging, setIsDragging] = useState(false);

  // Chat Support Thread state (Preserved placeholder from original state tree)
  const [supportMessage, setSupportMessage] = useState("");

  const selectedTender = tenders.find((t) => t.id === selectedTenderId);

  // Search/Filters calculations (Preserves identical code logic)
  const filteredTenders = tenders.filter((t) => {
    const matchesSearch =
      t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.mainCategory.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || t.mainCategory === categoryFilter;
    const matchesStatus =
      statusFilter === "All" ||
      (statusFilter === "Open" && t.status === TenderStatus.Open) ||
      (statusFilter === "Submitted" && t.status === TenderStatus.Submitted) ||
      (statusFilter === "Awarded" && t.status === TenderStatus.Awarded);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Categories list extraction
  const categories = [
    "All",
    ...Array.from(
      new Set(
        tenders
          .map((t: any) =>
            (t.category || t.serviceCategory || "").trim().toLowerCase(),
          )
          .filter(Boolean),
      ),
    ),
  ];

  // Submit dynamic Bid (Preserves identical service integration)
  const handleBidSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!bidPrice || !bidDoctor) {
      const msg =
        "Please complete all fields including your proposed quotation and your credentialed Lead Surgeon.";

      if (showToast) {
        showToast(msg, "warning");
      } else {
        console.warn(msg);
      }
      return;
    }

    if (!selectedTenderId) {
      return;
    }

    try {
      setIsSubmittingBid(true);

      await vendorService.submitBid(
        selectedTenderId,
        Number(bidPrice),
        bidInclusions,
      );

      setBidSuccess(true);

      if (showToast) {
        showToast("Bid submitted successfully.", "success");
      }
    } catch (error) {
      console.error(error);

      if (showToast) {
        showToast("Failed to submit bid.", "warning");
      }
    } finally {
      setIsSubmittingBid(false);
    }
  };

  // Drag-and-drop actions
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadedFileName(e.dataTransfer.files[0].name);
    }
  };

  const handleFileSelectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFileName(e.target.files[0].name);
    }
  };

  const resetBidForm = () => {
    setBidPrice("");
    setBidDoctor("");
    setBidInclusions("");
    setUploadedFileName("");
    setBidSuccess(false);
  };

  const getCountdown = (deadline: string) => {
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      return "Expired";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      return `${days} Day${days > 1 ? "s" : ""} Left`;
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours > 0) {
      return `${hours} Hour${hours > 1 ? "s" : ""} Left`;
    }

    const minutes = Math.floor(diff / (1000 * 60));
    return `${minutes} Minute${minutes > 1 ? "s" : ""} Left`;
  };

  return (
    <div className="space-y-6 text-slate-800 animate-fade-in">
      
      {/* TITLE & BREADCRUMBS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans uppercase tracking-widest">
            <span>GMAA Procurement Marketplace</span>
            <ChevronRight className="h-3 w-3 text-[#2E5B9A]" />
            <span className="text-[#2E5B9A] font-semibold">Active Opportunities</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mt-1">
            {selectedTenderId ? "Tender Workspace Details" : "Marketplace Tenders"}
          </h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Browse corporate and institutional healthcare proposals open for bidding.
          </p>
        </div>
        <div className="text-[10px] font-bold font-mono px-3 py-1 bg-blue-50 text-[#2E5B9A] border border-blue-100 rounded-lg uppercase tracking-wider self-start sm:self-auto">
          GMAA PROCURE HUB
        </div>
      </div>

      {!selectedTenderId ? (
        /* ================= TENDERS LIST STREAM SCREEN ================= */
        <div className="space-y-6">
          
          {/* SEARCH & FILTER CONTROLS CONSOLE */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search medical categories, regions, or TND IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] transition-all font-sans outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-2.5">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-2xs text-slate-600">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-semibold text-slate-500">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-transparent focus:outline-none font-sans font-bold cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat.replace(/^\w/, (c) => c.toUpperCase())}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-2xs text-slate-600">
                <span className="font-semibold text-slate-500">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent focus:outline-none font-sans font-bold cursor-pointer"
                >
                  <option value="All">All Statuses</option>
                  <option value="Open">Open (Action Required)</option>
                  <option value="Submitted">Submitted Bids</option>
                  <option value="Awarded">Awarded Contracts</option>
                </select>
              </div>
            </div>
          </div>

          {/* OPPORTUNITIES TABLE / LIST */}
          <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-700">
                <thead className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                  <tr>
                    <th className="py-4 px-6">Tender</th>
                    <th className="py-4 px-6">Main Category</th>
                    <th className="py-4 px-4">Deadline</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-sans">
                  {filteredTenders.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center">
                        <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2 animate-pulse" />
                        <p className="text-xs text-slate-600 font-sans font-semibold">
                          No matching medical tenders detected.
                        </p>
                        <p className="text-3xs text-slate-400 mt-1">
                          Try adjusting your active category filter queries or query inputs.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredTenders.map((tender) => {
                      const countdownText = getCountdown(tender.deadline);
                      const isExpired = countdownText === "Expired";
                      const isCritical = countdownText.includes("Hour") || countdownText.includes("Minute");
                      
                      return (
                        <tr
                          key={tender.id}
                          className="group hover:bg-[#EBF3FC]/20 transition-all cursor-pointer"
                          onClick={() => setSelectedTenderId(tender.id)}
                        >
                          <td className="py-4.5 px-6 font-semibold text-slate-900">
                            <div className="flex items-center space-x-2">
                              <span className="text-3xs font-mono bg-[#EBF3FC] text-[#2E5B9A] border border-blue-100 px-2 py-0.5 rounded font-bold">
                                {tender.tenderNumber}
                              </span>
                              <span className="text-xs text-slate-800 line-clamp-1 group-hover:text-[#2E5B9A] font-semibold transition-colors">
                                {tender.title}
                              </span>
                            </div>
                          </td>

                          <td className="py-4.5 px-6 font-semibold text-slate-500 text-xs uppercase tracking-wider font-mono">
                            {tender.mainCategory || "-"}
                          </td>

                          <td className="py-4.5 px-4 font-semibold">
                            <span
                              className={`text-xs inline-flex items-center gap-1 ${
                                isExpired ? "text-slate-450" :
                                isCritical ? "text-[#D91B24]" : "text-emerald-600"
                              }`}
                            >
                              <Clock className="h-3.5 w-3.5" />
                              {countdownText}
                            </span>
                          </td>

                          <td className="py-4.5 px-6">
                            <div className="flex items-center gap-1.5">
                              <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-3xs font-bold bg-[#EBF3FC] text-[#2E5B9A] border border-blue-100">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#2E5B9A] animate-pulse" />
                                Open for Bidding
                              </span>

                              {tender.rank && (
                                <span className="text-3xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded">
                                  {tender.rank} Place
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-4.5 px-6 text-right">
                            <button
                              id={`view-tender-action-${tender.tenderNumber}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTenderId(tender.id);
                              }}
                              className="inline-flex h-8 items-center justify-center rounded-lg bg-[#2E5B9A] hover:bg-[#3b6eae] px-4 text-3xs font-bold text-white transition-all active:scale-[0.98] shadow-sm"
                            >
                              View & Interact
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ================= TENDER DETAILS SCREEN (BENTO HUD STYLE) ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          
          {/* LEFT 2 COLUMNS: CORE INFO, COMPLIANCE REQUIREMENTS, FORM */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Nav Back button */}
            <button
              id="back-to-tenders-btn"
              onClick={() => {
                setSelectedTenderId(null);
                resetBidForm();
              }}
              className="inline-flex items-center gap-2 text-xs text-slate-500 hover:text-[#2E5B9A] font-bold py-2 px-3 border border-slate-200 rounded-xl bg-white hover:bg-slate-50 shadow-xs transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-[#2E5B9A]" />
              Back to Active Log Lists
            </button>

            {/* Main Tender Meta Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-3xs font-mono font-bold text-[#2E5B9A] bg-[#EBF3FC] border border-blue-150 px-2 py-0.5 rounded">
                    ID Ref: {selectedTender?.tenderNumber}
                  </span>
                  <h3 className="font-display font-bold text-slate-900 text-lg md:text-xl">
                    {selectedTender.title}
                  </h3>
                </div>

                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-3xs font-bold bg-[#EBF3FC] text-[#2E5B9A] border border-blue-150">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#2E5B9A] animate-pulse" />
                  Open for Bidding
                </span>
              </div>

              {/* Specs Badge Strip */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block font-bold">
                    Specialty Field Area
                  </span>
                  <span className="font-bold text-slate-800 mt-1 block">
                    {selectedTender?.mainCategory}
                  </span>
                </div>

                <div>
                  <span className="text-[9px] text-slate-400 font-mono uppercase tracking-wider block font-bold">
                    Time Remaining
                  </span>
                  <span className="font-bold text-[#D91B24] mt-1 block">
                    {getCountdown(selectedTender.deadline)}
                  </span>
                </div>
              </div>

              {/* Detailed narrative */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-widest">
                  Tender Overview & Case Scope
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed font-sans font-light">
                  {selectedTender.description}
                </p>
              </div>

              {/* Technical SLA Requirements checklist */}
              <div className="space-y-3.5 pt-4 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-widest">
                  SLA Technical Compliance Specs
                </h4>
                <div className="space-y-3">
                  {selectedTender.requirements?.length ? (
                    selectedTender.requirements.map((req) => (
                      <div
                        key={req.id}
                        className="flex gap-4 justify-between items-start bg-slate-50 p-3 rounded-xl border border-slate-100"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800">
                            {req.title}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5 leading-relaxed font-light">
                            {req.description}
                          </p>
                        </div>

                        <span
                          className={`text-4xs font-bold px-2 py-0.5 rounded tracking-widest uppercase shrink-0 font-mono ${
                            req.mandatory
                              ? "bg-[#D91B24]/10 border border-[#D91B24]/15 text-[#D91B24]"
                              : "bg-slate-150 text-slate-500"
                          }`}
                        >
                          {req.mandatory ? "Mandatory" : "Optional"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-5 text-center">
                      <p className="text-xs font-medium text-slate-600">
                        No technical requirements specified.
                      </p>
                      <p className="text-2xs text-slate-400 mt-1">
                        GMAA has not attached any mandatory or optional SLA requirements for this patient case.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tender spec documents download zone */}
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-widest">
                Tender Spec Documents
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedTender.documents?.length ? (
                  selectedTender.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between group hover:border-[#2E5B9A]/30 transition-all duration-200"
                    >
                      <div className="min-w-0">
                        <p className="text-2xs font-semibold text-slate-800 truncate group-hover:text-[#2E5B9A]">
                          {doc.name}
                        </p>
                        <p className="text-3xs text-slate-450 font-mono mt-0.5 uppercase">
                          Size: {doc.size}
                        </p>
                      </div>

                      <button className="h-8 w-8 rounded-lg bg-white border border-slate-150 flex items-center justify-center text-slate-500 hover:text-[#2E5B9A] hover:border-blue-200 shadow-3xs transition-colors">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full rounded-xl border border-slate-100 bg-slate-50 p-5 text-center">
                    <p className="text-xs font-medium text-slate-600">
                      No supporting documents available.
                    </p>
                    <p className="text-2xs text-slate-400 mt-1">
                      GMAA has not uploaded any specifications or clinical attachments for this workspace.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* PROPOSAL SUBMISSION PANEL */}
            {selectedTender.status === "BROADCASTED" ? (
              <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-widest">
                    Submit Commercial Proposal
                  </h4>
                  <p className="text-2xs text-slate-400 font-sans mt-0.5">
                    Submit your commercial price quote and medical setup details for evaluation by the GMAA Board.
                  </p>
                </div>

                {bidSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-4">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                    <div className="space-y-1.5">
                      <h5 className="text-sm font-bold text-slate-900 font-display">
                        Proposal Submitted Successfully
                      </h5>
                      <p className="text-xs text-slate-650 max-w-sm mx-auto leading-relaxed">
                        Your bid has been securely compiled. The contract has been routed to <strong>My Tenders</strong>, where you can monitor evaluation rounds, coordinate documentation, and receive direct compliance notifications.
                      </p>
                    </div>
                    <button
                      id="submit-another-bid-sim-btn"
                      onClick={() => {
                        resetBidForm();
                        setSelectedTenderId(null);
                        setActiveTab(ActiveTab.MyTenders);
                      }}
                      className="rounded-xl bg-[#2E5B9A] hover:bg-[#3b6eae] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-blue-500/10 transition active:scale-95"
                    >
                      Go to My Tenders
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={handleBidSubmit}
                    className="space-y-4 font-sans text-xs"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Price input */}
                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono mb-1">
                          Quoted Price (USD)*
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-[#2E5B9A]" />
                          <input
                            type="number"
                            required
                            placeholder="e.g. 320000"
                            value={bidPrice}
                            onChange={(e) => setBidPrice(e.target.value)}
                            className="w-full pl-8 pr-4 py-2.5 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] focus:outline-none transition-all"
                          />
                        </div>
                      </div>

                      {/* Head Specialist input */}
                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono mb-1">
                          Lead Consultant / Specialist*
                        </label>
                        <div className="relative">
                          <User className="absolute left-2.5 top-2.5 h-4 w-4 text-[#2E5B9A]" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Dr. Aditi Nair"
                            value={bidDoctor}
                            onChange={(e) => setBidDoctor(e.target.value)}
                            className="w-full pl-8 pr-4 py-2.5 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] focus:outline-none transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Inclusions text area */}
                    <div className="space-y-1">
                      <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono mb-1">
                        Proposal Summary
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Detail your clinical approach, specialist team, inclusive features, and transfer timelines..."
                        value={bidInclusions}
                        onChange={(e) => setBidInclusions(e.target.value)}
                        className="w-full p-3 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] focus:outline-none leading-relaxed text-xs"
                      />
                    </div>

                    {/* Drag and Drop Upload */}
                    <div className="space-y-1.5">
                      <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono">
                        Supporting Documents*
                      </label>
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer relative ${
                          isDragging
                            ? "border-[#2E5B9A] bg-[#EBF3FC]/30"
                            : "border-slate-200 hover:border-[#2E5B9A]/30 bg-slate-50/50"
                        }`}
                      >
                        {uploadedFileName ? (
                          <div className="space-y-1.5">
                            <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto" />
                            <p className="text-2xs font-semibold text-slate-800">
                              {uploadedFileName}
                            </p>
                            <button
                              type="button"
                              onClick={() => setUploadedFileName("")}
                              className="text-[10px] text-[#D91B24] font-bold hover:underline"
                            >
                              Remove and upload another
                            </button>
                          </div>
                        ) : (
                          <label className="space-y-1 block cursor-pointer">
                            <UploadCloud className="h-8 w-8 text-slate-400 mx-auto" />
                            <p className="text-2xs font-semibold text-slate-700">
                              Drag and drop proposal files here or{" "}
                              <span className="text-[#2E5B9A] hover:underline inline font-bold">
                                browse files
                              </span>
                            </p>
                            <p className="text-[10px] text-slate-400">
                              Accepted formats: PDF, DOCX or ZIP (maximum 15 MB).
                            </p>
                            <input
                              type="file"
                              className="hidden"
                              onChange={handleFileSelectChange}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Form actions */}
                    <div className="flex items-center justify-end gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTenderId(null);
                          resetBidForm();
                        }}
                        className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
                      >
                        Cancel
                      </button>
                      <button
                        id="submit-proposal-final-btn"
                        type="submit"
                        disabled={isSubmittingBid}
                        className="rounded-xl bg-[#2E5B9A] hover:bg-[#3b6eae] px-6 py-2.5 text-xs font-bold text-white hover:bg-slate-800 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 shadow-md shadow-blue-500/10"
                      >
                        {isSubmittingBid ? (
                          <>
                            <span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Securing proposal...
                          </>
                        ) : (
                          "Submit Proposal"
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            ) : (
              /* Dispatched proposal state card */
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900 font-sans">
                    Strategic Proposal Dispatched
                  </p>
                  <p className="text-2xs text-slate-500 mt-0.5 leading-relaxed font-sans font-light">
                    Your bid is registered. GMAA keeps individual competitor prices and participant identities anonymized. Direct messages, evaluation updates, or rebid requests will appear inside your portal dashboard.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: SECURE SIDEBAR SUMMARY */}
          <div className="lg:col-span-1 space-y-6 shrink-0">
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-800 font-mono uppercase tracking-wider">
                Tender Summary
              </h4>

              <div className="space-y-3.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Tender Reference</span>
                  <span className="font-mono font-bold text-slate-800">
                    {selectedTender.tenderNumber}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Category Area</span>
                  <span className="font-semibold text-slate-800">
                    {selectedTender.mainCategory}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Gateway Status</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#EBF3FC] px-2.5 py-0.5 text-[#2E5B9A] border border-blue-100 text-3xs font-bold">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2E5B9A] animate-pulse" />
                    Open for Bidding
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400">Time Remaining</span>
                  <span className="font-bold text-[#D91B24]">
                    {getCountdown(selectedTender.deadline)}
                  </span>
                </div>
              </div>
            </div>

            {/* Visual Security Notice Badge */}
            <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl flex items-start space-x-2.5">
              <Info className="h-4.5 w-4.5 text-[#2E5B9A] shrink-0 mt-0.5" />
              <p className="text-[10px] text-slate-400 leading-normal font-sans font-light">
                GMAA Procurement Marketplace operates under strict compliance rules. Bidding structures and participant histories are encrypted.
              </p>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}