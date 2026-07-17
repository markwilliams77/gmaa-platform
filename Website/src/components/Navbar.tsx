import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  User,
  Building2,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "./AuthContext";
import DropdownMenu from "./DropdownMenu";

interface NavbarProps {
  portal?: "patient" | "vendor";
  onPortalChange?: (p: "patient" | "vendor") => void;
  currentView?:
    | "home"
    | "about"
    | "vendors"
    | "insights"
    | "admin"
    | "directory";
  onViewChange?: (
    v: "home" | "about" | "vendors" | "insights" | "admin" | "directory",
  ) => void;
  onLogout?: () => void;
  onLogin?: () => void;
  onClientAccess?: () => void;
  isAdminView?: boolean;
}

const NAV_ITEMS = [
  {
    label: "Services",
    children: [
      {
        title: "Healthcare Access",
        description:
          "Consultations, second opinions, care coordination and patient navigation.",
        href: "/services/healthcare-access",
      },
      {
        title: "Medical Procurement",
        description:
          "Equipment, devices, consumables and pharmaceutical sourcing.",
        href: "/services/medical-procurement",
      },
      {
        title: "Healthcare Infrastructure",
        description:
          "Hospital development, turnkey projects and healthcare facility solutions.",
        href: "/services/healthcare-infrastructure",
      },
      {
        title: "Healthcare Workforce",
        description:
          "Healthcare recruitment, staffing and workforce development.",
        href: "/services/healthcare-workforce",
      },
      {
        title: "Digital Health",
        description:
          "Telemedicine, AI, healthcare software and digital transformation.",
        href: "/services/digital-health",
      },
      {
        title: "Research & Innovation",
        description:
          "Clinical research, strategic collaborations and innovation programs.",
        href: "/services/research-innovation",
      },
      {
        title: "Emergency Services",
        description:
          "Critical care logistics, air ambulance and emergency coordination.",
        href: "/services/emergency-services",
      },
    ],
  },
  {
    label: "Directory",
    children: [
      {
        title: "Healthcare Directory",
        description: "Browse all verified healthcare providers.",
        href: "/directory",
      },
      {
        title: "Hospitals",
        description: "Multi-specialty and super-specialty hospitals.",
        href: "/directory?category=hospitals",
      },
      {
        title: "Clinics",
        description: "Specialty clinics and outpatient centres.",
        href: "/directory?category=clinics",
      },
      {
        title: "Diagnostics",
        description: "Diagnostic labs and imaging centres.",
        href: "/directory?category=diagnostics",
      },
      { title: "Doctors", description: "Coming Soon", href: "#" },
    ],
  },
  {
    label: "Insights",
    children: [
      {
        title: "Featured Insights",
        description: "Editor's picks and featured healthcare stories.",
        href: "/insights",
      },
      {
        title: "Healthcare News",
        description: "Latest healthcare industry developments.",
        href: "/insights",
      },
      {
        title: "Medical Technology",
        description: "Innovation, AI and digital health.",
        href: "/insights",
      },
      {
        title: "Treatment Guides",
        description: "Patient education and treatment information.",
        href: "/insights",
      },
      {
        title: "Research",
        description: "Medical research and scientific discoveries.",
        href: "/insights",
      },
      {
        title: "Vendor Spotlight",
        description: "Featured healthcare providers.",
        href: "/insights",
      },
    ],
  },
  {
    label: "About",
    children: [
      {
        title: "About GMAA",
        description: "Learn about our mission and vision.",
        href: "/about",
      },
      {
        title: "How It Works",
        description: "Understand the patient journey.",
        href: "/how-it-works",
      },
      {
        title: "Our Network",
        description: "Explore our global healthcare ecosystem.",
        href: "/network",
      },
      {
        title: "Partners",
        description: "Partner with GMAA.",
        href: "/partners",
      },
    ],
  },
  { label: "Contact", to: "/contact" },
];

export default function Navbar({
  portal,
  onLogout,
  onLogin,
  onClientAccess,
  isAdminView,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [expandedMobileMenu, setExpandedMobileMenu] = useState<string | null>(null);
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isClientVerified =
    localStorage.getItem("gmaa_client_verified") === "true";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const computedPortal =
    portal || (location.pathname.startsWith("/vendor") ? "vendor" : "patient");

  const path = location.pathname;
  let activeView:
    | "home"
    | "about"
    | "vendors"
    | "insights"
    | "admin"
    | "directory" = "home";
  if (path === "/" || path === "/vendor") activeView = "home";
  else if (path === "/about") activeView = "about";
  else if (path === "/insights") activeView = "insights";
  else if (path === "/directory") activeView = "directory";
  else if (path.startsWith("/vendors")) activeView = "vendors";
  else if (path.startsWith("/admin")) activeView = "admin";

  // COLOR DYNAMISM CALCULATIONS
  // Only use dynamic transparent headers on the landing/home pages when not scrolled
  const isHeroPage = path === "/";
  const isTransparent = isHeroPage && !scrolled;

  const navTextColor = isTransparent ? "text-white" : "text-navy";
  const navIconColor = isTransparent ? "text-white/60" : "text-navy/50";
  const logoClass = isTransparent ? "brightness-0 invert" : "";

  if (isAdminView) {
    return (
      <nav className="fixed top-0 lg:left-80 right-0 z-50 h-20 bg-white/95 backdrop-blur-xl border-b border-navy/5 flex items-center shadow-sm">
        <div className="w-full px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center shrink-0">
                <Activity className="text-brand-red animate-pulse" size={18} />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-lg font-bold text-navy leading-none tracking-tight uppercase">
                  GMAA <span className="text-brand-red">Admin</span>
                </span>
                <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-navy/40">
                  Verified Access
                </span>
              </div>
            </div>
            <div className="hidden xs:flex bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest items-center gap-1.5 border border-emerald-500/20">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              Systems Online
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden xl:flex items-center gap-2 px-4 py-2 bg-slate-bg rounded-full border border-navy/5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-navy/60">
                Secure Connection
              </span>
            </div>
            <Link
              to="/"
              className="px-6 md:px-8 py-2.5 bg-navy text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-red transition-all shadow-lg shadow-navy/20 active:scale-95 text-center"
            >
              Back to site
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isTransparent
          ? "py-4 md:py-6 bg-transparent"
          : "py-2 sm:py-3 bg-white/90 backdrop-blur-xl shadow-xl shadow-navy/5 border-b border-navy/5"
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-6 md:px-8 lg:px-10 xl:px-16 flex items-center justify-between gap-4 relative">
        {/* Logo & Portal Switcher Group */}
        <div className="flex items-center gap-4 xl:gap-8 shrink-0">
          <Link
            to={computedPortal === "vendor" ? "/vendor" : "/"}
            className="group shrink-0"
          >
            <img
              src="/images/gmaa-logo.png"
              alt="GMAA"
              className={`h-8 xs:h-9 sm:h-10 lg:h-11 xl:h-12 2xl:h-14 w-auto object-contain transition-all duration-300 group-hover:scale-[1.02] ${logoClass}`}
            />
          </Link>

          <div className="hidden xl:block">
            <div
              className={`relative flex items-center rounded-full border p-1 shadow-lg shadow-navy/5 overflow-hidden transition-colors duration-300 ${
                isTransparent
                  ? "border-white/40 bg-white/55 backdrop-blur-xl"
                  : "border-navy/10 bg-slate-100/85 backdrop-blur-xl"
              }`}
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`absolute top-1 bottom-1 rounded-full bg-navy shadow-lg transition-all duration-300 ${
                  computedPortal === "patient"
                    ? "left-1 w-[80px] xl:w-[90px] 2xl:w-[108px]"
                    : "left-[81px] xl:left-[91px] 2xl:left-[109px] w-[80px] xl:w-[90px] 2xl:w-[108px]"
                }`}
              />
              {/* Patients Toggle */}
              <Link
                to="/"
                className="relative z-10 flex items-center justify-center gap-1.5 w-[80px] xl:w-[90px] 2xl:w-[108px] py-1.5 sm:py-2"
              >
                <User
                  size={13}
                  className={`transition-colors duration-300 ${
                    computedPortal === "patient"
                      ? "text-brand-red"
                      : isTransparent
                        ? "text-white/50"
                        : "text-navy/40"
                  }`}
                />
                <span
                  className={`text-[9px] xl:text-[10px] font-bold tracking-wide transition-colors duration-300 ${
                    computedPortal === "patient"
                      ? "text-white"
                      : isTransparent
                        ? "text-white/60 hover:text-white"
                        : "text-navy/60 hover:text-navy"
                  }`}
                >
                  Patients
                </span>
              </Link>
              {/* Vendors Toggle */}
              <Link
                to="/vendor"
                className="relative z-10 flex items-center justify-center gap-1.5 w-[80px] xl:w-[90px] 2xl:w-[108px] py-1.5 sm:py-2"
              >
                <Building2
                  size={13}
                  className={`transition-colors duration-300 ${
                    computedPortal === "vendor"
                      ? "text-brand-red"
                      : isTransparent
                        ? "text-white/50"
                        : "text-navy/40"
                  }`}
                />
                <span
                  className={`text-[9px] xl:text-[10px] font-bold tracking-wide transition-colors duration-300 ${
                    computedPortal === "vendor"
                      ? "text-white"
                      : isTransparent
                        ? "text-white/60 hover:text-white"
                        : "text-navy/60 hover:text-navy"
                  }`}
                >
                  Vendors
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* --- CENTER ZONE: NAV LINKS --- */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-x-3 xl:gap-x-5 2xl:gap-x-8">
          {NAV_ITEMS.map((item) => (
            <div
              key={item.label}
              className="relative py-4"
              onMouseEnter={() => item.children && setActiveMenu(item.label)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <div
                className={`flex items-center gap-1 cursor-pointer text-[10px] xl:text-[11px] font-bold uppercase tracking-[0.12em] xl:tracking-[0.16em] 2xl:tracking-[0.2em] transition-colors hover:text-brand-red ${navTextColor}`}
              >
                {item.to ? (
                  <Link to={item.to}>{item.label}</Link>
                ) : (
                  <span>{item.label}</span>
                )}
                {!item.to && (
                  <ChevronDown
                    size={12}
                    className={`transition-transform duration-300 ${activeMenu === item.label ? "rotate-180 text-brand-red" : navIconColor}`}
                  />
                )}
              </div>
              {!item.to && (
                <DropdownMenu
                  open={activeMenu === item.label}
                  title={item.label}
                  items={item.children ?? []}
                />
              )}
            </div>
          ))}
        </div>

        {/* --- RIGHT ZONE: ACTION BUTTONS --- */}
        <div className="flex items-center justify-end gap-2 xl:gap-4 flex-1 shrink-0">
          <button
            onClick={() => {
              if (computedPortal === "vendor") {
                window.location.href = "https://vendor.globalmaa.com";
                return;
              }
              if (isClientVerified) {
                navigate("/vendors");
                return;
              }
              onClientAccess?.();
            }}
            className={`hidden lg:block relative group overflow-hidden px-4 xl:px-8 py-2.5 xl:py-3 rounded-xl text-[9px] xl:text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95 ${
              isTransparent ? "bg-white text-navy" : "bg-navy text-white"
            }`}
          >
            <span className="relative z-10">
              {computedPortal === "vendor"
                ? "Vendor Login"
                : isClientVerified
                  ? "Directory"
                  : "Client Access"}
            </span>
            <div className="absolute inset-0 bg-brand-red translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </button>

          {isClientVerified && (
            <button
              onClick={() => {
                localStorage.removeItem("gmaa_client_verified");
                navigate("/");
              }}
              className={`hidden lg:block px-4 xl:px-6 py-2.5 xl:py-3 rounded-xl text-[9px] xl:text-[10px] font-black uppercase tracking-widest border transition-all ${
                isTransparent
                  ? "border-white/30 text-white hover:bg-white hover:text-navy"
                  : "border-navy/20 text-navy hover:bg-navy hover:text-white"
              }`}
            >
              Logout
            </button>
          )}

          {user && (
            <button
              onClick={onLogout}
              className="hidden lg:block p-2.5 xl:p-3 rounded-xl bg-brand-red text-white shadow-lg active:scale-95"
            >
              <LogOut size={16} />
            </button>
          )}

          {/* Mobile Menu Toggle */}
          <button
            className={`lg:hidden p-2 transition-colors ${navTextColor}`}
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-navy/5 p-6 flex flex-col gap-5 lg:hidden z-40 overflow-y-auto max-h-[85vh]"
          >
            <div className="flex bg-slate-bg p-1 rounded-xl">
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all ${computedPortal === "patient" ? "bg-white shadow-sm text-navy" : "text-navy/40"}`}
              >
                <User size={16} /> Patients
              </Link>
              <Link
                to="/vendor"
                onClick={() => setIsOpen(false)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold transition-all ${computedPortal === "vendor" ? "bg-white shadow-sm text-navy" : "text-navy/40"}`}
              >
                <Building2 size={16} /> Vendors
              </Link>
            </div>
            
            {/* Dynamic Mobile Menu Accordion */}
            <div className="flex flex-col border-y border-navy/5 py-2">
              {NAV_ITEMS.map((item) => {
                const hasChildren = !!item.children;
                const isExpanded = expandedMobileMenu === item.label;

                return (
                  <div key={item.label} className="border-b border-navy/5 last:border-none py-1">
                    {hasChildren ? (
                      <div>
                        <button
                          onClick={() => setExpandedMobileMenu(isExpanded ? null : item.label)}
                          className="w-full flex items-center justify-between text-sm font-semibold text-navy py-2.5 text-left"
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            size={16}
                            className={`transition-transform duration-300 ${isExpanded ? "rotate-180 text-brand-red" : "text-navy/40"}`}
                          />
                        </button>
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-4 flex flex-col gap-2 pb-3 overflow-hidden"
                            >
                              {item.children?.map((child) => (
                                <Link
                                  key={child.title}
                                  to={child.href}
                                  onClick={() => setIsOpen(false)}
                                  className="text-xs font-medium text-navy/60 hover:text-brand-red py-1.5"
                                >
                                  {child.title}
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={item.to ?? "#"}
                        onClick={() => setIsOpen(false)}
                        className="block text-sm font-semibold text-navy py-2.5"
                      >
                        {item.label}
                      </Link>
                    )}
                  </div>
                );
              })}

              {user &&
                (user.email === "digitalised17@gmail.com" ||
                  user.email?.endsWith("@globalmaa.com")) && (
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="text-sm font-bold text-brand-red py-3 uppercase tracking-widest mt-2 border-t border-navy/5 pt-3"
                  >
                    Admin Panel
                  </Link>
                )}
            </div>

            <button
              onClick={() => {
                if (computedPortal === "vendor") {
                  window.location.href = "https://vendor.globalmaa.com";
                  return;
                }
                if (isClientVerified) {
                  navigate("/vendors");
                  setIsOpen(false);
                  return;
                }
                onClientAccess?.();
                setIsOpen(false);
              }}
              className="w-full bg-navy text-white py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest shadow-lg active:scale-95"
            >
              {computedPortal === "vendor"
                ? "Vendor Login"
                : isClientVerified
                  ? "Directory"
                  : "Client Access"}
            </button>
            {user && (
              <button
                onClick={() => {
                  onLogout?.();
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-4 text-brand-red font-bold uppercase tracking-widest text-[11px] border border-brand-red/10 rounded-xl"
              >
                <LogOut size={16} /> Sign Out
              </button>
            )}
            {isClientVerified && (
              <button
                onClick={() => {
                  localStorage.removeItem("gmaa_client_verified");
                  navigate("/");
                  setIsOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-4 text-brand-red font-bold uppercase tracking-widest text-[11px] border border-brand-red/10 rounded-xl"
              >
                <LogOut size={16} /> Client Logout
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}