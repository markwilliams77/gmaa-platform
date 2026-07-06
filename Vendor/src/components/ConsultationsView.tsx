/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Users, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Phone, 
  Mail, 
  FileText, 
  ExternalLink, 
  Check, 
  CheckCircle2, 
  Search, 
  Filter,
  User,
  Activity,
  UserCheck2,
  Trash2,
  ChevronDown
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

  // Filter logic
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

  // Update status directly & trigger platform logs
  const handleUpdateStatus = async (
  id: string,
  nextStatus: ConsultationStatus
) => {
  try {
    await vendorService.updateConsultationStatus(
      id,
      nextStatus
    );

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
        consultations.find(
          c => c.id === id
        )?.name || "Unknown Patient"
      } updated to ${nextStatus}.`,
      timestamp: "Just Now",
      isRead: false,
      source: "GMAA Messages",
      threadId: id,
    });

  } catch (error) {
    console.error(
      "Failed to update consultation status",
      error
    );
  }
};

    // Dispatch messages log update
    

  return (
    <div className="space-y-6">
      
      {/* Search and status overview bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans uppercase tracking-widest">
            <span>Marketplace Referrals</span>
            <ChevronRight className="h-3 w-3" />
            <span className="text-slate-600">Active Patient Cohorts</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mt-1">Medical Consultations</h2>
          <p className="text-xs text-slate-400 font-sans font-style mt-0.5">
            Process patient records assigned to your facility for custom medical evacuations.
          </p>
        </div>

        {/* Clear search term widget if it originates from home dashboard triggers */}
        {quickSearchTreatment && (
          <div className="flex items-center gap-2 bg-cyan-50 border border-cyan-200 text-cyan-700 px-3 py-1.5 rounded-xl text-xs">
            <span>Filter: <strong>{quickSearchTreatment}</strong></span>
            <button 
              onClick={() => setQuickSearchTreatment("")} 
              className="text-xs font-bold hover:text-cyan-900 font-sans pl-1.5"
            >
              × Clear Filter
            </button>
          </div>
        )}
      </div>

      {/* FILTER BAR TILES */}
      <div id="consultation-status-tabs" className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <button
          onClick={() => setActiveFilterStatus("ALL")}
          className={`p-3 rounded-2xl text-center border transition-all ${
            activeFilterStatus === "ALL"
              ? "bg-slate-900 border-slate-900 text-white shadow-sm"
              : "bg-white border-slate-200 text-slate-650 hover:border-slate-300"
          }`}
        >
          <p className="text-2xs font-semibold uppercase font-display tracking-wide">All Referrals</p>
          <p className="text-lg font-bold mt-1">{consultations.length}</p>
        </button>

        {Object.values(ConsultationStatus).map((status) => (
          <button
            key={status}
            onClick={() => setActiveFilterStatus(status)}
            className={`p-3 rounded-2xl text-center border transition-all ${
              activeFilterStatus === status
                ? "bg-cyan-500 border-cyan-500 text-slate-950 shadow-sm"
                : "bg-white border-slate-200 text-slate-650 hover:border-slate-300"
            }`}
          >
            <p className="text-3xs font-semibold uppercase tracking-wide font-display truncate">
              {status}
            </p>
            <p className="text-lg font-bold mt-1 text-slate-800">{countStatus(status)}</p>
          </button>
        ))}
      </div>

      {/* SEARCH AND GRID ACTION TILES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: ACTIVE COHORT LISTING */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="relative">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search patients, medical keywords, locations..."
              value={quickSearchTreatment || searchText}
              onChange={(e) => {
                if (quickSearchTreatment) setQuickSearchTreatment("");
                setSearchText(e.target.value);
              }}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:ring-1 focus:ring-cyan-500 transition-all font-sans"
            />
          </div>

          <div id="patient-cards-stack" className="space-y-3.5">
            {filteredConsultations.length === 0 ? (
              <div className="bg-white rounded-2xl text-center p-12 border border-slate-200/80">
                <Users className="h-10 w-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-800">No matching patient files found.</p>
                <p className="text-3xs text-slate-400 mt-1">Try resetting the status filter classifications.</p>
              </div>
            ) : (
              filteredConsultations.map((patient) => {
                const isSelected = selectedPatientId === patient.id;
                return (
                  <div
                    key={patient.id}
                    id={`patient-card-${patient.id}`}
                    onClick={() => setSelectedPatientId(patient.id)}
                    className={`rounded-2xl border p-4 transition-all cursor-pointer text-xs ${
                      isSelected
                        ? "bg-slate-900 border-slate-800 text-white shadow-md shadow-slate-900/10"
                        : "bg-white border-slate-200/80 hover:border-slate-350 text-slate-600 hover:shadow-2xs"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      
                      {/* Name & ID */}
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-3xs font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/10 px-1.5 py-0.2 rounded">
                            {patient.id}
                          </span>
                          <span className="text-2xs font-semibold font-sans text-slate-400">{patient.createdAt}</span>
                        </div>
                        <h4 className={`font-display text-base font-bold ${isSelected ? "text-white" : "text-slate-900 group-hover:text-cyan-600"}`}>
                          {patient.name}
                        </h4>
                        <div className="flex items-center gap-2 flex-wrap text-2xs text-slate-400 mt-1">
                          <span className="flex items-center gap-1 font-sans">
                            <MapPin className="h-3.5 w-3.5 text-cyan-500" />
                            {patient.city ? `${patient.city}, ${patient.country}`: patient.country}
                          </span>
                          <span>•</span>
                          <span><span>{patient.country}</span></span>
                        </div>
                      </div>

                      {/* Status indicator badge */}
                      <div className="text-right flex flex-col items-end gap-1.5">
                        <span className={`inline-flex items-center gap-0.8 rounded px-2 py-0.5 text-3xs font-bold ${
                          
                          patient.status === ConsultationStatus.NEW
                          ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                          : patient.status === ConsultationStatus.ACKNOWLEDGED
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : patient.status === ConsultationStatus.DOCUMENTS_REQUESTED
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : patient.status === ConsultationStatus.IN_PROGRESS
                          ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                          : patient.status === ConsultationStatus.COMPLETED
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-500/10 text-slate-400 border border-slate-500/20"
                          }`}>
                            <span
                            className={`h-1 w-1 rounded-full mr-1 ${
                              patient.status === ConsultationStatus.NEW
                              ? "bg-indigo-400"
                              : patient.status === ConsultationStatus.ACKNOWLEDGED
                              ? "bg-cyan-400 animate-pulse"
                              : patient.status === ConsultationStatus.DOCUMENTS_REQUESTED
                              ? "bg-amber-400"
                              : patient.status === ConsultationStatus.IN_PROGRESS
                              ? "bg-blue-400"
                              : patient.status === ConsultationStatus.COMPLETED
                              ? "bg-emerald-400"
                              : "bg-slate-400"
                            }`}
                            />
                            {patient.status}
                            </span>
                        
                        <span className="text-2xs font-semibold text-slate-300 italic truncate max-w-44 block">
                          {patient.serviceCategory}
                        </span>
                      </div>

                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100/50 flex items-center justify-between">
                      <p className="text-slate-400 text-3xs italic line-clamp-1 max-w-sm font-sans font-light">
                        History: N/A
                      </p>
                      <button className={`text-2xs font-bold flex items-center gap-0.5 ${isSelected ? "text-cyan-400" : "text-cyan-600 hover:underline"}`}>
                        Interactive Workspace
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

        {/* RIGHT COLUMN: WORKSPACE EXPANSION DRAWER */}
        <div className="lg:col-span-1 rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm">
          {!selectedPatient ? (
            <div className="text-center py-20 text-xs">
              <UserCheck2 className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="font-semibold text-slate-800">No Patient Selected</p>
              <p className="text-2xs text-slate-400 mt-1 px-4 leading-normal">
                Click any medical referral tile on the left to operate patient records, coordinate video calls, and modify status indexes.
              </p>
            </div>
          ) : (
            <div className="space-y-6 animate-fade-in font-sans text-xs">
              
              {/* Profile Header */}
              <div className="text-center pb-4 border-b border-slate-100 space-y-2">
                <div className="h-14 w-14 rounded-full bg-slate-900/5 text-slate-600 font-sans font-bold flex items-center justify-center text-xl mx-auto shadow-3xs">
                  {selectedPatient.name.charAt(0)|| "?"} 
                </div>
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-base">{selectedPatient.name}</h3>
                  <p className="text-3xs font-mono text-slate-400 mt-0.5">Cohort ID: {selectedPatient.id}</p>
                </div>
              </div>

              {/* Patient Contact Cards */}
              <div className="space-y-2.5">
                <span className="text-4xs font-bold uppercase tracking-wider text-slate-400 block">Direct Assistance Contact</span>
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-2 font-sans font-light">
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
                    <span className="truncate text-2xs text-slate-700">{selectedPatient.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5 text-cyan-600 shrink-0" />
                    <span className="text-2xs text-slate-700">{selectedPatient.patientPhone}</span>
                  </div>
                </div>
              </div>

              {/* Diagnosis Box */}
              <div className="space-y-2.5">
                <span className="text-4xs font-bold uppercase tracking-wider text-slate-400 block font-display">Target Specialty Treatment</span>
                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <p className="font-semibold text-slate-800 text-xs">{selectedPatient.serviceCategory}</p>
                  <p className="text-3xs text-slate-400 mt-0.5">Assigned Origin: {selectedPatient.city}, {selectedPatient.country}</p>
                </div>
              </div>

              {/* Medical History Narrative */}
              <div className="space-y-2">
                <span className="text-4xs font-bold uppercase tracking-wider text-slate-400 block">Confidential Medical History</span>
                <p className="text-2xs text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 max-h-40 overflow-y-auto custom-scrollbar font-light">
                  {selectedPatient.medicalHistory}
                </p>
              </div>

              {/* Interactive Status Flow Manager */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <span className="text-4xs font-bold uppercase tracking-wider text-slate-400 block font-display">Update Workflow Status</span>
                
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
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left border transition-all ${
                          isCurrent
                            ? "bg-slate-900 border-slate-900 text-white font-semibold"
                            : "bg-white border-slate-100 hover:bg-slate-50 text-slate-600"
                        }`}
                      >
                        <span className="text-3xs uppercase tracking-wide">{st}</span>
                        {isCurrent && <CheckCircle2 className="h-4 w-4 text-cyan-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Communication mock actions */}
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
                  className="rounded-xl border border-slate-200 p-2 text-center text-3xs font-semibold text-slate-700 hover:bg-slate-50 transition-all font-display active:scale-95 cursor-pointer"
                >
                  Schedule Teleconsult
                </button>
                <button
                  onClick={() => {
                    const msg = `Medical evacuation charter pipeline initialized for ${selectedPatient.name}. Documents synchronized on secure GMAA core node.`;
                    if (showToast) {
                      showToast(msg, "info");
                    } else {
                      console.log(msg);
                    }
                  }}
                  className="rounded-xl bg-slate-950 p-2 text-center text-3xs font-bold text-white hover:bg-slate-900 transition-all font-display active:scale-95 cursor-pointer"
                >
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
