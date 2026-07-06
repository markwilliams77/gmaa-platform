import { Building2, Mail, MapPin, User } from "lucide-react";

export default function OrganizationForm() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}

      <div className="border-b border-slate-200 p-8">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-600">
          Organization Information
        </p>

        <h2 className="mt-2 text-3xl font-bold text-slate-900">
          Company Profile
        </h2>

        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
          Complete your organization profile. This information will be displayed
          on your GMAA marketplace profile once your organization has been
          verified.
        </p>
      </div>

      <div className="space-y-10 p-8">
        {/* Identity */}

        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
              <Building2 className="h-5 w-5 text-cyan-600" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Organization Identity
              </h3>

              <p className="text-sm text-slate-500">
                Basic information about your organization.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Company Name" placeholder="Company Name" />

            <Field
              label="Legal Business Name"
              placeholder="Legal Business Name"
            />
          </div>
        </section>

        {/* Contact */}

        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
              <User className="h-5 w-5 text-cyan-600" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Contact Information
              </h3>

              <p className="text-sm text-slate-500">Primary contact details.</p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Primary Contact" placeholder="Primary Contact" />

            <Field
              label="Email Address"
              placeholder="Email Address"
              type="email"
            />

            <Field label="Phone Number" placeholder="Phone Number" />
          </div>
        </section>

        {/* Location */}

        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
              <MapPin className="h-5 w-5 text-cyan-600" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">Location</h3>

              <p className="text-sm text-slate-500">
                Where your organization operates.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <Field label="Country" placeholder="Country" />

            <Field label="Region" placeholder="Region" />
          </div>

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Business Address
            </label>

            <textarea
              rows={3}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 transition focus:border-cyan-500 focus:outline-none"
              placeholder="Business Address"
            />
          </div>
        </section>

        {/* Organization */}

        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50">
              <Mail className="h-5 w-5 text-cyan-600" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-slate-900">
                Organization Profile
              </h3>

              <p className="text-sm text-slate-500">
                Tell clients about your organization.
              </p>
            </div>
          </div>

          <Field label="Website" placeholder="https://" />

          <div className="mt-6">
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              Organization Description
            </label>

            <textarea
              rows={6}
              maxLength={1000}
              className="w-full rounded-2xl border border-slate-300 px-4 py-3 transition focus:border-cyan-500 focus:outline-none"
              placeholder="Tell patients and healthcare providers about your organization..."
            />

            <p className="mt-2 text-right text-xs text-slate-400">
              0 / 1000 characters
            </p>
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
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>

      <input
        type={type}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-300 px-4 py-3 transition focus:border-cyan-500 focus:outline-none"
      />
    </div>
  );
}
