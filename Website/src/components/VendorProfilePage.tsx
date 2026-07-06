import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ArrowLeft,
  Star,
  MapPin,
  ShieldCheck,
  ClipboardList,
  Activity,
  Users,
  Globe2,
  Award,
  ChevronRight,
  Stethoscope,
  BriefcaseMedical,
  MessageSquare,
  Share2,
  Target,
  HeartHandshake,
  Phone,
  Calendar,
  MessageCircle,
  X,
  Send,
  CheckCircle2,
  Bed,
  HeartPulse,
  Building2,
  Globe,
} from "lucide-react";
import ChatOverlay from "./ChatOverlay";
import { useAuth } from "./AuthContext";
import { cn } from "../lib/utils";
import { backendApi } from "../services/backendApi";
import type { VendorProfile } from "../types/registry";

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
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header / Hero Section */}
      <div className="relative min-h-[580px] h-[68vh] lg:h-[72vh] 2xl:h-[78vh] max-h-[880px] overflow-hidden">
        <img
          src={vendor.image ?? undefined}
          alt={vendor.name}
          className="absolute inset-0 h-full w-full object-cover object-[58%_center] xl:object-center"
          referrerPolicy="no-referrer"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-[#071018] via-[#071018]/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071018] via-transparent to-transparent" />

        <div className="relative z-10 flex h-full items-center -translate-y-8 xl:-translate-y-6 2xl:translate-y-0">
          <div className="container mx-auto w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-12 md:py-16 lg:py-20">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={onBack}
              className="mb-10 xl:mb-8 flex items-center gap-2 text-white/70 transition hover:text-white"
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
                  className="mb-6 flex flex-wrap items-center gap-3"
                >
                  <span className="rounded-full bg-cyan/20 px-5 py-2 text-[10px] font-black uppercase tracking-[0.25em] text-cyan backdrop-blur-md">
                    VERIFIED BY GMAA
                  </span>

                  {vendor.rating && (
                    <div className="flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md">
                      <Star
                        size={14}
                        className="fill-brand-red text-brand-red"
                      />
                      <span className="text-xs font-bold text-white">
                        {vendor.rating}
                      </span>
                    </div>
                  )}
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="max-w-[13ch] text-[clamp(2.2rem,3vw,4.4rem)] font-serif italic font-semibold tracking-[-0.035em] leading-[0.9] text-white drop-shadow-2xl"
                >
                  {vendor.name}
                </motion.h1>

                {vendor.profileHeadline && (
                  <motion.p
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="mt-5 max-w-[40rem] text-[clamp(1.15rem,1vw,1.65rem)] leading-relaxed font-medium text-cyan"
                  >
                    {vendor.profileHeadline}
                  </motion.p>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-5 flex flex-wrap items-center gap-5 text-white/80"
                >
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-cyan" />
                    <span className="text-[clamp(.9rem,.45vw,1rem)] font-medium">
                      {vendor.location}
                    </span>
                  </div>

                  {vendor.specialty && (
                    <div className="flex items-center gap-2">
                      <Activity size={16} className="text-cyan" />
                      <span className="text-[clamp(.9rem,.45vw,1rem)] font-medium">
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
                    className="mt-6 flex flex-wrap gap-3"
                  >
                    {vendor.accreditation.map((item: string) => (
                      <span
                        key={item}
                        className="rounded-full border border-cyan/30 bg-cyan/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.18em] text-cyan backdrop-blur-md"
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
                  <div className="mb-8">
                    <p className="text-[11px] font-black uppercase tracking-[0.35em] text-cyan">
                      Organization Snapshot
                    </p>

                    <h3 className="mt-2 text-[clamp(1.6rem,1.3vw,2rem)] font-serif italic text-white">
                      At a Glance
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 xl:w-12 xl:h-12 rounded-2xl bg-cyan/10 flex items-center justify-center">
                        <Bed size={20} className="text-cyan" />
                      </div>

                      <div>
                        <p className="text-[clamp(1.55rem,1vw,2rem)] font-bold text-white">
                          {vendor.stats?.beds}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                          Beds
                        </p>
                      </div>
                    </div>

                    <div className="border-b border-white/10" />

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan/10 flex items-center justify-center">
                        <Users size={20} className="text-cyan" />
                      </div>

                      <div>
                        <p className="text-[clamp(1.75rem,1.2vw,2.25rem)] font-bold text-white">
                          {vendor.stats?.specialists}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                          Specialists
                        </p>
                      </div>
                    </div>

                    <div className="border-b border-white/10" />

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan/10 flex items-center justify-center">
                        <Building2 size={20} className="text-cyan" />
                      </div>

                      <div>
                        <p className="text-[clamp(1.75rem,1.2vw,2.25rem)] font-bold text-white">
                          {vendor.stats?.departments}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                          Departments
                        </p>
                      </div>
                    </div>

                    <div className="border-b border-white/10" />

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan/10 flex items-center justify-center">
                        <Globe size={20} className="text-cyan" />
                      </div>

                      <div>
                        <p className="text-[clamp(1.35rem,1vw,1.75rem)] font-bold text-white">
                          {vendor.stats?.countriesServed}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
                          Countries Served
                        </p>
                      </div>
                    </div>

                    <div className="border-b border-white/10" />

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-cyan/10 flex items-center justify-center">
                        <HeartPulse size={20} className="text-cyan" />
                      </div>

                      <div>
                        <p className="text-[clamp(1.35rem,1vw,1.75rem)] font-bold text-white">
                          {vendor.specialty}
                        </p>
                        <p className="text-[11px] uppercase tracking-[0.25em] text-white/50">
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
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 pt-8 lg:pt-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-10 xl:gap-12">
          {/* Left Column: Organization Summary */}
          <div className="space-y-8 md:space-y-12">
            <section className="bg-white p-8 md:p-12 xl:p-16 rounded-[2.5rem] md:rounded-[3rem] shadow-sm border border-navy/5">
              <div className="flex items-center gap-3 mb-8 md:mb-10">
                <div className="w-10 h-10 rounded-2xl bg-slate-bg flex items-center justify-center">
                  <Globe2 className="text-navy/40" size={18} />
                </div>
                <h2 className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.4em] text-navy">
                  Corporate Profile
                </h2>
              </div>
              <p className="max-w-4xl text-[clamp(1.1rem,1vw,1.3rem)] leading-9 text-slate-600 font-normal">
                {vendor.description}
              </p>
              <div className="mt-10 flex items-center gap-4">
                <div className="h-px w-20 bg-cyan" />
                <div className="h-px flex-1 bg-slate-200" />
              </div>
            </section>

            {vendor.fullServices && vendor.fullServices.length > 0 && (
              <section className="bg-white rounded-[2.5rem] md:rounded-[3rem] border border-slate-200/70 shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 px-8 md:px-12 pt-8 md:pt-10 pb-6 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-slate-bg flex items-center justify-center">
                    <BriefcaseMedical className="text-navy/40" size={18} />
                  </div>
                  <h2 className="text-sm md:text-base font-semibold uppercase tracking-[0.25em] text-navy">
                    Specialized Services
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-8 md:px-12 pb-10">
                  {vendor.fullServices.map((service: string, idx: number) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -3 }}
                      transition={{ duration: 0.25 }}
                      className="flex items-center gap-3 p-4 md:p-6 rounded-2xl md:rounded-3xl bg-slate-bg"
                    >
                      <div className="flex items-center gap-5">
                        <span className="h-2.5 w-2.5 flex-shrink-0 rounded-full bg-cyan"></span>

                        <span className="text-base font-semibold text-navy">
                          {service}
                        </span>
                      </div>

                      <ChevronRight
                        size={16}
                        className="text-slate-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-cyan"
                      />
                    </motion.div>
                  ))}
                </div>
              </section>
            )}

            {vendor.accreditation && vendor.accreditation.length > 0 && (
              <section className="bg-white rounded-[2.5rem] md:rounded-[3rem] border border-slate-200/70 shadow-sm overflow-hidden">
                <div className="flex items-center gap-4 px-8 md:px-12 pt-8 md:pt-10 pb-6 border-b border-slate-100">
                  <div className="w-10 h-10 rounded-2xl bg-slate-bg flex items-center justify-center">
                    <ShieldCheck className="text-navy/40" size={18} />
                  </div>
                  <h2 className="text-sm md:text-base font-semibold uppercase tracking-[0.25em] text-navy">
                    Accreditation & Badges
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-8 md:px-12 pb-10">
                  {vendor.accreditation.map((badge: string, idx: number) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between rounded-[1.75rem] bg-slate-50 border border-slate-100 px-6 h-16 transition-all duration-300 hover:bg-white hover:border-cyan/20 hover:shadow-xl hover:shadow-cyan/5 cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-xl bg-cyan/10 flex items-center justify-center">
                          <Award size={16} className="text-cyan" />
                        </div>

                        <span className="font-semibold text-navy">{badge}</span>
                      </div>

                      <ChevronRight
                        size={16}
                        className="text-slate-300 transition-all duration-300 group-hover:text-cyan group-hover:translate-x-1"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Gallery Section */}
            {vendor.gallery && vendor.gallery.length > 0 && (
              <section className="space-y-8">
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-1.5 h-6 bg-brand-red rounded-full" />
                    <div>
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy">
                        Facility Gallery
                      </h2>
                      <p className="mt-2 text-sm text-slate-500">
                        Explore our facilities, technology and patient spaces.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
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
                      className="relative h-[240px] md:h-[320px] overflow-hidden rounded-[2rem] border border-slate-200 group"
                    >
                      <img
                        src={vendor.gallery[activeImage].imageUrl}
                        alt={vendor.gallery[activeImage].caption ?? "Facility"}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-8">
                        <motion.div
                          key={vendor.gallery[activeImage].id + "-caption"}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35 }}
                        >
                          {vendor.gallery[activeImage].caption && (
                            <p className="text-lg md:text-xl font-semibold text-white">
                              {vendor.gallery[activeImage].caption}
                            </p>
                          )}
                        </motion.div>
                      </div>
                    </motion.div>
                  </AnimatePresence>

                  {/* Thumbnail Grid */}
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                    {vendor.gallery.map((img, index) => (
                      <motion.div
                        key={img.id}
                        whileHover={{ scale: 0.98 }}
                        onClick={() => setActiveImage(index)}
                        className={`relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border border-slate-200 group ${
                          activeImage === index
                            ? "border-cyan ring-2 ring-cyan/30"
                            : "border-slate-200"
                        } group`}
                      >
                        <img
                          src={img.imageUrl}
                          alt={img.caption ?? `Gallery ${index + 1}`}
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
              <section className="relative overflow-hidden rounded-[3rem] bg-navy px-10 py-8 md:px-14 md:py-10">
                <div className="absolute inset-0 opacity-[0.03] noise pointer-events-none" />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="mb-8 flex items-center gap-4">
                    <div className="h-6 w-1 rounded-full bg-brand-red" />

                    <div>
                      <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white">
                        Patient Stories
                      </h2>

                      <p className="mt-2 text-sm text-white/50">
                        Experiences shared by patients who trusted this
                        organization.
                      </p>
                    </div>
                  </div>

                  {/* Testimonials */}
                  <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
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
                            className="flex h-[200px] flex-col justify-between rounded-[2rem] border border-white/10 bg-white/5 p-7 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-cyan/20 hover:bg-white/10"
                          >
                            <p className="text-base leading-7 font-serif italic text-white/90">
                              "{test.testimonial}"
                            </p>

                            <div className="flex items-center gap-4">
                              <div>
                                <p className="text-xs font-bold uppercase tracking-[0.25em] text-white">
                                  {test.patientName}
                                </p>

                                {test.country && (
                                  <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.35em] text-cyan">
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
                  <div className="mt-6 flex justify-center gap-3">
                    {vendor.testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTestimonial(index)}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          index === activeTestimonial
                            ? "w-8 bg-cyan"
                            : "w-2 bg-white/20 hover:bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* FAQ Section */}
            {vendor.faqs && vendor.faqs.length > 0 && (
              <section className="bg-white p-12 rounded-[3.5rem] shadow-sm border border-navy/5">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 rounded-2xl bg-cyan/10 flex items-center justify-center text-cyan">
                    <Target size={18} />
                  </div>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy">
                    Fulfillment Details
                  </h2>
                </div>
                <div className="space-y-6">
                  {vendor.faqs.map((faq: any, i: number) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="flex justify-between items-center mb-3">
                        <h4 className="text-sm font-bold text-navy group-hover:text-cyan transition-colors">
                          {faq.q || faq.question}
                        </h4>
                        <ChevronRight
                          size={14}
                          className="text-navy/20 group-hover:translate-x-1 transition-all"
                        />
                      </div>
                      <p className="text-xs text-navy/40 font-medium leading-relaxed">
                        {faq.a || faq.answer}
                      </p>
                      <div className="h-[1px] w-full bg-slate-bg mt-6" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: GMAA Concierge */}
          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[2rem] bg-navy p-7 text-white shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan text-white">
                  <HeartHandshake size={22} />
                </div>

                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-cyan">
                    GMAA Concierge
                  </p>

                  <h3 className="mt-1 text-2xl font-bold leading-tight">
                    Need Assistance?
                  </h3>
                </div>
              </div>

              <p className="mt-6 text-sm leading-7 text-white/70">
                Speak with a dedicated GMAA Care Coordinator for expert guidance
                and planning.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span className="text-sm">Free Case Review</span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span className="text-sm">24/7 dedicated support</span>
                </div>

                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} className="text-emerald-400" />
                  <span className="text-sm">Verified Organization</span>
                </div>
              </div>

              <button
                onClick={() => setShowEnquiryOptions(true)}
                className="mt-8 w-full rounded-2xl bg-cyan py-3 text-[10px] font-black uppercase tracking-[0.18em] text-navy transition hover:bg-white"
              >
                Request Consultation
              </button>

              {vendor.phone && (
                <a
                  href={`tel:${vendor.phone}`}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/20 bg-white/5 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-white transition hover:border-cyan hover:bg-white/10"
                >
                  <Phone size={15} />
                  Call
                </a>
              )}
            </div>

            <button className="w-full rounded-2xl border border-navy/10 bg-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] text-navy transition hover:bg-navy hover:text-white flex items-center justify-center gap-2">
              <Share2 size={15} />
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
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
              className="relative w-full max-w-xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              <div className="p-8 md:p-12">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h3 className="text-2xl font-serif italic text-navy">
                      Connect with {vendor.name}
                    </h3>
                    <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mt-1">
                      CHOOSE HOW YOU'D LIKE TO PROCEED
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowEnquiryOptions(false);
                    }}
                    className="w-10 h-10 rounded-full bg-slate-bg flex items-center justify-center text-navy/40 hover:text-brand-red transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      onClick={() => {
                        setShowEnquiryOptions(false);

                        onEnquire?.({
                          vendorId: vendor.id,
                          vendorName: vendor.name,
                        });
                      }}
                      className="group p-6 rounded-3xl border border-navy/5 bg-slate-bg hover:bg-brand-red transition-all duration-500 text-left"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-navy group-hover:text-brand-red transition-colors mb-4">
                        <Calendar size={24} />
                      </div>
                      <h4 className="text-sm font-bold text-navy group-hover:text-white transition-colors">
                        Request Consultation
                      </h4>
                      <p className="text-[10px] text-navy/40 group-hover:text-white/60 font-medium mt-1 leading-relaxed">
                        Submit your requirements and a GMAA coordinator will
                        connect you with this provider.
                      </p>
                    </button>

                    <div className="md:col-span-1 rounded-3xl bg-navy p-6 text-white">
                      <div className="flex h-full flex-col justify-between">
                        <div className="flex items-start gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-cyan">
                            <Phone size={24} />
                          </div>

                          <div className="min-w-0">
                            <h4 className="text-base font-bold">
                              Speak With GMAA
                            </h4>

                            <p className="mt-2 text-xs leading-5 text-white/60">
                              Speak with a GMAA Team for immediate assistance.
                            </p>
                          </div>
                        </div>

                        <a
                          href="tel:+91XXXXXXXXXX"
                          className="flex w-full items-center justify-center rounded-2xl bg-brand-red py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition hover:bg-white hover:text-brand-red"
                        >
                          Call GMAA
                        </a>
                      </div>
                    </div>
                  </div>
                  <p className="mt-8 text-center text-xs leading-6 text-navy/50">
                    All consultations are coordinated by GMAA to ensure you're
                    connected with the most appropriate verified healthcare
                    provider.
                  </p>
                </>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Final CTA */}
      <section className="mt-10 relative overflow-hidden rounded-[3rem] bg-navy px-8 py-16 md:px-16 md:py-20">
        <div className="absolute inset-0 opacity-[0.03] noise pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center"
        >
          <div className="mb-6 h-1 w-20 rounded-full bg-brand-red" />

          <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.45em] text-cyan">
            Start Your Journey
          </p>

          <h2 className="max-w-3xl font-serif text-4xl italic leading-tight text-white md:text-6xl">
            Ready to Begin Your
            <br />
            Healthcare Journey?
          </h2>

          <p className="mt-8 max-w-2xl text-base leading-8 text-white/60">
            Connect with our care coordination team to discuss your treatment
            requirements, receive personalized guidance, and take the next step
            with confidence.
          </p>

          <div className="mt-12 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={() =>
                onEnquire?.({
                  category: vendor.mainCategory,
                  vendorId: vendor.id,
                  vendorName: vendor.name,
                })
              }
              className="rounded-full bg-cyan px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-navy transition-all duration-300 hover:-translate-y-1 hover:bg-white"
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
              className="rounded-full border border-white/20 px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:border-cyan hover:bg-white/5"
            >
              Back to Top
            </button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
