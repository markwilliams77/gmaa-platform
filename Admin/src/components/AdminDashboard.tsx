import React, { useEffect, useMemo, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  FileSearch,
  Gavel,
  Globe2,
  KeyRound,
  LifeBuoy,
  Loader2,
  LogOut,
  Menu,
  MessageCircle,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldAlert,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  bidsService,
  consultationsService,
  leadsService,
  supportService,
  systemService,
  tendersService,
  vendorsService,
  authService,
  websitePublishingService,
  tenderWorkspaceService,
} from "../services/api";
import { useAuth } from "./AuthContext";
import type {
  AdminCredentials,
  Bid,
  SupportTicket,
  Tender,
  Vendor,
  Lead,
} from "../types";
import { documentsService } from "../services/api/documentsService";
import { verificationService } from "../services/api";
import { VENDOR_CATEGORIES } from "../constants/vendorCategories";
import UploadCard from "./common/UploadCard";

type TabId =
  | "stats"
  | "consultations"
  | "tenders"
  | "vendor-registry"
  | "website-publishing"
  | "organization-verification"
  | "leads"
  | "support"
  | "profile";

type TenderForm = {
  service: string;
  category: string;
  region: string;
  budget: string;
  deadline: string;
  description: string;
  vendorEmails: string;
};

type LeadForm = Pick<
  Lead,
  | "name"
  | "email"
  | "patientPhone"
  | "title"
  | "description"
  | "serviceCategory"
  | "country"
  | "city"
>;

type LocalMessage = {
  id: string;
  text: string;
  sender: string;
  senderName: string;
  time: string;
};

const Demo_TENDER: TenderForm = {
  service: "Robotic Knee Replacement",
  category: "Orthopaedics",
  region: "Southeast Asia",
  budget: "USD 360,000",
  deadline: "72 Hours",
  description:
    "Institutional request for Robotic Knee Replacement excellence in Southeast Asia.",
  vendorEmails: "",
};

const EMPTY_TENDER: TenderForm = {
  service: "",
  category: "",
  region: "",
  budget: "",
  deadline: "",
  description: "",
  vendorEmails: "",
};

const EMPTY_LEAD: LeadForm = {
  name: "",
  email: "",
  patientPhone: "",
  title: "",
  description: "",
  serviceCategory: "",
  country: "",
  city: "",
};

const tabs: Array<{ id: TabId; label: string; icon: React.ElementType }> = [
  { id: "stats", label: "Dashboard", icon: Activity },
  { id: "consultations", label: "Consultations", icon: MessageCircle },
  { id: "leads", label: "Leads", icon: Users },
  { id: "tenders", label: "Tender Management", icon: Gavel },
  { id: "vendor-registry", label: "Vendor Registry", icon: Globe2 },
  { id: "website-publishing", label: "Website Publishing", icon: Globe2 },

  {
    id: "organization-verification",
    label: "Organization Verification",
    icon: FileSearch,
  },
  { id: "support", label: "Support Center", icon: LifeBuoy },
  { id: "profile", label: "Administration", icon: ShieldAlert },
];

const dateLabel = (value?: string) => {
  if (!value) return "Recently";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const numberFromMoney = (value?: string) => {
  const parsed = Number(String(value || "").replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatMoney = (value: number, fallback = "USD") => {
  if (!value) return fallback;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
};

const apiError = (error: any) =>
  error?.response?.data?.error || error?.message || "API request failed.";

export default function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<TabId>("stats");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [tenders, setTenders] = useState<Tender[]>([]);
  const [bids, setBids] = useState<Bid[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [verificationStats, setVerificationStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isNewLeadOpen, setIsNewLeadOpen] = useState(false);
  const [leadForm, setLeadForm] = useState<LeadForm>(EMPTY_LEAD);
  const [isCreatingLead, setIsCreatingLead] = useState(false);
  const [leadNotes, setLeadNotes] = useState<any[]>([]);
  const [leadNote, setLeadNote] = useState("");
  const [consultations, setConsultations] = useState<any[]>([]);
  const [consultationTab, setConsultationTab] = useState<
    "ACTIVE" | "CONVERTED" | "REJECTED"
  >("ACTIVE");
  const [pendingOnboardings, setPendingOnboardings] = useState<
    import("../types").VendorOnboarding[]
  >([]);
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null);
  const [isRebidModalOpen, setIsRebidModalOpen] = useState(false);
  const [selectedRebidVendors, setSelectedRebidVendors] = useState<string[]>(
    [],
  );
  const [tenderRankings, setTenderRankings] = useState<any[]>([]);
  const [currentTenderRound, setCurrentTenderRound] = useState<any>(null);
  const [threads, setThreads] = useState<any[]>([]);
  const [selectedThread, setSelectedThread] = useState<any | null>(null);
  const [threadMessages, setThreadMessages] = useState<any[]>([]);
  const [workspaceDocuments, setWorkspaceDocuments] = useState<any[]>([]);
  const [uploadingDocument, setUploadingDocument] = useState(false);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [showAwardConfirm, setShowAwardConfirm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null,
  );
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [selectedConsultation, setSelectedConsultation] = useState<any | null>(
    null,
  );
  const [selectedOnboarding, setSelectedOnboarding] = useState<
    import("../types").VendorOnboarding | null
  >(null);
  const [onboardingApprovalCreds, setOnboardingApprovalCreds] = useState<{
    username: string;
    password: string;
  } | null>(null);
  const [isNewTenderOpen, setIsNewTenderOpen] = useState(false);
  const [tenderForm, setTenderForm] = useState<TenderForm>(EMPTY_TENDER);
  const [shouldBroadcast, setShouldBroadcast] = useState(true);
  const [ticketReply, setTicketReply] = useState("");
  const [leadReply, setLeadReply] = useState("");
  const [remarks, setRemarks] = useState("");
  const [ticketMessages, setTicketMessages] = useState<
    Record<string, LocalMessage[]>
  >({});
  const [leadMessages, setLeadMessages] = useState<
    Record<string, LocalMessage[]>
  >({});
  const [adminGenerationSecret, setAdminGenerationSecret] = useState("");
  const [generatedCredentials, setGeneratedCredentials] =
    useState<AdminCredentials | null>(null);
  const [credentialStatus, setCredentialStatus] = useState<string | null>(null);
  const [websitePublishingVendors, setWebsitePublishingVendors] = useState<
    any[]
  >([]);
  const [websitePublishingLoading, setWebsitePublishingLoading] =
    useState(false);
  const [selectedWebsiteVendor, setSelectedWebsiteVendor] = useState<
    any | null
  >(null);
  const [websiteTab, setWebsiteTab] = useState<
    | "overview"
    | "highlights"
    | "offerings"
    | "gallery"
    | "credentials"
    | "testimonials"
  >("overview");
  const [websiteProfile, setWebsiteProfile] = useState<any | null>(null);
  const [websiteProfileLoading, setWebsiteProfileLoading] = useState(false);
  const [websiteForm, setWebsiteForm] = useState({
    profileHeadline: "",
    description: "",
    profileTemplate: "",
    coverImage: "",
    brochureUrl: "",
    highlights: {} as Record<string, string>,
    hasConcierge: false,
    featured: false,
    displayOrder: 0,
    status: "DRAFT",
    seoTitle: "",
    seoDescription: "",
  });
  const [websiteServices, setWebsiteServices] = useState<any[]>([]);
  const [websiteServicesLoading, setWebsiteServicesLoading] = useState(false);
  const [isOfferingModalOpen, setIsOfferingModalOpen] = useState(false);

  const [offeringForm, setOfferingForm] = useState({
    name: "",
    description: "",
  });
  const [editingOfferingId, setEditingOfferingId] = useState<string | null>(
    null,
  );
  const isEditingOffering = editingOfferingId !== null;

  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false);
  const [credentialForm, setCredentialForm] = useState({
    title: "",
    description: "",
  });

  const [editingCredentialId, setEditingCredentialId] = useState<string | null>(
    null,
  );
  const isEditingCredential = editingCredentialId !== null;

  const [websiteAccreditations, setWebsiteAccreditations] = useState<any[]>([]);
  const [websiteAccreditationsLoading, setWebsiteAccreditationsLoading] =
    useState(false);

  const [websiteGallery, setWebsiteGallery] = useState<any[]>([]);
  const [websiteGalleryLoading, setWebsiteGalleryLoading] = useState(false);

  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [galleryForm, setGalleryForm] = useState({
    imageUrl: "",
    caption: "",
  });

  const [editingGalleryId, setEditingGalleryId] = useState<string | null>(null);
  const isEditingGallery = editingGalleryId !== null;
  const [websiteTestimonials, setWebsiteTestimonials] = useState<any[]>([]);
  const [websiteTestimonialsLoading, setWebsiteTestimonialsLoading] =
    useState(false);

  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);

  const [testimonialForm, setTestimonialForm] = useState({
    patientName: "",
    country: "",
    testimonial: "",
  });

  const [editingTestimonialId, setEditingTestimonialId] = useState<
    string | null
  >(null);

  const isEditingTestimonial = editingTestimonialId !== null;

  const handleWorkspaceUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file || !selectedThread) {
      return;
    }

    try {
      setUploadingDocument(true);

      const { uploadUrl, s3Key } = await documentsService.getUploadUrl(
        selectedThread.id,
        file.name,
        file.type,
      );

      await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      await documentsService.createWorkspaceDocument({
        threadId: selectedThread.id,
        fileName: file.name,
        s3Key,
        uploadedByRole: "ADMIN",
        uploadedByName: "Admin",
      });

      const docs = await documentsService.getWorkspaceDocuments(
        selectedThread.id,
      );

      setWorkspaceDocuments(docs);
    } catch (error) {
      console.error("Document upload failed", error);

      alert("Failed to upload document");
    } finally {
      setUploadingDocument(false);
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!window.confirm("Delete this document?")) {
      return;
    }

    try {
      await documentsService.deleteWorkspaceDocument(documentId);

      if (selectedThread) {
        const docs = await documentsService.getWorkspaceDocuments(
          selectedThread.id,
        );

        setWorkspaceDocuments(docs);
      }
    } catch (error) {
      console.error("Failed to delete document", error);

      alert("Failed to delete document");
    }
  };

  const selectedCategory = useMemo(() => {
    return VENDOR_CATEGORIES.find(
      (category) => category.name === selectedWebsiteVendor?.mainCategory,
    );
  }, [selectedWebsiteVendor]);

  const availableOfferingSuggestions = useMemo(() => {
    if (!selectedCategory) return [];

    return selectedCategory.offeringSuggestions.filter(
      (suggestion) =>
        !websiteServices.some(
          (service) =>
            service.name.trim().toLowerCase() ===
            suggestion.trim().toLowerCase(),
        ),
    );
  }, [selectedCategory, websiteServices]);

  const availableCredentialSuggestions = useMemo(() => {
    if (!selectedCategory) return [];

    return selectedCategory.credentialSuggestions.filter(
      (suggestion) =>
        !websiteAccreditations.some(
          (credential) =>
            credential.title.trim().toLowerCase() ===
            suggestion.trim().toLowerCase(),
        ),
    );
  }, [selectedCategory, websiteAccreditations]);

  const selectedTenderBids = useMemo(
    () =>
      selectedTender
        ? bids.filter((bid) => bid.tenderId === selectedTender.id)
        : [],
    [bids, selectedTender],
  );

  const selectedVendorBid = useMemo(
    () =>
      selectedThread
        ? selectedTenderBids.find(
            (bid) => bid.vendorId === selectedThread.vendor?.id,
          )
        : null,
    [selectedThread, selectedTenderBids],
  );

  const selectedTenderThreads = useMemo(
    () =>
      selectedTender
        ? threads.filter((thread) => thread.tender?.id === selectedTender.id)
        : [],
    [threads, selectedTender],
  );

  const filteredTenders = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return tenders;
    return tenders.filter((tender) =>
      [
        tender.id,
        tender.title,
        tender.serviceCategory,
        tender.region,
        tender.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [query, tenders]);

  const activeConsultations = consultations.filter(
    (c) =>
      c.status === "NEW" ||
      c.status === "CONTACTED" ||
      c.status === "QUALIFIED",
  );

  const convertedConsultations = consultations.filter(
    (c) => c.status === "CONVERTED",
  );

  const rejectedConsultations = consultations.filter(
    (c) => c.status === "REJECTED",
  );

  const filteredleads = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle || activeTab !== "leads") return leads;
    return leads.filter((item) =>
      [
        item.id,
        item.name,
        item.email,
        item.patientPhone,
        item.description,
        item.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle),
    );
  }, [activeTab, leads, query]);

  const loadApiData = async () => {
    setError(null);
    setLoading(true);
    try {
      console.log("TENDERS START");
      const tendersRes = await tendersService.getTenders();
      console.log("TENDERS OK", tendersRes);

      const threadsRes = await tenderWorkspaceService.getThreads();
      console.log("THREADS OK", threadsRes);
      setThreads(threadsRes);

      console.log("VENDORS START");
      const vendorsRes = await vendorsService.getVendors();
      console.log("VENDORS OK", vendorsRes);

      const ticketsRes = { tickets: [] };

      console.log("LEADS START");
      const leadsRes = await leadsService.getLeads();
      console.log("LEADS OK", leadsRes);

      console.log("CONSULTATIONS START");
      const consultationsRes = await consultationsService.getConsultations();
      console.log("CONSULTATIONS OK", consultationsRes);

      const vendorsResponse = await vendorsService.getVendors();

      setVendors(vendorsResponse.data);

      const onboardingsRes = await vendorsService.listPendingReviews();
      console.log("ONBOARDINGS OK", onboardingsRes);

      setTenders(tendersRes.tenders || []);
      //setBids(bidsRes.bids || []); temp
      setVendors(vendorsRes.data || []);
      setTickets(ticketsRes.tickets || []);
      setLeads(Array.isArray(leadsRes) ? leadsRes : []);
      setConsultations(Array.isArray(consultationsRes) ? consultationsRes : []);
      setPendingOnboardings(onboardingsRes.vendorOnboardings || []);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setLoading(false);
    }
  };

  const loadVerificationStats = async () => {
    try {
      const stats = await verificationService.getStats();
      setVerificationStats(stats);
    } catch (error) {
      console.error("Failed to load verification stats:", error);
    }
  };

  const loadPendingVerifications = async () => {
    try {
      const response = await verificationService.getPendingVerifications();
      setPendingVerifications(response.data || []);
    } catch (error) {
      console.error("Failed to load pending verifications:", error);
    }
  };

  useEffect(() => {
    if (activeTab === "organization-verification") {
      loadVerificationStats();
      loadPendingVerifications();
    }

    if (activeTab === "website-publishing") {
      loadWebsitePublishingVendors();
    }
  }, [activeTab]);

  useEffect(() => {
    loadApiData();
  }, []);

  useEffect(() => {
    setTenderForm((current) => {
      if (current.vendorEmails.trim()) return current;
      return {
        ...current,
        vendorEmails: vendors
          .map((vendor) => vendor.email)
          .filter(Boolean)
          .join("\n"),
      };
    });
  }, [vendors]);

  useEffect(() => {
    if (selectedLead) {
      setRemarks("");
    }
  }, [selectedLead]);

  const loadWebsitePublishingVendors = async () => {
    try {
      setWebsitePublishingLoading(true);

      const data = await websitePublishingService.getVendors();

      setWebsitePublishingVendors(data);
    } catch (error) {
      console.error("Failed to load website publishing vendors:", error);
    } finally {
      setWebsitePublishingLoading(false);
    }
  };

  const loadWebsiteServices = async (vendorId: string) => {
    try {
      setWebsiteServicesLoading(true);

      const services =
        await websitePublishingService.getWebsiteServices(vendorId);

      setWebsiteServices(services);
    } catch (error) {
      console.error("Failed to load website services:", error);
    } finally {
      setWebsiteServicesLoading(false);
    }
  };

  const loadWebsiteAccreditations = async (vendorId: string) => {
    try {
      setWebsiteAccreditationsLoading(true);

      const accreditations =
        await websitePublishingService.getWebsiteAccreditations(vendorId);

      setWebsiteAccreditations(accreditations);
    } catch (error) {
      console.error("Failed to load website accreditations:", error);
    } finally {
      setWebsiteAccreditationsLoading(false);
    }
  };

  const loadWebsiteGallery = async (vendorId: string) => {
    try {
      setWebsiteGalleryLoading(true);

      const gallery =
        await websitePublishingService.getWebsiteGallery(vendorId);

      setWebsiteGallery(gallery);
    } catch (error) {
      console.error("Failed to load website gallery:", error);
    } finally {
      setWebsiteGalleryLoading(false);
    }
  };

  const loadWebsiteTestimonials = async (vendorId: string) => {
    try {
      setWebsiteTestimonialsLoading(true);

      const testimonials =
        await websitePublishingService.getWebsiteTestimonials(vendorId);

      setWebsiteTestimonials(testimonials);
    } catch (error) {
      console.error("Failed to load testimonials:", error);
      setWebsiteTestimonials([]);
    } finally {
      setWebsiteTestimonialsLoading(false);
    }
  };

  const loadWebsiteProfile = async (vendorId: string) => {
    const populateWebsiteForm = (profile: any) => {
      setWebsiteForm({
        profileHeadline: profile.profileHeadline ?? "",
        description: profile.description ?? "",
        profileTemplate: profile.profileTemplate ?? "",
        coverImage: profile.coverImage ?? "",
        brochureUrl: profile.brochureUrl ?? "",
        highlights: profile.highlights ?? {},
        hasConcierge: profile.hasConcierge ?? false,
        featured: profile.featured ?? false,
        displayOrder: profile.displayOrder ?? 0,
        status: profile.status ?? "DRAFT",
        seoTitle: profile.seoTitle ?? "",
        seoDescription: profile.seoDescription ?? "",
      });
    };

    await loadWebsiteServices(vendorId);
    await loadWebsiteAccreditations(vendorId);
    await loadWebsiteGallery(vendorId);
    await loadWebsiteTestimonials(vendorId);

    try {
      setWebsiteProfileLoading(true);

      const data = await websitePublishingService.getWebsiteProfile(vendorId);

      setSelectedWebsiteVendor((previousVendor: any) =>
        previousVendor
          ? {
              ...previousVendor,
              mainCategory: data.vendor.mainCategory,
            }
          : previousVendor,
      );

      setWebsiteProfile(data);
      populateWebsiteForm(data);
    } catch (error) {
      console.error("Failed to load website profile:", error);
    } finally {
      setWebsiteProfileLoading(false);
    }
  };

  const loadThreadMessages = async (threadId: string) => {
    try {
      const messages = await tenderWorkspaceService.getMessages(threadId);

      setThreadMessages(messages);

      console.log("MESSAGES OK", messages);
    } catch (error) {
      console.error("Failed to load messages", error);
    }
    console.log("THREAD ID", threadId);
  };

  const sendThreadMessage = async () => {
    if (!selectedThread || !newMessage.trim()) {
      return;
    }

    try {
      await tenderWorkspaceService.sendMessage(selectedThread.id, newMessage);

      setNewMessage("");

      await loadThreadMessages(selectedThread.id);
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [threadMessages]);

  const handleCreateTender = async () => {
    if (!tenderForm.service.trim() || !tenderForm.category.trim()) {
      setError("Service and category are required.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const vendorEmails = tenderForm.vendorEmails
        .split(/\r?\n|,/)
        .map((email) => email.trim())
        .filter(Boolean);

      await tendersService.createTender({
        tenderData: {
          service: tenderForm.service.trim(),
          category: tenderForm.category.trim(),
          region: tenderForm.region.trim(),
          budget: tenderForm.budget.trim(),
          deadline: tenderForm.deadline.trim(),
          description: tenderForm.description.trim(),
        },
        vendorEmails,
        broadcast: shouldBroadcast,
      });

      setTenderForm({
        ...EMPTY_TENDER,
        vendorEmails: vendors.map((vendor) => vendor.email).join("\n"),
      });
      setIsNewTenderOpen(false);
      await loadApiData();
      setActiveTab("tenders");
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleCreateLead = async () => {
    try {
      setIsCreatingLead(true);

      await leadsService.createLead({
        name: leadForm.name,
        email: leadForm.email,
        patientPhone: leadForm.patientPhone,
        title: leadForm.title,
        description: leadForm.description,
        serviceCategory: leadForm.serviceCategory,
        country: leadForm.country,
        city: leadForm.city,
      });

      const refreshedLeads = await leadsService.getLeads();

      setLeads(refreshedLeads);

      setLeadForm(EMPTY_LEAD);

      setIsNewLeadOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreatingLead(false);
    }
  };

  const handleAwardBid = async () => {
    if (!selectedBid || !selectedTender) return;

    const confirmed = window.confirm(
      `Award tender to ${
        selectedBid.vendor?.companyName || selectedBid.vendorName
      }?`,
    );

    if (!confirmed) {
      return;
    }

    setBusy(true);
    setError(null);

    try {
      await tendersService.awardBid(selectedTender.id, selectedBid.id);

      setSelectedBid(null);
      setSelectedTender(null);

      await loadApiData();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleRequestRebid = async () => {
    if (!selectedTender) return;

    if (selectedRebidVendors.length === 0) {
      alert("Please select at least one vendor.");
      return;
    }

    try {
      await tendersService.requestRebid(
        selectedTender.id,
        selectedRebidVendors,
      );

      alert("Rebid round created successfully.");

      setIsRebidModalOpen(false);

      await loadApiData();
    } catch (error) {
      console.error(error);
      alert("Failed to create rebid round.");
    }
  };

  const handleTicketReply = async () => {
    if (!selectedTicket || !ticketReply.trim()) return;

    setBusy(true);
    setError(null);
    try {
      const text = ticketReply.trim();
      await supportService.addMessage(selectedTicket.id, {
        text,
        sender: "admin",
        senderName: "GMAA Backend Team",
      });

      const message = {
        id: `${selectedTicket.id}-${Date.now()}`,
        text,
        sender: "admin",
        senderName: "GMAA Backend Team",
        time: dateLabel(new Date().toISOString()),
      };
      setTicketMessages((prev) => ({
        ...prev,
        [selectedTicket.id]: [...(prev[selectedTicket.id] || []), message],
      }));
      setTicketReply("");
      await loadApiData();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleConsultationStatusUpdate = async (
    consultationId: string,
    status: "CONTACTED" | "QUALIFIED" | "CONVERTED" | "REJECTED",
    note: string,
  ) => {
    if (!note.trim()) {
      alert("Please add a note before updating the consultation.");
      return;
    }
    try {
      await consultationsService.updateConsultation(consultationId, {
        status,
        note: note,
        createdBy: "Admin",
      });

      await loadApiData();

      setSelectedConsultation(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleConvertToLead = async (consultationId: string) => {
    try {
      await consultationsService.convertToLead(consultationId);

      await loadApiData();

      setSelectedConsultation(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateLead = async (status?: string) => {
    if (!selectedLead) return;

    setBusy(true);
    setError(null);
    try {
      await leadsService.updateRouting(selectedLead.id, {
        routingType: status === "won" ? "TENDER" : "DIRECT",
      });
      if (status === "won") {
        setTenderForm({
          ...EMPTY_TENDER,
          service: selectedLead.serviceCategory || "",
          description: selectedLead.description || "",
          vendorEmails: vendors.map((vendor) => vendor.email).join("\n"),
        });
        setIsNewTenderOpen(true);
      }
      await loadApiData();
      setSelectedLead((current) =>
        current
          ? {
              ...current,
              status: status || current.status,
              remarks: remarks.trim(),
            }
          : current,
      );
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleOpenLead = async (leadId: string) => {
    try {
      const lead = await leadsService.getLeadById(leadId);

      const notes = await leadsService.getLeadNotes(leadId);

      console.log("LEAD NOTES", notes);

      setLeadNotes(notes);
      setSelectedLead(lead);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLeadReply = async () => {
    if (!selectedLead || !leadReply.trim()) return;

    setBusy(true);
    setError(null);
    try {
      const text = leadReply.trim();
      await leadsService.addMessage(selectedLead.id, {
        text,
        sender: "admin",
        senderName: "GMAA Support",
      });
      setLeadMessages((prev) => ({
        ...prev,
        [selectedLead.id]: [
          ...(prev[selectedLead.id] || []),
          {
            id: `${selectedLead.id}-${Date.now()}`,
            text,
            sender: "admin",
            senderName: "GMAA Support",
            time: dateLabel(new Date().toISOString()),
          },
        ],
      }));
      setLeadReply("");
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleSeed = async () => {
    setBusy(true);
    setError(null);
    try {
      await systemService.seedDemoData();
      await loadApiData();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const handlePurge = async () => {
    if (!window.confirm("Clear demo/admin data from the backend?")) return;
    setBusy(true);
    setError(null);
    try {
      await systemService.purgeDemoData();
      setSelectedTender(null);
      setSelectedBid(null);
      setSelectedTicket(null);
      setSelectedLead(null);
      await loadApiData();
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleGenerateAdminCredentials = async () => {
    if (!adminGenerationSecret.trim()) {
      setError(
        "Enter ADMIN_GENERATION_SECRET to create a new admin credential pair.",
      );
      return;
    }

    setBusy(true);
    setError(null);
    setCredentialStatus(null);
    try {
      const response = await authService.generateAdminCredentials(
        adminGenerationSecret.trim(),
      );
      setGeneratedCredentials(response.credentials);
      setCredentialStatus(
        "New admin credentials generated. Store them securely before leaving this page.",
      );
      setAdminGenerationSecret("");
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleOpenOnboardingReview = async (
    onboarding: import("../types").VendorOnboarding,
  ) => {
    setOnboardingApprovalCreds(null);
    setSelectedOnboarding(onboarding);
    setError(null);

    try {
      const response = await vendorsService.getOnboardingRecord(onboarding.id);
      setSelectedOnboarding(response.vendorOnboarding);
    } catch (err) {
      setError(apiError(err));
    }
  };

  const handleApproveOnboarding = async (
    vendorId: string,
    status: "PENDING_ACTIVATION" | "ACTIVE" = "ACTIVE",
    remarks?: string,
  ) => {
    setBusy(true);
    setError(null);
    try {
      const response = await vendorsService.approveOnboarding(
        vendorId,
        status,
        remarks,
      );
      setOnboardingApprovalCreds(response.credentials);
      await loadApiData();
      await loadVerificationStats();
      await loadPendingVerifications();
      setSelectedOnboarding(response.vendorOnboarding);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleVendorStatus = async (
    vendorId: string,
    currentStatus: string,
  ) => {
    try {
      const nextStatus = currentStatus === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

      await vendorsService.updateVendorStatus(vendorId, nextStatus);

      await loadApiData();
    } catch (error) {
      console.error(error);
      alert("Failed to update vendor status.");
    }
  };

  const handleRejectOnboarding = async (vendorId: string, remarks: string) => {
    if (
      !window.confirm("Are you sure you want to reject this vendor onboarding?")
    )
      return;

    setBusy(true);
    setError(null);
    try {
      await vendorsService.rejectOnboarding(vendorId, remarks);
      await loadApiData();
      await loadVerificationStats();
      await loadPendingVerifications();
      setSelectedOnboarding(null);
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleDownloadDocument = async (
    vendorId: string,
    documentType:
      | "business_license"
      | "moh_accreditation"
      | "tax_identification",
  ) => {
    setBusy(true);
    setError(null);
    try {
      const response = await vendorsService.getDocumentDownloadUrl(
        vendorId,
        documentType,
      );
      window.open(response.document.downloadUrl, "_blank");
    } catch (err) {
      setError(apiError(err));
    } finally {
      setBusy(false);
    }
  };

  const renderStats = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Active Tenders"
          value={String(tenders.filter((t) => t.status === "open").length)}
          icon={Gavel}
        />
        <StatCard
          title="Pending Bids"
          value={String(bids.filter((b) => b.status === "pending").length)}
          icon={Briefcase}
        />
        <StatCard
          title="Active Vendors"
          value={String(vendors.filter((v) => v.status === "ACTIVE").length)}
          icon={Globe2}
        />
        <StatCard
          title="Open Tickets"
          value={String(tickets.filter((t) => t.status !== "resolved").length)}
          icon={LifeBuoy}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel
          title="Recent Tenders"
          action={
            <TextButton onClick={() => setActiveTab("tenders")}>
              View All
            </TextButton>
          }
        >
          <div className="space-y-3">
            {tenders.slice(0, 5).map((tender) => (
              <ListRow
                key={tender.id}
                title={tender.title}
                meta={`${tender.tenderNumber} / ${tender.region}`}
                status={tender.status}
                onClick={async () => {
                  setActiveTab("tenders");

                  setSelectedTender(tender);
                  setSelectedThread(null);
                  setThreadMessages([]);

                  try {
                    const tenderBids = await bidsService.getTenderBids(
                      tender.id,
                    );

                    const tenderDetails = await tendersService.getTenderById(
                      tender.id,
                    );

                    setTenderRankings(tenderDetails.rankings || []);
                    setCurrentTenderRound(tenderDetails.currentRound || null);

                    setBids(tenderBids);
                  } catch (error) {
                    console.error("Failed to load tender bids", error);

                    setBids([]);
                  }
                }}
              />
            ))}
            {!tenders.length && (
              <EmptyState icon={Gavel} title="No tenders yet" />
            )}
          </div>
        </Panel>
        <Panel
          title="New Consultations"
          action={
            <TextButton onClick={() => setActiveTab("consultations")}>
              Review
            </TextButton>
          }
        >
          <div className="space-y-3">
            {activeConsultations.slice(0, 5).map((consultation) => (
              <ListRow
                key={consultation.id}
                title={consultation.name}
                meta={consultation.service || "No description"}
                status={consultation.status}
                onClick={() => {
                  setActiveTab("leads");
                  setSelectedConsultation(consultation);
                }}
              />
            ))}
            {!activeConsultations.length && (
              <EmptyState icon={Users} title="No consultations yet" />
            )}
          </div>
        </Panel>

        <Panel
          title="Recent leads"
          action={
            <TextButton onClick={() => setActiveTab("leads")}>
              Review
            </TextButton>
          }
        >
          <div className="space-y-3">
            {filteredleads.slice(0, 5).map((leads) => (
              <ListRow
                key={leads.id}
                title={leads.name}
                meta={
                  leads.description || leads.serviceCategory || "No description"
                }
                status={leads.status}
                onClick={() => {
                  setActiveTab("leads");
                  handleOpenLead(leads.id);
                }}
              />
            ))}
            {!filteredleads.length && (
              <EmptyState icon={Users} title="No leads yet" />
            )}
          </div>
        </Panel>
      </div>
    </div>
  );

  const renderTenders = () => (
    <div className="space-y-6">
      <Toolbar
        title="Internal Tendering"
        subtitle="Create, broadcast, review bids, and award tenders"
        right={
          <div className="flex flex-wrap gap-2">
            <IconButton
              onClick={handleSeed}
              disabled={busy}
              title="Seed demo data"
            >
              <RefreshCw size={16} className={busy ? "animate-spin" : ""} />
              Seed
            </IconButton>
            <IconButton
              onClick={handlePurge}
              disabled={busy}
              title="Purge demo data"
              tone="danger"
            >
              <X size={16} />
              Purge
            </IconButton>
            <IconButton
              onClick={() => setIsNewTenderOpen(true)}
              title="Post tender"
              tone="primary"
            >
              <Plus size={16} />
              New Tender
            </IconButton>
          </div>
        }
      />

      {selectedTender ? (
        <Panel
          title={selectedTender.title}
          action={
            <TextButton onClick={() => setSelectedTender(null)}>
              Back
            </TextButton>
          }
        >
          <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-3">
            <Metric label="Tender Number" value={selectedTender.tenderNumber} />
            <Metric label="Region" value={selectedTender.region} />
            <Metric
              label="Current Round"
              value={
                currentTenderRound
                  ? `R${currentTenderRound.roundNumber}`
                  : "N/A"
              }
            />
          </div>

          {tenderRankings.length > 0 && (
            <div className="mb-6 rounded-2xl border border-navy/10 p-5">
              <h3 className="mb-4 text-lg font-bold text-navy">
                Vendor Rankings
              </h3>

              <div className="space-y-3">
                {tenderRankings.map((ranking) => (
                  <div
                    key={ranking.vendorId}
                    className="flex items-center justify-between rounded-xl border border-navy/10 p-3"
                  >
                    <div>
                      <p className="font-bold text-navy">
                        {ranking.vendorName}
                      </p>

                      <p className="text-xs text-navy/40">
                        Latest Bid: {ranking.latestBid}
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-bold text-emerald-700">
                      {ranking.position}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mb-6 flex gap-3">
            {selectedTender.status === "DRAFT" && (
              <button
                onClick={async () => {
                  try {
                    await tendersService.broadcastTender(selectedTender.id);

                    alert("Tender broadcasted");

                    await loadApiData();

                    const updatedTender = filteredTenders.find(
                      (t) => t.id === selectedTender.id,
                    );

                    if (updatedTender) {
                      setSelectedTender(updatedTender);
                    }
                  } catch (error) {
                    console.error(error);
                    alert("Failed to broadcast tender");
                  }
                }}
                className="rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white"
              >
                Broadcast Tender
              </button>
            )}
            {selectedTender.status === "BROADCASTED" && (
              <button
                onClick={() => {
                  setSelectedRebidVendors([
                    ...new Set(selectedTenderBids.map((bid) => bid.vendorId)),
                  ]);
                  setIsRebidModalOpen(true);
                }}
                className="rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white"
              >
                Request Rebid
              </button>
            )}
          </div>

          <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="mb-6 rounded-2xl border border-navy/10 p-5">
              <h3 className="mb-4 text-lg font-bold text-navy">
                Tender Workspaces
              </h3>

              {selectedTenderThreads.length > 0 ? (
                <div className="space-y-3">
                  {selectedTenderThreads.map((thread) => (
                    <div
                      key={thread.id}
                      onClick={async () => {
                        setSelectedThread(thread);
                        setThreadMessages([]);
                        loadThreadMessages(thread.id);
                        try {
                          const docs =
                            await documentsService.getWorkspaceDocuments(
                              thread.id,
                            );
                          setWorkspaceDocuments(docs);
                        } catch (error) {
                          console.error(
                            "Failed to load workspace documents",
                            error,
                          );
                          setWorkspaceDocuments([]);
                        }
                      }}
                      className={`cursor-pointer rounded-xl border p-4 transition flex items-center justify-between ${
                        selectedThread?.id === thread.id
                          ? "border-navy bg-navy text-white"
                          : "border-navy/10 hover:bg-slate-50"
                      }`}
                    >
                      <div>
                        <p
                          className={`font-bold ${
                            selectedThread?.id === thread.id
                              ? "text-white"
                              : "text-navy"
                          }`}
                        >
                          {thread.vendor?.companyName}
                        </p>

                        <p
                          className={`mt-1 text-xs truncate ${selectedThread?.id === thread.id ? "text-white/70" : "text-navy/50"}`}
                        >
                          {thread.messages?.[0]?.content || "No messages yet"}
                        </p>
                        <p
                          className={`mt-1 text-[10px] ${selectedThread?.id === thread.id ? "text-white/50" : "text-navy/30"}`}
                        >
                          {thread.messages?.[0]?.createdAt
                            ? new Date(
                                thread.messages[0].createdAt,
                              ).toLocaleTimeString([], {
                                day: "2-digit",
                                month: "2-digit",
                                year: "2-digit",
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-navy/40">
                  No workspaces found for this tender
                </p>
              )}
            </div>

            {selectedThread && (
              <div className="lg:col-span-2">
                <div className="rounded-2xl border border-navy/10 p-5">
                  <h3 className="mb-4 text-lg font-bold text-navy">
                    Active Workspace
                  </h3>

                  <div className="mb-4">
                    <p className="font-semibold text-navy">
                      {selectedThread.vendor?.companyName}
                    </p>
                    <p className="text-xs text-navy/40">
                      Thread: {selectedThread.id}
                    </p>
                  </div>
                  <div className="mb-4 rounded-xl border border-navy/10 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <h4 className="font-bold text-navy">Documents</h4>

                      <button
                        onClick={() => documentInputRef.current?.click()}
                        className="rounded-lg bg-navy px-3 py-2 text-xs font-bold text-white"
                      >
                        Upload
                      </button>

                      <input
                        ref={documentInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleWorkspaceUpload}
                      />
                    </div>

                    {workspaceDocuments.length > 0 ? (
                      <div className="space-y-2">
                        {workspaceDocuments.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between rounded-lg border border-navy/10 p-2"
                          >
                            <span className="text-sm text-navy">
                              {doc.fileName}
                            </span>

                            <div className="flex items-center gap-3">
                              <a
                                href={doc.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs font-bold text-navy"
                              >
                                View
                              </a>

                              <a
                                href={doc.fileUrl}
                                download={doc.fileName}
                                className="text-xs font-bold text-cyan-600"
                              >
                                Download
                              </a>
                            </div>
                            <button
                              onClick={() => handleDeleteDocument(doc.id)}
                              className="ml-3 text-xs font-bold text-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-navy/40">
                        No documents uploaded yet.
                      </p>
                    )}
                  </div>

                  <div className="mb-4 h-80 overflow-y-auto space-y-3">
                    {threadMessages.map((message) => (
                      <div
                        key={`wrapper-${message.id}`}
                        className={`mb-3 flex ${
                          message.sender?.role === "ADMIN"
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`inline-block max-w-[75%] rounded-xl p-3 ${message.sender?.role === "ADMIN" ? "ml-auto bg-navy text-white" : "bg-slate-100 text-navy"}`}
                        >
                          <p
                            className={`text-xs ${message.sender?.role === "ADMIN" ? "text-white/70" : "text-navy/40"}`}
                          >
                            {message.sender?.role}
                          </p>

                          <p
                            className={`text-sm ${message.sender?.role === "ADMIN" ? "text-white" : "text-navy"}`}
                          >
                            {message.content}
                          </p>

                          <p
                            className={`mt-1 text-[10px] ${
                              message.sender?.role === "ADMIN"
                                ? "text-white/60"
                                : "text-navy/40"
                            }`}
                          >
                            {new Date(message.createdAt).toLocaleString([], {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>

                  {threadMessages.length === 0 && (
                    <p className="text-sm text-navy/40">
                      No messages in this workspace yet.
                    </p>
                  )}

                  <div className="mt-6 flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 rounded-xl border border-navy/10 px-4 py-3"
                    />

                    <button
                      onClick={sendThreadMessage}
                      className="rounded-xl bg-navy px-5 py-3 font-bold text-white"
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left">
              <thead>
                <tr className="border-b border-navy/10 text-[10px] uppercase tracking-[0.18em] text-navy/40">
                  <th className="py-4 pr-6">Vendor</th>
                  <th className="py-4 pr-6">Round</th>
                  <th className="py-4 pr-6">Amount</th>
                  <th className="py-4 pr-6">Status</th>
                  <th className="py-4 pr-6">Submitted</th>
                  <th className="py-4 pr-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {selectedTenderBids.map((bid) => (
                  <tr key={bid.id} className="border-b border-navy/5">
                    <td className="py-5 pr-6">
                      <p className="font-bold text-navy">
                        {bid.vendor?.companyName}
                      </p>

                      <p className="mt-1 text-xs font-mono text-navy/40">
                        {bid.vendor?.vendorNumber}
                      </p>
                    </td>
                    <td className="py-5 pr-6">
                      <span className="rounded-full bg-navy/5 px-3 py-1 text-xs font-bold text-navy">
                        R{bid.round?.roundNumber}
                      </span>
                    </td>
                    <td className="py-5 pr-6 font-bold text-navy">
                      {bid.amount}
                    </td>
                    <td className="py-5 pr-6">
                      <StatusPill status={bid.status} />
                    </td>
                    <td className="py-5 pr-6 text-sm text-navy/50">
                      {dateLabel(bid.createdAt)}
                    </td>
                    <td className="py-5 pr-6 text-right">
                      <TextButton onClick={() => setSelectedBid(bid)}>
                        Analyze
                      </TextButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!selectedTenderBids.length && (
            <EmptyState icon={Briefcase} title="No bids for this tender" />
          )}
        </Panel>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredTenders.map((tender) => (
            <button
              key={tender.id}
              onClick={async () => {
                setSelectedTender(tender);
                setSelectedThread(null);
                setThreadMessages([]);
                try {
                  const tenderBids = await bidsService.getTenderBids(tender.id);
                  console.log("TENDER BIDS", tenderBids); // test
                  const tenderDetails = await tendersService.getTenderById(
                    tender.id,
                  );
                  setTenderRankings(tenderDetails.rankings || []);
                  setCurrentTenderRound(tenderDetails.currentRound || null);
                  console.log("RANKINGS", tenderDetails.rankings); // test
                  console.log("CURRENT ROUND", tenderDetails.currentRound); //test
                  setBids(tenderBids);
                } catch (error) {
                  console.error("Failed to load tender bids", error);

                  setBids([]);
                }
              }}
              className="rounded-3xl border border-navy/5 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <div className="mb-5 flex items-start justify-between gap-4">
                <span className="rounded-full bg-brand-red/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-brand-red">
                  {tender.tenderNumber}
                </span>
                <StatusPill status={tender.status} />
              </div>
              <h3 className="text-xl font-bold uppercase leading-tight text-navy">
                {tender.title}
              </h3>
              <p className="mt-3 line-clamp-2 text-sm text-navy/50">
                {tender.description}
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-xs font-bold uppercase tracking-[0.12em] text-navy/40">
                <span>{tender.serviceCategory}</span>
                <span>{tender.region}</span>
                <span>{tender._count?.bids ?? 0} bids </span>
              </div>
              <div className="mt-6 flex justify-end">
                <ArrowRight size={20} className="text-navy/30" />
              </div>
            </button>
          ))}
          {!filteredTenders.length && (
            <EmptyState icon={Gavel} title="No tenders found" />
          )}
        </div>
      )}
    </div>
  );

  const renderVendors = () => {
    return (
      <div className="space-y-6">
        <Toolbar
          title="Global Registry"
          subtitle="Vendor Status, and active profiles"
        />
        <Panel title="Active Vendors">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left">
              <thead>
                <tr className="border-b border-navy/10 text-[10px] uppercase tracking-[0.18em] text-navy/40">
                  <th className="py-4 pr-6">ID</th>
                  <th className="py-4 pr-6">Vendor</th>
                  <th className="py-4 pr-6">Specialty</th>
                  <th className="py-4 pr-6">Location</th>
                  <th className="py-4 pr-6">Platform Status</th>
                  <th className="py-4 pr-6">Action</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id} className="border-b border-navy/5">
                    <td className="py-5 pr-6">
                      <span className="rounded bg-slate-100 px-2 py-1 text-xs font-mono text-slate-700">
                        {vendor.vendorNumber}
                      </span>
                    </td>
                    <td className="py-5 pr-6">
                      <p className="font-bold text-navy">{vendor.name}</p>
                      <p className="mt-1 text-xs text-navy/40">
                        {vendor.email}
                      </p>
                    </td>
                    <td className="py-5 pr-6 text-sm text-navy/60">
                      {vendor.specialty}
                    </td>
                    <td className="py-5 pr-6 text-sm text-navy/60">
                      {vendor.location}
                    </td>
                    <td className="py-5 pr-6">
                      <StatusPill status={vendor.status} />
                    </td>

                    <td className="py-5 pr-6">
                      <button
                        onClick={() =>
                          handleVendorStatus(vendor.id, vendor.status)
                        }
                        className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white"
                      >
                        {vendor.status === "ACTIVE" ? "Suspend" : "Activate"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!vendors.length && (
              <EmptyState icon={Globe2} title="No vendors found" />
            )}
          </div>
        </Panel>
      </div>
    );
  };

  const renderWebsitePublishing = () => {
    if (selectedWebsiteVendor) {
      return renderWebsiteWorkspace();
    }
    return (
      <div className="space-y-6">
        <Toolbar
          title="Website Publishing"
          subtitle="Manage public vendor website profiles"
        />

        <Panel title="Website Profiles">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left">
              <thead>
                <tr className="border-b border-navy/10 text-[10px] uppercase tracking-[0.18em] text-navy/40">
                  <th className="py-4 pr-6">Vendor ID</th>
                  <th className="py-4 pr-6">Vendor</th>
                  <th className="py-4 pr-6">Category</th>
                  <th className="py-4 pr-6">Verification</th>
                  <th className="py-4 pr-6">Website Status</th>
                  <th className="py-4 pr-6">Featured</th>
                  <th className="py-4 pr-6">Action</th>
                </tr>
              </thead>

              <tbody>
                {websitePublishingVendors.map((vendor) => (
                  <tr
                    key={vendor.id}
                    className="border-b border-navy/5 hover:bg-slate-bg/30"
                  >
                    <td className="py-5 pr-6">
                      <span className="rounded bg-slate-100 px-2 py-1 text-xs font-mono text-slate-700">
                        {vendor.vendorNumber}
                      </span>
                    </td>

                    <td className="py-5 pr-6">
                      <p className="font-bold text-navy">
                        {vendor.companyName}
                      </p>
                    </td>

                    <td className="py-5 pr-6 text-sm text-navy/60">
                      {vendor.category}
                    </td>

                    <td className="py-5 pr-6">
                      <StatusPill status={vendor.verificationStatus} />
                    </td>

                    <td className="py-5 pr-6">
                      <StatusPill status={vendor.websiteStatus} />
                    </td>

                    <td className="py-5 pr-6 text-sm font-bold text-navy">
                      {vendor.featured ? "⭐ Featured" : "—"}
                    </td>

                    <td className="py-5 pr-6">
                      <TextButton
                        onClick={async () => {
                          setSelectedWebsiteVendor(vendor);
                          setWebsiteTab("overview");
                          await loadWebsiteProfile(vendor.id);
                        }}
                      >
                        Manage Website
                      </TextButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {!vendors.length && (
              <EmptyState icon={Globe2} title="No website profiles found" />
            )}
          </div>
        </Panel>
      </div>
    );
  };

  const renderWebsiteWorkspace = () => {
    return (
      <div className="space-y-6">
        <Toolbar
          title={selectedWebsiteVendor.companyName}
          subtitle="Website Publishing Workspace"
        />

        <Panel title="Website Workspace">
          <div className="flex items-center justify-between mb-6">
            <TextButton
              onClick={() => {
                setSelectedWebsiteVendor(null);
                setWebsiteTab("overview");
              }}
            >
              ← Back to Website Profiles
            </TextButton>

            <StatusPill status={selectedWebsiteVendor.websiteStatus} />
          </div>

          <div className="flex gap-3 border-b border-slate-200 pb-4">
            <button
              onClick={() => setWebsiteTab("overview")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                websiteTab === "overview"
                  ? "bg-navy text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Overview
            </button>

            <button
              onClick={() => setWebsiteTab("highlights")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                websiteTab === "highlights"
                  ? "bg-navy text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Highlights
            </button>

            <button
              onClick={() => setWebsiteTab("offerings")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                websiteTab === "offerings"
                  ? "bg-navy text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Offerings
            </button>

            <button
              onClick={() => setWebsiteTab("gallery")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                websiteTab === "gallery"
                  ? "bg-navy text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Gallery
            </button>

            <button
              onClick={() => setWebsiteTab("credentials")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                websiteTab === "credentials"
                  ? "bg-navy text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Credentials
            </button>

            <button
              onClick={() => setWebsiteTab("testimonials")}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                websiteTab === "testimonials"
                  ? "bg-navy text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              Testimonials
            </button>
          </div>

          <div className="py-12">
            {websiteTab === "overview" && (
              <div className="space-y-6">
                <Panel title="Profile Information">
                  <div className="space-y-5">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-navy">
                        Profile Headline
                      </label>

                      <input
                        type="text"
                        value={websiteForm.profileHeadline}
                        onChange={(e) =>
                          setWebsiteForm((prev) => ({
                            ...prev,
                            profileHeadline: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-navy focus:outline-none"
                        placeholder="Leading Cardiac Care Center"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-navy">
                        Description
                      </label>

                      <textarea
                        rows={6}
                        value={websiteForm.description}
                        onChange={(e) =>
                          setWebsiteForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-navy focus:outline-none resize-none"
                        placeholder="Describe the organization..."
                      />
                    </div>
                  </div>
                </Panel>
                <Panel title="Media">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <UploadCard
                      title="Cover Image"
                      type="image"
                      module="website"
                      ownerId={selectedWebsiteVendor.id}
                      folder="cover-image"
                      accept="image/*"
                      value={websiteForm.coverImage}
                      allowDelete
                      onUploaded={async (url) => {
                        setWebsiteForm((prev) => ({
                          ...prev,
                          coverImage: url,
                        }));

                        await websitePublishingService.updateWebsiteProfile(
                          selectedWebsiteVendor.id,
                          {
                            coverImage: url,
                          },
                        );
                      }}
                      onDelete={async () => {
                        await websitePublishingService.updateWebsiteProfile(
                          selectedWebsiteVendor.id,
                          {
                            coverImage: null,
                          },
                        );

                        setWebsiteForm((prev) => ({
                          ...prev,
                          coverImage: "",
                        }));
                      }}
                    />

                    <UploadCard
                      title="Brochure"
                      type="document"
                      module="website"
                      ownerId={selectedWebsiteVendor.id}
                      folder="brochure"
                      accept=".pdf"
                      value={websiteForm.brochureUrl}
                      allowDelete
                      onUploaded={async (url) => {
                        setWebsiteForm((prev) => ({
                          ...prev,
                          brochureUrl: url,
                        }));

                        await websitePublishingService.updateWebsiteProfile(
                          selectedWebsiteVendor.id,
                          {
                            brochureUrl: url,
                          },
                        );
                      }}
                      onDelete={async () => {
                        await websitePublishingService.updateWebsiteProfile(
                          selectedWebsiteVendor.id,
                          {
                            brochureUrl: null,
                          },
                        );

                        setWebsiteForm((prev) => ({
                          ...prev,
                          brochureUrl: "",
                        }));
                      }}
                    />
                  </div>
                </Panel>
                <Panel title="Website features">
                  <div className="mt-6 flex items-center justify-between rounded-xl border border-slate-200 p-4">
                    <div>
                      <p className="font-semibold text-navy">
                        International Concierge
                      </p>

                      <p className="text-sm text-slate-500">
                        Show concierge support on the public profile.
                      </p>
                    </div>

                    <input
                      type="checkbox"
                      checked={websiteForm.hasConcierge}
                      onChange={(e) =>
                        setWebsiteForm((prev) => ({
                          ...prev,
                          hasConcierge: e.target.checked,
                        }))
                      }
                      className="h-5 w-5"
                    />
                  </div>
                </Panel>
                <Panel title="Publishing & SEO">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                        <div>
                          <p className="font-semibold text-navy">
                            Featured Profile
                          </p>

                          <p className="text-sm text-slate-500">
                            Highlight this organization on the website.
                          </p>
                        </div>

                        <input
                          type="checkbox"
                          checked={websiteForm.featured}
                          onChange={(e) =>
                            setWebsiteForm((prev) => ({
                              ...prev,
                              featured: e.target.checked,
                            }))
                          }
                          className="h-5 w-5"
                        />
                      </div>

                      <div>
                        <label className="mb-2 block text-sm font-semibold text-navy">
                          Display Order
                        </label>

                        <input
                          type="number"
                          value={websiteForm.displayOrder}
                          onChange={(e) =>
                            setWebsiteForm((prev) => ({
                              ...prev,
                              displayOrder: Number(e.target.value),
                            }))
                          }
                          className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-navy focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-navy">
                        SEO Title
                      </label>

                      <input
                        type="text"
                        value={websiteForm.seoTitle}
                        onChange={(e) =>
                          setWebsiteForm((prev) => ({
                            ...prev,
                            seoTitle: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-navy focus:outline-none"
                        placeholder="Global Heart Institute"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-navy">
                        SEO Description
                      </label>

                      <textarea
                        rows={4}
                        value={websiteForm.seoDescription}
                        onChange={(e) =>
                          setWebsiteForm((prev) => ({
                            ...prev,
                            seoDescription: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-slate-200 px-4 py-3 resize-none focus:border-navy focus:outline-none"
                        placeholder="Describe this organization for search engines..."
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={async () => {
                          await websitePublishingService.updateWebsiteProfile(
                            selectedWebsiteVendor.id,
                            websiteForm,
                          );

                          alert("Website profile updated successfully.");
                        }}
                        className="rounded-xl bg-navy px-6 py-3 font-semibold text-white hover:bg-navy/90"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </Panel>
              </div>
            )}

            {websiteTab === "highlights" && (
              <Panel title="Highlights">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-navy">Category</h3>

                      <p className="text-sm text-slate-500 mt-1">
                        Automatically configured from Vendor Profile.
                      </p>
                    </div>

                    <div className="rounded-xl bg-white border border-slate-200 px-5 py-3 font-semibold text-navy">
                      {selectedWebsiteVendor.mainCategory || "Not Assigned"}
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  {selectedCategory ? (
                    <Panel title="Organisation Highlights">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {selectedCategory.highlights.map((field) => (
                          <div key={field.key}>
                            <label className="mb-2 block text-sm font-semibold text-navy">
                              {field.label}
                            </label>

                            <input
                              type="text"
                              value={websiteForm.highlights?.[field.key] || ""}
                              onChange={(e) =>
                                setWebsiteForm((prev: any) => ({
                                  ...prev,
                                  highlights: {
                                    ...(prev.highlights || {}),
                                    [field.key]: e.target.value,
                                  },
                                }))
                              }
                              placeholder={field.placeholder}
                              className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-navy focus:outline-none"
                            />
                          </div>
                        ))}
                      </div>
                    </Panel>
                  ) : (
                    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
                      <h3 className="text-lg font-bold text-navy">
                        No preset found
                      </h3>

                      <p className="mt-3 text-slate-500">
                        This category doesn't have a Website Publishing preset
                        yet.
                      </p>
                    </div>
                  )}
                </div>
              </Panel>
            )}

            {websiteTab === "offerings" && (
              <Panel title="Organization Offerings">
                {websiteServicesLoading ? (
                  <div className="py-12 text-center text-slate-500">
                    Loading offerings...
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-navy mb-3">
                        Suggested Offerings
                      </h3>

                      <p className="text-sm text-slate-500 mb-4">
                        Click a suggestion to quickly add it to this
                        organization's website.
                      </p>

                      <div className="flex flex-wrap gap-3">
                        {availableOfferingSuggestions.map((offering) => (
                          <button
                            key={offering}
                            type="button"
                            onClick={async () => {
                              if (!selectedWebsiteVendor) return;

                              try {
                                await websitePublishingService.createWebsiteService(
                                  selectedWebsiteVendor.id,
                                  {
                                    name: offering,
                                    description: "",
                                    sortOrder: websiteServices.length + 1,
                                  },
                                );

                                await loadWebsiteServices(
                                  selectedWebsiteVendor.id,
                                );
                              } catch (error) {
                                console.error(
                                  "Failed to create offering:",
                                  error,
                                );
                              }
                            }}
                            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-navy transition hover:border-navy hover:bg-navy hover:text-white"
                          >
                            {offering}
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            setOfferingForm({
                              name: "",
                              description: "",
                            });

                            setIsOfferingModalOpen(true);
                          }}
                          className="rounded-full border border-dashed border-navy px-4 py-2 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white"
                        >
                          + Custom Offering
                        </button>
                      </div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-navy mb-3">
                        Current Offerings
                      </h3>

                      {websiteServices.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                          No offerings added yet.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {websiteServices.map((service) => (
                            <div
                              key={service.id}
                              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
                            >
                              <div>
                                <p className="font-semibold text-navy">
                                  {service.name}
                                </p>

                                {service.description && (
                                  <p className="mt-1 text-sm text-slate-500">
                                    {service.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingOfferingId(service.id);

                                    setOfferingForm({
                                      name: service.name,
                                      description: service.description ?? "",
                                    });

                                    setIsOfferingModalOpen(true);
                                  }}
                                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (!confirm(`Delete "${service.name}"?`))
                                      return;

                                    try {
                                      await websitePublishingService.deleteWebsiteService(
                                        service.id,
                                      );

                                      await loadWebsiteServices(
                                        selectedWebsiteVendor.id,
                                      );
                                    } catch (error) {
                                      console.error(error);
                                    }
                                  }}
                                  className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Panel>
            )}

            {websiteTab === "gallery" && (
              <Panel title="Gallery">
                {websiteGalleryLoading ? (
                  <div className="py-12 text-center text-slate-500">
                    Loading gallery...
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-navy">
                          Gallery Images
                        </h3>

                        <p className="text-sm text-slate-500 mt-1">
                          Showcase this organization's facilities, equipment and
                          services.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setGalleryForm({
                            imageUrl: "",
                            caption: "",
                          });

                          setIsGalleryModalOpen(true);
                        }}
                        className="rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white hover:bg-brand-red transition"
                      >
                        + Upload Image
                      </button>
                    </div>

                    {websiteGallery.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
                        No gallery images uploaded yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {websiteGallery.map((image) => (
                          <div
                            key={image.id}
                            className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                          >
                            <img
                              src={image.imageUrl}
                              alt={image.title}
                              className="h-56 w-full object-cover"
                            />

                            <div className="p-4">
                              <h4 className="font-semibold text-navy">
                                {image.title}
                              </h4>

                              {image.description && (
                                <p className="mt-2 text-sm text-slate-500">
                                  {image.description}
                                </p>
                              )}

                              <div className="mt-4 flex justify-end gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingGalleryId(image.id);

                                    setGalleryForm({
                                      imageUrl: image.imageUrl,
                                      caption: image.caption ?? "",
                                    });

                                    setIsGalleryModalOpen(true);
                                  }}
                                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
                                >
                                  Edit
                                </button>

                                <button
                                  onClick={async () => {
                                    if (!confirm("Delete this image?")) return;

                                    try {
                                      await websitePublishingService.deleteWebsiteGalleryImage(
                                        image.id,
                                      );

                                      await loadWebsiteGallery(
                                        selectedWebsiteVendor.id,
                                      );
                                    } catch (error) {
                                      console.error(error);
                                    }
                                  }}
                                  className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Panel>
            )}

            {websiteTab === "credentials" && (
              <Panel title="Trust & Credentials">
                {websiteAccreditationsLoading ? (
                  <div className="py-12 text-center text-slate-500">
                    Loading credentials...
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-navy mb-3">
                        Suggested Credentials
                      </h3>

                      <p className="text-sm text-slate-500 mb-4">
                        Click a credential to quickly add it to this
                        organization's website.
                      </p>

                      <div className="flex flex-wrap gap-3">
                        {availableCredentialSuggestions.map((credential) => (
                          <button
                            key={credential}
                            type="button"
                            onClick={async () => {
                              if (!selectedWebsiteVendor) return;

                              try {
                                await websitePublishingService.createWebsiteAccreditation(
                                  selectedWebsiteVendor.id,
                                  {
                                    title: credential,
                                    description: "",
                                    sortOrder: websiteAccreditations.length + 1,
                                  },
                                );

                                await loadWebsiteAccreditations(
                                  selectedWebsiteVendor.id,
                                );
                              } catch (error) {
                                console.error(
                                  "Failed to create accreditation:",
                                  error,
                                );
                              }
                            }}
                            className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-navy transition hover:border-navy hover:bg-navy hover:text-white"
                          >
                            {credential}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setCredentialForm({
                          title: "",
                          description: "",
                        });

                        setEditingCredentialId(null);
                        setIsCredentialModalOpen(true);
                      }}
                      className="mt-4 rounded-full border border-dashed border-navy px-4 py-2 text-sm font-semibold text-navy transition hover:bg-navy hover:text-white"
                    >
                      + Custom Credential
                    </button>

                    <div>
                      <h3 className="font-semibold text-navy mb-3">
                        Current Credentials
                      </h3>

                      {websiteAccreditations.length === 0 ? (
                        <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-10 text-center text-slate-500">
                          No credentials added yet.
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {websiteAccreditations.map((credential) => (
                            <div
                              key={credential.id}
                              className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
                            >
                              <div>
                                <p className="font-semibold text-navy">
                                  {credential.title}
                                </p>

                                {credential.description && (
                                  <p className="mt-1 text-sm text-slate-500">
                                    {credential.description}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setEditingCredentialId(credential.id);

                                    setCredentialForm({
                                      title: credential.title,
                                      description: credential.description ?? "",
                                    });

                                    setIsCredentialModalOpen(true);
                                  }}
                                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={async () => {
                                    if (
                                      !confirm(`Delete "${credential.title}"?`)
                                    )
                                      return;

                                    try {
                                      await websitePublishingService.deleteWebsiteAccreditation(
                                        credential.id,
                                      );

                                      await loadWebsiteAccreditations(
                                        selectedWebsiteVendor.id,
                                      );
                                    } catch (error) {
                                      console.error(error);
                                    }
                                  }}
                                  className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </Panel>
            )}

            {websiteTab === "testimonials" && (
              <Panel title="Patient Testimonials">
                {websiteTestimonialsLoading ? (
                  <div className="py-12 text-center text-slate-500">
                    Loading testimonials...
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-navy">
                          Patient Testimonials
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Showcase real patient experiences on the public
                          website.
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setTestimonialForm({
                            patientName: "",
                            country: "",
                            testimonial: "",
                          });

                          setEditingTestimonialId(null);
                          setIsTestimonialModalOpen(true);
                        }}
                        className="rounded-xl bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-red"
                      >
                        + Add Testimonial
                      </button>
                    </div>

                    {websiteTestimonials.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
                        No testimonials added yet.
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {websiteTestimonials.map((testimonial) => (
                          <div
                            key={testimonial.id}
                            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-5"
                          >
                            <div className="flex items-center gap-5">
                              <img
                                className="h-16 w-16 rounded-full object-cover"
                                alt={testimonial.patientName}
                              />

                              <div>
                                <h4 className="font-semibold text-navy">
                                  {testimonial.patientName}
                                </h4>

                                <p className="text-sm text-cyan">
                                  {testimonial.country}
                                </p>

                                <p className="mt-2 line-clamp-2 max-w-xl text-sm text-slate-500">
                                  {testimonial.testimonial}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingTestimonialId(testimonial.id);

                                  setTestimonialForm({
                                    patientName: testimonial.patientName,
                                    country: testimonial.country ?? "",
                                    testimonial: testimonial.testimonial,
                                  });

                                  setIsTestimonialModalOpen(true);
                                }}
                                className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={async () => {
                                  if (
                                    !confirm(
                                      `Delete testimonial from ${testimonial.patientName}?`,
                                    )
                                  )
                                    return;

                                  try {
                                    await websitePublishingService.deleteWebsiteTestimonial(
                                      testimonial.id,
                                    );

                                    await loadWebsiteTestimonials(
                                      selectedWebsiteVendor.id,
                                    );
                                  } catch (error) {
                                    console.error(error);
                                  }
                                }}
                                className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </Panel>
            )}
          </div>
        </Panel>
      </div>
    );
  };

  const renderOrganizationVerification = () => {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Organization Verification</h1>

        <div className="rounded-2xl bg-white p-6 shadow">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-amber-600">
                Pending Review
              </p>

              <h2 className="mt-3 text-4xl font-black text-slate-900">
                {verificationStats.pending}
              </h2>
            </div>

            <div className="rounded-2xl border border-green-200 bg-green-50 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-green-600">
                Approved
              </p>

              <h2 className="mt-3 text-4xl font-black text-slate-900">
                {verificationStats.approved}
              </h2>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-red-600">
                Rejected
              </p>

              <h2 className="mt-3 text-4xl font-black text-slate-900">
                {verificationStats.rejected}
              </h2>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
              <p className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Total
              </p>

              <h2 className="mt-3 text-4xl font-black text-slate-900">
                {verificationStats.total}
              </h2>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead>
              <tr className="border-b border-navy/10 text-[10px] uppercase tracking-[0.18em] text-navy/40">
                <th className="py-4 pr-6">Organization</th>
                <th className="py-4 pr-6">Contact</th>
                <th className="py-4 pr-6">Email</th>
                <th className="py-4 pr-6">Type</th>
                <th className="py-4 pr-6">Plan</th>
                <th className="py-4 pr-6">Documents</th>
                <th className="py-4 pr-6">Payment</th>
                <th className="py-4 pr-6">Status</th>
                <th className="py-4 pr-6">Action</th>
              </tr>
            </thead>
            <tbody>
              {pendingOnboardings.map((onboarding) => {
                const docCount = onboarding.documents
                  ? Object.keys(onboarding.documents).length
                  : 0;
                return (
                  <tr
                    key={onboarding.id}
                    className="border-b border-navy/5 transition hover:bg-slate-bg/30"
                  >
                    <td className="py-5 pr-6 font-bold text-navy">
                      {onboarding.orgName}
                    </td>
                    <td className="py-5 pr-6 text-sm text-navy/60">
                      {onboarding.contactPerson}
                    </td>
                    <td className="py-5 pr-6 text-sm text-navy/60">
                      {onboarding.email}
                    </td>
                    <td className="py-5 pr-6 text-sm text-navy/60">
                      {onboarding.orgType}
                    </td>
                    <td className="py-5 pr-6 text-sm text-navy/60">
                      {onboarding.plan}
                    </td>
                    <td className="py-5 pr-6">
                      {docCount > 0 ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-[10px] font-bold text-emerald-700">
                          <FileSearch size={12} />
                          {docCount} doc{docCount !== 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span className="text-[10px] text-navy/40">
                          No docs
                        </span>
                      )}
                    </td>
                    <td className="py-5 pr-6">
                      <StatusPill status={onboarding.paymentStatus} />
                    </td>
                    <td className="py-5 pr-6">
                      <StatusPill status={onboarding.status} />
                    </td>
                    <td className="py-5 pr-6">
                      <button
                        onClick={() => handleOpenOnboardingReview(onboarding)}
                        className="text-xs font-black uppercase tracking-[0.16em] text-brand-red transition hover:text-navy"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!pendingOnboardings.length && (
            <EmptyState icon={FileSearch} title="No pending onboardings" />
          )}
        </div>
      </div>
    );
  };

  const renderLeads = () => (
    <div className="space-y-6">
      <Toolbar
        title="New Leads"
        right={
          <button
            onClick={() => setIsNewLeadOpen(true)}
            className="rounded-xl bg-navy px-4 py-2 text-xs font-bold text-white hover:bg-navy/90"
          >
            + New Lead
          </button>
        }
      />
      <div className="grid grid-cols-1 gap-4">
        {filteredleads.map((lead) => (
          <button
            key={lead.id}
            onClick={() => handleOpenLead(lead.id)}
            className="rounded-3xl border border-navy/5 bg-white p-5 text-left shadow-sm transition hover:shadow-xl md:p-6"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-black uppercase text-navy">
                    {lead.name}
                  </h3>
                  <StatusPill status={lead.status} />
                </div>
                <p className="mt-2 text-sm font-semibold text-navy/60">
                  {lead.description || lead.serviceCategory || "No description"}
                </p>
                <p className="mt-3 text-xs font-bold uppercase tracking-[0.14em] text-navy/30">
                  {lead.email} / {lead.patientPhone || "N/A"} /{" "}
                  {dateLabel(lead.createdAt)}
                </p>
              </div>
              <ArrowRight className="hidden text-navy/30 md:block" />
            </div>
          </button>
        ))}
        {!filteredleads.length && (
          <EmptyState icon={Users} title="No enquiries found" />
        )}
      </div>
    </div>
  );

  const renderConsultations = () => (
    <div className="space-y-6">
      <Toolbar title="New Consultations" />
      <div className="grid grid-cols-1 gap-4">
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setConsultationTab("ACTIVE")}
            className={`rounded-2xl px-4 py-2 text-sm font-bold ${
              consultationTab === "ACTIVE"
                ? "bg-navy text-white"
                : "bg-white border border-navy/10"
            }`}
          >
            Active ({activeConsultations.length})
          </button>

          <button
            onClick={() => setConsultationTab("CONVERTED")}
            className={`rounded-2xl px-4 py-2 text-sm font-bold ${
              consultationTab === "CONVERTED"
                ? "bg-emerald-500 text-white"
                : "bg-white border border-navy/10"
            }`}
          >
            Converted ({convertedConsultations.length})
          </button>

          <button
            onClick={() => setConsultationTab("REJECTED")}
            className={`rounded-2xl px-4 py-2 text-sm font-bold ${
              consultationTab === "REJECTED"
                ? "bg-brand-red text-white"
                : "bg-white border border-navy/10"
            }`}
          >
            Rejected ({rejectedConsultations.length})
          </button>
        </div>

        {(consultationTab === "ACTIVE"
          ? activeConsultations
          : consultationTab === "CONVERTED"
            ? convertedConsultations
            : rejectedConsultations
        ).map((consultation) => (
          <button
            key={consultation.id}
            onClick={() => {
              console.log(consultation);
              setSelectedConsultation(consultation);
            }}
            className="rounded-3xl border border-navy/5 bg-white p-5 text-left shadow-sm transition hover:shadow-xl md:p-6"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-lg font-black uppercase text-navy">
                    {consultation.name}
                  </h3>
                  <StatusPill status={consultation.status} />
                </div>
                <p className="mt-2 text-sm font-semibold text-navy/60">
                  {consultation.category}
                </p>

                <p className="mt-1 text-sm text-navy/40">
                  {consultation.service || "No service selected"}
                </p>
                <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs font-bold uppercase tracking-[0.14em] text-navy/30">
                  <span>{consultation.email}</span>
                  <span>{consultation.phone || "N/A"}</span>
                  <span>{consultation.country}</span>
                  <span>{dateLabel(consultation.createdAt)}</span>
                </div>
              </div>
              <ArrowRight className="hidden text-navy/30 md:block" />
            </div>
          </button>
        ))}
        {!filteredleads.length && (
          <EmptyState icon={Users} title="No enquiries found" />
        )}
      </div>
    </div>
  );

  const renderSupport = () => (
    <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
      <div className="xl:col-span-4">
        <Panel title="Tickets">
          <div className="space-y-3">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-left transition",
                  selectedTicket?.id === ticket.id
                    ? "border-navy bg-navy text-white"
                    : "border-navy/5 bg-white hover:border-navy/20",
                )}
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[0.18em]">
                    {ticket.id}
                  </span>
                  <StatusPill
                    status={ticket.status}
                    inverted={selectedTicket?.id === ticket.id}
                  />
                </div>
                <p className="font-bold">{ticket.subject}</p>
                <p
                  className={cn(
                    "mt-2 line-clamp-2 text-xs",
                    selectedTicket?.id === ticket.id
                      ? "text-white/50"
                      : "text-navy/40",
                  )}
                >
                  {ticket.lastMessage}
                </p>
              </button>
            ))}
            {!tickets.length && (
              <EmptyState icon={Ticket} title="No support tickets" />
            )}
          </div>
        </Panel>
      </div>
      <div className="xl:col-span-8">
        <Panel
          title={selectedTicket ? selectedTicket.subject : "Ticket Thread"}
        >
          {selectedTicket ? (
            <div className="flex h-[560px] flex-col">
              <div className="flex-1 space-y-4 overflow-y-auto rounded-2xl bg-slate-bg/70 p-4">
                <MessageBubble
                  message={{
                    id: `${selectedTicket.id}-last`,
                    text: selectedTicket.lastMessage || "Ticket opened.",
                    sender: "vendor",
                    senderName: "Vendor",
                    time: dateLabel(selectedTicket.lastUpdated),
                  }}
                />
                {(ticketMessages[selectedTicket.id] || []).map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  value={ticketReply}
                  onChange={(e) => setTicketReply(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleTicketReply()}
                  placeholder="Reply to ticket"
                  className="min-w-0 flex-1 rounded-2xl bg-slate-bg px-4 py-3 text-sm font-semibold text-navy outline-none ring-1 ring-navy/5 focus:ring-navy/20"
                />
                <IconButton
                  onClick={handleTicketReply}
                  disabled={busy || !ticketReply.trim()}
                  tone="primary"
                  title="Send reply"
                >
                  <Send size={16} />
                  Send
                </IconButton>
              </div>
            </div>
          ) : (
            <EmptyState icon={LifeBuoy} title="Select a support ticket" />
          )}
        </Panel>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <Toolbar
        title="Admin Profile"
        subtitle="Session controls and admin credential generation"
        right={
          <IconButton onClick={onLogout} title="Log out">
            <LogOut size={16} />
            Logout
          </IconButton>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Panel title="Current Session">
          <div className="grid gap-4">
            <Metric label="Identifier" value={user?.username || user?.email} />
            <Metric label="Email" value={user?.email} />
            <Metric label="Session Type" value="HTTP-only cookie" />
          </div>
        </Panel>

        <Panel title="Create Admin Credentials">
          <div className="space-y-4">
            <Field label="Admin Generation Secret">
              <input
                type="password"
                value={adminGenerationSecret}
                onChange={(e) => setAdminGenerationSecret(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && handleGenerateAdminCredentials()
                }
                placeholder="ADMIN_GENERATION_SECRET"
                className="form-input"
              />
            </Field>
            <IconButton
              onClick={handleGenerateAdminCredentials}
              disabled={busy || !adminGenerationSecret.trim()}
              title="Generate admin credentials"
              tone="primary"
            >
              <KeyRound size={16} />
              {busy ? "Generating..." : "Generate Credentials"}
            </IconButton>

            {credentialStatus && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-700">
                {credentialStatus}
              </div>
            )}

            {generatedCredentials && (
              <div className="space-y-3 rounded-2xl bg-slate-bg p-4">
                <Metric
                  label="Username"
                  value={generatedCredentials.username}
                />
                <Metric label="Email" value={generatedCredentials.email} />
                <Metric
                  label="Password"
                  value={generatedCredentials.password}
                />
                <button
                  onClick={() =>
                    authService.downloadCredentials(generatedCredentials)
                  }
                  className="w-full rounded-2xl bg-navy px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:bg-brand-red"
                >
                  Download Credentials
                </button>
              </div>
            )}
          </div>
        </Panel>
      </div>
    </div>
  );

  const renderActiveTab = () => {
    if (loading) {
      return (
        <div className="flex min-h-[420px] items-center justify-center rounded-3xl bg-white">
          <Loader2 className="h-10 w-10 animate-spin text-brand-red" />
        </div>
      );
    }

    switch (activeTab) {
      case "tenders":
        return renderTenders();
      case "vendor-registry":
        return renderVendors();
      case "website-publishing":
        return renderWebsitePublishing();
      case "organization-verification":
        return renderOrganizationVerification();
      case "consultations":
        return renderConsultations();
      case "leads":
        return renderLeads();
      case "support":
        return renderSupport();
      case "profile":
        return renderProfile();
      default:
        return renderStats();
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-bg text-navy">
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.button
            aria-label="Close navigation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-navy/60 lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 shrink-0 flex-col bg-[#071018] p-5 text-white transition-transform lg:relative lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-red font-black">
            M
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-[0.24em]">
              GMAA
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-white/35">
              ADMIN OPERATIONS CONSOLE
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {tabs.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsSidebarOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-xs font-bold uppercase tracking-[0.14em] transition",
                activeTab === item.id
                  ? "bg-brand-red text-white"
                  : "text-white/45 hover:bg-white/10 hover:text-white",
              )}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <button
          onClick={onLogout}
          className="mt-6 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white/45 transition hover:bg-white/10 hover:text-white"
        >
          <LogOut size={18} />
          Terminate Session
        </button>
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-center gap-3 border-b border-navy/5 bg-white px-4 py-4 md:px-8">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="rounded-2xl bg-slate-bg p-3 text-navy lg:hidden"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <div className="relative min-w-0 flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-navy/25" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search current workspace"
              className="w-full rounded-2xl bg-slate-bg py-3 pl-11 pr-4 text-sm font-semibold text-navy outline-none ring-1 ring-transparent focus:ring-navy/10"
            />
          </div>
          <button
            onClick={loadApiData}
            disabled={loading || busy}
            className="rounded-2xl bg-navy p-3 text-white transition hover:bg-brand-red disabled:opacity-50"
            aria-label="Refresh API data"
          >
            <RefreshCw
              size={18}
              className={cn((loading || busy) && "animate-spin")}
            />
          </button>
        </header>

        {error && (
          <div className="mx-4 mt-4 flex items-start gap-3 rounded-2xl border border-brand-red/20 bg-brand-red/10 p-4 text-sm font-semibold text-brand-red md:mx-8">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto p-4 md:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
            >
              {renderActiveTab()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <NewTenderModal
        open={isNewTenderOpen}
        form={tenderForm}
        vendors={vendors}
        broadcast={shouldBroadcast}
        busy={busy}
        onClose={() => setIsNewTenderOpen(false)}
        onChange={setTenderForm}
        onBroadcastChange={setShouldBroadcast}
        onSubmit={handleCreateTender}
      />

      <NewLeadModal
        open={isNewLeadOpen}
        form={leadForm}
        busy={isCreatingLead}
        onClose={() => setIsNewLeadOpen(false)}
        onChange={setLeadForm}
        onSubmit={handleCreateLead}
      />

      <BidModal
        bid={selectedBid}
        bids={selectedTenderBids}
        rankings={tenderRankings}
        tender={selectedTender}
        busy={busy}
        onClose={() => setSelectedBid(null)}
        onAward={handleAwardBid}
      />

      {isRebidModalOpen && (
        <ModalShell
          onClose={() => setIsRebidModalOpen(false)}
          maxWidth="max-w-2xl"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-navy">Request Rebid</h2>

            <p className="mt-2 text-sm text-slate-500">
              Select vendors to participate in the next bidding round.
            </p>

            <div className="mt-6 space-y-3">
              {selectedTenderBids.map((bid) => (
                <label
                  key={bid.vendorId}
                  className="flex items-center justify-between rounded-xl border border-slate-200 p-4"
                >
                  <div>
                    <p className="font-semibold text-navy">{bid.vendorName}</p>

                    <p className="text-sm text-slate-500">{bid.amount}</p>
                  </div>

                  <input
                    type="checkbox"
                    checked={selectedRebidVendors.includes(bid.vendorId)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRebidVendors((prev) => [
                          ...prev,
                          bid.vendorId,
                        ]);
                      } else {
                        setSelectedRebidVendors((prev) =>
                          prev.filter((id) => id !== bid.vendorId),
                        );
                      }
                    }}
                  />
                </label>
              ))}
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsRebidModalOpen(false)}
                className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold"
              >
                Cancel
              </button>

              <button
                onClick={handleRequestRebid}
                className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-bold text-white"
              >
                Start Rebid
              </button>
            </div>
          </div>
        </ModalShell>
      )}

      <InquiryModal //inquiry= leads, too lazy to change it
        inquiry={selectedLead}
        messages={selectedLead ? leadMessages[selectedLead.id] || [] : []}
        leadNotes={leadNotes}
        leadNote={leadNote}
        onLeadNoteChange={setLeadNote}
        vendors={vendors}
        reply={leadReply}
        remarks={remarks}
        busy={busy}
        onClose={() => setSelectedLead(null)}
        onReplyChange={setLeadReply}
        onRemarksChange={setRemarks}
        onSend={handleLeadReply}
        onUpdate={handleUpdateLead}
      />

      <ConsultationModal
        consultation={selectedConsultation}
        onClose={() => setSelectedConsultation(null)}
        onStatusUpdate={handleConsultationStatusUpdate}
        onConvertToLead={handleConvertToLead}
      />

      <OnboardingModal
        onboarding={selectedOnboarding}
        credentials={onboardingApprovalCreds}
        busy={busy}
        onClose={() => {
          setSelectedOnboarding(null);
          setOnboardingApprovalCreds(null);
        }}
        onApprove={handleApproveOnboarding}
        onReject={handleRejectOnboarding}
        onDownloadDoc={handleDownloadDocument}
      />

      <AnimatePresence>
        {isOfferingModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-xl font-bold text-navy">
                  {isEditingOffering ? "Edit Offering" : "Add Custom Offering"}
                </h2>

                {isEditingOffering
                  ? "Update this offering."
                  : "Create a custom service that isn't already suggested."}
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-navy">
                    Offering Name
                  </label>

                  <input
                    type="text"
                    value={offeringForm.name}
                    onChange={(e) =>
                      setOfferingForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-navy focus:outline-none"
                    placeholder="e.g. Robotic Liver Transplant"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-navy">
                    Description (Optional)
                  </label>

                  <textarea
                    rows={4}
                    value={offeringForm.description}
                    onChange={(e) =>
                      setOfferingForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-navy focus:outline-none"
                    placeholder="Short description..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
                <button
                  onClick={() => {
                    setIsOfferingModalOpen(false);
                    setEditingOfferingId(null);

                    setOfferingForm({
                      name: "",
                      description: "",
                    });
                  }}
                  className="rounded-xl border border-slate-300 px-5 py-2 font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    if (!selectedWebsiteVendor || !offeringForm.name.trim())
                      return;

                    try {
                      if (isEditingOffering && editingOfferingId) {
                        await websitePublishingService.updateWebsiteService(
                          editingOfferingId,
                          {
                            name: offeringForm.name.trim(),
                            description: offeringForm.description.trim(),
                          },
                        );
                      } else {
                        await websitePublishingService.createWebsiteService(
                          selectedWebsiteVendor.id,
                          {
                            name: offeringForm.name.trim(),
                            description: offeringForm.description.trim(),
                            sortOrder: websiteServices.length + 1,
                          },
                        );
                      }

                      await loadWebsiteServices(selectedWebsiteVendor.id);

                      setIsOfferingModalOpen(false);

                      setEditingOfferingId(null);

                      setOfferingForm({
                        name: "",
                        description: "",
                      });
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                  className="rounded-xl bg-navy px-5 py-2 font-semibold text-white"
                >
                  {isEditingOffering ? "Save Changes" : "Add Offering"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isCredentialModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-xl font-bold text-navy">
                  {isEditingCredential
                    ? "Edit Credential"
                    : "Add Custom Credential"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {isEditingCredential
                    ? "Update this credential."
                    : "Create a custom credential that isn't already suggested."}
                </p>
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-navy">
                    Credential Title
                  </label>

                  <input
                    type="text"
                    value={credentialForm.title}
                    onChange={(e) =>
                      setCredentialForm((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-navy focus:outline-none"
                    placeholder="e.g. JCI Gold Certification"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-navy">
                    Description (Optional)
                  </label>

                  <textarea
                    rows={4}
                    value={credentialForm.description}
                    onChange={(e) =>
                      setCredentialForm((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-navy focus:outline-none"
                    placeholder="Short description..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
                <button
                  onClick={() => {
                    setIsCredentialModalOpen(false);
                    setEditingCredentialId(null);

                    setCredentialForm({
                      title: "",
                      description: "",
                    });
                  }}
                  className="rounded-xl border border-slate-300 px-5 py-2 font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    if (!selectedWebsiteVendor || !credentialForm.title.trim())
                      return;

                    try {
                      if (isEditingCredential && editingCredentialId) {
                        await websitePublishingService.updateWebsiteAccreditation(
                          editingCredentialId,
                          {
                            title: credentialForm.title.trim(),
                            description: credentialForm.description.trim(),
                          },
                        );
                      } else {
                        await websitePublishingService.createWebsiteAccreditation(
                          selectedWebsiteVendor.id,
                          {
                            title: credentialForm.title.trim(),
                            description: credentialForm.description.trim(),
                            sortOrder: websiteAccreditations.length + 1,
                          },
                        );
                      }

                      await loadWebsiteAccreditations(selectedWebsiteVendor.id);

                      setIsCredentialModalOpen(false);
                      setEditingCredentialId(null);

                      setCredentialForm({
                        title: "",
                        description: "",
                      });
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                  className="rounded-xl bg-navy px-5 py-2 font-semibold text-white"
                >
                  {isEditingCredential ? "Save Changes" : "Add Credential"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isGalleryModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-xl rounded-2xl bg-white shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-xl font-bold text-navy">
                  {isEditingGallery
                    ? "Edit Gallery Image"
                    : "Upload Gallery Image"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {isEditingGallery
                    ? "Update this gallery image."
                    : "Upload an image that will appear on the organization's public profile."}
                </p>
              </div>

              <div className="space-y-6 p-6">
                <UploadCard
                  title="Gallery Image"
                  type="image"
                  module="website"
                  ownerId={selectedWebsiteVendor.id}
                  folder="gallery"
                  accept="image/*"
                  value={galleryForm.imageUrl}
                  allowDelete
                  onUploaded={(url) =>
                    setGalleryForm((prev) => ({
                      ...prev,
                      imageUrl: url,
                    }))
                  }
                  onDelete={() =>
                    setGalleryForm((prev) => ({
                      ...prev,
                      imageUrl: "",
                    }))
                  }
                />

                <div>
                  <label className="mb-2 block text-sm font-semibold text-navy">
                    Caption
                  </label>

                  <input
                    type="text"
                    value={galleryForm.caption}
                    onChange={(e) =>
                      setGalleryForm((prev) => ({
                        ...prev,
                        caption: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-navy focus:outline-none"
                    placeholder="Optional caption..."
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
                <button
                  onClick={() => {
                    setGalleryForm({
                      imageUrl: "",
                      caption: "",
                    });

                    setEditingGalleryId(null);

                    setIsGalleryModalOpen(false);
                  }}
                  className="rounded-xl border border-slate-300 px-5 py-2 font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    if (!selectedWebsiteVendor || !galleryForm.imageUrl) return;

                    try {
                      if (isEditingGallery && editingGalleryId) {
                        await websitePublishingService.updateWebsiteGalleryImage(
                          editingGalleryId,
                          {
                            imageUrl: galleryForm.imageUrl,
                            caption: galleryForm.caption,
                          },
                        );
                      } else {
                        await websitePublishingService.createWebsiteGalleryImage(
                          selectedWebsiteVendor.id,
                          {
                            imageUrl: galleryForm.imageUrl,
                            caption: galleryForm.caption,
                          },
                        );
                      }

                      await loadWebsiteGallery(selectedWebsiteVendor.id);

                      setGalleryForm({
                        imageUrl: "",
                        caption: "",
                      });

                      setEditingGalleryId(null);

                      setIsGalleryModalOpen(false);
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                  className="rounded-xl bg-navy px-5 py-2 font-semibold text-white"
                >
                  {isEditingGallery ? "Save Changes" : "Save Image"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isTestimonialModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-full max-w-2xl rounded-2xl bg-white shadow-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
            >
              <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-xl font-bold text-navy">
                  {isEditingTestimonial
                    ? "Edit Testimonial"
                    : "Add Testimonial"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Showcase a real patient experience.
                </p>
              </div>

              <div className="space-y-5 p-6">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-navy">
                    Patient Name
                  </label>

                  <input
                    type="text"
                    value={testimonialForm.patientName}
                    onChange={(e) =>
                      setTestimonialForm((prev) => ({
                        ...prev,
                        patientName: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-navy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-navy">
                    Country
                  </label>

                  <input
                    type="text"
                    value={testimonialForm.country}
                    onChange={(e) =>
                      setTestimonialForm((prev) => ({
                        ...prev,
                        country: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-navy focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-navy">
                    Testimonial
                  </label>

                  <textarea
                    rows={6}
                    value={testimonialForm.testimonial}
                    onChange={(e) =>
                      setTestimonialForm((prev) => ({
                        ...prev,
                        testimonial: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-slate-200 px-4 py-3 resize-none focus:border-navy focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-5">
                <button
                  onClick={() => {
                    setIsTestimonialModalOpen(false);
                    setEditingTestimonialId(null);

                    setTestimonialForm({
                      patientName: "",
                      country: "",
                      testimonial: "",
                    });
                  }}
                  className="rounded-xl border border-slate-300 px-5 py-2 font-medium"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    if (!selectedWebsiteVendor) return;

                    try {
                      if (isEditingTestimonial && editingTestimonialId) {
                        await websitePublishingService.updateWebsiteTestimonial(
                          editingTestimonialId,
                          testimonialForm,
                        );
                      } else {
                        await websitePublishingService.createWebsiteTestimonial(
                          selectedWebsiteVendor.id,
                          {
                            ...testimonialForm,
                            sortOrder: websiteTestimonials.length + 1,
                          },
                        );
                      }

                      await loadWebsiteTestimonials(selectedWebsiteVendor.id);

                      setIsTestimonialModalOpen(false);
                      setEditingTestimonialId(null);

                      setTestimonialForm({
                        patientName: "",
                        country: "",
                        testimonial: "",
                      });
                    } catch (error) {
                      console.error(error);
                    }
                  }}
                  className="rounded-xl bg-navy px-5 py-2 font-semibold text-white"
                >
                  {isEditingTestimonial ? "Save Changes" : "Add Testimonial"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NewTenderModal({
  open,
  form,
  vendors,
  broadcast,
  busy,
  onClose,
  onChange,
  onBroadcastChange,
  onSubmit,
}: {
  open: boolean;
  form: TenderForm;
  vendors: Vendor[];
  broadcast: boolean;
  busy: boolean;
  onClose: () => void;
  onChange: (form: TenderForm) => void;
  onBroadcastChange: (value: boolean) => void;
  onSubmit: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <ModalShell onClose={onClose} maxWidth="max-w-3xl">
          <div className="flex items-start justify-between gap-4 border-b border-navy/5 p-5 sm:p-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red">
                Tender API
              </p>
              <h2 className="mt-1 text-2xl font-bold uppercase text-navy">
                Create Tender
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-2xl bg-slate-bg p-3 text-navy/50 hover:text-navy"
            >
              <X size={18} />
            </button>
          </div>
          <div className="grid gap-4 overflow-y-auto p-5 sm:grid-cols-2 sm:p-6">
            <Field label="Service">
              <input
                className="form-input"
                value={form.service}
                onChange={(e) => onChange({ ...form, service: e.target.value })}
              />
            </Field>
            <Field label="Category">
              <select
                className="form-input"
                value={form.category}
                onChange={(e) =>
                  onChange({ ...form, category: e.target.value })
                }
              >
                {VENDOR_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Region">
              <select
                className="form-input"
                value={form.region}
                onChange={(e) => {
                  const region = e.target.value;

                  const matchingVendors = vendors.filter(
                    (vendor) => vendor.region === region,
                  );

                  onChange({
                    ...form,
                    region,
                    vendorEmails: matchingVendors
                      .map((vendor) => vendor.email)
                      .join("\n"),
                  });
                }}
              >
                <option value="">Select Region</option>

                <option value="Bhopal, India">India</option>

                <option value="UAE">UAE</option>

                <option value="Mauritius">Mauritius</option>

                <option value="Kenya">Kenya</option>

                <option value="Thailand">Thailand</option>
              </select>
            </Field>
            <Field label="Budget">
              <input
                className="form-input"
                value={form.budget}
                onChange={(e) => onChange({ ...form, budget: e.target.value })}
              />
            </Field>
            <Field label="Deadline">
              <input
                type="datetime-local"
                className="form-input"
                value={form.deadline}
                onChange={(e) =>
                  onChange({ ...form, deadline: e.target.value })
                }
              />
            </Field>
            <label className="flex items-center justify-between rounded-2xl bg-slate-bg p-4">
              <span>
                <span className="block text-[10px] font-black uppercase tracking-[0.18em] text-navy/40">
                  Broadcast
                </span>
                <span className="text-sm font-bold text-navy">
                  Notify listed vendors
                </span>
              </span>
              <input
                type="checkbox"
                checked={broadcast}
                onChange={(e) => onBroadcastChange(e.target.checked)}
                className="h-5 w-5 accent-brand-red"
              />
            </label>
            <Field label="Description" className="sm:col-span-2">
              <textarea
                className="form-input min-h-24 resize-y"
                value={form.description}
                onChange={(e) =>
                  onChange({ ...form, description: e.target.value })
                }
              />
            </Field>
            <Field label="Vendor Emails" className="sm:col-span-2">
              <textarea
                className="form-input min-h-28 resize-y"
                value={form.vendorEmails}
                onChange={(e) =>
                  onChange({ ...form, vendorEmails: e.target.value })
                }
                placeholder="vendor@example.com, clinical@example.com"
              />
            </Field>
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-navy/5 p-5 sm:flex-row sm:justify-end sm:p-6">
            <button
              onClick={onClose}
              className="rounded-2xl bg-slate-bg px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-navy"
            >
              Cancel
            </button>
            <button
              onClick={onSubmit}
              disabled={busy}
              className="rounded-2xl bg-brand-red px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white disabled:opacity-50"
            >
              {busy ? "Creating..." : "Create Tender"}
            </button>
          </div>
        </ModalShell>
      )}
    </AnimatePresence>
  );
}

function NewLeadModal({
  open,
  form,
  busy,
  onClose,
  onChange,
  onSubmit,
}: {
  open: boolean;
  form: LeadForm;
  busy: boolean;
  onClose: () => void;
  onChange: (form: LeadForm) => void;
  onSubmit: () => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <ModalShell onClose={onClose} maxWidth="max-w-3xl">
          <div className="flex items-start justify-between gap-4 border-b border-navy/5 p-5 sm:p-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red">
                Lead API
              </p>

              <h2 className="mt-1 text-2xl font-bold uppercase text-navy">
                Create Lead
              </h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-2xl bg-slate-bg p-3 text-navy/50 hover:text-navy"
            >
              <X size={18} />
            </button>
          </div>

          <div className="grid gap-4 overflow-y-auto p-5 sm:grid-cols-2 sm:p-6">
            <Field label="Patient Name">
              <input
                className="form-input"
                value={form.name}
                onChange={(e) => onChange({ ...form, name: e.target.value })}
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={(e) => onChange({ ...form, email: e.target.value })}
              />
            </Field>

            <Field label="Phone">
              <input
                className="form-input"
                value={form.patientPhone ?? ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    patientPhone: e.target.value,
                  })
                }
              />
            </Field>

            <Field label="Service Category">
              <select
                className="form-input"
                value={form.serviceCategory ?? ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    serviceCategory: e.target.value,
                  })
                }
              >
                <option value="">Select Category</option>

                {VENDOR_CATEGORIES.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Title" className="sm:col-span-2">
              <input
                className="form-input"
                value={form.title ?? ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    title: e.target.value,
                  })
                }
              />
            </Field>

            <Field label="Description" className="sm:col-span-2">
              <textarea
                className="form-input min-h-28 resize-y"
                value={form.description ?? ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    description: e.target.value,
                  })
                }
              />
            </Field>

            <Field label="Country">
              <input
                className="form-input"
                value={form.country ?? ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    country: e.target.value,
                  })
                }
              />
            </Field>

            <Field label="City">
              <input
                className="form-input"
                value={form.city ?? ""}
                onChange={(e) =>
                  onChange({
                    ...form,
                    city: e.target.value,
                  })
                }
              />
            </Field>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-navy/5 p-5 sm:flex-row sm:justify-end sm:p-6">
            <button
              onClick={onClose}
              className="rounded-2xl bg-slate-bg px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-navy"
            >
              Cancel
            </button>

            <button
              onClick={onSubmit}
              disabled={busy}
              className="rounded-2xl bg-brand-red px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white disabled:opacity-50"
            >
              {busy ? "Creating..." : "Create Lead"}
            </button>
          </div>
        </ModalShell>
      )}
    </AnimatePresence>
  );
}

function BidModal({
  bid,
  bids,
  rankings,
  tender,
  busy,
  onClose,
  onAward,
}: {
  bid: Bid | null;
  bids: Bid[];
  rankings: any[];
  tender: Tender | null;
  busy: boolean;
  onClose: () => void;
  onAward: () => void;
}) {
  if (!bid) return null;

  const base = numberFromMoney(bid.amount);
  const recommendedMargin = 12;
  const patientPrice = base
    ? formatMoney(base * (1 + recommendedMargin / 100))
    : bid.amount;
  const vendorBids = bids
    .filter((b) => b.vendorId === bid.vendorId)
    .sort((a, b) => (a.round?.roundNumber || 0) - (b.round?.roundNumber || 0));

  const currentIndex = vendorBids.findIndex((b) => b.id === bid.id);

  const previousBid = currentIndex > 0 ? vendorBids[currentIndex - 1] : null;

  const reductionPercentage = previousBid
    ? (
        ((Number(previousBid.amount) - Number(bid.amount)) /
          Number(previousBid.amount)) *
        100
      ).toFixed(1)
    : null;

  const vendorRanking = rankings.find(
    (ranking) => ranking.vendorId === bid.vendorId,
  );

  return (
    <AnimatePresence>
      <ModalShell onClose={onClose} maxWidth="max-w-xl">
        <div className="flex items-start justify-between gap-4 border-b border-navy/5 p-5 sm:p-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red">
              Bid Analysis
            </p>
            <h2 className="mt-1 text-2xl font-bold uppercase text-navy">
              {bid.vendor?.companyName || bid.vendorName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl bg-slate-bg p-3 text-navy/50 hover:text-navy"
          >
            <X size={18} />
          </button>
        </div>
        <div className="space-y-4 overflow-y-auto p-5 sm:p-6">
          <Metric
            label="Round"
            value={bid.round ? `R${bid.round.roundNumber}` : "N/A"}
          />
          {vendorRanking && (
            <Metric label="Current Rank" value={vendorRanking.position} />
          )}
          <Metric
            label="Vendor"
            value={bid.vendor?.companyName || bid.vendorName}
          />
          <Metric label="Bid Amount" value={bid.amount} />
          <div className="rounded-2xl border border-navy/10 p-4">
            <h3 className="mb-2 text-sm font-bold text-navy">Proposal</h3>

            <p className="text-sm text-navy/70 whitespace-pre-wrap">
              {bid.proposal || "No proposal submitted."}
            </p>
          </div>
          {previousBid && (
            <Metric label="Previous Round" value={previousBid.amount} />
          )}
          {previousBid && (
            <Metric
              label="Reduction"
              value={`${Number(previousBid.amount) - Number(bid.amount)} (${reductionPercentage}%)`}
            />
          )}
          <Metric label="Suggested Patient Price" value={patientPrice} />
          <Metric label="Status" value={String(bid.status).toUpperCase()} />
          <div className="rounded-2xl border border-navy/10 p-4">
            <h3 className="mb-3 text-sm font-bold text-navy"> Bid History </h3>
            <div className="space-y-2">
              {vendorBids.map((historyBid) => (
                <div
                  key={historyBid.id}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="text-navy/60">
                    R{historyBid.round?.roundNumber}
                  </span>
                  <span className="font-semibold text-navy">
                    {historyBid.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-3 border-t border-navy/5 p-5 sm:flex-row sm:justify-end sm:p-6">
          <button
            onClick={onClose}
            className="rounded-2xl bg-slate-bg px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-navy"
          >
            Cancel
          </button>
          <button
            onClick={onAward}
            disabled={busy || tender?.status === "AWARDED"}
            className="rounded-2xl bg-navy px-5 py-3 text-sm font-black uppercase tracking-[0.14em] text-white disabled:opacity-50"
          >
            {tender?.status === "AWARDED" ? "Tender Closed" : "Issue Award"}
          </button>
        </div>
      </ModalShell>
    </AnimatePresence>
  );
}

function InquiryModal({
  inquiry,
  messages,
  leadNotes,
  leadNote,
  onLeadNoteChange,
  vendors,
  reply,
  remarks,
  busy,
  onClose,
  onReplyChange,
  onRemarksChange,
  onSend,
  onUpdate,
}: {
  inquiry: Lead | null;
  messages: LocalMessage[];

  leadNotes: any[];
  leadNote: string;
  onLeadNoteChange: (value: string) => void;
  vendors: Vendor[];
  reply: string;
  remarks: string;
  busy: boolean;
  onClose: () => void;
  onReplyChange: (value: string) => void;
  onRemarksChange: (value: string) => void;
  onSend: () => void;
  onUpdate: (status?: string) => void;
}) {
  if (!inquiry) return null;
  const [selectedVendorId, setSelectedVendorId] = useState("");

  return (
    <AnimatePresence>
      <ModalShell onClose={onClose} maxWidth="max-w-6xl">
        <div className="flex items-start justify-between gap-4 border-b border-navy/5 bg-[#071018] p-5 text-white sm:p-6">
          <div className="min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
              Lead / {inquiry.id}
            </p>
            <h2 className="mt-1 truncate text-2xl font-bold uppercase">
              {inquiry.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl bg-white/10 p-3 text-white/60 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>
        <div className="grid min-h-0 flex-1 overflow-y-auto lg:grid-cols-[1fr_360px]">
          <div className="border-b border-navy/5 bg-slate-bg/60 p-6 lg:border-b-0 lg:border-r">
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-black uppercase text-navy">
                  Patient Information
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Metric label="Lead ID" value={inquiry.id} />
                  <Metric label="Patient Name" value={inquiry.name} />
                  <Metric label="Email" value={inquiry.email} />
                  <Metric label="Phone" value={inquiry.patientPhone || "N/A"} />
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-black uppercase text-navy">
                  Request Details
                </h3>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <Metric label="Lead Number" value={inquiry.leadNumber} />
                  <Metric
                    label="Service Category"
                    value={inquiry.serviceCategory}
                  />

                  <Metric label="Country" value={inquiry.country} />
                  <Metric label="City" value={inquiry.city} />

                  <Metric label="Priority" value={inquiry.priority} />
                  <Metric label="Routing Type" value={inquiry.routingType} />

                  <Metric label="Lead Type" value={inquiry.leadType} />
                  <Metric label="Source" value={inquiry.source} />

                  <div className="rounded-2xl border border-navy/5 bg-white p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy/40">
                      Assigned Vendor
                    </p>

                    <p className="mt-2 font-semibold text-navy">
                      {inquiry.vendorName || "Not Assigned"}
                    </p>

                    {!inquiry.vendorId && (
                      <div className="mt-4">
                        <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-navy/40">
                          Select Vendor
                        </p>

                        <select
                          value={selectedVendorId}
                          onChange={(e) => setSelectedVendorId(e.target.value)}
                          className="w-full rounded-xl border border-navy/10 p-3 text-sm"
                        >
                          <option value="">Select Vendor</option>

                          {vendors.map((vendor) => (
                            <option key={vendor.id} value={vendor.id}>
                              {vendor.name}
                            </option>
                          ))}
                        </select>

                        <button
                          onClick={async () => {
                            if (!selectedVendorId) return;

                            try {
                              await leadsService.assignVendor(
                                inquiry.id,
                                selectedVendorId,
                              );

                              alert("Vendor assigned successfully");
                            } catch (error) {
                              console.error(error);
                              alert("Failed to assign vendor");
                            }
                          }}
                          className="mt-3 w-full rounded-xl bg-navy px-4 py-3 text-sm font-bold uppercase text-white"
                        >
                          Assign Vendor
                        </button>
                      </div>
                    )}
                  </div>

                  <Metric
                    label="Assigned To"
                    value={inquiry.assignedTo || "Not Assigned"}
                  />
                </div>

                <div className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-navy/40">
                    Case Title
                  </p>

                  <p className="mt-2 font-semibold text-navy">
                    {inquiry.title}
                  </p>

                  <p className="mt-4 text-sm font-bold uppercase tracking-[0.14em] text-navy/40">
                    Description
                  </p>

                  <p className="mt-2 text-navy">{inquiry.description}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-black uppercase text-navy">
                  Timeline
                </h3>

                <div className="space-y-3">
                  {inquiry.activities?.length ? (
                    inquiry.activities.map((activity: any) => (
                      <div
                        key={activity.id}
                        className="rounded-2xl bg-white p-4 shadow-sm"
                      >
                        <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy/40">
                          {activity.activity === "LEAD_CREATED"
                            ? "Lead Created"
                            : activity.activity === "ROUTING_UPDATED"
                              ? "Routing Updated"
                              : activity.activity === "NOTE_ADDED"
                                ? "Note Added"
                                : activity.activity}
                        </p>

                        <p className="mt-2 text-sm text-navy">
                          {activity.description}
                        </p>

                        <p className="mt-2 text-xs text-navy/50">
                          {dateLabel(activity.createdAt)}
                        </p>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-2xl bg-white p-4 shadow-sm">
                      <p className="text-sm text-navy/70">
                        Created: {dateLabel(inquiry.createdAt)}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-5 p-5 sm:p-6">
            <Metric label="Email" value={inquiry.email} />
            <Metric label="Phone" value={inquiry.patientPhone || "N/A"} />
            <Metric label="Status" value={inquiry.status} />
            <Field label="Remarks">
              <textarea
                value={remarks}
                onChange={(e) => onRemarksChange(e.target.value)}
                className="form-input min-h-32 resize-y"
                placeholder="Internal notes"
              />
            </Field>
            <button
              onClick={async () => {
                if (!remarks.trim()) return;
                try {
                  await leadsService.createLeadNote(inquiry.id, remarks);
                  alert("Note added");
                } catch (error) {
                  console.error(error);
                  alert("Failed to add note");
                }
              }}
              className="w-full rounded-2xl bg-navy px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white"
            >
              Save Note
            </button>

            <div>
              <h3 className="mb-4 text-lg font-black uppercase text-navy">
                Notes
              </h3>

              <div className="space-y-3">
                {leadNotes.length ? (
                  leadNotes.map((item: any) => (
                    <div
                      key={item.id}
                      className="rounded-2xl bg-white p-4 shadow-sm"
                    >
                      <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy/40">
                        {item.createdBy} • {dateLabel(item.createdAt)}
                      </p>

                      <p className="mt-2 text-sm text-navy">{item.note}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-navy/50">No notes yet.</p>
                )}
              </div>
            </div>

            <div className="grid gap-3">
              <button
                onClick={() => onUpdate("UNDER_REVIEW")}
                className="rounded-2xl bg-amber-500 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white"
              >
                Start Review
              </button>

              <button
                onClick={() => onUpdate("won")}
                disabled={busy}
                className="rounded-2xl bg-emerald-500 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white disabled:opacity-50"
              >
                Convert To Tender
              </button>

              <button
                onClick={() => onUpdate("REJECTED")}
                className="rounded-2xl bg-brand-red/10 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-brand-red"
              >
                Mark Lost
              </button>
            </div>
          </div>
        </div>
      </ModalShell>
    </AnimatePresence>
  );
}

function ConsultationModal({
  consultation,
  onClose,
  onStatusUpdate,
  onConvertToLead,
}: {
  consultation: any | null;
  onClose: () => void;
  onStatusUpdate: (
    consultationId: string,
    status: "CONTACTED" | "QUALIFIED" | "CONVERTED" | "REJECTED",
    note: string,
  ) => Promise<void>;

  onConvertToLead: (consultationId: string) => Promise<void>;
}) {
  if (!consultation) return null;
  const [note, setNote] = useState("");

  return (
    <AnimatePresence>
      <ModalShell onClose={onClose} maxWidth="max-w-3xl">
        <div className="flex items-start justify-between gap-4 border-b border-navy/5 p-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red">
              Consultation
            </p>

            <h2 className="mt-1 text-2xl font-bold uppercase text-navy">
              {consultation.name}
            </h2>
          </div>

          <button onClick={onClose} className="rounded-2xl bg-slate-bg p-3">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-4 p-6">
            <Metric label="Name" value={consultation.name} />
            <Metric label="Email" value={consultation.email} />
            <Metric label="Phone" value={consultation.phone} />
            <Metric label="Service" value={consultation.service} />
            <Metric label="Region" value={consultation.region} />
            <Metric label="Status" value={consultation.status} />
            <Metric
              label="Vendor"
              value={consultation.vendorName || "Not Assigned"}
            />
            <Metric label="Created" value={dateLabel(consultation.createdAt)} />
          </div>

          <div className="border-t border-navy/5 p-5">
            <h3 className="mb-4 text-lg font-black uppercase text-navy">
              Timeline
            </h3>
            <div className="max-h-96 overflow-y-auto space-y-4 pr-2">
              {consultation.notes?.length ? (
                consultation.notes.map((item: any) => (
                  <div key={item.id} className="rounded-2xl bg-slate-bg p-4">
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-navy/40">
                      {item.createdBy} • {dateLabel(item.createdAt)}
                    </p>
                    <p className="mt-2 text-sm text-navy">{item.note}</p>
                  </div>
                ))
              ) : (
                <p className="text-sm text-navy/50">No activity yet.</p>
              )}
            </div>
          </div>

          <div className="p-5 border-t border-navy/5">
            <label className="mb-2 block text-xs font-black uppercase tracking-[0.14em] text-navy/60">
              Internal Note
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="form-input min-h-24 w-full resize-y"
              placeholder="Add a note before updating status..."
            />
          </div>
        </div>

        {consultation.status !== "CONVERTED" &&
          consultation.status !== "REJECTED" && (
            <div className="flex justify-end gap-3 border-t border-navy/5 p-5">
              <button
                onClick={() =>
                  onStatusUpdate(consultation.id, "CONTACTED", note)
                }
                className="rounded-2xl bg-amber-500 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white"
              >
                Mark Contacted
              </button>

              <button
                onClick={() =>
                  onStatusUpdate(consultation.id, "QUALIFIED", note)
                }
                className="rounded-2xl bg-purple-500 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white"
              >
                Mark Qualified
              </button>

              <button
                onClick={() => onConvertToLead(consultation.id)}
                className="rounded-2xl bg-emerald-500 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white"
              >
                Mark Convert to lead
              </button>

              <button
                onClick={() =>
                  onStatusUpdate(consultation.id, "REJECTED", note)
                }
                className="rounded-2xl bg-brand-red px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white"
              >
                Reject
              </button>
            </div>
          )}
      </ModalShell>
    </AnimatePresence>
  );
}

function ModalShell({
  children,
  onClose,
  maxWidth,
}: {
  children: React.ReactNode;
  onClose: () => void;
  maxWidth: string;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <button
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
      />
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 16, scale: 0.96 }}
        className={cn(
          "relative flex max-h-[calc(100vh-1rem)] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl sm:max-h-[calc(100vh-2rem)] sm:rounded-3xl",
          maxWidth,
        )}
      >
        {children}
      </motion.div>
    </div>
  );
}

function Toolbar({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-3xl font-bold uppercase tracking-tight text-navy">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-navy/40">
            {subtitle}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-navy/5 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-sm font-black uppercase tracking-[0.18em] text-navy">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
}) {
  return (
    <div className="rounded-3xl border border-navy/5 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-navy/40">
          {title}
        </p>
        <div className="rounded-2xl bg-brand-red/10 p-3 text-brand-red">
          <Icon size={22} />
        </div>
      </div>
      <p className="text-4xl font-bold tracking-tight text-navy">{value}</p>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-slate-bg p-4">
      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-navy/40">
        {label}
      </p>
      <p className="mt-2 break-words text-sm font-bold text-navy">
        {value || "N/A"}
      </p>
    </div>
  );
}

function Field({
  label,
  className,
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-2 block text-[10px] font-black uppercase tracking-[0.18em] text-navy/40">
        {label}
      </span>
      {children}
    </label>
  );
}

function StatusPill({
  status,
  inverted,
}: {
  status: string;
  inverted?: boolean;
}) {
  const normalized = (status ?? "").toLowerCase();

  const tone =
    // Blue
    normalized === "new" || normalized === "ready_for_review"
      ? "bg-blue-500/10 text-blue-600"
      : // Amber
        normalized === "contacted" ||
          normalized === "pending" ||
          normalized === "pending_review" ||
          normalized === "under_review"
        ? "bg-amber-500/10 text-amber-600"
        : // Purple
          normalized === "qualified"
          ? "bg-purple-500/10 text-purple-600"
          : // Green
            normalized === "converted" ||
              normalized === "awarded" ||
              normalized === "won" ||
              normalized === "active" ||
              normalized === "approved" ||
              normalized === "published" ||
              normalized === "resolved" ||
              normalized === "completed"
            ? "bg-emerald-500/10 text-emerald-600"
            : // Red
              normalized === "rejected" ||
                normalized === "lost" ||
                normalized === "inactive" ||
                normalized === "suspended" ||
                normalized === "closed"
              ? "bg-brand-red/10 text-brand-red"
              : // Slate
                normalized === "draft" || normalized === "archived"
                ? "bg-slate-500/10 text-slate-600"
                : // Default
                  "bg-slate-500/10 text-slate-600";

  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]",
        inverted ? "bg-white/10 text-white" : tone,
      )}
    >
      {(status || "UNKNOWN").replace(/_/g, " ")}
    </span>
  );
}

function TextButton({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="text-xs font-black uppercase tracking-[0.16em] text-brand-red hover:text-navy"
    >
      {children}
    </button>
  );
}

function IconButton({
  children,
  onClick,
  disabled,
  title,
  tone = "default",
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  title: string;
  tone?: "default" | "primary" | "danger";
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-xs font-black uppercase tracking-[0.14em] transition disabled:cursor-not-allowed disabled:opacity-50",
        tone === "primary"
          ? "bg-brand-red text-white hover:bg-navy"
          : tone === "danger"
            ? "bg-brand-red/10 text-brand-red hover:bg-brand-red hover:text-white"
            : "bg-navy text-white hover:bg-brand-red",
      )}
    >
      {children}
    </button>
  );
}

function ListRow({
  title,
  meta,
  status,
  onClick,
}: {
  title: string;
  meta: string;
  status: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between gap-4 rounded-2xl bg-slate-bg/70 p-4 cursor-pointer transition hover:bg-slate-bg"
    >
      <div className="min-w-0">
        <p className="truncate text-sm font-black uppercase text-navy">
          {title}
        </p>
        <p className="mt-1 truncate text-xs text-navy/40">{meta}</p>
      </div>
      <StatusPill status={status} />
    </div>
  );
}

function MessageBubble({ message }: { message: LocalMessage }) {
  const isAdmin = message.sender === "admin";
  return (
    <div className={cn("flex", isAdmin ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[86%] rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm",
          isAdmin ? "bg-navy text-white" : "bg-white text-navy",
        )}
      >
        <p>{message.text}</p>
        <p
          className={cn(
            "mt-2 text-[10px] font-black uppercase tracking-[0.14em]",
            isAdmin ? "text-white/40" : "text-navy/30",
          )}
        >
          {message.senderName} / {message.time}
        </p>
      </div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
}: {
  icon: React.ElementType;
  title: string;
}) {
  return (
    <div className="flex min-h-40 flex-col items-center justify-center rounded-3xl border border-dashed border-navy/10 bg-white/50 p-8 text-center text-navy/30">
      <Icon size={42} className="mb-3" />
      <p className="text-xs font-black uppercase tracking-[0.18em]">{title}</p>
    </div>
  );
}

function OnboardingModal({
  onboarding,
  credentials,
  busy,
  onClose,
  onApprove,
  onReject,
  onDownloadDoc,
}: {
  onboarding: import("../types").VendorOnboarding | null;
  credentials: { username: string; password: string } | null;
  busy: boolean;
  onClose: () => void;
  onApprove: (
    vendorId: string,
    status: "PENDING_ACTIVATION" | "ACTIVE",
    remarks?: string,
  ) => void;

  onReject: (vendorId: string, remarks: string) => void;
  onDownloadDoc: (
    vendorId: string,
    docType: "business_license" | "moh_accreditation" | "tax_identification",
  ) => void;
}) {
  const [previewDoc, setPreviewDoc] = React.useState<{
    docType: "business_license" | "moh_accreditation" | "tax_identification";
    url: string;
    fileName: string;
  } | null>(null);

  const [remarks, setRemarks] = React.useState("");

  if (!onboarding) return null;

  const documentTypes: Array<
    "business_license" | "moh_accreditation" | "tax_identification"
  > = ["business_license", "moh_accreditation", "tax_identification"];

  const vendorDocuments = onboarding.vendor?.documents ?? [];

  return (
    <AnimatePresence>
      <ModalShell onClose={onClose} maxWidth="max-w-4xl">
        <div className="flex items-start justify-between gap-4 border-b border-navy/5 p-5 sm:p-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red">
              Vendor Onboarding / {onboarding.id}
            </p>
            <h2 className="mt-1 text-2xl font-bold uppercase text-navy">
              {onboarding.orgName}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl bg-slate-bg p-3 text-navy/50 hover:text-navy"
          >
            <X size={18} />
          </button>
        </div>

        <div className="grid min-h-0 overflow-y-auto lg:grid-cols-[1fr_320px]">
          <div className="space-y-6 border-b border-navy/5 p-5 sm:p-6 lg:border-b-0 lg:border-r">
            {/* Credentials Display */}
            {credentials && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-emerald-700 mb-3">
                  Generated Credentials
                </p>
                <div className="space-y-3">
                  <div className="rounded-lg bg-white/50 p-3 font-mono text-sm text-emerald-700">
                    <p className="text-[10px] font-bold text-emerald-600 mb-1">
                      Username
                    </p>
                    <p className="break-all">{credentials.username}</p>
                  </div>
                  <div className="rounded-lg bg-white/50 p-3 font-mono text-sm text-emerald-700">
                    <p className="text-[10px] font-bold text-emerald-600 mb-1">
                      Password
                    </p>
                    <p className="break-all">{credentials.password}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Organization Details */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-navy/40 mb-3">
                Organization Details
              </h3>
              <div className="space-y-2">
                <Metric label="Organization Name" value={onboarding.orgName} />
                <Metric label="Organization Type" value={onboarding.orgType} />
                <Metric label="Email" value={onboarding.email} />
                <Metric
                  label="Contact Person"
                  value={onboarding.contactPerson}
                />
                {onboarding.contactNumber && (
                  <Metric
                    label="Contact Number"
                    value={onboarding.contactNumber}
                  />
                )}
                <Metric label="Plan" value={onboarding.plan} />
                <Metric
                  label="Specialties"
                  value={onboarding.specialties?.join(", ") || "N/A"}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-[0.18em] text-navy/40 mb-3">
                Status
              </h3>
              <div className="space-y-2">
                <Metric
                  label="Onboarding Status"
                  value={<StatusPill status={onboarding.status} />}
                />
                <Metric
                  label="Payment Status"
                  value={<StatusPill status={onboarding.paymentStatus} />}
                />
                <Metric
                  label="Created At"
                  value={dateLabel(onboarding.createdAt)}
                />
              </div>
            </div>

            {/* Documents - Enhanced UI */}
            {vendorDocuments.length > 0 && (
              <div className="rounded-2xl border-2 border-brand-red/20 bg-gradient-to-br from-brand-red/5 to-transparent p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 rounded-lg bg-brand-red/10">
                    <FileSearch size={18} className="text-brand-red" />
                  </div>
                  <h3 className="text-[12px] font-black uppercase tracking-[0.18em] text-brand-red">
                    Attached Documents {vendorDocuments.length}
                  </h3>
                </div>
                <div className="space-y-3">
                  {vendorDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="rounded-xl border-2 border-brand-red/30 bg-white p-4 hover:border-brand-red/60 transition"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-brand-red/10 text-brand-red text-[9px] font-black uppercase tracking-[0.12em]">
                              {doc.documentType.replace(/_/g, " ")}
                            </span>

                            <span className="text-[9px] text-navy/50 font-bold">
                              Uploaded {dateLabel(doc.uploadedAt)}
                            </span>
                          </div>

                          <p className="text-sm font-bold text-navy mb-2 break-words">
                            {doc.fileName}
                          </p>
                        </div>

                        <div className="shrink-0 flex gap-2">
                          <button
                            onClick={() =>
                              setPreviewDoc({
                                docType: doc.documentType as any,
                                url: doc.fileUrl,
                                fileName: doc.fileName,
                              })
                            }
                            className="flex flex-col items-center justify-center gap-1 rounded-lg bg-brand-red/10 p-3 text-brand-red hover:bg-brand-red hover:text-white transition"
                          >
                            <FileSearch size={18} />
                            <span className="text-[8px] font-bold uppercase">
                              View
                            </span>
                          </button>

                          <button
                            onClick={() => window.open(doc.fileUrl, "_blank")}
                            className="flex flex-col items-center justify-center gap-1 rounded-lg bg-navy/10 p-3 text-navy hover:bg-navy hover:text-white transition"
                          >
                            <ArrowRight size={18} />
                            <span className="text-[8px] font-bold uppercase">
                              Download
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions Sidebar */}
          <div className="space-y-4 p-5 sm:p-6">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-navy/40 mb-3">
                Actions
              </p>
              <div className="space-y-3">
                {onboarding.status === "DOCUMENTS_PENDING" && (
                  <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-amber-700">
                      Waiting For Vendor Documents
                    </p>
                    <p className="mt-2 text-xs text-amber-600">
                      Vendor must upload required compliance documents before
                      review.
                    </p>
                  </div>
                )}

                {onboarding.vendor?.verificationStatus === "PENDING_REVIEW" && (
                  <>
                    <button
                      onClick={() =>
                        onApprove(onboarding.vendor!.id, "ACTIVE", remarks)
                      }
                      disabled={busy}
                      className="w-full rounded-2xl bg-emerald-500 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white disabled:opacity-50 hover:bg-emerald-600 transition"
                    >
                      <CheckCircle2 size={16} className="inline mr-2" />
                      Approve & Activate
                    </button>

                    <button
                      onClick={() => onReject(onboarding.vendor!.id, remarks)}
                      disabled={busy}
                      className="w-full rounded-2xl bg-brand-red/10 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-brand-red disabled:opacity-50 hover:bg-brand-red hover:text-white transition"
                    >
                      <AlertCircle size={16} className="inline mr-2" />
                      Reject
                    </button>
                  </>
                )}

                {onboarding.status === "ACTIVE" && (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-emerald-700">
                      Vendor Activated
                    </p>
                  </div>
                )}
              </div>
            </div>

            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              rows={4}
              placeholder="Enter verification remarks..."
              className="w-full rounded-2xl border border-slate-300 p-3 text-sm focus:border-brand-red focus:outline-none"
            />

            {onboarding.vendor?.verificationStatus !== "PENDING_REVIEW" && (
              <div className="rounded-2xl border border-navy/10 bg-slate-bg/50 p-3">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-navy/40">
                  Status
                </p>
                <p className="mt-2 font-bold text-navy">{onboarding.status}</p>
              </div>
            )}
          </div>
        </div>
      </ModalShell>

      {/* Document Preview Modal */}
      <DocumentPreviewModal
        doc={previewDoc}
        onClose={() => setPreviewDoc(null)}
        onDownload={() => {
          if (previewDoc) {
            window.open(previewDoc.url, "_blank");
          }
        }}
      />
    </AnimatePresence>
  );
}

function DocumentPreviewModal({
  doc,
  onClose,
  onDownload,
}: {
  doc: { docType: string; url: string; fileName: string } | null;
  onClose: () => void;
  onDownload: () => void;
}) {
  if (!doc) return null;

  const isPdf = doc.fileName.toLowerCase().endsWith(".pdf");
  const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(doc.fileName);
  const pdfPreviewUrl = `${doc.url}${doc.url.includes("#") ? "&" : "#"}toolbar=1&navpanes=0&scrollbar=1&view=FitH&zoom=page-fit`;

  return (
    <AnimatePresence>
      <ModalShell onClose={onClose} maxWidth="max-w-7xl">
        <div className="flex shrink-0 items-center justify-between gap-4 border-b border-navy/5 bg-gradient-to-r from-brand-red/5 to-transparent p-4 sm:p-5">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red flex items-center gap-2">
              <FileSearch size={14} />
              Document Preview
            </p>
            <h2 className="mt-1 text-lg font-bold uppercase text-navy break-words">
              {doc.fileName}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDownload}
              className="rounded-2xl bg-gradient-to-r from-brand-red to-brand-red/80 px-4 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:shadow-lg hover:scale-105 flex items-center gap-2"
            >
              <ArrowRight size={16} />
              Download
            </button>
            <button
              onClick={onClose}
              className="rounded-2xl bg-slate-bg p-3 text-navy/50 hover:text-navy hover:bg-slate-bg/80 transition"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(100vh-8.5rem)] min-h-[520px] items-center justify-center bg-gradient-to-br from-slate-bg/50 to-slate-bg/20 p-3 sm:h-[calc(100vh-9.5rem)] sm:p-4">
          {isPdf ? (
            <div className="h-full w-full overflow-hidden rounded-2xl border-2 border-navy/10 bg-white shadow-lg">
              <object
                data={pdfPreviewUrl}
                type="application/pdf"
                className="block h-full min-h-full w-full"
              >
                <iframe
                  src={pdfPreviewUrl}
                  className="block h-full min-h-full w-full"
                  title={`Preview of ${doc.fileName}`}
                />
              </object>
            </div>
          ) : isImage ? (
            <div className="flex h-full w-full items-center justify-center">
              <img
                src={doc.url}
                alt={doc.fileName}
                className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl border-4 border-white"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-6 text-center bg-white rounded-2xl p-8 border-2 border-navy/10">
              <div className="p-4 rounded-full bg-brand-red/10">
                <FileSearch size={54} className="text-brand-red" />
              </div>
              <div>
                <p className="text-base font-bold text-navy">
                  Document Type Not Supported for Preview
                </p>
                <p className="mt-2 text-sm text-navy/60">
                  This file format cannot be previewed in the browser
                </p>
              </div>
              <button
                onClick={onDownload}
                className="mt-4 rounded-2xl bg-gradient-to-r from-navy to-navy/80 px-6 py-3 text-xs font-black uppercase tracking-[0.14em] text-white transition hover:shadow-lg hover:scale-105 flex items-center gap-2"
              >
                <ArrowRight size={16} />
                Download File
              </button>
            </div>
          )}
        </div>
      </ModalShell>
    </AnimatePresence>
  );
}
