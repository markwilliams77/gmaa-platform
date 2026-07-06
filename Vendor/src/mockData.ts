/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  Tender, 
  TenderStatus, 
  Consultation, 
  ConsultationStatus, 
  Message, 
  AwardedProject, 
  HospitalProfile 
} from "./types";

export const INITIAL_VENDOR_NAME = "Apex Elite Care Global";
export const VENDOR_SUBTITLE = "Global Medical Assistance Alliance Premium Partner";

export const MOCK_KPIS = {
  profileViews: { value: "12,486", change: "+18%", label: "Profile Views" },
  consultations: { value: "34", change: "+12%", label: "Consultation Requests" },
  tenders: { value: "18", change: "5 Pending", label: "Tender Invitations" },
  awards: { value: "4 Awards", change: "22% Win Rate", label: "Projects Awarded" }
};

export const MOCK_FUNNEL = {
  received: 42,
  contacted: 18,
  qualified: 9,
  converted: 3,
};

export const MOCK_TENDER_PERFORMANCE = {
  invited: 15,
  submitted: 10,
  l1Ranking: 4,
  awarded: 2,
};

export const MOCK_SEARCHED_SERVICES = [
  { name: "Orthopaedics", percentage: 38 },
  { name: "Cardiology", percentage: 22 },
  { name: "Oncology", percentage: 17 },
  { name: "Neurosurgery", percentage: 13 },
  { name: "Cosmetic Surgery", percentage: 10 },
];

export const MOCK_TOP_TREATMENTS = [
  { name: "Knee Replacement Surgery", count: 18, category: "Orthopaedics", growth: "+8%" },
  { name: "Off-Pump Heart Bypass (CABG)", count: 14, category: "Cardiology", growth: "+15%" },
  { name: "In Vitro Fertilization (IVF) Cycle", count: 11, category: "Gynaecology", growth: "+4%" },
  { name: "Stereotactic CyberKnife Radiations", count: 9, category: "Oncology", growth: "+20%" },
];

export const MOCK_GEOGRAPHY_COUNTRIES = [
  { country: "India", percentage: 52, color: "#0c4a6e" },
  { country: "UAE", percentage: 18, color: "#0284c7" },
  { country: "Nigeria", percentage: 12, color: "#06b6d4" },
  { country: "Kenya", percentage: 9, color: "#22d3ee" },
  { country: "UK", percentage: 4, color: "#a5f3fc" },
  { country: "Other", percentage: 5, color: "#e2e8f0" }
];

export const MOCK_GEOGRAPHY_CITIES = [
  { name: "Mumbai", count: 145, region: "India" },
  { name: "Delhi", count: 98, region: "India" },
  { name: "Dubai", count: 62, region: "UAE" },
  { name: "Abuja", count: 41, region: "Nigeria" },
  { name: "Nairobi", count: 31, region: "Kenya" },
];

export const MOCK_PROFILE_HEALTH = {
  score: 82,
  suggestions: [
    { id: "sug_1", text: "Upload Accreditation Documents", points: "+10%", category: "Accreditations" },
    { id: "sug_2", text: "Add Doctor Profiles (Neuro / Cardio)", points: "+5%", category: "Team Expansion" },
    { id: "sug_3", text: "Add Treatment Packages", points: "+5%", category: "Pricing" },
    { id: "sug_4", text: "Add Full-Resolution Facility Images", points: "+3%", category: "Media Studio" },
    { id: "sug_5", text: "Add Walkthrough Videos of VIP Lounge", points: "+5%", category: "Client Conversion" }
  ]
};

export const MOCK_COMPETITIVE_INSIGHTS = [
  { title: "Top 10% Profile Views", description: "Your facility is in the highest decile of user visits on GMAA Marketplace this quarter.", rating: "Outstanding" },
  { title: "Top 15% Conversion Rate", description: "Your inquiry-to-consultation rating beats 85% of other alliance partners.", rating: "Excellent" },
  { title: "Top 20% Response Time", description: "Avg response speed of 1.4 hours keeps patient interest hot.", rating: "High Speed" }
];

export const MOCK_ACTIVITIES = [
  { id: "act_1", type: "consultation", text: "New consultation request received for Heart Bypass", time: "10 mins ago", unread: true },
  { id: "act_2", type: "tender_invitation", text: "Tender Invitation received for UAE Cardiology Complex Tender TND-2026-614", time: "2 hours ago", unread: true },
  { id: "act_3", type: "bid_submitted", text: "Corporate Bid package submitted for Orthopaedics Joint Reconstruct TND-2026-441", time: "1 day ago", unread: false },
  { id: "act_4", type: "tender_awarded", text: "L1 Tender Awarded! 'Comprehensive Pediatric Cancer Support' Tender TND-2026-904", time: "3 days ago", unread: false },
  { id: "act_5", type: "profile_update", text: "Hospital license document successfully approved by GMAA compliance", time: "5 days ago", unread: false }
];

export const INITIAL_TENDERS: Tender[] = [
  {
    id: "TND-2026-8942",
    title: "Regional Orthopaedic Surgery Alliance (Joint Replacement)",
    category: "Orthopaedics",
    region: "India",
    budget: 350000,
    deadline: "2026-07-28",
    status: TenderStatus.Open,
    isBookmarked: false,
    description: "The Global Medical Assistance Alliance (GMAA) is inviting qualified medical networks to provide unified orthopaedic joint replacements (knees & hips) package structures for up to 300 adult patience cohorts relocating from East Africa over a 12-month period. Bids must cover all pre-operative, surgery, implant quality logs, and detailed inpatient post-op care.",
    requirements: [
      { id: "req_1", title: "NABH or JCI Accreditation", description: "Must submit current valid JCI or gold-standard national accreditation certificate.", mandatory: true },
      { id: "req_2", title: "Dedicated International Patient Desk", description: "24/7 dedicated support representative for GMAA patient cohorts is required.", mandatory: true },
      { id: "req_3", title: "Inclusive Post-Op Rehabilitation", description: "Minimum 5 days of structured physical therapy inpatient sessions must be explicitly budgeted.", mandatory: true },
      { id: "req_4", title: "Fix Price Guarantee", description: "Price locks for 15 months without extra unexpected charges for normal incident complications.", mandatory: false }
    ],
    documents: [
      { name: "GMAA-Orthopaedic-Tender-Spec-v3.pdf", size: "2.4 MB", url: "#" },
      { name: "Joint-Replacement-SLA-Template.docx", size: "840 KB", url: "#" }
    ]
  },
  {
    id: "TND-2026-6124",
    title: "Oncology Care Network Pilot (High Precision Immunotherapy)",
    category: "Oncology",
    region: "UAE",
    budget: 680000,
    deadline: "2026-06-30",
    status: TenderStatus.Submitted,
    rank: "L1",
    isBookmarked: true,
    description: "GMAA seeks highly advanced oncology provider for personalized target therapies and immunotherapies. This high-prestige trial establishes direct, secure referral links covering premium GMAA corporate insurance employees in GCC regions.",
    requirements: [
      { id: "req_1", title: "Next-Gen Sequencing (NGS) Onsite Labs", description: "Ability to perform genetic sequencing reviews within 48 hours is mandatory.", mandatory: true },
      { id: "req_2", title: "State of Art Radiation Suites", description: "Must possess modern Linear Accelerator (LINAC) systems or equivalent CyberKnife setups.", mandatory: true }
    ],
    documents: [
      { name: "Oncology-Immunotherapist-Requirements.pdf", size: "1.8 MB", url: "#" }
    ]
  },
  {
    id: "TND-2026-4411",
    title: "High-Volume Cardiology Invasive Catheterization Framework",
    category: "Cardiology",
    region: "Nigeria",
    budget: 520000,
    deadline: "2026-08-04",
    status: TenderStatus.Open,
    isBookmarked: false,
    description: "Multi-year heart health framework catering to private and diplomatic GMAA members needing specialized intervention cardiology (angioplasty and stents). Highlights need for high-quality American/European FDA certified stent materials in all interventions.",
    requirements: [
      { id: "req_1", title: "Minimal Wait Time", description: "Triage response with confirmed surgery slot allocation within 72 hours of GMAA referral.", mandatory: true },
      { id: "req_2", title: "Premium Drug-Eluting Stents Only", description: "Proof of clinical certifications for standard FDA approved hardware must be loaded.", mandatory: true }
    ],
    documents: [
      { name: "Invasive-Cardio-Framework-2026.pdf", size: "3.1 MB", url: "#" }
    ]
  },
  {
    id: "TND-2026-9041",
    title: "Comprehensive Pediatric Cancer Support Program",
    category: "Oncology",
    region: "Kenya",
    budget: 450000,
    deadline: "2026-05-18",
    status: TenderStatus.Awarded,
    rank: "L1",
    isBookmarked: false,
    description: "Dedicated child-care cancer response alliance including multi-disciplinary pediatric tumor boards. Bid was won on high success rates and integrated luxury family lodging options.",
    requirements: [
      { id: "req_1", title: "Pediatric Board Certifications", description: "Entire critical care medical staff must hold pediatric medical fellowships.", mandatory: true }
    ],
    documents: [
      { name: "Pediatric-Cancer-Proposal-Approved.pdf", size: "4.2 MB", url: "#" }
    ]
  },
  {
    id: "TND-2026-1122",
    title: "Cosmetic Surgery & Aesthetics Corporate Incentive Plan",
    category: "Cosmetic Surgery",
    region: "UK",
    budget: 220000,
    deadline: "2026-07-20",
    status: TenderStatus.Open,
    isBookmarked: false,
    description: "An innovative corporate incentive plan providing high-end aesthetics, corrective reconstructive surgeries, and non-invasive health spa packages for international high-net-worth cohorts.",
    requirements: [
      { id: "req_1", title: "Premium VIP Suites", description: "Private luxury single suites with independent secure access for absolute privacy.", mandatory: true }
    ],
    documents: [
      { name: "HNW-Aesthetics-Framework.pdf", size: "1.2 MB", url: "#" }
    ]
  },
  {
    id: "TND-2026-2580",
    title: "Neurological Spine Stabilization Initiative",
    category: "Neurosurgery",
    region: "India",
    budget: 890000,
    deadline: "2026-06-25",
    status: TenderStatus.Submitted,
    rank: "L2",
    isBookmarked: true,
    description: "High precision spine implants, micro-neurosurgery, and innovative robotic spinal fusion operations. Requires strict clinical safety logs.",
    requirements: [
      { id: "req_1", title: "O-Arm & Stealth Navigation", description: "Intraoperative imaging and robotically guided systems must be fully detailed.", mandatory: true }
    ],
    documents: [
      { name: "Robotic-Spine-TenderSpecs.pdf", size: "2.9 MB", url: "#" }
    ]
  }
];

export const INITIAL_CONSULTATIONS: Consultation[] = [
  {
    id: "CON-4912",
    patientName: "Michael Olusegun",
    age: 54,
    gender: "Male",
    country: "Nigeria",
    city: "Abuja",
    treatment: "Double Valve Heart Replacement Surgery",
    date: "2026-06-12",
    status: ConsultationStatus.NEW,
    email: "m.olusegun@premiumenergy.com",
    phone: "+234 803 124 9901",
    medicalHistory: "Diagnosed with severe aortic and mitral regurgitation 8 months ago. Patient is active but suffers from mild exertional dyspnea. Prefers mechanical valve due to age and life expectancy. No significant comorbidities, non-smoker."
  },
  {
    id: "CON-3801",
    patientName: "Fatima Al-Mansoori",
    age: 41,
    gender: "Female",
    country: "UAE",
    city: "Dubai",
    treatment: "High-Dose Immunotherapy & Tumor Sequencing",
    date: "2026-06-11",
    status: ConsultationStatus.CONTACTED,
    email: "f.almansoori@dubaichamber.gov.ae",
    phone: "+971 50 223 9940",
    medicalHistory: "Stage III Triple-Negative Breast Cancer. Local chemotherapy has been completed but patient desires secondary opinion regarding state-of-the-art immunotherapeutic drugs and premium clinical trials available in Apex medical channels."
  },
  {
    id: "CON-2094",
    patientName: "Aarav Sharma",
    age: 62,
    gender: "Male",
    country: "India",
    city: "Delhi",
    treatment: "Robotic Bilateral Knee Replacement",
    date: "2026-06-08",
    status: ConsultationStatus.QUALIFIED,
    email: "aarav.sharma@techventure.in",
    phone: "+91 98110 44521",
    medicalHistory: "Severe bilateral osteoarthritis. Inability to walk continuously for more than 100 meters. Patient requires minimal tissue trauma approaches to resume light jogging and golf. High executive priorities."
  },
  {
    id: "CON-1102",
    patientName: "Elizabeth Thornton",
    age: 38,
    gender: "Female",
    country: "UK",
    city: "London",
    treatment: "ICSI & Advanced IVF Package",
    date: "2026-06-05",
    status: ConsultationStatus.CONVERTED,
    email: "e.thornton@mclean-finance.co.uk",
    phone: "+44 7700 900077",
    medicalHistory: "Primary infertility for 4 years. Unsuccessful local NHS cycle. Desires advanced pre-implantation genetic screening (PGS) alongside high-technology ICSI parameters to maximize success indices."
  },
  {
    id: "CON-0451",
    patientName: "Geofrey Kipchoge",
    age: 47,
    gender: "Male",
    country: "Kenya",
    city: "Nairobi",
    treatment: "Spinale Fusion & L4-L5 Stabilization",
    date: "2026-06-02",
    status: ConsultationStatus.REJECTED,
    email: "g.kipchoge@safari-invest.co.ke",
    phone: "+254 722 004 119",
    medicalHistory: "Chronic herniated disc. Patient was qualified but elected to postpone surgery due to major local schedule issues. Retain on fallback lists for Q4 follow-ups."
  },
  {
    id: "CON-9061",
    patientName: "Priya Nair",
    age: 29,
    gender: "Female",
    country: "India",
    city: "Mumbai",
    treatment: "Post-Traumatic Facial Reconstruction",
    date: "2026-06-14",
    status: ConsultationStatus.NEW,
    email: "priya.nair@mumbaistyle.com",
    phone: "+91 22 2490 8871",
    medicalHistory: "Suffered mild facial fractures in traffic accident. Seeks state-of-the-art reconstructive bone modeling and laser surgical touch-ups for scarring. Extremely high response priority."
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: "msg_1",
    sender: "GMAA Tender Audit Board",
    senderRole: "Compliance Unit",
    text: "Review completed for UAE Cardiology TND-2026-6124. Your submitted bid is cataloged in the leader tier. Direct feedback and clarifications are now unlocked below.",
    timestamp: "10:14 AM",
    isRead: false,
    source: "Tender Support",
    threadId: "TND-2026-6124"
  },
  {
    id: "msg_2",
    sender: "Amara Ekene",
    senderRole: "GMAA Medical Coordinator",
    text: "Can we coordinate a video consultation for Nigeria patient Michael Olusegun regarding his valve preference? The patient is available this Thursday at 3 PM West Africa Time.",
    timestamp: "Yesterday",
    isRead: false,
    source: "GMAA Messages",
    avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    threadId: "CON-4912"
  },
  {
    id: "msg_3",
    sender: "GMAA System Automations",
    senderRole: "Platform Analytics",
    text: "Congratulations! Your profile search exposure rose by +14% last week after updating your accreditation credentials to Gold-Level GMAA Alliance standard.",
    timestamp: "2 days ago",
    isRead: true,
    source: "System Notifications",
    threadId: "sys_status_01"
  },
  {
    id: "msg_4",
    sender: "Dr. Vikram Seth",
    senderRole: "Lead Coordinator",
    text: "I have added compliance checklists for Joint Replacements (India). Let's review before other orthopaedic bids close next week.",
    timestamp: "3 days ago",
    isRead: true,
    source: "Tender Support",
    threadId: "TND-2026-8942"
  }
];

export const INITIAL_AWARDS: AwardedProject[] = [
  {
    id: "AWD-2026-004",
    tenderId: "TND-2026-9041",
    category: "Oncology",
    title: "Comprehensive Pediatric Cancer Support Program",
    projectValue: 450000,
    awardDate: "2026-05-18",
    status: "Active",
    region: "Kenya"
  },
  {
    id: "AWD-2025-091",
    tenderId: "TND-2025-1882",
    category: "Orthopaedics",
    title: "Specialized Sports Medicine & Joint Framework Lot 2",
    projectValue: 320000,
    awardDate: "2025-11-05",
    status: "Completed",
    region: "India"
  },
  {
    id: "AWD-2026-102",
    tenderId: "TND-2026-1090",
    category: "Cardiology",
    title: "Heart-Valve Congenital Response Initiative Phase II",
    projectValue: 710000,
    awardDate: "2026-04-12",
    status: "Active",
    region: "UAE"
  },
  {
    id: "AWD-2026-015",
    tenderId: "TND-2026-3021",
    category: "Neurosurgery",
    title: "Primary Micro-Neurosurgical Outreach",
    projectValue: 280000,
    awardDate: "2026-03-01",
    status: "Pending Handover",
    region: "Nigeria"
  }
];

export const INITIAL_PROFILE: HospitalProfile = {
  name: "Apex Elite Care Global",
  legalName: "Apex Specialty Hospitals & Alliance Ltd",
  accreditationLevel: "JCI Accredited & Gold GMAA Certified Network",
  bedsCount: 750,
  establishedYear: 2011,
  hqLocation: "Mumbai - Bandra Kurla Complex, India",
  description: "Apex Elite Care Global represents an ultra-modern multi-specialty hub focused on rendering elite healthcare experiences to corporate, public, and private patients worldwide. Guided by state-of-the-art robotic orthopedic devices, high-precision linear accelerators, and luxury hospitality inpatient services tailored to diplomats and families.",
  doctors: [
    {
      id: "doc_1",
      name: "Dr. Vikram Seth",
      title: "Senior Consultant Cardiothoracic Surgeon",
      specialty: "Invasive Valve Reconstruction",
      experience: "24 Years",
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80",
      languages: ["English", "Hindi", "Gujarati"]
    },
    {
      id: "doc_2",
      name: "Dr. Aditi Nair",
      title: "Chief of Orthopaedics & Knee Reconstruction",
      specialty: "Robotic Joint Replacement",
      experience: "18 Years",
      image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=150&auto=format&fit=crop&q=80",
      languages: ["English", "Tamil", "Marathi"]
    },
    {
      id: "doc_3",
      name: "Dr. Cyrus Mody",
      title: "Professor of Surgical Oncology",
      specialty: "Precision Immunotherapy Protocols",
      experience: "21 Years",
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80",
      languages: ["English", "Farsi", "Urdu"]
    }
  ],
  treatments: [
    { id: "treat_1", name: "Robotic Knee Arthroplasty (Double Joint)", category: "Orthopaedics", costEstimate: "$8,500 - $11,000", duration: "7 Days Inpatient", successRate: "99.4%" },
    { id: "treat_2", name: "Off-Pump Heart Coronary Bypass", category: "Cardiology", costEstimate: "$14,000 - $18,500", duration: "10 Days Inpatient", successRate: "98.1%" },
    { id: "treat_3", name: "CyberKnife Stereotactic Cancer Ablation", category: "Oncology", costEstimate: "$11,500 - $15,000", duration: "Outpatient / 3 Sessions", successRate: "96.5%" }
  ],
  facilityImages: [
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=400&auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=400&auto=format&fit=crop&q=80"
  ],
  certifications: [
    "Joint Commission International (JCI) Gold Seal",
    "National Accreditation Board for Hospitals (NABH) Platinum Spec",
    "GMAA Accredited Super-Specialty Status",
    "ISO 9001:2015 Healthcare Facility Standard"
  ]
};
