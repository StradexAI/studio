// scripts/add-user.js
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function addUser() {
  try {
    // Hash password
    const passwordHash = await bcrypt.hash("tempPassword123", 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: "michelle@stradexai.com",
        name: "Michelle Bastelier",
        passwordHash: passwordHash,
        role: "ADMIN",
        emailVerified: new Date(),
      },
    });

    console.log("User created successfully:", user);
  } catch (error) {
    console.error("Error creating user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addUser();
