import { LockKeyhole, ShieldCheck } from "lucide-react";

interface ApprovalPendingOverlayProps {
  onProfileClick: () => void;
  onMessagesClick: () => void;
}

export default function ApprovalPendingOverlay({
  onProfileClick,
  onMessagesClick,
}: ApprovalPendingOverlayProps) {
  return (
    <div className="absolute inset-0 z-20 flex items-start justify-center pt-20">
      <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-2xl p-10 text-center">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-100">
          <LockKeyhole className="h-8 w-8 text-amber-600" />
        </div>

        <h2 className="mt-6 text-2xl font-bold text-slate-900">
          Application Under Review
        </h2>

        <p className="mt-4 text-slate-600 leading-relaxed">
          Your organization has been registered successfully.
          <br />
          Our compliance team is currently reviewing your
          documents and profile.
        </p>

        <div className="mt-8 rounded-2xl bg-slate-50 border border-slate-200 p-5 text-left space-y-3">
          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            Registration Completed
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            Credentials Generated
          </div>

          <div className="flex items-center gap-3 text-amber-600">
            <LockKeyhole className="h-5 w-5" />
            Waiting for Compliance Verification
          </div>

          <div className="flex items-center gap-3 text-amber-600">
            <LockKeyhole className="h-5 w-5" />
            Waiting for Admin Approval
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={onProfileClick}
            className="rounded-xl bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-slate-800"
          >
            Complete Profile
          </button>

          <button
            onClick={onMessagesClick}
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold hover:bg-slate-100"
          >
            Messages
          </button>
        </div>

      </div>
    </div>
  );
}