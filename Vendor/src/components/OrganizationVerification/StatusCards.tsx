import React from "react";
import {
  FileText,
  Building2,
  ShieldCheck,
} from "lucide-react";

export default function StatusCards() {
  const cards = [
    {
      title: "Documents",
      value: "0 Uploaded",
      icon: FileText,
      bg: "bg-cyan-50",
      iconColor: "text-cyan-600",
    },
    {
      title: "Organization",
      value: "Profile Incomplete",
      icon: Building2,
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
    {
      title: "Verification",
      value: "Not Submitted",
      icon: ShieldCheck,
      bg: "bg-slate-100",
      iconColor: "text-slate-700",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;

        return (
          <div
            key={card.title}
            className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl ${card.bg}`}
            >
              <Icon className={`h-7 w-7 ${card.iconColor}`} />
            </div>

            <h3 className="mt-6 text-lg font-bold text-slate-900">
              {card.title}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}