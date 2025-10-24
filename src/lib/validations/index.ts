import { z } from "zod";

export const createProjectSchema = z.object({
  clientName: z.string().min(1, "Client name is required"),
  clientEmail: z.string().email("Valid email is required"),
  clientContactName: z.string().optional(),
});

export const discoveryFormSchema = z.object({
  useCaseName: z.string().min(1, "Use case name is required"),
  useCaseDescription: z
    .string()
    .min(10, "Description must be at least 10 characters"),
  monthlyVolume: z.number().min(1, "Monthly volume must be at least 1"),
  channels: z.array(z.string()).min(1, "At least one channel is required"),
  peakHours: z.string().optional(),
  currentProcess: z
    .string()
    .min(10, "Current process description must be at least 10 characters"),
  currentTeamSize: z.number().min(1).optional(),
  avgResponseTime: z.string().optional(),
  currentCsat: z.number().min(1).max(5).optional(),
  existingSystems: z.array(z.string()),
  dataInSalesforce: z.boolean(),
  hasApis: z.boolean(),
  apiDetails: z.string().optional(),
  successMetrics: z
    .array(z.string())
    .min(1, "At least one success metric is required"),
  desiredTimeline: z.string().min(1, "Timeline is required"),
  additionalNotes: z.string().optional(),
});

export const analysisCustomizationSchema = z.object({
  consultantNotes: z.string().optional(),
  customizations: z.record(z.string(), z.any()).optional(),
});

export const proposalGenerationSchema = z.object({
  projectId: z.string(),
  customizations: z
    .object({
      pricingOptions: z
        .array(
          z.object({
            name: z.string(),
            price: z.number(),
            timeline: z.string(),
          })
        )
        .optional(),
      includedCaseStudies: z.array(z.string()).optional(),
    })
    .optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type DiscoveryFormInput = z.infer<typeof discoveryFormSchema>;
export type AnalysisCustomizationInput = z.infer<
  typeof analysisCustomizationSchema
>;
export type ProposalGenerationInput = z.infer<typeof proposalGenerationSchema>;
