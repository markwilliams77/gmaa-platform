import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Star,
  MapPin,
  ShieldCheck,
  Activity,
  Users,
  Globe2,
  Award,
  ChevronRight,
  BriefcaseMedical,
  Share2,
  Target,
  HeartHandshake,
  Phone,
  Calendar,
  X,
  Bed,
  HeartPulse,
  Building2,
  Globe,
  CheckCircle2,
} from "lucide-react";
import ChatOverlay from "./ChatOverlay";
import { useAuth } from "./AuthContext";
import { cn } from "../lib/utils";
import { backendApi } from "../services/backendApi";
import type { VendorProfile } from "../types/registry";
import FallbackImage from "./FallbackImage";

interface VendorProfilePageProps {
  vendorId: string;
  onBack: () => void;

  onEnquire?: (options?: {
    category?: string;
    vendorId?: string;
    vendorName?: string;
  }) => void;
}

export default function VendorProfilePage({
  vendorId,
  onBack,
  onEnquire,
}: VendorProfilePageProps) {
  const { user } = useAuth();
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showEnquiryOptions, setShowEnquiryOptions] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [vendor, setVendor] = useState<VendorProfile | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [pauseSlideshow, setPauseSlideshow] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    if (
      !vendor?.gallery?.length ||
      vendor.gallery.length <= 1 ||
      pauseSlideshow
    ) {
      return;
    }

    const interval = setInterval(() => {
      setActiveImage((prev) => (prev + 1) % vendor.gallery.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [vendor, pauseSlideshow]);

  useEffect(() => {
    const loadVendor = async () => {
      try {
        const data = await backendApi.getVendorProfile(vendorId);

        setVendor(data);
      } catch (error) {
        console.error("Failed to load vendor", error);
      }
    };

    loadVendor();
  }, [vendorId]);

  useEffect(() => {
    if (!vendor?.testimonials?.length || vendor.testimonials.length <= 2)
      return;

    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % vendor.testimonials.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [vendor]);

  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-[clamp(2rem,4vw,4rem)] font-light text-navy mb-4">
            Vendor not found
          </h2>
          <button
            onClick={onBack}
            className="text-brand-red font-bold uppercase tracking-widest text-sm"
          >
            Return to Registry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] overflow-x-hidden">
      {/* Header / Hero Section */}
      <div className="relative min-h-[500px] sm:min-h-[580px] h-auto lg:h-[72vh] flex items-center py-12 lg:py-0 overflow-hidden">
        <FallbackImage
          src={vendor.image ?? undefined}
          alt={vendor.name}
          seed={vendorId}
          className="absolute inset-0 h-full w-full object-cover object-[58%_center] xl:object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#071018] via-[#071018]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071018] via-transparent to-transparent" />

        <div className="relative z-10 w-full">
          <div className="container mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={onBack}
              className="mb-6 sm:mb-8 flex items-center gap-2 text-white/70 transition hover:text-white"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-1"
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">
                Back to Directory
              </span>
            </motion.button>

            <div className="grid lg:grid-cols-[minmax(0,1fr)_clamp(270px,19vw,340px)] items-center gap-8 xl:gap-12">
              {/* LEFT SIDE */}
              <div className="max-w-[720px]">
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 sm:mb-6 flex flex-wrap items-center gap-3"
                >
                  <span className="rounded-full bg-cyan/20 px-4 sm:px-5 py-1.5 sm:py-2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-cyan backdrop-blur-md">
                    VERIFIED BY GMAA
                  </span>

                  {vendor.rating && (
                    <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 backdrop-blur-md">
                      <Star
                        size={12}
                        className="fill-brand-red text-brand-red shrink-0"
                      />
                      <span className="text-xs font-bold text-white leading-none">
                        {vendor.rating}
                      </span>
                    </div>
                  )}
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="max-w-[13ch] text-[clamp(1.75rem,3.5vw,4.4rem)] font-serif italic font-semibold tracking-[-0.035em] leading-[1] sm:leading-[0.9] text-white drop-shadow-2xl"
                >
                  {vendor.name}
                </motion.h1>

                {vendor.profileHeadline && (
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mt-4 sm:mt-5 max-w-[40rem] text-base sm:text-xl lg:text-[clamp(1.15rem,1vw,1.65rem)] leading-relaxed font-medium text-cyan"
                  >
                    {vendor.profileHeadline}
                  </motion.p>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 sm:mt-5 flex flex-wrap items-center gap-4 sm:gap-5 text-white/80"
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-cyan shrink-0" />
                    <span className="text-xs sm:text-sm font-medium">
                      {vendor.location}
                    </span>
                  </div>

                  {vendor.specialty && (
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-cyan shrink-0" />
                      <span className="text-xs sm:text-sm font-medium">
                        {vendor.specialty}
                      </span>
                    </div>
                  )}
                </motion.div>

                {vendor.accreditation?.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-5 sm:mt-6 flex flex-wrap gap-2.5"
                  >
                    {vendor.accreditation.map((item: string) => (
                      <span
                        key={item}
                        className="rounded-full border border-cyan/30 bg-cyan/10 px-3 py-1.5 sm:px-4 sm:py-2 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.18em] text-cyan backdrop-blur-md"
                      >
                        {item}
                      </span>
                    ))}
                  </motion.div>
                )}
              </div>
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.35 }}
                className="hidden lg:block"
              >
                <div className="rounded-[1.75rem] border border-cyan/10 bg-[#071018]/60 backdrop-blur-2xl p-5 xl:p-5 2xl:p-6 shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
                  <div className="mb-6 xl:mb-8">
                    <p className="text-[11px] font-black uppercase tracking-[0.35em] text-cyan">
                      Organization Snapshot
                    </p>

                    <h3 className="mt-2 text-[clamp(1.6rem,1.3vw,2rem)] font-serif italic text-white">
                      At a Glance
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 xl:w-12 xl:h-12 rounded-2xl bg-cyan/10 flex items-center justify-center shrink-0">
                        <Bed size={20} className="text-cyan" />
                      </div>

                      <div>
                        <p className="text-[clamp(1.55rem,1vw,2rem)] font-bold text-white leading-none">
                          {vendor.stats?.beds}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-white/50 mt-1">
                          Beds
                        </p>
                      </div>
                    </div>

                    <div className="border-b border-white/10" />

                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 xl:w-12 xl:h-12 rounded-2xl bg-cyan/10 flex items-center justify-center shrink-0">
                        <Users size={20} className="text-cyan" />
                      </div>

                      <div>
                        <p className="text-[clamp(1.75rem,1.2vw,2.25rem)] font-bold text-white leading-none">
                          {vendor.stats?.specialists}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-white/50 mt-1">
                          Specialists
                        </p>
                      </div>
                    </div>

                    <div className="border-b border-white/10" />

                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 xl:w-12 xl:h-12 rounded-2xl bg-cyan/10 flex items-center justify-center shrink-0">
                        <Building2 size={20} className="text-cyan" />
                      </div>

                      <div>
                        <p className="text-[clamp(1.75rem,1.2vw,2.25rem)] font-bold text-white leading-none">
                          {vendor.stats?.departments}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-white/50 mt-1">
                          Departments
                        </p>
                      </div>
                    </div>

                    <div className="border-b border-white/10" />

                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 xl:w-12 xl:h-12 rounded-2xl bg-cyan/10 flex items-center justify-center shrink-0">
                        <Globe size={20} className="text-cyan" />
                      </div>

                      <div>
                        <p className="text-[clamp(1.35rem,1vw,1.75rem)] font-bold text-white leading-none">
                          {vendor.stats?.countriesServed}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-white/50 mt-1">
                          Countries Served
                        </p>
                      </div>
                    </div>

                    <div className="border-b border-white/10" />

                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 xl:w-12 xl:h-12 rounded-2xl bg-cyan/10 flex items-center justify-center shrink-0">
                        <HeartPulse size={20} className="text-cyan" />
                      </div>

                      <div>
                        <p className="text-[clamp(1.35rem,1vw,1.75rem)] font-bold text-white leading-none">
                          {vendor.specialty}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-white/50 mt-1">
                          Specialty
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-6 sm:pt-8 lg:pt-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8 sm:gap-10 xl:gap-12">
          {/* Left Column: Organization Summary */}
          <div className="space-y-6 sm:space-y-8 md:space-y-12">
            
            {/* Mobile Only Stats Grid */}
            <div className="grid grid-cols-2 gap-4 lg:hidden">
              {[
                { label: "Beds", val: vendor.stats?.beds, icon: Bed },
                { label: "Specialists", val: vendor.stats?.specialists, icon: Users },
                { label: "Departments", val: vendor.stats?.departments, icon: Building2 },
                { label: "Countries Served", val: vendor.stats?.countriesServed, icon: Globe },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div key={i} className="bg-white p-4 rounded-2xl border border-navy/5 shadow-sm flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-cyan/10 flex items-center justify-center shrink-0">
                      <Icon size={16} className="text-cyan" />
                    </div>
                    <div>
                      <p className="text-lg font-bold text-navy leading-none">{stat.val}</p>
                      <p className="text-[9px] uppercase tracking-widest text-navy/40 mt-1">{stat.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            <section className="bg-white p-5 sm:p-8 md:p-12 xl:p-16 rounded-[24px] sm:rounded-[40px] shadow-sm border border-navy/5">
              <div className="flex items-center gap-3 mb-6 sm:mb-8 md:mb-10">
                <div className="w-10 h-10 rounded-2xl bg-slate-bg flex items-center justify-center shrink-0">
                  <Globe2 className="text-navy/40" size={18} />
                </div>
                <h2 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-navy">
                  Corporate Profile
                </h2>
              </div>
              <p className="max-w-4xl text-sm sm:text-base md:text-lg leading-relaxed sm:leading-9 text-slate-600 font-normal">
                {vendor.description}
              </p>
              <div className="mt-8 sm:mt-10 flex items-center gap-4">
                <div className="h-px w-14 sm:w-20 bg-cyan" />
                <div className="h-px flex-1 bg-slate-200" />
              </div>
            </section>

            {vendor.fullServices && vendor.fullServices.length > 0 && (
              <section className="bg-white rounded-[24px] sm:rounded-[40px] border border-slate-200/70 shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 px-6 sm:px-8 md:px-12 pt-6 sm:pt-8 md:pt-10 pb-5 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-slate-bg flex items-center justify-center shrink-0">
                    <BriefcaseMedical className="text-navy/40" size={18} />
                  </div>
                  <h2 className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.25em] text-navy leading-none">
                    Specialized Services
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 px-6 sm:px-8 md:px-12 py-6 sm:py-8">
                  {vendor.fullServices.map((service: string, idx: number) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center justify-between p-4 rounded-xl sm:rounded-2xl bg-slate-bg group cursor-pointer"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <span className="h-2 w-2 flex-shrink-0 rounded-full bg-cyan"></span>
                        <span className="text-sm sm:text-base font-semibold text-navy truncate">
                          {service}
                        </span>
                      </div>

                      <ChevronRight
                        size={15}
                        className="text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-cyan shrink-0 ml-2"
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {vendor.accreditation && vendor.accreditation.length > 0 && (
              <section className="bg-white rounded-[24px] sm:rounded-[40px] border border-slate-200/70 shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 px-6 sm:px-8 md:px-12 pt-6 sm:pt-8 md:pt-10 pb-5 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-slate-bg flex items-center justify-center shrink-0">
                    <ShieldCheck className="text-navy/40" size={18} />
                  </div>
                  <h2 className="text-xs sm:text-sm md:text-base font-semibold uppercase tracking-[0.25em] text-navy leading-none">
                    Accreditation & Badges
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 px-6 sm:px-8 md:px-12 py-6 sm:py-8">
                  {vendor.accreditation.map((badge: string, idx: number) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between rounded-xl sm:rounded-[1.75rem] bg-slate-50 border border-slate-100 px-5 sm:px-6 py-4 transition-all duration-300 hover:bg-white hover:border-cyan/20 hover:shadow-xl hover:shadow-cyan/5 cursor-pointer"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-cyan/10 flex items-center justify-center shrink-0">
                          <Award size={15} className="text-cyan" />
                        </div>

                        <span className="font-semibold text-navy text-sm sm:text-base truncate">{badge}</span>
                      </div>

                      <ChevronRight
                        size={15}
                        className="text-slate-300 transition-all duration-300 group-hover:text-cyan group-hover:translate-x-1 shrink-0 ml-2"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery Section */}
            {vendor.gallery && vendor.gallery.length > 0 && (
              <section className="space-y-4 sm:space-y-6">
                <div className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-5 sm:w-1.5 sm:h-6 bg-brand-red rounded-full shrink-0" />
                    <div>
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy">
                        Facility Gallery
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-slate-500 leading-normal">
                        Explore our facilities, technology and patient spaces.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Featured Image */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={vendor.gallery[activeImage].id}
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.45, ease: "easeInOut" }}
                      whileHover={{ scale: 0.995 }}
                      onMouseEnter={() => setPauseSlideshow(true)}
                      onMouseLeave={() => setPauseSlideshow(false)}
                      className="relative h-[200px] sm:h-[260px] md:h-[320px] overflow-hidden rounded-2xl sm:rounded-[2rem] border border-slate-200 group"
                    >
                      <FallbackImage
                        src={vendor.gallery[activeImage].imageUrl}
                        alt={vendor.gallery[activeImage].caption ?? "Facility"}
                        seed={`${vendorId}-${vendor.gallery[activeImage].id}`}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4 sm:p-6 md:p-8">
                        <motion.div
                          key={vendor.gallery[activeImage].id + "-caption"}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35 }}
                        >
                          {vendor.gallery[activeImage].caption && (
                            <p className="text-base sm:text-lg md:text-xl font-semibold text-white">
                              {vendor.gallery[activeImage].caption}
                            </p>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Thumbnail Grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
                    {vendor.gallery.map((img, index) => (
                      <motion.div
                        key={img.id}
                        whileHover={{ scale: 0.98 }}
                        onClick={() => setActiveImage(index)}
                        className={`relative aspect-[4/3] overflow-hidden rounded-xl sm:rounded-[1.5rem] border ${
                          activeImage === index
                            ? "border-cyan ring-2 ring-cyan/30"
                            : "border-slate-200"
                        } group cursor-pointer`}
                      >
                        <FallbackImage
                          src={img.imageUrl}
                          alt={img.caption ?? `Gallery ${index + 1}`}
                          seed={`${vendorId}-${img.id}`}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Testimonials */}
            {vendor.testimonials && vendor.testimonials.length > 0 && (
              <section className="relative overflow-hidden rounded-[24px] sm:rounded-[3rem] bg-navy p-5 sm:p-8 md:p-12">
                <div className="absolute inset-0 opacity-[0.03] noise pointer-events-none" />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="mb-6 sm:mb-8 flex items-center gap-3 sm:gap-4">
                    <div className="h-5 sm:h-6 w-1 rounded-full bg-brand-red shrink-0" />

                    <div>
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">
                        Patient Stories
                      </h2>

                      <p className="mt-1 text-xs sm:text-sm text-white/50 leading-normal">
                        Experiences shared by patients who trusted this
                        organization.
                      </p>
                    </div>
                  </div>

                  {/* Testimonials */}
                  <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
                    {Array.from(
                      { length: Math.min(2, vendor.testimonials.length) },
                      (_, offset) => {
                        const test =
                          vendor.testimonials[
                            (activeTestimonial + offset) %
                              vendor.testimonials.length
                          ];

                        return (
                          <motion.div
                            key={test.id}
                            whileHover={{ y: -4 }}
                            transition={{ duration: 0.25 }}
                            className="flex min-h-[180px] sm:h-[200px] h-auto flex-col justify-between rounded-xl sm:rounded-[2rem] border border-white/10 bg-white/5 p-5 sm:p-7 backdrop-blur-xl transition-all duration-300 hover:border-cyan/20 hover:bg-white/10"
                          >
                            <p className="text-sm sm:text-base leading-relaxed sm:leading-7 font-serif italic text-white/90 mb-4">
                              "{test.testimonial}"
                            </p>

                            <div className="flex items-center gap-4">
                              <div>
                                <p className="text-xs font-bold uppercase tracking-[0.25em] text-white">
                                  {test.patientName}
                                </p>

                                {test.country && (
                                  <p className="mt-1 text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.35em] text-cyan">
                                    {test.country}
                                  </p>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      },
                    )}
                  </div>

                  {/* Slider Dots */}
                  <div className="mt-6 flex justify-center gap-2 sm:gap-3">
                    {vendor.testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTestimonial(index)}
                        className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                          index === activeTestimonial
                            ? "w-6 sm:w-8 bg-cyan"
                            : "w-1.5 sm:w-2 bg-white/20 hover:bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* FAQ Section */}
            {vendor.faqs && vendor.faqs.length > 0 && (
              <section className="bg-white p-6 sm:p-10 md:p-12 rounded-[24px] sm:rounded-[3.5rem] shadow-sm border border-navy/5">
                <div className="flex items-center gap-3 mb-6 sm:mb-8 md:mb-10">
                  <div className="w-10 h-10 rounded-2xl bg-cyan/10 flex items-center justify-center text-cyan shrink-0">
                    <Target size={18} />
                  </div>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy">
                    Fulfillment Details
                  </h2>
                </div>
                <div className="space-y-5 sm:space-y-6">
                  {vendor.faqs.map((faq: any, i: number) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="flex justify-between items-center mb-3 gap-4">
                        <h4 className="text-xs sm:text-sm font-bold text-navy group-hover:text-cyan transition-colors leading-tight">
                          {faq.q || faq.question}
                        </h4>
                        <ChevronRight
                          size={14}
                          className="text-navy/20 group-hover:translate-x-1 transition-all shrink-0"
                        />
                      </div>
                      <p className="text-xs text-navy/40 font-medium leading-relaxed">
                        {faq.a || faq.answer}
                      </p>
                      <div className="h-[1px] w-full bg-slate-bg mt-5 sm:mt-6" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: GMAA Concierge */}
          <div className="space-y-5 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl sm:rounded-[2rem] bg-navy p-6 sm:p-7 text-white shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl bg-cyan text-white shrink-0">
                  <HeartHandshake size={22} />
                </div>

                <div>
                  <p className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-cyan">
                    GMAA Concierge
                  </p>

                  <h3 className="mt-1 text-xl sm:text-2xl font-bold leading-tight">
                    Need Assistance?
                  </h3>
                </div>
              </div>

              <p className="mt-4 sm:mt-6 text-xs sm:text-sm leading-relaxed sm:leading-7 text-white/70">
                Speak with a dedicated GMAA Care Coordinator for expert guidance
                and planning.
              </p>

              <div className="mt-6 sm:mt-8 space-y-3.5 sm:space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm">Free Case Review</span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm">24/7 dedicated support</span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                  <span className="text-xs sm:text-sm">Verified Organization</span>
                </div>
              </div>

              <button
                onClick={() => setShowEnquiryOptions(true)}
                className="mt-6 sm:mt-8 w-full rounded-xl sm:rounded-2xl bg-cyan py-3.5 sm:py-4 text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.18em] text-navy transition hover:bg-white shadow-lg active:scale-95 duration-300"
              >
                Request Consultation
              </button>

              {vendor.phone && (
                <a
                  href={`tel:${vendor.phone}`}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl sm:rounded-2xl border border-white/20 bg-white/5 py-3.5 sm:py-4 text-[10px] font-bold uppercase tracking-[0.15em] sm:tracking-[0.18em] text-white transition hover:border-cyan hover:bg-white/10"
                >
                  <Phone size={14} className="shrink-0" />
                  Call
                </a>
              )}
            </div>

            <button className="w-full rounded-xl sm:rounded-2xl border border-navy/10 bg-white py-3.5 sm:py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-navy transition hover:bg-navy hover:text-white flex items-center justify-center gap-2 shadow-sm active:scale-95 duration-300">
              <Share2 size={14} className="shrink-0" />
              Share Organization
            </button>
          </div>
        </div>
      </div>

      <ChatOverlay
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        context={`Inquiry about ${vendor.name}`}
      />

      {/* Enquiry Options Modal */}
      <AnimatePresence>
        {showEnquiryOptions && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowEnquiryOptions(false);
              }}
              className="absolute inset-0 bg-navy/60 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[20px] sm:rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-6 sm:p-10 md:p-12">
                <div className="flex justify-between items-center mb-6 sm:mb-8 gap-4">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-serif italic text-navy">
                      Connect with {vendor.name}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] font-bold text-navy/40 uppercase tracking-widest mt-1">
                      CHOOSE HOW YOU'D LIKE TO PROCEED
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowEnquiryOptions(false);
                    }}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-bg flex items-center justify-center text-navy/40 hover:text-brand-red transition-colors shrink-0"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setShowEnquiryOptions(false);

                      onEnquire?.({
                        vendorId: vendor.id,
                        vendorName: vendor.name,
                      });
                    }}
                    className="group p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-navy/5 bg-slate-bg hover:bg-brand-red transition-all duration-500 text-left flex flex-col justify-between"
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center text-navy group-hover:text-brand-red transition-colors mb-4 shrink-0">
                      <Calendar size={22} className="sm:size-[24px]" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-navy group-hover:text-white transition-colors">
                        Request Consultation
                      </h4>
                      <p className="text-[10px] text-navy/40 group-hover:text-white/60 font-medium mt-1 leading-normal">
                        Submit your requirements and a GMAA coordinator will
                        connect you with this provider.
                      </p>
                    </div>
                  </button>

                  <div className="rounded-2xl sm:rounded-3xl bg-navy p-5 sm:p-6 text-white flex flex-col justify-between gap-4">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-white/10 text-cyan">
                        <Phone size={20} className="sm:size-[24px]" />
                      </div>

                      <div className="min-w-0">
                        <h4 className="text-sm sm:text-base font-bold">
                          Speak With GMAA
                        </h4>

                        <p className="mt-1.5 text-xs leading-relaxed text-white/60">
                          Speak with a GMAA Team for immediate assistance.
                        </p>
                      </div>
                    </div>

                    <a
                      href="tel:+91XXXXXXXXXX"
                      className="flex w-full items-center justify-center rounded-xl sm:rounded-2xl bg-brand-red py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition hover:bg-white hover:text-brand-red text-center"
                    >
                      Call GMAA
                    </a>
                  </div>
                </div>
                
                <p className="mt-6 sm:mt-8 text-center text-xs leading-normal sm:leading-6 text-navy/50">
                  All consultations are coordinated by GMAA to ensure you're
                  connected with the most appropriate verified healthcare
                  provider.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Final CTA */}
      <section className="mt-8 sm:mt-10 relative overflow-hidden rounded-[24px] sm:rounded-[3rem] bg-navy px-6 py-12 sm:px-12 sm:py-16 md:px-16 md:py-20">
        <div className="absolute inset-0 opacity-[0.03] noise pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          <div className="mb-4 sm:mb-6 h-1 w-14 sm:w-20 rounded-full bg-brand-red" />

          <p className="mb-3 sm:mb-4 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.35em] sm:tracking-[0.45em] text-cyan">
            Start Your Journey
          </p>

          <h2 className="max-w-3xl font-serif text-3xl sm:text-4xl md:text-6xl italic leading-tight text-white">
            Ready to Begin Your
            <br />
            Healthcare Journey?
          </h2>

          <p className="mt-6 sm:mt-8 max-w-2xl text-sm sm:text-base leading-relaxed sm:leading-8 text-white/60 px-2">
            Connect with our care coordination team to discuss your treatment
            requirements, receive personalized guidance, and take the next step
            with confidence.
          </p>

          <div className="mt-8 sm:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <button
              onClick={() =>
                onEnquire?.({
                  category: vendor.mainCategory,
                  vendorId: vendor.id,
                  vendorName: vendor.name,
                })
              }
              className="rounded-full bg-cyan px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] text-navy transition-all duration-300 hover:bg-white shadow-lg active:scale-95"
            >
              Request Consultation
            </button>

            <button
              onClick={() =>
                window.scrollTo({
                  top: 0,
                  behavior: "smooth",
                })
              }
              className="rounded-full border border-white/20 px-8 sm:px-10 py-3.5 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] sm:tracking-[0.2em] text-white transition-all duration-300 hover:border-cyan hover:bg-white/5"
            >
              Back to Top
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}