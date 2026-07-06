import { CheckCircle2, AlertCircle } from "lucide-react";
import { vendorService } from "../../services/vendorService";

interface SubmitCardProps {
  verificationStatus?: string;
}

export default function SubmitCard({
  verificationStatus,
}: SubmitCardProps) {
  const handleSubmit = async () => {
    try {
      const response = await vendorService.submitVerification();

      alert(response.message);
    } catch (error: any) {
      alert(error?.response?.data?.message ?? "Failed to submit verification.");
    }
  };

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan-600">
            Review & Submit
          </p>

          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            Ready for Verification?
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
            Once all required information has been completed, submit your
            organization for verification. The GMAA team will review your
            application and notify you once the verification process has been
            completed.
          </p>
        </div>

        <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-slate-50 p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />

                <span className="text-sm font-medium text-slate-700">
                  Organization Profile
                </span>
              </div>

              <span className="text-sm font-semibold text-red-500">
                Incomplete
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-500" />

                <span className="text-sm font-medium text-slate-700">
                  Verification Documents
                </span>
              </div>

              <span className="text-sm font-semibold text-red-500">0 / 5</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500" />

                <span className="text-sm font-medium text-slate-700">
                  Verification Status
                </span>
              </div>

              <span className="text-sm font-semibold text-amber-600">
                Documents Pending
              </span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-8 w-full rounded-2xl bg-cyan-600 py-4 font-bold text-white hover:bg-cyan-700 transition"
          >
            Submit for Verification
          </button>
        </div>
      </div>
    </div>
  );
}
