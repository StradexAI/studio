// Core types for the application
export type UserRole = "CONSULTANT" | "ADMIN";

export type ProposalStatus =
  | "DRAFT"
  | "READY_TO_SEND"
  | "SENT"
  | "VIEWED"
  | "ACCEPTED"
  | "REJECTED";

// Legacy discovery form types (for backward compatibility)
export interface DiscoveryFormData {
  useCaseName: string;
  useCaseDescription: string;
  monthlyVolume: number;
  channels: string[];
  peakHours?: string;
  currentProcess: string;
  currentTeamSize?: number;
  avgResponseTime?: string;
  currentCsat?: number;
  existingSystems: string[];
  dataInSalesforce: boolean;
  hasApis: boolean;
  apiDetails?: string;
  successMetrics: string[];
  desiredTimeline: string;
  additionalNotes?: string;
}

// Legacy analysis types (for backward compatibility with existing Claude API)
export interface AnalysisResult {
  opportunityScore: number;
  scoringBreakdown: {
    volume: number;
    repeatability: number;
    complexity: number;
    data: number;
    roi: number;
  };
  insights: Array<{
    type: "positive" | "warning" | "recommendation";
    title: string;
    description: string;
  }>;
  architecture: {
    topics: Array<{
      name: string;
      displayName: string;
      description: string;
      priority: "high" | "medium" | "low";
    }>;
    actions: Array<{
      name: string;
      description: string;
      type: "flow" | "apex";
      inputs: string[];
      outputs: string[];
      complexity: "low" | "medium" | "high";
    }>;
    variables: Array<{
      name: string;
      type: "string" | "boolean" | "number";
      description: string;
    }>;
    integrations: Array<{
      system: string;
      required: boolean;
      complexity: "low" | "medium" | "high";
      notes: string;
    }>;
  };
  costEstimates: {
    implementationCost: {
      min: number;
      max: number;
      recommended: number;
      breakdown: {
        baseImplementation: number;
        integrations: number;
        testing: number;
      };
    };
    monthlyPlatformCost: {
      agentforceFlex: number;
      dataCloud: number;
      total: number;
    };
    assumptions: {
      avgActionsPerConversation: number;
      containmentRate: number;
    };
  };
  roiProjections: {
    currentState: {
      annualCost: number;
      teamSize: number;
      costPerConversation: number;
    };
    futureState: {
      year1TotalCost: number;
      year1Savings: number;
      paybackMonths: number;
      threeYearRoi: number;
    };
  };
}

// Re-export analysis types from the dedicated file
export * from "./analysis";

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  limit: number;
  offset: number;
}
