export interface VendorSubCategory {
  name: string;
  specialties: string[];
}

export interface VendorCategory {
  mainCategory: string;
  subCategories: VendorSubCategory[];
}

export const VENDOR_CATEGORIES: VendorCategory[] = [
  {
  mainCategory: "Hospitals & Medical Providers",

  subCategories: [
    {
      name: "Hospital",
      specialties: [
        "Cardiology",
        "Cardiothoracic Surgery",
        "Neurology",
        "Neurosurgery",
        "Orthopedics",
        "Oncology",
        "Medical Oncology",
        "Radiation Oncology",
        "Pediatrics",
        "Pediatric Surgery",
        "Obstetrics & Gynecology",
        "Urology",
        "Nephrology",
        "Gastroenterology",
        "Pulmonology",
        "ENT",
        "Ophthalmology",
        "Dermatology",
        "Plastic Surgery",
        "General Surgery",
        "Internal Medicine",
        "Emergency Medicine",
        "Critical Care",
        "Anesthesiology",
        "Psychiatry",
        "Endocrinology",
        "Rheumatology",
        "Infectious Diseases",
        "Rehabilitation Medicine",
      ],
    },

    {
      name: "Medical Center",
      specialties: [],
    },

    {
      name: "Specialty Clinic",
      specialties: [],
    },

    {
      name: "Doctor / Physician",
      specialties: [],
    },

    {
      name: "Dental Clinic",
      specialties: [
        "General Dentistry",
        "Orthodontics",
        "Endodontics",
        "Periodontics",
        "Prosthodontics",
        "Oral Surgery",
        "Pediatric Dentistry",
      ],
    },

    {
      name: "Eye Hospital / Ophthalmology Center",
      specialties: [
        "Cataract",
        "Retina",
        "Cornea",
        "LASIK",
        "Glaucoma",
        "Oculoplasty",
      ],
    },

    {
      name: "Women's Health & Maternity Center",
      specialties: [
        "Gynecology",
        "Obstetrics",
        "IVF",
        "Fertility",
      ],
    },

    {
      name: "Children's Hospital",
      specialties: [
        "Pediatrics",
        "Pediatric Surgery",
        "Pediatric Cardiology",
        "Pediatric Neurology",
      ],
    },

    {
      name: "Cancer Center",
      specialties: [
        "Medical Oncology",
        "Radiation Oncology",
        "Surgical Oncology",
      ],
    },

    {
      name: "Heart Institute",
      specialties: [
        "Cardiology",
        "Cardiac Surgery",
        "Interventional Cardiology",
      ],
    },

    {
      name: "Orthopedic Center",
      specialties: [
        "Joint Replacement",
        "Sports Medicine",
        "Spine Surgery",
      ],
    },

    {
      name: "Rehabilitation Hospital",
      specialties: [
        "Physiotherapy",
        "Occupational Therapy",
        "Speech Therapy",
      ],
    },

    {
      name: "Mental Health Hospital",
      specialties: [
        "Psychiatry",
        "Clinical Psychology",
        "Counselling",
      ],
    },

    {
      name: "Cosmetic Surgery Center",
      specialties: [
        "Plastic Surgery",
        "Cosmetic Surgery",
        "Hair Transplant",
      ],
    },
  ],
},

{
  mainCategory: "Emergency & Medical Transportation",

  subCategories: [
    {
      name: "Air Ambulance",
      specialties: [
        "Fixed Wing",
        "Rotor Wing",
        "ICU Air Transfer",
        "International Medical Evacuation",
      ],
    },

    {
      name: "Ground Ambulance",
      specialties: [
        "Basic Life Support",
        "Advanced Life Support",
        "Patient Transfer",
      ],
    },

    {
      name: "ICU Ambulance",
      specialties: [
        "Critical Care Transport",
        "Ventilator Support",
      ],
    },

    {
      name: "Neonatal Ambulance",
      specialties: [
        "NICU Transport",
        "Pediatric Critical Care",
      ],
    },

    {
      name: "Medical Escort Service",
      specialties: [
        "Commercial Flight Escort",
        "Nurse Escort",
        "Doctor Escort",
      ],
    },

    {
      name: "Patient Transfer Service",
      specialties: [
        "Domestic Transfer",
        "International Transfer",
      ],
    },
  ],
},

  {
  mainCategory: "Home Healthcare & Senior Care",

  subCategories: [
    {
      name: "Home Nursing",
      specialties: [
        "General Nursing",
        "ICU Nursing",
        "Post Operative Care",
        "Wound Care",
      ],
    },

    {
      name: "Home Doctor Visit",
      specialties: [
        "General Physician",
        "Specialist Consultation",
      ],
    },

    {
      name: "Physiotherapy at Home",
      specialties: [
        "Orthopedic Physiotherapy",
        "Neurological Physiotherapy",
        "Sports Physiotherapy",
      ],
    },

    {
      name: "Elderly Care",
      specialties: [
        "Assisted Living",
        "Dementia Care",
        "Long Term Care",
      ],
    },

    {
      name: "Palliative Care",
      specialties: [
        "Cancer Care",
        "End of Life Care",
      ],
    },

    {
      name: "Post Operative Care",
      specialties: [
        "Surgical Recovery",
        "Rehabilitation",
      ],
    },

    {
      name: "Home Diagnostic Service",
      specialties: [
        "Blood Collection",
        "ECG",
        "X-Ray",
        "Ultrasound",
      ],
    },
  ],
},

  {
  mainCategory: "Diagnostics & Laboratories",

  subCategories: [
    {
      name: "Diagnostic Center",
      specialties: [
        "Full Body Checkup",
        "Executive Health Check",
      ],
    },

    {
      name: "Pathology Laboratory",
      specialties: [
        "Hematology",
        "Biochemistry",
        "Microbiology",
        "Histopathology",
        "Cytology",
        "Molecular Diagnostics",
      ],
    },

    {
      name: "Imaging Center",
      specialties: [
        "Radiology",
        "Diagnostic Imaging",
      ],
    },

    {
      name: "MRI Center",
      specialties: [
        "Brain MRI",
        "Spine MRI",
        "Musculoskeletal MRI",
        "Cardiac MRI",
      ],
    },

    {
      name: "CT Scan Center",
      specialties: [
        "HRCT",
        "CT Angiography",
        "Cardiac CT",
      ],
    },

    {
      name: "Ultrasound Center",
      specialties: [
        "Obstetric Ultrasound",
        "Abdominal Ultrasound",
        "Doppler",
      ],
    },

    {
      name: "Blood Bank",
      specialties: [
        "Whole Blood",
        "Platelets",
        "Plasma",
      ],
    },

    {
      name: "Genetic Laboratory",
      specialties: [
        "Genetic Testing",
        "Prenatal Screening",
        "Cancer Genetics",
      ],
    },
  ],
},

  {
  mainCategory: "Medical Tourism & International Patient Services",

  subCategories: [
    {
      name: "Medical Tourism Company",
      specialties: [
        "Inbound Medical Tourism",
        "Outbound Medical Tourism",
      ],
    },

    {
      name: "Patient Facilitator",
      specialties: [
        "Treatment Coordination",
        "Hospital Coordination",
      ],
    },

    {
      name: "Visa Assistance",
      specialties: [
        "Medical Visa",
        "Travel Documentation",
      ],
    },

    {
      name: "Interpreter Service",
      specialties: [
        "Arabic",
        "French",
        "Russian",
        "Spanish",
        "Chinese",
      ],
    },

    {
      name: "International Patient Department",
      specialties: [
        "Hospital IPD",
        "International Coordination",
      ],
    },

    {
      name: "Accommodation Partner",
      specialties: [
        "Hotel",
        "Serviced Apartment",
        "Recovery Stay",
      ],
    },
  ],
},

  {
  mainCategory: "Pharmaceuticals, Medical Equipment & Supplies",

  subCategories: [
    {
      name: "Pharmacy",
      specialties: [
        "Retail Pharmacy",
        "Hospital Pharmacy",
        "Online Pharmacy",
      ],
    },

    {
      name: "Medical Equipment Supplier",
      specialties: [
        "Hospital Equipment",
        "Diagnostic Equipment",
        "ICU Equipment",
      ],
    },

    {
      name: "Surgical Equipment Supplier",
      specialties: [
        "General Surgery",
        "Cardiac Surgery",
        "Orthopedic Surgery",
      ],
    },

    {
      name: "Medical Consumables Supplier",
      specialties: [
        "Gloves",
        "Syringes",
        "PPE",
        "Dressings",
      ],
    },

    {
      name: "Implant Supplier",
      specialties: [
        "Cardiac Implants",
        "Orthopedic Implants",
        "Dental Implants",
      ],
    },

    {
      name: "Prosthetics Supplier",
      specialties: [
        "Artificial Limbs",
        "Orthotics",
        "Rehabilitation Devices",
      ],
    },
  ],
},

  {
  mainCategory: "Insurance, Assistance & Claims",

  subCategories: [
    {
      name: "Insurance Company",
      specialties: [
        "Health Insurance",
        "Travel Insurance",
        "International Medical Insurance",
      ],
    },

    {
      name: "Third Party Administrator (TPA)",
      specialties: [
        "Cashless Claims",
        "Provider Network",
        "Claims Processing",
      ],
    },

    {
      name: "Medical Assistance Company",
      specialties: [
        "Emergency Assistance",
        "Case Management",
        "Medical Evacuation",
      ],
    },

    {
      name: "Claims Management",
      specialties: [
        "Medical Claims",
        "Insurance Claims Audit",
        "Documentation Support",
      ],
    },

    {
      name: "Travel Insurance",
      specialties: [
        "Inbound Travel",
        "Outbound Travel",
        "Student Travel Insurance",
      ],
    },
  ],
},

  {
  mainCategory: "Telemedicine & Digital Health",

  subCategories: [
    {
      name: "Telemedicine Provider",
      specialties: [
        "General Consultation",
        "Specialist Consultation",
        "Second Opinion",
      ],
    },

    {
      name: "HealthTech Company",
      specialties: [
        "Hospital Software",
        "Electronic Medical Records",
        "Healthcare AI",
      ],
    },

    {
      name: "Remote Monitoring",
      specialties: [
        "ICU Monitoring",
        "Chronic Disease Monitoring",
        "Wearable Devices",
      ],
    },

    {
      name: "Digital Health Platform",
      specialties: [
        "Appointment Booking",
        "E-Pharmacy",
        "Patient Portal",
      ],
    },
  ],
},

  {
  mainCategory: "Wellness, Rehabilitation & Preventive Care",

  subCategories: [
    {
      name: "Physiotherapy Center",
      specialties: [
        "Orthopedic Physiotherapy",
        "Neurological Physiotherapy",
        "Sports Physiotherapy",
        "Pediatric Physiotherapy",
      ],
    },

    {
      name: "Rehabilitation Center",
      specialties: [
        "Physical Rehabilitation",
        "Stroke Rehabilitation",
        "Spinal Rehabilitation",
      ],
    },

    {
      name: "Wellness Center",
      specialties: [
        "Holistic Wellness",
        "Stress Management",
        "Lifestyle Medicine",
      ],
    },

    {
      name: "Fitness & Preventive Care",
      specialties: [
        "Health Screening",
        "Weight Management",
        "Corporate Wellness",
      ],
    },

    {
      name: "Nutrition & Dietetics",
      specialties: [
        "Clinical Nutrition",
        "Sports Nutrition",
        "Diabetes Nutrition",
      ],
    },

    {
      name: "Mental Wellness",
      specialties: [
        "Psychology",
        "Counselling",
        "Behavioral Therapy",
      ],
    },
  ],
},

  {
  mainCategory: "Healthcare Business Solutions",

  subCategories: [
    {
      name: "Hospital Consultant",
      specialties: [
        "Hospital Planning",
        "Hospital Accreditation",
        "Quality Management",
      ],
    },

    {
      name: "Medical Billing",
      specialties: [
        "Insurance Billing",
        "Revenue Cycle Management",
        "Coding Services",
      ],
    },

    {
      name: "Healthcare IT",
      specialties: [
        "Hospital Information System",
        "EMR",
        "PACS",
        "Cybersecurity",
      ],
    },

    {
      name: "Hospital Management",
      specialties: [
        "Operations",
        "Administration",
        "Facility Management",
      ],
    },

    {
      name: "Medical Marketing",
      specialties: [
        "Digital Marketing",
        "Branding",
        "International Marketing",
      ],
    },

    {
      name: "Training Institute",
      specialties: [
        "Clinical Training",
        "Healthcare Management",
        "Medical Education",
      ],
    },
  ],
},

  {
  mainCategory: "Government, NGOs & Public Health",

  subCategories: [
    {
      name: "Government Hospital",
      specialties: [
        "Primary Healthcare",
        "Secondary Healthcare",
        "Tertiary Healthcare",
      ],
    },

    {
      name: "NGO",
      specialties: [
        "Medical Camps",
        "Community Healthcare",
        "Humanitarian Aid",
      ],
    },

    {
      name: "Public Health Organization",
      specialties: [
        "Disease Prevention",
        "Vaccination Programs",
        "Health Promotion",
      ],
    },

    {
      name: "Health Mission",
      specialties: [
        "National Health Programs",
        "Maternal & Child Health",
        "Rural Healthcare",
      ],
    },
  ],
},

  {
  mainCategory: "Funeral & Repatriation Services",

  subCategories: [
    {
      name: "Funeral Service",
      specialties: [
        "Local Funeral",
        "International Funeral",
      ],
    },

    {
      name: "Repatriation Service",
      specialties: [
        "Human Remains Repatriation",
        "Ashes Repatriation",
      ],
    },

    {
      name: "Mortuary Service",
      specialties: [
        "Mortuary Care",
        "Embalming",
      ],
    },
  ],
},
];