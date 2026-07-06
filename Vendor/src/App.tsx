/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import {
  Menu,
  X,
  Activity,
  ShieldCheck,
  Clock,
  ExternalLink,
  ChevronRight,
  MapPin,
  Building2,
  Calendar,
  Lock,
  Globe2,
  Phone,
  Mail,
  Award,
} from "lucide-react";

import {
  ActiveTab,
  Tender,
  Consultation,
  Message,
  TenderStatus,
} from "./types";

import {
  INITIAL_VENDOR_NAME,
  INITIAL_TENDERS,
  INITIAL_CONSULTATIONS,
  INITIAL_MESSAGES,
  INITIAL_AWARDS,
  INITIAL_PROFILE,
} from "./mockData";

import LoginScreen from "./components/LoginScreen";
import { vendorService } from "./services/vendorService";

// Components
import Sidebar from "./components/Sidebar";
import DashboardHome from "./components/DashboardHome";
import MyTendersView from "./components/MyTendersView";
import TendersView from "./components/TendersView";
import ConsultationsView from "./components/ConsultationsView";
import MessagesView from "./components/MessagesView";
import AwardsView from "./components/AwardsView";
import AnalyticsView from "./components/AnalyticsView";
import ProfileManagementView from "./components/ProfileManagementView";
import SettingsView from "./components/SettingsView";
import OrganizationProfileView from "./components/OrganizationVerification/OrganizationProfileView";
export default function App() {
  // Session authentication mock status (Logout toggles lock screen)
  const storedVendor = localStorage.getItem("vendorData");

  const [vendorData, setVendorData] = useState(
    storedVendor ? JSON.parse(storedVendor) : null,
  );

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("vendorToken"),
  );

  const vendorName =
    vendorData?.vendorOnboarding?.orgName || INITIAL_VENDOR_NAME;

  // Core application state synced across pages
  const [isApprovedVendor, setIsApprovedVendor] = useState(false);
  const [tenders, setTenders] = useState<Tender[]>(INITIAL_TENDERS);
  const [myTenders, setMyTenders] = useState<any[]>([]);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [awards, setAwards] = useState(INITIAL_AWARDS);
  const [profile, setProfile] = useState(INITIAL_PROFILE);

  useEffect(() => {
    const checkVendor = async () => {
      try {
        const response = await vendorService.getMe();

        setIsApprovedVendor(response.user.vendorStatus === "ACTIVE")
      } catch (error) {
        console.log("Vendor not found");
        setIsApprovedVendor(false);
      }
    };

    if (isAuthenticated) {
      checkVendor();
    }
  }, [isAuthenticated, isApprovedVendor]);

  useEffect(() => {
    const loadTenders = async () => {
      try {
        const response = await vendorService.getTenders();

        setTenders(response.data);
        console.log("BACKEND TENDERS", response.data);
      } catch (error) {
        console.error("Failed to load tenders", error);
      }
    };

    if (isAuthenticated && isApprovedVendor) {
      loadTenders();
    }
  }, [isAuthenticated, isApprovedVendor]);

  useEffect(() => {
    const loadMyTenders = async () => {
      try {
        const response = await vendorService.getMyTenders();

        console.log("MY TENDERS", response);

        setMyTenders(response.data);
      } catch (error) {
        console.error("Failed to load my tenders", error);
      }
    };

    if (isAuthenticated && isApprovedVendor) {
      loadMyTenders();
    }
  }, [isAuthenticated, isApprovedVendor]);

  useEffect(() => {
    const loadConsultations = async () => {
      try {
        const response = await vendorService.getConsultations();

        setConsultations(response.data);
      } catch (error) {
        console.error("Failed to load consultations", error);
      }
    };

    if (isAuthenticated && isApprovedVendor) {
      loadConsultations();
    }
  }, [isAuthenticated, isApprovedVendor]);

  // Active view state
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.Dashboard);

  // Layout UI states
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isPublicProfileModalOpen, setIsPublicProfileModalOpen] =
    useState<boolean>(false);

  // Toast notification state & helper
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "info" | "warning";
  } | null>(null);

  const showToast = (
    message: string,
    type: "success" | "info" | "warning" = "success",
  ) => {
    setToast({ message, type });
    // Auto-dismiss
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Dashboard home quick filter interaction mapping
  const [quickSearchTreatment, setQuickSearchTreatment] = useState<string>("");

  // Sync state log additions (propagated down to submissions)
  const addSystemMessage = (newMsg: Message) => {
    setMessages((prev) => [newMsg, ...prev]);
  };

  const handleQuickSearchTreatment = (term: string) => {
    setQuickSearchTreatment(term);
    setActiveTab(ActiveTab.Consultations);
  };

  // Simulate account portal termination
  const handleLogout = () => {
    localStorage.removeItem("vendorToken");
    localStorage.removeItem("vendorData");

    setVendorData(null);
    setIsAuthenticated(false);
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
    setActiveTab(ActiveTab.Dashboard);
  };

  // Current system UTC display
  const currentDateTimeStr = "June 15, 2026 - 12:00 AM UTC";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-cyan-500/20 selection:text-cyan-900 leading-normal">
      {!isAuthenticated ? (
        <LoginScreen
          onLogin={(vendor) => {
            setVendorData(vendor);
            setIsAuthenticated(true);
            setActiveTab(ActiveTab.Dashboard);
          }}
        />
      ) : (
        /* ================= MAIN EXPANDABLE SYSTEM STRUCTURE ================= */
        <div className="flex min-h-screen">
          {/* Side navigation rail */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            vendorName={vendorName}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            onLogout={handleLogout}
            isApprovedVendor={isApprovedVendor}
            showToast={showToast}
          />

          {/* Main Content Pane */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Upper Header Control panel bar */}
            <header className="h-20 border-b border-slate-200 bg-white flex items-center justify-between px-6 md:px-8">
              <div className="flex items-center gap-3">
                {/* Mobile Hamburger trigger */}
                <button
                  id="mobile-hamburger-btn"
                  onClick={() => setIsSidebarOpen(true)}
                  className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 lg:hidden"
                >
                  <Menu className="h-5 w-5" />
                </button>

                <div className="hidden sm:flex items-center gap-2 text-2xs font-mono bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-cyan-500 shrink-0" />
                  <span>{currentDateTimeStr}</span>
                </div>
              </div>

              {/* Verified Badge profile status */}
              <div className="flex items-center gap-3">
                <button
                  id="profile-badge-btn"
                  onClick={() => setIsPublicProfileModalOpen(true)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-200/50 transition-all text-xs"
                >
                  <div className="text-right hidden md:block">
                    <p className="font-bold text-slate-900 leading-none">
                      {vendorName}
                    </p>
                    <p className="text-4xs text-slate-400 font-mono mt-1 uppercase tracking-wide">
                      Gold SLA Vendor
                    </p>
                  </div>
                  <div className="h-9 w-9 bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-center font-sans font-semibold text-slate-600">
                    AK
                  </div>
                </button>
              </div>
            </header>

            {/* Dynamic viewport container slots */}
            <main className="flex-1 overflow-x-hidden p-6 md:p-8 max-w-[1400px] w-full mx-auto pb-20">
              {activeTab === ActiveTab.Dashboard && (
                <DashboardHome
                  vendorName={vendorName}
                  setActiveTab={setActiveTab}
                  openPublicProfileModal={() =>
                    setIsPublicProfileModalOpen(true)
                  }
                  onQuickSearchTreatment={handleQuickSearchTreatment}
                  isApprovedVendor={isApprovedVendor}
                  showToast={showToast}
                />
              )}

              {activeTab === ActiveTab.Marketplace && (
                <TendersView
                  tenders={tenders}
                  setTenders={setTenders}
                  addSystemMessage={addSystemMessage}
                  showToast={showToast}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === ActiveTab.MyTenders && (
                <MyTendersView tenders={myTenders} />
              )}

              {activeTab === ActiveTab.Consultations && (
                <ConsultationsView
                  consultations={consultations}
                  setConsultations={setConsultations}
                  addSystemMessage={addSystemMessage}
                  quickSearchTreatment={quickSearchTreatment}
                  setQuickSearchTreatment={setQuickSearchTreatment}
                  showToast={showToast}
                />
              )}

              {activeTab === ActiveTab.Messages && (
                <MessagesView messages={messages} setMessages={setMessages} />
              )}

              {activeTab === ActiveTab.Awards && <AwardsView awards={awards} />}

              {activeTab === ActiveTab.Analytics && <AnalyticsView />}

              {activeTab === ActiveTab.ProfileManagement && (
                <OrganizationProfileView />
              )}

              {/* Shared settings / placeholders handler */}
              {(activeTab === ActiveTab.Settings ||
                activeTab === ActiveTab.MarketingCenter ||
                activeTab === ActiveTab.Billing ||
                activeTab === ActiveTab.Documents) && (
                <SettingsView activeTab={activeTab} showToast={showToast} />
              )}
            </main>
          </div>

          {/* ================= PUBLIC PROFILE PREVIEW MODAL ================= */}
          {isPublicProfileModalOpen && (
            <div
              id="public-profile-modal-overlay"
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in"
              onClick={() => setIsPublicProfileModalOpen(false)}
            >
              <div
                id="public-profile-modal-container"
                className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200 animate-slide-up text-xs font-sans"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header banner area */}
                <div className="relative h-32 bg-slate-900 p-6 flex flex-col justify-end text-white">
                  <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-cyan-500/10 via-transparent to-transparent" />
                  <button
                    id="close-profile-modal-btn"
                    onClick={() => setIsPublicProfileModalOpen(false)}
                    className="absolute top-4 right-4 h-8 w-8 bg-slate-950/40 hover:bg-slate-950/80 rounded-full flex items-center justify-center text-slate-300 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>

                  <div className="space-y-1 z-10">
                    <div className="inline-flex items-center gap-1.5 rounded-full bg-cyan-400/20 px-2.5 py-0.5 text-4xs font-bold text-cyan-300 border border-cyan-400/20 uppercase tracking-widest">
                      <ShieldCheck className="h-3 w-3" /> JCI Gold Seal
                      Certified
                    </div>
                    <h3 className="font-display font-bold text-lg">
                      {profile.name}
                    </h3>
                  </div>
                </div>

                {/* Sub info tabs */}
                <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                  {/* Info Row stats */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <span className="text-4xs text-slate-400 uppercase tracking-wider block font-display">
                        Specializations
                      </span>
                      <strong className="text-slate-800 font-semibold mt-0.5 block">
                        Cardio / Ortho / Onco
                      </strong>
                    </div>
                    <div>
                      <span className="text-4xs text-slate-400 uppercase tracking-wider block font-display">
                        Licensed Beds
                      </span>
                      <strong className="text-slate-800 font-semibold mt-0.5 block">
                        {profile.bedsCount} Total
                      </strong>
                    </div>
                    <div>
                      <span className="text-4xs text-slate-400 uppercase tracking-wider block font-display">
                        Surgical Excellence
                      </span>
                      <strong className="text-emerald-600 font-bold mt-0.5 block">
                        99.4% Success Rate
                      </strong>
                    </div>
                    <div>
                      <span className="text-4xs text-slate-400 uppercase tracking-wider block font-display">
                        Location HQ
                      </span>
                      <strong className="text-slate-800 font-semibold mt-0.5 block truncate">
                        {profile.hqLocation.split(",")[0]}
                      </strong>
                    </div>
                  </div>

                  {/* Summary Narrative */}
                  <div className="space-y-1.5 font-sans font-light text-slate-500 leading-relaxed">
                    <h4 className="text-2xs font-bold text-slate-800 uppercase font-display tracking-wider">
                      Hospital Overview
                    </h4>
                    <p>{profile.description}</p>
                  </div>

                  {/* Pricing grid */}
                  <div className="space-y-3">
                    <h4 className="text-2xs font-bold text-slate-800 uppercase font-display tracking-wider">
                      Approved Treatment Packages
                    </h4>
                    <div className="divide-y divide-slate-100 rounded-2xl border border-slate-100 overflow-hidden font-sans">
                      {profile.treatments.map((tr) => (
                        <div
                          key={tr.id}
                          className="p-3 bg-slate-50/50 flex justify-between items-center text-2xs"
                        >
                          <div>
                            <p className="font-semibold text-slate-800">
                              {tr.name}
                            </p>
                            <p className="text-3xs text-slate-400 mt-0.5">
                              {tr.duration}
                            </p>
                          </div>
                          <span className="font-bold text-cyan-600">
                            {tr.costEstimate}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Doctors */}
                  <div className="space-y-3">
                    <h4 className="text-2xs font-bold text-slate-800 uppercase font-display tracking-wider">
                      Affiliated Operations Surgeons
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {profile.doctors.map((doc) => (
                        <div
                          key={doc.id}
                          className="p-3 rounded-2xl border border-slate-100 flex gap-3 items-center"
                        >
                          <img
                            src={doc.image}
                            alt={doc.name}
                            referrerPolicy="no-referrer"
                            className="h-9 w-9 rounded-full object-cover bg-slate-100 shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800 truncate">
                              {doc.name}
                            </p>
                            <p className="text-3xs text-slate-400 truncate">
                              {doc.title}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer dispatch actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-3xs text-slate-400 font-sans">
                    Public Listing ID: gmaa_pub_apex_9031
                  </span>
                  <button
                    id="modal-request-evac-btn"
                    onClick={() => {
                      showToast(
                        "Redirecting to secured external GMAA evacuation portal...",
                        "info",
                      );
                      setIsPublicProfileModalOpen(false);
                    }}
                    className="rounded-xl bg-slate-900 px-4 py-2 font-bold text-white hover:bg-slate-800 transition-all active:scale-95"
                  >
                    Direct Referrals Core
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ================= GLOBAL PREMIUM TOAST NOTIFICATION ================= */}
          {toast && (
            <div
              id="global-system-toast"
              className="fixed bottom-6 right-6 z-55 max-w-sm w-full bg-[#1e293b] border border-slate-700/80 p-4.5 rounded-2xl shadow-2xl flex items-start gap-3.5 animate-slide-up text-white"
            >
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                  toast.type === "success"
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : toast.type === "warning"
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                }`}
              >
                <Activity className="h-4.5 w-4.5 animate-pulse" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-4xs uppercase font-bold text-slate-400 tracking-wider block font-mono">
                  Operations Feed
                </span>
                <p className="text-2xs text-slate-150 mt-1 font-medium leading-relaxed font-sans">
                  {toast.message}
                </p>
              </div>
              <button
                onClick={() => setToast(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
