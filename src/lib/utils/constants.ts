// App constants
export const APP_CONFIG = {
  name: "StradexAI Agentforce Studio",
  version: "1.0.0",
  domain: "studio.stradexai.com",
  description: "Automation platform for Agentforce consultants",
} as const;

export const PROJECT_STATUS_LABELS = {
  DISCOVERY: "Discovery",
  PENDING_REVIEW: "Pending Review",
  PROPOSAL_DRAFT: "Proposal Draft",
  PROPOSAL_SENT: "Proposal Sent",
  CONTRACTED: "Contracted",
  IN_PROGRESS: "In Progress",
  DEPLOYED: "Deployed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
} as const;

export const PROPOSAL_STATUS_LABELS = {
  DRAFT: "Draft",
  READY_TO_SEND: "Ready to Send",
  SENT: "Sent",
  VIEWED: "Viewed",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
} as const;
