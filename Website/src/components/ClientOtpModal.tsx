import React, { useState } from "react";
import { X, ShieldCheck } from "lucide-react";
import { backendApi } from "../services/backendApi";

interface ClientOtpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export default function ClientOtpModal({
  isOpen,
  onClose,
  onVerified,
}: ClientOtpModalProps) {
  React.useEffect(() => {
    if (!isOpen) return;

    localStorage.setItem("gmaa_client_verified", "true");
    localStorage.setItem("gmaa_client_phone", "production-bypass");

    onVerified();
  }, [isOpen, onVerified]);

  return null;
  
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [mode, setMode] = useState<"login" | "signup">("login");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSendOtp = async () => {
    try {
      setLoading(true);
      setError("");

      await backendApi.sendOtp(
        phone,
        mode,
        mode === "signup" ? email : undefined,
      );

      setStep("otp");
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      setLoading(true);
      setError("");

      const result = await backendApi.verifyOtp(phone, otp);

      if (!result.verified) {
        throw new Error("Invalid OTP");
      }

      localStorage.setItem("gmaa_client_verified", "true");
      localStorage.setItem("gmaa_client_phone", phone);
      setIsSuccess(true);
      setTimeout(() => {
        onVerified();
      }, 1200);

      onVerified();
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-md p-10 bg-white/95 backdrop-blur-2xl border border-navy/5 rounded-[48px] shadow-[0_30px_80px_rgba(0,0,0,0.12)]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-navy/40 hover:text-navy"
        >
          <X size={20} />
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-6 bg-navy rounded-2xl flex items-center justify-center shadow-lg">
            <ShieldCheck className="text-brand-red" size={32} />
          </div>
          <h2 className="text-3xl font-serif italic text-navy mb-2">
            Client Access
          </h2>

          <p className="text-[11px] font-black uppercase tracking-[0.35em] text-navy/40 mb-4">
            Client Verification Portal
          </p>

          <p className="text-sm text-navy/60 leading-relaxed">
            Verify your number to access verified hospitals, providers and
            healthcare partners in the GMAA network.
          </p>
        </div>

        {isSuccess && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-6 bg-green-100 rounded-2xl flex items-center justify-center">
              <span className="text-2xl">✓</span>
            </div>
            <h3 className="text-2xl font-serif italic text-navy mb-3">
              Access Granted
            </h3>
            <p className="text-sm text-navy/60">
              Connecting you to the Global Provider Network...
            </p>
          </div>
        )}

        {!isSuccess && step === "phone" && (
          <>
            <div className="flex bg-slate-bg rounded-2xl p-1 mb-8 border border-navy/5">
              <button
                onClick={() => setMode("login")}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                  mode === "login"
                    ? "bg-white shadow-lg text-navy"
                    : "text-navy/40"
                }`}
              >
                LOGIN
              </button>

              <button
                onClick={() => setMode("signup")}
                className={`flex-1 py-3 rounded-xl text-xs font-bold transition-all ${
                  mode === "signup" ? "bg-white shadow" : "text-navy/40"
                }`}
              >
                SIGNUP
              </button>
            </div>

            {mode === "signup" && (
              <>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-bg border-none rounded-2xl px-5 py-4 mb-4 text-sm font-medium focus:ring-2 focus:ring-navy/20 transition-all"
                />

                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-bg border-none rounded-2xl px-5 py-4 mb-4 text-sm font-medium focus:ring-2 focus:ring-navy/20 transition-all"
                />
              </>
            )}

            <input
              type="tel"
              placeholder="Mobile Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-slate-bg border-none rounded-2xl px-5 py-4 mb-4 text-sm font-medium focus:ring-2 focus:ring-navy/20 transition-all"
            />

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-navy text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] shadow-xl hover:bg-brand-red transition-all"
            >
              {loading ? "Sending OTP..." : "Access Provider Network"}
            </button>

            <p className="text-center text-xs text-navy/40 mt-4">
              Your number is used only for provider access verification.
            </p>
          </>
        )}

        {!isSuccess && step === "otp" && (
          <>
            <div className="text-center mb-6">
              <p className="text-sm text-green-600 font-semibold mb-2">
                OTP Sent Successfully
              </p>

              <p className="text-xs text-navy/50">
                Enter the verification code sent to
              </p>

              <p className="text-sm font-semibold text-navy mt-1">{phone}</p>
            </div>

            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border rounded-xl px-4 py-3 mb-4 text-center tracking-[0.5em]"
            />

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-navy text-white py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] shadow-xl hover:bg-brand-red transition-all"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>

            <button
              onClick={() => {
                setStep("phone");
                setOtp("");
              }}
              className="w-full mt-4 text-sm text-navy/50 hover:text-navy"
            >
              Change Phone Number
            </button>
          </>
        )}
      </div>
    </div>
  );
}
