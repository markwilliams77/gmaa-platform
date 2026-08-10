import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Building2,
  Stethoscope,
  FileCheck,
  UserCircle2,
  ChevronRight,
  ChevronLeft,
  Check,
  CloudUpload,
  Globe,
  MapPin,
  ShieldCheck,
  Zap,
  Activity,
} from "lucide-react";
import { cn } from "../lib/utils";
import { backendApi } from "../services/backendApi";
import { VENDOR_CATEGORIES } from "../constants/vendorCategories";
import Select from "react-select";
import { Country, State, City } from "country-state-city";
import ReactCountryFlag from "react-country-flag";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
declare global {
  interface Window {
    Razorpay: any;
  }
}

const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );

    if (existingScript) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";

    script.onload = () => resolve(true);

    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

interface Step {
  id: number;
  title: string;
  description: string;
  icon: any;
}

const STEPS: Step[] = [
  {
    id: 1,
    title: "Identity",
    description: "Organization profile",
    icon: Building2,
  },
  {
    id: 2,
    title: "Expertise",
    description: "Medical specializations",
    icon: Stethoscope,
  },
  {
    id: 3,
    title: "Success Plan",
    description: "Growth tier selection",
    icon: Zap,
  },
  {
    id: 4,
    title: "Account Created",
    description: "Portal access generated",
    icon: ShieldCheck,
  },
];

export default function VendorOnboarding({
  onComplete,
  onCancel,
}: {
  onComplete: () => void;
  onCancel: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    orgName: "",
    country: "",
    state: "",
    city: "",
    address: "",
    email: "",
    contactPerson: "",
    contactNumber: "",
    mainCategory: VENDOR_CATEGORIES[0].mainCategory,
    subCategory: VENDOR_CATEGORIES[0].subCategories[0].name,
    specialties: [] as string[],
    plan: "Standard" as "Standard" | "Pro" | "Premium",
  });

  const selectedCategory =
    VENDOR_CATEGORIES.find((c) => c.mainCategory === formData.mainCategory) ||
    VENDOR_CATEGORIES[0];

  const selectedSubCategory =
    selectedCategory.subCategories.find(
      (s) => s.name === formData.subCategory,
    ) || selectedCategory.subCategories[0];

  const countryOptions = Country.getAllCountries().map((country) => ({
    value: country.name,
    label: country.name,
    isoCode: country.isoCode,
  }));

  const selectedCountry = Country.getAllCountries().find(
    (country) => country.name === formData.country,
  );

  const stateOptions = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.isoCode).map((state) => ({
        value: state.name,
        label: state.name,
      }))
    : [];

  const selectedState = selectedCountry
    ? State.getStatesOfCountry(selectedCountry.isoCode).find(
        (state) => state.name === formData.state,
      )
    : undefined;

  const cityOptions =
    selectedCountry && selectedState
      ? City.getCitiesOfState(
          selectedCountry.isoCode,
          selectedState.isoCode,
        ).map((city) => ({
          value: city.name,
          label: city.name,
        }))
      : [];

  const [vendorCredentials, setVendorCredentials] = useState<{
    username: string;
    password: string;
  } | null>(null);

  const nextStep = async () => {
    if (currentStep === 3) {
      try {
        console.log("Creating vendor onboarding...");

        const onboarding = await backendApi.createVendorOnboarding({
          orgName: formData.orgName,

          country: formData.country,
          state: formData.state,
          city: formData.city,
          address: formData.address,

          email: formData.email,
          contactPerson: formData.contactPerson,
          contactNumber: formData.contactNumber,

          mainCategory: formData.mainCategory,
          subCategory: formData.subCategory,
          specialties: formData.specialties,
          plan: formData.plan,
        });

        localStorage.setItem("vendorOnboardingId", onboarding.id);

        console.log("Vendor onboarding created:", onboarding);

        const order = await backendApi.createVendorOrder(onboarding.id);
        console.log("Payment order created:", order);
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          alert("Failed to load Razorpay");
          return;
        }

        console.log("Razorpay script loaded");

        const options = {
          key: order.razorpayKeyId,
          amount: order.amount,
          currency: order.currency,
          name: "Global Medical Assistance Alliance",
          description: `${formData.plan} Vendor Subscription`,
          order_id: order.orderId,

          handler: async (response: any) => {
            try {
              const verification = await backendApi.verifyVendorPayment(
                onboarding.id,
                {
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                },
              );

              console.log("Payment verified:", verification);

              const generatedPassword = Math.random().toString(36).slice(-10);
              const loginInfo = await backendApi.createVendorLogin(
                onboarding.id,
                generatedPassword,
              );
              console.log("Vendor login created:", loginInfo);
              console.log("Generated Password:", generatedPassword);
              setVendorCredentials({
                username: loginInfo.username,
                password: generatedPassword,
              });
              setCurrentStep(4);
              console.log("Stored Credentials:", {
                username: loginInfo.username,
                password: generatedPassword,
              });
            } catch (error) {
              console.error("Payment verification failed:", error);
            }
          },

          prefill: {
            name: formData.contactPerson,
            email: formData.email,
            contact: formData.contactNumber,
          },

          theme: { color: "#0B1F3A" },
        };

        const razorpay = new window.Razorpay(options);

        razorpay.open();

        return;
      } catch (error) {
        console.error(error);
        alert(error instanceof Error ? error.message : "Something went wrong");
        return;
      }
    }

    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const toggleSpecialty = (item: string) => {
    const list = formData.specialties;
    const newList = list.includes(item)
      ? list.filter((i) => i !== item)
      : [...list, item];
    setFormData((prev) => ({ ...prev, specialties: newList }));
  };

  const plans = [
    {
      name: "Standard",
      price: "50000",
      features: ["Basic Registry Listing", "Email Support", "5 Tender Bids/Mo"],
    },
    {
      name: "Pro",
      price: "150000",
      features: [
        "Featured Listing",
        "Priority Support",
        "Unlimited Tender Bids",
        "Analytics Dashboard",
      ],
    },
    {
      name: "Premium",
      price: "200000",
      features: [
        "Global Homepage Feature",
        "Dedicated Account Manager",
        "Custom Procurement API",
        "VIP Event Access",
      ],
    },
  ];

  const formatCountryOption = (option: any) => (
    <div className="flex items-center gap-3">
      <ReactCountryFlag
        countryCode={option.isoCode}
        svg
        style={{
          width: "1.2em",
          height: "1.2em",
        }}
      />

      <span>{option.label}</span>
    </div>
  );

  const locationSelectStyles = {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: 64,
      backgroundColor: "#F1F5F9",
      border: "none",
      borderRadius: 16,
      boxShadow: state.isFocused ? "0 0 0 2px rgba(34,211,238,.35)" : "none",
      paddingLeft: 8,
      fontWeight: 700,
      cursor: "pointer",

      "&:hover": {
        border: "none",
      },
    }),

    valueContainer: (base: any) => ({
      ...base,
      padding: "0 10px",
    }),

    input: (base: any) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),

    placeholder: (base: any) => ({
      ...base,
      color: "#94A3B8",
      fontWeight: 600,
    }),

    singleValue: (base: any) => ({
      ...base,
      color: "#0A2647",
      fontWeight: 700,
    }),

    indicatorSeparator: () => ({
      display: "none",
    }),

    dropdownIndicator: (base: any) => ({
      ...base,
      color: "#94A3B8",

      "&:hover": {
        color: "#06B6D4",
      },
    }),

    menu: (base: any) => ({
      ...base,
      borderRadius: 20,
      overflow: "hidden",
      border: "1px solid #E2E8F0",
      boxShadow: "0 15px 35px rgba(0,0,0,.08)",
    }),

    menuList: (base: any) => ({
      ...base,
      padding: 8,
    }),

    option: (base: any, state: any) => ({
      ...base,
      borderRadius: 12,
      padding: "14px 16px",
      fontWeight: 600,
      cursor: "pointer",

      backgroundColor: state.isSelected
        ? "#0A2647"
        : state.isFocused
          ? "#ECFEFF"
          : "white",

      color: state.isSelected ? "white" : "#0A2647",
    }),
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#F3F4F6] overflow-y-auto p-4 lg:p-8">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-red/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-5xl min-h-fit bg-white rounded-[40px] shadow-2xl border border-navy/5 relative overflow-hidden mx-auto my-6"
      >
        <div className="grid lg:grid-cols-12 h-auto">
          {/* Left: Progress Sidebar */}
          <div className="lg:col-span-4 bg-[#0A2647] p-12 text-white relative flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-14">
                <div className="w-10 h-10 bg-brand-red rounded-2xl flex items-center justify-center font-bold text-white shadow-lg shadow-brand-red/20 transition-transform hover:scale-110">
                  M
                </div>
                <span className="text-white font-bold tracking-[0.3em] text-[10px] uppercase">
                  GLOBAL MAA
                </span>
              </div>
              <h2 className="text-[clamp(1.10rem,2vw,2rem)] font-light uppercase tracking-tight mb-6 leading-[0.9]">
                Institutional <br />
                <span className="font-serif italic font-medium text-gradient pr-1">
                  Registration
                </span>
              </h2>

              <div className="space-y-10">
                {STEPS.map((step) => (
                  <div key={step.id} className="flex gap-6 group">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500",
                          currentStep === step.id
                            ? "bg-cyan shadow-xl shadow-cyan/40 scale-110"
                            : currentStep > step.id
                              ? "bg-emerald-500 shadow-lg shadow-emerald-500/20"
                              : "bg-white/10",
                        )}
                      >
                        {currentStep > step.id ? (
                          <Check size={18} />
                        ) : (
                          <step.icon size={18} />
                        )}
                      </div>
                      {step.id !== STEPS.length && (
                        <div
                          className={cn(
                            "w-0.5 h-10 my-3 transition-colors duration-500",
                            currentStep > step.id
                              ? "bg-emerald-500"
                              : "bg-white/10",
                          )}
                        />
                      )}
                    </div>
                    <div className="pt-2">
                      <h4
                        className={cn(
                          "text-[10px] font-bold uppercase tracking-widest transition-colors leading-none",
                          currentStep === step.id
                            ? "text-white"
                            : "text-white/40",
                        )}
                      >
                        {step.title}
                      </h4>
                      <p className="text-[10px] text-white/20 mt-2 font-medium">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-12">
              <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-cyan mb-2 flex items-center gap-2">
                  <ShieldCheck size={12} fill="currentColor" /> GMAA
                  Verification
                </p>
                <p className="text-[10px] text-white/40 leading-relaxed uppercase font-bold">
                  Your security is our priority. All documents are verified by
                  human agents.
                </p>
              </div>
            </div>
          </div>

          {/* Right: Form Content */}
          <div className="lg:col-span-8 p-8 lg:p-12 relative flex flex-col">
            <button
              onClick={onCancel}
              className="absolute top-8 right-8 text-navy/20 hover:text-brand-red transition-colors uppercase text-[10px] font-black tracking-widest"
            >
              Exit
            </button>

            <div className="flex-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-12"
                >
                  {/* Step Header */}
                  <div>
                    <span className="text-cyan text-[10px] font-bold uppercase tracking-[0.4em]">
                      Step 0{currentStep} of 0{STEPS.length}
                    </span>
                    <h3 className="text-5xl font-light text-navy uppercase tracking-tighter mt-4 leading-none">
                      {STEPS.find((s) => s.id === currentStep)?.title}
                    </h3>
                  </div>

                  {/* Step 1: Basic Details */}
                  {currentStep === 1 && (
                    <div className="grid grid-cols-2 gap-8">
                      {/* Organisation Name */}

                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest px-1">
                          Organisation Name
                        </label>

                        <input
                          type="text"
                          placeholder="Global Health General Hospital"
                          className="w-full bg-slate-100 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-cyan/50"
                          value={formData.orgName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              orgName: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Street Address */}

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest px-1">
                          Street Address
                        </label>

                        <input
                          type="text"
                          placeholder="123 Medic Street"
                          className="w-full bg-slate-100 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-cyan/50"
                          value={formData.address}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              address: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Country */}

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest px-1">
                          Country
                        </label>

                        <Select
                          options={countryOptions}
                          placeholder="Select Country"
                          value={
                            countryOptions.find(
                              (option) => option.value === formData.country,
                            ) || null
                          }
                          onChange={(selected) =>
                            setFormData({
                              ...formData,
                              country: selected?.value || "",
                              state: "",
                              city: "",
                            })
                          }
                          className="text-sm"
                          classNamePrefix="location"
                          formatOptionLabel={formatCountryOption}
                          getOptionValue={(option) => option.value}
                          styles={locationSelectStyles}
                        />
                      </div>

                      {/* State */}

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest px-1">
                          State / Province
                        </label>

                        <Select
                          options={stateOptions}
                          placeholder="Select State / Province"
                          isDisabled={!formData.country}
                          value={
                            stateOptions.find(
                              (option) => option.value === formData.state,
                            ) || null
                          }
                          onChange={(selected) =>
                            setFormData({
                              ...formData,
                              state: selected?.value || "",
                              city: "",
                            })
                          }
                          className="text-sm"
                          classNamePrefix="location"
                          styles={locationSelectStyles}
                        />
                      </div>

                      {/* City */}

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest px-1">
                          City
                        </label>

                        <Select
                          options={cityOptions}
                          placeholder="Select City"
                          isDisabled={!formData.state}
                          value={
                            cityOptions.find(
                              (option) => option.value === formData.city,
                            ) || null
                          }
                          onChange={(selected) =>
                            setFormData({
                              ...formData,
                              city: selected?.value || "",
                            })
                          }
                          className="text-sm"
                          classNamePrefix="location"
                          styles={locationSelectStyles}
                        />
                      </div>

                      {/* Email */}

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest px-1">
                          Organisation Email
                        </label>

                        <input
                          type="email"
                          placeholder="e.g. contact@organisation.com"
                          className="w-full bg-slate-100 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-cyan/50"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              email: e.target.value,
                            })
                          }
                        />
                      </div>

                      {/* Phone */}

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest px-1">
                          Contact Number
                        </label>

                        <PhoneInput
                          international
                          defaultCountry={selectedCountry?.isoCode as any}
                          placeholder="Enter contact number"
                          value={formData.contactNumber}
                          onChange={(value) =>
                            setFormData({
                              ...formData,
                              contactNumber: value || "",
                            })
                          }
                          className="w-full bg-slate-100 rounded-2xl px-5 py-4 text-sm font-bold"
                        />
                      </div>

                      {/* Contact Person */}

                      <div className="col-span-2 space-y-2">
                        <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest px-1">
                          Contact Person
                        </label>

                        <input
                          type="text"
                          placeholder=" "
                          className="w-full bg-slate-100 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-cyan/50"
                          value={formData.contactPerson}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              contactPerson: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                  {/* Step 2: Expertise */}
                  {currentStep === 2 && (
                    <div className="space-y-10">
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest px-1">
                            Main Category
                          </label>
                          <select
                            value={formData.mainCategory}
                            disabled={!formData.mainCategory}
                            onChange={(e) => {
                              const category = VENDOR_CATEGORIES.find(
                                (c) => c.mainCategory === e.target.value,
                              );
                              setFormData({
                                ...formData,
                                mainCategory: e.target.value,
                                subCategory:
                                  category?.subCategories[0]?.name ?? "",
                                specialties: [],
                              });
                            }}
                            className="w-full bg-slate-100 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-cyan/50"
                          >
                            {VENDOR_CATEGORIES.map((category) => (
                              <option
                                key={category.mainCategory}
                                value={category.mainCategory}
                              >
                                {category.mainCategory}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest px-1">
                            Sub Category
                          </label>

                          <select
                            value={formData.subCategory}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                subCategory: e.target.value,
                                specialties: [],
                              })
                            }
                            className="w-full bg-slate-100 border-none rounded-2xl p-5 text-sm font-bold focus:ring-2 focus:ring-cyan/50"
                          >
                            {selectedCategory.subCategories.map(
                              (subCategory) => (
                                <option
                                  key={subCategory.name}
                                  value={subCategory.name}
                                >
                                  {subCategory.name}
                                </option>
                              ),
                            )}
                          </select>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="text-[10px] font-black uppercase text-navy/40 tracking-widest px-1">
                          Medical Specializations
                        </label>
                        <div className="max-h-80 overflow-y-auto pr-2">
                          <div className="grid grid-cols-2 gap-3">
                            {selectedSubCategory.specialties.map((item) => (
                              <button
                                key={item}
                                onClick={() => toggleSpecialty(item)}
                                className={cn(
                                  "p-5 rounded-2xl border-2 text-left transition-all flex items-center justify-between",
                                  formData.specialties.includes(item)
                                    ? "border-navy bg-navy text-white shadow-xl shadow-navy/20"
                                    : "border-slate-50 bg-slate-50/50 hover:border-navy/10",
                                )}
                              >
                                <span className="text-[9px] font-black uppercase tracking-widest">
                                  {item}
                                </span>
                                <div
                                  className={cn(
                                    "w-4 h-4 rounded border flex items-center justify-center transition-all",
                                    formData.specialties.includes(item)
                                      ? "bg-white/20 border-white/40"
                                      : "border-slate-300",
                                  )}
                                >
                                  {formData.specialties.includes(item) && (
                                    <Check size={10} />
                                  )}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Success Plan */}
                  {currentStep === 3 && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-3 gap-6">
                        {plans.map((p) => (
                          <button
                            key={p.name}
                            onClick={() =>
                              setFormData({ ...formData, plan: p.name as any })
                            }
                            className={cn(
                              "relative p-8 rounded-[32px] border-2 text-left transition-all h-full flex flex-col",
                              formData.plan === p.name
                                ? "border-brand-red bg-white shadow-2xl scale-[1.02]"
                                : "border-slate-100 bg-slate-50/50 grayscale opacity-60 hover:grayscale-0 hover:opacity-100",
                            )}
                          >
                            {formData.plan === p.name && (
                              <div className="absolute top-4 right-4 w-6 h-6 bg-brand-red rounded-full flex items-center justify-center text-white">
                                <Check size={14} />
                              </div>
                            )}
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-navy/40 mb-2">
                              {p.name} PLAN
                            </h4>
                            <div className="flex items-baseline gap-1 mb-8">
                              <span className="text-3xl font-black text-navy">
                                ₹{p.price}
                              </span>
                              <span className="text-[8px] font-bold text-navy/40 uppercase">
                                INR / One-time
                              </span>
                            </div>

                            <div className="space-y-4 flex-1">
                              {p.features.map((f, i) => (
                                <div key={i} className="flex gap-2 items-start">
                                  <Check
                                    size={10}
                                    className="text-emerald-500 mt-1 shrink-0"
                                  />
                                  <span className="text-[9px] font-bold text-navy/60 uppercase leading-tight">
                                    {f}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="bg-navy rounded-3xl p-8 text-white flex items-center justify-between">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 mb-1">
                            Secured Checkout via Stripe
                          </p>
                          <h4 className="text-[clamp(1rem,0.5vw+0.9rem,1.125rem)] font-black uppercase tracking-tighter">
                            GMAA Institutional Enrollment
                          </h4>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                            Total Due
                          </p>
                          <p className="text-2xl font-black">
                            ₹
                            {plans.find((p) => p.name === formData.plan)?.price}{" "}
                            INR
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Account Created */}
                  {currentStep === 4 && (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                      <div className="w-24 h-24 bg-cyan/10 rounded-[40px] flex items-center justify-center text-cyan mb-8">
                        <ShieldCheck size={48} />
                      </div>

                      <h3 className="text-[clamp(2rem,4vw,4rem)] font-bold text-navy uppercase tracking-tighter mb-4">
                        Registration
                        <br />
                        Successful
                      </h3>

                      <p className="text-xs font-bold text-navy/40 uppercase tracking-widest max-w-xl leading-relaxed mb-10">
                        Your organisation has been successfully registered with
                        <span className="text-cyan"> Global MAA</span>. Login
                        credentials will be delivered to your registered email
                        address.
                      </p>

                      <div className="w-full max-w-2xl bg-slate-50 rounded-[32px] p-8 border border-slate-100 text-left">
                        {vendorCredentials && (
                          <div className="mb-8 bg-white rounded-2xl p-6 border border-cyan/20">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan mb-4">
                              Vendor Portal Credentials
                            </h4>

                            <div className="space-y-3">
                              <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-navy/40">
                                  Username
                                </p>

                                <p className="font-black text-navy">
                                  {vendorCredentials.username}
                                </p>
                              </div>

                              <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-navy/40">
                                  Temporary Password
                                </p>

                                <p className="font-black text-navy">
                                  {vendorCredentials.password}
                                </p>
                              </div>

                              <p className="text-[9px] font-bold uppercase tracking-widest text-amber-600">
                                Save these credentials. They will also be sent
                                to your email.
                              </p>
                            </div>
                          </div>
                        )}

                        <div className="space-y-4">
                          <div className="flex gap-4 items-start">
                            <div className="w-6 h-6 rounded-full bg-navy text-white flex items-center justify-center text-[10px] font-black">
                              1
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-navy/60">
                              Login to your Vendor Portal
                            </p>
                          </div>

                          <div className="flex gap-4 items-start">
                            <div className="w-6 h-6 rounded-full bg-navy text-white flex items-center justify-center text-[10px] font-black">
                              2
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-navy/60">
                              Upload business and accreditation documents
                            </p>
                          </div>

                          <div className="flex gap-4 items-start">
                            <div className="w-6 h-6 rounded-full bg-navy text-white flex items-center justify-center text-[10px] font-black">
                              3
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-navy/60">
                              Await GMAA compliance review
                            </p>
                          </div>

                          <div className="flex gap-4 items-start">
                            <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black">
                              4
                            </div>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-navy/60">
                              Profile published in Global Directory after
                              approval
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="mt-16 flex items-center justify-between pt-12 border-t border-slate-100">
              {currentStep < STEPS.length ? (
                <>
                  <button
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className={cn(
                      "flex items-center gap-3 text-xs font-black uppercase tracking-widest transition-all",
                      currentStep === 1
                        ? "opacity-0 pointer-events-none"
                        : "text-navy hover:text-cyan",
                    )}
                  >
                    <ChevronLeft size={18} /> Previous
                  </button>

                  <button
                    onClick={nextStep}
                    className="bg-navy text-white px-12 py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-navy/20 group"
                  >
                    {currentStep === 3 ? "Commit & Pay" : "Next Step"}
                    <ChevronRight
                      className="inline-block ml-2 group-hover:translate-x-1 transition-transform"
                      size={18}
                    />
                  </button>
                </>
              ) : (
                <button
                  onClick={onComplete}
                  className="w-full bg-navy text-white py-6 rounded-2xl font-black uppercase tracking-[0.4em] text-xs hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-navy/20"
                >
                  Establish Connection
                </button>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function Plus({ size, className }: { size: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function CheckCircle({
  size,
  className,
}: {
  size: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
