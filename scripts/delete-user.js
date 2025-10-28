// scripts/delete-user.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function deleteUser() {
  try {
    const email = "michelle@stradexai.com";

    // First, let's see what we have
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        accounts: true,
        sessions: true,
        projects: true,
      },
    });

    if (!user) {
      console.log("❌ User not found!");
      return;
    }

    console.log("📋 Found user:", {
      email: user.email,
      role: user.role,
      accounts: user.accounts.length,
      sessions: user.sessions.length,
      projects: user.projects.length,
    });

    console.log("🗑️  Deleting user...");

    // Delete user (cascades to accounts, sessions, and projects)
    await prisma.user.delete({
      where: { email },
    });

    console.log("✅ User deleted successfully!");
  } catch (error) {
    console.error("❌ Error deleting user:", error);
  } finally {
    await prisma.$disconnect();
  }
}

deleteUser();

