/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum ActiveTab {
  Dashboard = "Dashboard",
  MyTenders = "My Tenders",
  Marketplace = "Marketplace",
  Consultations = "Consultations",
  Messages = "Messages",
  Awards = "Awards",
  Analytics = "Analytics",
  ProfileManagement = "Profile Management",
  Settings = "Settings",
  MarketingCenter = "Marketing Center",
  Billing = "Billing & Subscription",
  Documents = "Documents",
}

export enum TenderStatus {
  Open = "Open",
  Submitted = "Submitted",
  L1Candidate = "L1 (Rank 1)",
  Awarded = "Awarded",
  Closed = "Closed",
}

export interface TenderRequirement {
  id: string;
  title: string;
  description: string;
  mandatory: boolean;
}

export interface Tender {
  id: string;         // e.g. "TND-2026-8942"
  tenderNumber: string;
  title: string;      // e.g. "Cardiology Care Alliance Setup"
  mainCategory: string;
  deadline: string;   // e.g. "2026-07-15"
  status: TenderStatus;
  rank?: "L1" | "L2" | "L3";
  isBookmarked?: boolean;
  description: string;
  requirements: TenderRequirement[];
  documents: { name: string; size: string; url: string }[];
}

export enum ConsultationStatus {
  NEW = "NEW",
  ACKNOWLEDGED = "ACKNOWLEDGED",
  DOCUMENTS_REQUESTED = "DOCUMENTS_REQUESTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface Consultation {
  id: string;
  name: string;
  age: number;
  gender: string;
  country: string;
  city: string;
  serviceCategory: string;
  createdAt: string;
  status: ConsultationStatus;
  email: string;
  patientPhone: string;
  medicalHistory: string;
}

export interface Message {
  id: string;
  sender: string;
  senderRole: string;
  text: string;
  timestamp: string;
  isRead: boolean;
  source: "Tender Support" | "GMAA Messages" | "System Notifications";
  avatar?: string;
  threadId: string;
}

export interface AwardedProject {
  id: string;
  tenderId: string;
  category: string;
  title: string;
  projectValue: number;
  awardDate: string;
  status: "Active" | "Completed" | "Pending Handover";
  region: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  experience: string;
  image: string;
  languages: string[];
}

export interface Treatment {
  id: string;
  name: string;
  category: string;
  costEstimate: string;
  duration: string;
  successRate: string;
}

export interface HospitalProfile {
  name: string;
  legalName: string;
  accreditationLevel: string;
  bedsCount: number;
  establishedYear: number;
  hqLocation: string;
  description: string;
  doctors: Doctor[];
  treatments: Treatment[];
  facilityImages: string[];
  certifications: string[];
}
