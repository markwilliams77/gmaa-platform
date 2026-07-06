/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import {
  FileSpreadsheet,
  MapPin,
  DollarSign,
  Calendar,
  ChevronRight,
  Search,
  Filter,
  Download,
  ExternalLink,
  UploadCloud,
  Send,
  Award,
  CheckCircle2,
  ArrowLeft,
  AlertCircle,
  Clock,
  ShieldCheck,
  User,
  Plus,
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

  // Chat Support Thread states
  const [supportMessage, setSupportMessage] = useState("");

  const selectedTender = tenders.find((t) => t.id === selectedTenderId);

  // Search/Filters calculations
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

  // Submit dynamic Bid
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

  // Send message on support thread
  const handleSendSupportMessage = () => {
    if (!supportMessage.trim() || !selectedTenderId) return;

    const newMsg = {
      sender: "Apex Team (You)",
      text: supportMessage,
      time: "Just Now",
      isAdmin: false,
    };

    setSupportThreads((prev) => ({
      ...prev,
      [selectedTenderId]: [...(prev[selectedTenderId] || []), newMsg],
    }));

    setSupportMessage("");

    // Simulate instant secure GMAA automated assistance feedback
    setTimeout(() => {
      const systemFeedback = {
        sender: "GMAA Automated Desk",
        text: "Thank you for contacting the GMAA Board unit. Your technical query is queued. A surgical reviewer will address this within 4 working hours.",
        time: "Just Now",
        isAdmin: true,
      };
      setSupportThreads((prev) => ({
        ...prev,
        [selectedTenderId]: [...(prev[selectedTenderId] || []), systemFeedback],
      }));
    }, 1500);
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
    <div className="space-y-6">
      {/* HEADER BAR */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-sans uppercase tracking-widest">
          <span>GMAA Procurement Marketplace</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-600">Active Opportunities</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900 mt-1">
          {selectedTenderId ? "Tender Details" : "Marketplace"}
        </h2>
        <p className="text-xs text-slate-400 font-sans font-light mt-0.5">
          Browse available tenders
        </p>
      </div>

      {!selectedTenderId ? (
        /* ================= TENDERS LIST SCREEN ================= */
        <div className="space-y-6 animate-fade-in">
          {/* SEARCH & FILTER CONTROLS */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch bg-white p-4 rounded-2xl border border-slate-200/80 shadow-3xs">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search medical categories, regions, or TND IDs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
              />
            </div>

            <div className="flex gap-2.5">
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-2xs text-slate-600">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <span className="font-semibold">Category:</span>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-transparent focus:outline-none font-sans"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1 text-2xs text-slate-600">
                <span className="font-semibold text-slate-400">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-transparent focus:outline-none font-sans"
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
          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-left text-sm text-slate-600">
                <thead className="bg-slate-50/70 border-b border-slate-100 text-3xs font-semibold text-slate-400 uppercase tracking-wider font-display">
                  <tr>
                    <th className="py-3 px-6">Tender</th>
                    <th className="py-3 px-6">Main Category</th>
                    <th className="py-3 px-4">Deadline</th>
                    <th className="py-3 px-6">Status</th>
                    <th className="py-3 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/50 font-sans">
                  {filteredTenders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center">
                        <AlertCircle className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs text-slate-500 font-sans font-medium">
                          No matching medical tenders detected.
                        </p>
                        <p className="text-3xs text-slate-400">
                          Try adjusting your active category filter queries.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredTenders.map((tender) => (
                      <tr
                        key={tender.id}
                        className="group hover:bg-slate-50/40 transition-colors cursor-pointer"
                        onClick={() => setSelectedTenderId(tender.id)}
                      >
                        <td className="py-4.5 px-6 font-semibold text-slate-900">
                          <div>
                            <span className="text-xs font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded mr-1.5">
                              {tender.tenderNumber}
                            </span>
                            <span className="text-xs text-slate-800 line-clamp-1 group-hover:text-cyan-600 font-medium transition-colors inline-block align-middle">
                              {tender.title}
                            </span>
                          </div>
                        </td>

                        <td className="py-4.5 px-6 font-medium text-slate-700 text-xs">
                          {tender.mainCategory || "-"}
                        </td>

                        <td className="py-4.5 px-4">
                          <span
                            className={`text-xs font-semibold ${
                              tender.deadline &&
                              new Date(tender.deadline).getTime() - Date.now() >
                                7 * 24 * 60 * 60 * 1000
                                ? "text-emerald-600"
                                : tender.deadline &&
                                    new Date(tender.deadline).getTime() -
                                      Date.now() >
                                      24 * 60 * 60 * 1000
                                  ? "text-amber-600"
                                  : "text-red-600"
                            }`}
                          >
                            {getCountdown(tender.deadline)}
                          </span>
                        </td>

                        <td className="py-4.5 px-6 align-middle">
                          <span className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-2xs font-semibold bg-cyan-50 text-cyan-600 border border-cyan-100">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                            Open for Bidding
                          </span>

                          {tender.rank && (
                            <span className="text-3xs font-bold text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded ml-1.5">
                              {tender.rank} Place
                            </span>
                          )}
                        </td>

                        <td className="py-4.5 px-6 text-right align-middle">
                          <button
                            id={`view-tender-action-${tender.tenderNumber}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTenderId(tender.id);
                            }}
                            className="inline-flex h-8 items-center justify-center rounded-lg bg-slate-900 px-3 text-2xs font-semibold text-white hover:bg-slate-800 transition-colors"
                          >
                            View & Interact
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* ================= TENDER DETAILS SCREEN (ULTRA DETAILED) ================= */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in">
          {/* LEFT 2 COLUMNS: INFO, REQUIREMENTS, BID FORM */}
          <div className="lg:col-span-2 space-y-8">
            {/* Nav Back button */}
            <button
              id="back-to-tenders-btn"
              onClick={() => {
                setSelectedTenderId(null);
                resetBidForm();
              }}
              className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Tender Opportunities
            </button>

            {/* Main Tender Meta Info */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-3xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                    ID: {selectedTender?.tenderNumber}
                  </span>
                  <h3 className="font-display font-bold text-slate-900 text-lg md:text-xl">
                    {selectedTender.title}
                  </h3>
                </div>

                {/* Bookmarked / Pin indicator */}
                <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-2xs font-bold bg-cyan-50 text-cyan-600 border border-cyan-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  Open for Bidding
                </span>
              </div>

              {/* Specs Badge Strip */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-3xs text-slate-400 font-display uppercase tracking-wider block">
                    Specialty Field
                  </span>
                  <span className="font-bold text-slate-800 mt-0.5 block">
                    {selectedTender?.mainCategory}
                  </span>
                </div>

                <div>
                  <span className="text-3xs text-slate-400 font-display uppercase tracking-wider block">
                    Time Remaining
                  </span>
                  <span className="font-bold text-amber-600 mt-0.5 block">
                    {getCountdown(selectedTender.deadline)}
                  </span>
                </div>
              </div>

              {/* Detailed narrative */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-800 font-display uppercase tracking-wider">
                  Tender Details and Description
                </h4>
                <p className="text-xs text-slate-500 font-sans leading-relaxed">
                  {selectedTender.description}
                </p>
              </div>

              {/* Requirements checklist */}
              <div className="space-y-3.5 pt-4 border-t border-slate-50">
                <h4 className="text-xs font-bold text-slate-800 font-display uppercase tracking-wider">
                  Technical SLA Requirements
                </h4>
                <div className="space-y-3">
                  {selectedTender.requirements?.length ? (
                    selectedTender.requirements.map((req) => (
                      <div
                        key={req.id}
                        className="flex gap-3 justify-between items-start bg-slate-50 p-3 rounded-xl border border-slate-100"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800">
                            {req.title}
                          </p>
                          <p className="text-2xs text-slate-400 mt-0.5 leading-relaxed">
                            {req.description}
                          </p>
                        </div>

                        <span
                          className={`text-3xs font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase shrink-0 ${
                            req.mandatory
                              ? "bg-rose-50 border border-rose-100 text-rose-500"
                              : "bg-slate-200/60 text-slate-500"
                          }`}
                        >
                          {req.mandatory ? "Mandatory" : "Optional"}
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
                      <p className="text-xs font-medium text-slate-600">
                        No technical requirements have been specified.
                      </p>
                      <p className="text-2xs text-slate-400 mt-1">
                        GMAA has not attached any mandatory or optional SLA
                        requirements for this tender.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Tender Documents Module */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-3xs space-y-4">
              <h4 className="text-xs font-bold text-slate-800 font-display uppercase tracking-wider">
                Tender Spec Documents
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {selectedTender.documents?.length ? (
                  selectedTender.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/60 flex items-center justify-between group hover:border-cyan-200 transition-all"
                    >
                      <div className="min-w-0">
                        <p className="text-2xs font-semibold text-slate-800 truncate group-hover:text-cyan-600">
                          {doc.name}
                        </p>
                        <p className="text-3xs text-slate-400 font-mono mt-0.5">
                          {doc.size}
                        </p>
                      </div>

                      <button className="h-7 w-7 rounded-md bg-white border border-slate-150 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-350 shadow-3xs shadow-slate-100">
                        <Download className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full rounded-xl border border-slate-200 bg-slate-50 p-5 text-center">
                    <p className="text-xs font-medium text-slate-600">
                      No supporting documents available.
                    </p>
                    <p className="text-2xs text-slate-400 mt-1">
                      GMAA has not uploaded any tender specifications or
                      attachments for this opportunity.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* BID SUBMISSION FORM BAR */}
            {selectedTender.status === "BROADCASTED" ? (
              <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-3xs space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-slate-800 font-display uppercase tracking-wider">
                    Submit Commercial Proposal
                  </h4>
                  <p className="text-2xs text-slate-400 font-sans mt-0.5">
                    Submit your commercial quotation and supporting proposal for
                    evaluation by the GMAA procurement team.
                  </p>
                </div>

                {bidSuccess ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center space-y-4">
                    <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto" />
                    <div className="space-y-1.5">
                      <h5 className="text-sm font-bold text-slate-900 font-display">
                        Proposal Submitted Successfully
                      </h5>
                      <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                        Your commercial proposal has been securely submitted to
                        GMAA for evaluation. Your tender has now been moved to{" "}
                        <strong>My Tenders</strong>, where you can track its
                        progress, receive rebid requests, view award decisions,
                        and communicate with the GMAA procurement team.
                      </p>
                    </div>
                    <button
                      id="submit-another-bid-sim-btn"
                      onClick={() => {
                        resetBidForm();
                        setSelectedTenderId(null);
                        setActiveTab(ActiveTab.MyTenders);
                      }}
                      className="rounded-xl bg-slate-900 px-4 py-2 text-2xs font-semibold text-white hover:bg-slate-800"
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
                      <div>
                        <label className="block text-slate-500 font-medium mb-1 pl-0.5">
                          Quoted Price
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                          <input
                            type="number"
                            required
                            placeholder="e.g. 320000"
                            value={bidPrice}
                            onChange={(e) => setBidPrice(e.target.value)}
                            className="w-full pl-8 pr-4 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Head Surgeon input */}
                      <div>
                        <label className="block text-slate-500 font-medium mb-1 pl-0.5">
                          Lead Consultant / Specialist*
                        </label>
                        <div className="relative">
                          <User className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
                          <input
                            type="text"
                            required
                            placeholder="e.g. Dr. Aditi Nair"
                            value={bidDoctor}
                            onChange={(e) => setBidDoctor(e.target.value)}
                            className="w-full pl-8 pr-4 py-2 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:ring-1 focus:ring-cyan-500 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Inclusions text area */}
                    <div>
                      <label className="block text-slate-500 font-medium mb-1 pl-0.5">
                        Proposal Summary
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Summarize your proposed treatment approach, team expertise, inclusions, turnaround time, accommodation support, and any additional value offered to the patient."
                        value={bidInclusions}
                        onChange={(e) => setBidInclusions(e.target.value)}
                        className="w-full p-3 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:ring-1 focus:ring-cyan-500 focus:outline-none leading-relaxed"
                      />
                    </div>

                    {/* Drag and Drop Upload simulation */}
                    <div>
                      <label className="block text-slate-500 font-medium mb-1.5 pl-0.5">
                        Supporting Documents*
                      </label>
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer relative ${
                          isDragging
                            ? "border-cyan-500 bg-cyan-500/5"
                            : "border-slate-200 hover:border-cyan-200 bg-slate-50/50"
                        }`}
                      >
                        {uploadedFileName ? (
                          <div className="space-y-1">
                            <CheckCircle2 className="h-7 w-7 text-emerald-500 mx-auto" />
                            <p className="text-2xs font-semibold text-slate-800">
                              {uploadedFileName}
                            </p>
                            <button
                              type="button"
                              onClick={() => setUploadedFileName("")}
                              className="text-3xs text-rose-500 font-medium hover:underline"
                            >
                              Remove file and select another
                            </button>
                          </div>
                        ) : (
                          <label className="space-y-1 block cursor-pointer">
                            <UploadCloud className="h-7 w-7 text-slate-400 mx-auto" />
                            <p className="text-2xs font-semibold text-slate-700">
                              Drag your proposal here or{" "}
                              <span className="text-cyan-600 hover:underline inline">
                                browse your files
                              </span>
                            </p>
                            <p className="text-3xs text-slate-400">
                              Accepted formats: PDF, DOCX or ZIP (maximum 15
                              MB).
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

                    {/* Actions block */}
                    <div className="flex items-center justify-end gap-3 pt-3">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTenderId(null);
                          resetBidForm();
                        }}
                        className="rounded-xl px-4 py-2 font-semibold text-slate-500 hover:text-slate-800"
                      >
                        Cancel
                      </button>
                      <button
                        id="submit-proposal-final-btn"
                        type="submit"
                        disabled={isSubmittingBid}
                        className="rounded-xl bg-slate-900 px-5  py-2.5 font-semibold text-white hover:bg-slate-800 flex items-center justify-center gap-2 max-w-xs transition-all active:scale-95 disabled:opacity-50"
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
              /* Already bidding state display */
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex items-start gap-3">
                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-900 font-sans">
                    Strategic Proposal Dispatched
                  </p>
                  <p className="text-2xs text-slate-500 mt-0.5 leading-relaxed font-sans">
                    Your offer is active. GMAA keeps individual competitor
                    prices and participant identities hidden. Direct messages,
                    rankings, or updates will appear in your live portal below.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: PRIVACY-SAFE RANKINGS & SUPPORT MESSAGE THREAD */}
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm space-y-4">
              <h4 className="text-xs font-bold text-slate-800 font-display uppercase tracking-wider">
                Tender Summary
              </h4>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tender Number</span>
                  <span className="font-semibold text-slate-900">
                    {selectedTender.tenderNumber}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Category</span>
                  <span className="font-semibold text-slate-900">
                    {selectedTender.mainCategory}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Status</span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-cyan-50 px-2 py-0.5 text-cyan-600 border border-cyan-100 font-semibold">
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                    Open for Bidding
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Time Remaining</span>
                  <span className="font-semibold text-amber-600">
                    {getCountdown(selectedTender.deadline)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
