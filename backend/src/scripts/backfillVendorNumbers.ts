import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function backfillVendorNumbers() {
  const PREFIX = "VND";
  const currentYear = new Date().getFullYear();

  const vendors = await prisma.vendor.findMany({
    orderBy: {
      id: "asc",
    },
  });

  const existingCount = await prisma.vendor.count({
    where: {
      vendorNumber: {
        not: null,
      },
    },
  });

  let counter = existingCount + 1;

  for (const vendor of vendors) {
    if (vendor.vendorNumber) {
      continue;
    }

    const vendorNumber = `${PREFIX}-${currentYear}-${String(counter).padStart(6, "0")}`;

    await prisma.vendor.update({
      where: {
        id: vendor.id,
      },
      data: {
        vendorNumber,
      },
    });

    console.log(`${vendor.companyName} → ${vendorNumber}`);

    counter++;
  }

  console.log("Vendor backfill completed.");
}

backfillVendorNumbers()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
