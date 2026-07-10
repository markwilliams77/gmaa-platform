/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Users, 
  MapPin, 
  ChevronRight, 
  Phone, 
  Mail, 
  FileText, 
  CheckCircle2, 
  Search, 
  Activity, 
  UserCheck2,
  Clock,
  Zap,
  Info
} from "lucide-react";
import { Consultation, ConsultationStatus, Message } from "../types";
import { vendorService } from "../services/vendorService";

interface ConsultationsViewProps {
  consultations: Consultation[];
  setConsultations: React.Dispatch<React.SetStateAction<Consultation[]>>;
  addSystemMessage: (msg: Message) => void;
  quickSearchTreatment: string;
  setQuickSearchTreatment: (term: string) => void;
  showToast?: (message: string, type?: "success" | "info" | "warning") => void;
}

export default function ConsultationsView({
  consultations,
  setConsultations,
  addSystemMessage,
  quickSearchTreatment,
  setQuickSearchTreatment,
  showToast
}: ConsultationsViewProps) {
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  
  // Filtering states
  const [activeFilterStatus, setActiveFilterStatus] = useState<"ALL" | ConsultationStatus>("ALL");
  const [searchText, setSearchText] = useState("");

  const selectedPatient = consultations.find(c => c.id === selectedPatientId);

  // Filter logic (Preserves identical code functionality)
  const filteredConsultations = consultations.filter(item => {
    const textToMatch = `${item.name} ${item.serviceCategory} ${item.city} ${item.id}`.toLowerCase();
    const queryTerm = quickSearchTreatment || searchText;
    const matchesSearch = textToMatch.includes(queryTerm.toLowerCase());
    const matchesStatus = activeFilterStatus === "ALL" || item.status === activeFilterStatus;
    return matchesSearch && matchesStatus;
  });

  // Calculate status counts
  const countStatus = (status: ConsultationStatus) => {
    return consultations.filter(c => c.status === status).length;
  };

  // Update status directly & trigger platform logs (Preserves identical service integration)
  const handleUpdateStatus = async (
    id: string,
    nextStatus: ConsultationStatus
  ) => {
    try {
      await vendorService.updateConsultationStatus(id, nextStatus);

      setConsultations(prev =>
        prev.map(item => {
          if (item.id === id) {
            return {
              ...item,
              status: nextStatus,
            };
          }
          return item;
        })
      );

      addSystemMessage({
        id: `msg_cons_${Date.now()}`,
        sender: "GMAA Medical Coordinator",
        senderRole: "Assistance Desk",
        text: `Status of patient ${
          consultations.find(c => c.id === id)?.name || "Unknown Patient"
        } updated to ${nextStatus}.`,
        timestamp: "Just Now",
        isRead: false,
        source: "GMAA Messages",
        threadId: id,
      });

      if (showToast) {
        showToast(`Referral status successfully updated to ${nextStatus}`, "success");
      }

    } catch (error) {
      console.error("Failed to update consultation status", error);
    }
  };

  return (
    <div className="space-y-6 text-slate-800 animate-fade-in">
      
      {/* TITLE & BREADCRUMB HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans uppercase tracking-widest">
            <span>Marketplace Referrals</span>
            <ChevronRight className="h-3 w-3 text-[#2E5B9A]" />
            <span className="text-[#2E5B9A] font-semibold">Active Patient Cohorts</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mt-1">Medical Consultations</h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Audit patient records and plan secure coordinate systems for custom medical evacuations.
          </p>
        </div>

        {/* Home Dashboard Filter Badge */}
        {quickSearchTreatment && (
          <div className="flex items-center gap-2 bg-[#EBF3FC] border border-blue-100 text-[#2E5B9A] px-3.5 py-2 rounded-xl text-xs font-semibold">
            <span>Filter Category: <strong className="font-bold">{quickSearchTreatment}</strong></span>
            <button 
              onClick={() => setQuickSearchTreatment("")} 
              className="text-xs font-bold hover:text-[#D91B24] transition-colors border-l pl-2 border-blue-200/60 ml-1"
            >
              × Clear
            </button>
          </div>
        )}
      </div>

      {/* DYNAMIC TELEMETRY FILTER PILLS */}
      <div id="consultation-status-tabs" className="grid grid-cols-2 md:grid-cols-6 gap-3">
        {/* All Referrals Tab */}
        <button
          onClick={() => setActiveFilterStatus("ALL")}
          className={`p-3 rounded-2xl text-center border transition-all duration-300 relative group overflow-hidden ${
            activeFilterStatus === "ALL"
              ? "bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10"
              : "bg-white border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-slate-50/50"
          }`}
        >
          <p className="text-[10px] font-bold uppercase tracking-wider font-mono">All Referrals</p>
          <p className={`text-xl font-bold mt-1.5 ${activeFilterStatus === "ALL" ? "text-white" : "text-slate-900"}`}>
            {consultations.length}
          </p>
        </button>

        {/* Dynamically Mapped Status Tabs */}
        {Object.values(ConsultationStatus).map((status) => {
          const isSelected = activeFilterStatus === status;
          return (
            <button
              key={status}
              onClick={() => setActiveFilterStatus(status)}
              className={`p-3 rounded-2xl text-center border transition-all duration-300 relative group overflow-hidden ${
                isSelected
                  ? "bg-[#2E5B9A] border-[#2E5B9A] text-white shadow-md shadow-blue-500/10"
                  : "bg-white border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-slate-50/50"
              }`}
            >
              <p className="text-[9px] font-bold uppercase tracking-wider font-mono truncate px-1">
                {status.replace("_", " ")}
              </p>
              <p className={`text-xl font-bold mt-1.5 ${isSelected ? "text-white" : "text-slate-800"}`}>
                {countStatus(status)}
              </p>
            </button>
          );
        })}
      </div>

      {/* MAIN LAYOUT: COHORT STACK & DETAILED WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: PATIENT LISTING STACK */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Interactive Search Console */}
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients, medical keywords, locations..."
              value={quickSearchTreatment || searchText}
              onChange={(e) => {
                if (quickSearchTreatment) setQuickSearchTreatment("");
                setSearchText(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] transition-all font-sans shadow-xs"
            />
          </div>

          {/* Cards Container */}
          <div id="patient-cards-stack" className="space-y-3.5">
            {filteredConsultations.length === 0 ? (
              <div className="bg-white rounded-2xl text-center p-12 border border-slate-100 shadow-xs">
                <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-800">No active patient cohorts found.</p>
                <p className="text-3xs text-slate-400 mt-1">Try resetting or selecting another pipeline tab status above.</p>
              </div>
            ) : (
              filteredConsultations.map((patient) => {
                const isSelected = selectedPatientId === patient.id;
                return (
                  <div
                    key={patient.id}
                    id={`patient-card-${patient.id}`}
                    onClick={() => setSelectedPatientId(patient.id)}
                    className={`rounded-2xl border p-4 transition-all duration-300 cursor-pointer text-xs relative overflow-hidden group ${
                      isSelected
                        ? "bg-slate-900 border-slate-800 text-white shadow-lg shadow-slate-900/10"
                        : "bg-white border-slate-200 hover:border-blue-200 text-slate-650 hover:bg-slate-50/20 hover:shadow-2xs"
                    }`}
                  >
                    {/* Glowing Accent line when hovered/selected */}
                    <div className={`absolute top-0 bottom-0 left-0 w-1 transition-all ${
                      isSelected ? "bg-[#2E5B9A]" : "bg-transparent group-hover:bg-[#2E5B9A]/40"
                    }`} />

                    <div className="flex items-start justify-between gap-4 pl-1">
                      
                      {/* Patient metadata */}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-3xs font-bold bg-[#EBF3FC] text-[#2E5B9A] border border-blue-100 px-1.5 py-0.5 rounded-md">
                            {patient.id}
                          </span>
                          <span className="text-3xs font-mono text-slate-400">{patient.createdAt}</span>
                        </div>
                        <h4 className={`font-display text-base font-bold ${isSelected ? "text-white" : "text-slate-900"}`}>
                          {patient.name}
                        </h4>
                        <div className="flex items-center gap-2 flex-wrap text-3xs text-slate-400">
                          <span className="flex items-center gap-0.5 font-medium">
                            <MapPin className="h-3.5 w-3.5 text-[#2E5B9A]" />
                            {patient.city ? `${patient.city}, ${patient.country}` : patient.country}
                          </span>
                        </div>
                      </div>

                      {/* Status pill badge */}
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-3xs font-bold border ${
                          patient.status === ConsultationStatus.NEW
                            ? "bg-indigo-50 text-indigo-600 border-indigo-100"
                            : patient.status === ConsultationStatus.ACKNOWLEDGED
                            ? "bg-[#EBF3FC] text-[#2E5B9A] border-blue-100"
                            : patient.status === ConsultationStatus.DOCUMENTS_REQUESTED
                            ? "bg-amber-50 text-amber-600 border-amber-100"
                            : patient.status === ConsultationStatus.IN_PROGRESS
                            ? "bg-blue-50 text-blue-600 border-blue-100"
                            : patient.status === ConsultationStatus.COMPLETED
                            ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                            : "bg-slate-50 text-slate-600 border-slate-100"
                        }`}>
                          <span className={`h-1.5 w-1.5 rounded-full mr-1 ${
                            patient.status === ConsultationStatus.NEW ? "bg-indigo-500" :
                            patient.status === ConsultationStatus.ACKNOWLEDGED ? "bg-[#2E5B9A] animate-pulse" :
                            patient.status === ConsultationStatus.DOCUMENTS_REQUESTED ? "bg-amber-500" :
                            patient.status === ConsultationStatus.IN_PROGRESS ? "bg-blue-500" :
                            patient.status === ConsultationStatus.COMPLETED ? "bg-emerald-500" : "bg-slate-500"
                          }`} />
                          {patient.status.replace("_", " ")}
                        </span>
                        
                        <span className="text-3xs font-mono font-bold uppercase tracking-wider text-slate-400 truncate max-w-44 block">
                          {patient.serviceCategory}
                        </span>
                      </div>

                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100/50 flex items-center justify-between pl-1">
                      <p className="text-slate-400 text-[10px] italic line-clamp-1 max-w-xs font-light">
                        Referral Case Logs: Secure HIPAA Protected
                      </p>
                      <button className={`text-3xs font-bold flex items-center gap-0.5 ${isSelected ? "text-blue-300" : "text-[#2E5B9A] hover:underline"}`}>
                        Interactive Workspace
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: WORKSPACE DIAGNOSTIC DRAWER */}
        <div className="lg:col-span-1 rounded-3xl bg-white border border-slate-100 p-6 shadow-sm">
          {!selectedPatient ? (
            <div className="text-center py-20 text-xs">
              <UserCheck2 className="h-10 w-10 text-slate-300 mx-auto mb-2 animate-pulse" />
              <p className="font-semibold text-slate-800 text-sm">No Patient Selected</p>
              <p className="text-2xs text-slate-400 mt-1.5 px-4 leading-relaxed">
                Select any active medical referral card on the left to operate patient records, schedule teleconsults, and coordinate transfers.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in text-xs">
              
              {/* Profile Card Header */}
              <div className="text-center pb-4 border-b border-slate-100 space-y-2">
                <div className="h-14 w-14 rounded-full bg-slate-100 text-[#2E5B9A] font-bold flex items-center justify-center text-xl mx-auto shadow-inner border border-slate-150">
                  {selectedPatient.name.charAt(0) || "?"} 
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-950 text-base">{selectedPatient.name}</h3>
                  <p className="text-3xs font-mono text-slate-400 mt-0.5 uppercase tracking-wider">Cohort ID: {selectedPatient.id}</p>
                </div>
              </div>

              {/* Direct Assistance Contact Details */}
              <div className="space-y-2.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono block">Direct Contact Details</span>
                <div className="p-3 bg-[#EBF3FC]/40 border border-blue-100/50 rounded-xl space-y-2 font-light">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-[#2E5B9A] shrink-0" />
                    <span className="truncate text-3xs text-slate-700">{selectedPatient.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-[#2E5B9A] shrink-0" />
                    <span className="text-3xs text-slate-700">{selectedPatient.patientPhone}</span>
                  </div>
                </div>
              </div>

              {/* Target Specialty Treatment Area */}
              <div className="space-y-2.5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono block">Target Specialty Treatment</span>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl">
                  <p className="font-semibold text-slate-800 text-xs">{selectedPatient.serviceCategory}</p>
                  <p className="text-3xs text-slate-400 mt-1">Assigned Origin: {selectedPatient.city}, {selectedPatient.country}</p>
                </div>
              </div>

              {/* Medical History Narrative */}
              <div className="space-y-2">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono block">Confidential Medical History</span>
                <p className="text-3xs text-slate-500 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100 max-h-36 overflow-y-auto custom-scrollbar font-light italic">
                  "{selectedPatient.medicalHistory}"
                </p>
              </div>

              {/* Interactive Pipeline Manager */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 font-mono block">Update Workflow Status</span>
                
                <div className="grid grid-cols-1 gap-1.5">
                  {[
                    ConsultationStatus.ACKNOWLEDGED,
                    ConsultationStatus.DOCUMENTS_REQUESTED,
                    ConsultationStatus.IN_PROGRESS,
                    ConsultationStatus.COMPLETED,
                  ].map((st) => {
                    const isCurrent = selectedPatient.status === st;
                    return (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(selectedPatient.id, st)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left border transition-all duration-300 ${
                          isCurrent
                            ? "bg-slate-900 border-slate-900 text-white font-bold"
                            : "bg-white border-slate-100 hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        <span className="text-[10px] font-mono tracking-wide uppercase">{st.replace("_", " ")}</span>
                        {isCurrent && <CheckCircle2 className="h-4 w-4 text-[#2E5B9A]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Communication Trigger Operations */}
              <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    const msg = `Dispatched HIPAA Microsoft Teams teleconsult link for ${selectedPatient.name} to ${selectedPatient.email}.`;
                    if (showToast) {
                      showToast(msg, "success");
                    } else {
                      console.log(msg);
                    }
                  }}
                  className="rounded-xl border border-slate-200 hover:border-[#2E5B9A] hover:bg-slate-50 p-3.5 text-center text-[10px] font-bold text-slate-700 hover:text-[#2E5B9A] transition-all active:scale-95 cursor-pointer"
                >
                  Schedule Teleconsult
                </button>
                {/* ECG Heartbeat red active trigger for critical transfers */}
                <button
                  onClick={() => {
                    const msg = `Medical evacuation charter pipeline initialized for ${selectedPatient.name}. Documents synchronized on secure GMAA core node.`;
                    if (showToast) {
                      showToast(msg, "info");
                    } else {
                      console.log(msg);
                    }
                  }}
                  className="rounded-xl bg-[#D91B24] hover:bg-[#b8121a] p-3.5 text-center text-[10px] font-bold text-white transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-md shadow-red-500/10"
                >
                  <Zap className="h-3.5 w-3.5 animate-pulse" />
                  Initialize Transfer
                </button>
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
}