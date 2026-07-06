/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, MessageSquare, Plane, Sunrise } from 'lucide-react';

export const SERVICES = [
  "Caring Hospitals & Surgery Centers",
  "Urgent Travel & Flying ICU Services",
  "Immediate Ground Ambulances & First Aid",
  "Cozy Support & Gentle Nursing at Home",
  "Health Scans, MRI, & Quick Testing",
  "Prescriptions & Hard-to-Find Medicines",
  "Importing Specialized Devices & Health Gear",
  "Travel Concierge & Safe Care Abroad",
  "Friendly Doctors & Medical Counselors",
  "Care From Anywhere (Virtual Doctors)",
  "Financial Safety Nets & Health Cover",
  "Restoring Wellness & Daily Self-Care",
  "Emergency 24/7 Red-Alert Support",
  "Golden Years Care & Cozy Senior Living",
  "Gentle Dental Care & Happy Smiles",
  "Cozy Motherhood & Playful Pediatric Care",
  "Tailored Esthetics & Feeling Confident",
  "Wellness Lifestyles & Preventing Illness",
  "Gentle Repatriation & Dignified Sendoffs",
  "Empowering Health Workshops & Training",
  "Seamless Software & Human-First Tech",
  "Next-Generation Health Research",
  "Placing Dedicated Healthcare Staff",
  "Healthy Workplaces & Workplace Care",
  "Global Relief & Non-Profit Care",
  "Aviation, Airport, & Marine Care Support",
  "Sports Care & Active Muscle Recovery",
  "Holistic Healing & Traditional Wisdom",
  "Compassionate AI & Tomorrow's Medicine"
];

export const REGIONS = [
  "Global",
  "Southeast Asia",
  "Middle East",
  "Europe",
  "North America",
  "India",
  "Africa"
];

export const VENDORS = [
  {
    id: "1",
    name: "SkyMed International",
    location: "Global",
    category: "Urgent Travel & Flying ICU Services",
    image: "https://images.unsplash.com/photo-1559135197-8a45ea74d367?auto=format&fit=crop&q=80&w=800",
    accreditation: ["EURAMI Accredited", "ISO 9001"],
    startingPrice: "$15,000",
    specialty: "Critical Care Transport",
    rating: 4.9,
    description: "SkyMed International is a leading global provider of air medical transportation services. With a fleet of specialized aircraft and highly trained medical personnel, we ensure the safest transfer of patients across continents.",
    fullServices: ["Pediatric Transport", "Neonatal ICU", "Infectious Disease Transport", "Organ Transplant Logistics"],
    stats: { patientsTreated: "15,000+", countriesReached: "120", yearsOperation: "25" },
    staffCount: "450"
  },
  {
    id: "2",
    name: "Apollo Hospitals",
    location: "India",
    category: "Caring Hospitals & Surgery Centers",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800",
    accreditation: ["JCI Accredited", "NABH"],
    startingPrice: "$3,500",
    specialty: "Cardiac Surgery",
    rating: 4.9,
    description: "Apollo Hospitals is the pioneer of modern healthcare in India. As the nation's first corporate hospital, Apollo revolutionized the health sector with high-quality clinical outcomes and patient-centric care.",
    fullServices: ["Robotic Surgery", "Bone Marrow Transplant", "Oncology Care", "Neurosciences"],
    stats: { patientsTreated: "1.5M+", bedsCount: "10,000", specialists: "5,000" },
    staffCount: "12,000"
  },
  {
    id: "3",
    name: "PharmaLink Global",
    location: "Europe",
    category: "Prescriptions & Hard-to-Find Medicines",
    image: "https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?auto=format&fit=crop&q=80&w=800",
    accreditation: ["GMP Certified", "GDPR Compliant"],
    startingPrice: "$150",
    specialty: "Rare Medication Supply",
    rating: 4.7,
    description: "PharmaLink Global specializes in the sourcing and distribution of rare and specialized medications. We work closely with manufacturers to ensure ethical and fast delivery of life-saving drugs worldwide.",
    fullServices: ["Cold Chain Logistics", "Rare Disease Support", "Compounding Pharmacy", "Generic Alternatives"],
    stats: { deliverySuccess: "99.9%", activeSKUs: "45,000", partnerPharmacies: "3,200" },
    staffCount: "1,200"
  },
  {
    id: "4",
    name: "Titan MedTools",
    location: "North America",
    category: "Importing Specialized Devices & Health Gear",
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&q=80&w=800",
    accreditation: ["FDA Approved"],
    startingPrice: "$800",
    specialty: "Diagnostic Imaging",
    rating: 4.8,
    description: "Titan MedTools develops and manufactures high-precision medical equipment. We are at the forefront of diagnostic imaging technology, providing clinics and hospitals with reliable tools for accurate diagnosis.",
    fullServices: ["MRI & CT Service", "Leasing Programs", "Technical Training", "Refurbished Equipment"],
    stats: { patentsHeld: "185", installations: "12,000+", supportTeams: "24/7" },
    staffCount: "2,500"
  },
  {
    id: "profile-radha-hospital-in",
    name: "Radhakrishnan Hospital",
    location: "India",
    category: "Caring Hospitals & Surgery Centers",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce2?auto=format&fit=crop&q=80&w=800",
    accreditation: ["JCI Accredited", "NABH Certified"],
    startingPrice: "$2,000",
    specialty: "Advanced Orthopaedics",
    rating: 4.9,
    description: "Radhakrishnan Hospital is a premier medical institution in South Asia, specializing in complex orthopedic surgeries and regenerative medicine. Our state-of-the-art facility is dedicated to restoring mobility and enhancing patient lives through clinical excellence.",
    fullServices: ["Joint Replacement", "Spine Surgery", "Sports Medicine", "Physiotherapy"],
    stats: { successRate: "98.5%", monthlyCases: "450+", globalPatients: "12,000+" },
    staffCount: "850"
  },
  {
    id: "5",
    name: "EuroLink Rehab",
    location: "Europe",
    category: "Restoring Wellness & Daily Self-Care",
    image: "https://images.unsplash.com/photo-1579154341098-e4e158cc7f55?auto=format&fit=crop&q=80&w=800",
    accreditation: ["EU Health Certified", "ISO 14001"],
    startingPrice: "$5,000",
    specialty: "Neurological Recovery",
    rating: 4.8,
    description: "EuroLink Rehab is a sanctuary for neurological and physical recovery. Nestled in the Swiss Alps, our facility combines advanced robotics with the healing power of nature to provide a unique recovery journey.",
    fullServices: ["Exoskeleton Therapy", "Hydrotherapy", "Cognitive Restoration", "Post-Stroke Intensive"],
    stats: { recoveryScore: "94%", therapistRatio: "2:1", patientNPS: "75" },
    staffCount: "320"
  }
];

export const TIMELINE_STEPS = [
  {
    title: "Find Your Specialist",
    description: "Search our trusted network of world-class doctors and hospitals to find the perfect match for your needs.",
    icon: Search,
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Peace of Mind",
    description: "We help you communicate with specialized medical teams to plan your treatment and get all your questions answered.",
    icon: MessageSquare,
    image: "https://images.unsplash.com/photo-1576091160550-2173bdd99625?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "We Handle the Details",
    description: "From travel arrangements to hospital admission, our team manages every step so you can focus on getting better.",
    icon: Plane,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d590e?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Recover with Support",
    description: "Our care doesn't stop after treatment. We're here to support you throughout your recovery and long-term health journey.",
    icon: Sunrise,
    image: "https://images.unsplash.com/photo-1544124499-58912cbddada?auto=format&fit=crop&q=80&w=800"
  }
];
