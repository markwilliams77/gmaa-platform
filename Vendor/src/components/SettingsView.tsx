/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Settings, 
  ChevronRight, 
  CreditCard, 
  ShieldAlert, 
  Megaphone, 
  FolderClosed, 
  Check, 
  Activity, 
  BarChart, 
  Download, 
  Lock, 
  ToggleLeft, 
  BellRing,
  Sparkles
} from "lucide-react";
import { ActiveTab } from "../types";

interface SettingsViewProps {
  activeTab: ActiveTab;
  showToast?: (message: string, type?: "success" | "info" | "warning") => void;
}

export default function SettingsView({ activeTab, showToast }: SettingsViewProps) {
  // Mock configuration toggles
  const [toggle1, setToggle1] = useState(true);
  const [toggle2, setToggle2] = useState(false);
  const [toggle3, setToggle3] = useState(true);

  // Notifications alerts
  const [notif1, setNotif1] = useState(true);
  const [notif2, setNotif2] = useState(true);

  return (
    <div className="space-y-6 animate-fade-in text-xs font-sans">
      
      {/* Settings Module */}
      {activeTab === ActiveTab.Settings && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Portal Settings</h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">Control hospital account configurations, HIPAA keys, and notification triggers.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            
            {/* Notification settings block */}
            <div className="col-span-2 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-3xs space-y-4">
              <h3 className="font-display font-semibold text-slate-900 text-sm flex items-center gap-1">
                <BellRing className="h-4.5 w-4.5 text-cyan-600" />
                Notification Alerts Settings
              </h3>

              <div className="divide-y divide-slate-100">
                <div className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">Email Alerts on New Tenders</p>
                    <p className="text-3xs text-slate-400 mt-0.5">Receive lightning notification as soon as matching specialty bids are published by GMAA.</p>
                  </div>
                  <button 
                    onClick={() => setNotif1(!notif1)}
                    className={`h-6 w-11 rounded-full p-0.5 transition-colors focus:outline-none ${notif1 ? "bg-cyan-500 flex justify-end" : "bg-slate-200 flex justify-start"}`}
                  >
                    <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
                  </button>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">SMS Critical Trauma Dispatches</p>
                    <p className="text-3xs text-slate-400 mt-0.5">Receive secure direct texts on registered operator phones regarding immediate clinical trials.</p>
                  </div>
                  <button 
                    onClick={() => setNotif2(!notif2)}
                    className={`h-6 w-11 rounded-full p-0.5 transition-colors focus:outline-none ${notif2 ? "bg-cyan-500 flex justify-end" : "bg-slate-200 flex justify-start"}`}
                  >
                    <span className="h-5 w-5 rounded-full bg-white shadow-sm" />
                  </button>
                </div>
              </div>
            </div>

            {/* HIPAA Key security panel */}
            <div className="col-span-1 bg-slate-950 text-white rounded-2xl p-5 shadow-sm space-y-4 border border-slate-900">
              <h3 className="font-display font-semibold text-white text-xs flex items-center gap-1.5">
                <Lock className="h-4 w-4 text-cyan-400" />
                Secure HIPAA Credentials
              </h3>
              <p className="text-3xs text-slate-400 leading-normal font-sans">
                GMAA partners hold private diagnostic decryption certificates. Keep tokens stored offline safely.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-4xs text-slate-500 uppercase tracking-widest font-display block">Decryption API Key</span>
                  <p className="font-mono text-3xs text-cyan-400 mt-1 truncate">gmaa_hk_90a04910f17b3310ffbc00a</p>
                </div>
                <button 
                  onClick={() => {
                    const msg = "Generating private secure decryption certificate... Dispatching dual-key approval challenge to the chief medical safety officer.";
                    if (showToast) {
                      showToast(msg, "info");
                    } else {
                      console.log(msg);
                    }
                  }}
                  className="w-full h-8.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-3xs uppercase tracking-wider font-semibold font-display transition-colors text-slate-200 cursor-pointer"
                >
                  Rotate Secret Key
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Marketing Center */}
      {activeTab === ActiveTab.MarketingCenter && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-950">Marketing Center</h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">Amplify hospital directory exposure & monitor campaign performance metrics.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Col 1 */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-3xs space-y-4">
              <Megaphone className="h-6 w-6 text-cyan-500" />
              <h3 className="font-display font-semibold text-slate-900 text-sm">Featured Provider Placement</h3>
              <p className="text-2xs text-slate-400 leading-normal font-sans">
                Feature your orthopedic or oncology wings inside the top tier recommendations for West Africa insurance cohorts.
              </p>
              <button className="w-full h-8 bg-slate-900 text-white text-2xs font-semibold rounded-lg hover:bg-slate-800">
                Unlock Campaign Access
              </button>
            </div>

            {/* Col 2 */}
            <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-3xs space-y-4">
              <Sparkles className="h-6 w-6 text-indigo-500" />
              <h3 className="font-display font-semibold text-slate-900 text-sm">GMAA Sponsored Referral Keywords</h3>
              <p className="text-2xs text-slate-400 leading-normal font-sans">
                Bid on premium patient search tags such as "Bilateral Robotic Knee", "FDA Immuno-Suite" to direct referrals down to your coordinator desk.
              </p>
              <button className="w-full h-8 bg-slate-900 text-white text-2xs font-semibold rounded-lg hover:bg-slate-800">
                Activate Keyword Bid
              </button>
            </div>

            {/* Col 3 */}
            <div className="p-5 bg-slate-950 text-white rounded-2xl shadow-sm space-y-4 border border-slate-900 flex flex-col justify-between">
              <div>
                <BarChart className="h-6 w-6 text-cyan-400" />
                <h3 className="font-display font-semibold text-white text-sm mt-3">Active Campaign Analytics</h3>
                <p className="text-3xs text-slate-400 leading-normal font-sans mt-1">
                  Average sponsor click rate is currently at stable indexes of 5.1x over marketplace organic rankings.
                </p>
              </div>
              <span className="text-3xs uppercase tracking-wider font-bold text-cyan-400 bg-cyan-900/30 border border-cyan-800/40 p-2 rounded text-center block mt-4">
                Marketplace Exposure Active
              </span>
            </div>

          </div>
        </div>
      )}

      {/* Billing & Subscription */}
      {activeTab === ActiveTab.Billing && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Billing & Subscriptions</h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">Manage alliance partner level subscription, past invoices, and escrow transactions.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left columns */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-3xs space-y-4">
              <h3 className="font-display font-semibold text-slate-900 text-sm flex items-center gap-1.5">
                <CreditCard className="h-4.5 w-4.5 text-cyan-600" />
                Active Corporate Subscription
              </h3>

              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-sans text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">GMAA Preferred Diamond Network Hub</h4>
                  <p className="text-2xs text-slate-400 mt-1">Access unlimited surgical tenders, Direct referral channels, video HIPAA coordination desks, and gold badges.</p>
                </div>
                <div className="text-left sm:text-right shrink-0">
                  <p className="text-base font-bold text-slate-900 font-display">$850.00 / Mo</p>
                  <span className="text-4xs text-emerald-500 font-bold bg-emerald-50 border border-emerald-100 px-1.5 py-0.5 rounded">AUTO-RENEW ACTIVE</span>
                </div>
              </div>

              {/* Invoice list table */}
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider font-display">Invoice History Logs</h4>
                <div className="divide-y divide-slate-150 border-t border-slate-100 font-sans text-2xs text-slate-500">
                  <div className="py-2.5 flex justify-between items-center">
                    <span>Invoice #INV-2026-904 (June 01, 2026)</span>
                    <strong className="text-slate-800">$850.00 USD - PAID</strong>
                  </div>
                  <div className="py-2.5 flex justify-between items-center">
                    <span>Invoice #INV-2026-224 (May 01, 2026)</span>
                    <strong className="text-slate-800">$850.00 USD - PAID</strong>
                  </div>
                </div>
              </div>

            </div>

            {/* Escrow balance */}
            <div className="lg:col-span-1 bg-slate-950 text-white rounded-2xl p-5 shadow-sm border border-slate-900 flex flex-col justify-between">
              <div>
                <span className="text-4xs font-bold text-slate-400 uppercase tracking-widest font-display">Financial Escrow balance</span>
                <h3 className="font-display font-bold text-xl text-white mt-1">$45,000.00 USD</h3>
                <p className="text-3xs text-slate-400 font-sans leading-normal mt-2.5">
                  Secured funds held in trust for ongoing medical evacuations. Relocates immediately upon patient checkout.
                </p>
              </div>
              <button 
                onClick={() => {
                  const msg = "Initializing multi-signature escrow validation process... Authorizing secure banking proxy transfer tunnel...";
                  if (showToast) {
                    showToast(msg, "success");
                  } else {
                    console.log(msg);
                  }
                }}
                className="w-full h-8.5 rounded-lg bg-cyan-500 text-slate-950 font-bold block text-center text-3xs uppercase tracking-wider font-display mt-6 hover:bg-cyan-400 transition-colors cursor-pointer"
              >
                Access Escrow Vault
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Documents Repository */}
      {activeTab === ActiveTab.Documents && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display text-2xl font-bold text-slate-900">Documents Hub</h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">Access regulatory, certifications, and compliance logs associated with your gold listing.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-3xs flex items-center justify-between group hover:border-cyan-200 transition-all">
              <div className="flex items-center gap-3">
                <FolderClosed className="h-7 w-7 text-cyan-600" />
                <div>
                  <p className="font-semibold text-slate-800">State Clinical Licensing Laws.pdf</p>
                  <p className="text-3xs text-slate-400 mt-1">Uploaded May 12, 2026 • 4.2 MB size</p>
                </div>
              </div>
              <button className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg">
                <Download className="h-4 w-4" />
              </button>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-3xs flex items-center justify-between group hover:border-cyan-200 transition-all">
              <div className="flex items-center gap-3">
                <FolderClosed className="h-7 w-7 text-indigo-600" />
                <div>
                  <p className="font-semibold text-slate-800">JCI Gold Star Certificate 2026.pdf</p>
                  <p className="text-3xs text-slate-400 mt-1">Uploaded April 18, 2026 • 1.8 MB size</p>
                </div>
              </div>
              <button className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-50 rounded-lg">
                <Download className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
