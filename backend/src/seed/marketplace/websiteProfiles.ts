export interface WebsiteProfileContent {
  headline: string;
  description: string;

  keyHighlights: string[];

  services: string[];

  galleryFolder: string;
}

export const DEFAULT_PROFILE: WebsiteProfileContent = {
  headline: "Trusted Healthcare Partner",

  description:
    "Committed to delivering safe, accessible and high-quality healthcare through experienced medical professionals, advanced technology and patient-centered care.",

  keyHighlights: [
    "Experienced Medical Professionals",
    "Patient-Centered Care",
    "Modern Medical Technology",
    "Quality & Safety Standards",
  ],

  services: [],

  galleryFolder: "hospitals",
};

export const WEBSITE_PROFILE_CONTENT: Record<string, WebsiteProfileContent> =
  {};

WEBSITE_PROFILE_CONTENT["Hospital"] = {
  headline: "Comprehensive Multispecialty Healthcare Excellence",

  description:
    "Delivering advanced medical care through experienced specialists, modern infrastructure and a patient-first approach. From preventive health checkups to complex surgical procedures and emergency care, our hospital is committed to providing safe, compassionate and evidence-based healthcare for patients from around the world.",

  keyHighlights: [
    "24/7 Emergency Services",
    "Multispecialty Medical Team",
    "Advanced Surgical Facilities",
    "Critical Care & ICU",
    "Modern Diagnostic Imaging",
    "International Patient Services",
  ],

  services: [
    "Cardiology",
    "General Surgery",
    "Orthopedics",
    "Neurology",
    "Emergency Medicine",
    "Critical Care",
    "Diagnostic Imaging",
    "Health Checkups",
  ],

  galleryFolder: "hospitals",
};

WEBSITE_PROFILE_CONTENT["Medical Center"] = WEBSITE_PROFILE_CONTENT["Hospital"];

WEBSITE_PROFILE_CONTENT["Government Hospital"] =
  WEBSITE_PROFILE_CONTENT["Hospital"];

WEBSITE_PROFILE_CONTENT["Specialty Clinic"] = {
  headline: "Specialized Healthcare Excellence",

  description:
    "Providing focused medical care through experienced specialists, modern diagnostics and personalized treatment plans for patients seeking expert clinical services.",

  keyHighlights: [
    "Specialist Consultations",
    "Evidence-Based Treatment",
    "Modern Diagnostic Support",
    "Personalized Care Plans",
    "Experienced Medical Team",
    "Convenient Appointments",
  ],

  services: [],

  galleryFolder: "hospitals",
};
WEBSITE_PROFILE_CONTENT["Doctor / Physician"] =
  WEBSITE_PROFILE_CONTENT["Specialty Clinic"];

WEBSITE_PROFILE_CONTENT["Dental Clinic"] = {
  headline: "Comprehensive Dental Care",

  description:
    "Providing preventive, restorative and cosmetic dental treatments through experienced dental professionals and modern clinical technology.",

  keyHighlights: [
    "General Dentistry",
    "Cosmetic Dentistry",
    "Orthodontics",
    "Dental Implants",
    "Digital Dental Imaging",
    "Preventive Oral Care",
  ],

  services: [
    "General Dentistry",
    "Orthodontics",
    "Endodontics",
    "Periodontics",
    "Prosthodontics",
    "Oral Surgery",
    "Pediatric Dentistry",
  ],

  galleryFolder: "hospitals",
};

WEBSITE_PROFILE_CONTENT["Eye Hospital / Ophthalmology Center"] = {
  headline: "Advanced Eye Care & Vision Services",

  description:
    "Providing comprehensive ophthalmology services through experienced eye specialists, advanced diagnostics and modern surgical technology.",

  keyHighlights: [
    "Cataract Surgery",
    "Retina Services",
    "LASIK & Refractive Care",
    "Glaucoma Management",
    "Comprehensive Eye Exams",
    "Advanced Eye Diagnostics",
  ],

  services: [
    "Cataract",
    "Retina",
    "Cornea",
    "LASIK",
    "Glaucoma",
    "Oculoplasty",
  ],

  galleryFolder: "hospitals",
};
WEBSITE_PROFILE_CONTENT["Women's Health & Maternity Center"] = {
  headline: "Comprehensive Women's Health & Maternity Care",

  description:
    "Providing specialized healthcare for women through every stage of life with experienced obstetricians, gynecologists and maternity specialists.",

  keyHighlights: [
    "Comprehensive Gynecology",
    "High-Risk Pregnancy Care",
    "Modern Maternity Suites",
    "Prenatal & Postnatal Care",
    "Fertility Services",
    "Experienced Women's Health Specialists",
  ],

  services: ["Gynecology", "Obstetrics", "IVF", "Fertility"],

  galleryFolder: "hospitals",
};
WEBSITE_PROFILE_CONTENT["Children's Hospital"] = {
  headline: "Specialized Pediatric Healthcare",

  description:
    "Providing comprehensive medical and surgical care for infants, children and adolescents through experienced pediatric specialists and child-friendly facilities.",

  keyHighlights: [
    "Pediatric Specialists",
    "Child-Friendly Environment",
    "Pediatric Emergency Care",
    "Neonatal & Infant Care",
    "Family-Centered Care",
    "Advanced Pediatric Diagnostics",
  ],

  services: [
    "Pediatrics",
    "Pediatric Surgery",
    "Pediatric Cardiology",
    "Pediatric Neurology",
  ],

  galleryFolder: "hospitals",
};
WEBSITE_PROFILE_CONTENT["Cancer Center"] = {
  headline: "Comprehensive Cancer Care",

  description:
    "Providing multidisciplinary oncology services through advanced diagnostics, personalized treatment plans and compassionate patient care.",

  keyHighlights: [
    "Multidisciplinary Oncology Team",
    "Precision Cancer Diagnostics",
    "Radiation Therapy",
    "Chemotherapy Services",
    "Cancer Screening",
    "Supportive & Palliative Care",
  ],

  services: ["Medical Oncology", "Radiation Oncology", "Surgical Oncology"],

  galleryFolder: "hospitals",
};
WEBSITE_PROFILE_CONTENT["Heart Institute"] = {
  headline: "Advanced Cardiovascular Care",

  description:
    "Delivering comprehensive cardiac diagnosis, treatment and rehabilitation through experienced cardiologists, cardiac surgeons and advanced cardiovascular technology.",

  keyHighlights: [
    "24/7 Cardiac Emergency",
    "Interventional Cardiology",
    "Cardiac Surgery",
    "Advanced Cath Labs",
    "Cardiac Rehabilitation",
    "Preventive Heart Care",
  ],

  services: ["Cardiology", "Cardiac Surgery", "Interventional Cardiology"],

  galleryFolder: "hospitals",
};
WEBSITE_PROFILE_CONTENT["Orthopedic Center"] = {
  headline: "Advanced Orthopedic & Joint Care",

  description:
    "Providing specialized treatment for bone, joint, spine and sports injuries through experienced orthopedic surgeons and rehabilitation specialists.",

  keyHighlights: [
    "Joint Replacement Surgery",
    "Sports Injury Management",
    "Spine Care",
    "Fracture Management",
    "Rehabilitation Programs",
    "Advanced Orthopedic Imaging",
  ],

  services: ["Joint Replacement", "Sports Medicine", "Spine Surgery"],

  galleryFolder: "hospitals",
};
WEBSITE_PROFILE_CONTENT["Rehabilitation Hospital"] = {
  headline: "Comprehensive Rehabilitation & Recovery",

  description:
    "Helping patients regain strength, mobility and independence through multidisciplinary rehabilitation and evidence-based therapy programs.",

  keyHighlights: [
    "Stroke Rehabilitation",
    "Orthopedic Rehabilitation",
    "Neurological Rehabilitation",
    "Occupational Therapy",
    "Speech Therapy",
    "Personalized Recovery Plans",
  ],

  services: ["Physiotherapy", "Occupational Therapy", "Speech Therapy"],

  galleryFolder: "rehabilitation",
};

WEBSITE_PROFILE_CONTENT["Rehabilitation Center"] =
  WEBSITE_PROFILE_CONTENT["Rehabilitation Hospital"];

WEBSITE_PROFILE_CONTENT["Physiotherapy Center"] =
  WEBSITE_PROFILE_CONTENT["Rehabilitation Hospital"];

WEBSITE_PROFILE_CONTENT["Mental Health Hospital"] = {
  headline: "Comprehensive Mental Healthcare",

  description:
    "Providing compassionate mental health services through experienced psychiatrists, psychologists and multidisciplinary behavioral health professionals.",

  keyHighlights: [
    "Psychiatric Care",
    "Clinical Psychology",
    "Individual Counselling",
    "Behavioral Therapy",
    "Confidential Care",
    "Holistic Mental Wellness",
  ],

  services: ["Psychiatry", "Clinical Psychology", "Counselling"],

  galleryFolder: "wellness",
};

WEBSITE_PROFILE_CONTENT["Mental Wellness"] =
  WEBSITE_PROFILE_CONTENT["Mental Health Hospital"];

WEBSITE_PROFILE_CONTENT["Cosmetic Surgery Center"] = {
  headline: "Aesthetic & Reconstructive Surgery",

  description:
    "Delivering advanced cosmetic and reconstructive procedures through experienced plastic surgeons using modern surgical techniques.",

  keyHighlights: [
    "Plastic Surgery",
    "Cosmetic Procedures",
    "Hair Restoration",
    "Facial Aesthetics",
    "Body Contouring",
    "Personalized Treatment Plans",
  ],

  services: ["Plastic Surgery", "Cosmetic Surgery", "Hair Transplant"],

  galleryFolder: "hospitals",
};
WEBSITE_PROFILE_CONTENT["Diagnostic Center"] = {
  headline: "Comprehensive Diagnostic Services",

  description:
    "Delivering accurate and timely diagnostic testing through advanced laboratory and imaging technology supported by experienced healthcare professionals.",

  keyHighlights: [
    "Comprehensive Health Checkups",
    "Advanced Laboratory Testing",
    "Digital Diagnostics",
    "Rapid Reporting",
    "Quality Assured Results",
    "Preventive Screening",
  ],

  services: ["Full Body Checkup", "Executive Health Check"],

  galleryFolder: "diagnostics",
};

WEBSITE_PROFILE_CONTENT["Pathology Laboratory"] =
  WEBSITE_PROFILE_CONTENT["Diagnostic Center"];
WEBSITE_PROFILE_CONTENT["Imaging Center"] = {
  headline: "Advanced Medical Imaging",

  description:
    "Providing high-quality diagnostic imaging through advanced radiology equipment and experienced imaging specialists.",

  keyHighlights: [
    "MRI",
    "CT Scan",
    "Digital X-Ray",
    "Ultrasound",
    "Experienced Radiologists",
    "Fast Digital Reports",
  ],

  services: ["Radiology", "Diagnostic Imaging"],

  galleryFolder: "diagnostics",
};

WEBSITE_PROFILE_CONTENT["MRI Center"] =
  WEBSITE_PROFILE_CONTENT["Imaging Center"];

WEBSITE_PROFILE_CONTENT["CT Scan Center"] =
  WEBSITE_PROFILE_CONTENT["Imaging Center"];

WEBSITE_PROFILE_CONTENT["Ultrasound Center"] =
  WEBSITE_PROFILE_CONTENT["Imaging Center"];

WEBSITE_PROFILE_CONTENT["Genetic Laboratory"] = {
  headline: "Advanced Genetic & Molecular Diagnostics",

  description:
    "Providing precision genetic testing and molecular diagnostics to support personalized healthcare and early disease detection.",

  keyHighlights: [
    "Genetic Testing",
    "Prenatal Screening",
    "Cancer Genetics",
    "Molecular Diagnostics",
    "Precision Medicine",
    "Advanced Laboratory Technology",
  ],

  services: ["Genetic Testing", "Prenatal Screening", "Cancer Genetics"],

  galleryFolder: "diagnostics",
};

WEBSITE_PROFILE_CONTENT["Home Nursing"] = {
  headline: "Professional Healthcare at Home",

  description:
    "Delivering quality medical care, nursing support and rehabilitation services in the comfort of patients' homes.",

  keyHighlights: [
    "Skilled Home Nursing",
    "Doctor Home Visits",
    "Post Operative Care",
    "Elderly Care",
    "Rehabilitation at Home",
    "Home Diagnostics",
  ],

  services: [
    "General Nursing",
    "ICU Nursing",
    "Post Operative Care",
    "Wound Care",
  ],

  galleryFolder: "homecare",
};

WEBSITE_PROFILE_CONTENT["Home Doctor Visit"] =
  WEBSITE_PROFILE_CONTENT["Home Nursing"];

WEBSITE_PROFILE_CONTENT["Physiotherapy at Home"] =
  WEBSITE_PROFILE_CONTENT["Home Nursing"];

WEBSITE_PROFILE_CONTENT["Elderly Care"] =
  WEBSITE_PROFILE_CONTENT["Home Nursing"];

WEBSITE_PROFILE_CONTENT["Palliative Care"] =
  WEBSITE_PROFILE_CONTENT["Home Nursing"];

WEBSITE_PROFILE_CONTENT["Post Operative Care"] =
  WEBSITE_PROFILE_CONTENT["Home Nursing"];

WEBSITE_PROFILE_CONTENT["Home Diagnostic Service"] =
  WEBSITE_PROFILE_CONTENT["Home Nursing"];

WEBSITE_PROFILE_CONTENT["Ground Ambulance"] = {
  headline: "24/7 Emergency Medical Transportation",

  description:
    "Providing safe, reliable and rapid emergency medical transportation supported by trained emergency medical professionals and fully equipped ambulances.",

  keyHighlights: [
    "24/7 Emergency Response",
    "Advanced Life Support",
    "Critical Care Transport",
    "Domestic & International Transfers",
    "Experienced Medical Crew",
    "Modern Ambulance Fleet",
  ],

  services: ["Basic Life Support", "Advanced Life Support", "Patient Transfer"],

  galleryFolder: "ambulance",
};

WEBSITE_PROFILE_CONTENT["Air Ambulance"] =
  WEBSITE_PROFILE_CONTENT["Ground Ambulance"];

WEBSITE_PROFILE_CONTENT["ICU Ambulance"] =
  WEBSITE_PROFILE_CONTENT["Ground Ambulance"];

WEBSITE_PROFILE_CONTENT["Neonatal Ambulance"] =
  WEBSITE_PROFILE_CONTENT["Ground Ambulance"];

WEBSITE_PROFILE_CONTENT["Medical Escort Service"] =
  WEBSITE_PROFILE_CONTENT["Ground Ambulance"];

WEBSITE_PROFILE_CONTENT["Patient Transfer Service"] =
  WEBSITE_PROFILE_CONTENT["Ground Ambulance"];

WEBSITE_PROFILE_CONTENT["Medical Tourism Company"] = {
  headline: "International Healthcare Coordination",

  description:
    "Helping patients access trusted healthcare providers through end-to-end medical travel coordination and personalized support.",

  keyHighlights: [
    "Treatment Coordination",
    "Hospital Network",
    "Travel Assistance",
    "Visa Support",
    "Interpreter Services",
    "Dedicated Case Managers",
  ],

  services: ["Inbound Medical Tourism", "Outbound Medical Tourism"],

  galleryFolder: "medicaltourism",
};

WEBSITE_PROFILE_CONTENT["Patient Facilitator"] =
  WEBSITE_PROFILE_CONTENT["Medical Tourism Company"];

WEBSITE_PROFILE_CONTENT["Visa Assistance"] =
  WEBSITE_PROFILE_CONTENT["Medical Tourism Company"];

WEBSITE_PROFILE_CONTENT["Interpreter Service"] =
  WEBSITE_PROFILE_CONTENT["Medical Tourism Company"];

WEBSITE_PROFILE_CONTENT["International Patient Department"] =
  WEBSITE_PROFILE_CONTENT["Medical Tourism Company"];

WEBSITE_PROFILE_CONTENT["Accommodation Partner"] =
  WEBSITE_PROFILE_CONTENT["Medical Tourism Company"];

WEBSITE_PROFILE_CONTENT["Medical Equipment Supplier"] = {
  headline: "Trusted Medical Equipment & Healthcare Solutions",

  description:
    "Supplying hospitals and healthcare providers with certified medical equipment, devices and clinical technology from trusted manufacturers.",

  keyHighlights: [
    "Certified Medical Equipment",
    "Hospital Technology Solutions",
    "Installation & Support",
    "Preventive Maintenance",
    "Quality Assured Products",
    "Healthcare Procurement",
  ],

  services: ["Hospital Equipment", "Diagnostic Equipment", "ICU Equipment"],

  galleryFolder: "equipment",
};

WEBSITE_PROFILE_CONTENT["Pharmacy"] =
  WEBSITE_PROFILE_CONTENT["Medical Equipment Supplier"];

WEBSITE_PROFILE_CONTENT["Surgical Equipment Supplier"] =
  WEBSITE_PROFILE_CONTENT["Medical Equipment Supplier"];

WEBSITE_PROFILE_CONTENT["Medical Consumables Supplier"] =
  WEBSITE_PROFILE_CONTENT["Medical Equipment Supplier"];

WEBSITE_PROFILE_CONTENT["Implant Supplier"] =
  WEBSITE_PROFILE_CONTENT["Medical Equipment Supplier"];

WEBSITE_PROFILE_CONTENT["Prosthetics Supplier"] =
  WEBSITE_PROFILE_CONTENT["Medical Equipment Supplier"];

WEBSITE_PROFILE_CONTENT["Telemedicine Provider"] = {
  headline: "Connected Healthcare Anywhere",

  description:
    "Delivering convenient access to qualified healthcare professionals through secure virtual consultations and digital healthcare services.",

  keyHighlights: [
    "Video Consultations",
    "Specialist Access",
    "Remote Monitoring",
    "Digital Health Records",
    "Secure Platform",
    "Convenient Care",
  ],

  services: [
    "General Consultation",
    "Specialist Consultation",
    "Second Opinion",
  ],

  galleryFolder: "telemedicine",
};

WEBSITE_PROFILE_CONTENT["HealthTech Company"] =
  WEBSITE_PROFILE_CONTENT["Telemedicine Provider"];

WEBSITE_PROFILE_CONTENT["Remote Monitoring"] =
  WEBSITE_PROFILE_CONTENT["Telemedicine Provider"];

WEBSITE_PROFILE_CONTENT["Digital Health Platform"] =
  WEBSITE_PROFILE_CONTENT["Telemedicine Provider"];

WEBSITE_PROFILE_CONTENT["Wellness Center"] = {
  headline: "Preventive Health & Wellness",

  description:
    "Helping individuals achieve better health through preventive care, rehabilitation and lifestyle-focused wellness programs.",

  keyHighlights: [
    "Preventive Healthcare",
    "Lifestyle Medicine",
    "Nutrition Guidance",
    "Health Screening",
    "Personalized Wellness",
    "Rehabilitation Support",
  ],

  services: ["Holistic Wellness", "Stress Management", "Lifestyle Medicine"],

  galleryFolder: "wellness",
};

WEBSITE_PROFILE_CONTENT["Fitness & Preventive Care"] =
  WEBSITE_PROFILE_CONTENT["Wellness Center"];

WEBSITE_PROFILE_CONTENT["Nutrition & Dietetics"] =
  WEBSITE_PROFILE_CONTENT["Wellness Center"];

WEBSITE_PROFILE_CONTENT["Hospital Consultant"] =
  WEBSITE_PROFILE_CONTENT["Medical Equipment Supplier"];

WEBSITE_PROFILE_CONTENT["Medical Billing"] =
  WEBSITE_PROFILE_CONTENT["Medical Equipment Supplier"];

WEBSITE_PROFILE_CONTENT["Healthcare IT"] =
  WEBSITE_PROFILE_CONTENT["Medical Equipment Supplier"];

WEBSITE_PROFILE_CONTENT["Hospital Management"] =
  WEBSITE_PROFILE_CONTENT["Medical Equipment Supplier"];

WEBSITE_PROFILE_CONTENT["Medical Marketing"] =
  WEBSITE_PROFILE_CONTENT["Medical Equipment Supplier"];

WEBSITE_PROFILE_CONTENT["Training Institute"] =
  WEBSITE_PROFILE_CONTENT["Medical Equipment Supplier"];

WEBSITE_PROFILE_CONTENT["Insurance Company"] =
  WEBSITE_PROFILE_CONTENT["Medical Tourism Company"];

WEBSITE_PROFILE_CONTENT["Third Party Administrator (TPA)"] =
  WEBSITE_PROFILE_CONTENT["Medical Tourism Company"];

WEBSITE_PROFILE_CONTENT["Medical Assistance Company"] =
  WEBSITE_PROFILE_CONTENT["Medical Tourism Company"];

WEBSITE_PROFILE_CONTENT["Claims Management"] =
  WEBSITE_PROFILE_CONTENT["Medical Tourism Company"];

WEBSITE_PROFILE_CONTENT["Travel Insurance"] =
  WEBSITE_PROFILE_CONTENT["Medical Tourism Company"];

WEBSITE_PROFILE_CONTENT["NGO"] = WEBSITE_PROFILE_CONTENT["Hospital"];

WEBSITE_PROFILE_CONTENT["Public Health Organization"] =
  WEBSITE_PROFILE_CONTENT["Hospital"];

WEBSITE_PROFILE_CONTENT["Health Mission"] = WEBSITE_PROFILE_CONTENT["Hospital"];

WEBSITE_PROFILE_CONTENT["Funeral Service"] =
  WEBSITE_PROFILE_CONTENT["Medical Tourism Company"];

WEBSITE_PROFILE_CONTENT["Repatriation Service"] =
  WEBSITE_PROFILE_CONTENT["Medical Tourism Company"];

WEBSITE_PROFILE_CONTENT["Mortuary Service"] =
  WEBSITE_PROFILE_CONTENT["Medical Tourism Company"];
