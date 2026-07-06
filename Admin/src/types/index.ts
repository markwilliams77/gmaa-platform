// Auth Types
export interface AdminCredentials {
  username: string;
  password: string;
  email: string;
}

export interface AuthLoginRequest {
  identifier: string;
  password: string;
  email?: string;
  username?: string;
}

export interface AuthLoginResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    username: string;
  };
}

export interface AdminGenerateRequest {
  secret: string;
}

export interface AdminGenerateResponse {
  success: boolean;
  credentials: AdminCredentials;
}

// Tender Types
export interface Tender {
  id: string;
  tenderNumber: string;
  leadId: string | null;
  title: string;
  description: string;
  serviceCategory: string | null;
  region: string;
  createdBy: string;
  status: string;
  awardedVendorId: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: {
    bids: number;
  };
}

export interface CreateTenderRequest {
  tenderData: {
    service: string;
    category: string;
    region: string;
    budget: string;
    deadline: string;
    description: string;
  };
  vendorEmails: string[];
  broadcast?: boolean;
}

export interface CreateTenderResponse {
  success: boolean;
  tenderId: string;
  broadcast: boolean;
  message: string;
}

export interface UpdateTenderRequest {
  status?: "open" | "awarded" | "closed";
  awardedBidId?: string;
  awardedVendorId?: string;
}

// Bid Types
export interface Bid {
  id: string;
  tenderId: string;
  vendorId: string;
  vendorName: string;
  amount: string;
  proposal: string;
  status: "pending" | "awarded" | "rejected";
  createdAt: string;
  vendor?: { vendorNumber?: string; companyName: string };
  round?: { roundNumber: number };
}

export interface UpdateBidRequest {
  status: "pending" | "awarded" | "rejected";
}

// Vendor Types
export interface Vendor {
  id: string;
  vendorNumber?: string;
  name: string;
  email: string;
  region: string;
  category: string;
  location: string;
  specialty: string;
    status:
    | "DOCUMENTS_PENDING"
    | "UNDER_REVIEW"
    | "ACTIVE"
    | "SUSPENDED"
    | "REJECTED";
}


// Vendor Onboarding Types
export interface DocumentInfo {
  documentType?: string;
  fileKey: string;
  fileName: string;
  contentType: string;
  fileSize: number;
  uploadedAt: string;
  downloadUrl?: string;
  expiresIn?: number | null;
}

export interface VendorOnboarding {
  id: string;
  orgName: string;
  email: string;
  contactPerson: string;
  contactNumber?: string;
  orgType: string;
  plan: string;
  specialties: string[];
  createdAt: string;
  status:
    | "DRAFT"
    | "PAYMENT_PENDING"
    | "DOCUMENTS_PENDING"
    | "UNDER_REVIEW"
    | "ACTIVE"
    | "REJECTED";
  paymentStatus: "PENDING" | "COMPLETED";
  documents?: {
    business_license?: DocumentInfo;
    moh_accreditation?: DocumentInfo;
    tax_identification?: DocumentInfo;
  };
  vendor?: {
    id: string;
    verificationStatus: "DRAFT" | "PENDING_REVIEW" | "APPROVED" | "REJECTED";

    documents: {
      id: string;
      documentType: string;
      fileName: string;
      fileUrl: string;
      uploadedAt: string;
    }[];
  };
}

export interface ListVendorOnboardingsResponse {
  success: boolean;
  vendorOnboardings: VendorOnboarding[];
}

export interface GetVendorOnboardingResponse {
  success: boolean;
  vendorOnboarding: VendorOnboarding;
}

export interface ApproveVendorRequest {
  status?: "PENDING_ACTIVATION" | "ACTIVE";
}

export interface ApproveVendorResponse {
  success: boolean;
  vendorOnboarding: VendorOnboarding;
  vendor: {
    id: string;
    name: string;
    email: string;
    location: string;
    specialty: string;
    status: string;
  };
  credentials: {
    username: string;
    password: string;
  };
  message: string;
}

export interface RejectVendorResponse {
  success: boolean;
  vendorOnboarding: VendorOnboarding;
  message: string;
}

export interface DocumentResponse {
  success: boolean;
  document: {
    documentType: string;
    fileName: string;
    contentType: string;
    fileSize: number;
    uploadedAt: string;
    fileKey: string;
    downloadUrl: string;
    expiresIn: number | null;
  };
}

// Support Ticket Types
export interface SupportTicket {
  id: string;
  subject: string;
  status: "pending" | "resolved";
  lastUpdated: string;
  lastMessage: string;
}

export interface SupportTicketMessage {
  text: string;
  sender: string;
  senderName: string;
}

// Consultation Types
export interface Consultation {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service?: string;
  region?: string;
  vendorId?: string;
  vendorName?: string;
  status: "NEW" | "CONTACTED" | "QUALIFIED" | "REJECTED" | "CONVERTED";
  createdAt: string;
  updatedAt: string;
}

//Qualified consultaions will convert to lead

export interface Lead {
  id: string;
  leadNumber: string;

  name: string;
  email: string;
  patientPhone: string | null;

  title: string | null;
  description: string | null;
  serviceCategory: string | null;

  country: string | null;
  city: string | null;

  priority: string;
  status: string;

  routingType: string;

  leadType?: string;
  source?: string;
  vendorId?: string;
  vendorName?: string;

  assignedTo: string | null;
  assignedToUserId: string | null;
  selectedVendorId: string | null;

  createdAt: string;
  updatedAt: string;

  activities?: any[];
  notes?: any[];
}

export interface UpdateConsultationRequest {
  status?: "NEW" | "CONTACTED" | "QUALIFIED" | "REJECTED" | "CONVERTED";

  vendorId?: string;
  vendorName?: string;

  note?: string;
  createdBy?: string;
}

// Lead Types
export interface LeadMessage {
  text: string;
  sender: string;
  senderName: string;
}

// API Response Wrapper
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
