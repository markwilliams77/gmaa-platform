import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  MessageCircle,
  X,
  ArrowRight,
  Send,
  CheckCircle2,
  Phone,
  Briefcase,
  MapPin,
  Clock3,
} from "lucide-react";
import { backendApi } from "../services/backendApi";
import { CONSULTATION_CATEGORIES } from "../constants/consultationCategories";
import ReactCountryFlag from "react-country-flag";
import { detectCountryFromDialCode } from "../utils/phone";
import { isValidPhoneNumber } from "libphonenumber-js";

interface LeadCaptureProps {
  externalOpen?: boolean;
  onClose?: () => void;

  initialCategory?: string;
  initialVendorId?: string;
  initialVendorName?: string;
}

export default function LeadCapture({
  externalOpen,
  onClose,
  initialCategory,
  initialVendorId,
  initialVendorName,
}: LeadCaptureProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    category: "",

    name: "",
    email: "",
    phone: "",

    dynamicFields: {} as Record<string, string>,

    vendorId: "",
    vendorName: "",

    region: "",
  });

  const selectedCategory = CONSULTATION_CATEGORIES.find(
    (c) => c.id === formData.category,
  );

  const detectedCountry = detectCountryFromDialCode(formData.phone);
  const showFlag =
    detectedCountry !== undefined &&
    formData.phone.replace(/\D/g, "").length >= 2;

  const isOpen = externalOpen !== undefined ? externalOpen : internalOpen;

  useEffect(() => {
    if (!isOpen) return;

    setStep(1);
    setIsSubmitted(false);

    setFormData((prev) => ({
      ...prev,
      category: initialCategory ?? "",
      vendorId: initialVendorId ?? "",
      vendorName: initialVendorName ?? "",
    }));
  }, [isOpen, initialCategory, initialVendorId, initialVendorName]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalOpen(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await backendApi.submitConsultation({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,

        category: formData.category,

        vendorId: formData.vendorId,

        vendorName: formData.vendorName,

        service: formData.dynamicFields.service ?? "",

        region: formData.dynamicFields.region ?? "",

        details: formData.dynamicFields,

        status: "new",
      });

      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        handleClose();
        setStep(1);
      }, 3000);
    } catch (error) {
      console.error("Error saving consultation:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Sticky Trigger - only show if not externally controlled */}
      {externalOpen === undefined && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setInternalOpen(true)}
          className="fixed bottom-12 right-12 z-[60] bg-navy text-white p-2 rounded-full shadow-2xl shadow-navy/40 flex items-center gap-1 group overflow-hidden"
        >
          <div className="w-14 h-14 bg-navy rounded-full flex items-center justify-center transition-transform duration-500 group-hover:rotate-12 border border-white/10">
            <MessageCircle size={24} className="text-brand-red animate-pulse" />
          </div>
          <span className="mixed-caps px-6 font-black tracking-[0.3em] text-white opacity-100 hidden md:block">
            Registry Access
          </span>
        </motion.button>
      )}

      {/* Multi-step Form Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-6 sm:p-12">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="absolute inset-0 bg-navy/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-3xl border border-white/10 bg-white shadow-[0_50px_100px_rgba(10,17,31,0.5)] md:rounded-[48px]"
            >
              {/* Noise Texture */}
              <div className="absolute inset-0 noise opacity-[0.03] pointer-events-none" />

              <button
                onClick={handleClose}
                className="absolute top-6 right-6 md:top-10 md:right-10 p-2 md:p-3 rounded-full hover:bg-navy/5 text-navy group transition-all z-20"
              >
                <X
                  size={20}
                  className="md:size-6 group-hover:rotate-90 transition-transform"
                />
              </button>

              <div className="relative z-10 flex-1 overflow-y-auto p-6 md:p-12 lg:p-16">
                {isSubmitted ? (
                  <div className="py-10 md:py-20 text-center space-y-6 md:space-y-10">
                    <motion.div
                      initial={{ scale: 0, rotate: -45 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className="w-20 h-20 md:w-32 md:h-32 bg-brand-red/10 text-brand-red rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-brand-red/10"
                    >
                      <CheckCircle2
                        size={40}
                        className="md:size-16"
                        strokeWidth={1}
                      />
                    </motion.div>
                    <div>
                      <h3 className="text-3xl md:text-5xl font-serif italic mb-4 md:mb-6 pr-2">
                        Inquiry Received.
                      </h3>
                      <p className="text-sm md:text-xl text-navy/40 font-medium max-w-sm mx-auto leading-relaxed">
                        <p className="text-sm md:text-lg text-navy/50 font-medium max-w-xl mx-auto leading-8">
                          Your request has been received. A GMAA coordinator
                          will review your requirements and contact you shortly
                          to guide you through the next steps.
                        </p>

                        <div className="mt-10 space-y-4 max-w-md mx-auto">
                          <div className="flex items-center gap-4 rounded-2xl bg-slate-50 px-5 py-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                              <CheckCircle2 size={16} />
                            </div>

                            <span className="text-sm font-medium text-navy">
                              Consultation request received
                            </span>
                          </div>

                          <div className="flex items-center gap-4 rounded-2xl bg-slate-50 px-5 py-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                              <CheckCircle2 size={16} />
                            </div>

                            <span className="text-sm font-medium text-navy">
                              GMAA coordinator will review your case
                            </span>
                          </div>

                          <div className="flex items-center gap-4 rounded-2xl bg-slate-50 px-5 py-4">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                              <Clock3 size={16} />
                            </div>

                            <span className="text-sm font-medium text-navy">
                              We'll contact you shortly to discuss the next
                              steps
                            </span>
                          </div>
                        </div>
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-10 md:mb-16">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="h-1 w-8 rounded-full bg-brand-red" />

                        <span className="text-[10px] font-bold uppercase tracking-[0.35em] text-cyan">
                          GMAA CONSULTATION
                        </span>
                      </div>

                      <h3 className="text-[clamp(2rem,4vw,3.5rem)] font-light leading-tight tracking-tight text-navy">
                        Request a
                        <br />
                        <span className="font-serif italic">Consultation</span>
                      </h3>

                      <p className="mt-5 max-w-lg text-sm leading-7 text-slate-500">
                        Tell us what you need and our coordination team will
                        connect you with the most appropriate verified provider
                        across the GMAA network.
                      </p>
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      className="space-y-8 md:space-y-12"
                    >
                      <AnimatePresence mode="wait">
                        {step === 1 ? (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8"
                          >
                            <div>
                              <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-navy/40">
                                Consultation Category
                              </p>

                              <h4 className="mt-3 text-3xl font-serif italic text-navy">
                                What can we help you with?
                              </h4>

                              <p className="mt-3 text-sm text-navy/50">
                                Select the service you're looking for.
                              </p>
                            </div>

                            {formData.vendorName && (
                              <div className="rounded-2xl border border-cyan/20 bg-cyan/5 p-5">
                                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-cyan">
                                  Preferred Provider
                                </p>

                                <p className="mt-2 text-lg font-semibold text-navy">
                                  {formData.vendorName}
                                </p>

                                <p className="mt-1 text-sm text-navy/50">
                                  You can change the category below if your
                                  requirement is different.
                                </p>
                              </div>
                            )}

                            <div className="grid grid-cols-2 gap-4 max-h-[380px] overflow-y-auto pr-2">
                              {CONSULTATION_CATEGORIES.map((category) => {
                                const Icon = category.icon;

                                const active =
                                  formData.category === category.id;

                                return (
                                  <button
                                    key={category.id}
                                    type="button"
                                    onClick={() =>
                                      setFormData((prev) => ({
                                        ...prev,

                                        category: category.id,

                                        dynamicFields: {},

                                        vendorId:
                                          category.id === initialCategory
                                            ? prev.vendorId
                                            : "",

                                        vendorName:
                                          category.id === initialCategory
                                            ? prev.vendorName
                                            : "",
                                      }))
                                    }
                                    className={`rounded-3xl border p-5 text-left transition-all duration-300 ${
                                      active
                                        ? "border-cyan bg-cyan/5 shadow-lg"
                                        : "border-slate-200 hover:border-cyan/40 hover:shadow-md"
                                    }`}
                                  >
                                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100">
                                      <Icon size={24} className="text-navy" />
                                    </div>

                                    <h5 className="text-base font-bold text-navy">
                                      {category.label}
                                    </h5>

                                    <p className="mt-2 text-xs leading-5 text-slate-500">
                                      {category.description}
                                    </p>
                                  </button>
                                );
                              })}
                            </div>

                            <button
                              type="button"
                              onClick={() => setStep(2)}
                              disabled={!formData.category}
                              className="group relative w-full overflow-hidden rounded-full bg-navy py-6 text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-2xl transition-all disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <div className="absolute inset-0 -translate-x-full bg-brand-red transition-transform duration-700 group-hover:translate-x-0" />

                              <span className="relative z-10 flex items-center justify-center gap-4">
                                Continue
                                <ArrowRight
                                  size={14}
                                  className="transition-transform group-hover:translate-x-2"
                                />
                              </span>
                            </button>
                          </motion.div>
                        ) : (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-8 md:space-y-10"
                          >
                            <div className="grid gap-8 md:grid-cols-2">
                              <div className="space-y-2 border-b border-slate-200 pb-3">
                                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                                  Your Name
                                </label>

                                <input
                                  type="text"
                                  value={formData.name}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      name: e.target.value,
                                    })
                                  }
                                  placeholder="Full Name"
                                  className="w-full bg-transparent text-xl font-medium text-navy placeholder:text-slate-300 focus:outline-none"
                                  required
                                />
                              </div>

                              <div className="space-y-2 border-b border-slate-200 pb-3">
                                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                                  Email Address
                                </label>

                                <input
                                  type="email"
                                  value={formData.email}
                                  onChange={(e) =>
                                    setFormData({
                                      ...formData,
                                      email: e.target.value,
                                    })
                                  }
                                  placeholder="name@example.com"
                                  className="w-full bg-transparent text-xl font-medium text-navy placeholder:text-slate-300 focus:outline-none"
                                  required
                                />
                              </div>

                              <div className="space-y-2 border-b border-slate-200 pb-3 md:col-span-2">
                                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                                  Phone Number
                                </label>

                                <div className="flex items-center gap-4">
                                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50">
                                    {showFlag ? (
                                      <ReactCountryFlag
                                        countryCode={detectedCountry}
                                        svg
                                        style={{
                                          width: "26px",
                                          height: "26px",
                                        }}
                                      />
                                    ) : (
                                      <span className="text-xl">🌐</span>
                                    )}
                                  </div>

                                  <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) =>
                                      setFormData((prev) => ({
                                        ...prev,
                                        phone: e.target.value,
                                      }))
                                    }
                                    placeholder="+91 9876543210"
                                    className="flex-1 bg-transparent text-xl font-medium text-navy placeholder:text-slate-300 focus:outline-none"
                                    required
                                  />
                                </div>

                                <p className="text-xs text-slate-500">
                                  Include your country code (for example: +91,
                                  +44 or +971).
                                </p>

                                {formData.phone && !detectedCountry && (
                                  <p className="text-xs font-medium text-brand-red">
                                    Please enter a valid international phone
                                    number including the country code.
                                  </p>
                                )}
                              </div>
                            </div>

                            <div className="space-y-6">
                              {selectedCategory && (
                                <>
                                  <div>
                                    <label className="mb-5 block text-[10px] font-bold uppercase tracking-[0.35em] text-slate-400">
                                      {selectedCategory.label} Details
                                    </label>

                                    <div className="space-y-6">
                                      {selectedCategory.fields.map((field) => (
                                        <div
                                          key={field.key}
                                          className="space-y-2 border-b border-slate-200 pb-3"
                                        >
                                          <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
                                            {field.label}
                                          </label>

                                          {field.type === "textarea" ? (
                                            <textarea
                                              rows={4}
                                              value={
                                                formData.dynamicFields[
                                                  field.key
                                                ] ?? ""
                                              }
                                              onChange={(e) =>
                                                setFormData((prev) => ({
                                                  ...prev,
                                                  dynamicFields: {
                                                    ...prev.dynamicFields,
                                                    [field.key]: e.target.value,
                                                  },
                                                }))
                                              }
                                              className="w-full resize-none bg-transparent text-lg text-navy placeholder:text-slate-300 focus:outline-none"
                                            />
                                          ) : field.type === "select" ? (
                                            <select
                                              value={
                                                formData.dynamicFields[
                                                  field.key
                                                ] ?? ""
                                              }
                                              onChange={(e) =>
                                                setFormData((prev) => ({
                                                  ...prev,
                                                  dynamicFields: {
                                                    ...prev.dynamicFields,
                                                    [field.key]: e.target.value,
                                                  },
                                                }))
                                              }
                                              className="w-full bg-transparent text-lg text-navy focus:outline-none"
                                            >
                                              <option value="">Select</option>

                                              {field.options?.map((option) => (
                                                <option
                                                  key={option}
                                                  value={option}
                                                >
                                                  {option}
                                                </option>
                                              ))}
                                            </select>
                                          ) : (
                                            <input
                                              type={field.type}
                                              value={
                                                formData.dynamicFields[
                                                  field.key
                                                ] ?? ""
                                              }
                                              onChange={(e) =>
                                                setFormData((prev) => ({
                                                  ...prev,
                                                  dynamicFields: {
                                                    ...prev.dynamicFields,
                                                    [field.key]: e.target.value,
                                                  },
                                                }))
                                              }
                                              className="w-full bg-transparent text-lg text-navy placeholder:text-slate-300 focus:outline-none"
                                            />
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="flex gap-4 pt-4">
                              <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="flex-1 rounded-full border border-slate-200 py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500 transition hover:border-navy hover:text-navy"
                              >
                                Back
                              </button>

                              <button
                                type="submit"
                                disabled={
                                  loading ||
                                  !formData.name ||
                                  !formData.email ||
                                  !isValidPhoneNumber(formData.phone)
                                }
                                className="group relative flex-[2] overflow-hidden rounded-full bg-brand-red py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-xl transition disabled:opacity-50"
                              >
                                <div className="absolute inset-0 -translate-y-full bg-navy transition-transform duration-700 group-hover:translate-y-0" />

                                <span className="relative z-10 flex items-center justify-center gap-3">
                                  {loading
                                    ? "Submitting..."
                                    : "Request Consultation"}

                                  <Send size={15} />
                                </span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>

                    <div className="mt-12 rounded-2xl bg-slate-50 p-5 text-center">
                      <p className="text-xs leading-6 text-slate-500">
                        Your consultation request will be reviewed by the GMAA
                        coordination team and routed to the most appropriate
                        verified provider based on your requirements.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
