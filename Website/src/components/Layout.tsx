import { useState, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import Navbar from "./Navbar";
import LeadCapture from "./LeadCapture";
import VendorOnboarding from "./VendorOnboarding";
import LoginPage from "./LoginPage";
import { useAuth } from "./AuthContext";
import { Activity } from "lucide-react";
import ClientOtpModal from "./ClientOtpModal";
import CookieConsentBanner from "./CookieConsentBanner";

export default function Layout() {
  const [portal, setPortal] = useState<"patient" | "vendor">("patient");
  const [isOtpOpen, setIsOtpOpen] = useState(false);
  const [pendingDirectoryUrl, setPendingDirectoryUrl] = useState("");
  const [consultationContext, setConsultationContext] = useState({
    open: false,

    category: "",
    vendorId: "",
    vendorName: "",
  });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isOnboarding, setIsOnboarding] = useState(false);

  const { user, profile, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Determine portal from path
  useEffect(() => {
    if (
      location.pathname === "/vendor" ||
      location.pathname.startsWith("/vendor/")
    ) {
      setPortal("vendor");
    } else {
      setPortal("patient");
    }
  }, [location.pathname]);

  // Handle smooth scroll adjustments reactively
  useEffect(() => {
    if (location.pathname === "/" || location.pathname === "/vendor") {
      document.documentElement.style.scrollBehavior = "smooth";
    } else {
      window.scrollTo(0, 0);
      document.documentElement.style.scrollBehavior = "auto";
    }
  }, [location.pathname]);

  // Translate paths to 'currentView' for Navbar active styling compatibility
  const getCurrentView = ():
    | "home"
    | "about"
    | "vendors"
    | "insights"
    | "admin"
    | "directory" => {
    const path = location.pathname;
    if (path === "/" || path === "/vendor") return "home";
    if (path === "/about") return "about";
    if (path === "/insights") return "insights";
    if (path === "/directory") return "directory";
    if (path.startsWith("/vendors")) return "vendors";
    return "home";
  };

  const handleLogout = async () => {
    try {
      logout();
      setIsLoggingIn(false);
      navigate("/");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const handleViewChange = (
    newView: "home" | "about" | "vendors" | "insights" | "admin" | "directory",
  ) => {
    if (newView === "home") {
      navigate(portal === "vendor" ? "/vendor" : "/");
    } else if (newView === "admin") {
      navigate("/admin");
    } else {
      navigate(`/${newView}`);
    }
  };

  const openConsultation = (options?: {
    category?: string;
    vendorId?: string;
    vendorName?: string;
  }) => {
    setConsultationContext({
      open: true,

      category: options?.category ?? "",
      vendorId: options?.vendorId ?? "",
      vendorName: options?.vendorName ?? "",
    });
  };

  const closeConsultation = () => {
    setConsultationContext((prev) => ({
      ...prev,
      open: false,
    }));
  };

  return (
    <div className="min-h-screen relative selection:bg-cyan selection:text-white bg-white overflow-x-hidden">
      {/* Global Texture Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.05] noise" />

      {/* Structural Grid Lines */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-y-0 left-0 md:left-[5%] lg:left-[10%] w-[1px] bg-navy/5" />
        <div className="absolute inset-y-0 right-0 md:right-[5%] lg:right-[10%] w-[1px] bg-navy/5" />
        <div className="absolute inset-y-0 left-1/2 w-[1px] bg-navy/5 opacity-50" />
      </div>

      {/* Global Navbar */}
      <Navbar
        portal={portal}
        onPortalChange={(p) => navigate(p === "vendor" ? "/vendor" : "/")}
        currentView={getCurrentView()}
        onViewChange={handleViewChange}
        onLogout={handleLogout}
        onLogin={() => setIsLoggingIn(true)}
        onClientAccess={() => {
          setPendingDirectoryUrl("/vendors");
          setIsOtpOpen(true);
        }}
        isAdminView={false}
      />

      <AnimatePresence>
        {isOnboarding && (
          <VendorOnboarding
            onCancel={() => setIsOnboarding(false)}
            onComplete={() => {
              setIsOnboarding(false);
              navigate("/vendor");
              setIsLoggingIn(true);
            }}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isLoggingIn && !user && (
          <LoginPage
            onBack={() => setIsLoggingIn(false)}
            onLoginBypass={(u) => {
              setIsLoggingIn(false);
            }}
          />
        )}
      </AnimatePresence>

      <Outlet
        context={{
          openConsultation,
          setIsLoggingIn,
          setIsOnboarding,
          setIsOtpOpen,
          setPendingDirectoryUrl,
          handleLogout,
        }}
      />

      <CookieConsentBanner />

      <LeadCapture
        externalOpen={consultationContext.open}
        onClose={closeConsultation}
        initialCategory={consultationContext.category}
        initialVendorId={consultationContext.vendorId}
        initialVendorName={consultationContext.vendorName}
      />

      <ClientOtpModal
        isOpen={isOtpOpen}
        onClose={() => setIsOtpOpen(false)}
        onVerified={() => {
          setIsOtpOpen(false);
          if (pendingDirectoryUrl) {
            navigate(pendingDirectoryUrl);
          }
        }}
      />

      {/* Footer */}
      <footer className="bg-slate-bg py-20 md:py-32 border-t border-navy/5">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20">
          <div className="flex flex-col lg:flex-row justify-between items-start gap-12 lg:gap-24">
            <div className="space-y-6 max-w-sm">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-navy rounded-lg flex items-center justify-center">
                  <Activity
                    className="text-brand-red animate-pulse"
                    size={16}
                  />
                </div>
                <span className="text-[clamp(1rem,0.5vw+0.9rem,1.125rem)] font-bold tracking-tight text-navy">
                  GMAA <span className="text-cyan">Alliance</span>
                </span>
              </div>
              <p className="text-sm text-navy/40 font-medium">
                The world's most sophisticated medical logistics aggregator.
                Quality fulfillment beyond borders.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-16 w-full lg:w-auto">
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-navy">
                  Fulfillment
                </h4>
                <ul className="space-y-2 text-sm text-navy/50 font-medium">
                  <li>
                    <a href="#" className="hover:text-cyan transition-colors">
                      Sourcing
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-cyan transition-colors">
                      Global Logistics
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-cyan transition-colors">
                      Emergency Dispatch
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-navy">
                  Network
                </h4>
                <ul className="space-y-2 text-sm text-navy/50 font-medium">
                  <li>
                    <button
                      onClick={() => handleViewChange("about")}
                      className="hover:text-cyan transition-colors"
                    >
                      About Us
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleViewChange("insights")}
                      className="hover:text-cyan transition-colors"
                    >
                      Insights
                    </button>
                  </li>
                  <li>
                    <a href="#" className="hover:text-cyan transition-colors">
                      Security
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-cyan transition-colors">
                      Contact
                    </a>
                  </li>
                </ul>
              </div>
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-navy">
                  Legal
                </h4>
                <ul className="space-y-2 text-sm text-navy/50 font-medium">
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate("/legal/terms-of-service")}
                      className="hover:text-cyan transition-colors"
                    >
                      Terms of Service
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate("/legal/privacy-policy")}
                      className="hover:text-cyan transition-colors"
                    >
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button
                      type="button"
                      onClick={() => navigate("/legal/cookie-policy")}
                      className="hover:text-cyan transition-colors"
                    >
                      Cookie Policy
                    </button>
                  </li>
                  <li>
                    <a href="#" className="hover:text-cyan transition-colors">
                      HIPAA
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-20 md:mt-32 pt-8 md:pt-12 border-t border-navy/5 flex flex-col md:flex-row justify-between gap-8 md:gap-10">
            <p className="text-[9px] md:text-[10px] font-bold text-navy/20 uppercase tracking-[0.2em] md:tracking-[0.4em]">
              © 2026 Global Med Access Alliance Pvt. Ltd.
            </p>
            <div className="flex flex-wrap gap-6 md:gap-12">
              <span className="text-[9px] md:text-[10px] font-bold text-navy/20 uppercase tracking-[0.2em] md:tracking-[0.4em] hover:text-brand-red transition-colors cursor-pointer">
                Twitter / X
              </span>
              <span className="text-[9px] md:text-[10px] font-bold text-navy/20 uppercase tracking-[0.2em] md:tracking-[0.4em] hover:text-cyan transition-colors cursor-pointer">
                LinkedIn
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
