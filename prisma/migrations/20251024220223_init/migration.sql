-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('CONSULTANT', 'ADMIN');

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DISCOVERY', 'PENDING_REVIEW', 'PROPOSAL_DRAFT', 'PROPOSAL_SENT', 'CONTRACTED', 'IN_PROGRESS', 'DEPLOYED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProposalStatus" AS ENUM ('DRAFT', 'READY_TO_SEND', 'SENT', 'VIEWED', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "passwordHash" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CONSULTANT',
    "image" TEXT,
    "emailVerified" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "clientContactName" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'DISCOVERY',
    "discoveryToken" TEXT NOT NULL,
    "consultantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discovery_responses" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "useCaseName" TEXT NOT NULL,
    "useCaseDescription" TEXT NOT NULL,
    "monthlyVolume" INTEGER NOT NULL,
    "channels" TEXT[],
    "peakHours" TEXT,
    "currentProcess" TEXT NOT NULL,
    "currentTeamSize" INTEGER,
    "avgResponseTime" TEXT,
    "currentCsat" DOUBLE PRECISION,
    "existingSystems" TEXT[],
    "dataInSalesforce" BOOLEAN NOT NULL,
    "hasApis" BOOLEAN NOT NULL,
    "apiDetails" TEXT,
    "successMetrics" TEXT[],
    "desiredTimeline" TEXT NOT NULL,
    "additionalNotes" TEXT,
    "submittedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,
    "userAgent" TEXT,

    CONSTRAINT "discovery_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "analysis_results" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "opportunityScore" INTEGER NOT NULL,
    "scoringBreakdown" JSONB NOT NULL,
    "aiInsights" JSONB NOT NULL,
    "recommendedTopics" JSONB NOT NULL,
    "recommendedActions" JSONB NOT NULL,
    "recommendedVariables" JSONB NOT NULL,
    "integrationRequirements" JSONB NOT NULL,
    "estimatedImplementationCost" INTEGER NOT NULL,
    "estimatedMonthlyCost" INTEGER NOT NULL,
    "estimatedAnnualCost" INTEGER NOT NULL,
    "currentAnnualCost" INTEGER,
    "projectedYear1Savings" INTEGER,
    "paybackMonths" DOUBLE PRECISION,
    "threeYearRoi" DOUBLE PRECISION,
    "consultantReviewed" BOOLEAN NOT NULL DEFAULT false,
    "consultantNotes" TEXT,
    "customizations" JSONB,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewedAt" TIMESTAMP(3),

    CONSTRAINT "analysis_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proposals" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "executiveSummary" JSONB NOT NULL,
    "architecture" JSONB NOT NULL,
    "timeline" JSONB NOT NULL,
    "pricingOptions" JSONB NOT NULL,
    "caseStudies" JSONB NOT NULL,
    "terms" JSONB NOT NULL,
    "status" "ProposalStatus" NOT NULL DEFAULT 'DRAFT',
    "pdfGenerated" BOOLEAN NOT NULL DEFAULT false,
    "pdfUrl" TEXT,
    "sentToClientAt" TIMESTAMP(3),
    "viewedByClientAt" TIMESTAMP(3),
    "clientFeedback" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "proposals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_files" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generated_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "userId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "projects_discoveryToken_key" ON "projects"("discoveryToken");

-- CreateIndex
CREATE INDEX "projects_consultantId_idx" ON "projects"("consultantId");

-- CreateIndex
CREATE INDEX "projects_discoveryToken_idx" ON "projects"("discoveryToken");

-- CreateIndex
CREATE UNIQUE INDEX "discovery_responses_projectId_key" ON "discovery_responses"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "analysis_results_projectId_key" ON "analysis_results"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "proposals_projectId_key" ON "proposals"("projectId");

-- CreateIndex
CREATE INDEX "generated_files_projectId_idx" ON "generated_files"("projectId");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_consultantId_fkey" FOREIGN KEY ("consultantId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discovery_responses" ADD CONSTRAINT "discovery_responses_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analysis_results" ADD CONSTRAINT "analysis_results_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proposals" ADD CONSTRAINT "proposals_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
