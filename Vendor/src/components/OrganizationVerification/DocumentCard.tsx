import {
  FileText,
  Upload,
  Eye,
  RefreshCw,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { useRef, useState } from "react";

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
    <div className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Header */}

      <div className="flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50">
          <FileText className="h-7 w-7 text-cyan-600" />
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>

            {required && (
              <span className="rounded-full bg-red-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-red-600">
                Required
              </span>
            )}

            {uploaded && (
              <span className="rounded-full bg-green-50 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-green-600">
                Uploaded
              </span>
            )}
          </div>

          <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          onUpload?.(file);
        }}
      />

      {/* Uploading */}

      {uploading && (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-600">
              Uploading...
            </span>

            <span className="font-semibold">{uploadProgress}%</span>
          </div>

          <div className="mt-3 h-3 rounded-full bg-slate-200 overflow-hidden">
            <div
              className="h-full rounded-full bg-cyan-500 transition-all"
              style={{
                width: `${uploadProgress}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Uploaded */}

      {!uploading && uploaded && (
        <div className="mt-8 rounded-2xl border border-green-200 bg-green-50 p-5">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-6 w-6 text-green-600" />

            <div className="flex-1">
              <p className="font-semibold text-slate-900">
                {fileName || "document.pdf"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {fileSize || "1.2 MB"}
                {" • "}
                {uploadedAt || "Just now"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onPreview}
              className="flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold hover:bg-white"
            >
              <Eye className="h-4 w-4" />
              Preview
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              title={
                disabled
                  ? "Documents are locked while under review."
                  : "Replace document"
              }
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                disabled
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  : "border-cyan-500 text-cyan-600 hover:bg-cyan-50"
              }`}
            >
              <RefreshCw className="h-4 w-4" />
              Replace
            </button>

            <button
              onClick={onDelete}
              disabled={disabled}
              title={
                disabled
                  ? "Documents are locked while under review."
                  : "Delete document"
              }
              className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                disabled
                  ? "cursor-not-allowed border-slate-200 bg-slate-100 text-slate-400"
                  : "border-red-300 text-red-600 hover:bg-red-50"
              }`}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Empty */}

      {!uploading && !uploaded && (
        <div className="mt-8 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center transition-all group-hover:border-cyan-400 group-hover:bg-cyan-50/40">
          <Upload className="mx-auto h-10 w-10 text-slate-400" />

          <h4 className="mt-5 text-lg font-bold text-slate-900">Drag & Drop</h4>

          <p className="mt-2 text-sm text-slate-500">
            or browse files from your computer
          </p>
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={disabled}
              title={
                disabled
                  ? "Documents are locked while under review."
                  : "Upload document"
              }
              className={`mt-6 rounded-xl px-6 py-3 font-semibold transition ${
                disabled
                  ? "cursor-not-allowed bg-slate-200 text-slate-500"
                  : "bg-cyan-500 text-slate-900 hover:bg-cyan-400"
              }`}
            >
              Browse Files
            </button>
          </>

          <p className="mt-6 text-xs uppercase tracking-widest text-slate-400">
            PDF • PNG • JPG • Maximum 10 MB
          </p>
        </div>
      )}

      {/* Error */}

      {error && (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-5 w-5 text-red-500" />

          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}
    </div>
  );
}
