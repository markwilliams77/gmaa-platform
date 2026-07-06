import { useState, useEffect } from "react";
import { motion } from "motion/react";
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
      {
        title: "Doctors",
        description: "Coming Soon",
        href: "#",
      },
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

  {
    label: "Contact",
    to: "/contact",
  },
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
  const { user } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  const isClientVerified =
    localStorage.getItem("gmaa_client_verified") === "true";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Compute portal dynamically from url path
  const computedPortal =
    portal ||
    (location.pathname === "/vendor" || location.pathname.startsWith("/vendor/")
      ? "vendor"
      : "patient");

  // Compute currentView dynamically from url path
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

  if (isAdminView) {
    return (
      <nav className="fixed top-0 lg:left-80 right-0 z-50 h-20 md:h-24 bg-white/95 backdrop-blur-xl border-b border-navy/5 flex items-center shadow-sm">
        <div className="w-full px-4 md:px-12 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center">
                <Activity className="text-brand-red animate-pulse" size={18} />
              </div>
              <div className="hidden lg:flex flex-col">
                <span className="text-xl font-bold text-navy leading-none tracking-tight uppercase">
                  GMAA <span className="text-brand-red">Admin</span>
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-navy/40">
                  Verified Access
                </span>
              </div>
            </div>
            <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-500/20">
              <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
              Systems Online
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden xl:flex items-center gap-2 px-6 py-2.5 bg-slate-bg rounded-full border border-navy/5">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-navy/60">
                Secure Connection
              </span>
            </div>
            <Link
              to="/"
              className="px-8 py-3 bg-navy text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-red transition-all shadow-lg shadow-navy/20 active:scale-95 cursor-pointer text-center"
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
        scrolled
          ? "py-2 md:py-3 bg-white/80 backdrop-blur-xl shadow-xl shadow-navy/5 border-b border-navy/5"
          : "py-4 md:py-6 bg-transparent"
      }`}
    >
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 flex items-center justify-between">
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Logo - Matching Brand Identity */}
          <Link
            to={computedPortal === "vendor" ? "/vendor" : "/"}
            className="group shrink-0"
          >
            <img
              src="/images/gmaa-logo.png"
              alt="GMAA"
              className=" h-12 md:h-16 xl:h-[68px] w-auto object-contain transition-all duration-300 group-hover:scale-[1.02]"
            />
          </Link>

          {/* Desktop Portal Switcher */}
          <div className="hidden lg:block">
            <div className="relative flex items-center rounded-full border border-white/40 bg-white/55 backdrop-blur-xl p-1 shadow-lg shadow-navy/5 overflow-hidden">
              {/* Animated Active Pill */}

              <motion.div
                layout
                transition={{
                  type: "spring",
                  stiffness: 450,
                  damping: 35,
                }}
                className={`absolute top-1 bottom-1 rounded-full bg-navy shadow-lg ${
                  computedPortal === "patient"
                    ? "left-1 w-[108px]"
                    : "left-[109px] w-[108px]"
                }`}
              />

              {/* Patients */}

              <Link
                to="/"
                className="relative z-10 flex items-center justify-center gap-2 w-[108px] py-2.5"
              >
                <User
                  size={14}
                  className={`transition-colors duration-300 ${
                    computedPortal === "patient"
                      ? "text-brand-red"
                      : "text-navy/45"
                  }`}
                />

                <span
                  className={`text-[10px] font-semibold tracking-wide transition-colors duration-300 ${
                    computedPortal === "patient" ? "text-white" : "text-navy/60"
                  }`}
                >
                  Patients
                </span>
              </Link>

              {/* Vendors */}

              <Link
                to="/vendor"
                className="relative z-10 flex items-center justify-center gap-2 w-[108px] py-2.5"
              >
                <Building2
                  size={14}
                  className={`transition-colors duration-300 ${
                    computedPortal === "vendor"
                      ? "text-brand-red"
                      : "text-navy/45"
                  }`}
                />

                <span
                  className={`text-[10px] font-semibold tracking-wide transition-colors duration-300 ${
                    computedPortal === "vendor" ? "text-white" : "text-navy/60"
                  }`}
                >
                  Vendors
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Desktop Nav Links - Using Brand Red Accents */}
        <div className="hidden lg:flex flex-1 items-center justify-between ml-10">
          <div className="flex items-center gap-12">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => item.children && setActiveMenu(item.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                {item.to ? (
                  <Link
                    to={item.to}
                    className="
          flex
          items-center
          gap-1.5
          text-[11px]
          font-semibold
          uppercase
          tracking-[0.18em]
          text-navy/55
          hover:text-navy
          transition-colors
        "
                  >
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <div
                      className="
            group
            flex
            items-center
            gap-1.5
            cursor-pointer
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-navy/55
            hover:text-navy
            transition-colors
          "
                    >
                      <span>{item.label}</span>

                      <ChevronDown
                        size={14}
                        className={`
              transition-all duration-300
              ${activeMenu === item.label ? "rotate-180 text-brand-red" : ""}
            `}
                      />
                    </div>

                    <DropdownMenu
                      open={activeMenu === item.label}
                      title={item.label}
                      items={item.children ?? []}
                    />
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="flex items-center gap-4 ml-12">
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
              className={`relative group overflow-hidden px-4 lg:px-8 py-3 rounded-2xl text-[8px] lg:text-[10px] font-bold lg:font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] shadow-xl transition-all active:scale-95 ${
                activeView === "vendors"
                  ? "bg-cyan text-white shadow-cyan/20"
                  : "bg-navy text-white shadow-navy/10"
              }`}
            >
              <span className="relative z-10">
                {computedPortal === "vendor"
                  ? "Vendor Login"
                  : activeView === "vendors"
                    ? "Directory Open"
                    : isClientVerified
                      ? "Directory"
                      : "Client Access"}
              </span>
              <div
                className={`absolute inset-0 bg-brand-red translate-y-full group-hover:translate-y-0 transition-transform duration-500 ${activeView === "vendors" ? "hidden" : ""}`}
              />
            </button>

            {computedPortal !== "vendor" && isClientVerified && (
              <button
                onClick={() => {
                  localStorage.removeItem("gmaa_client_verified");
                  localStorage.removeItem("gmaa_client_phone");
                  navigate("/");
                }}
                className="px-4 lg:px-6 py-3 rounded-2xl text-[8px] lg:text-[10px] font-bold lg:font-black uppercase tracking-[0.2em] lg:tracking-[0.3em] bg-white border border-navy/10 text-navy hover:bg-navy hover:text-white transition-all active:scale-95"
              >
                Logout
              </button>
            )}

            {user && (
              <button
                onClick={onLogout}
                className="p-3.5 rounded-2xl bg-navy text-white hover:bg-brand-red transition-all shadow-lg shadow-navy/10"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-navy"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-navy/5 p-8 flex flex-col gap-6 md:hidden z-40 overflow-y-auto max-h-[80vh]"
        >
          <div className="flex bg-slate-bg p-1 rounded-xl">
            <Link
              to="/"
              onClick={() => setIsOpen(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg ${
                computedPortal === "patient"
                  ? "bg-white shadow-sm text-navy font-bold"
                  : "text-navy/50"
              }`}
            >
              <User size={18} />
              <span className="text-sm font-medium">Clients</span>
            </Link>
            <Link
              to="/vendor"
              onClick={() => setIsOpen(false)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg ${
                computedPortal === "vendor"
                  ? "bg-white shadow-sm text-navy font-bold"
                  : "text-navy/50"
              }`}
            >
              <Building2 size={18} />
              <span className="text-sm font-medium">Vendors</span>
            </Link>
          </div>
          <Link
            to="/directory"
            onClick={() => setIsOpen(false)}
            className="text-[clamp(1rem,0.5vw+0.9rem,1.125rem)] text-left font-medium text-navy py-2 border-b border-navy/5"
          >
            Medical Categories
          </Link>
          <Link
            to="/insights"
            onClick={() => setIsOpen(false)}
            className="text-[clamp(1rem,0.5vw+0.9rem,1.125rem)] text-left font-medium text-navy py-2 border-b border-navy/5"
          >
            Network Insights
          </Link>
          {user &&
            (user.email === "digitalised17@gmail.com" ||
              user.email?.endsWith("@globalmaa.com")) && (
              <Link
                to="/admin"
                onClick={() => setIsOpen(false)}
                className="text-[clamp(1rem,0.5vw+0.9rem,1.125rem)] text-left font-bold text-brand-red py-2 border-b border-navy/5 uppercase tracking-widest"
              >
                Admin Panel
              </Link>
            )}
          <span className="text-[clamp(1rem,0.5vw+0.9rem,1.125rem)] font-medium text-navy/40 py-2 border-b border-navy/5">
            Medical Logistics
          </span>
          <button
            onClick={() => {
              if (
                computedPortal === "vendor" &&
                activeView === "home" &&
                !user
              ) {
                onLogin?.();
              } else {
                navigate("/vendors");
              }
              setIsOpen(false);
            }}
            className="w-full bg-cyan text-white py-4 rounded-full font-bold mt-2 text-[11px] uppercase tracking-widest cursor-pointer shadow-lg shadow-cyan/20"
          >
            {computedPortal === "vendor" && activeView === "home" && !user
              ? "Vendor Login"
              : "Access Network"}
          </button>

          {user && (
            <button
              onClick={() => {
                onLogout?.();
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-4 text-brand-red font-bold uppercase tracking-widest text-xs border border-brand-red/10 rounded-xl hover:bg-brand-red/5 transition-all"
            >
              <LogOut size={16} /> Sign Out
            </button>
          )}
        </motion.div>
      )}
    </nav>
  );
}
