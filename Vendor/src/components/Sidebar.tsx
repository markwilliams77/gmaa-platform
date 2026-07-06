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
  ChevronRight,
  Menu,
  X,
  LockKeyhole 
} from "lucide-react";
import { ActiveTab } from "../types";

interface SidebarProps {
  isApprovedVendor: boolean; showToast: ( message: string, type?: "success" | "info" | "warning" ) => void;
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
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar container */}
      <aside
        id="sidebar-container"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#0f172a] text-slate-300 transition-transform duration-300 ease-out border-r border-slate-800 lg:static lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header brand logo */}
        <div className="flex h-20 items-center justify-between px-6 border-b border-slate-800 bg-[#0f172a]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-lg font-bold tracking-wider text-white flex items-center gap-1.5">
                {logoText} <span className="text-xs bg-cyan-900/40 text-cyan-400 font-medium px-1.5 py-0.5 rounded uppercase tracking-normal">Vendor</span>
              </div>
              <p className="text-xs text-slate-400 font-sans tracking-tight">Global Medical Marketplace</p>
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

        {/* Navigation block */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-7 custom-scrollbar">
          {/* Main Workspace sections */}
          <div>
            <div className="px-3 mb-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider font-display">
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
                      showToast( "This feature will unlock after your organization has been approved.", "info"
                      );
                      return;
                    }
                    handleNavClick(item.tab);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all group duration-200 ${
                    isActive ? "bg-slate-800 text-cyan-400" : "text-slate-300 hover:text-white hover:bg-slate-800/50"
                    }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                        className={`h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-105 ${
                          isActive ? "text-cyan-400" : "text-slate-400 group-hover:text-white"
                        }`}
                        />
                        <span className="font-sans font-normal">
                          {item.label}
                          </span>
                          {isLocked && (
                            <LockKeyhole className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                            )}
                            </div>
                            {!isLocked && item.badge && (
                              <span
                              className={`rounded-full px-2 py-0.5 text-2xs font-medium font-sans ${
                                isActive ? "bg-cyan-400/20 text-cyan-300" : "bg-slate-800 text-slate-400"
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

          {/* Placeholders marked for growth */}
          <div>
            <div className="px-3 mb-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider font-display flex items-center justify-between">
              <span>Future Modules</span>
              <span className="text-3xs text-yellow-500 border border-yellow-500/30 px-1 rounded bg-yellow-900/10 font-sans tracking-normal uppercase">Coming Soon</span>
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
                    className={`flex w-full items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all group duration-200 opacity-60 hover:opacity-95 ${
                      isActive
                        ? "bg-yellow-500/10 text-yellow-400 border-l-2 border-yellow-400 pl-3"
                        : "text-slate-300 hover:text-white rounded-xl hover:bg-slate-800/50 transition-all"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4.5 w-4.5 text-slate-400 group-hover:text-amber-400" />
                      <span className="font-sans font-light text-slate-300 group-hover:text-white">{item.label}</span>
                    </div>
                    {item.premium && (
                      <span className="text-3xs font-semibold font-sans bg-amber-900/40 text-amber-300 border border-amber-500/20 rounded px-1.5 py-0.2">
                        Premium
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Footer info & Logout */}
        <div className="mt-auto p-4 border-t border-slate-800 bg-[#0f172a]">
          <div className="mb-4 rounded-xl bg-slate-800/40 p-3 border border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs font-semibold text-slate-200 truncate">{vendorName}</p>
            </div>
            <p className="mt-1 text-3xs text-slate-400 font-sans font-normal truncate">Tier-1 Medical Partner</p>
          </div>
          <button
            id="sidebar-logout-btn"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all group"
          >
            <LogOut className="h-4.5 w-4.5 text-slate-300 transition-transform group-hover:-translate-x-0.5 group-hover:text-white" />
            <span className="font-sans">Disconnect Portal</span>
          </button>
        </div>
      </aside>
    </>
  );
}
