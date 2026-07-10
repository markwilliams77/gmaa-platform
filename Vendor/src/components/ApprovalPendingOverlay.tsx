import React from "react";
import { LockKeyhole, ShieldCheck, Clock, Check, FileText, ArrowRight } from "lucide-react";

interface ApprovalPendingOverlayProps {
  onProfileClick: () => void;
  onMessagesClick: () => void;
}

export default function ApprovalPendingOverlay({
  onProfileClick,
  onMessagesClick,
}: ApprovalPendingOverlayProps) {
  return (
    <div className="absolute inset-0 z-20 flex items-start justify-center pt-24 px-4 bg-slate-950/25 backdrop-blur-xs select-none">
      
      {/* FUTURISTIC HUD GLASS CARD */}
      <div className="w-full max-w-xl rounded-3xl border border-slate-200/80 bg-white/90 backdrop-blur-2xl shadow-[0_24px_70px_rgba(15,23,42,0.15)] p-8 md:p-10 text-center relative overflow-hidden group">
        
        {/* Subtle aesthetic backdrop light glows */}
        <div className="absolute -top-16 -left-16 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-[#D91B24]/5 rounded-full blur-2xl pointer-events-none" />

        {/* 1. ANIMATED SECURITY RADAR ICON */}
        <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-50 border border-slate-100 shadow-inner">
          {/* Futuristic spinning dash ring */}
          <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-[#2E5B9A]/30 animate-spin [animation-duration:20s]" />
          <div className="absolute inset-1.5 rounded-xl border border-dotted border-[#D91B24]/20 animate-spin [animation-duration:10s] [animation-direction:reverse]" />
          
          <LockKeyhole className="h-7 w-7 text-[#2E5B9A] relative z-10 animate-pulse" />
        </div>

        {/* 2. HEADER */}
        <div className="mt-6 space-y-2">
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Security Review In Progress
          </h2>
          <p className="text-xs text-[#2E5B9A] font-mono uppercase tracking-widest font-semibold">
            GMAA Alliance Compliance Check
          </p>
          <p className="mt-3 text-slate-500 text-xs leading-relaxed max-w-md mx-auto">
            Your organization has been successfully registered. Our medical compliance officers are currently auditing your credentials and profile details.
          </p>
        </div>

        {/* 3. TERMINAL VERIFICATION TIMELINE */}
        <div className="mt-8 rounded-2xl bg-slate-50/60 border border-slate-150 p-5 text-left space-y-3.5 font-sans">
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block border-b border-slate-100 pb-2">
            Verification Pipeline Logs
          </span>

          {/* Item 1 */}
          <div className="flex items-center justify-between text-xs py-0.5">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <Check className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-slate-700 font-medium">Organization Registration</span>
            </div>
            <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-md font-mono font-semibold uppercase">
              Completed
            </span>
          </div>

          {/* Item 2 */}
          <div className="flex items-center justify-between text-xs py-0.5">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                <Check className="h-3 w-3 text-emerald-600" />
              </div>
              <span className="text-slate-700 font-medium">Gateway Credentials Generated</span>
            </div>
            <span className="text-[9px] bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-0.5 rounded-md font-mono font-semibold uppercase">
              Completed
            </span>
          </div>

          {/* Item 3 */}
          <div className="flex items-center justify-between text-xs py-0.5">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-amber-50 border border-amber-150 flex items-center justify-center animate-pulse">
                <Clock className="h-3 w-3 text-amber-600" />
              </div>
              <span className="text-slate-700 font-medium">Compliance Document Verification</span>
            </div>
            <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-md font-mono font-semibold uppercase">
              In Progress
            </span>
          </div>

          {/* Item 4 */}
          <div className="flex items-center justify-between text-xs py-0.5 opacity-65">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center">
                <LockKeyhole className="h-3 w-3 text-slate-400" />
              </div>
              <span className="text-slate-600 font-medium">Admin Activation Approval</span>
            </div>
            <span className="text-[9px] bg-slate-100 text-slate-500 border border-slate-200 px-2 py-0.5 rounded-md font-mono font-semibold uppercase">
              Queued
            </span>
          </div>
        </div>

        {/* 4. ACTIONS */}
        <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
          <button
            onClick={onProfileClick}
            className="rounded-xl bg-[#2E5B9A] hover:bg-[#3b6eae] text-white text-xs font-bold py-3.5 px-6 shadow-md shadow-blue-500/10 transition-all active:scale-[0.98] flex items-center justify-center gap-1.5"
          >
            <FileText className="h-4 w-4" />
            Complete Profile Details
          </button>

          <button
            onClick={onMessagesClick}
            className="rounded-xl border border-slate-200 hover:border-[#2E5B9A] hover:bg-[#EBF3FC]/20 text-slate-600 hover:text-[#2E5B9A] text-xs font-bold py-3.5 px-6 transition-all active:scale-[0.98]"
          >
            Open Help Center
          </button>
        </div>

      </div>
    </div>
  );
}