/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from "react";
import { UploadCloud, Image as ImageIcon, CheckCircle2 } from "lucide-react";

export default function LogoUploadCard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoName, setLogoName] = useState<string | null>(null);

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-[#2E5B9A]/15 transition-all">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-xl bg-[#EBF3FC] text-[#2E5B9A] flex items-center justify-center shrink-0 border border-blue-50">
          <ImageIcon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-900">Hospital Brand Logo</h3>
          <p className="text-2xs text-slate-400 mt-0.5">Upload a clean, high-resolution logo for your GMAA public listings.</p>
        </div>
      </div>

      <input 
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) setLogoName(file.name);
        }}
      />

      {logoName ? (
        <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 border border-emerald-100 px-3.5 py-2 rounded-xl text-3xs font-bold font-mono">
          <CheckCircle2 className="h-4 w-4" />
          {logoName}
        </div>
      ) : (
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="rounded-xl border border-slate-200 hover:border-[#2E5B9A] hover:bg-[#EBF3FC]/20 text-slate-600 hover:text-[#2E5B9A] text-xs font-bold py-2.5 px-5 transition-all duration-200 active:scale-95"
        >
          Select Image Logo
        </button>
      )}
    </div>
  );
}