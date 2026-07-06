import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  ShieldAlert,
  CheckCircle2,
  Users,
  Globe2,
  FileSearch,
  Activity,
  LogOut,
  Bell,
  Search,
  Filter,
  ArrowUpRight,
  Gavel,
  Briefcase,
  MapPin,
  Clock,
  Plus,
  ArrowRight,
  LifeBuoy,
  X,
  Ticket,
  Paperclip,
  Send,
  MessageCircle,
  ChevronRight,
  Menu,
  CheckCircle,
  XCircle
} from "lucide-react";
import { cn } from "../lib/utils";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import {
  collection,
  query,
  where,
  addDoc,
  serverTimestamp,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  setDoc,
  deleteDoc,
  useCollection,
  auth,
  db,
} from "../lib/firebase";
import { useAuth } from "./AuthContext";
import { backendApi } from "../services/backendApi";
import { handleFirestoreError, OperationType } from "../lib/firestoreUtils";

// Mock Data for Admin View
const PENDING_VENDORS = [
  {
    id: "V-892",
    name: "Apollo Integrated",
    location: "India",
    specialty: "Cardiology",
    date: "2h ago",
    status: "pending",
  },
  {
    id: "V-894",
    name: "Bumrungrad Global",
    location: "Thailand",
    specialty: "Ortho",
    date: "5h ago",
    status: "pending",
  },
  {
    id: "V-895",
    name: "Mayo International",
    location: "USA",
    specialty: "Oncology",
    date: "1d ago",
    status: "flagged",
  },
];

// Mock data constants removed

const ONBOARDING_PIPELINE = [
  {
    id: "P-01",
    name: "Singapore General",
    stage: "Stage 1: Details",
    progress: 20,
    date: "Mar 12, 2026",
  },
  {
    id: "P-02",
    name: "Al-Zahra Hospital",
    stage: "Stage 3: Documents",
    progress: 60,
    date: "Mar 15, 2026",
  },
  {
    id: "P-03",
    name: "St. Vincent Medical",
    stage: "Stage 5: Verification",
    progress: 90,
    date: "Mar 18, 2026",
  },
  {
    id: "P-04",
    name: "Elite Care Zurich",
    stage: "Stage 6: Registry",
    progress: 100,
    date: "Mar 20, 2026",
  },
];

const STAGES_OVERVIEW = [
  { id: 1, label: "Basic Details", count: 42, color: "text-cyan" },
  { id: 2, label: "Expertise", count: 28, color: "text-blue-500" },
  { id: 3, label: "Documents", count: 15, color: "text-indigo-500" },
  { id: 4, label: "Payment", count: 9, color: "text-emerald-500" },
  { id: 5, label: "Verification", count: 18, color: "text-brand-red" },
  { id: 6, label: "Registry", count: 442, color: "text-navy" },
];

const USER_ACTIVITY_DATA = [
  { name: "Mon", vendors: 400, patients: 2400 },
  { name: "Tue", vendors: 300, patients: 1398 },
  { name: "Wed", vendors: 200, patients: 9800 },
  { name: "Thu", vendors: 278, patients: 3908 },
  { name: "Fri", vendors: 189, patients: 4800 },
  { name: "Sat", vendors: 239, patients: 3800 },
  { name: "Sun", vendors: 349, patients: 4300 },
];

export default function AdminDashboard({
  onLogout,
  onViewChange,
  onHome,
}: {
  onLogout: () => void;
  onViewChange?: (v: any) => void;
  onHome?: () => void;
}) {
  const { user } = useAuth();

  // Firestore Hooks
  const [consultationsValue] = useCollection(
    user ? query(collection(db, "consultations"), orderBy("createdAt", "desc")) : null
  );

  const [tendersValue, tendersLoading, tendersError] = useCollection(
    user ? collection(db, "tenders") : null,
  );
  const [vendorsValue] = useCollection(
    user ? query(collection(db, "users"), where("role", "==", "vendor")) : null,
  );
  const [supportTicketsValue] = useCollection(
    user
      ? query(collection(db, "support_tickets"), orderBy("lastUpdated", "desc"))
      : null,
  );

  const [activeTab, setActiveTab] = useState("stats");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNewTenderOpen, setIsNewTenderOpen] = useState(false);
  const [selectedTender, setSelectedTender] = useState<any>(null);
  const [selectedBid, setSelectedBid] = useState<any>(null);
  const [margins, setMargins] = useState<Record<string, number>>({});
  const [isShieldOpen, setIsShieldOpen] = useState(false);
  const [selectedVendorChatId, setSelectedVendorChatId] = useState("");
  const [isSeeding, setIsSeeding] = useState(false);

  const [newTender, setNewTender] = useState({
    service: "Robotic Knee Replacement",
    category: "Orthopaedics",
    region: "Southeast Asia",
    budget: "",
    description: "",
    requirements: "",
  });
  const [shouldBroadcast, setShouldBroadcast] = useState(true);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [adminChatMessageVendor, setAdminChatMessageVendor] = useState("");
  const [adminChatMessagePatient, setAdminChatMessagePatient] = useState("");
  const [vendorMessages, setVendorMessages] = useState<any[]>([]);
  const [patientMessages, setPatientMessages] = useState<any[]>([]);

  const handleSendShieldVendorMessage = () => {
    if (!adminChatMessageVendor.trim()) return;
    setVendorMessages(prev => [...prev, {
      sender: 'admin',
      text: adminChatMessageVendor,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setAdminChatMessageVendor("");
  };

  const handleSendShieldPatientMessage = () => {
    if (!adminChatMessagePatient.trim()) return;
    setPatientMessages(prev => [...prev, {
      sender: 'admin',
      text: adminChatMessagePatient,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setAdminChatMessagePatient("");
  };

  const [leads, setLeads] = useState<any[]>([]);
  const [inquiryTypeFilter, setInquiryTypeFilter] = useState<"active" | "dead" | "won">("active");
  const [tenderTypeFilter, setTenderTypeFilter] = useState<"active" | "completed">("active");

  useEffect(() => {
    let fbLeads: any[] = [];
    if (consultationsValue) {
      fbLeads = consultationsValue.docs.map(doc => {
        const data = doc.data();
        const date = data.createdAt?.toDate() ? 
          new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }).format(data.createdAt.toDate()) + " ago"
          : "Recently";
        
        return {
          id: doc.id,
          name: data.name || "Anonymous",
          request: data.service || "General Inquiry",
          location: data.region || "Thailand",
          email: data.email || "No email",
          phone: data.phone || "No phone",
          status: data.status || "new",
          remarks: data.internalRemarks || "",
          date,
          isMock: false
        };
      });
    }

    const loadBackendLeads = async () => {
      try {
        const data = await backendApi.fetchConsultations();
        const mapped = data.map(item => ({
          id: item.id || Math.random().toString(),
          name: item.name || "Anonymous",
          request: item.service || "General Inquiry",
          location: item.region || "International",
          email: item.email || "No email",
          phone: item.phone || "No phone",
          status: item.status || "new",
          remarks: "",
          date: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Recently",
          isMock: false
        }));

        setLeads(() => {
          const combined = [...fbLeads];
          mapped.forEach((m: any) => {
            if (!combined.some(c => c.id === m.id)) {
              combined.push(m);
            }
          });
          return combined.length > 0 ? combined : mapped;
        });
      } catch (err) {
        console.warn("Backend leads fetch skipped:", err);
        if (fbLeads.length > 0) setLeads(fbLeads);
      }
    };

    loadBackendLeads();
  }, [consultationsValue]);

  // Support Ticket States
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [ticketReply, setTicketReply] = useState("");
  const [activeTicketMessages, setActiveTicketMessages] = useState<any[]>([]);

  // Real-time Chat States
  const [selectedChatThreadId, setSelectedChatThreadId] = useState<string | null>(null);
  const [chatThreads, setChatThreads] = useState<any[]>([]);
  const [currentChatMessages, setCurrentChatMessages] = useState<any[]>([]);
  const [adminChatReply, setAdminChatReply] = useState("");

  // Inquiry Dossier States
  const [selectedInquiry, setSelectedInquiry] = useState<any>(null);
  const [inquiryMessages, setInquiryMessages] = useState<any[]>([]);
  const [inquiryDocuments, setInquiryDocuments] = useState<any[]>([]);
  const [inquiryChatMsg, setInquiryChatMsg] = useState("");
  const [internalRemarksInput, setInternalRemarksInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const supportTickets = (supportTicketsValue?.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) || []) as any[];

  useEffect(() => {
    if (!selectedTicketId || !user) return;
    const q = query(
      collection(db, `support_tickets/${selectedTicketId}/messages`),
      orderBy("createdAt", "asc"),
    );
    return onSnapshot(q, (snapshot) => {
      setActiveTicketMessages(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
    });
  }, [selectedTicketId, user]);

  useEffect(() => {
    if (!user || activeTab !== "chat") return;
    const q = query(collection(db, "support_threads"), orderBy("lastUpdated", "desc"));
    return onSnapshot(q, (snapshot) => {
      setChatThreads(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.GET, "support_threads"));
  }, [user, activeTab]);

  useEffect(() => {
    if (!selectedChatThreadId || !user) return;
    const q = query(
      collection(db, `support_threads/${selectedChatThreadId}/messages`),
      orderBy("createdAt", "asc")
    );
    return onSnapshot(q, (snapshot) => {
      setCurrentChatMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    }, (error) => handleFirestoreError(error, OperationType.GET, `support_threads/${selectedChatThreadId}/messages`));
  }, [selectedChatThreadId, user]);

  const handleSendAdminChatReply = async () => {
    if (!adminChatReply.trim() || !selectedChatThreadId || !user) return;
    const chatPath = `support_threads/${selectedChatThreadId}/messages`;
    try {
      await addDoc(collection(db, chatPath), {
        text: adminChatReply,
        senderId: user.uid,
        senderName: "GMAA Support",
        createdAt: serverTimestamp(),
        isAdmin: true
      });
      
      // Update thread timestamp
      await updateDoc(doc(db, "support_threads", selectedChatThreadId), {
        lastMessage: adminChatReply,
        lastUpdated: serverTimestamp()
      });

      setAdminChatReply("");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, chatPath);
    }
  };

  // Inquiry Dossier Sync
  useEffect(() => {
    if (!selectedInquiry || !user) return;

    const messagesPath = `leads/${selectedInquiry.id}/messages`;
    const docsPath = `leads/${selectedInquiry.id}/documents`;

    const qMessages = query(
      collection(db, messagesPath),
      orderBy("createdAt", "asc"),
    );
    const qDocs = query(collection(db, docsPath), orderBy("createdAt", "desc"));

    const unsubMessages = onSnapshot(qMessages, (snapshot) => {
      setInquiryMessages(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
    }, (error) => handleFirestoreError(error, OperationType.GET, messagesPath));

    const unsubDocs = onSnapshot(qDocs, (snapshot) => {
      setInquiryDocuments(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
    }, (error) => handleFirestoreError(error, OperationType.GET, docsPath));

    return () => {
      unsubMessages();
      unsubDocs();
    };
  }, [selectedInquiry, user]);

  useEffect(() => {
    if (selectedInquiry) {
      setInternalRemarksInput(selectedInquiry.remarks || "");
    }
  }, [selectedInquiry]);

  const updateLeadStatus = async (lead: any, newStatus: string) => {
    if (!lead || !user) return;

    // Check if status is already won (immutability)
    if (lead.status === 'won') {
      alert("Terminal State Reached: This lead is already marked as WON and its status cannot be modified.");
      return;
    }

    // Mandatory remarks check
    const remarksToUse = selectedInquiry?.id === lead.id ? internalRemarksInput : lead.remarks;
    if (!remarksToUse || remarksToUse.trim().length < 5) {
      alert("Intelligence Requirement: Please provide internal remarks before updating lead status. Open the dossier to add notes.");
      if (selectedInquiry?.id !== lead.id) {
        setSelectedInquiry(lead);
      }
      return;
    }
    
    if (lead.isMock) {
      setLeads(prev => prev.map(l => l.id === lead.id ? { ...l, status: newStatus, remarks: remarksToUse } : l));
      if (selectedInquiry?.id === lead.id) {
        setSelectedInquiry({ ...lead, status: newStatus });
      }
      
      if (newStatus === 'won') {
        setActiveTab("tenders");
        setIsNewTenderOpen(true);
        setNewTender({
          ...newTender,
          service: lead.request,
          region: lead.location,
        });
      }
      return;
    }

    const path = `consultations/${lead.id}`;
    try {
      await updateDoc(doc(db, path), {
        status: newStatus,
        internalRemarks: remarksToUse,
        updatedAt: serverTimestamp()
      });
      
      if (newStatus === 'won') {
        setActiveTab("tenders");
        setIsNewTenderOpen(true);
        setNewTender({
          ...newTender,
          service: lead.request,
          region: lead.location,
        });
      }
      
      if (selectedInquiry?.id === lead.id) {
        setSelectedInquiry({ ...lead, status: newStatus });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleUpdateLeadStatus = async (newStatus: string) => {
    if (!selectedInquiry) return;
    await updateLeadStatus(selectedInquiry, newStatus);
  };

  const handleSaveInternalRemarks = async () => {
    if (!selectedInquiry || !user) return;

    if (selectedInquiry.isMock) {
      alert("This is a demo lead. Remarks for demo data are not saved to the database.");
      setSelectedInquiry({ ...selectedInquiry, remarks: internalRemarksInput });
      return;
    }

    const path = `consultations/${selectedInquiry.id}`;
    try {
      await updateDoc(doc(db, path), {
        internalRemarks: internalRemarksInput,
        updatedAt: serverTimestamp()
      });
      setSelectedInquiry({ ...selectedInquiry, remarks: internalRemarksInput });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleSendInquiryMessage = async () => {
    if (!inquiryChatMsg || !selectedInquiry || !user) return;
    const path = `leads/${selectedInquiry.id}/messages`;
    try {
      await addDoc(collection(db, path), {
        text: inquiryChatMsg,
        sender: "admin",
        senderName: "GMAA Backend",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        createdAt: serverTimestamp(),
      });
      setInquiryChatMsg("");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  const handleUploadDossierDoc = async () => {
    if (!selectedInquiry || !user) return;
    setIsUploading(true);
    setTimeout(async () => {
      const path = `leads/${selectedInquiry.id}/documents`;
      try {
        await addDoc(collection(db, path), {
          name: "GMAA_AUDIT_REPORT.pdf",
          url: "#",
          type: "application/pdf",
          size: "1.2 MB",
          uploadedBy: "GMAA Admin",
          createdAt: serverTimestamp(),
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.WRITE, path);
      } finally {
        setIsUploading(false);
      }
    }, 1500);
  };
  const [bidsValue, bidsLoading, bidsError] = useCollection(
    user && selectedTender
      ? query(
          collection(db, "bids"),
          where("tenderId", "==", selectedTender.id),
        )
      : null,
  );

  useEffect(() => {
    if (tendersError)
      handleFirestoreError(tendersError, OperationType.LIST, "tenders");
    if (bidsError) handleFirestoreError(bidsError, OperationType.LIST, "bids");
  }, [tendersError, bidsError]);

  const [tenders, setTenders] = useState<any[]>([]);
  useEffect(() => {
    let fbTenders = tendersValue
      ? (tendersValue.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as any[])
      : [];
    
    const syncBackendTenders = async () => {
      try {
        const beTenders = await backendApi.fetchTenders();
        setTenders(() => {
          const combined = [...fbTenders];
          beTenders.forEach((item: any) => {
            if (!combined.some(c => c.id === item.id)) {
              combined.push(item);
            }
          });
          return combined.length > 0 ? combined : beTenders;
        });
      } catch (err) {
        console.warn("Express backend fetch tenders skipped:", err);
        setTenders(fbTenders);
      }
    };
    syncBackendTenders();
  }, [tendersValue]);

  const [bids, setBids] = useState<any[]>([]);
  useEffect(() => {
    let fbBids = bidsValue
      ? bidsValue.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      : [];
    
    const syncBackendBids = async () => {
      try {
        const beBids = await backendApi.fetchBids();
        let targetBids = beBids;
        if (selectedTender) {
          targetBids = beBids.filter(b => b.tenderId === selectedTender.id);
        }
        setBids(() => {
          const combined = [...fbBids];
          targetBids.forEach((item: any) => {
            if (!combined.some(c => c.id === item.id)) {
              combined.push(item);
            }
          });
          return combined.length > 0 ? combined : targetBids;
        });
      } catch (err) {
        console.warn("Express backend fetch bids skipped:", err);
        setBids(fbBids);
      }
    };
    syncBackendBids();
  }, [bidsValue, selectedTender]);

  // Set initial selected vendor when bids change
  useEffect(() => {
    if (bids.length > 0 && !selectedVendorChatId) {
      setSelectedVendorChatId(bids[0].vendorId || bids[0].id);
    }
  }, [bids, selectedVendorChatId]);

  // Sync Vendor Chat
  useEffect(() => {
    if (!isShieldOpen || !selectedVendorChatId || !selectedTender || !user)
      return;

    const chatPath = `tenders/${selectedTender.id}/chats/${selectedVendorChatId}/messages`;
    const q = query(collection(db, chatPath), orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setVendorMessages(
          snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, chatPath);
      },
    );

    return () => unsubscribe();
  }, [isShieldOpen, selectedVendorChatId, selectedTender]);

  const generateTenderId = (region: string, service: string, category: string) => {
    const getAbbr = (str: string) => {
      // Take first 3 letters after removing non-alphabetic chars
      const clean = str.replace(/[^a-zA-Z]/g, '');
      return (clean.substring(0, 3) || 'GEN').toUpperCase();
    };
    
    const reg = getAbbr(region || 'GLB');
    const srv = getAbbr(service || 'SRV');
    const cat = getAbbr(category || service || 'CAT');
    
    // Find next number based on existing tenders to prevent collisions
    const existingIds = tendersValue?.docs.map(doc => doc.id) || [];
    const prefix = `${reg}-${srv}-${cat}-`;
    const matchingIds = existingIds.filter(id => id.startsWith(prefix));
    const nextNum = (matchingIds.length + 1).toString().padStart(3, '0');
    
    return `${prefix}${nextNum}`;
  };

  const handleLaunchTender = async () => {
    setIsBroadcasting(true);
    try {
      // 1. Generate Custom ID
      const customId = generateTenderId(newTender.region, newTender.service, newTender.category);
      const tenderRef = doc(db, "tenders", customId);

      // 2. Save to Firestore
      await setDoc(tenderRef, {
        service: newTender.service,
        category: newTender.category,
        region: newTender.region,
        budget: newTender.budget,
        description:
          newTender.description ||
          `Institutional request for ${newTender.service} excellence in ${newTender.region}.`,
        requirements: newTender.requirements
          ? newTender.requirements.split("\n").filter((r) => r.trim() !== "")
          : [],
        bids: 0,
        status: "open",
        createdAt: serverTimestamp(),
      });

      // 3. Automated Broadcast Logic
      if (shouldBroadcast) {
        // Collect Vendor Emails
        const dbEmails = vendorsValue
          ? vendorsValue.docs.map((doc) => doc.data().email).filter(Boolean)
          : [];
        const demoEmails = [
          "vendor-relations@med-global.com",
          "clinical-operations@health-net.int",
        ];
        const allRecipientEmails = Array.from(
          new Set([...dbEmails, ...demoEmails]),
        );

        console.log(`[Admin] Triggering broadcast for Tender: ${customId}`);

        const response = await fetch("/api/tenders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            tenderData: {
              service: newTender.service,
              region: newTender.region,
              budget: newTender.budget,
              deadline: "72 Hours",
              description: newTender.description,
            },
            vendorEmails: allRecipientEmails,
          }),
        });

        if (!response.ok) throw new Error("Broadcast API failed");
        const result = await response.json();
        console.log("[Admin] Broadcast Result:", result);
      }

      setIsNewTenderOpen(false);
      setNewTender({
        service: "Robotic Knee Replacement",
        category: "Orthopaedics",
        region: "Southeast Asia",
        budget: "",
        description: "",
        requirements: "",
      });
      setShouldBroadcast(true);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "tenders_broadcast");
    } finally {
      setIsBroadcasting(false);
    }
  };

  const handleSeedData = async () => {
    if (isSeeding) return;
    setIsSeeding(true);
    try {
      const sampleTenders = [
        {
          service: "Robotic Knee Replacement",
          region: "Southeast Asia",
          budget: "$45k - $60k",
          category: "Orthopaedics",
          deadline: "Apr 15, 2026",
          description:
            "Bilateral robotic assisted knee replacement for international patient.",
        },
        {
          service: "Cardiac Bypass (CABG)",
          region: "Middle East",
          budget: "$180k - $220k",
          category: "Cardiology",
          deadline: "Apr 20, 2026",
          description: "Quadruple bypass batch for institutional partner.",
        },
        {
          service: "Executive Oncology Audit",
          region: "Pan-European",
          budget: "$15k - $25k",
          category: "Oncology",
          deadline: "Apr 25, 2026",
          description: "Comprehensive diagnostic audit for Stage 2 patient.",
        },
        {
          service: "Stem Cell Spinal Therapy",
          region: "Americas",
          budget: "$120k",
          category: "Specialty",
          deadline: "May 1, 2026",
          description: "Regenerative medicine protocol for L4-L5 disc repair.",
        },
      ];

      for (const t of sampleTenders) {
        const customId = generateTenderId(t.region, t.service, t.category);
        const tenderRef = doc(db, "tenders", customId);
        
        await setDoc(tenderRef, {
          ...t,
          bids: 2,
          status: "open",
          createdAt: serverTimestamp(),
        });

        // Add dummy bids for each tender
        await addDoc(collection(db, "bids"), {
          tenderId: customId,
          vendorId: "V-MOCK-1",
          hospitalName: "Mount Elizabeth Orchard",
          vendor: "Mount Elizabeth Orchard",
          price: 42000,
          margin: 15,
          surgeon: "Dr. Robert Tan",
          inclusions: ["Private Suite", "Robotic Fee", "Physiotherapy"],
          experience: "25+ Years",
          createdAt: serverTimestamp(),
        });

        await addDoc(collection(db, "bids"), {
          tenderId: customId,
          vendorId: "V-MOCK-2",
          hospitalName: "Bumrungrad International",
          vendor: "Bumrungrad International",
          price: 38000,
          margin: 12,
          surgeon: "Dr. S. Srisai",
          inclusions: ["In-Patient Stay", "Limo Transfer"],
          experience: "18 Years",
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, "system_seed");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleClearTenders = async () => {
    if (!tendersValue || isSeeding) return;
    if (!window.confirm("WARNING: All active auctions, tenders and bids will be purged. Proceed?")) return;
    
    setIsSeeding(true);
    try {
      const deletePromises = tendersValue.docs.map(tDoc => deleteDoc(doc(db, "tenders", tDoc.id)));
      await Promise.all(deletePromises);
      
      // Also clear bids if possible
      if (bidsValue) {
         const bidDeletePromises = bidsValue.docs.map(bDoc => deleteDoc(doc(db, "bids", bDoc.id)));
         await Promise.all(bidDeletePromises);
      }
      
      alert("Marketplace cleared successfully.");
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, "tenders_purge");
    } finally {
      setIsSeeding(false);
    }
  };

  const handleSendVendorMessage = async () => {
    if (!adminChatMessageVendor || !selectedVendorChatId || !selectedTender)
      return;

    const chatPath = `tenders/${selectedTender.id}/chats/${selectedVendorChatId}/messages`;

    try {
      await addDoc(collection(db, chatPath), {
        text: adminChatMessageVendor,
        sender: "admin",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        createdAt: serverTimestamp(),
      });
      setAdminChatMessageVendor("");
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, chatPath);
    }
  };

  const renderVerification = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-6">
        <AdminStatCard
          title="Active Vendors"
          value="442"
          trend="+12"
          label="Global Registry"
        />
        <AdminStatCard
          title="Patient Volume"
          value="1.2M"
          trend="+4.5%"
          label="Cross-Border"
        />
        <AdminStatCard
          title="Live Users"
          value="2,842"
          trend="+124"
          label="Global Nodes"
        />
      </div>

      <div className="bg-white rounded-[2.5rem] p-10 border border-navy/5 shadow-sm">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-xl font-light tracking-tighter text-navy uppercase flex items-center gap-3">
            <FileSearch className="text-brand-red" /> Compliance <span className="font-serif italic font-medium text-gradient pr-1">Queue</span> <span className="text-[10px] font-bold text-navy/20">(Stage 5)</span>
          </h3>
          <div className="flex gap-2">
            <button className="p-3 bg-slate-bg rounded-full text-navy/20 hover:text-navy transition-all cursor-pointer">
              <Filter size={16} />
            </button>
            <button className="px-6 py-2.5 bg-navy text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-red transition-all cursor-pointer">
              Global Approval
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {PENDING_VENDORS.map((vendor) => (
            <div
              key={vendor.id}
              className="group flex items-center justify-between p-6 bg-slate-bg/50 hover:bg-white hover:shadow-xl transition-all rounded-[2rem] border border-transparent hover:border-navy/5"
            >
              <div className="flex items-center gap-6">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm font-bold text-navy text-xs border border-navy/5">
                  {vendor.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-navy text-base tracking-tight">
                    {vendor.name}
                  </h4>
                  <p className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em] mt-1">
                    {vendor.location} • {vendor.specialty} Excellence
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <span
                    className={cn(
                      "text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                      vendor.status === "pending"
                         ? "bg-amber-500/10 text-amber-600"
                        : "bg-brand-red/10 text-brand-red",
                    )}
                  >
                    {vendor.status}
                  </span>
                  <p className="text-[10px] font-bold text-navy/20 mt-1">
                    {vendor.date}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("onboarding")}
                  className="px-6 py-2.5 bg-navy text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-brand-red transition-all cursor-pointer"
                >
                  Review Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderBiddingHall = () => {
    if (!selectedTender) return null;

    return (
      <div className="space-y-12">
        <div className="flex justify-between items-center">
          <button
            onClick={() => setSelectedTender(null)}
            className="flex items-center gap-2 text-navy/40 hover:text-navy transition-all font-bold text-[10px] uppercase tracking-widest cursor-pointer"
          >
            <ArrowRight className="rotate-180" size={14} /> Back to Open Tenders
          </button>
          <div className="flex gap-4">
            <button
              onClick={() => setIsShieldOpen(true)}
              className="px-8 py-4 bg-brand-red text-white text-[10px] font-bold uppercase tracking-[0.3em] rounded-full shadow-xl shadow-brand-red/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
            >
              Secure Comms Bridge
            </button>
          </div>
        </div>

        <div className="bg-[#051622] p-12 rounded-[2.5rem] text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-4 block">
                Tender Details • {selectedTender.id}
              </span>
              <h2 className="text-5xl font-light text-white tracking-tighter uppercase mb-6">
                {selectedTender.service}
              </h2>
              <div className="flex gap-6 mt-6">
                <div className="flex items-center gap-2 text-white/40">
                  <MapPin size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {selectedTender.region}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-white/40">
                  <Briefcase size={14} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    {selectedTender.budget}
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 p-8 rounded-[2rem] text-center">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-2">
                Total Bids
              </p>
              <p className="text-[clamp(2rem,4vw,4rem)] font-light tracking-tighter">
                {selectedTender.bids}
              </p>
            </div>
          </div>
        </div>

        {/* Bid Comparison Matrix */}
        <div className="bg-white rounded-[2.5rem] border border-navy/5 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-navy/5 bg-slate-bg/30">
            <h3 className="text-sm font-bold text-navy uppercase tracking-widest">
              Active Bid Comparison Matrix
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-navy/5 bg-slate-bg/10">
                  <th className="px-8 py-6 text-[10px] font-bold text-navy/40 uppercase tracking-widest">
                    Vendor Institution
                  </th>
                  <th className="px-8 py-6 text-[10px] font-bold text-navy/40 uppercase tracking-widest">
                    Surgeon Profile
                  </th>
                  <th className="px-8 py-6 text-[10px] font-bold text-navy/40 uppercase tracking-widest">
                    Base Quote
                  </th>
                  <th className="px-8 py-6 text-[10px] font-bold text-brand-red uppercase tracking-widest">
                    GMAA Margin (%)
                  </th>
                  <th className="px-8 py-6 text-[10px] font-bold text-navy/40 uppercase tracking-widest">
                    Patient Price
                  </th>
                  <th className="px-8 py-6 text-[10px] font-bold text-navy/40 uppercase tracking-widest">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {bids.map((bid: any) => {
                  const currentId = bid.vendorId || bid.id;
                  const currentMargin = margins[currentId] ?? bid.margin;
                  const patientPrice = bid.price * (1 + currentMargin / 100);
                  return (
                    <tr
                      key={currentId}
                      className="border-b border-navy/5 hover:bg-slate-bg/30 transition-all group"
                    >
                      <td className="px-8 py-8">
                        <p className="font-bold text-navy text-base tracking-tight">
                          {bid.hospitalName || bid.vendor}
                        </p>
                        <div className="flex gap-1 mt-1">
                          {bid.inclusions?.slice(0, 2).map((inc: string) => (
                            <span
                              key={inc}
                              className="text-[9px] border border-navy/5 px-3 py-1 rounded-full text-navy/40 font-bold uppercase tracking-widest"
                            >
                              {inc}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <p className="font-bold text-navy text-sm">
                          {bid.surgeon}
                        </p>
                        <p className="text-[9px] font-bold text-navy/40 uppercase tracking-widest">
                          {bid.experience || "Verified Expert"}
                        </p>
                      </td>
                      <td className="px-8 py-8 font-bold text-navy">
                        ${bid.price.toLocaleString()}
                      </td>
                      <td className="px-8 py-8">
                        <div className="flex items-center gap-3">
                          <input
                            type="number"
                            value={currentMargin}
                            onChange={(e) =>
                              setMargins({
                                ...margins,
                                [currentId]: parseInt(e.target.value) || 0,
                              })
                            }
                            className="w-16 bg-slate-bg border-none rounded-xl p-3 text-xs font-bold text-brand-red focus:ring-1 focus:ring-brand-red outline-none"
                          />
                          <span className="text-[10px] font-bold text-brand-red uppercase tracking-widest">
                            %
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-8">
                        <p className="font-light text-navy text-2xl tracking-tighter">
                          ${patientPrice.toLocaleString()}
                        </p>
                      </td>
                      <td className="px-8 py-8">
                        <button 
                          onClick={() => setSelectedBid(bid)}
                          className="px-6 py-3 bg-navy text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-brand-red transition-all shadow-lg active:scale-95 cursor-pointer"
                        >
                          Analyze
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const handleIssueIntentToAward = async () => {
    if (!selectedBid || !selectedTender || !user) return;

    const bidPath = `bids/${selectedBid.id}`;
    const tenderPath = `tenders/${selectedTender.id}`;

    try {
      // 1. Update the Bid status
      await updateDoc(doc(db, bidPath), {
        status: "awarded",
        updatedAt: serverTimestamp(),
      });

      // 2. Update the Tender status
      await updateDoc(doc(db, tenderPath), {
        status: "awarded",
        awardedBidId: selectedBid.id,
        awardedVendorId: selectedBid.vendorId,
        updatedAt: serverTimestamp(),
      });

      alert(`Intent to Award issued to ${selectedBid.hospitalName || selectedBid.vendor}`);
      setSelectedBid(null);
      setSelectedTender(null);
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, bidPath);
    }
  };

  const renderBidAnalysis = () => (
    <AnimatePresence>
      {selectedBid && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div
            onClick={() => setSelectedBid(null)}
            className="absolute inset-0 bg-navy/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-4xl rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col"
          >
            <div className="p-10 bg-slate-bg/50 flex justify-between items-start border-b border-navy/5">
              <div className="flex items-center gap-8">
                <div className="w-16 h-16 bg-brand-red rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-red/20">
                  <Activity size={32} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-red uppercase tracking-[0.4em] mb-3 block">
                    Institutional Intelligence
                  </span>
                  <h3 className="text-3xl font-light tracking-tighter text-navy uppercase leading-none">
                    {selectedBid.hospitalName || selectedBid.vendor}
                  </h3>
                </div>
              </div>
              <button
                onClick={() => setSelectedBid(null)}
                className="w-12 h-12 rounded-full bg-white border border-navy/5 flex items-center justify-center text-navy/20 hover:text-navy hover:border-navy/20 transition-all active:scale-90 cursor-pointer"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-12 grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-10">
                <div>
                  <h4 className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-brand-red rounded-full" /> Lead Surgeon Profile
                  </h4>
                  <div className="bg-slate-bg p-8 rounded-[2rem] border border-navy/5">
                    <p className="text-xl font-bold text-navy tracking-tight">{selectedBid.surgeon}</p>
                    <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mt-2">
                      {selectedBid.experience || "Senior Consultant • 15+ Years"}
                    </p>
                  </div>
                </div>
                <div>
                  <h4 className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-brand-red rounded-full" /> Care Implementation
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedBid.inclusions?.map((inc: string) => (
                      <span key={inc} className="bg-white border border-navy/5 px-4 py-2 rounded-full text-[10px] font-bold text-navy uppercase tracking-widest">
                        {inc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <div>
                  <h4 className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-brand-red rounded-full" /> Financial Structure
                  </h4>
                  <div className="grid grid-cols-1 gap-4">
                     <div className="bg-navy p-8 rounded-[2rem] text-white">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Base Price</p>
                        <p className="text-3xl font-light tracking-tighter">${selectedBid.price?.toLocaleString()}</p>
                     </div>
                     <div className="bg-brand-red p-8 rounded-[2rem] text-white">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">Total Patient Price</p>
                        <p className="text-[clamp(2rem,4vw,4rem)] font-light tracking-tighter">
                          ${(selectedBid.price * (1 + (margins[selectedBid.vendorId || selectedBid.id] ?? selectedBid.margin) / 100))?.toLocaleString()}
                        </p>
                     </div>
                  </div>
                </div>
                <div className="pt-4">
                   <button 
                    onClick={handleIssueIntentToAward}
                    className="w-full bg-navy text-white py-6 rounded-full font-bold text-[10px] uppercase tracking-[0.4em] hover:bg-brand-red transition-all shadow-xl shadow-navy/10 active:scale-95 cursor-pointer"
                  >
                      Issue Intent To Award
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const renderShield = () => (
    <AnimatePresence>
      {isShieldOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            onClick={() => setIsShieldOpen(false)}
            className="absolute inset-0 bg-navy/60 backdrop-blur-md"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-white w-full max-w-6xl rounded-[3rem] overflow-hidden relative shadow-2xl flex flex-col h-[85vh]"
          >
            <div className="p-10 bg-[#051622] text-white flex justify-between items-center shrink-0 border-b border-white/5">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-brand-red rounded-2xl flex items-center justify-center font-bold text-white shadow-lg shadow-brand-red/20">
                  S
                </div>
                <div>
                  <h3 className="text-2xl font-light tracking-tighter uppercase">
                    Shield <span className="font-serif italic font-medium text-gradient pr-1">Communication</span> Bridge
                  </h3>
                  <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.4em] mt-1">
                    Proxy Relay System • Identity Protected
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsShieldOpen(false)}
                className="text-[10px] font-bold text-white/40 hover:text-white uppercase tracking-widest transition-colors cursor-pointer"
              >
                Terminate Bridge
              </button>
            </div>

            <div className="flex-1 flex overflow-hidden">
              {/* Vendor Selection Bar */}
              <div className="w-80 bg-slate-bg border-r border-navy/5 flex flex-col overflow-hidden">
                <div className="p-8 border-b border-navy/5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy/40">
                    Active Bidders
                  </p>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {bids.map((bid: any) => {
                    const currentId = bid.vendorId || bid.id;
                    return (
                      <button
                        key={currentId}
                        onClick={() => setSelectedVendorChatId(currentId)}
                        className={cn(
                          "w-full p-6 rounded-[2rem] text-left transition-all cursor-pointer",
                          selectedVendorChatId === currentId
                            ? "bg-white shadow-xl shadow-navy/5 translate-x-1"
                            : "hover:bg-white/50",
                        )}
                      >
                        <p className="text-[11px] font-bold uppercase tracking-tight text-navy line-clamp-1">
                          {bid.hospitalName || bid.vendor}
                        </p>
                        <p className="text-[9px] font-bold text-navy/40 uppercase mt-2 tracking-widest">
                          {currentId.slice(0, 8)} • Online
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pane A: Admin to Selected Vendor */}
              <div className="flex-1 flex flex-col border-r border-navy/5 bg-white">
                <div className="p-8 bg-white border-b border-navy/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-navy">
                      Admin ⇌{" "}
                      {bids.find(
                        (b: any) =>
                          (b.vendorId || b.id) === selectedVendorChatId,
                      )?.hospitalName || "Vendor"}
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-navy/20 uppercase tracking-widest">
                    Stage: Prequalification
                  </span>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  {(vendorMessages.length > 0
                    ? vendorMessages
                    : []
                  ).map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex flex-col",
                        msg.sender === "admin" ? "items-end" : "items-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] p-6 rounded-[2rem] text-[13px] font-medium leading-relaxed tracking-tight",
                          msg.sender === "admin"
                            ? "bg-navy text-white rounded-tr-none"
                            : "bg-slate-bg text-navy rounded-tl-none",
                        )}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] font-bold text-navy/20 uppercase tracking-widest mt-2 px-2">
                        {msg.sender} • {msg.time}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-8 bg-slate-bg/30 border-t border-navy/5">
                  <div className="flex gap-4">
                    <input
                      placeholder="Relay intel to vendor..."
                      className="flex-1 bg-white border-none rounded-[1.5rem] p-5 text-sm font-bold outline-none shadow-sm placeholder:text-navy/20"
                      value={adminChatMessageVendor}
                      onChange={(e) =>
                        setAdminChatMessageVendor(e.target.value)
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendShieldVendorMessage()
                      }
                    />
                    <button
                      className="bg-navy text-white px-8 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-navy/20 cursor-pointer hover:bg-brand-red transition-all"
                      onClick={handleSendShieldVendorMessage}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>

              {/* Pane B: Admin to Patient */}
              <div className="flex-1 flex flex-col bg-white">
                <div className="p-8 bg-white border-b border-navy/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-2 h-2 bg-brand-red rounded-full animate-pulse" />
                    <span className="text-[11px] font-bold uppercase tracking-widest text-navy">
                      Admin ⇌ Patient Lane
                    </span>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-8 space-y-6">
                  {patientMessages.map((msg, i) => (
                    <div
                      key={i}
                      className={cn(
                        "flex flex-col",
                        msg.sender === "admin" ? "items-end" : "items-start",
                      )}
                    >
                      <div
                        className={cn(
                          "max-w-[80%] p-6 rounded-[2rem] text-[13px] font-medium leading-relaxed tracking-tight",
                          msg.sender === "admin"
                            ? "bg-brand-red text-white rounded-tr-none"
                            : "bg-slate-bg text-navy rounded-tl-none",
                        )}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[9px] font-bold text-navy/20 uppercase tracking-widest mt-2 px-2">
                        {msg.sender} • {msg.time}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="p-8 bg-slate-bg/30 border-t border-navy/5">
                  <div className="flex gap-4">
                    <input
                      placeholder="Secure channel to patient..."
                      className="flex-1 bg-white border-none rounded-[1.5rem] p-5 text-sm font-bold outline-none shadow-sm placeholder:text-navy/20"
                      value={adminChatMessagePatient}
                      onChange={(e) =>
                        setAdminChatMessagePatient(e.target.value)
                      }
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleSendShieldPatientMessage()
                      }
                    />
                    <button
                      className="bg-brand-red text-white px-8 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-brand-red/20 cursor-pointer hover:bg-navy transition-all"
                      onClick={handleSendShieldPatientMessage}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  const ticketChatEndRef = React.useRef<HTMLDivElement>(null);
  useEffect(() => {
    ticketChatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeTicketMessages]);

  const handleReplyTicket = async () => {
    if (!ticketReply || !selectedTicketId || !user) return;
    try {
      const ticketPath = `support_tickets/${selectedTicketId}/messages`;
      await addDoc(collection(db, ticketPath), {
        text: ticketReply,
        sender: "admin",
        senderName: "GMAA Backend Team",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, "support_tickets", selectedTicketId), {
        lastUpdated: serverTimestamp(),
        status: "pending",
        lastMessage: ticketReply,
      });

      setTicketReply("");
    } catch (error) {
      handleFirestoreError(
        error,
        OperationType.WRITE,
        `support_tickets/${selectedTicketId}`,
      );
    }
  };

  const renderChat = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-navy uppercase tracking-tighter">
            Real-time Support Hub
          </h2>
          <p className="text-xs text-navy/40 font-bold uppercase tracking-widest mt-2">
            Direct coordination with users and institutions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[700px]">
        {/* Thread List */}
        <div className="xl:col-span-4 bg-white rounded-[40px] border border-navy/5 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-navy/5 bg-slate-bg/30">
            <h3 className="text-xs font-black uppercase tracking-widest text-navy">
              Active Conversations
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chatThreads.length > 0 ? (
              chatThreads.map((thread: any) => (
                <button
                  key={thread.id}
                  onClick={() => setSelectedChatThreadId(thread.id)}
                  className={cn(
                    "w-full text-left p-6 rounded-3xl border transition-all group",
                    selectedChatThreadId === thread.id
                      ? "bg-brand-red text-white border-transparent shadow-xl shadow-brand-red/20"
                      : "bg-white border-navy/5 hover:border-navy/20",
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={cn(
                        "text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md",
                        selectedChatThreadId === thread.id
                          ? "bg-white/10 text-white"
                          : "bg-emerald-500/10 text-emerald-600",
                      )}
                    >
                      Online
                    </span>
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-tight mb-2 truncate">
                    {thread.userName}
                  </h4>
                  <p
                    className={cn(
                      "text-[9px] font-medium mt-1 truncate",
                      selectedChatThreadId === thread.id
                        ? "text-white/60"
                        : "text-navy/40",
                    )}
                  >
                    {thread.lastMessage}
                  </p>
                  <p
                    className={cn(
                      "text-[8px] font-bold uppercase tracking-widest mt-3",
                      selectedChatThreadId === thread.id
                        ? "text-white/40"
                        : "text-navy/20",
                    )}
                  >
                    {thread.email}
                  </p>
                </button>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center p-10">
                <MessageCircle size={48} className="mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  No active threads
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Chat Detail */}
        <div className="xl:col-span-8 bg-white rounded-[40px] border border-navy/5 shadow-sm overflow-hidden flex flex-col">
          {selectedChatThreadId ? (
            <>
              <div className="p-8 border-b border-navy/5 flex justify-between items-center bg-slate-bg/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center text-white">
                    <MessageCircle size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-navy">
                      {chatThreads.find(t => t.id === selectedChatThreadId)?.userName}
                    </h3>
                    <p className="text-[9px] font-bold text-navy/40 uppercase tracking-[0.2em] mt-1">
                      Direct Support Thread
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-4 flex flex-col custom-scrollbar bg-slate-bg/10">
                {currentChatMessages.map((msg: any, i: number) => (
                  <div
                    key={i}
                    className={cn(
                      "max-w-[80%] flex flex-col",
                      msg.isAdmin ? "self-end" : "self-start",
                    )}
                  >
                    <div
                      className={cn(
                        "px-6 py-4 rounded-2xl text-[12px] font-medium leading-relaxed shadow-sm",
                        msg.isAdmin
                          ? "bg-brand-red text-white rounded-tr-none"
                          : "bg-white text-navy rounded-tl-none border border-navy/5",
                      )}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[8px] font-black text-navy/20 uppercase mt-2 px-2">
                      {msg.senderName}
                    </span>
                  </div>
                ))}
                <div ref={ticketChatEndRef} />
              </div>

              <div className="p-8 border-t border-navy/5 bg-white">
                <div className="flex gap-4">
                  <input
                    placeholder="Type response to user..."
                    className="flex-1 bg-slate-bg border-none rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-red/10 transition-all"
                    value={adminChatReply}
                    onChange={(e) => setAdminChatReply(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSendAdminChatReply()}
                  />
                  <button
                    onClick={handleSendAdminChatReply}
                    className="bg-brand-red text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-navy transition-all shadow-xl shadow-brand-red/10 active:scale-95 flex items-center gap-2"
                  >
                    Send <Send size={14} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 p-20">
              <MessageCircle size={64} className="mb-6" />
              <h3 className="text-xl font-black uppercase tracking-widest">
                Select a Thread
              </h3>
              <p className="text-[10px] font-bold mt-2 tracking-widest uppercase italic">
                Awaiting connection with global members
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderSupportTickets = () => (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-navy uppercase tracking-tighter">
            Vendor Support Desk
          </h2>
          <p className="text-xs text-navy/40 font-bold uppercase tracking-widest mt-2">
            Resolve dashboard issues and institutional concerns
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 h-[700px]">
        {/* Ticket List */}
        <div className="xl:col-span-4 bg-white rounded-[40px] border border-navy/5 shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-navy/5 bg-slate-bg/30">
            <h3 className="text-xs font-black uppercase tracking-widest text-navy">
              Active Tickets
            </h3>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {supportTickets.length > 0 ? (
              supportTickets.map((ticket: any) => (
                <button
                  key={ticket.id}
                  onClick={() => setSelectedTicketId(ticket.id)}
                  className={cn(
                    "w-full text-left p-6 rounded-3xl border transition-all group",
                    selectedTicketId === ticket.id
                      ? "bg-navy text-white border-transparent shadow-xl shadow-navy/20"
                      : "bg-white border-navy/5 hover:border-navy/20",
                  )}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={cn(
                        "text-[8px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md",
                        selectedTicketId === ticket.id
                          ? "bg-white/10 text-white"
                          : "bg-cyan/10 text-cyan",
                      )}
                    >
                      {ticket.status}
                    </span>
                    <span
                      className={cn(
                        "text-[8px] font-bold uppercase",
                        selectedTicketId === ticket.id
                          ? "text-white/40"
                          : "text-navy/20",
                      )}
                    >
                      {ticket.id.slice(0, 8)}
                    </span>
                  </div>
                  <h4 className="text-xs font-black uppercase tracking-tight mb-2 truncate">
                    {ticket.subject}
                  </h4>
                  <p
                    className={cn(
                      "text-[9px] font-bold uppercase tracking-widest mt-3",
                      selectedTicketId === ticket.id
                        ? "text-white/40"
                        : "text-navy/20",
                    )}
                  >
                    {ticket.vendorName}
                  </p>
                </button>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center opacity-20 text-center p-10">
                <LifeBuoy size={48} className="mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">
                  No active tickets
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Ticket Detail & Chat */}
        <div className="xl:col-span-8 bg-white rounded-[40px] border border-navy/5 shadow-sm overflow-hidden flex flex-col">
          {selectedTicketId ? (
            <>
              <div className="p-8 border-b border-navy/5 flex justify-between items-center bg-slate-bg/30">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center text-white">
                    <LifeBuoy size={18} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-tight text-navy">
                      {
                        supportTickets.find((t: any) => t.id === selectedTicketId)
                          ?.subject
                      }
                    </h3>
                    <p className="text-[9px] font-bold text-navy/40 uppercase tracking-[0.2em] mt-1">
                      {
                        supportTickets.find((t: any) => t.id === selectedTicketId)
                          ?.vendorName
                      }
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      updateDoc(doc(db, "support_tickets", selectedTicketId), {
                        status: "resolved",
                        lastUpdated: serverTimestamp(),
                      })
                    }
                    className="px-4 py-2 bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:shadow-lg transition-all"
                  >
                    Resolve Ticket
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-10 space-y-8 flex flex-col custom-scrollbar bg-slate-bg/10">
                {activeTicketMessages.map((msg: any, i: number) => (
                  <div
                    key={i}
                    className={cn(
                      "max-w-[80%] flex flex-col",
                      msg.sender === "admin" ? "self-end" : "self-start",
                    )}
                  >
                    <div
                      className={cn(
                        "px-6 py-5 rounded-[2rem] text-[12px] font-bold leading-relaxed shadow-sm",
                        msg.sender === "admin"
                          ? "bg-navy text-white rounded-tr-none"
                          : "bg-white text-navy rounded-tl-none border border-navy/5",
                      )}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[8px] font-black text-navy/20 uppercase mt-3 px-2">
                      {msg.sender === "admin" ? "GMAA Backend" : "Vendor"} •{" "}
                      {msg.time}
                    </span>
                  </div>
                ))}
              </div>

              <div className="p-8 border-t border-navy/5 bg-white">
                <div className="flex gap-4">
                  <input
                    placeholder="Reply to vendor concern..."
                    className="flex-1 bg-slate-bg border-none rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-navy/5 transition-all"
                    value={ticketReply}
                    onChange={(e) => setTicketReply(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleReplyTicket()}
                  />
                  <button
                    onClick={handleReplyTicket}
                    className="bg-navy text-white px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-red transition-all shadow-xl shadow-navy/10 active:scale-95"
                  >
                    Transmit Reply
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 p-20">
              <Ticket size={64} className="mb-6" />
              <h3 className="text-xl font-black uppercase tracking-widest">
                Select a Support Instance
              </h3>
              <p className="text-[10px] font-bold mt-2 tracking-widest uppercase italic">
                Monitor global institutional concerns in real-time
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTenders = () => {
    const filteredTenders = tenders.filter(tender => {
      if (tenderTypeFilter === "active") {
        return tender.status !== "closed";
      } else {
        return tender.status === "awarded" || tender.status === "closed";
      }
    });

    return (
      <div className="space-y-8">
        {selectedTender ? (
          renderBiddingHall()
        ) : (
          <>
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-[clamp(2rem,4vw,4rem)] font-light tracking-tighter text-navy uppercase">
                  Internal <span className="font-serif italic font-medium text-gradient pr-1">Tendering</span>
                </h2>
                <div className="flex items-center gap-2 mt-4 p-1.5 bg-slate-bg rounded-full w-fit border border-navy/5">
                  <button
                    onClick={() => setTenderTypeFilter("active")}
                    className={cn(
                      "px-8 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer",
                      tenderTypeFilter === "active" ? "bg-navy text-white shadow-lg" : "text-navy/40 hover:text-navy"
                    )}
                  >
                    Active Tenders
                  </button>
                  <button
                    onClick={() => setTenderTypeFilter("completed")}
                    className={cn(
                      "px-8 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer",
                      tenderTypeFilter === "completed" ? "bg-emerald-500 text-white shadow-lg" : "text-navy/40 hover:text-navy"
                    )}
                  >
                    Completed
                  </button>
                </div>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={handleSeedData}
                  disabled={isSeeding}
                  className={cn(
                    "px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 transition-all active:scale-95 cursor-pointer",
                    isSeeding
                      ? "bg-navy/10 text-navy/20 cursor-not-allowed"
                      : "bg-navy text-white hover:bg-brand-red shadow-xl shadow-navy/10",
                  )}
                >
                  {isSeeding ? "Seeding..." : "Seed Sample Market"}
                </button>
                <button
                  onClick={handleClearTenders}
                  disabled={isSeeding || tenders.length === 0}
                  className="px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] bg-brand-red/10 text-brand-red border border-brand-red/20 hover:bg-brand-red hover:text-white transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Clear All
                </button>
                <button
                  onClick={() => setIsNewTenderOpen(true)}
                  className="bg-brand-red text-white px-8 py-4 rounded-full font-bold uppercase tracking-widest text-[10px] flex items-center gap-3 shadow-xl shadow-brand-red/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Plus size={16} /> Post New Tender
                </button>
              </div>
            </div>

            {filteredTenders.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTenders.map((tender: any) => (
                  <div
                    key={tender.id}
                    onClick={() => setSelectedTender(tender)}
                    className="bg-white p-10 rounded-[2.5rem] border border-navy/5 shadow-sm hover:shadow-2xl transition-all relative overflow-hidden group cursor-pointer"
                  >
                    <div className="absolute top-0 right-0 p-8">
                      <div
                        className={cn(
                          "w-2 h-2 rounded-full",
                          tender.status === "open"
                            ? "bg-emerald-500 animate-pulse"
                            : tender.status === "awarded" 
                               ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" 
                               : "bg-amber-500",
                        )}
                      />
                    </div>
                    <div className="mb-8">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-red bg-brand-red/5 px-3 py-1 rounded-full">
                        {tender.id} • {tender.category}
                      </span>
                      <h3 className="text-2xl font-bold text-navy mt-6 leading-tight tracking-tight uppercase">
                        {tender.service}
                      </h3>
                      {tender.status === "awarded" && (
                        <div className="mt-2 flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-500/10 w-fit px-4 py-1.5 rounded-full">
                          <CheckCircle size={10} /> Awarded
                        </div>
                      )}
                    </div>

                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-3 text-navy/40">
                        <MapPin size={16} />
                        <span className="text-[11px] font-bold uppercase tracking-widest">
                          {tender.region}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-navy/40">
                        <Briefcase size={16} />
                        <span className="text-[11px] font-bold uppercase tracking-widest">
                          {tender.budget}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-navy/40">
                        <Clock size={16} className="text-navy/20" />
                        <span className="text-[11px] font-bold uppercase tracking-widest">
                          {tender.bids || 0} Competing Bids
                        </span>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-navy/5 flex items-center justify-end">
                      <button 
                        onClick={() => setSelectedTender(tender)}
                        className="w-12 h-12 border border-navy/10 rounded-full flex items-center justify-center text-navy/40 group-hover:bg-brand-red group-hover:text-white group-hover:border-transparent transition-all shadow-sm"
                      >
                        <ArrowRight size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white/50 border-2 border-dashed border-navy/5 rounded-[3rem] p-24 flex flex-col items-center justify-center text-center opacity-50">
                <Gavel size={64} className="text-navy/10 mb-8" />
                <h3 className="text-2xl font-light text-navy uppercase tracking-tighter">
                  No {tenderTypeFilter} Tenders
                </h3>
                <p className="text-[10px] font-bold text-navy/40 uppercase tracking-widest mt-4">
                  Marketplace is awaiting active requests
                </p>
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderLeads = () => {
    const filteredLeads = leads.filter(lead => {
      if (inquiryTypeFilter === "active") {
        return lead.status !== "lost" && lead.status !== "won";
      } else if (inquiryTypeFilter === "dead") {
        return lead.status === "lost";
      } else {
        return lead.status === "won";
      }
    });

    return (
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div>
            <h2 className="text-[clamp(2rem,4vw,4rem)] font-light tracking-tighter text-navy uppercase">
              Patient <span className="font-serif italic font-medium text-gradient pr-1">Enquiries</span>
            </h2>
            <div className="flex items-center gap-2 mt-4 p-1.5 bg-slate-bg rounded-full border border-navy/5 w-fit">
              <button
                onClick={() => setInquiryTypeFilter("active")}
                className={cn(
                  "px-8 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer",
                  inquiryTypeFilter === "active" ? "bg-navy text-white shadow-lg" : "text-navy/40 hover:text-navy"
                )}
              >
                Active Inquiries
              </button>
              <button
                onClick={() => setInquiryTypeFilter("dead")}
                className={cn(
                  "px-8 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer",
                  inquiryTypeFilter === "dead" ? "bg-brand-red text-white shadow-lg" : "text-navy/40 hover:text-navy"
                )}
              >
                Dead Inquiries
              </button>
              <button
                onClick={() => setInquiryTypeFilter("won")}
                className={cn(
                  "px-8 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all cursor-pointer",
                  inquiryTypeFilter === "won" ? "bg-emerald-500 text-white shadow-lg" : "text-navy/40 hover:text-navy"
                )}
              >
                Enquiries Won
              </button>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-8 py-6 rounded-3xl border border-navy/5 flex items-center gap-5">
              <div className="w-12 h-12 bg-cyan/10 text-cyan rounded-2xl flex items-center justify-center">
                <Users size={24} />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-navy/40">
                  Total Leads
                </p>
                <p className="text-2xl font-light tracking-tighter text-navy leading-none">{leads.length}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredLeads.length > 0 ? (
            filteredLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => setSelectedInquiry(lead)}
                className="bg-white p-8 rounded-[2.5rem] border border-navy/5 shadow-sm hover:shadow-xl transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 bg-slate-bg rounded-2xl flex items-center justify-center text-navy/20 group-hover:text-brand-red transition-colors">
                    <Users size={28} />
                  </div>
                  <div>
                    <div className="flex items-center gap-4">
                      <h4 className="font-bold text-navy text-[clamp(1rem,0.5vw+0.9rem,1.125rem)] tracking-tight">
                        {lead.name}
                      </h4>
                      <span
                        className={cn(
                          "text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                          lead.status === "new" ? "bg-cyan/10 text-brand-cyan" :
                          lead.status === "won" ? "bg-emerald-500/10 text-emerald-500" :
                          lead.status === "lost" ? "bg-brand-red/10 text-brand-red" :
                          lead.status === "processing" ? "bg-amber-500/10 text-amber-500" :
                          "bg-slate-bg text-navy/40",
                        )}
                      >
                        {lead.status}
                      </span>
                    </div>
                    <p className="text-base font-bold text-navy/60 mt-1 leading-tight tracking-tight uppercase">
                      {lead.request}
                    </p>
                    <p className="text-[10px] font-bold text-navy/20 uppercase tracking-[0.2em] mt-3">
                      Source: {lead.location} • Submitted {lead.date}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedInquiry(lead);
                    }}
                    className="px-8 py-4 bg-navy text-white text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-brand-red transition-all cursor-pointer"
                  >
                    Manage Dossier
                  </button>
                  {lead.status !== 'lost' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateLeadStatus(lead, 'won');
                      }}
                      className="px-8 py-4 bg-slate-bg text-navy text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-slate-200 transition-all border border-navy/5 cursor-pointer"
                    >
                      Launch Auction
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white p-24 rounded-[3rem] border border-navy/5 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-slate-bg rounded-[2rem] flex items-center justify-center text-navy/10 mb-8">
                <Users size={40} />
              </div>
              <h3 className="text-3xl font-light tracking-tighter text-navy mb-4 leading-tight uppercase">
                No {inquiryTypeFilter} inquiries <span className="font-serif italic font-medium text-gradient pr-1">found</span>
              </h3>
              <p className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.2em] max-w-[280px]">
                {inquiryTypeFilter === "active" 
                  ? "All inquiries have been processed or filed." 
                  : inquiryTypeFilter === "dead"
                  ? "No inquiries have been marked as lost yet."
                  : "No inquiries have been successfully closed as won yet."}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderOnboarding = () => (
    <div className="space-y-8">
      <div className="bg-[#051622] text-white p-12 rounded-[48px] relative overflow-hidden">
        <div className="absolute inset-0 bg-brand-red/5 blur-3xl rounded-full translate-x-1/2" />
        <div className="relative z-10 space-y-12">
          <div>
            <h2 className="text-[clamp(2rem,4vw,4rem)] font-light tracking-tighter text-navy uppercase leading-none mb-4">
              Onboarding <span className="font-serif italic font-medium text-gradient pr-1">Flow</span>
            </h2>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-[0.2em]">
              Tracking institutional registration across 6 Stages
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {STAGES_OVERVIEW.map((stage) => (
              <div key={stage.id} className="text-center group">
                <p
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-[0.3em] mb-2",
                    stage.color,
                  )}
                >
                  Stage {stage.id}
                </p>
                <p className="text-[clamp(2rem,4vw,4rem)] font-light group-hover:scale-110 transition-transform">
                  {stage.count}
                </p>
                <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest mt-1 leading-tight">
                  {stage.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {ONBOARDING_PIPELINE.map((item) => (
          <div
            key={item.id}
            className="bg-white p-8 rounded-[2.5rem] border border-navy/5 shadow-sm group hover:scale-[1.02] transition-all"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-bg rounded-2xl flex items-center justify-center font-bold text-navy text-xs border border-navy/5">
                  {item.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-navy text-base tracking-tight">
                    {item.name}
                  </h4>
                  <p className="text-[9px] font-bold text-navy/20 uppercase tracking-[0.2em] mt-1">
                    Institutional Partner • {item.id}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-widest text-brand-red">
                  {item.stage}
                </span>
                <p className="text-[9px] font-bold text-navy/20 uppercase mt-1">
                  {item.date}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest">
                <span className="text-navy/40">Status Check</span>
                <span className="text-navy">{item.progress}%</span>
              </div>
              <div className="h-1.5 w-full bg-slate-bg rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.progress}%` }}
                  className="h-full bg-brand-red"
                />
              </div>
            </div>

            <div className="mt-8 flex gap-3">
              <button className="flex-1 py-4 bg-navy text-white rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-brand-red transition-all cursor-pointer">
                Verify Compliance
              </button>
              <button className="px-6 py-4 bg-slate-bg text-navy rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-slate-200 transition-all cursor-pointer">
                Signal Org
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderInquiryDossier = () => {
    if (!selectedInquiry) return null;

    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed inset-0 z-[100] bg-navy/60 backdrop-blur-xl flex items-center justify-center p-4 lg:p-12"
      >
        <div className="bg-white w-full max-w-7xl h-full rounded-2xl md:rounded-[48px] overflow-hidden shadow-2xl flex flex-col border border-navy/10">
          {/* Header */}
          <div className="bg-[#051622] p-6 md:p-10 text-white flex justify-between items-center shrink-0 border-b border-white/5">
            <div className="flex items-center gap-8">
              <button
                onClick={() => setSelectedInquiry(null)}
                className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all text-white border border-white/10 cursor-pointer"
              >
                <ChevronRight className="rotate-180" size={24} />
              </button>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-2 block">
                  Admin Dossier Control • ID: {selectedInquiry.id}
                </span>
                <h2 className="text-3xl font-light tracking-tighter uppercase leading-none">
                  {selectedInquiry.name}
                </h2>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="px-6 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center gap-3">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                  Relay Node Active
                </span>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            {/* Left Column: Messages */}
            <div className="flex-1 flex flex-col border-b lg:border-b-0 lg:border-r border-navy/5 bg-slate-bg/30 h-1/2 lg:h-full overflow-hidden">
              <div className="p-8 border-b border-navy/5 flex justify-between items-center bg-white/50">
                <h3 className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.4em] text-navy/40">
                  Secure Communication Lane
                </h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 custom-scrollbar">
                {inquiryMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-20 text-center px-20">
                    <MessageCircle size={48} className="mb-4" />
                    <p className="text-sm font-black uppercase tracking-widest leading-loose text-navy">
                      Initiate secure relay with assigned vendors...
                    </p>
                  </div>
                ) : (
                  inquiryMessages.map((msg: any, i: number) => (
                    <div
                      key={i}
                      className={cn(
                        "max-w-[80%] flex flex-col",
                        msg.sender === "admin" ? "self-end" : "self-start",
                      )}
                    >
                      <div
                        className={cn(
                          "px-6 py-4 rounded-[2rem] text-sm font-medium leading-relaxed shadow-sm",
                          msg.sender === "admin"
                            ? "bg-brand-red text-white rounded-tr-none"
                            : "bg-white text-navy rounded-tl-none border border-navy/5",
                        )}
                      >
                        {msg.text}
                      </div>
                      <span className="text-[8px] font-black text-navy/20 uppercase mt-2 px-2 text-navy">
                        {msg.senderName} • {msg.time}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="p-8 bg-white border-t border-navy/5">
                <div className="flex gap-4">
                  <input
                    placeholder="Broadcast intelligence to vendors..."
                    className="flex-1 bg-slate-bg border-none rounded-2xl p-5 text-sm font-bold outline-none focus:ring-2 focus:ring-brand-red/20 transition-all text-navy"
                    value={inquiryChatMsg}
                    onChange={(e) => setInquiryChatMsg(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleSendInquiryMessage()
                    }
                  />
                  <button
                    onClick={handleSendInquiryMessage}
                    className="bg-brand-red text-white px-8 rounded-2xl flex items-center justify-center hover:bg-navy transition-all shadow-xl shadow-brand-red/20 active:scale-95"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Documents */}
            <div className="w-full lg:w-96 flex flex-col bg-white">
              <div className="p-6 border-b border-navy/5 flex justify-between items-center bg-slate-bg/50">
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-navy/40">
                  Secure Document Vault
                </h3>
                <button
                  onClick={handleUploadDossierDoc}
                  disabled={isUploading}
                  className="p-2 bg-brand-red text-white rounded-lg hover:scale-110 transition-transform disabled:opacity-50"
                >
                  <Plus size={16} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                {isUploading && (
                  <div className="p-6 bg-brand-red/5 border border-dashed border-brand-red/30 rounded-3xl flex items-center gap-4 animate-pulse">
                    <div className="w-10 h-10 bg-brand-red rounded-xl flex items-center justify-center text-white">
                      <Clock size={18} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase text-brand-red">
                        Processing...
                      </p>
                      <p className="text-[8px] font-bold text-brand-red/40">
                        Tiered Encryption
                      </p>
                    </div>
                  </div>
                )}
                {inquiryDocuments.length === 0 && !isUploading ? (
                  <div className="h-40 flex flex-col items-center justify-center opacity-10 text-center p-10">
                    <Paperclip size={32} className="mb-2 text-navy" />
                    <p className="text-[8px] font-black uppercase tracking-widest text-navy">
                      Vault is Empty
                    </p>
                  </div>
                ) : (
                  inquiryDocuments.map((doc: any) => (
                    <div
                      key={doc.id}
                      className="p-5 bg-slate-bg rounded-3xl border border-navy/5 hover:border-brand-red/30 transition-all group flex items-center gap-4"
                    >
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-navy/40 group-hover:bg-brand-red group-hover:text-white transition-all shadow-sm">
                        <Paperclip size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-black text-navy uppercase truncate">
                          {doc.name}
                        </p>
                        <p className="text-[8px] font-bold text-navy/40 uppercase mt-1">
                          {doc.size} • {doc.uploadedBy}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-8 border-t border-navy/5 bg-slate-bg/20">
                <div className="space-y-6">
                  <div>
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-navy/40 mb-3">
                      Contact Intel
                    </h4>
                    <div className="space-y-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-black text-navy/20 uppercase">Direct Email</span>
                        <span className="text-xs font-bold text-navy">{selectedInquiry.email}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-[8px] font-black text-navy/20 uppercase">Secure Line</span>
                        <span className="text-xs font-bold text-navy">{selectedInquiry.phone}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-navy/5">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-navy/40 mb-3">
                      Case Lifecycle Intel
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-navy/40 uppercase">Origin</span>
                        <span className="text-navy">{selectedInquiry.location}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-navy/40 uppercase">Request</span>
                        <span className="text-navy truncate ml-4 line-clamp-1">{selectedInquiry.request}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-navy/40 uppercase">Dossier ID</span>
                        <span className="text-navy">{selectedInquiry.id}</span>
                      </div>
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-navy/40 uppercase">Status</span>
                        <span className={cn(
                          "uppercase tracking-widest px-2 py-0.5 rounded-full text-[8px]",
                          selectedInquiry.status === 'won' ? "bg-emerald-500/10 text-emerald-500" :
                          selectedInquiry.status === 'lost' ? "bg-brand-red/10 text-brand-red" :
                          selectedInquiry.status === 'processing' ? "bg-amber-500/10 text-amber-500" :
                          "bg-navy/10 text-navy"
                        )}>
                          {selectedInquiry.status}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-navy/5">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-navy/40 mb-3">
                      Internal Intelligence
                    </h4>
                    <textarea
                      value={internalRemarksInput}
                      onChange={(e) => setInternalRemarksInput(e.target.value)}
                      placeholder="Enter internal notes, lead quality review, or deal strategy..."
                      className="w-full bg-slate-bg border-none rounded-xl p-3 text-[10px] font-bold text-navy outline-none focus:ring-1 focus:ring-navy/10 h-24 resize-none transition-all"
                    />
                    <button 
                      onClick={handleSaveInternalRemarks}
                      className="w-full mt-2 py-2 bg-navy text-white rounded-lg text-[8px] font-black uppercase tracking-widest hover:bg-navy/90 transition-all"
                    >
                      Archive Intelligence
                    </button>
                  </div>

                  <div className="pt-4 border-t border-navy/5 space-y-2">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-navy/40 mb-3">
                      Lifecycle Control
                    </h4>
                    <button 
                      onClick={() => handleUpdateLeadStatus('won')}
                      disabled={selectedInquiry.status === 'won'}
                      className={cn(
                        "w-full py-3 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                        selectedInquiry.status === 'won' ? "bg-emerald-500/40 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600"
                      )}
                    >
                      <CheckCircle size={14} />
                      Launch Auction (Lead Won)
                    </button>
                    <button 
                      onClick={() => handleUpdateLeadStatus('processing')}
                      disabled={selectedInquiry.status === 'won'}
                      className={cn(
                        "w-full py-3 text-white rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                        selectedInquiry.status === 'won' ? "bg-amber-500/40 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600"
                      )}
                    >
                      <Clock size={14} />
                      In Process
                    </button>
                    <button 
                      onClick={() => handleUpdateLeadStatus('lost')}
                      disabled={selectedInquiry.status === 'won'}
                      className={cn(
                        "w-full py-3 border rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2",
                        selectedInquiry.status === 'won' 
                          ? "bg-brand-red/5 text-brand-red/30 border-brand-red/10 cursor-not-allowed" 
                          : "bg-brand-red/10 text-brand-red border border-brand-red/20 hover:bg-brand-red/20"
                      )}
                    >
                      <XCircle size={14} />
                      Not Interested (Lead Lost)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const renderStats = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div
          className="bg-white p-12 rounded-[2.5rem] border border-navy/5 shadow-sm group hover:scale-[1.02] transition-all cursor-pointer"
          onClick={() => setActiveTab("onboarding")}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy/40 mb-6">
            Onboarding Pipeline
          </p>
          <div className="flex items-center justify-between">
            <h3 className="text-5xl font-light tracking-tighter text-navy">{ONBOARDING_PIPELINE.length}</h3>
            <div className="w-14 h-14 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
              <Briefcase size={28} />
            </div>
          </div>
          <p className="text-[10px] font-bold text-navy/20 uppercase tracking-[0.2em] mt-6 leading-none">
            Across 6 Operational Stages
          </p>
        </div>

        <div
          className="bg-white p-12 rounded-[2.5rem] border border-navy/5 shadow-sm group hover:scale-[1.02] transition-all cursor-pointer"
          onClick={() => setActiveTab("tenders")}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy/40 mb-6">
            Internal Tenders
          </p>
          <div className="flex items-center justify-between">
            <h3 className="text-5xl font-light tracking-tighter text-navy">{tenders.length}</h3>
            <div className="w-14 h-14 bg-brand-red/10 text-brand-red rounded-2xl flex items-center justify-center">
              <Gavel size={28} />
            </div>
          </div>
          <p className="text-[10px] font-bold text-navy/20 uppercase tracking-[0.2em] mt-6 leading-none">
            {bids.length} Active Competitive Bids
          </p>
        </div>

        <div
          className="bg-white p-12 rounded-[2.5rem] border border-navy/5 shadow-sm group hover:scale-[1.02] transition-all cursor-pointer"
          onClick={() => setActiveTab("leads")}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy/40 mb-6">
            Patient Enquiries
          </p>
          <div className="flex items-center justify-between">
            <h3 className="text-5xl font-light tracking-tighter text-navy">{leads.length}</h3>
            <div className="w-14 h-14 bg-cyan/10 text-cyan rounded-2xl flex items-center justify-center">
              <Users size={28} />
            </div>
          </div>
          <p className="text-[10px] font-bold text-navy/20 uppercase tracking-[0.2em] mt-6 leading-none">
            {leads.filter(l => l.status === 'new').length} High-Priority Leads
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-12 border border-navy/5 shadow-sm">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h3 className="text-[clamp(2rem,4vw,4rem)] font-light tracking-tighter text-navy uppercase">
                Platform <span className="font-serif italic font-medium text-gradient pr-1">Adoption</span>
              </h3>
              <p className="text-[10px] font-bold text-navy/20 uppercase tracking-[0.2em] mt-1">
                Aggregated user activity across all GMAA nodes
              </p>
            </div>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-brand-red rounded-full" />
                <span className="text-[10px] font-bold uppercase text-navy/40 tracking-widest">
                  Patients
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-navy rounded-full" />
                <span className="text-[10px] font-bold uppercase text-navy/40 tracking-widest">
                  Vendors
                </span>
              </div>
            </div>
          </div>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={USER_ACTIVITY_DATA}>
                <defs>
                  <linearGradient
                    id="colorPatients"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#C41E3A" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#C41E3A" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorVendors" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0A2647" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0A2647" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#F0F2F5"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: "#0A2647", fontWeight: 700 }}
                  dy={10}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    borderRadius: "24px",
                    border: "none",
                    boxShadow: "0 25px 50px -12px rgb(0 0 0 / 0.25)",
                    backgroundColor: "#ffffff",
                    fontSize: '10px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="patients"
                  stroke="#C41E3A"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorPatients)"
                />
                <Area
                  type="monotone"
                  dataKey="vendors"
                  stroke="#0A2647"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorVendors)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-navy rounded-[3rem] p-12 text-white shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-700" />
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-white/40 mb-3 block">
              System Throughput
            </h4>
            <p className="text-5xl font-light tracking-tighter mb-10">99.98%</p>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-white/40">
                <span>API Performance</span>
                <span className="text-emerald-400">Stable</span>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "99%" }}
                  className="h-full bg-emerald-400"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-[3rem] p-12 border border-navy/5 shadow-sm">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-navy/40 mb-8 block">
              Regional Distribution
            </h4>
            <div className="space-y-8">
              {[
                { label: "Americas", val: "12%", color: "bg-navy" },
                { label: "Europe", val: "45%", color: "bg-brand-red" },
                { label: "Asia Pac", val: "38%", color: "bg-cyan" },
                { label: "MEA", val: "5%", color: "bg-slate-bg" },
              ].map((reg) => (
                <div key={reg.label} className="space-y-3">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest leading-none">
                    <span className="text-navy/60">{reg.label}</span>
                    <span className="text-navy">{reg.val}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-bg rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: reg.val }}
                      className={cn("h-full", reg.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={cn(
        "flex h-screen bg-[#F0F2F5] text-navy overflow-hidden relative",
      )}
    >
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-navy/60 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Admin Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 w-80 bg-[#051622] flex flex-col pt-10 border-r border-white/5 z-[60] shrink-0 shadow-2xl shadow-navy/20 transition-transform duration-500 lg:relative lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="px-10 mb-12">
          <button
            onClick={() => onHome ? onHome() : setActiveTab("stats")}
            className="flex items-center gap-4 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-brand-red rounded-2xl flex items-center justify-center font-bold text-white group-hover:scale-110 transition-transform shadow-lg shadow-brand-red/20">
              M
            </div>
            <span className="text-white font-bold tracking-[0.3em] text-[10px] uppercase">
              GMAA Vendors
            </span>
          </button>
        </div>

        <nav className="flex-1 px-8 space-y-3">
          {[
            { id: "stats", label: "Command Center", icon: Activity },
            { id: "onboarding", label: "Vendor Onboarding", icon: Briefcase },
            { id: "tenders", label: "Internal Tenders", icon: Gavel },
            { id: "registry", label: "Global Registry", icon: Globe2 },
            { id: "leads", label: "Patient Enquiries", icon: Users, badge: 12 },
            { id: "chat", label: "Real-time Support", icon: MessageCircle },
            { id: "support", label: "Support Tickets", icon: LifeBuoy },
            {
              id: "verification",
              label: "Compliance Audit",
              icon: FileSearch,
              badge: 3,
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === "registry" && onViewChange) {
                  onViewChange("vendors");
                } else {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }
              }}
              className={cn(
                "w-full flex items-center justify-between px-6 py-4 rounded-full transition-all group cursor-pointer",
                activeTab === item.id
                  ? "bg-brand-red text-white shadow-xl shadow-brand-red/20"
                  : "text-white/40 hover:bg-white/5 hover:text-white",
              )}
            >
              <div className="flex items-center gap-5">
                <item.icon size={18} />
                <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
                  {item.label}
                </span>
              </div>
              {item.badge && (
                <span className="bg-white/10 text-[9px] font-bold px-3 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-10 border-t border-white/5">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-5 text-white/40 hover:text-brand-red transition-all group cursor-pointer"
          >
            <LogOut
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-[10px] font-bold uppercase tracking-widest leading-none">
              Terminate Session
            </span>
          </button>
        </div>
      </aside>

      {/* Main Admin Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Mobile Header Toggle */}
        <div className="lg:hidden absolute top-8 left-8 z-40">
           <button 
             onClick={() => setIsSidebarOpen(true)}
             className="p-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl text-white hover:bg-white/20 transition-all shadow-xl"
           >
             <Menu size={20} />
           </button>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-slate-bg/50 pt-24 md:pt-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              {activeTab === "verification" && renderVerification()}
              {activeTab === "support" && renderSupportTickets()}
              {activeTab === "chat" && renderChat()}
              {activeTab === "tenders" && renderTenders()}
              {activeTab === "onboarding" && renderOnboarding()}
              {activeTab === "leads" && renderLeads()}
              {activeTab === "stats" && renderStats()}
              {renderShield()}
              {renderBidAnalysis()}
              {selectedInquiry && renderInquiryDossier()}
              {activeTab === "infrastructure" && (
                <div className="flex flex-col items-center justify-center h-[60vh] text-center opacity-40">
                  <Globe2 size={64} className="mb-4" />
                  <h3 className="text-xl font-black uppercase tracking-widest">
                    Global Node Registry
                  </h3>
                  <p className="text-[10px] font-bold mt-2 tracking-widest uppercase">
                    Secure decentralized node map loading...
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* New Tender Modal Simulation */}
      {isNewTenderOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            onClick={() => setIsNewTenderOpen(false)}
            className="absolute inset-0 bg-navy/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white w-full max-w-xl rounded-[3rem] p-12 relative shadow-2xl"
          >
            <h3 className="text-[clamp(2rem,4vw,4rem)] font-light text-navy uppercase tracking-tighter mb-10 leading-none">
              Auction <span className="font-serif italic font-medium text-gradient pr-1">Configuration</span>
            </h3>
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4 mb-2 block">
                    Service Category
                  </label>
                  <select
                    value={newTender.category}
                    onChange={(e) =>
                      setNewTender({ ...newTender, category: e.target.value })
                    }
                    className="w-full bg-slate-bg border-none rounded-2xl p-4 text-xs font-bold ring-navy/5 ring-1 focus:ring-navy/20 outline-none transition-all"
                  >
                    <option>Orthopaedics</option>
                    <option>Cardiology</option>
                    <option>Oncology</option>
                    <option>Neurology</option>
                    <option>General</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4 mb-2 block">
                    Specific Service
                  </label>
                  <input
                    type="text"
                    value={newTender.service}
                    onChange={(e) =>
                      setNewTender({ ...newTender, service: e.target.value })
                    }
                    placeholder="e.g. Knee Replacement"
                    className="w-full bg-slate-bg border-none rounded-2xl p-4 text-xs font-bold ring-navy/5 ring-1 focus:ring-navy/20 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4 mb-2 block">
                  Tender Description
                </label>
                <textarea
                  className="w-full bg-slate-bg border-none rounded-2xl p-4 text-xs font-bold ring-navy/5 ring-1 focus:ring-navy/20 outline-none transition-all resize-none h-24 mb-6 shadow-sm font-sans"
                  placeholder="Specify precision requirements, accreditation bars, and clinical scope..."
                  value={newTender.description}
                  onChange={(e) =>
                    setNewTender({ ...newTender, description: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4 mb-2 block">
                  Case Requirements (One per line)
                </label>
                <textarea
                  className="w-full bg-slate-bg border-none rounded-2xl p-4 text-xs font-bold ring-navy/5 ring-1 focus:ring-navy/20 outline-none transition-all resize-none h-24 mb-6 shadow-sm font-sans"
                  placeholder="Enter specific patient or institutional requirements..."
                  value={newTender.requirements}
                  onChange={(e) =>
                    setNewTender({ ...newTender, requirements: e.target.value })
                  }
                />
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center bg-slate-bg/50 p-6 rounded-2xl border border-navy/5">
                  <div>
                    <p className="text-[10px] font-black text-navy uppercase tracking-tight">
                      Institutional Broadcast
                    </p>
                    <p className="text-[8px] font-bold text-navy/40 uppercase tracking-widest">
                      Auto-notify all verified vendors
                    </p>
                  </div>
                  <div
                    onClick={() => setShouldBroadcast(!shouldBroadcast)}
                    className={cn(
                      "w-12 h-6 rounded-full relative p-1 cursor-pointer transition-colors duration-300 shadow-inner",
                      shouldBroadcast ? "bg-brand-red" : "bg-navy/20",
                    )}
                  >
                    <motion.div
                      animate={{ x: shouldBroadcast ? 24 : 0 }}
                      className="w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mb-8 bg-slate-bg/50 p-6 rounded-2xl border border-navy/5">
                  <div>
                    <p className="text-[10px] font-black text-navy uppercase tracking-tight">
                      Identity Masking
                    </p>
                    <p className="text-[8px] font-bold text-navy/40 uppercase tracking-widest">
                      Hide patient PII during bidding
                    </p>
                  </div>
                  <div className="w-10 h-5 bg-navy rounded-full relative p-1 cursor-pointer">
                    <div className="w-3 h-3 bg-brand-red rounded-full absolute right-1" />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4 mb-2 block">
                    Region
                  </label>
                  <input
                    className="w-full bg-slate-bg border-none rounded-2xl p-4 text-xs font-bold ring-navy/5 ring-1 focus:ring-navy/20 outline-none transition-all"
                    value={newTender.region}
                    onChange={(e) =>
                      setNewTender({ ...newTender, region: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-navy/40 ml-4 mb-2 block">
                    Ceiling Budget
                  </label>
                  <input
                    className="w-full bg-slate-bg border-none rounded-2xl p-4 text-xs font-bold ring-navy/5 ring-1 focus:ring-navy/20 outline-none transition-all"
                    placeholder="$0.00"
                    value={newTender.budget}
                    onChange={(e) =>
                      setNewTender({ ...newTender, budget: e.target.value })
                    }
                  />
                </div>
              </div>
              <button
                onClick={handleLaunchTender}
                disabled={isBroadcasting}
                className={cn(
                  "w-full py-5 text-white rounded-2xl font-black uppercase tracking-[0.4em] text-[10px] transition-all shadow-xl mt-4",
                  isBroadcasting
                    ? "bg-navy/40 cursor-wait"
                    : "bg-navy hover:bg-brand-red shadow-navy/20",
                )}
              >
                {isBroadcasting
                  ? "Broadcasting Intelligence..."
                  : "Launch Open Auction"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

function AdminStatCard({
  title,
  value,
  trend,
  label,
}: {
  title: string;
  value: string;
  trend: string;
  label: string;
}) {
  return (
    <div className="bg-white p-8 rounded-[2rem] border border-navy/5 shadow-sm group hover:shadow-xl transition-all">
      <p className="text-[10px] font-bold text-navy/40 uppercase tracking-[0.4em] mb-1">
        {title}
      </p>
      <div className="flex items-end gap-3 mb-4">
        <h3 className="text-5xl font-light text-navy tracking-tighter leading-none">
          {value}
        </h3>
        <span
          className={cn(
            "text-[10px] font-bold mb-1",
            trend.startsWith("+") ? "text-emerald-500" : "text-brand-red",
          )}
        >
          {trend}
        </span>
      </div>
      <div className="flex items-center gap-2 pt-4 border-t border-navy/5">
        <Globe2 size={12} className="text-navy/20" />
        <span className="text-[10px] font-bold text-navy/20 uppercase tracking-[0.4em]">
          {label}
        </span>
      </div>
    </div>
  );
}

function SecurityNode({
  label,
  status,
  highlight,
  warning,
}: {
  label: string;
  status: string;
  highlight?: boolean;
  warning?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">
        {label}
      </span>
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "text-[8px] font-black uppercase tracking-widest",
            warning
              ? "text-amber-500"
              : highlight
                ? "text-cyan"
                : "text-emerald-500",
          )}
        >
          {status}
        </span>
        <div
          className={cn(
            "w-1.5 h-1.5 rounded-full",
            warning
              ? "bg-amber-500 animate-pulse"
              : highlight
                ? "bg-cyan"
                : "bg-emerald-500",
          )}
        />
      </div>
    </div>
  );
}
