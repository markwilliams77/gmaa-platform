import { SearchIndex } from "./index";
import { normalizeQuery } from "./normalizer";
import { SearchIntent } from "./types";

export function detectIntent(query: string): SearchIntent {
  const normalized = normalizeQuery(query);

  const result: SearchIntent = {
    originalQuery: query,
  };

  for (const vendor of SearchIndex) {
    if (!vendor) {
      continue;
    }

    if (!vendor.category) {
      console.error("INVALID SEARCH DOCUMENT", vendor);
      continue;
    }
    if (vendor.category && normalized.includes(vendor.category.toLowerCase())) {
      result.service = vendor.category;
      result.confidence = 1;
      return result;
    }

    if (
      vendor.specialty &&
      normalized.includes(vendor.specialty.toLowerCase())
    ) {
      result.specialty = vendor.specialty;
      result.confidence = 1;
      return result;
    }

    for (const service of vendor.services ?? []) {
      if (normalized.includes(service.toLowerCase())) {
        result.service = service;
        result.confidence = 1;
        return result;
      }
    }
  }

  function getKeywordMatches(value: string | string[]): string[] {
    return Array.isArray(value) ? value : [value];
  }

  const keywordMap: Record<string, string[]> = {
    // ==================================================
    // HOSPITALS & SURGERY CENTERS
    // ==================================================

    hospital: ["Hospitals & Medical Providers"],
    hospitals: ["Hospitals & Medical Providers"],
    clinic: ["Hospitals & Medical Providers"],
    clinics: ["Hospitals & Medical Providers"],
    "medical center": ["Hospitals & Medical Providers"],
    "healthcare center": ["Hospitals & Medical Providers"],
    "specialty hospital": ["Hospitals & Medical Providers"],
    "multispecialty hospital": ["Hospitals & Medical Providers"],
    "super specialty hospital": ["Hospitals & Medical Providers"],
    "surgical center": ["Hospitals & Medical Providers"],
    surgery: ["Hospitals & Medical Providers"],
    surgeon: ["Hospitals & Medical Providers"],
    operation: ["Hospitals & Medical Providers"],
    "operation theatre": ["Hospitals & Medical Providers"],
    "operating theatre": ["Hospitals & Medical Providers"],
    "operating room": ["Hospitals & Medical Providers"],
    inpatient: ["Hospitals & Medical Providers"],
    outpatient: ["Hospitals & Medical Providers"],
    opd: ["Hospitals & Medical Providers"],
    ipd: ["Hospitals & Medical Providers"],
    admission: ["Hospitals & Medical Providers"],
    discharge: ["Hospitals & Medical Providers"],
    "emergency room": ["Hospitals & Medical Providers"],
    "emergency department": ["Hospitals & Medical Providers"],
    "trauma center": ["Hospitals & Medical Providers"],

    // ==================================================
    // MEDICAL SPECIALTIES
    // ==================================================

    cardiology: ["Cardiology"],
    cardiac: ["Cardiology"],
    heart: ["Cardiology"],
    "heart specialist": ["Cardiology"],
    "heart surgeon": ["Cardiology"],
    angioplasty: ["Cardiology"],
    bypass: ["Cardiology"],
    ecg: ["Cardiology", "Diagnostics & Laboratories"],
    echo: ["Cardiology", "Diagnostics & Laboratories"],

    neurology: ["Neurology"],
    neurologist: ["Neurology"],
    neuro: ["Neurology"],
    brain: ["Neurology"],
    stroke: ["Neurology"],
    epilepsy: ["Neurology"],
    parkinson: ["Neurology"],

    neurosurgery: ["Neurosurgery"],
    neurosurgeon: ["Neurosurgery"],
    "brain surgery": ["Neurosurgery"],
    spine: ["Neurosurgery", "Orthopedics"],

    oncology: ["Oncology"],
    oncologist: ["Oncology"],
    cancer: ["Oncology"],
    tumour: ["Oncology"],
    tumor: ["Oncology"],
    chemotherapy: ["Oncology"],
    radiotherapy: ["Oncology"],

    orthopaedics: ["Orthopedics"],
    orthopedic: ["Orthopedics"],
    orthopaedic: ["Orthopedics"],
    joint: ["Orthopedics"],
    fracture: ["Orthopedics"],
    knee: ["Orthopedics"],
    hip: ["Orthopedics"],

    nephrology: ["Nephrology"],
    nephrologist: ["Nephrology"],
    kidney: ["Nephrology"],
    renal: ["Nephrology"],
    dialysis: ["Nephrology", "Hospitals & Medical Providers"],

    urology: ["Urology"],
    urologist: ["Urology"],
    prostate: ["Urology"],
    urinary: ["Urology"],

    gastroenterology: ["Gastroenterology"],
    gastro: ["Gastroenterology"],
    liver: ["Gastroenterology"],
    stomach: ["Gastroenterology"],
    intestine: ["Gastroenterology"],

    pulmonology: ["Pulmonology"],
    pulmonologist: ["Pulmonology"],
    lung: ["Pulmonology"],
    respiratory: ["Pulmonology"],
    asthma: ["Pulmonology"],
    copd: ["Pulmonology"],

    endocrinology: ["Endocrinology"],
    diabetes: ["Endocrinology"],
    thyroid: ["Endocrinology"],

    dermatology: ["Dermatology"],
    dermatologist: ["Dermatology"],
    skin: ["Dermatology"],

    ent: ["ENT"],
    ear: ["ENT"],
    nose: ["ENT"],
    throat: ["ENT"],

    ophthalmology: ["Ophthalmology"],
    ophthalmologist: ["Ophthalmology"],
    eye: ["Ophthalmology"],
    vision: ["Ophthalmology"],

    gynecology: ["Obstetrics & Gynecology"],
    gynaecology: ["Obstetrics & Gynecology"],
    gynecologist: ["Obstetrics & Gynecology"],
    pregnancy: ["Obstetrics & Gynecology"],
    maternity: ["Obstetrics & Gynecology"],

    fertility: ["Fertility & IVF"],
    ivf: ["Fertility & IVF", "Hospitals & Medical Providers"],
    embryo: ["Fertility & IVF"],

    // ======================================================
    // Diagnostics & Imaging
    // ======================================================

    diagnostic: ["Diagnostics & Laboratories"],
    diagnostics: ["Diagnostics & Laboratories"],
    imaging: ["Diagnostics & Laboratories"],
    radiology: ["Diagnostics & Laboratories"],
    radiologist: ["Diagnostics & Laboratories"],

    scan: ["Diagnostics & Laboratories"],
    scans: ["Diagnostics & Laboratories"],

    xray: ["Diagnostics & Laboratories"],
    "x-ray": ["Diagnostics & Laboratories"],
    xrays: ["Diagnostics & Laboratories"],

    mri: ["Diagnostics & Laboratories"],
    "mri scan": ["Diagnostics & Laboratories"],
    "brain mri": ["Diagnostics & Laboratories"],
    "spine mri": ["Diagnostics & Laboratories"],

    ct: ["Diagnostics & Laboratories"],
    "ct scan": ["Diagnostics & Laboratories"],
    cat: ["Diagnostics & Laboratories"],
    "cat scan": ["Diagnostics & Laboratories"],

    pet: ["Diagnostics & Laboratories"],
    "pet scan": ["Diagnostics & Laboratories"],
    "pet ct": ["Diagnostics & Laboratories"],

    ultrasound: ["Diagnostics & Laboratories"],
    sonography: ["Diagnostics & Laboratories"],
    sonogram: ["Diagnostics & Laboratories"],
    doppler: ["Diagnostics & Laboratories"],
    echocardiography: ["Cardiology", "Diagnostics & Laboratories"],

    ekg: ["Cardiology", "Diagnostics & Laboratories"],

    eeg: ["Neurology", "Diagnostics & Laboratories"],
    emg: ["Neurology", "Diagnostics & Laboratories"],

    fluoroscopy: ["Diagnostics & Laboratories"],
    angiography: ["Cardiology", "Diagnostics & Laboratories"],

    mammography: ["Diagnostics & Laboratories"],
    mammogram: ["Diagnostics & Laboratories"],

    bone: ["Orthopedics", "Diagnostics & Laboratories"],
    "dexa scan": ["Diagnostics & Laboratories"],
    bmd: ["Diagnostics & Laboratories"],

    pathology: ["Diagnostics & Laboratories"],
    laboratory: ["Diagnostics & Laboratories"],
    lab: ["Diagnostics & Laboratories"],
    labs: ["Diagnostics & Laboratories"],
    blood: ["Diagnostics & Laboratories"],
    bloodwork: ["Diagnostics & Laboratories"],
    "blood test": ["Diagnostics & Laboratories"],
    urine: ["Diagnostics & Laboratories"],
    "urine test": ["Diagnostics & Laboratories"],
    biopsy: ["Diagnostics & Laboratories"],
    histopathology: ["Diagnostics & Laboratories"],
    cytology: ["Diagnostics & Laboratories"],
    microbiology: ["Diagnostics & Laboratories"],
    hematology: ["Diagnostics & Laboratories"],

    // ==================================================
    // MEDICAL EQUIPMENT & DEVICES
    // ==================================================
    equipment: ["Pharmaceuticals, Medical Equipment & Supplies"],
    device: ["Pharmaceuticals, Medical Equipment & Supplies"],
    devices: ["Pharmaceuticals, Medical Equipment & Supplies"],
    medical: ["Pharmaceuticals, Medical Equipment & Supplies"],

    wheelchair: ["Pharmaceuticals, Medical Equipment & Supplies"],
    stretcher: ["Pharmaceuticals, Medical Equipment & Supplies", "Emergency & Medical Transportation"],
    "hospital bed": ["Pharmaceuticals, Medical Equipment & Supplies"],
    bed: ["Pharmaceuticals, Medical Equipment & Supplies"],

    oxygen: ["Pharmaceuticals, Medical Equipment & Supplies", "Home Healthcare & Senior Care"],
    "oxygen concentrator": ["Pharmaceuticals, Medical Equipment & Supplies"],
    "oxygen cylinder": ["Pharmaceuticals, Medical Equipment & Supplies"],
    ventilator: ["Pharmaceuticals, Medical Equipment & Supplies", "Home Healthcare & Senior Care"],

    monitor: ["Pharmaceuticals, Medical Equipment & Supplies"],
    "patient monitor": ["Pharmaceuticals, Medical Equipment & Supplies"],
    multipara: ["Pharmaceuticals, Medical Equipment & Supplies"],

    defibrillator: ["Pharmaceuticals, Medical Equipment & Supplies"],
    aed: ["Pharmaceuticals, Medical Equipment & Supplies"],

    infusion: ["Pharmaceuticals, Medical Equipment & Supplies"],
    "infusion pump": ["Pharmaceuticals, Medical Equipment & Supplies"],
    "syringe pump": ["Pharmaceuticals, Medical Equipment & Supplies"],

    "ecg machine": ["Pharmaceuticals, Medical Equipment & Supplies"],
    "ultrasound machine": ["Pharmaceuticals, Medical Equipment & Supplies"],
    "xray machine": ["Pharmaceuticals, Medical Equipment & Supplies"],
    "x-ray machine": ["Pharmaceuticals, Medical Equipment & Supplies"],
    "mri machine": ["Pharmaceuticals, Medical Equipment & Supplies"],
    "ct scanner": ["Pharmaceuticals, Medical Equipment & Supplies"],

    "dialysis machine": ["Pharmaceuticals, Medical Equipment & Supplies", "Nephrology"],
    "anesthesia machine": ["Pharmaceuticals, Medical Equipment & Supplies"],
    "operation table": ["Pharmaceuticals, Medical Equipment & Supplies"],
    "surgical light": ["Pharmaceuticals, Medical Equipment & Supplies"],

    prosthetic: ["Pharmaceuticals, Medical Equipment & Supplies"],
    prosthesis: ["Pharmaceuticals, Medical Equipment & Supplies"],
    orthotic: ["Pharmaceuticals, Medical Equipment & Supplies"],
    brace: ["Pharmaceuticals, Medical Equipment & Supplies"],
    crutches: ["Pharmaceuticals, Medical Equipment & Supplies"],
    walker: ["Pharmaceuticals, Medical Equipment & Supplies"],
    // ==================================================
    // HOME HEALTHCARE
    // ==================================================

    home: ["Home Healthcare & Senior Care"],
    "home care": ["Home Healthcare & Senior Care"],
    "home healthcare": ["Home Healthcare & Senior Care"],
    "home health": ["Home Healthcare & Senior Care"],
    domiciliary: ["Home Healthcare & Senior Care"],

    nursing: ["Home Healthcare & Senior Care"],
    nurse: ["Home Healthcare & Senior Care"],
    "home nurse": ["Home Healthcare & Senior Care"],
    "private nurse": ["Home Healthcare & Senior Care"],

    caregiver: ["Home Healthcare & Senior Care"],
    caretaker: ["Home Healthcare & Senior Care"],
    attendant: ["Home Healthcare & Senior Care"],
    "patient attendant": ["Home Healthcare & Senior Care"],

    physiotherapy: ["Physiotherapy", "Home Healthcare & Senior Care" , "Wellness, Rehabilitation & Preventive Care"],
    physiotherapist: ["Physiotherapy", "Home Healthcare & Senior Care" , "Wellness, Rehabilitation & Preventive Care"],
    physio: ["Physiotherapy", "Home Healthcare & Senior Care"],

    rehab: ["Wellness, Rehabilitation & Preventive Care", "Home Healthcare & Senior Care"],
    rehabilitation: ["Wellness, Rehabilitation & Preventive Care", "Home Healthcare & Senior Care"],

    icu: ["Home Healthcare & Senior Care"],
    "icu at home": ["Home Healthcare & Senior Care"],
    "home icu": ["Home Healthcare & Senior Care"],

    "oxygen support": ["Home Healthcare & Senior Care"],
    "oxygen therapy": ["Home Healthcare & Senior Care"],

    palliative: ["Palliative Care", "Home Healthcare & Senior Care"],
    "hospice care": ["Palliative Care", "Home Healthcare & Senior Care"],

    elderly: ["Home Healthcare & Senior Care"],
    senior: ["Home Healthcare & Senior Care"],
    geriatric: ["Geriatrics", "Home Healthcare & Senior Care"],

    "post surgery": ["Home Healthcare & Senior Care"],
    "post operative": ["Home Healthcare & Senior Care"],
    "post operative care": ["Home Healthcare & Senior Care"],
    "wound care": ["Home Healthcare & Senior Care"],
    "dressing change": ["Home Healthcare & Senior Care"],
    "injection at home": ["Home Healthcare & Senior Care"],

    "lab at home": ["Home Healthcare & Senior Care"],
    "blood test at home": ["Home Healthcare & Senior Care"],
    "sample collection": ["Home Healthcare & Senior Care"],
    // ==================================================
    // GROUND AMBULANCE
    // ==================================================

    ambulance: ["Emergency & Medical Transportation"],
    ambulances: ["Emergency & Medical Transportation"],

    "ground ambulance": ["Emergency & Medical Transportation"],
    "road ambulance": ["Emergency & Medical Transportation"],
    "emergency ambulance": ["Emergency & Medical Transportation"],

    ems: ["Emergency & Medical Transportation"],
    emt: ["Emergency & Medical Transportation"],
    paramedic: ["Emergency & Medical Transportation"],
    paramedics: ["Emergency & Medical Transportation"],

    "patient transport": ["Emergency & Medical Transportation"],
    "medical transport": ["Emergency & Medical Transportation"],
    "medical transportation": ["Emergency & Medical Transportation"],
    transportation: ["Emergency & Medical Transportation"],

    "non emergency transport": ["Emergency & Medical Transportation"],
    "non-emergency transport": ["Emergency & Medical Transportation"],

    "icu ambulance": ["Emergency & Medical Transportation"],
    "mobile icu": ["Emergency & Medical Transportation"],
    "advanced life support": ["Emergency & Medical Transportation"],
    als: ["Emergency & Medical Transportation"],

    "basic life support": ["Emergency & Medical Transportation"],
    bls: ["Emergency & Medical Transportation"],

    "critical care ambulance": ["Emergency & Medical Transportation"],
    "cardiac ambulance": ["Emergency & Medical Transportation"],
    "neonatal ambulance": ["Emergency & Medical Transportation"],
    "pediatric ambulance": ["Emergency & Medical Transportation"],

    // ==================================================
    // AIR AMBULANCE
    // ==================================================

    "air ambulance": ["Emergency & Medical Transportation"],
    helicopter: ["Emergency & Medical Transportation"],
    "air medical": ["Emergency & Medical Transportation"],
    "medical flight": ["Emergency & Medical Transportation"],
    "medical evacuation": ["Emergency & Medical Transportation"],
    medevac: ["Emergency & Medical Transportation"],
    evacuation: ["Emergency & Medical Transportation"],
    airlift: ["Emergency & Medical Transportation"],

    charter: ["Emergency & Medical Transportation"],
    "air charter": ["Emergency & Medical Transportation"],
    jet: ["Emergency & Medical Transportation"],
    "air transfer": ["Emergency & Medical Transportation"],
    "patient transfer": ["Emergency & Medical Transportation"],
    "international transfer": ["Emergency & Medical Transportation"],

    "critical air transport": ["Emergency & Medical Transportation"],
    "icu flight": ["Emergency & Medical Transportation"],
    "flying doctor": ["Emergency & Medical Transportation"],

    repatriation: ["Emergency & Medical Transportation", "Medical Tourism & International Patient Services"],
    "medical repatriation": ["Emergency & Medical Transportation", "Medical Tourism & International Patient Services"],
// ==================================================
// PHARMACY & MEDICINES
// ==================================================

pharmacy: ["Pharmaceuticals, Medical Equipment & Supplies"],
pharmacies: ["Pharmaceuticals, Medical Equipment & Supplies"],
chemist: ["Pharmaceuticals, Medical Equipment & Supplies"],
drugstore: ["Pharmaceuticals, Medical Equipment & Supplies"],
medicine: ["Pharmaceuticals, Medical Equipment & Supplies"],
medicines: ["Pharmaceuticals, Medical Equipment & Supplies"],
medication: ["Pharmaceuticals, Medical Equipment & Supplies"],
prescription: ["Pharmaceuticals, Medical Equipment & Supplies"],
rx: ["Pharmaceuticals, Medical Equipment & Supplies"],
otc: ["Pharmaceuticals, Medical Equipment & Supplies"],
tablet: ["Pharmaceuticals, Medical Equipment & Supplies"],
tablets: ["Pharmaceuticals, Medical Equipment & Supplies"],
capsule: ["Pharmaceuticals, Medical Equipment & Supplies"],
capsules: ["Pharmaceuticals, Medical Equipment & Supplies"],
syrup: ["Pharmaceuticals, Medical Equipment & Supplies"],
injection: ["Pharmaceuticals, Medical Equipment & Supplies"],
vaccine: ["Pharmaceuticals, Medical Equipment & Supplies"],
vaccination: ["Pharmaceuticals, Medical Equipment & Supplies"],
immunization: ["Pharmaceuticals, Medical Equipment & Supplies"],
insulin: ["Pharmaceuticals, Medical Equipment & Supplies"],
antibiotic: ["Pharmaceuticals, Medical Equipment & Supplies"],
painkiller: ["Pharmaceuticals, Medical Equipment & Supplies"],

// ==================================================
// PHARMACEUTICALS
// ==================================================

pharmaceutical: ["Pharmaceuticals, Medical Equipment & Supplies"],
pharmaceuticals: ["Pharmaceuticals, Medical Equipment & Supplies"],
pharma: ["Pharmaceuticals, Medical Equipment & Supplies"],
manufacturer: ["Pharmaceuticals, Medical Equipment & Supplies"],
manufacturing: ["Pharmaceuticals, Medical Equipment & Supplies"],
generic: ["Pharmaceuticals, Medical Equipment & Supplies"],
brand: ["Pharmaceuticals, Medical Equipment & Supplies"],
wholesale: ["Pharmaceuticals, Medical Equipment & Supplies"],
distributor: ["Pharmaceuticals, Medical Equipment & Supplies"],
supplier: ["Pharmaceuticals, Medical Equipment & Supplies"],
api: ["Pharmaceuticals, Medical Equipment & Supplies"],
formulation: ["Pharmaceuticals, Medical Equipment & Supplies"],
"contract manufacturing": ["Pharmaceuticals, Medical Equipment & Supplies"],

// ==================================================
// REHABILITATION
// ==================================================


"physical therapy": ["Wellness, Rehabilitation & Preventive Care"],
"occupational therapy": ["Wellness, Rehabilitation & Preventive Care"],
"speech therapy": ["Wellness, Rehabilitation & Preventive Care"],
"stroke rehab": ["Wellness, Rehabilitation & Preventive Care","Neurology"],
"spinal rehab": ["Wellness, Rehabilitation & Preventive Care"],
"sports rehab": ["Wellness, Rehabilitation & Preventive Care"],
"cardiac rehab": ["Wellness, Rehabilitation & Preventive Care","Cardiology"],
"pulmonary rehab": ["Wellness, Rehabilitation & Preventive Care","Pulmonology"],
prosthetics: ["Pharmaceuticals, Medical Equipment & Supplies","Wellness, Rehabilitation & Preventive Care"],
orthotics: ["Pharmaceuticals, Medical Equipment & Supplies","Wellness, Rehabilitation & Preventive Care"],

// ==================================================
// MEDICAL TOURISM
// ==================================================

"medical tourism": ["Medical Tourism & International Patient Services"],
"health tourism": ["Medical Tourism & International Patient Services"],
"treatment abroad": ["Medical Tourism & International Patient Services"],
"international patient": ["Medical Tourism & International Patient Services"],
visa: ["Medical Tourism & International Patient Services"],
"medical visa": ["Medical Tourism & International Patient Services"],
travel: ["Medical Tourism & International Patient Services"],
accommodation: ["Medical Tourism & International Patient Services"],
translator: ["Medical Tourism & International Patient Services"],
interpreter: ["Medical Tourism & International Patient Services"],
concierge: ["Medical Tourism & International Patient Services"],

// ==================================================
// BLOOD BANKS
// ==================================================

"blood bank": ["Blood Banks"],
"blood banks": ["Blood Banks"],
"blood donation": ["Blood Banks"],
platelets: ["Blood Banks"],
plasma: ["Blood Banks"],
"whole blood": ["Blood Banks"],
"blood group": ["Blood Banks"],
crossmatch: ["Blood Banks"],
transfusion: ["Blood Banks"],

// ==================================================
// ORGAN TRANSPLANT
// ==================================================

transplant: ["Organ Transplant"],
"organ transplant": ["Organ Transplant"],
"kidney transplant": ["Organ Transplant","Nephrology"],
"liver transplant": ["Organ Transplant","Gastroenterology"],
"heart transplant": ["Organ Transplant","Cardiology"],
"lung transplant": ["Organ Transplant","Pulmonology"],
"bone marrow": ["Organ Transplant"],
"stem cell": ["Organ Transplant"],
donor: ["Organ Transplant","Blood Banks"],
recipient: ["Organ Transplant"],

// ==================================================
// INSURANCE
// ==================================================

insurance: ["Insurance, Assistance & Claims"],
"health insurance": ["Insurance, Assistance & Claims"],
cashless: ["Insurance, Assistance & Claims"],
tpa: ["Insurance, Assistance & Claims"],
claim: ["Insurance, Assistance & Claims"],
preauthorization: ["Insurance, Assistance & Claims"],
"pre-auth": ["Insurance, Assistance & Claims"],
coverage: ["Insurance, Assistance & Claims"],
policy: ["Insurance, Assistance & Claims"],

// ==================================================
// TELEMEDICINE
// ==================================================

telemedicine: ["Telemedicine & Digital Health"],
telehealth: ["Telemedicine & Digital Health"],
"virtual consultation": ["Telemedicine & Digital Health"],
"video consultation": ["Telemedicine & Digital Health"],
"online doctor": ["Telemedicine & Digital Health"],
"online consultation": ["Telemedicine & Digital Health"],
econsult: ["Telemedicine & Digital Health"],
"remote consultation": ["Telemedicine & Digital Health"],

// ==================================================
// GOVERNMENT & PUBLIC HEALTH
// ==================================================

"government hospital": ["Government, NGOs & Public Health"],
"public hospital": ["Government, NGOs & Public Health"],
"ministry of health": ["Government, NGOs & Public Health"],
"health department": ["Government, NGOs & Public Health"],
"public health": ["Government, NGOs & Public Health"],
"municipal hospital": ["Government, NGOs & Public Health"],

// ==================================================
// NGOs & CHARITIES
// ==================================================

ngo: ["Government, NGOs & Public Health"],
charity: ["Government, NGOs & Public Health"],
foundation: ["Government, NGOs & Public Health"],
nonprofit: ["Government, NGOs & Public Health"],
volunteer: ["Government, NGOs & Public Health"],
humanitarian: ["Government, NGOs & Public Health"],
relief: ["Government, NGOs & Public Health"],

// ==================================================
// WELLNESS & PREVENTIVE HEALTHCARE
// ==================================================

wellness: ["Wellness, Rehabilitation & Preventive Care"],
"preventive care": ["Wellness, Rehabilitation & Preventive Care"],
"preventive health": ["Wellness, Rehabilitation & Preventive Care"],
"health checkup": ["Wellness, Rehabilitation & Preventive Care"],
"health screening": ["Wellness, Rehabilitation & Preventive Care"],
"executive checkup": ["Wellness, Rehabilitation & Preventive Care"],
nutrition: ["Wellness, Rehabilitation & Preventive Care"],
dietitian: ["Wellness, Rehabilitation & Preventive Care"],
nutritionist: ["Wellness, Rehabilitation & Preventive Care"],
fitness: ["Wellness, Rehabilitation & Preventive Care"],
yoga: ["Wellness, Rehabilitation & Preventive Care"],
meditation: ["Wellness, Rehabilitation & Preventive Care"],
lifestyle: ["Wellness, Rehabilitation & Preventive Care"],
obesity: ["Wellness, Rehabilitation & Preventive Care"],
"weight loss": ["Wellness, Rehabilitation & Preventive Care"],

};

  for (const keyword of Object.keys(keywordMap)) {
    if (normalized.includes(keyword)) {
      const matches = getKeywordMatches(keywordMap[keyword]);

      result.service = matches[0];
      result.category = matches[0];

      result.confidence = 0.8;

      break;
    }
  }

  return result;
}
