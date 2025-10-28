// scripts/set-admin-role.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function setAdminRole() {
  try {
    const email = "michelle@stradexai.com";

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log("❌ User not found! Sign in with Google first.");
      return;
    }

    console.log("📋 Current user:", {
      email: user.email,
      role: user.role,
    });

    // Update role to ADMIN
    const updatedUser = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    console.log("✅ Role updated to ADMIN:", {
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (error) {
    console.error("❌ Error setting admin role:", error);
  } finally {
    await prisma.$disconnect();
  }
}

setAdminRole();

