/*
  Warnings:

  - You are about to drop the column `aiInsights` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `integrationRequirements` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `recommendedActions` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `recommendedTopics` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `recommendedVariables` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `scoringBreakdown` on the `analysis_results` table. All the data in the column will be lost.
  - You are about to drop the column `additionalNotes` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `apiDetails` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `avgResponseTime` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `channels` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `currentCsat` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `currentProcess` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `currentTeamSize` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `dataInSalesforce` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `desiredTimeline` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `existingSystems` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `hasApis` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `peakHours` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `submittedAt` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `successMetrics` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `useCaseDescription` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `useCaseName` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `userAgent` on the `discovery_responses` table. All the data in the column will be lost.
  - Added the required column `agentforceFitScore` to the `analysis_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platformRequirements` to the `analysis_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `useCases` to the `analysis_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `companyName` to the `discovery_responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactEmail` to the `discovery_responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactName` to the `discovery_responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contactRole` to the `discovery_responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `painPoints` to the `discovery_responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryDepartment` to the `discovery_responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryObjective` to the `discovery_responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `successDefinition` to the `discovery_responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `discovery_responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usesSalesforce` to the `discovery_responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `visionDescription` to the `discovery_responses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wantsConsultation` to the `discovery_responses` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ResponseStatus" AS ENUM ('IN_PROGRESS', 'COMPLETED', 'PROPOSAL_GENERATED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProjectStatus" ADD VALUE 'ANALYSIS_GENERATED';
ALTER TYPE "ProjectStatus" ADD VALUE 'ANALYSIS_REVIEWED';

-- AlterTable
ALTER TABLE "analysis_results" DROP COLUMN "aiInsights",
DROP COLUMN "integrationRequirements",
DROP COLUMN "recommendedActions",
DROP COLUMN "recommendedTopics",
DROP COLUMN "recommendedVariables",
DROP COLUMN "scoringBreakdown",
ADD COLUMN     "agentforceFitScore" INTEGER NOT NULL,
ADD COLUMN     "platformRequirements" JSONB NOT NULL,
ADD COLUMN     "useCases" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "discovery_responses" DROP COLUMN "additionalNotes",
DROP COLUMN "apiDetails",
DROP COLUMN "avgResponseTime",
DROP COLUMN "channels",
DROP COLUMN "currentCsat",
DROP COLUMN "currentProcess",
DROP COLUMN "currentTeamSize",
DROP COLUMN "dataInSalesforce",
DROP COLUMN "desiredTimeline",
DROP COLUMN "existingSystems",
DROP COLUMN "hasApis",
DROP COLUMN "ipAddress",
DROP COLUMN "peakHours",
DROP COLUMN "submittedAt",
DROP COLUMN "successMetrics",
DROP COLUMN "useCaseDescription",
DROP COLUMN "useCaseName",
DROP COLUMN "userAgent",
ADD COLUMN     "additionalContext" TEXT,
ADD COLUMN     "automationTarget" TEXT,
ADD COLUMN     "bestTimeToReach" TEXT,
ADD COLUMN     "budgetRange" TEXT,
ADD COLUMN     "commonQuestions" TEXT,
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "concerns" TEXT[],
ADD COLUMN     "contactEmail" TEXT NOT NULL,
ADD COLUMN     "contactName" TEXT NOT NULL,
ADD COLUMN     "contactRole" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "currentChannels" TEXT[],
ADD COLUMN     "currentMetrics" TEXT,
ADD COLUMN     "currentSection" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "dataStorageLocations" TEXT[],
ADD COLUMN     "painPoints" TEXT NOT NULL,
ADD COLUMN     "primaryDepartment" TEXT NOT NULL,
ADD COLUMN     "primaryObjective" TEXT NOT NULL,
ADD COLUMN     "referralSource" TEXT,
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "salesforceProducts" TEXT[],
ADD COLUMN     "status" "ResponseStatus" NOT NULL DEFAULT 'IN_PROGRESS',
ADD COLUMN     "successDefinition" TEXT NOT NULL,
ADD COLUMN     "systemsToIntegrate" TEXT,
ADD COLUMN     "targetLaunchDate" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "useCases" TEXT[],
ADD COLUMN     "usesSalesforce" TEXT NOT NULL,
ADD COLUMN     "visionDescription" TEXT NOT NULL,
ADD COLUMN     "wantsConsultation" TEXT NOT NULL,
ALTER COLUMN "monthlyVolume" DROP NOT NULL,
ALTER COLUMN "monthlyVolume" SET DATA TYPE TEXT;
