import { useState, useCallback } from "react";
import { DiscoveryResponse } from "@/types/analysis";

export interface DiscoveryFormData {
  // Section 1: The Basics
  companyName: string;
  contactName: string;
  contactEmail: string;
  contactRole: string;
  companySize: string;
  industry: string;

  // Section 2: Pain Points (NEW - structured as JSON)
  painPoints: Array<{
    department: string;
    description: string;
    frequency: string;
    cost: string;
  }>;

  // Section 3: Common Questions (NEW - structured as JSON)
  commonQuestions: string[];

  // Section 4: Real Conversations (NEW - structured as JSON)
  realConversations: Array<{
    trigger: string;
    conversation: string;
    outcome: string;
    duration: string;
  }>;

  // Section 5: Volume & Staffing (REVISED - structured as JSON)
  volumeMetrics: {
    phone: string;
    email: string;
    chat: string;
    forms: string;
    social: string;
    inPerson: string;
    other: string;
  };
  staffingInfo: {
    numPeople: string;
    percentRepetitive: number;
    avgResponseTime: string;
    avgCostPerEmployee: string;
  };

  // Section 6: Channels (REVISED)
  currentChannels: string[];
  desiredChannels: string[];

  // Section 7: Salesforce Environment (REVISED)
  usesSalesforce: string;
  salesforceProducts: string[];
  salesforceEdition: string;
  existingAutomation: string[];
  dataLocations: string[];
  teamSkillLevel: string;

  // Section 8: Current Workflows (NEW - structured as JSON)
  currentWorkflow: {
    steps: string[];
    systemsTouched: string;
    dataLookedUp: string;
    whatGetsUpdated: string;
  };

  // Section 9: Success Criteria (REVISED)
  topGoals: string[];
  successDescription: string;
  successMetrics: string;

  // Section 10: Budget & Timeline (REVISED)
  timeline: string;
  implementationBudget: string;
  monthlyBudget: string;

  // Section 11: Special Requirements (REVISED)
  technicalRequirements: string;
  concerns: string[];

  // Section 12: Final Details
  additionalContext: string;
  referralSource: string;
  wantsConsultation: string;
}

const initialFormData: DiscoveryFormData = {
  // Section 1: The Basics
  companyName: "",
  contactName: "",
  contactEmail: "",
  contactRole: "",
  companySize: "",
  industry: "",

  // Section 2: Pain Points
  painPoints: [
    { department: "", description: "", frequency: "", cost: "" },
    { department: "", description: "", frequency: "", cost: "" },
    { department: "", description: "", frequency: "", cost: "" },
  ],

  // Section 3: Common Questions
  commonQuestions: ["", "", "", "", ""],

  // Section 4: Real Conversations
  realConversations: [
    { trigger: "", conversation: "", outcome: "", duration: "" },
  ],

  // Section 5: Volume & Staffing
  volumeMetrics: {
    phone: "",
    email: "",
    chat: "",
    forms: "",
    social: "",
    inPerson: "",
    other: "",
  },
  staffingInfo: {
    numPeople: "",
    percentRepetitive: 50,
    avgResponseTime: "",
    avgCostPerEmployee: "",
  },

  // Section 6: Channels
  currentChannels: [],
  desiredChannels: [],

  // Section 7: Salesforce Environment
  usesSalesforce: "",
  salesforceProducts: [],
  salesforceEdition: "",
  existingAutomation: [],
  dataLocations: [],
  teamSkillLevel: "",

  // Section 8: Current Workflows
  currentWorkflow: {
    steps: ["", "", "", "", ""],
    systemsTouched: "",
    dataLookedUp: "",
    whatGetsUpdated: "",
  },

  // Section 9: Success Criteria
  topGoals: [],
  successDescription: "",
  successMetrics: "",

  // Section 10: Budget & Timeline
  timeline: "",
  implementationBudget: "",
  monthlyBudget: "",

  // Section 11: Special Requirements
  technicalRequirements: "",
  concerns: [],

  // Section 12: Final Details
  additionalContext: "",
  referralSource: "",
  wantsConsultation: "",
};

export function useDiscoveryForm() {
  const [formData, setFormData] = useState<DiscoveryFormData>(initialFormData);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const updateField = useCallback(
    (field: keyof DiscoveryFormData, value: any) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setHasUnsavedChanges(true);
    },
    []
  );

  const updateNestedField = useCallback((path: string[], value: any) => {
    setFormData((prev) => {
      const newData = { ...prev };
      let current: any = newData;

      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }

      current[path[path.length - 1]] = value;
      return newData;
    });
    setHasUnsavedChanges(true);
  }, []);

  // Helper functions for dynamic form elements
  const addPainPoint = useCallback(() => {
    if (formData.painPoints.length < 5) {
      setFormData((prev) => ({
        ...prev,
        painPoints: [
          ...prev.painPoints,
          { department: "", description: "", frequency: "", cost: "" },
        ],
      }));
      setHasUnsavedChanges(true);
    }
  }, [formData.painPoints.length]);

  const removePainPoint = useCallback(
    (index: number) => {
      if (formData.painPoints.length > 3) {
        setFormData((prev) => ({
          ...prev,
          painPoints: prev.painPoints.filter((_, i) => i !== index),
        }));
        setHasUnsavedChanges(true);
      }
    },
    [formData.painPoints.length]
  );

  const updatePainPoint = useCallback(
    (index: number, field: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        painPoints: prev.painPoints.map((pp, i) =>
          i === index ? { ...pp, [field]: value } : pp
        ),
      }));
      setHasUnsavedChanges(true);
    },
    []
  );

  const addQuestion = useCallback(() => {
    if (formData.commonQuestions.length < 15) {
      setFormData((prev) => ({
        ...prev,
        commonQuestions: [...prev.commonQuestions, ""],
      }));
      setHasUnsavedChanges(true);
    }
  }, [formData.commonQuestions.length]);

  const removeQuestion = useCallback(
    (index: number) => {
      if (formData.commonQuestions.length > 5) {
        setFormData((prev) => ({
          ...prev,
          commonQuestions: prev.commonQuestions.filter((_, i) => i !== index),
        }));
        setHasUnsavedChanges(true);
      }
    },
    [formData.commonQuestions.length]
  );

  const addConversation = useCallback(() => {
    if (formData.realConversations.length < 5) {
      setFormData((prev) => ({
        ...prev,
        realConversations: [
          ...prev.realConversations,
          { trigger: "", conversation: "", outcome: "", duration: "" },
        ],
      }));
      setHasUnsavedChanges(true);
    }
  }, [formData.realConversations.length]);

  const removeConversation = useCallback(
    (index: number) => {
      if (formData.realConversations.length > 1) {
        setFormData((prev) => ({
          ...prev,
          realConversations: prev.realConversations.filter(
            (_, i) => i !== index
          ),
        }));
        setHasUnsavedChanges(true);
      }
    },
    [formData.realConversations.length]
  );

  const updateConversation = useCallback(
    (index: number, field: string, value: string) => {
      setFormData((prev) => ({
        ...prev,
        realConversations: prev.realConversations.map((conv, i) =>
          i === index ? { ...conv, [field]: value } : conv
        ),
      }));
      setHasUnsavedChanges(true);
    },
    []
  );

  const addWorkflowStep = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      currentWorkflow: {
        ...prev.currentWorkflow,
        steps: [...prev.currentWorkflow.steps, ""],
      },
    }));
    setHasUnsavedChanges(true);
  }, []);

  const removeWorkflowStep = useCallback(
    (index: number) => {
      if (formData.currentWorkflow.steps.length > 3) {
        setFormData((prev) => ({
          ...prev,
          currentWorkflow: {
            ...prev.currentWorkflow,
            steps: prev.currentWorkflow.steps.filter((_, i) => i !== index),
          },
        }));
        setHasUnsavedChanges(true);
      }
    },
    [formData.currentWorkflow.steps.length]
  );

  const updateWorkflowStep = useCallback((index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      currentWorkflow: {
        ...prev.currentWorkflow,
        steps: prev.currentWorkflow.steps.map((step, i) =>
          i === index ? value : step
        ),
      },
    }));
    setHasUnsavedChanges(true);
  }, []);

  const calculateTotalVolume = useCallback(() => {
    const metrics = formData.volumeMetrics;
    const total = Object.values(metrics).reduce(
      (sum, val) => sum + (parseInt(val) || 0),
      0
    );
    return {
      daily: total,
      monthly: total * 22,
    };
  }, [formData.volumeMetrics]);

  const loadExistingData = useCallback((data: Partial<DiscoveryResponse>) => {
    setFormData((prev) => ({
      ...prev,
      ...data,
      // Handle JSON fields that might come as strings
      painPoints: data.painPoints || prev.painPoints,
      commonQuestions: data.commonQuestions || prev.commonQuestions,
      realConversations: data.realConversations || prev.realConversations,
      volumeMetrics: data.volumeMetrics || prev.volumeMetrics,
      staffingInfo: data.staffingInfo || prev.staffingInfo,
      currentWorkflow: data.currentWorkflow || prev.currentWorkflow,
    }));
    setHasUnsavedChanges(false);
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setHasUnsavedChanges(false);
  }, []);

  return {
    formData,
    hasUnsavedChanges,
    updateField,
    updateNestedField,
    addPainPoint,
    removePainPoint,
    updatePainPoint,
    addQuestion,
    removeQuestion,
    addConversation,
    removeConversation,
    updateConversation,
    addWorkflowStep,
    removeWorkflowStep,
    updateWorkflowStep,
    calculateTotalVolume,
    loadExistingData,
    resetForm,
    setHasUnsavedChanges,
  };
}
