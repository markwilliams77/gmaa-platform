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
  Video
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

  // Handle general hospital info save
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
    <div className="space-y-6">
      
      {/* Title Header */}
      <div>
        <div className="flex items-center gap-2 text-xs text-slate-400 font-sans uppercase tracking-widest">
          <span>Alliance Credentials Console</span>
          <ChevronRight className="h-3 w-3" />
          <span className="text-slate-650">Profile Management</span>
        </div>
        <h2 className="font-display text-2xl font-bold text-slate-900 mt-1">Marketplace Hospital Profile</h2>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          Revise specialized doctors, corporate packages, facilities videos, and certifications exposed to GMAA patients.
        </p>
      </div>

      {/* SUB PANES NAVIGATION TABS */}
      <div id="profile-tabs" className="flex border-b border-slate-200">
        {(["Info", "Doctors", "Treatments", "Accreditations"] as const).map((pane) => (
          <button
            key={pane}
            onClick={() => setActivePane(pane)}
            className={`px-5 py-3 font-display text-xs font-semibold uppercase tracking-wider transition-all border-b-2 ${
              activePane === pane
                ? "border-cyan-500 text-slate-950 font-bold"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            {pane}
          </button>
        ))}
      </div>

      {/* CONTENT WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT/MID 2 COLUMNS: DETAILED FORM FOR EACH PANE */}
        <div className="lg:col-span-2">
          
          {/* A. HOSPITAL GENERAL INFO FORM */}
          {activePane === "Info" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-3xs space-y-6">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="font-display font-medium text-slate-950">Core Hospital Details</h3>
                <span className="text-3xs text-slate-400 uppercase font-mono">GMAA Profile Node</span>
              </div>

              <form onSubmit={handleSaveInfo} className="space-y-4 font-sans text-xs">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-500 font-medium mb-1 pl-0.5">Commercial Marketplace Name*</label>
                    <input
                      type="text"
                      required
                      value={profile.name}
                      onChange={(e) => setProfile(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full p-2.5 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-medium mb-1 pl-0.5">Corporate Registered Legal Name*</label>
                    <input
                      type="text"
                      required
                      value={profile.legalName}
                      onChange={(e) => setProfile(prev => ({ ...prev, legalName: e.target.value }))}
                      className="w-full p-2.5 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-slate-500 font-medium mb-1 pl-0.5">Total Licensed Beds</label>
                    <input
                      type="number"
                      value={profile.bedsCount}
                      onChange={(e) => setProfile(prev => ({ ...prev, bedsCount: parseInt(e.target.value, 15) || 500 }))}
                      className="w-full p-2.5 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-medium mb-1 pl-0.5">Established Year</label>
                    <input
                      type="number"
                      value={profile.establishedYear}
                      onChange={(e) => setProfile(prev => ({ ...prev, establishedYear: parseInt(e.target.value, 10) || 2011 }))}
                      className="w-full p-2.5 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-500 font-medium mb-1 pl-0.5">Location Hub BKC*</label>
                    <input
                      type="text"
                      required
                      value={profile.hqLocation}
                      onChange={(e) => setProfile(prev => ({ ...prev, hqLocation: e.target.value }))}
                      className="w-full p-2.5 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1 pl-0.5">Promotional Description Narrative</label>
                  <textarea
                    rows={4}
                    value={profile.description}
                    onChange={(e) => setProfile(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full p-3 border border-slate-200 bg-slate-50 focus:bg-white rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3">
                  {saveSuccess && (
                    <span className="text-emerald-600 font-semibold flex items-center gap-1 bg-emerald-50 px-3 py-1 rounded-lg">
                      <CheckCircle2 className="h-4 w-4" /> Credentials saved securely
                    </span>
                  )}
                  <button
                    id="save-profile-general-btn"
                    type="submit"
                    disabled={isSavingInfo}
                    className="rounded-xl bg-slate-900 px-5 py-2.5 font-bold text-white hover:bg-slate-800 flex items-center justify-center gap-2"
                  >
                    {isSavingInfo ? "Saving credentials..." : "Update Facility Credentials"}
                  </button>
                </div>

              </form>

            </div>
          )}

          {/* B. SPECIALIZED TEAM DOCTORS LIST / FORM */}
          {activePane === "Doctors" && (
            <div className="space-y-6">
              
              {/* Top add prompt */}
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-3xs flex items-center justify-between">
                <div>
                  <h3 className="font-display font-medium text-slate-950">Specialized Medical Team ({profile.doctors.length})</h3>
                  <p className="text-2xs text-slate-400 font-sans mt-0.5">Highlight your top international coordinators to excel in surgical tenders.</p>
                </div>
                <button
                  id="toggle-add-doctor-btn"
                  onClick={() => setShowAddDoctor(!showAddDoctor)}
                  className="inline-flex h-8.5 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Register Surgeon
                </button>
              </div>

              {/* Collapsed adding workspace */}
              {showAddDoctor && (
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl space-y-4 animate-fade-in text-xs">
                  <h4 className="font-semibold text-slate-900">Hospital Staff Registrar</h4>
                  <form onSubmit={handleAddDoctor} className="space-y-4">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-500 font-medium mb-1">Surgeon Full Name*</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Dr. Jane Smith"
                          value={newDocName}
                          onChange={(e) => setNewDocName(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-medium mb-1">Academic / Clinical Title*</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Chief Pediatric Oncologist"
                          value={newDocTitle}
                          onChange={(e) => setNewDocTitle(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-500 font-medium mb-1">Years of Practical Experience</label>
                        <input
                          type="text"
                          placeholder="e.g. 18 Years"
                          value={newDocExpe}
                          onChange={(e) => setNewDocExpe(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-medium mb-1">Sub-specialty Competence*</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Robotic Joint Implants"
                          value={newDocSpec}
                          onChange={(e) => setNewDocSpec(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-medium mb-1">Languages (comma-separated)</label>
                        <input
                          type="text"
                          placeholder="e.g. English, French, Swahili"
                          value={newDocLang}
                          onChange={(e) => setNewDocLang(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddDoctor(false)}
                        className="rounded-lg px-3 py-1.5 font-semibold text-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        id="submit-doctor-doc-btn"
                        type="submit"
                        className="rounded-lg bg-cyan-500 text-slate-950 font-bold px-4 py-1.5 hover:bg-cyan-400"
                      >
                        Insert Record
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* Doctors listing grids */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.doctors.map((doc) => (
                  <div key={doc.id} className="bg-white rounded-2xl border border-slate-200/80 p-4.5 flex gap-4 group hover:border-cyan-200 transition-all font-sans text-xs">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      referrerPolicy="no-referrer"
                      className="h-16 w-16 rounded-xl object-cover shrink-0 bg-slate-100"
                    />
                    <div className="min-w-0 space-y-1">
                      <h4 className="font-display font-semibold text-sm text-slate-900 group-hover:text-cyan-600 truncate">{doc.name}</h4>
                      <p className="text-3xs text-slate-400 uppercase font-mono">{doc.title}</p>
                      
                      <div className="pt-2 flex flex-col gap-0.8 text-2xs text-slate-500 font-light">
                        <p>Specialty: <strong>{doc.specialty}</strong></p>
                        <p>Practice Duration: <strong>{doc.experience}</strong></p>
                      </div>

                      <div className="flex flex-wrap gap-1 pt-2">
                        {doc.languages.map((lng, idx) => (
                          <span key={idx} className="text-3xs px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded font-sans">
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
              
              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-3xs flex items-center justify-between">
                <div>
                  <h3 className="font-display font-medium text-slate-950">Pre-accrued Facility Treatments ({profile.treatments.length})</h3>
                  <p className="text-2xs text-slate-400 font-sans mt-0.5">Display complete transparency of escrow limits and success rates to GMAA desk.</p>
                </div>
                <button
                  id="toggle-add-treatment-btn"
                  onClick={() => setShowAddTreatment(!showAddTreatment)}
                  className="inline-flex h-8.5 items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-4 text-xs font-semibold text-white hover:bg-slate-800 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  Define Treatment Package
                </button>
              </div>

              {/* Add Treatment Form */}
              {showAddTreatment && (
                <div className="bg-slate-50 border border-slate-200 p-5 rounded-3xl space-y-4 animate-fade-in text-xs">
                  <h4 className="font-semibold text-slate-900">Treatment Definition Setup</h4>
                  <form onSubmit={handleAddTreatment} className="space-y-4">
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-500 font-medium mb-1">Treatment/Surgery Title Name*</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Robotically-Guided Spinal Fusion"
                          value={newTreatName}
                          onChange={(e) => setNewTreatName(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-medium mb-1">Marketplace Category Board Name*</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Neurosurgery"
                          value={newTreatCate}
                          onChange={(e) => setNewTreatCate(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-500 font-medium mb-1">Accrued Cost Range Estimate ($)*</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. $12,000 - $15,000"
                          value={newTreatCost}
                          onChange={(e) => setNewTreatCost(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-medium mb-1">Assigned SLA Inpatient Duration</label>
                        <input
                          type="text"
                          placeholder="e.g. 5 Days Inpatient"
                          value={newTreatDura}
                          onChange={(e) => setNewTreatDura(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-500 font-medium mb-1">Clinical Success Rate Ratio (%)</label>
                        <input
                          type="text"
                          placeholder="e.g. 98.4%"
                          value={newTreatSucc}
                          onChange={(e) => setNewTreatSucc(e.target.value)}
                          className="w-full p-2 border border-slate-200 bg-white rounded-xl focus:ring-1 focus:ring-cyan-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddTreatment(false)}
                        className="rounded-lg px-3 py-1.5 font-semibold text-slate-500"
                      >
                        Cancel
                      </button>
                      <button
                        id="submit-treatment-btn"
                        type="submit"
                        className="rounded-lg bg-cyan-500 text-slate-950 font-bold px-4 py-1.5 hover:bg-cyan-400"
                      >
                        Publish Package
                      </button>
                    </div>

                  </form>
                </div>
              )}

              {/* Treatments packages list rows */}
              <div className="rounded-2xl border border-slate-200/85 bg-white overflow-hidden shadow-3xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-50/70 text-slate-400 border-b border-light-100 uppercase tracking-wider font-semibold text-2xs font-display">
                      <tr>
                        <th className="py-3.5 px-5">Treatment Offer</th>
                        <th className="py-3.5 px-5">Category</th>
                        <th className="py-3.5 px-5">Fixed Value Index</th>
                        <th className="py-3.5 px-5">Inpatient Days</th>
                        <th className="py-3.5 px-5 text-right">Success Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-650">
                      {profile.treatments.map((tr) => (
                        <tr key={tr.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="py-3.5 px-5 font-semibold text-slate-900">{tr.name}</td>
                          <td className="py-3.5 px-5">{tr.category}</td>
                          <td className="py-3.5 px-5 font-semibold text-cyan-600">{tr.costEstimate}</td>
                          <td className="py-3.5 px-5 text-slate-500">{tr.duration}</td>
                          <td className="py-3.5 px-5 text-right font-bold text-slate-800">{tr.successRate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* D. ACCREDITATIONS & GOLD BADGES */}
          {activePane === "Accreditations" && (
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-3xs space-y-6 animate-fade-in font-sans text-xs">
              
              <div>
                <h3 className="font-display font-medium text-slate-950">Accreditations & Certificates</h3>
                <p className="text-2xs text-slate-400 font-sans mt-0.5">Approved compliance records authorized by GMAA board.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {profile.certifications.map((cert, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex gap-3 items-start group hover:border-cyan-200 transition-all">
                    <div className="h-7 w-7 rounded-lg bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center shrink-0 uppercase tracking-widest text-3xs font-semibold">
                      <Award className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800 text-xs">{cert}</p>
                      <p className="text-3xs text-slate-400 mt-1">Audit status: Clean Gold Certified Node</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Upload licensing segment */}
              <div className="border-t border-slate-100 pt-6 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase font-display tracking-wider">Upload New Regulatory Certificate</h4>
                <div 
                  className="rounded-xl border-2 border-dashed border-slate-200 p-6 text-center hover:border-cyan-300 transition-all bg-slate-50/50 cursor-pointer"
                  onClick={() => {
                    const msg = "HIPAA-secured document dispatcher initialized. Scanning certificate for JCI authenticity validation...";
                    if (showToast) {
                      showToast(msg, "info");
                    } else {
                      console.log(msg);
                    }
                  }}
                >
                  <Building2 className="h-7 w-7 text-slate-400 mx-auto" />
                  <p className="text-2xs font-semibold text-slate-700 mt-1">Select credential documents</p>
                  <p className="text-3xs text-slate-400">JCI, NABH, or ISO state licensing logs limits 20MB</p>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* RIGHT COLUMN: REVISION PREVIEW CARD */}
        <div className="lg:col-span-1 space-y-6 font-sans">
          
          <div className="rounded-2xl border border-slate-200 bg-slate-950 text-white p-5 shadow-sm space-y-4">
            <span className="text-4xs font-bold text-cyan-400 uppercase tracking-widest font-display">Live Listing Preview</span>
            
            <div className="space-y-3">
              <div>
                <h4 className="font-display font-medium text-lg text-white">{profile.name}</h4>
                <p className="text-3xs text-slate-400 font-sans">{profile.accreditationLevel}</p>
              </div>

              <p className="text-3xs text-slate-300 leading-relaxed font-sans line-clamp-4">
                {profile.description}
              </p>

              <div className="grid grid-cols-2 gap-2 text-2xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-slate-200">
                <div>
                  <p className="text-slate-500 font-display text-4xs uppercase tracking-wider">Facility Beds</p>
                  <strong className="mt-0.5 block">{profile.bedsCount} Licensed</strong>
                </div>
                <div>
                  <p className="text-slate-500 font-display text-4xs uppercase tracking-wider">Origin Location</p>
                  <strong className="mt-0.5 block truncate">{profile.hqLocation.split(",")[0]}</strong>
                </div>
              </div>

              {/* Media gallery items preview */}
              <div className="space-y-2">
                <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest font-display block">Facility Media Gallery ({profile.facilityImages.length} images)</span>
                <div className="grid grid-cols-3 gap-1.5 rounded-lg overflow-hidden">
                  {profile.facilityImages.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt="facility"
                      referrerPolicy="no-referrer"
                      className="h-12 w-full object-cover bg-slate-800"
                    />
                  ))}
                </div>
              </div>

            </div>

            <div className="pt-3 border-t border-slate-900">
              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 text-3xs text-slate-400 flex items-center gap-2.5">
                <ImageIcon className="h-4.5 w-4.5 text-cyan-400" />
                <div>
                  <p className="font-semibold text-slate-200">Accrue Gold Verification Badge</p>
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
