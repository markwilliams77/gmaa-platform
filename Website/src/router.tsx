import { createBrowserRouter, Navigate } from "react-router-dom";
import { motion } from "motion/react";
import { useOutletContext, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "./components/AuthContext";

import Layout from "./components/Layout";
import AdminLayout from "./components/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";

// Immersive Page Modules
import Hero from "./components/Hero";
import PartnerSections from "./components/PartnerSections";
import AboutPage from "./components/AboutPage";
import InsightsPage from "./components/InsightsPage";
import HealthcareDirectory from "./components/HealthcareDirectory";
import DestinationsPage from "./components/DestinationsPage";
import DestinationDetailPage from "./components/DestinationDetailPage";
import RegistryPage from "./components/RegistryPage";
import VendorProfilePage from "./components/VendorProfilePage";
import ProviderDashboard from "./components/ProviderDashboard";
import VendorPortal from "./components/VendorPortal";
import AdminDashboard from "./components/AdminDashboard";

// Define the Outlet Context interface to share layout level States
type LayoutCtx = {
  openConsultation: (options?: {
    category?: string;
    vendorId?: string;
    vendorName?: string;
  }) => void;

  setIsLoggingIn: (open: boolean) => void;
  setIsOnboarding: (open: boolean) => void;
  setIsOtpOpen: (open: boolean) => void;
  setPendingDirectoryUrl: (url: string) => void;
  handleLogout: () => void;
};

// --------------------------------------------------------------------------
// 1. Patient Portal Home View
// --------------------------------------------------------------------------
function PatientHome() {
  const navigate = useNavigate();
  const context = useOutletContext<LayoutCtx>();

  const handleSourceVendors = (service?: string, region?: string) => {
    const params = new URLSearchParams();

    if (service) params.set("service", service);
    if (region) params.set("region", region);

    const targetUrl = `/vendors${params.toString() ? `?${params.toString()}` : ""}`;

    const isVerified = localStorage.getItem("gmaa_client_verified") === "true";

    if (isVerified) {
      navigate(targetUrl);
      return;
    }

    context.setPendingDirectoryUrl(targetUrl);
    context.setIsOtpOpen(true);
  };

  return (
    <motion.main
      key="patient-portal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Hero
        onSourceVendors={handleSourceVendors}
        onRequestConsultation={() => context.openConsultation()}
        onPortalChange={(p) => navigate(p === "vendor" ? "/vendor" : "/")}
      />

      <PartnerSections
        onExploreVendors={handleSourceVendors}
        onRequestConsultation={() => context.openConsultation()}
      />
    </motion.main>
  );
}

// --------------------------------------------------------------------------
// 2. Supplying & Teams Portal View
// --------------------------------------------------------------------------
function VendorHome() {
  const { user } = useAuth();
  const context = useOutletContext<LayoutCtx>();
  const navigate = useNavigate();

  return (
    <motion.main
      key="vendor-portal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex-1 flex flex-col pt-24"
    >
      {user ? (
        <ProviderDashboard
          onLogout={context.handleLogout}
          onViewProfile={(id) => {
            navigate(`/vendors/${id}`);
          }}
          onHome={() => {
            navigate("/");
          }}
        />
      ) : (
        <VendorPortal
          onLogin={() => context.setIsLoggingIn(true)}
          onPartnerWithUs={() => context.setIsOnboarding(true)}
        />
      )}
    </motion.main>
  );
}

function ClientProtectedRoute({ children }: { children: React.ReactNode }) {
  const isVerified = localStorage.getItem("gmaa_client_verified") === "true";

  return isVerified ? <>{children}</> : <Navigate to="/" replace />;
}

// --------------------------------------------------------------------------
// 3. About Page
// --------------------------------------------------------------------------
function AboutPageRoute() {
  return (
    <motion.main
      key="about-page"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      className="w-full pt-28"
    >
      <AboutPage />
    </motion.main>
  );
}

// --------------------------------------------------------------------------
// 4. Insights Page
// --------------------------------------------------------------------------
function InsightsPageRoute() {
  return (
    <motion.main
      key="insights-page"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full pt-28"
    >
      <InsightsPage />
    </motion.main>
  );
}

// --------------------------------------------------------------------------
// 5. Healthcare Directory ("Categories") Page
// --------------------------------------------------------------------------
function DirectoryPageRoute() {
  return (
    <motion.main
      key="directory-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full pt-28"
    >
      <HealthcareDirectory />
    </motion.main>
  );
}

// --------------------------------------------------------------------------
// 6. Destinations Page
// --------------------------------------------------------------------------
function DestinationsPageRoute() {
  const navigate = useNavigate();

  return (
    <motion.main
      key="destinations-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="w-full pt-28"
    >
      <DestinationsPage
        onSelectCountry={(country) => {
          navigate(`/destinations/${encodeURIComponent(country)}`);
        }}
      />
    </motion.main>
  );
}

// --------------------------------------------------------------------------
// 7. Destination Detail Page
// --------------------------------------------------------------------------
function DestinationDetailPageRoute() {
  const navigate = useNavigate();
  const { countryName } = useParams<{ countryName?: string }>();

  return (
    <motion.main
      key="destination-detail-page"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      className="w-full pt-28"
    >
      <DestinationDetailPage
        country={countryName || "Switzerland"}
        onBack={() => navigate("/destinations")}
        onExploreProviders={(region) => {
          navigate(`/vendors?region=${encodeURIComponent(region)}`);
        }}
      />
    </motion.main>
  );
}

// --------------------------------------------------------------------------
// 8. Vendors Registry / Profile Page
// --------------------------------------------------------------------------
function VendorsPageRoute() {
  const context = useOutletContext<LayoutCtx>();
  const navigate = useNavigate();
  const { vendorId } = useParams<{ vendorId?: string }>();

  return (
    <motion.main
      key="registry-page"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5 }}
      className="w-full pt-28"
    >
      {vendorId ? (
        <VendorProfilePage
          vendorId={vendorId}
          onBack={() => navigate("/vendors")}
          onEnquire={(options) => context.openConsultation(options)}
        />
      ) : (
        <RegistryPage onSelectVendor={(id) => navigate(`/vendors/${id}`)} />
      )}
    </motion.main>
  );
}

// --------------------------------------------------------------------------
// 9. Admin Dashboard View
// --------------------------------------------------------------------------
function AdminPageRoute() {
  const context = useOutletContext<LayoutCtx>();
  const navigate = useNavigate();

  return (
    <motion.main
      key="admin-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="w-full h-screen overflow-hidden"
    >
      <AdminDashboard
        onLogout={context ? context.handleLogout : async () => {}}
        onViewChange={(v: string) => {
          // Standard mapping back to our router paths
          if (v === "home") navigate("/");
          else navigate(`/${v}`);
        }}
        onHome={() => {
          navigate("/");
        }}
      />
    </motion.main>
  );
}

// --------------------------------------------------------------------------
// BrowserRouter Configuration Engine
// --------------------------------------------------------------------------
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <PatientHome />,
      },
      {
        path: "vendor",
        element: <VendorHome />,
      },
      {
        path: "about",
        element: <AboutPagePageRouteWrapper />,
      },
      {
        path: "insights",
        element: <InsightsPageRoute />,
      },
      {
        path: "directory",
        element: <DirectoryPageRoute />,
      },
      {
        path: "destinations",
        element: <DestinationsPageRoute />,
      },
      {
        path: "destinations/:countryName",
        element: <DestinationDetailPageRoute />,
      },
      {
        path: "vendors",
        element: (
          <ClientProtectedRoute>
            <VendorsPageRoute />
          </ClientProtectedRoute>
        ),
      },
      {
        path: "vendors/:vendorId",
        element: (
          <ClientProtectedRoute>
            <VendorsPageRoute />
          </ClientProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requireAdmin={true}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminPageRoute />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

// Helper alias
function AboutPagePageRouteWrapper() {
  return <AboutPageRoute />;
}
