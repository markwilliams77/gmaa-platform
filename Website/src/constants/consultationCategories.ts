import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Stethoscope,
  Microscope,
  UserRound,
  HousePlus,
  Plane,
  MonitorSmartphone,
  Pill,
  Shield,
  HeartPulse,
  HandHeart,
  Syringe,
  FlaskConical,
  CircleHelp,
} from "lucide-react";

export interface ConsultationField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "number" | "date";
  required?: boolean;
  options?: string[];
}

export interface ConsultationCategory {
  id: string;

  label: string;

  description: string;

  icon: LucideIcon;

  vendorCategories: string[];

  fields: ConsultationField[];
}

export const CONSULTATION_CATEGORIES: ConsultationCategory[] = [
  {
    id: "hospital",
    label: "Hospital",
    description: "Find hospitals for surgery, treatment and specialist care.",
    icon: Building2,
    vendorCategories: [
      "Hospital",
      "Multi Specialty Hospital",
      "Super Specialty Hospital",
    ],
    fields: [
      {
        key: "service",
        label: "Treatment Required",
        type: "text",
        required: true,
      },
      {
        key: "specialty",
        label: "Medical Specialty",
        type: "text",
      },
      {
        key: "region",
        label: "Preferred Treatment Destination",
        type: "select",
        options: [
          "No Preference",
          "India",
          "Thailand",
          "Turkey",
          "Singapore",
          "Germany",
          "UAE",
        ],
      },
    ],
  },

  {
    id: "clinic",
    label: "Clinic",
    description: "Book consultations and outpatient healthcare services.",
    icon: Stethoscope,
    vendorCategories: ["Clinic"],
    fields: [
      {
        key: "service",
        label: "Service Required",
        type: "text",
        required: true,
      },
    ],
  },

  {
    id: "diagnostic",
    label: "Diagnostic Centre",
    description: "Arrange laboratory tests, imaging and diagnostics.",
    icon: Microscope,
    vendorCategories: [
      "Diagnostic Centre",
      "Imaging Centre",
      "Pathology Laboratory",
    ],
    fields: [
      {
        key: "service",
        label: "Diagnostic Test Required",
        type: "text",
        required: true,
      },
    ],
  },

  {
    id: "doctor",
    label: "Doctor",
    description: "Connect with verified medical specialists and consultants.",
    icon: UserRound,
    vendorCategories: ["Doctor"],
    fields: [
      {
        key: "specialty",
        label: "Doctor Specialty",
        type: "text",
        required: true,
      },
    ],
  },

  {
    id: "home-healthcare",
    label: "Home Healthcare",
    description: "Receive professional healthcare services at home.",
    icon: HousePlus,
    vendorCategories: ["Home Healthcare"],
    fields: [
      {
        key: "service",
        label: "Home Care Requirement",
        type: "textarea",
        required: true,
      },
    ],
  },

  {
    id: "air-ambulance",
    label: "Air Ambulance",
    description: "Arrange emergency medical transportation worldwide.",
    icon: Plane,
    vendorCategories: ["Air Ambulance"],
    fields: [
      {
        key: "service",
        label: "Transfer Requirement",
        type: "textarea",
        required: true,
      },
    ],
  },

  {
    id: "medical-equipment",
    label: "Medical Equipment",
    description: "Source medical equipment from trusted suppliers.",
    icon: MonitorSmartphone,
    vendorCategories: ["Medical Equipment"],
    fields: [
      {
        key: "service",
        label: "Equipment Required",
        type: "text",
        required: true,
      },
      {
        key: "quantity",
        label: "Quantity",
        type: "number",
      },
    ],
  },

  {
    id: "medical-device",
    label: "Medical Device",
    description: "Find certified medical devices and accessories.",
    icon: MonitorSmartphone,
    vendorCategories: ["Medical Device"],
    fields: [
      {
        key: "service",
        label: "Device Required",
        type: "text",
        required: true,
      },
      {
        key: "quantity",
        label: "Quantity",
        type: "number",
      },
    ],
  },

  {
    id: "pharmaceutical",
    label: "Pharmaceutical",
    description: "Source medicines and pharmaceutical products.",
    icon: Pill,
    vendorCategories: ["Pharmaceutical"],
    fields: [
      {
        key: "service",
        label: "Medicine Required",
        type: "text",
        required: true,
      },
    ],
  },

  {
    id: "insurance",
    label: "Insurance",
    description: "Get assistance with medical insurance and approvals.",
    icon: Shield,
    vendorCategories: ["Insurance"],
    fields: [
      {
        key: "service",
        label: "Insurance Requirement",
        type: "textarea",
        required: true,
      },
    ],
  },

  {
    id: "wellness",
    label: "Wellness",
    description: "Discover wellness, rehabilitation and preventive care.",
    icon: HeartPulse,
    vendorCategories: ["Wellness"],
    fields: [
      {
        key: "service",
        label: "Wellness Service",
        type: "text",
      },
    ],
  },

  {
    id: "elderly-care",
    label: "Elderly Care",
    description: "Access assisted living and elderly care services.",
    icon: HandHeart,
    vendorCategories: ["Elderly Care"],
    fields: [
      {
        key: "service",
        label: "Care Requirement",
        type: "textarea",
      },
    ],
  },

  {
    id: "nursing",
    label: "Nursing",
    description: "Arrange professional nursing support.",
    icon: Syringe,
    vendorCategories: ["Nursing"],
    fields: [
      {
        key: "service",
        label: "Nursing Requirement",
        type: "textarea",
      },
    ],
  },

  {
    id: "laboratory",
    label: "Laboratory",
    description: "Book laboratory services and sample collection.",
    icon: FlaskConical,
    vendorCategories: ["Laboratory"],
    fields: [
      {
        key: "service",
        label: "Laboratory Service",
        type: "text",
      },
    ],
  },

  {
    id: "other",
    label: "Other",
    description:
      "Tell us your requirement and we'll connect you with the right provider.",
    icon: CircleHelp,
    vendorCategories: ["Other"],
    fields: [
      {
        key: "service",
        label: "Tell us what you need",
        type: "textarea",
      },
    ],
  },
];
