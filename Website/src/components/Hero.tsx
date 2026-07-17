import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICES } from "../constants";
import { ArrowRight, Building2, LifeBuoy, Bot, Sparkles } from "lucide-react";

interface HeroProps {
  onSourceVendors?: (service?: string, region?: string) => void;
  onPortalChange?: (portal: "patient" | "vendor") => void;
  onRequestConsultation?: () => void;
}

export default function Hero({ onSourceVendors, onPortalChange }: HeroProps) {
  const [serviceSearch, setServiceSearch] = useState("");
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [hovered, setHovered] = useState<"care" | "vendor" | null>(null);

  const filteredServices = SERVICES.filter(
    (s) =>
      s.toLowerCase().includes(serviceSearch.toLowerCase()) &&
      s !== serviceSearch,
  );

  return (
    <div className="bg-white min-h-screen selection:bg-blue-600 selection:text-white">
      {/* ================= HERO SECTION: CINEMATIC IMMERSIVE (100vh) ================= */}
      <section className="relative min-h-screen lg:h-screen w-full flex items-center justify-center overflow-hidden py-20 lg:py-0">
        {/* BACKGROUND: Cinematic Depth */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            className="w-full h-full object-cover"
          >
            <source src="/videos/hero.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          {/* Dark Cinematic Veil */}
          <div className="absolute inset-0 bg-[#020617]/60 backdrop-blur-[50%]" />
          {/* Subtle Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[800px] h-[300px] sm:h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        {/* CENTERED CONTENT BOX */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-6 flex flex-col items-center text-center translate-y-8 sm:translate-y-12 lg:translate-y-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="w-full"
          >
            {/* Artistic Headline (Sans + Italic Serif mix) */}
            <h1 className="text-[clamp(1.75rem,7vw,6.5rem)] font-black text-white leading-[1] lg:leading-[0.95] tracking-[-0.04em] mb-6 sm:mb-8">
              One Platform <br />
              <span className="italic font-serif font-light text-cyan block mt-1 sm:mt-2">
                Infinite Healthcare Possibilities.
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-white/50 text-sm sm:text-base lg:text-xl font-medium leading-relaxed mb-8 sm:mb-12 px-2">
              Connecting patients, healthcare providers, and healthcare
              businesses through one intelligent ecosystem for care
              coordination, collaboration, and growth.
            </p>

            {/* INTEGRATED SEARCH CONSOLE (HIGH & CENTERED) */}
            <div className="max-w-3xl mx-auto w-full relative group mb-8">
              <div className="relative bg-white/10 backdrop-blur-3xl rounded-[24px] sm:rounded-[32px] p-2 border border-white/10 shadow-2xl flex flex-col sm:flex-row items-center transition-all duration-500 hover:bg-white/15">
                <div className="flex-1 flex items-center gap-3 sm:gap-5 pl-4 sm:pl-8 py-3 sm:py-4 w-full">
                  <Bot className="text-cyan shrink-0" size={24} />
                  <input
                    type="text"
                    value={serviceSearch}
                    onChange={(e) => {
                      setServiceSearch(e.target.value);
                      setShowServiceSuggestions(true);
                    }}
                    placeholder="Ask GMAA."
                    className="w-full bg-transparent border-none font-bold text-white text-base sm:text-lg lg:text-xl outline-none placeholder:text-white/25"
                  />
                </div>
                <button
                  onClick={() => {
                    const query = serviceSearch.trim();
                    if (!query) return;
                    onSourceVendors?.(query);
                  }}
                  className="w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-5 bg-white text-navy rounded-[18px] sm:rounded-[24px] text-xs font-black uppercase tracking-[0.2em] hover:bg-cyan hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl mt-2 sm:mt-0"
                >
                  Search <ArrowRight size={16} />
                </button>

                {/* Suggestions Dropdown */}
                <AnimatePresence>
                  {showServiceSuggestions && filteredServices.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      className="absolute top-full left-0 w-full bg-navy/95 backdrop-blur-3xl rounded-[24px] sm:rounded-[32px] shadow-3xl z-[60] p-4 sm:p-6 mt-4 border border-white/5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredServices.slice(0, 4).map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              setServiceSearch(s);
                              setShowServiceSuggestions(false);
                            }}
                            className="text-left px-4 sm:px-5 py-3 sm:py-4 hover:bg-white/5 rounded-xl sm:rounded-2xl text-[10px] font-black text-white/40 hover:text-cyan transition-all uppercase tracking-widest flex justify-between items-center group"
                          >
                            <span className="truncate">{s}</span>
                            <Sparkles
                              size={14}
                              className="opacity-0 group-hover:opacity-100 shrink-0 ml-2"
                            />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button className="text-white/40 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.3em] sm:tracking-[0.5em] hover:text-white transition-all">
              Seeking healthcare has never been easier
            </button>
          </motion.div>
        </div>
      </section>

      {/* ================= PORTAL SPLIT SECTION ================= */}
      <section className="relative h-auto lg:h-[550px] w-full flex flex-col lg:flex-row overflow-hidden bg-[#020617] border-y border-white/5">
        {/* ================= LEFT ZONE: FIND CARE (BLUE) ================= */}
        <div
          onMouseEnter={() => setHovered("care")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSourceVendors?.()}
          className={`relative h-[350px] sm:h-[400px] lg:h-full transition-all duration-700 ease-in-out cursor-pointer overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10 w-full
          ${hovered === "care" ? "lg:w-[65%]" : hovered === "vendor" ? "lg:w-[35%]" : "lg:w-1/2"}`}
        >
          <div className="absolute inset-0">
            <motion.img
              src="/images/patient-zone-card.png"
              className="w-full h-full object-cover grayscale brightness-75"
              animate={{ scale: hovered === "care" ? 1.1 : 1 }}
              transition={{ duration: 1.5 }}
            />
            {/* Blue Shade */}
            <div
              className="absolute inset-0 bg-blue-600/40 mix-blend-multiply transition-opacity duration-700"
              style={{ opacity: hovered === "care" ? 0.8 : 0.4 }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-transparent to-transparent opacity-80" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 lg:px-20">
            <motion.div
              animate={{ x: hovered === "care" ? 15 : 0 }}
              className="max-w-md space-y-3 sm:space-y-4"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center text-white">
                <LifeBuoy size={22} strokeWidth={1.5} />
              </div>
              <div>
                <span className="text-[9px] font-black text-cyan uppercase tracking-[0.4em] mb-1 block">
                  Portal 01
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white tracking-tighter leading-none">
                  Clients <br />{" "}
                  <span className="text-cyan italic font-serif font-light">
                    Seeking Healthcare
                  </span>
                </h2>
              </div>
              <p
                className={`text-white/50 text-xs sm:text-sm lg:text-base leading-relaxed transition-opacity duration-500 max-w-xs lg:block
                ${hovered === "vendor" ? "lg:opacity-0" : "lg:opacity-100"}`}
              >
                Access trusted healthcare providers, compare treatment options,
                and receive personalized care coordination across the globe.
              </p>
              <div className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-widest pt-1 sm:pt-2">
                Find Healthcare{" "}
                <ArrowRight className="text-cyan animate-pulse" size={16} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ================= RIGHT ZONE: VENDOR PORTAL (RED) ================= */}
        <div
          onMouseEnter={() => setHovered("vendor")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onPortalChange?.("vendor")}
          className={`relative h-[350px] sm:h-[400px] lg:h-full transition-all duration-700 ease-in-out cursor-pointer overflow-hidden w-full
          ${hovered === "vendor" ? "lg:w-[65%]" : hovered === "care" ? "lg:w-[35%]" : "lg:w-1/2"}`}
        >
          <div className="absolute inset-0">
            <motion.img
              src="/images/vendor-zone-card.png"
              className="w-full h-full object-cover grayscale brightness-75"
              animate={{ scale: hovered === "vendor" ? 1.1 : 1 }}
              transition={{ duration: 1.5 }}
            />
            {/* Red Shade */}
            <div
              className="absolute inset-0 bg-red-600/40 mix-blend-multiply transition-opacity duration-700"
              style={{ opacity: hovered === "vendor" ? 0.8 : 0.4 }}
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[#020617] via-transparent to-transparent opacity-80" />
          </div>

          <div className="relative z-10 h-full flex flex-col justify-center items-start lg:items-end px-6 sm:px-12 lg:px-20 text-left lg:text-right">
            <motion.div
              animate={{ x: hovered === "vendor" ? -15 : 0 }}
              className="max-w-md space-y-3 sm:space-y-4"
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl flex items-center justify-center text-white lg:ml-auto">
                <Building2 size={22} strokeWidth={1.5} />
              </div>
              <div>
                <span className="text-[9px] font-black text-red-400 uppercase tracking-[0.4em] mb-1 block">
                  Portal 02
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-white tracking-tighter leading-none">
                  Providers <br />{" "}
                  <span className="text-red-400 italic font-serif font-light">
                    & Partners
                  </span>
                </h2>
              </div>
              <p
                className={`text-white/50 text-xs sm:text-sm lg:text-base leading-relaxed transition-opacity duration-500 max-w-xs lg:block
                ${hovered === "care" ? "lg:opacity-0" : "lg:opacity-100"}`}
              >
                Showcase your organization, connect with global opportunities,
                manage leads, and grow your healthcare business.
              </p>
              <div className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-widest pt-1 sm:pt-2 lg:justify-end w-full">
                <ArrowRight
                  className="text-red-400 rotate-180 hidden lg:block"
                  size={16}
                />{" "}
                Join GMAA
                <ArrowRight className="text-red-400 lg:hidden" size={16} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* Central Aesthetic Divider */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none hidden lg:block">
          <div className="w-px h-24 bg-white/20 relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_10px_white]" />
          </div>
        </div>
      </section>
    </div>
  );
}
