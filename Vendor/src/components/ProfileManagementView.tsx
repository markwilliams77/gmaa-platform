/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, 
  MapPin, 
  ChevronRight, 
  User, 
  Landmark, 
  FileText, 
  Plus, 
  Check, 
  CheckCircle2, 
  DollarSign, 
  Sparkles, 
  Mail, 
  Image as ImageIcon,
  Award,
  Video,
  Users,
  ShieldCheck,
  Stethoscope,
  Briefcase
} from "lucide-react";
import { HospitalProfile, Doctor, Treatment } from "../types";

interface ProfileManagementProps {
  profile: HospitalProfile;
  setProfile: React.Dispatch<React.SetStateAction<HospitalProfile>>;
  showToast?: (message: string, type?: "success" | "info" | "warning") => void;
}

export default function ProfileManagementView({
  profile,
  setProfile,
  showToast
}: ProfileManagementProps) {
  const [activePane, setActivePane] = useState<"Info" | "Doctors" | "Treatments" | "Accreditations">("Info");
  
  // Doctor form states
  const [newDocName, setNewDocName] = useState("");
  const [newDocTitle, setNewDocTitle] = useState("");
  const [newDocExpe, setNewDocExpe] = useState("");
  const [newDocSpec, setNewDocSpec] = useState("");
  const [newDocLang, setNewDocLang] = useState("");
  const [showAddDoctor, setShowAddDoctor] = useState(false);

  // Treatment form states
  const [newTreatName, setNewTreatName] = useState("");
  const [newTreatCate, setNewTreatCate] = useState("");
  const [newTreatCost, setNewTreatCost] = useState("");
  const [newTreatDura, setNewTreatDura] = useState("");
  const [newTreatSucc, setNewTreatSucc] = useState("");
  const [showAddTreatment, setShowAddTreatment] = useState(false);

  // General info save feedback
  const [isSavingInfo, setIsSavingInfo] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle general hospital info save (Preserves original code logic)
  const handleSaveInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingInfo(true);
    setTimeout(() => {
      setIsSavingInfo(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }, 1000);
  };

  // Add doctor to state
  const handleAddDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDocName || !newDocTitle || !newDocSpec) return;

    const newDoctor: Doctor = {
      id: `doc_${Date.now()}`,
      name: newDocName,
      title: newDocTitle,
      specialty: newDocSpec,
      experience: newDocExpe || "5 Years",
      languages: newDocLang ? newDocLang.split(",").map(l => l.trim()) : ["English"],
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
    };

    setProfile(prev => ({
      ...prev,
      doctors: [...prev.doctors, newDoctor]
    }));

    // Reset fields
    setNewDocName("");
    setNewDocTitle("");
    setNewDocExpe("");
    setNewDocSpec("");
    setNewDocLang("");
    setShowAddDoctor(false);
  };

  // Add treatment to state
  const handleAddTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTreatName || !newTreatCate || !newTreatCost) return;

    const newTreatment: Treatment = {
      id: `treat_${Date.now()}`,
      name: newTreatName,
      category: newTreatCate,
      costEstimate: newTreatCost,
      duration: newTreatDura || "3 Days Inpatient",
      successRate: newTreatSucc || "98%"
    };

    setProfile(prev => ({
      ...prev,
      treatments: [...prev.treatments, newTreatment]
    }));

    setNewTreatName("");
    setNewTreatCate("");
    setNewTreatCost("");
    setNewTreatDura("");
    setNewTreatSucc("");
    setShowAddTreatment(false);
  };

  return (
    <div className="space-y-6 text-slate-800 animate-fade-in">
      
      {/* TITLE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 font-sans uppercase tracking-widest">
            <span>Alliance Credentials Console</span>
            <ChevronRight className="h-3 w-3 text-[#2E5B9A]" />
            <span className="text-[#2E5B9A] font-semibold">Profile Management</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-slate-900 mt-1">Marketplace Hospital Profile</h2>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Revise specialized surgeons, clinical packages, facility visual galleries, and authorized certifications.
          </p>
        </div>
        <div className="text-[10px] font-bold font-mono px-3 py-1.5 bg-blue-50 text-[#2E5B9A] border border-blue-100 rounded-lg uppercase tracking-wider self-start sm:self-auto">
          PROFILE DESK ACTIVE
        </div>
      </div>

      {/* CLINCAL SUB-PANE TABS */}
      <div id="profile-tabs" className="flex border-b border-slate-200 bg-white px-2 rounded-t-2xl">
        {(["Info", "Doctors", "Treatments", "Accreditations"] as const).map((pane) => (
          <button
            key={pane}
            onClick={() => setActivePane(pane)}
            className={`px-6 py-3.5 font-display text-xs font-semibold uppercase tracking-wider transition-all border-b-2 outline-none ${
              activePane === pane
                ? "border-[#2E5B9A] text-[#2E5B9A] font-bold"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            {pane}
          </button>
        ))}
      </div>

      {/* CONTENT WORKSPACE BENTO ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT/MID 2 COLUMNS: CONFIGURATION FORMS */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* A. HOSPITAL GENERAL INFO FORM */}
          {activePane === "Info" && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-display font-bold text-slate-900 text-sm uppercase tracking-wide font-mono">Core Hospital Details</h3>
                <span className="text-3xs text-[#2E5B9A] bg-[#EBF3FC] border border-blue-100 px-2 py-0.5 rounded-md font-mono font-bold">GMAA Profile Node</span>
              </div>

              <form onSubmit={handleSaveInfo} className="space-y-4 font-sans text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono">Commercial Marketplace Name*</label>
                    <input
                      type="text"
                      required
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-2.5 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono">Corporate Registered Legal Name*</label>
                    <input
                      type="text"
                      required
                      value={profile.legalName}
                      onChange={(e) => setProfile(prev => ({ ...prev, legalName: e.target.value }))}
                      className="w-full p-2.5 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono">Total Licensed Beds</label>
                    <input
                      type="number"
                      value={profile.bedsCount}
                      onChange={(e) => setProfile(prev => ({ ...prev, bedsCount: parseInt(e.target.value, 10) || 500 }))}
                      className="w-full p-2.5 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono">Established Year</label>
                    <input
                      type="number"
                      value={profile.establishedYear}
                      onChange={(e) => setProfile(prev => ({ ...prev, establishedYear: parseInt(e.target.value, 10) || 2011 }))}
                      className="w-full p-2.5 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono">Location Hub HQ*</label>
                    <input
                      type="text"
                      required
                      value={profile.hqLocation}
                      onChange={(e) => setProfile(prev => ({ ...prev, hqLocation: e.target.value }))}
                      className="w-full p-2.5 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono">Promotional Description Narrative</label>
                  <textarea
                    rows={4}
                    value={profile.description}
                    onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-3 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none leading-relaxed transition"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  {saveSuccess && (
                    <span className="text-emerald-600 font-bold flex items-center gap-1 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-lg text-3xs">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500 animate-bounce" /> Credentials Saved Securing Node
                    </span>
                  )}
                  <button
                    id="save-profile-general-btn"
                    type="submit"
                    disabled={isSavingInfo}
                    className="rounded-xl bg-[#2E5B9A] hover:bg-[#3b6eae] px-5 py-2.5 font-bold text-white shadow-md shadow-blue-500/10 transition active:scale-95 flex items-center justify-center gap-2"
                  >
                    {isSavingInfo ? "Saving credentials..." : "Update Facility Credentials"}
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* B. SPECIALIZED TEAM DOCTORS TAB */}
          {activePane === "Doctors" && (
            <div className="space-y-6">
              
              {/* Doctor Header */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-sm">Medical Specialist Team ({profile.doctors.length})</h3>
                  <p className="text-2xs text-slate-400 font-sans mt-0.5">Profile your key clinical leaders to win active assistance bidding.</p>
                </div>
                <button
                  id="toggle-add-doctor-btn"
                  onClick={() => setShowAddDoctor(!showAddDoctor)}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#2E5B9A] hover:bg-[#3b6eae] px-4 text-xs font-bold text-white transition-all shadow-md shadow-blue-500/10"
                >
                  <Plus className="h-4 w-4" />
                  Register Surgeon
                </button>
              </div>

              {/* Add Doctor Sub Form */}
              {showAddDoctor && (
                <div className="bg-slate-50 border border-slate-150 p-5 rounded-3xl space-y-4 animate-fade-in text-xs">
                  <h4 className="font-bold text-slate-900 uppercase font-mono tracking-wider">GMAA Surgeon Registrar</h4>
                  <form onSubmit={handleAddDoctor} className="space-y-4">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono">Surgeon Full Name*</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. Jane Smith"
                          value={newDocName}
                          onChange={(e) => setNewDocName(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono">Academic / Clinical Title*</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Chief Pediatric Oncologist"
                          value={newDocTitle}
                          onChange={(e) => setNewDocTitle(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono">Years of Practical Experience</label>
                        <input
                          type="text"
                          placeholder="e.g. 18 Years"
                          value={newDocExpe}
                          onChange={(e) => setNewDocExpe(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono">Sub-specialty Competence*</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Robotic Joint Implants"
                          value={newDocSpec}
                          onChange={(e) => setNewDocSpec(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono">Languages (comma-separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. English, French, Swahili"
                          value={newDocLang}
                          onChange={(e) => setNewDocLang(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddDoctor(false)}
                        className="rounded-lg px-3 py-1.5 font-bold text-slate-500 hover:text-slate-800 transition"
                      >
                        Cancel
                      </button>
                      <button
                        id="submit-doctor-doc-btn"
                        type="submit"
                        className="rounded-lg bg-[#2E5B9A] hover:bg-[#3b6eae] text-white font-bold px-4 py-1.5 shadow-sm active:scale-95 transition"
                      >
                        Insert Record
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* Doctors Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.doctors.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-2xl border border-slate-100 p-4.5 flex gap-4 group hover:border-blue-200 hover:shadow-2xs transition-all duration-300 font-sans text-xs">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="h-16 w-16 rounded-xl object-cover shrink-0 bg-slate-50 border border-slate-100"
                    />
                    <div className="min-w-0 space-y-1 flex-1">
                      <h4 className="font-display font-semibold text-sm text-slate-900 group-hover:text-[#2E5B9A] transition-colors truncate">{doc.name}</h4>
                      <p className="text-[9px] text-[#2E5B9A] font-bold font-mono uppercase tracking-wide">{doc.title}</p>
                      
                      <div className="pt-2 flex flex-col gap-0.8 text-3xs text-slate-500 leading-normal font-light">
                        <p>Specialty Focus: <strong className="font-semibold text-slate-700">{doc.specialty}</strong></p>
                        <p>Clinical Tenure: <strong className="font-semibold text-slate-700">{doc.experience}</strong></p>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-2">
                        {doc.languages.map((lng, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 bg-[#EBF3FC] text-[#2E5B9A] border border-blue-50/50 rounded-md font-sans font-medium">
                            {lng}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

          {/* C. FIXED PRICE CLINICAL TREATMENTS & PACKAGES */}
          {activePane === "Treatments" && (
            <div className="space-y-6">
              
              <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-sm">Preset Clinical Treatments ({profile.treatments.length})</h3>
                  <p className="text-2xs text-slate-400 font-sans mt-0.5">Declare pre-routed service estimates to GMAA caseworkers.</p>
                </div>
                <button
                  id="toggle-add-treatment-btn"
                  onClick={() => setShowAddTreatment(!showAddTreatment)}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl bg-[#2E5B9A] hover:bg-[#3b6eae] px-4 text-xs font-bold text-white transition-all shadow-md shadow-blue-500/10"
                >
                  <Plus className="h-4 w-4" />
                  Define Treatment Package
                </button>
              </div>

              {/* Add Treatment Form */}
              {showAddTreatment && (
                <div className="bg-slate-50 border border-slate-150 p-5 rounded-3xl space-y-4 animate-fade-in text-xs">
                  <h4 className="font-bold text-slate-900 uppercase font-mono tracking-wider">Treatment Definition Setup</h4>
                  <form onSubmit={handleAddTreatment} className="space-y-4">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono">Treatment/Surgery Title Name*</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Robotically-Guided Spinal Fusion"
                          value={newTreatName}
                          onChange={(e) => setNewTreatName(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono">Marketplace Category Board Name*</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Neurosurgery"
                          value={newTreatCate}
                          onChange={(e) => setNewTreatCate(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono">Accrued Cost Range Estimate ($)*</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. $12,000 - $15,000"
                          value={newTreatCost}
                          onChange={(e) => setNewTreatCost(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono">Assigned SLA Inpatient Duration</label>
                        <input
                          type="text"
                          placeholder="e.g. 5 Days Inpatient"
                          value={newTreatDura}
                          onChange={(e) => setNewTreatDura(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="block text-slate-500 font-bold text-[10px] uppercase tracking-widest font-mono">Success Rate Ratio (%)</label>
                        <input
                          type="text"
                          placeholder="e.g. 98.4%"
                          value={newTreatSucc}
                          onChange={(e) => setNewTreatSucc(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddTreatment(false)}
                        className="rounded-lg px-3 py-1.5 font-bold text-slate-500 hover:text-slate-800 transition"
                      >
                        Cancel
                      </button>
                      <button
                        id="submit-treatment-btn"
                        type="submit"
                        className="rounded-lg bg-[#2E5B9A] hover:bg-[#3b6eae] text-white font-bold px-4 py-1.5 shadow-sm active:scale-95 transition"
                      >
                        Publish Package
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* Treatments Log Table */}
              <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs font-sans">
                    <thead className="bg-slate-50/70 text-slate-400 border-b border-slate-100 uppercase tracking-widest text-[10px] font-bold font-mono">
                      <tr>
                        <th className="py-3.5 px-5">Treatment Offer</th>
                        <th className="py-3.5 px-5">Category</th>
                        <th className="py-3.5 px-5">Value Index</th>
                        <th className="py-3.5 px-5">Inpatient Scope</th>
                        <th className="py-3.5 px-5 text-right">Success Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-650">
                      {profile.treatments.map((tr) => (
                        <tr key={tr.id} className="hover:bg-[#EBF3FC]/10 transition-colors">
                          <td className="py-3.5 px-5 font-bold text-slate-900 group-hover:text-[#2E5B9A]">{tr.name}</td>
                          <td className="py-3.5 px-5 uppercase font-mono text-3xs font-semibold text-slate-400">{tr.category}</td>
                          <td className="py-3.5 px-5 font-bold text-[#2E5B9A]">{tr.costEstimate}</td>
                          <td className="py-3.5 px-5 text-slate-500">{tr.duration}</td>
                          <td className="py-3.5 px-5 text-right font-extrabold text-slate-850 font-mono">{tr.successRate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* D. ACCREDITATIONS & CERTIFICATES */}
          {activePane === "Accreditations" && (
            <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm space-y-6 animate-fade-in font-sans text-xs">
              
              <div className="pb-3 border-b border-slate-100 flex justify-between items-center">
                <div>
                  <h3 className="font-display font-bold text-slate-900 text-sm">Regulatory Accreditations</h3>
                  <p className="text-2xs text-slate-400 font-sans mt-0.5">Approved clinical compliance records cleared by the GMAA Board.</p>
                </div>
                <span className="text-3xs text-[#2E5B9A] bg-[#EBF3FC] border border-blue-100 px-2 py-0.5 rounded-md font-mono font-bold">COMPLIANCE METRICS</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.certifications.map((cert, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex gap-3.5 items-start group hover:border-blue-200 transition-all duration-300">
                    <div className="h-8 w-8 rounded-lg bg-[#EBF3FC] border border-blue-100 text-[#2E5B9A] flex items-center justify-center shrink-0">
                      <Award className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-xs">{cert}</p>
                      <p className="text-[10px] text-slate-400 mt-1 font-mono uppercase tracking-wider">Audit: GMAA Gold Verified Node</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload licensing segment */}
              <div className="border-t border-slate-100 pt-6 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase font-mono tracking-wider">Upload New Regulatory Certificate</h4>
                <div 
                  className="rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center hover:border-blue-300 transition-all bg-slate-50/50 cursor-pointer"
                  onClick={() => {
                    const msg = "HIPAA-secured document dispatcher initialized. Scanning certificate for JCI authenticity validation...";
                    if (showToast) {
                      showToast(msg, "info");
                    } else {
                      console.log(msg);
                    }
                  }}
                >
                  <Building2 className="h-8 w-8 text-slate-400 mx-auto" />
                  <p className="text-2xs font-semibold text-slate-700 mt-1.5">Select regulatory credential files</p>
                  <p className="text-3xs text-slate-400">JCI, NABH, or ISO state licensing logs limits 20MB</p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: REVISION PREVIEW CARD */}
        <div className="lg:col-span-1 space-y-6 font-sans">
          
          <div className="rounded-3xl border border-blue-900/40 bg-gradient-to-br from-[#0c1a30] to-[#12284c] text-white p-6 shadow-xl space-y-5 relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-12 -mt-12 h-36 w-32 rounded-full bg-blue-500/10 blur-2xl pointer-events-none" />
            <span className="text-3xs font-bold text-blue-300 uppercase tracking-widest font-mono">Live Listing Preview</span>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-display font-bold text-lg text-white">{profile.name}</h4>
                <p className="text-[10px] text-slate-350 font-mono tracking-wider uppercase mt-1 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#D91B24] animate-pulse" />
                  {profile.accreditationLevel}
                </p>
              </div>

              <p className="text-3xs text-slate-300 leading-relaxed font-sans line-clamp-4 font-light">
                {profile.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-2xs bg-slate-900/60 p-3 rounded-xl border border-blue-950/60 text-slate-200">
                <div>
                  <p className="text-slate-500 font-mono text-[9px] uppercase tracking-wider font-bold">Facility Beds</p>
                  <strong className="mt-0.5 block">{profile.bedsCount} Licensed</strong>
                </div>
                <div>
                  <p className="text-slate-500 font-mono text-[9px] uppercase tracking-wider font-bold">HQ Territory</p>
                  <strong className="mt-0.5 block truncate">{profile.hqLocation.split(",")[0]}</strong>
                </div>
              </div>

              {/* Media gallery items preview */}
              <div className="space-y-2.5">
                <span className="text-3xs font-bold text-slate-400 uppercase tracking-widest font-mono block">Facility Media Gallery ({profile.facilityImages.length} images)</span>
                <div className="grid grid-cols-3 gap-2 rounded-xl overflow-hidden">
                  {profile.facilityImages.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt="facility"
                      referrerPolicy="no-referrer"
                      className="h-12 w-full object-cover bg-slate-950 border border-blue-950"
                    />
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-4 border-t border-blue-950">
              <div className="bg-slate-950/40 p-3 rounded-xl border border-blue-950 text-3xs text-slate-450 flex items-center gap-3">
                <div className="h-7 w-7 rounded-lg bg-[#2E5B9A]/20 text-blue-300 flex items-center justify-center shrink-0">
                  <ImageIcon className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p className="font-bold text-slate-200">Alliance Verification Badge</p>
                  <p className="mt-0.5">Approved compliance score &gt; 80%</p>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}