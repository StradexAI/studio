export interface AgentforceUseCase {
  name: string;
  description: string;
  priority: "high" | "medium" | "low";
  channels: string[];
  topics: AgentforceTopic[];
  actions: AgentforceAction[];
  variables: AgentforceVariable[];
  integrations: AgentforceIntegration[];
  sampleConversations: SampleConversation[];
  pricing: UseCasePricing;
}

export interface AgentforceTopic {
  name: string;
  displayName: string;
  description: string;
}

export interface AgentforceAction {
  name: string;
  type: "flow" | "apex";
  description: string;
}

export interface AgentforceVariable {
  name: string;
  type: "string" | "boolean" | "number";
  description: string;
}

export interface AgentforceIntegration {
  system: string;
  required: boolean;
  complexity: "low" | "medium" | "high";
  notes?: string;
}

export interface SampleConversation {
  scenario: string;
  conversation: ConversationTurn[];
}

export interface ConversationTurn {
  speaker: "Customer" | "Agent";
  message: string;
}

export interface UseCasePricing {
  implementationCost: number;
  monthlyConversationVolume: number;
  avgActionsPerConversation: number;
  monthlyAgentforceCost: number;
}

export interface PlatformRequirements {
  salesforceProducts: string[];
  dataCloudRequired: boolean;
  dataCloudReason?: string;
  agentforceEdition: "Flex" | "Unlimited";
}

export interface ClaudeAgentforceResponse {
  opportunityScore: number;
  agentforceFitScore: number;
  platformRequirements: PlatformRequirements;
  useCases: AgentforceUseCase[];
  costEstimates: {
    totalImplementation: number;
    monthlyPlatformCost: number;
    annualPlatformCost: number;
  };
  roiProjections: {
    currentAnnualCost: number;
    projectedYear1Savings: number;
    paybackMonths: number;
    threeYearRoi: number;
  };
}

// Legacy interfaces for backward compatibility

/**
 * Discovery Form Response
 * This is the data structure collected from clients during the discovery phase
 */
export interface DiscoveryResponse {
  // Section 1: The Basics
  companyName?: string;
  contactName?: string;
  contactEmail?: string;
  contactRole?: string;
  companySize?: string;
  industry?: string;

  // Section 2: Pain Points (NEW - structured as JSON)
  painPoints?: Array<{
    department: string;
    description: string;
    frequency: string;
    cost: string;
  }>;

  // Section 3: Common Questions (NEW - structured as JSON)
  commonQuestions?: string[];

  // Section 4: Real Conversations (NEW - structured as JSON)
  realConversations?: Array<{
    trigger: string;
    conversation: string;
    outcome: string;
    duration: string;
  }>;

  // Section 5: Volume & Staffing (REVISED - structured as JSON)
  volumeMetrics?: {
    phone: string;
    email: string;
    chat: string;
    forms: string;
    social: string;
    inPerson: string;
    other: string;
  };
  staffingInfo?: {
    numPeople: string;
    percentRepetitive: number;
    avgResponseTime: string;
    avgCostPerEmployee: string;
  };

  // Section 6: Channels (REVISED)
  currentChannels?: string[];
  desiredChannels?: string[]; // NEW - where they want AI agents deployed

  // Section 7: Salesforce Environment (REVISED)
  usesSalesforce?: string;
  salesforceProducts?: string[];
  salesforceEdition?: string; // NEW
  existingAutomation?: string[]; // NEW
  dataLocations?: string[]; // Renamed from dataStorageLocations
  teamSkillLevel?: string; // NEW

  // Section 8: Current Workflows (NEW - structured as JSON)
  currentWorkflow?: {
    steps: string[];
    systemsTouched: string;
    dataLookedUp: string;
    whatGetsUpdated: string;
  };

  // Section 9: Success Criteria (REVISED)
  topGoals?: string[]; // NEW - top 3 selected goals
  successDescription?: string; // NEW - what success looks like in 6 months
  successMetrics?: string; // NEW - how they'll measure success

  // Section 10: Budget & Timeline (REVISED)
  timeline?: string;
  implementationBudget?: string; // NEW
  monthlyBudget?: string; // NEW

  // Section 11: Special Requirements (REVISED)
  technicalRequirements?: string;
  concerns?: string[];

  // Section 12: Final Details
  additionalContext?: string;
  referralSource?: string;
  wantsConsultation?: string;

  // Legacy fields for backward compatibility (if needed)
  primaryDepartment?: string;
  useCases?: string[];
  visionDescription?: string;
  primaryObjective?: string;
  automationTarget?: string;
  successDefinition?: string;
  currentMetrics?: string;
  monthlyVolume?: string;
  dataStorageLocations?: string[];
  systemsToIntegrate?: string;
  targetLaunchDate?: string;
  budgetRange?: string;
  requirements?: string;
  bestTimeToReach?: string;
}

/**
 * Scoring Breakdown
 * Four key metrics that determine the overall opportunity score
 */
export interface ScoringBreakdown {
  automationPotential: number; // 0-100: How much work can be automated
  costSavings: number; // 0-100: Potential for cost reduction
  implementationComplexity: number; // 0-100: Higher = easier to implement
  businessImpact: number; // 0-100: Strategic value to business
}

/**
 * Analysis Data Structure
 * Complete analysis generated by Claude and editable by consultants
 */
export interface Analysis {
  id: string;
  projectId: string;

  // Scoring
  opportunityScore: number; // 0-100: Overall opportunity rating
  scoringBreakdown: ScoringBreakdown;

  // Qualitative Analysis
  aiInsights: string; // Multi-paragraph analysis
  recommendedTopics: string[]; // Topics for AI agent training
  recommendedActions: string[]; // Implementation steps

  // Financial Projections
  estimatedImplementationCost: number; // One-time setup cost
  estimatedMonthlyCost: number; // Ongoing monthly costs
  projectedYear1Savings: number; // First year savings
  paybackMonths: number; // Months to ROI positive

  // Metadata
  consultantReviewed: boolean; // Has consultant reviewed and approved
  generatedAt: Date;
  updatedAt?: Date;
}

/**
 * Project Information
 * Core project data including client details and status
 */
export interface Project {
  id: string;
  clientName: string;
  clientEmail: string;
  status: ProjectStatus;
  discoveryResponse?: DiscoveryResponse;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Project Status Types
 */
export type ProjectStatus =
  | "Discovery Sent"
  | "Discovery Completed"
  | "Analysis Generated"
  | "Analysis Reviewed"
  | "Proposal Generated"
  | "Proposal Sent"
  | "Proposal Accepted"
  | "Proposal Declined"
  | "Project Active"
  | "Project Completed";

/**
 * API Response Types
 */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface AnalysisGenerationRequest {
  projectId: string;
}

export interface AnalysisUpdateRequest extends Partial<Analysis> {
  consultantReviewed?: boolean;
}

/**
 * Claude API Types
 */
export interface ClaudeMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ClaudeAPIRequest {
  model: string;
  max_tokens: number;
  temperature?: number;
  messages: ClaudeMessage[];
}

export interface ClaudeAPIResponse {
  id: string;
  type: string;
  role: string;
  content: Array<{
    type: string;
    text: string;
  }>;
  model: string;
  stop_reason: string;
  usage: {
    input_tokens: number;
    output_tokens: number;
  };
}

/**
 * Form Validation Types
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Helper function to validate discovery response
 */
export function validateDiscoveryResponse(
  data: Partial<DiscoveryResponse>
): ValidationError[] {
  const errors: ValidationError[] = [];

  // Section 1: Required fields
  if (!data.companyName?.trim()) {
    errors.push({ field: "companyName", message: "Company name is required" });
  }
  if (!data.contactName?.trim()) {
    errors.push({ field: "contactName", message: "Contact name is required" });
  }
  if (!data.contactEmail?.trim()) {
    errors.push({
      field: "contactEmail",
      message: "Contact email is required",
    });
  }
  if (!data.contactRole?.trim()) {
    errors.push({ field: "contactRole", message: "Contact role is required" });
  }

  // Section 2: Pain Points (at least 3 required)
  if (!data.painPoints || data.painPoints.length < 3) {
    errors.push({
      field: "painPoints",
      message: "At least 3 pain points are required",
    });
  } else {
    data.painPoints.forEach((painPoint, index) => {
      if (!painPoint.description?.trim()) {
        errors.push({
          field: `painPoints[${index}].description`,
          message: `Pain point ${index + 1} description is required`,
        });
      }
      if (!painPoint.department?.trim()) {
        errors.push({
          field: `painPoints[${index}].department`,
          message: `Pain point ${index + 1} department is required`,
        });
      }
    });
  }

  // Section 3: Common Questions (at least 5 required)
  if (
    !data.commonQuestions ||
    data.commonQuestions.filter((q) => q?.trim()).length < 5
  ) {
    errors.push({
      field: "commonQuestions",
      message: "At least 5 common questions are required",
    });
  }

  // Section 4: Real Conversations (at least 1 required)
  if (!data.realConversations || data.realConversations.length < 1) {
    errors.push({
      field: "realConversations",
      message: "At least 1 real conversation example is required",
    });
  } else {
    data.realConversations.forEach((conversation, index) => {
      if (!conversation.conversation?.trim()) {
        errors.push({
          field: `realConversations[${index}].conversation`,
          message: `Conversation ${index + 1} content is required`,
        });
      }
    });
  }

  // Section 5: Volume & Staffing
  if (!data.volumeMetrics) {
    errors.push({
      field: "volumeMetrics",
      message: "Volume metrics are required",
    });
  }
  if (!data.staffingInfo?.numPeople?.trim()) {
    errors.push({
      field: "staffingInfo.numPeople",
      message: "Number of people is required",
    });
  }

  // Section 6: Channels
  if (!data.currentChannels || data.currentChannels.length === 0) {
    errors.push({
      field: "currentChannels",
      message: "At least one current channel is required",
    });
  }
  if (!data.desiredChannels || data.desiredChannels.length === 0) {
    errors.push({
      field: "desiredChannels",
      message: "At least one desired channel is required",
    });
  }

  // Section 7: Salesforce
  if (!data.usesSalesforce?.trim()) {
    errors.push({
      field: "usesSalesforce",
      message: "Salesforce usage status is required",
    });
  }

  // Section 8: Workflow
  if (
    !data.currentWorkflow?.steps ||
    data.currentWorkflow.steps.filter((s) => s?.trim()).length < 3
  ) {
    errors.push({
      field: "currentWorkflow.steps",
      message: "At least 3 workflow steps are required",
    });
  }

  // Section 9: Success Criteria
  if (!data.topGoals || data.topGoals.length < 3) {
    errors.push({
      field: "topGoals",
      message: "Please select your top 3 goals",
    });
  }
  if (!data.successDescription?.trim()) {
    errors.push({
      field: "successDescription",
      message: "Success description is required",
    });
  }

  // Section 10: Budget & Timeline
  if (!data.timeline?.trim()) {
    errors.push({
      field: "timeline",
      message: "Timeline preference is required",
    });
  }
  if (!data.implementationBudget?.trim()) {
    errors.push({
      field: "implementationBudget",
      message: "Implementation budget is required",
    });
  }
  if (!data.monthlyBudget?.trim()) {
    errors.push({
      field: "monthlyBudget",
      message: "Monthly budget is required",
    });
  }

  // Section 12: Final
  if (!data.wantsConsultation?.trim()) {
    errors.push({
      field: "wantsConsultation",
      message: "Consultation preference is required",
    });
  }

  return errors;
}

/**
 * Helper function to calculate opportunity score from breakdown
 */
export function calculateOpportunityScore(breakdown: ScoringBreakdown): number {
  const scores = [
    breakdown.automationPotential,
    breakdown.costSavings,
    breakdown.implementationComplexity,
    breakdown.businessImpact,
  ];

  const average = scores.reduce((sum, score) => sum + score, 0) / scores.length;
  return Math.round(average);
}

/**
 * Helper function to get score label
 */
export function getScoreLabel(score: number): string {
  if (score >= 80) return "High Opportunity";
  if (score >= 60) return "Medium Opportunity";
  return "Low Opportunity";
}

/**
 * Helper function to get score color
 */
export function getScoreColor(score: number): {
  text: string;
  bg: string;
} {
  if (score >= 80) return { text: "text-green-600", bg: "bg-green-100" };
  if (score >= 60) return { text: "text-yellow-600", bg: "bg-yellow-100" };
  return { text: "text-red-600", bg: "bg-red-100" };
}

/**
 * Sample Discovery Response for Testing
 */
export const sampleDiscoveryResponse: DiscoveryResponse = {
  companyName: "TechCorp Solutions",
  industry: "Software Development",
  companySize: "50-100 employees",
  painPoints: [
    {
      department: "Engineering",
      description:
        "High time spent on repetitive tasks, slow response times to customers, inconsistent documentation",
      frequency: "Daily",
      cost: "2 FTEs spend 60% of time on this",
    },
    {
      department: "Support",
      description: "Manual ticket classification and routing",
      frequency: "Daily",
      cost: "1 FTE spends 4 hours daily",
    },
    {
      department: "Operations",
      description: "Manual documentation updates",
      frequency: "Weekly",
      cost: "Team spends 4 hours weekly",
    },
  ],
  commonQuestions: [
    "Where's my order?",
    "How do I reset my password?",
    "What's the price for Enterprise plan?",
    "Can I return this item?",
    "How do I cancel my subscription?",
  ],
  realConversations: [
    {
      trigger:
        "Customer receives order confirmation email and replies asking about delivery time",
      conversation:
        "Customer: Hi, I placed an order last week and haven't received any updates. Can you help me track it?\n\nYour team: Hi! I'd be happy to help you track your order. Can you please provide me with your order number or the email address you used when placing the order?\n\nCustomer: Sure, my order number is #12345 and I used john@email.com\n\nYour team: Thank you! I can see your order was shipped on Monday and is currently out for delivery. Here's your tracking number: 1Z999AA10123456784. You can track it on the FedEx website. It should arrive today by 5pm.\n\nCustomer: Perfect! Thank you so much for your help.\n\nYour team: You're welcome! Is there anything else I can help you with today?",
      outcome: "Provided tracking link, customer satisfied",
      duration: "5 min",
    },
  ],
  volumeMetrics: {
    phone: "50",
    email: "200",
    chat: "100",
    forms: "25",
    social: "15",
    inPerson: "10",
    other: "5",
  },
  staffingInfo: {
    numPeople: "5",
    percentRepetitive: 75,
    avgResponseTime: "15-30 min",
    avgCostPerEmployee: "$100-150K/year",
  },
  currentChannels: ["Email", "Live chat on website", "Phone"],
  desiredChannels: [
    "Website chat (for customers)",
    "Email responses (for customers)",
  ],
  usesSalesforce: "active",
  salesforceProducts: ["Sales Cloud", "Service Cloud"],
  salesforceEdition: "Enterprise",
  existingAutomation: [
    "Workflows or automation rules",
    "Custom fields and objects",
  ],
  dataLocations: ["In Salesforce", "In another CRM"],
  teamSkillLevel: "Intermediate - We've customized it some",
  currentWorkflow: {
    steps: [
      "Customer sends email to support@company.com",
      "Support rep reads email and checks order in Salesforce",
      "Rep looks up shipping carrier website for tracking",
      "Rep copies tracking link into email response",
      "Rep sends email to customer - average 15 minutes",
    ],
    systemsTouched: "Email, Salesforce, ShipStation API, carrier websites",
    dataLookedUp:
      "Order number, customer account, shipping carrier, tracking number",
    whatGetsUpdated: "Case status in Salesforce, last contact date",
  },
  topGoals: [
    "Reduce staffing costs",
    "Improve response times",
    "Scale without hiring",
  ],
  successDescription:
    "Customer wait time drops from 4 hours to under 5 minutes, CSAT goes from 3.8 to 4.5, and we handle 2x the volume without adding headcount",
  successMetrics:
    "Response time (target: <5 minutes), Resolution rate (target: 80% automated), CSAT score (target: 4.5/5), Cost per conversation (target: <$2 vs $15 with humans)",
  timeline: "Within 3-6 months",
  implementationBudget: "$50-100K",
  monthlyBudget: "$5-10K/month",
  technicalRequirements: "Must support Spanish language, Need HIPAA compliance",
  concerns: ["Cost", "Technical complexity", "Customer acceptance"],
  additionalContext:
    "Team is tech-savvy and open to AI solutions. Have used some automation tools before.",
  referralSource: "Google search",
  wantsConsultation: "Maybe, I'll decide after seeing the proposal",
};
