/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { 
  FileSpreadsheet, 
  ChevronLeft, 
  MapPin, 
  Calendar, 
  Activity, 
  Award, 
  ShieldCheck, 
  Clock, 
  UploadCloud, 
  FileText, 
  Trash2, 
  TrendingUp, 
  MessageSquare, 
  UserCheck2,
  ChevronRight,
  ExternalLink,
  Zap,
  CheckCircle2,
  LockKeyhole
} from "lucide-react";
import { vendorService } from "../services/vendorService";

interface Props {
  tenders: any[];
}

export default function MyTendersView({ tenders }: Props) {
  const [selectedTenderId, setSelectedTenderId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isEditingBid, setIsEditingBid] = useState(false);
  const [bidPrice, setBidPrice] = useState("");
  const [bidProposal, setBidProposal] = useState("");
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);

  const selectedTender = tenders.find((t) => t.id === selectedTenderId);

  // Filter Logic (Preserves identical code logic)
  const filteredTenders = tenders.filter((tender) => {
    const matchesSearch =
      tender.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tender.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      categoryFilter === "All" || tender.serviceCategory === categoryFilter;

    const matchesStatus =
      statusFilter === "All" || tender.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories = [
    "All",
    ...new Set(tenders.map((t) => t.serviceCategory).filter(Boolean)),
  ];

  // Document Loader Effect
  useEffect(() => {
    const loadDocuments = async () => {
      if (!selectedTender?.threadId) {
        setDocuments([]);
        return;
      }

      try {
        const docs = await vendorService.getWorkspaceDocuments(
          selectedTender.threadId,
        );
        setDocuments(docs);
      } catch (error) {
        console.error("Failed to load documents", error);
      }
    };

    loadDocuments();
  }, [selectedTender]);

  // Support Message Loader Effect
  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedTender?.threadId) {
        setMessages([]);
        return;
      }

      try {
        const data = await vendorService.getMessages(selectedTender.threadId);
        console.log("SUPPORT MESSAGES", data);
        setMessages(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadMessages();
  }, [selectedTender]);

  // Action: Send Message
  const handleSendMessage = async () => {
    if (!selectedTender?.threadId || !newMessage.trim()) {
      return;
    }

    try {
      await vendorService.sendMessage(selectedTender.threadId, newMessage);
      const data = await vendorService.getMessages(selectedTender.threadId);
      setMessages(data);
      setNewMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  // Action: Upload Document
  const handleDocumentUpload = async (file: File) => {
    if (!selectedTender?.threadId) {
      return;
    }

    try {
      setUploading(true);

      const uploadData = await vendorService.getUploadUrl(
        selectedTender.threadId,
        file.name,
        file.type,
      );

      await fetch(uploadData.uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      await vendorService.createWorkspaceDocument({
        threadId: selectedTender.threadId,
        fileName: file.name,
        fileUrl: uploadData.fileUrl,
        s3Key: uploadData.s3Key,
      });

      const docs = await vendorService.getWorkspaceDocuments(
        selectedTender.threadId,
      );
      console.log("DOCS", docs);
      setDocuments(docs);
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  // Action: Delete Document
  const handleDeleteDocument = async (documentId: string) => {
    try {
      await vendorService.deleteWorkspaceDocument(documentId);
      setDocuments((prev) => prev.filter((doc) => doc.id !== documentId));
    } catch (error) {
      console.error(error);
    }
  };

  // Active Countdown Labels
  const getDeadlineLabel = (deadline?: string) => {
    if (!deadline) return "-";

    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();

    if (diff <= 0) {
      return "Closed";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (days > 0) {
      return `${days}d ${hours}h left`;
    }

    return `${hours}h left`;
  };

  // INTERACTIVE WORKSPACE SCREEN (Detailed Workspace View)
  if (selectedTender) {
    return (
      <div className="space-y-6 text-slate-800 animate-fade-in">
        
        {/* Workspace Sub Header Navigation */}
        <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <button
            onClick={() => setSelectedTenderId(null)}
            className="rounded-xl border border-slate-200 hover:border-[#2E5B9A] hover:bg-[#EBF3FC]/30 text-slate-600 hover:text-[#2E5B9A] text-xs font-bold py-2.5 px-4 transition-all duration-200 flex items-center gap-1.5"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Active Lists
          </button>
          
          <div className="text-[10px] font-bold font-mono px-3 py-1 bg-blue-50 text-[#2E5B9A] border border-blue-100 rounded-lg uppercase tracking-wider">
            Workspace Active Session
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT SECTION: MAIN CONTRACT SPECS & WORKSPACE DOCUMENT DRIVE */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-100 bg-white p-6 shadow-sm space-y-6">
            
            {/* Header Details */}
            <div className="space-y-2">
              <span className="text-3xs font-mono font-bold uppercase tracking-wider text-slate-400">TENDER RECORD REFERENCE</span>
              <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-normal">{selectedTender.title}</h2>
              
              <div className="grid grid-cols-2 gap-4 mt-3 bg-slate-50 border border-slate-100/80 p-4 rounded-xl font-sans">
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Category</p>
                  <p className="font-semibold text-slate-750 text-xs mt-1">
                    {selectedTender.serviceCategory || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase text-slate-400 font-bold tracking-wider">Target Region</p>
                  <p className="font-semibold text-slate-750 text-xs mt-1 flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-[#2E5B9A]" />
                    {selectedTender.region}
                  </p>
                </div>
              </div>
            </div>

            {/* Diagnostic HUD Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="rounded-xl border border-slate-100 p-4 bg-slate-50 flex flex-col justify-between">
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest font-mono">Status</p>
                <span className={`mt-2 inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-3xs font-bold ${
                  selectedTender.vendorStatus === "Awarded"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : selectedTender.vendorStatus === "Open for Bidding"
                    ? "bg-[#EBF3FC] text-[#2E5B9A] border border-blue-150"
                    : "bg-amber-50 text-amber-600 border border-amber-100"
                }`}>
                  {selectedTender.vendorStatus}
                </span>
              </div>

              <div className="rounded-xl border border-slate-100 p-4 bg-slate-50">
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest font-mono">Current Round</p>
                <p className="mt-2 text-lg font-bold text-slate-800 font-display">{selectedTender.currentRound}</p>
              </div>

              <div className="rounded-xl border border-slate-100 p-4 bg-slate-50 flex flex-col justify-between">
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest font-mono">Your Position</p>
                <span className={`mt-2 inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-3xs font-bold ${
                  selectedTender.myPosition === "L1"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-150"
                    : "bg-amber-50 text-amber-600 border border-amber-150"
                }`}>
                  {selectedTender.myPosition}
                </span>
              </div>

              <div className="rounded-xl border border-slate-100 p-4 bg-slate-50">
                <p className="text-[9px] text-slate-400 uppercase font-bold tracking-widest font-mono">Bid Count</p>
                <p className="mt-2 text-lg font-bold text-slate-800 font-display">{selectedTender.myBidCount}</p>
              </div>
            </div>

            {/* Narrative Area */}
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 leading-relaxed font-light">
              <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold font-mono">
                Tender Context & Scope Description
              </p>
              <p className="mt-2 text-xs text-slate-650 font-sans">
                {selectedTender.description}
              </p>
            </div>

            {/* GMAA Document Workspace Panel */}
            <div className="border-t pt-6">
              <p className="text-xs uppercase tracking-wider text-slate-400 font-bold font-mono mb-4">
                Secure Document Workspace
              </p>

              {/* Upload dashed zone */}
              <div className="mb-5 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/20 p-5 hover:border-[#2E5B9A]/30 transition-all">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#EBF3FC] text-[#2E5B9A] flex items-center justify-center">
                      <UploadCloud className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 text-xs">Upload Supporting Documents</p>
                      <p className="text-[10px] text-slate-400 font-sans mt-0.5">Share financial quotations, clinical certifications, and proposals.</p>
                    </div>
                  </div>

                  <label className="cursor-pointer rounded-xl bg-[#2E5B9A] hover:bg-[#3b6eae] px-4 py-2.5 text-xs font-bold text-white transition shadow-md shadow-blue-500/10 shrink-0">
                    {uploading ? "Uploading..." : "Upload File"}
                    <input
                      type="file"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleDocumentUpload(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Document items list container */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
                {documents.length === 0 ? (
                  <p className="text-slate-400 text-xs py-3 text-center">
                    No supporting documents uploaded yet.
                  </p>
                ) : (
                  <div className="space-y-2.5">
                    {documents.map((doc: any) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 hover:shadow-2xs transition-all duration-200"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-[#2E5B9A] border border-blue-100 shrink-0">
                            <FileText className="h-4.5 w-4.5" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-xs text-slate-800 truncate max-w-[320px]">
                              {doc.fileName}
                            </p>
                            <p className="text-[9px] text-slate-400 mt-0.5 capitalize font-mono">
                              Role: {doc.uploadedByRole || "Vendor"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0 pl-2">
                          <a
                            href={doc.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="rounded-lg border border-slate-200 px-3 py-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition"
                          >
                            Open
                          </a>
                          <button
                            onClick={() => handleDeleteDocument(doc.id)}
                            className="rounded-lg border border-red-100 px-3 py-1.5 text-[10px] font-bold text-red-600 hover:bg-red-50/60 transition"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* MY BID TRANSACTION PANEL */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">My Bid</h3>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-xl bg-white border border-slate-100 p-4">
                    <p className="text-[10px] uppercase text-slate-400 font-bold font-mono">Your Latest Bid Amount</p>
                    <p className="mt-1.5 text-xl font-bold text-[#2E5B9A] font-display">
                      {selectedTender.myLatestBid?.amount || "-"}
                    </p>
                  </div>

                  <div className="rounded-xl bg-white border border-slate-100 p-4">
                    <p className="text-[10px] uppercase text-slate-400 font-bold font-mono">Active Bidding Status</p>
                    <div className="mt-2.5">
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-3xs font-bold ${
                        selectedTender.myLatestBid?.status === "AWARDED"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-slate-100 text-slate-600 border border-slate-200"
                      }`}>
                        {selectedTender.vendorStatus}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-white border border-slate-100 p-4">
                  <p className="text-[10px] uppercase text-slate-400 font-bold font-mono mb-2">Proposal Summary</p>
                  <p className="text-xs text-slate-750 leading-relaxed font-sans font-light">
                    {selectedTender.myLatestBid?.proposal || "No proposal narrative submitted."}
                  </p>

                  {/* Submit / Update Bid Action and Form (GMAA Medical Accent Red) */}
                  {selectedTender.canSubmitBid && (
                    <>
                      <button
                        onClick={() => {
                          setBidPrice(selectedTender.myLatestBid?.amount?.toString() ?? "");
                          setBidProposal(selectedTender.myLatestBid?.proposal ?? "");
                          setIsEditingBid(true);
                        }}
                        className="mt-5 rounded-xl bg-[#D91B24] hover:bg-[#b8121a] px-5 py-3 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-red-500/10 flex items-center gap-1.5"
                      >
                        <Zap className="h-4 w-4 animate-pulse" />
                        {selectedTender.currentRound > 1 ? "Update Bidding Specifications" : "Submit Bidding Proposal"}
                      </button>

                      {isEditingBid && (
                        <div className="mt-6 rounded-2xl border border-slate-150 bg-slate-50 p-5 space-y-4">
                          <h4 className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                            Modify Secure Proposal Price Point
                          </h4>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                              Revised Bid Amount
                            </label>
                            <input
                              type="number"
                              value={bidPrice}
                              onChange={(e) => setBidPrice(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none transition"
                              placeholder="Enter USD value"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                              Updated Proposal Description
                            </label>
                            <textarea
                              rows={4}
                              value={bidProposal}
                              onChange={(e) => setBidProposal(e.target.value)}
                              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none transition"
                              placeholder="Detail your clinical setup or evacuation workflow..."
                            />
                          </div>

                          <div className="flex justify-end gap-3 pt-2">
                            <button
                              type="button"
                              onClick={() => setIsEditingBid(false)}
                              className="rounded-xl px-4 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 transition"
                            >
                              Cancel
                            </button>

                            <button
                              type="button"
                              disabled={isSubmittingBid}
                              onClick={async () => {
                                if (!selectedTender) return;

                                try {
                                  setIsSubmittingBid(true);

                                  await vendorService.submitBid(
                                    selectedTender.id,
                                    Number(bidPrice),
                                    bidProposal,
                                  );

                                  setIsEditingBid(false);
                                  alert("Bid updated successfully.");
                                } catch (error) {
                                  console.error(error);
                                  alert("Failed to update bid.");
                                } finally {
                                  setIsSubmittingBid(false);
                                }
                              }}
                              className="rounded-xl bg-[#2E5B9A] hover:bg-[#3b6eae] px-5 py-2.5 text-xs font-bold text-white transition shadow-md shadow-blue-500/10 disabled:opacity-50"
                            >
                              {isSubmittingBid ? "Updating..." : "Submit Updated Bid"}
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* BID HISTORY TIMELINE */}
            <div className="mt-8 border-t pt-6">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Bid History Timeline</h3>

              <div className="rounded-2xl border border-slate-100 p-5 space-y-4">
                {selectedTender.bidHistory?.map((bid: any) => (
                  <div key={bid.id} className="relative pl-8 pb-4 last:pb-0">
                    <div className="absolute left-0 top-1">
                      <div className="h-3.5 w-3.5 rounded-full bg-[#EBF3FC] border border-[#2E5B9A] flex items-center justify-center">
                        <div className="h-1.5 w-1.5 rounded-full bg-[#2E5B9A]" />
                      </div>
                      <div className="absolute left-[6px] top-3.5 h-full w-px bg-slate-200" />
                    </div>
                    <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 hover:bg-slate-50 hover:border-blue-100 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-base font-bold text-[#2E5B9A] font-display">
                            {bid.amount}
                          </p>
                          <p className="text-3xs text-slate-400 font-mono uppercase tracking-widest mt-0.5">Bid Value</p>
                        </div>

                        <span className={`rounded-full px-2.5 py-0.5 text-3xs font-bold ${
                          bid.status === "AWARDED"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}>
                          {bid.status}
                        </span>
                      </div>

                      <p className="mt-3 text-xs text-slate-650 leading-relaxed font-sans font-light">
                        {bid.proposal}
                      </p>

                      <p className="mt-3 text-[10px] text-slate-400 font-mono">
                        Date: {new Date(bid.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE SECTION: TENDER RANKINGS & DIRECT SUPPORT CHAT */}
          <div className="space-y-6 shrink-0">
            
            {/* Tender Ranking Module */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                  Tender Ranking
                </h4>
                <span className="text-3xs font-semibold text-slate-400 font-mono uppercase tracking-widest">
                  Active Stats
                </span>
              </div>

              <div className="space-y-2.5">
                <div className="p-3.5 rounded-xl border border-blue-100 bg-[#EBF3FC]/40 flex items-center justify-between">
                  <div>
                    <p className="text-3xs font-bold text-[#2E5B9A] uppercase tracking-wider font-mono">Your Position</p>
                    <p className="text-3xs text-slate-400 mt-0.5 font-light">Current tender evaluation</p>
                  </div>
                  <span className="text-sm font-extrabold text-[#2E5B9A] bg-white border border-blue-150 px-3 py-1 rounded-lg">
                    {selectedTender.myPosition}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                  <p className="font-semibold text-slate-700">Current Round</p>
                  <p className="text-slate-800 font-bold font-mono">{selectedTender.currentRound}</p>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center text-xs">
                  <p className="font-semibold text-slate-700">Total Bids Submitted</p>
                  <p className="text-slate-800 font-bold font-mono">{selectedTender.myBidCount}</p>
                </div>
              </div>
            </div>

            {/* Direct Support Chat Module */}
            <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider font-mono">
                    GMAA Support
                  </h4>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4 min-h-[220px] max-h-[300px] overflow-y-auto custom-scrollbar space-y-3">
                  {messages.length === 0 ? (
                    <p className="text-3xs text-slate-450 text-center py-10 font-light italic">
                      No support messages logged yet. Contact GMAA compliance assistance below.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((message: any) => {
                        const isVendor = message.sender?.role === "VENDOR";
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isVendor ? "justify-end" : "justify-start"}`}
                          >
                            <div
                              className={`max-w-[85%] rounded-xl p-3 text-xs ${
                                isVendor
                                  ? "bg-[#2E5B9A] text-white"
                                  : "bg-white border border-slate-200"
                              }`}
                            >
                              <p className={`text-[9px] font-mono font-bold mb-1 uppercase tracking-wider ${isVendor ? "text-blue-100" : "text-slate-400"}`}>
                                {message.sender?.role}
                              </p>
                              <p className="leading-relaxed font-sans">{message.content}</p>
                              <p className={`text-[8px] mt-2 font-mono ${isVendor ? "text-blue-200/70" : "text-slate-400"}`}>
                                {new Date(message.createdAt).toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask GMAA Assistance Desk for support..."
                  className="w-full rounded-xl border border-slate-200 p-3 text-xs focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none transition duration-200"
                  rows={3}
                />
                <button
                  onClick={handleSendMessage}
                  className="mt-3 w-full rounded-xl bg-[#2E5B9A] hover:bg-[#3b6eae] py-3 text-xs font-bold text-white transition active:scale-95 shadow-md shadow-blue-500/10"
                >
                  Send Support Message
                </button>
              </div>
            </div>

          </div>

        </div>
      </div>
    );
  }

  // STANDARD VIEW (All Tenders Log Table)
  return (
    <div className="space-y-6 text-slate-800 animate-fade-in">
      
      {/* Title */}
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">My Active Tenders</h2>
          <p className="text-xs text-slate-400 mt-0.5">Tenders where your facility has logged active bids.</p>
        </div>
        <div className="text-[10px] font-bold font-mono px-3 py-1 bg-blue-50 text-[#2E5B9A] border border-blue-100 rounded-lg uppercase tracking-wider self-start sm:self-auto">
          COMPLIANCE LOGS ACTIVE
        </div>
      </div>

      {/* Futuristic Console Filters */}
      <div className="flex flex-col sm:flex-row gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <input
          type="text"
          placeholder="Search my tenders by ref or title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="flex-1 rounded-xl border border-slate-200 px-4 py-2 text-xs focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none transition"
        />

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 bg-white cursor-pointer hover:border-slate-350 focus:outline-none focus:ring-1 focus:ring-[#2E5B9A]"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 bg-white cursor-pointer hover:border-slate-350 focus:outline-none focus:ring-1 focus:ring-[#2E5B9A]"
        >
          <option value="All">All Statuses</option>
          <option value="AWARDED">Awarded</option>
          <option value="BROADCASTED">Active</option>
          <option value="CLOSED">Closed</option>
        </select>
      </div>

      {/* Futuristic Table Card Log */}
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <table className="w-full text-xs text-left font-sans">
          <thead className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
            <tr>
              <th className="p-4">Tender ID</th>
              <th className="p-4">Title</th>
              <th className="p-4">Deadline</th>
              <th className="p-4">Round</th>
              <th className="p-4">Position</th>
              <th className="p-4">Bid Count</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {filteredTenders.map((tender) => {
              const deadlineLabel = getDeadlineLabel(tender.deadline);
              const isClosed = deadlineLabel === "Closed";
              return (
                <tr
                  key={tender.tenderNumber}
                  className="group hover:bg-[#EBF3FC]/20 transition-all"
                >
                  <td className="p-4">
                    <span className="rounded bg-[#EBF3FC] border border-blue-100 px-2 py-0.5 text-3xs font-mono font-bold text-[#2E5B9A]">
                      {tender.tenderNumber}
                    </span>
                  </td>
                  
                  <td className="p-4 font-semibold text-slate-800 max-w-sm truncate group-hover:text-[#2E5B9A] transition-colors">
                    {tender.title}
                  </td>

                  <td className="p-4 font-semibold">
                    <span className={`inline-flex items-center gap-1 ${
                      isClosed ? "text-slate-400" : "text-[#D91B24]"
                    }`}>
                      <Clock className="h-3.5 w-3.5" />
                      {deadlineLabel}
                    </span>
                  </td>

                  <td className="p-4 text-slate-600 font-bold font-mono">{tender.currentRound}</td>

                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-3xs font-bold ${
                      tender.myPosition === "L1"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : tender.myPosition === "L2"
                        ? "bg-amber-50 text-amber-600 border border-amber-100"
                        : tender.myPosition === "L3"
                        ? "bg-rose-50 text-rose-600 border border-rose-100"
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}>
                      {tender.myPosition}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-3xs font-bold text-slate-600 border border-slate-150">
                      {tender.myBidCount} Bids
                    </span>
                  </td>

                  <td className="p-4">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-3xs font-bold ${
                      tender.vendorStatus === "Awarded"
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                        : tender.vendorStatus === "Open for Bidding"
                        ? "bg-[#EBF3FC] text-[#2E5B9A] border border-blue-150"
                        : "bg-slate-50 text-slate-550 border border-slate-200"
                    }`}>
                      {tender.vendorStatus}
                    </span>
                  </td>

                  <td className="p-4">
                    <button
                      type="button"
                      onClick={() => {
                        console.log("BUTTON CLICKED", tender.id);
                        setSelectedTenderId(tender.id);
                      }}
                      className="rounded-lg bg-[#2E5B9A] hover:bg-[#3b6eae] px-3.5 py-1.5 text-3xs font-bold text-white transition active:scale-[0.98] shadow-sm flex items-center gap-1"
                    >
                      Open Session
                      <ChevronRight className="h-3 w-3" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}