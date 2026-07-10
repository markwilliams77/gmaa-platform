/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  Users, 
  MessageSquare, 
  Award, 
  BarChart3, 
  Landmark, 
  Settings, 
  LogOut,
  Megaphone,
  CreditCard,
  FolderClosed,
  Activity,
  X,
  LockKeyhole 
} from "lucide-react";
import { ActiveTab } from "../types";

interface SidebarProps {
  isApprovedVendor: boolean; 
  showToast: ( message: string, type?: "success" | "info" | "warning" ) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  vendorName: string;
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  logoText?: string;
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  vendorName,
  isSidebarOpen,
  setIsSidebarOpen,
  logoText = "GMAA", 
  onLogout,
  isApprovedVendor,
  showToast,
}: SidebarProps) {

  const mainNavItems = [
    {
      tab: ActiveTab.Dashboard,
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      tab: ActiveTab.Marketplace,
      label: "Marketplace",
      icon: FileSpreadsheet,
      badge: "13",
      requiresApproval: true,
    },
    {
      tab: ActiveTab.MyTenders,
      label: "My Tenders",
      icon: FileSpreadsheet,
      badge: "8",
      requiresApproval: true,
    },
    {
      tab: ActiveTab.Consultations,
      label: "Consultations",
      icon: Users,
      badge: "12",
      requiresApproval: true,
    },
    {
      tab: ActiveTab.Messages,
      label: "Messages",
      icon: MessageSquare,
    },
    {
      tab: ActiveTab.Awards,
      label: "Awards",
      icon: Award,
      badge: "2",
      requiresApproval: true,
    },
    {
      tab: ActiveTab.Analytics,
      label: "Analytics",
      icon: BarChart3,
      requiresApproval: true,
    },
    {
      tab: ActiveTab.ProfileManagement,
      label: "Profile Management",
      icon: Landmark,
    },
    {
      tab: ActiveTab.Settings,
      label: "Settings",
      icon: Settings,
    },
  ];

  const placeholderNavItems = [
    { tab: ActiveTab.MarketingCenter, label: "Marketing Center", icon: Megaphone, premium: true },
    { tab: ActiveTab.Billing, label: "Billing & Subscription", icon: CreditCard },
    { tab: ActiveTab.Documents, label: "Documents", icon: FolderClosed },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsSidebarOpen(false); // Close drawer on mobile
  };

  return (
    <>
      {/* Mobile Sidebar overlay */}
      {isSidebarOpen && (
        <div 
          id="sidebar-overlay"
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar container (Custom deep dark GMAA Blue) */}
      <aside
        id="sidebar-container"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#080d1a] text-slate-350 transition-transform duration-300 ease-out border-r border-blue-950/50 lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header brand logo */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-blue-950/40 bg-[#080d1a]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#2E5B9A]/10 border border-[#2E5B9A]/20 text-blue-400">
              <Activity className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="font-display text-lg font-bold tracking-wider text-white flex items-center gap-1.5">
                {logoText} <span className="text-[10px] bg-[#2E5B9A]/20 text-blue-300 font-bold px-2 py-0.5 rounded uppercase font-mono tracking-wider">Vendor</span>
              </div>
              <p className="text-[10px] text-slate-500 font-sans tracking-tight">Global Medical Alliance</p>
            </div>
          </div>
          <button 
            id="close-sidebar-btn"
            onClick={() => setIsSidebarOpen(false)} 
            className="rounded-lg p-1.5 hover:bg-slate-800 text-slate-400 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation blocks */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-7 custom-scrollbar select-none">
          {/* Main Workspace sections */}
          <div>
            <div className="px-3 mb-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono">
              Workspace CORE
            </div>
            <nav className="space-y-1">
              {mainNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;  
                const isLocked = item.requiresApproval && !isApprovedVendor;
                return (
                  <button
                    key={item.tab}
                    id={`nav-item-${item.tab.toLowerCase().replace(/\s+/g, "-")}`}
                    onClick={() => {
                      if (item.requiresApproval && !isApprovedVendor) {
                        showToast(
                          "This feature will unlock after your organization has been approved.", 
                          "info"
                        );
                        return;
                      }
                      handleNavClick(item.tab);
                    }}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all group duration-200 ${
                      isActive 
                        ? "bg-[#2E5B9A]/15 text-blue-300 border-l-2 border-[#2E5B9A] pl-3" 
                        : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-105 ${
                          isActive ? "text-blue-300" : "text-slate-500 group-hover:text-white"
                        }`}
                      />
                      <span className="font-sans">
                        {item.label}
                      </span>
                      {isLocked && (
                        <LockKeyhole className="h-3.5 w-3.5 text-[#D91B24] shrink-0 animate-pulse" />
                      )}
                    </div>
                    
                    {!isLocked && item.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[9px] font-bold font-mono ${
                          isActive ? "bg-[#2E5B9A]/20 text-blue-300" : "bg-slate-900 text-slate-500"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Future Growth Sections */}
          <div>
            <div className="px-3 mb-2.5 text-[10px] font-bold text-slate-500 uppercase tracking-widest font-mono flex items-center justify-between">
              <span>Future Modules</span>
              <span className="text-[8px] text-[#2E5B9A] border border-blue-500/20 px-1.5 py-0.2 rounded bg-[#2E5B9A]/10 font-sans tracking-normal uppercase">Coming Soon</span>
            </div>
            <nav className="space-y-1">
              {placeholderNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.tab;
                return (
                  <button
                    key={item.tab}
                    id={`nav-item-future-${item.tab.toLowerCase().replace(/\s+/g, '-')}`}
                    onClick={() => handleNavClick(item.tab)}
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all group duration-200 opacity-55 hover:opacity-95 ${
                      isActive
                        ? "bg-[#2E5B9A]/10 text-blue-300 border-l-2 border-[#2E5B9A] pl-3"
                        : "text-slate-400 hover:text-white hover:bg-slate-900/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4.5 w-4.5 text-slate-500 group-hover:text-blue-400" />
                      <span className="font-sans text-slate-400 group-hover:text-white font-medium">{item.label}</span>
                    </div>
                    {item.premium && (
                      <span className="text-[8px] font-bold font-sans bg-[#2E5B9A]/10 text-blue-300 border border-blue-500/10 rounded px-1.5 py-0.2">
                        PREMIUM
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer info & Logout */}
        <div className="mt-auto p-4 border-t border-blue-950/40 bg-[#080d1a]">
          <div className="mb-4 rounded-xl bg-slate-900/30 p-3 border border-blue-950/30">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-bold text-slate-200 truncate">{vendorName}</p>
            </div>
            <p className="mt-1 text-[9px] text-slate-500 font-sans font-semibold tracking-wider uppercase">Tier-1 Medical Partner</p>
          </div>
          <button
            id="sidebar-logout-btn"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-bold text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group"
          >
            <LogOut className="h-4.5 w-4.5 text-slate-500 transition-transform group-hover:-translate-x-0.5 group-hover:text-red-400" />
            <span className="font-sans">Disconnect Portal</span>
          </button>
        </div>
      </aside>
    </>
  );
}