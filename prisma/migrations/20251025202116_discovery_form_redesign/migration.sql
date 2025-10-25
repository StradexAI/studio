/*
  Warnings:

  - You are about to drop the column `automationTarget` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `bestTimeToReach` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `budgetRange` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `currentMetrics` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `dataStorageLocations` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `monthlyVolume` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `primaryDepartment` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `primaryObjective` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `requirements` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `successDefinition` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `systemsToIntegrate` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `targetLaunchDate` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `useCases` on the `discovery_responses` table. All the data in the column will be lost.
  - You are about to drop the column `visionDescription` on the `discovery_responses` table. All the data in the column will be lost.
  - The `commonQuestions` column on the `discovery_responses` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `painPoints` column on the `discovery_responses` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "discovery_responses" DROP COLUMN "automationTarget",
DROP COLUMN "bestTimeToReach",
DROP COLUMN "budgetRange",
DROP COLUMN "currentMetrics",
DROP COLUMN "dataStorageLocations",
DROP COLUMN "monthlyVolume",
DROP COLUMN "primaryDepartment",
DROP COLUMN "primaryObjective",
DROP COLUMN "requirements",
DROP COLUMN "successDefinition",
DROP COLUMN "systemsToIntegrate",
DROP COLUMN "targetLaunchDate",
DROP COLUMN "useCases",
DROP COLUMN "visionDescription",
ADD COLUMN     "companySize" TEXT,
ADD COLUMN     "currentWorkflow" JSONB,
ADD COLUMN     "dataLocations" TEXT[],
ADD COLUMN     "desiredChannels" TEXT[],
ADD COLUMN     "existingAutomation" TEXT[],
ADD COLUMN     "implementationBudget" TEXT,
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "monthlyBudget" TEXT,
ADD COLUMN     "realConversations" JSONB,
ADD COLUMN     "salesforceEdition" TEXT,
ADD COLUMN     "staffingInfo" JSONB,
ADD COLUMN     "successDescription" TEXT,
ADD COLUMN     "successMetrics" TEXT,
ADD COLUMN     "teamSkillLevel" TEXT,
ADD COLUMN     "technicalRequirements" TEXT,
ADD COLUMN     "timeline" TEXT,
ADD COLUMN     "topGoals" TEXT[],
ADD COLUMN     "volumeMetrics" JSONB,
DROP COLUMN "commonQuestions",
ADD COLUMN     "commonQuestions" JSONB,
DROP COLUMN "painPoints",
ADD COLUMN     "painPoints" JSONB;
