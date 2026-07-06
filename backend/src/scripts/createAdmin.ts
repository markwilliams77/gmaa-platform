import bcrypt from "bcrypt";
import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existing = await prisma.user.findUnique({
    where: {
      email: "admin@gmaa.com",
    },
  });

  if (existing) {
    console.log("Admin already exists.");
    return;
  }

  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  const admin = await prisma.user.create({
    data: {
      email: "admin@gmaa.com",
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  console.log("Admin created successfully.");
  console.log(admin);
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
