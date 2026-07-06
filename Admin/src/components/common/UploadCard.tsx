import { useRef, useState } from "react";
import { uploadsService } from "../../services/api/uploads.service";

interface UploadCardProps {
  title: string;
  type: "image" | "document";
  module: string;
  ownerId: string;
  folder: string;
  accept: string;
  value?: string;
  onUploaded: (url: string) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  allowDelete?: boolean;
}

export default function UploadCard({
  title,
  type,
  module,
  ownerId,
  folder,
  accept,
  value,
  onUploaded,
  onDelete,
  allowDelete = false,
}: UploadCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");

  const displayName =
    fileName ||
    decodeURIComponent(value?.split("/").pop() ?? "");

  const handleUpload = async (file: File) => {
    try {
      setUploading(true);

      setFileName(file.name);

      setFileSize(
        file.size >= 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
          : `${(file.size / 1024).toFixed(1)} KB`
      );

      const fileUrl = await uploadsService.upload(
        module,
        ownerId,
        folder,
        file
      );

      setSaving(true);

      await onUploaded(fileUrl);

      setSaving(false);
    } catch (error) {
      console.error(error);
      alert("Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-navy">{title}</h3>

          <p className="text-sm text-slate-500">
            {type === "image"
              ? "Upload an image"
              : "Upload a document"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-xl bg-navy px-4 py-2 text-white font-semibold hover:bg-navy/90 disabled:opacity-50"
        >
          {uploading
            ? "Uploading..."
            : value
            ? "Replace"
            : "Upload"}
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={async (e) => {
          const file = e.target.files?.[0];

          if (!file) return;

          await handleUpload(file);

          e.target.value = "";
        }}
      />

      {saving && (
        <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-700">
          Saving...
        </div>
      )}

      {!saving && value && (
        <div className="rounded-xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
          ✓ Saved
        </div>
      )}

      {value && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-4">
          {type === "image" ? (
            <>
              <div className="relative h-72 overflow-auto rounded-xl border bg-white">
                <img
                  src={value}
                  alt={title}
                  className="w-full object-contain"
                />

                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-navy" />

                      <p className="text-sm font-semibold text-navy">
                        Uploading...
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p
                    className="truncate text-sm font-semibold text-navy"
                    title={displayName}
                  >
                    {displayName}
                  </p>

                  {fileSize && (
                    <p className="text-xs text-slate-500">
                      {fileSize}
                    </p>
                  )}
                </div>

                <div className="flex gap-2">
                  <a
                    href={value}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-100"
                  >
                    👁 View Image
                  </a>

                  {allowDelete && (
                    <button
                      type="button"
                      onClick={async () => {
                        if (!confirm(`Delete ${title}?`)) return;

                        await onDelete?.();
                      }}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                    >
                      🗑 Delete
                    </button>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="text-3xl">📄</div>

                <div className="min-w-0">
                  <p
                    className="truncate font-semibold text-navy"
                    title={displayName}
                  >
                    {displayName}
                  </p>

                  {fileSize && (
                    <p className="text-xs text-slate-500">
                      {fileSize}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-2">
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold hover:bg-slate-100"
                >
                  📄 Open PDF
                </a>

                {allowDelete && (
                  <button
                    type="button"
                    onClick={async () => {
                      if (!confirm(`Delete ${title}?`)) return;

                      await onDelete?.();
                    }}
                    className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-100"
                  >
                    🗑 Delete
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}