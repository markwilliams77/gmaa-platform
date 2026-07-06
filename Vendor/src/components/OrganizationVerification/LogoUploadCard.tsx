import { ImagePlus } from "lucide-react";

export default function LogoUploadCard() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-600">
          Organization Branding
        </p>

        <h2 className="mt-2 text-3xl font-bold text-slate-900">Company Logo</h2>

        <p className="mt-3 text-sm text-slate-500">
          Upload your organization's official logo. This will appear throughout
          the GMAA marketplace after approval.
        </p>
      </div>

      <div className="rounded-3xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 text-center transition hover:border-cyan-400 hover:bg-cyan-50">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white shadow">
          <ImagePlus className="h-10 w-10 text-cyan-600" />
        </div>

        <h3 className="mt-6 text-xl font-bold text-slate-900">
          Upload Company Logo
        </h3>

        <p className="mt-3 text-sm text-slate-500">PNG, JPG or SVG</p>

        <button className="mt-8 rounded-xl bg-cyan-500 px-8 py-3 font-semibold text-slate-900 hover:bg-cyan-400">
          Choose Logo
        </button>

        <p className="mt-6 text-xs uppercase tracking-widest text-slate-400">
          Recommended 500 × 500 • Max 5 MB
        </p>
      </div>
    </div>
  );
}
