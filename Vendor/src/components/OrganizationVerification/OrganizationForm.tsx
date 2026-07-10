/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Building2, Mail, MapPin, User, Globe2 } from "lucide-react";

export default function OrganizationForm() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
      
      {/* Header */}
      <div className="border-b border-slate-100 p-6 md:p-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#2E5B9A] font-mono">
          Organization Information
        </p>
        <h2 className="mt-1 text-2xl font-bold text-slate-900 tracking-tight">
          Company Profile
        </h2>
        <p className="mt-2 text-xs leading-relaxed text-slate-400 font-sans font-light">
          Complete your organization profile. This information will be displayed on your GMAA marketplace profile once verified.
        </p>
      </div>

      <div className="space-y-10 p-6 md:p-8">
        
        {/* Identity */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF3FC] text-[#2E5B9A] border border-blue-50">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Organization Identity</h3>
              <p className="text-3xs text-slate-400 font-sans mt-0.5">Basic registry name and corporate entities.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Company Name" placeholder="Apollo Hospitals" />
            <Field label="Legal Business Name" placeholder="Apollo Health System Pvt. Ltd." />
          </div>
        </section>

        {/* Contact */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF3FC] text-[#2E5B9A] border border-blue-50">
              <User className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Contact Information</h3>
              <p className="text-3xs text-slate-400 font-sans mt-0.5">Primary gateway contact details.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Field label="Primary Contact" placeholder="e.g. Dr. Aditi Nair" />
            <Field label="Email Address" placeholder="casework@apollo.com" type="email" />
            <Field label="Phone Number" placeholder="+91 22 2654 4400" />
          </div>
        </section>

        {/* Location */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF3FC] text-[#2E5B9A] border border-blue-50">
              <MapPin className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Location</h3>
              <p className="text-3xs text-slate-400 font-sans mt-0.5">Geographical headquarters and operations.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Country" placeholder="India" />
            <Field label="Region / State" placeholder="Maharashtra" />
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Business Address
            </label>
            <textarea
              rows={3}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] focus:outline-none transition leading-relaxed"
              placeholder="Full HQ physical address..."
            />
          </div>
        </section>

        {/* Profile */}
        <section className="space-y-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF3FC] text-[#2E5B9A] border border-blue-50">
              <Globe2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Organization Profile</h3>
              <p className="text-3xs text-slate-400 font-sans mt-0.5">Let clients find details about your capabilities.</p>
            </div>
          </div>

          <Field label="Website URL" placeholder="https://www.apollohospitals.com" />

          <div className="space-y-1">
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Organization Description
            </label>
            <textarea
              rows={5}
              maxLength={1000}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] focus:outline-none transition leading-relaxed"
              placeholder="Tell patients and corporate coordinators about your specialty surgeries, inclusions, and experience..."
            />
            <p className="text-[10px] text-slate-400 font-mono text-right">0 / 1000 characters</p>
          </div>
        </section>
      </div>
    </div>
  );
}

interface FieldProps {
  label: string;
  placeholder: string;
  type?: string;
}

function Field({ label, placeholder, type = "text" }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs focus:ring-1 focus:ring-[#2E5B9A] focus:border-[#2E5B9A] focus:outline-none transition"
      />
    </div>
  );
}