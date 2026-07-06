import { motion } from "motion/react";
import { categoryCards } from "../data/categoryCards";
import { ChevronRight, LayoutGrid, List } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HealthcareDirectory() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const navigate = useNavigate();
  return (
    <section id="directory" className="py-24 md:py-32 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-8">
          <div className="space-y-4 md:space-y-6 text-left">
            <div className="flex items-center gap-4">
              <div className="h-1 w-6 md:w-8 bg-brand-red rounded-full" />
              <span className="text-cyan font-bold uppercase tracking-[0.4em] text-[8px] md:text-[10px]">
                Medical Network
              </span>
            </div>
            <h2 className="text-3xl md:text-7xl font-light tracking-tighter text-navy uppercase leading-[1.1]">
              Explore Healthcare <br className="hidden md:block" />
              <span className="font-serif italic font-medium text-gradient pr-2">
                Categories.
              </span>
            </h2>
            <p className="text-[clamp(1rem,0.5vw+0.9rem,1.125rem)] md:text-xl text-navy/40 font-medium max-w-2xl leading-relaxed">
              Explore healthcare providers across hospitals, diagnostics,
              emergency transport, home care, pharmaceuticals, medical tourism,
              insurance, telemedicine, rehabilitation, and more—all organized
              into a single intelligent directory.
            </p>
          </div>

          <div className="flex bg-slate-bg p-1 rounded-2xl border border-navy/5 self-start md:self-auto">
            <button
              onClick={() => setView("grid")}
              className={`p-3 rounded-xl transition-all ${view === "grid" ? "bg-white shadow-xl shadow-navy/5 text-navy" : "text-navy/30"}`}
            >
              <LayoutGrid size={20} />
            </button>
            <button
              onClick={() => setView("list")}
              className={`p-3 rounded-xl transition-all ${view === "list" ? "bg-white shadow-xl shadow-navy/5 text-navy" : "text-navy/30"}`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {view === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryCards.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03 }}
                className="group p-5 rounded-3xl bg-white border border-slate-200 hover:border-cyan/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan/10 transition-all duration-300 cursor-pointer flex flex-col"
                onClick={() =>
                  navigate(`/vendors?category=${encodeURIComponent(cat.title)}`)
                }
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan/10 to-blue-100 flex items-center justify-center text-2xl mb-3 group-hover:scale-105 transition-transform">
                      {cat.icon}
                    </div>

                    <h3 className="text-lg font-bold text-navy leading-tight group-hover:text-cyan transition-colors">
                      {cat.title}
                    </h3>

                    <span className="inline-flex mt-3 px-3 py-1 rounded-full bg-cyan/10 text-[10px] font-bold uppercase tracking-wider text-cyan">
                      {cat.specialties.length} Specialties
                    </span>
                  </div>

                  <div className="w-10 h-10 rounded-xl border border-slate-200 flex items-center justify-center text-navy/30 group-hover:bg-navy group-hover:text-white transition-all">
                    <ChevronRight size={18} />
                  </div>
                </div>

                <div className="space-y-2 flex-1">
                  {[...cat.subcategories, ...cat.specialties]
                    .slice(0, 3)
                    .map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full bg-cyan" />
                        <span className="text-sm text-navy/65">{item}</span>
                      </div>
                    ))}

                  {cat.specialties.length > 3 && (
                    <p className="text-[10px] font-bold text-cyan uppercase tracking-wider pt-1">
                      +{cat.specialties.length - 3} More Specialties
                    </p>
                  )}
                </div>

                {cat.specialties.length > 0 && (
                  <div className="mt-4">
                    <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-cyan/80 mb-2 block">
                      Featured
                    </span>

                    <div className="flex flex-wrap gap-2">
                      {cat.specialties.slice(0, 2).map((spec, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-medium text-navy/70 group-hover:bg-cyan/10 group-hover:text-cyan transition-all"
                        >
                          {spec}
                        </span>
                      ))}

                      {cat.specialties.length > 2 && (
                        <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-medium text-cyan">
                          +{cat.specialties.length - 2}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {categoryCards.map((cat, idx) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                className="group flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 p-4 md:p-6 bg-slate-bg/30 border border-navy/5 rounded-2xl md:rounded-3xl hover:bg-white hover:shadow-xl transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between w-full sm:w-auto">
                  <span className="text-xl font-serif italic text-navy/10 w-12 group-hover:text-cyan/20 transition-colors">
                    {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                  </span>
                  <div className="sm:hidden w-8 h-8 rounded-full border border-navy/5 flex items-center justify-center text-navy/20">
                    <ChevronRight size={14} />
                  </div>
                </div>
                <h3 className="text-[clamp(1rem,0.5vw+0.9rem,1.125rem)] md:text-xl font-bold text-navy flex-1 tracking-tight">
                  {cat.title}
                </h3>
                <div className="hidden sm:flex gap-4 px-4 md:px-8 border-l border-navy/5">
                  <span className="text-[8px] md:text-[10px] font-bold text-navy/30 uppercase tracking-widest">
                    {cat.subcategories.length} Subcategories
                  </span>
                </div>
                <div className="hidden sm:flex w-10 h-10 rounded-full border border-navy/5 items-center justify-center text-navy/20 group-hover:bg-navy group-hover:text-white transition-all shrink-0">
                  <ChevronRight size={16} />
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-24 text-center">
          <button className="px-16 py-7 bg-navy text-white rounded-full text-xs font-bold uppercase tracking-[0.3em] hover:bg-brand-red transition-all shadow-2xl active:scale-95">
            Source From Full Network
          </button>
        </div>
      </div>
    </section>
  );
}
