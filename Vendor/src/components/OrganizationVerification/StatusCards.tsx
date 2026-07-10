/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { FileText, Building2, ShieldCheck } from "lucide-react";

export default function StatusCards() {
  const cards = [
    {
      title: "Documents",
      value: "0 Uploaded",
      icon: FileText,
      bg: "bg-[#EBF3FC]",
      iconColor: "text-[#2E5B9A]",
      border: "hover:border-[#2E5B9A]/30"
    },
    {
      title: "Organization",
      value: "Profile Incomplete",
      icon: Building2,
      bg: "bg-amber-50",
      iconColor: "text-amber-600",
      border: "hover:border-amber-500/20"
    },
    {
      title: "Verification",
      value: "Not Submitted",
      icon: ShieldCheck,
      bg: "bg-slate-50",
      iconColor: "text-slate-500",
      border: "hover:border-slate-300"
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-3 select-none">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className={`rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${card.border}`}
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${card.bg}`}>
              <Icon className={`h-5 w-5 ${card.iconColor}`} />
            </div>

            <h3 className="mt-5 text-sm font-bold text-slate-900 tracking-tight">
              {card.title}
            </h3>

            <p className="mt-1 text-xs text-slate-500 font-light">
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}