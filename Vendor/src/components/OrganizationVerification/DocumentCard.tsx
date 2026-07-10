/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from "react";
import { 
  FileText, 
  Upload, 
  Eye, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

interface DocumentCardProps {
  title: string;
  description: string;
  required?: boolean;
  uploaded?: boolean;
  uploading?: boolean;
  uploadProgress?: number;
  fileName?: string;
  fileSize?: string;
  uploadedAt?: string;
  error?: string;
  disabled?: boolean;

  onUpload?: (file: File) => void;
  onReplace?: () => void;
  onDelete?: () => void;
  onPreview?: () => void;
}

export default function DocumentCard({
  title,
  description,
  required = true,
  uploaded = false,
  uploading = false,
  uploadProgress = 0,
  fileName,
  fileSize,
  uploadedAt,
  error,
  disabled,

  onUpload,
  onReplace,
  onDelete,
  onPreview,
}: DocumentCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="group rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md text-slate-800">
      
      {/* Card Header Info */}
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EBF3FC] text-[#2E5B9A] border border-blue-50 shrink-0">
          <FileText className="h-5 w-5" />
        </div>

        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-sm font-bold text-slate-900 leading-normal">{title}</h3>

            {required && (
              <span className="rounded-full bg-[#D91B24]/10 border border-[#D91B24]/15 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#D91B24] font-mono">
                Required
              </span>
            )}

            {uploaded && (
              <span className="rounded-full bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-600 font-mono">
                Uploaded
              </span>
            )}
          </div>
          <p className="text-xs leading-relaxed text-slate-400 font-light font-sans">{description}</p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload?.(file);
        }}
      />

      {/* Uploading Progress tracking HUD */}
      {uploading && (
        <div className="mt-6 p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <div className="flex items-center justify-between text-2xs font-mono font-bold">
            <span className="text-slate-400 uppercase tracking-wider">Uploading Payload...</span>
            <span className="text-[#2E5B9A]">{uploadProgress}%</span>
          </div>

          <div className="mt-2.5 h-2 rounded-full bg-slate-100 border overflow-hidden">
            <div
              className="h-full rounded-full bg-[#2E5B9A] transition-all"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Active Uploaded State */}
      {!uploading && uploaded && (
        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/30 p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500 shrink-0" />

            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 text-xs truncate">
                {fileName || "document.pdf"}
              </p>
              <p className="mt-0.5 text-3xs text-slate-400 font-mono">
                {fileSize || "1.2 MB"}
                {" • "}
                {uploadedAt || "Just now"}
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={onPreview}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-3xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition"
            >
              <Eye className="h-3.5 w-3.5" />
              Preview
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              title={disabled ? "Locked under active review." : "Replace"}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-3xs font-bold transition ${
                disabled
                  ? "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400"
                  : "border-blue-150 text-[#2E5B9A] hover:bg-[#EBF3FC]/40 bg-white"
              }`}
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Replace
            </button>

            <button
              onClick={onDelete}
              disabled={disabled}
              title={disabled ? "Locked under active review." : "Delete"}
              className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-3xs font-bold transition ${
                disabled
                  ? "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400"
                  : "border-red-100 text-[#D91B24] hover:bg-red-50/50 bg-white"
              }`}
            >
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Empty Upload Drag Drop Zone */}
      {!uploading && !uploaded && (
        <div 
          onClick={() => { if (!disabled) fileInputRef.current?.click(); }}
          className={`mt-6 rounded-2xl border-2 border-dashed p-6 text-center transition-all cursor-pointer ${
            disabled 
              ? "border-slate-100 bg-slate-50/40 cursor-not-allowed" 
              : "border-slate-200 hover:border-[#2E5B9A]/30 hover:bg-[#EBF3FC]/10"
          }`}
        >
          <Upload className="mx-auto h-8 w-8 text-slate-400" />
          <h4 className="mt-3 text-xs font-bold text-slate-900">Drag & Drop Documents</h4>
          <p className="mt-1 text-3xs text-slate-400">or browse files from your computer</p>
          
          <button
            disabled={disabled}
            className={`mt-4 rounded-xl px-5 py-2 text-3xs font-bold transition ${
              disabled
                ? "bg-slate-100 text-slate-400"
                : "bg-[#2E5B9A] text-white hover:bg-[#3b6eae]"
            }`}
          >
            Browse Files
          </button>

          <p className="mt-4 text-[9px] uppercase tracking-wider font-mono text-slate-450">
            PDF • PNG • JPG • Max 10 MB
          </p>
        </div>
      )}

      {/* Error Callout */}
      {error && (
        <div className="mt-4 flex items-start gap-3 rounded-xl border border-red-200 bg-[#D91B24]/10 p-3">
          <AlertCircle className="mt-0.5 h-4.5 w-4.5 text-[#D91B24] shrink-0" />
          <p className="text-3xs text-red-700 font-semibold">{error}</p>
        </div>
      )}
    </div>
  );
}