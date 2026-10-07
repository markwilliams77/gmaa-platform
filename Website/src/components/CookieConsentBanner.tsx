import { useEffect, useState } from "react";

const STORAGE_KEY = "gmaa_cookie_consent";

type ConsentChoice = "accepted" | "essential-only" | "rejected";

export default function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    setVisible(!stored);
  }, []);

  const handleChoice = (choice: ConsentChoice) => {
    localStorage.setItem(STORAGE_KEY, choice);
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-[90] border-t border-slate-200 bg-white/95 px-4 py-4 shadow-[0_-10px_40px_rgba(15,23,42,0.12)] backdrop-blur-md sm:px-6">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold text-slate-900">Cookie preferences</p>
          <p className="mt-1 text-sm text-slate-600">
            We use cookies to keep sessions secure and improve your experience. You can accept all cookies or only the essentials required for secure access.
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => handleChoice("essential-only")}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => handleChoice("accepted")}
            className="rounded-full bg-navy px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
