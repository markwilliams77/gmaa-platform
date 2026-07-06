import { PrismaClient, Role, VendorStatus, LeadPriority, LeadStatus, LeadRoutingType, LeadSource, LeadType, TenderStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
const adminPassword = await bcrypt.hash("Admin@123", 10);

const admin = await prisma.user.upsert({
where: {
email: "admin@globalmaa.com",
},
update: {},
create: {
email: "admin@globalmaa.com",
password: adminPassword,
role: Role.ADMIN,
},
});

const vendorUserPassword = await bcrypt.hash("Vendor@123", 10);

const vendorUser = await prisma.user.upsert({
where: {
email: "vendor@globalmaa.com",
},
update: {},
create: {
email: "vendor@globalmaa.com",
password: vendorUserPassword,
role: Role.VENDOR,
},
});

const vendor = await prisma.vendor.upsert({
where: {
userId: vendorUser.id,
},
update: {},
create: {
userId: vendorUser.id,
companyName: "Apollo Hospital Nairobi",
description: "Multi-speciality healthcare provider",
region: "Kenya",
services: ["Oncology", "Cardiology"],
category: "Hospital",
specialty: "Oncology",
status: VendorStatus.APPROVED,
rating: 4.8,
},
});

const lead = await prisma.lead.create({
data: {
leadNumber: "GMAA-2026-0001",
name: "John Doe",
email: "john@example.com",
patientPhone: "+254700000000",

  title: "Cancer Treatment Inquiry",
  description: "Patient seeking oncology treatment in India",

  serviceCategory: "Oncology",

  country: "Kenya",
  city: "Nairobi",

  priority: LeadPriority.MEDIUM,
  status: LeadStatus.NEW,

  routingType: LeadRoutingType.DIRECT,

  source: LeadSource.HOMEPAGE_ENQUIRY,
  leadType: LeadType.DIRECT,

  vendorId: null,
  vendorName: null,
  selectedVendorId: null,
},

});

await prisma.leadNote.create({
data: {
leadId: lead.id,
note: "Initial enquiry received",
createdBy: admin.id,
},
});

const tender = await prisma.tender.create({
data: {
leadId: lead.id,
title: "MRI Machine Procurement",
description: "Need MRI machine supplier for Nairobi hospital",
serviceCategory: "Medical Equipment",
region: "Kenya",
createdBy: admin.id,
status: TenderStatus.AWARDED,
awardedVendorId: vendor.id,
},
});

await prisma.bid.create({
data: {
tenderId: tender.id,
vendorId: vendor.id,
amount: 250000,
proposal: "Complete MRI package with installation and support",
},
});

console.log("✅ Seed completed successfully");
}

main()
.catch((e) => {
console.error(e);
process.exit(1);
})
.finally(async () => {
await prisma.$disconnect();
});