import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SERVICES } from "../constants";
import {
  ArrowRight,
  Building2,
  LifeBuoy,
  Bot,
  Zap,
  Search,
  Globe,
  ShieldCheck,
  Activity,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BACKGROUND_IMAGES = [
  "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&q=80&w=2000",
  "https://images.unsplash.com/photo-1579154238337-142f360a7e6b?auto=format&fit=crop&q=80&w=2000",
];

interface HeroProps {
  onSourceVendors?: (service?: string, region?: string) => void;
  onPortalChange?: (portal: "patient" | "vendor") => void;
  onRequestConsultation?: () => void;
}
export default function Hero({
  onSourceVendors,
  onPortalChange,
  onRequestConsultation,
}: HeroProps) {
  const [serviceSearch, setServiceSearch] = useState("");
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [hovered, setHovered] = useState<"care" | "vendor" | null>(null);
  const navigate = useNavigate();

  const filteredServices = SERVICES.filter(
    (s) =>
      s.toLowerCase().includes(serviceSearch.toLowerCase()) &&
      s !== serviceSearch,
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % BACKGROUND_IMAGES.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-white min-h-screen selection:bg-blue-600 selection:text-white">
      {/* ================= HERO SECTION: CINEMATIC IMMERSIVE (100vh) ================= */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
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
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        </div>

        {/* CENTERED CONTENT BOX */}
        <div className="relative z-20 w-full max-w-6xl mx-auto px-6 flex flex-col items-start lg:items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* Artistic Headline (Sans + Italic Serif mix) */}
            <h1 className="text-[clamp(2.5rem,8vw,6.5rem)] font-black text-white leading-[0.95] tracking-[-0.04em] mb-8">
              One Platform <br />
              <span className="italic font-serif font-light text-cyan pr-3">
                Infinite Healthcare Possibilities.
              </span>
            </h1>

            <p className="max-w-2xl mx-auto text-white/50 text-lg lg:text-xl font-medium leading-relaxed mb-12">
              Connecting patients, healthcare providers, and healthcare
              businesses through one intelligent ecosystem for care
              coordination, collaboration, and growth.
            </p>

            {/* INTEGRATED SEARCH CONSOLE (HIGH & CENTERED) */}
            <div className="max-w-3xl mx-auto w-full relative group mb-8">
              <div className="relative bg-white/10 backdrop-blur-3xl rounded-[32px] p-2 border border-white/10 shadow-2xl flex flex-col md:flex-row items-center transition-all duration-500 hover:bg-white/15">
                <div className="flex-1 flex items-center gap-5 pl-8 py-4 w-full">
                  <Bot className="text-cyan" size={24} />
                  <input
                    type="text"
                    value={serviceSearch}
                    onChange={(e) => {
                      setServiceSearch(e.target.value);
                      setShowServiceSuggestions(true);
                    }}
                    placeholder="Ask GMAA."
                    className="w-full bg-transparent border-none font-bold text-white text-xl outline-none placeholder:text-white/20"
                  />
                </div>
                <button
                  onClick={() => {
                    const query = serviceSearch.trim();

                    if (!query) return;

                    navigate(`/vendors?search=${encodeURIComponent(query)}`);
                  }}
                  className="w-full md:w-auto px-12 py-5 bg-white text-navy rounded-[24px] text-xs font-black uppercase tracking-[0.2em] hover:bg-cyan hover:text-white transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl"
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
                      className="absolute top-full left-0 w-full bg-navy/90 backdrop-blur-3xl rounded-[32px] shadow-3xl z-[60] p-6 mt-4 border border-white/5"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {filteredServices.slice(0, 4).map((s) => (
                          <button
                            key={s}
                            onClick={() => {
                              setServiceSearch(s);
                              setShowServiceSuggestions(false);
                            }}
                            className="text-left px-5 py-4 hover:bg-white/5 rounded-2xl text-[10px] font-black text-white/40 hover:text-cyan transition-all uppercase tracking-widest flex justify-between group"
                          >
                            {s}{" "}
                            <Sparkles
                              size={14}
                              className="opacity-0 group-hover:opacity-100"
                            />
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <button className="text-white/40 text-[10px] font-black uppercase tracking-[0.5em] hover:text-white transition-all">
              Seeking healthcare has never been easier
            </button>
          </motion.div>
        </div>
      </section>

      <section className="relative h-[450px] lg:h-[550px] w-full flex overflow-hidden bg-[#020617] border-y border-white/5">
        {/* ================= LEFT ZONE: FIND CARE (BLUE) ================= */}
        <div
          onMouseEnter={() => setHovered("care")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSourceVendors?.()}
          className={`relative h-full transition-all duration-700 ease-in-out cursor-pointer overflow-hidden border-r border-white/10
          ${hovered === "care" ? "w-[65%]" : hovered === "vendor" ? "w-[35%]" : "w-1/2"}`}
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

          <div className="relative z-10 h-full flex flex-col justify-center px-8 lg:px-20">
            <motion.div
              animate={{ x: hovered === "care" ? 15 : 0 }}
              className="max-w-md space-y-4"
            >
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white">
                <LifeBuoy size={24} strokeWidth={1.5} />
              </div>
              <div>
                <span className="text-[9px] font-black text-cyan uppercase tracking-[0.4em] mb-1 block">
                  Portal 01
                </span>
                <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter leading-none">
                  Clients <br />{" "}
                  <span className="text-cyan italic font-serif font-light">
                    Seeking Healthcare
                  </span>
                </h2>
              </div>
              <p
                className={`text-white/50 text-sm lg:text-base leading-relaxed transition-opacity duration-500 max-w-xs ${hovered === "vendor" ? "opacity-0" : "opacity-100"}`}
              >
                Access trusted healthcare providers, compare treatment options,
                and receive personalized care coordination across the globe.
              </p>
              <div className="flex items-center gap-3 text-white text-[10px] font-black uppercase tracking-widest pt-2">
                Find Healthcare <ArrowRight className="text-cyan" size={16} />
              </div>
            </motion.div>
          </div>
        </div>

        {/* ================= RIGHT ZONE: VENDOR PORTAL (RED) ================= */}
        <div
          onMouseEnter={() => setHovered("vendor")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onPortalChange?.("vendor")}
          className={`relative h-full transition-all duration-700 ease-in-out cursor-pointer overflow-hidden
          ${hovered === "vendor" ? "w-[65%]" : hovered === "care" ? "w-[35%]" : "w-1/2"}`}
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

          <div className="relative z-10 h-full flex flex-col justify-center items-end px-8 lg:px-20 text-right">
            <motion.div
              animate={{ x: hovered === "vendor" ? -15 : 0 }}
              className="max-w-md space-y-4"
            >
              <div className="w-12 h-12 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center text-white ml-auto">
                <Building2 size={24} strokeWidth={1.5} />
              </div>
              <div>
                <span className="text-[9px] font-black text-red-400 uppercase tracking-[0.4em] mb-1 block">
                  Portal 02
                </span>
                <h2 className="text-3xl lg:text-5xl font-black text-white tracking-tighter leading-none">
                  Providers <br />{" "}
                  <span className="text-red-400 italic font-serif font-light">
                    & Partners
                  </span>
                </h2>
              </div>
              <p
                className={`text-white/50 text-sm lg:text-base leading-relaxed transition-opacity duration-500 max-w-xs ${hovered === "care" ? "opacity-0" : "opacity-100"}`}
              >
                Showcase your organization, connect with global opportunities,
                manage leads, and grow your healthcare business.
              </p>
              <div className="flex items-center justify-end gap-3 text-white text-[10px] font-black uppercase tracking-widest pt-2">
                <ArrowRight className="text-red-400 rotate-180" size={16} />{" "}
                Join GMAA
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
