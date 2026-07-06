import React from "react";

export default function Hero() {
  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-10 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.35em] text-cyan-600">
            Organization Verification
          </p>

          <div className="mt-5">
            <span className="inline-flex items-center rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-700">
              ● Documents Pending
            </span>
          </div>

          <h1 className="mt-6 text-4xl font-bold text-slate-900">
            Complete your verification
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-500">
            Complete your organization profile and upload the required
            verification documents to unlock the GMAA Vendor Marketplace.
          </p>
        </div>

        <div className="w-full lg:w-96 rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">
              Verification Progress
            </span>

            <span className="text-3xl font-bold text-cyan-600">0%</span>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
          </div>

          <div className="mt-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Organization</span>
              <span className="font-semibold text-red-500">Incomplete</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Documents</span>
              <span className="font-semibold text-red-500">0 / 5</span>
            </div>

            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Review</span>
              <span className="font-semibold text-amber-600">Pending</span>
            </div>
          </div>

          <button className="mt-8 w-full rounded-2xl bg-cyan-500 py-3 font-semibold text-slate-900 transition hover:bg-cyan-400">
            Continue Verification
          </button>
        </div>
      </div>
    </div>
  );
}
