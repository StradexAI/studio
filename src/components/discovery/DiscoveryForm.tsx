"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

interface DiscoveryFormProps {
  project: { id: string; clientName: string; status: string } | null;
  token: string;
}

export default function DiscoveryForm({ project, token }: DiscoveryFormProps) {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [formData, setFormData] = useState({
    // Section 1: The Basics
    companyName: "",
    contactName: "",
    contactEmail: "",
    contactRole: "",
    companySize: "",
    industry: "",

    // Section 2: Pain Points (NEW - structured as JSON)
    painPoints: [
      { department: "", description: "", frequency: "", cost: "" },
      { department: "", description: "", frequency: "", cost: "" },
      { department: "", description: "", frequency: "", cost: "" },
    ],

    // Section 3: Common Questions (NEW - structured as JSON)
    commonQuestions: ["", "", "", "", ""],

    // Section 4: Real Conversations (NEW - structured as JSON)
    realConversations: [
      { trigger: "", conversation: "", outcome: "", duration: "" },
    ],

    // Section 5: Volume & Staffing (REVISED - structured as JSON)
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

    // Section 6: Channels (REVISED)
    currentChannels: [] as string[],
    desiredChannels: [] as string[], // NEW - where they want AI agents deployed

    // Section 7: Salesforce Environment (REVISED)
    usesSalesforce: "",
    salesforceProducts: [] as string[],
    salesforceEdition: "", // NEW
    existingAutomation: [] as string[], // NEW
    dataLocations: [] as string[], // Renamed from dataStorageLocations
    teamSkillLevel: "", // NEW

    // Section 8: Current Workflows (NEW - structured as JSON)
    currentWorkflow: {
      steps: ["", "", "", "", ""],
      systemsTouched: "",
      dataLookedUp: "",
      whatGetsUpdated: "",
    },

    // Section 9: Success Criteria (REVISED)
    topGoals: [] as string[], // NEW - top 3 selected goals
    successDescription: "", // NEW - what success looks like in 6 months
    successMetrics: "", // NEW - how they'll measure success

    // Section 10: Budget & Timeline (REVISED)
    timeline: "",
    implementationBudget: "", // NEW
    monthlyBudget: "", // NEW

    // Section 11: Special Requirements (REVISED)
    technicalRequirements: "",
    concerns: [] as string[],

    // Section 12: Final Details
    additionalContext: "",
    referralSource: "",
    wantsConsultation: "",
  });

  const totalSections = 12;

  const loadExistingData = useCallback(async () => {
    try {
      const response = await fetch(`/api/discovery/${token}`);
      const data = await response.json();

      if (data.valid && data.project) {
        // Check if there's existing response data
        const saveResponse = await fetch(`/api/discovery/${token}/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}), // Empty body to get existing data
        });

        if (saveResponse.ok) {
          const saveData = await saveResponse.json();
          if (saveData.discoveryResponse) {
            setFormData((prev) => ({
              ...prev,
              ...saveData.discoveryResponse,
            }));
            setCurrentSection(saveData.discoveryResponse.currentSection || 1);
          }
        }
      }
    } catch (error) {
      console.error("Error loading existing data:", error);
    }
  }, [token]);

  const saveProgress = useCallback(async () => {
    if (!hasUnsavedChanges) return;

    setIsSaving(true);
    try {
      await fetch(`/api/discovery/${token}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          currentSection,
          status: "IN_PROGRESS",
        }),
      });
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error("Error saving progress:", error);
    } finally {
      setIsSaving(false);
    }
  }, [hasUnsavedChanges, token, formData, currentSection]);

  // Load existing data on mount
  useEffect(() => {
    loadExistingData();
  }, [token, loadExistingData]);

  // Auto-save functionality
  useEffect(() => {
    const timer = setInterval(() => {
      if (hasUnsavedChanges) {
        saveProgress();
      }
    }, 30000); // Auto-save every 30 seconds

    return () => clearInterval(timer);
  }, [hasUnsavedChanges, saveProgress]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasUnsavedChanges(true);
  };

  const handleCheckboxChange = (
    field: string,
    value: string,
    checked: boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: checked
        ? [...(prev[field as keyof typeof prev] as string[]), value]
        : (prev[field as keyof typeof prev] as string[]).filter(
            (item) => item !== value
          ),
    }));
    setHasUnsavedChanges(true);
  };

  // Helper functions for dynamic form elements
  const addPainPoint = () => {
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
  };

  const removePainPoint = (index: number) => {
    if (formData.painPoints.length > 3) {
      setFormData((prev) => ({
        ...prev,
        painPoints: prev.painPoints.filter((_, i) => i !== index),
      }));
      setHasUnsavedChanges(true);
    }
  };

  const updatePainPoint = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      painPoints: prev.painPoints.map((pp, i) =>
        i === index ? { ...pp, [field]: value } : pp
      ),
    }));
    setHasUnsavedChanges(true);
  };

  const addQuestion = () => {
    if (formData.commonQuestions.length < 15) {
      setFormData((prev) => ({
        ...prev,
        commonQuestions: [...prev.commonQuestions, ""],
      }));
      setHasUnsavedChanges(true);
    }
  };

  const removeQuestion = (index: number) => {
    if (formData.commonQuestions.length > 5) {
      setFormData((prev) => ({
        ...prev,
        commonQuestions: prev.commonQuestions.filter((_, i) => i !== index),
      }));
      setHasUnsavedChanges(true);
    }
  };

  const addConversation = () => {
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
  };

  const removeConversation = (index: number) => {
    if (formData.realConversations.length > 1) {
      setFormData((prev) => ({
        ...prev,
        realConversations: prev.realConversations.filter((_, i) => i !== index),
      }));
      setHasUnsavedChanges(true);
    }
  };

  const updateConversation = (index: number, field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      realConversations: prev.realConversations.map((conv, i) =>
        i === index ? { ...conv, [field]: value } : conv
      ),
    }));
    setHasUnsavedChanges(true);
  };

  const addWorkflowStep = () => {
    setFormData((prev) => ({
      ...prev,
      currentWorkflow: {
        ...prev.currentWorkflow,
        steps: [...prev.currentWorkflow.steps, ""],
      },
    }));
    setHasUnsavedChanges(true);
  };

  const removeWorkflowStep = (index: number) => {
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
  };

  const updateWorkflowStep = (index: number, value: string) => {
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
  };

  const calculateTotalVolume = () => {
    const metrics = formData.volumeMetrics;
    const total = Object.values(metrics).reduce(
      (sum, val) => sum + (parseInt(val) || 0),
      0
    );
    return {
      daily: total,
      monthly: total * 22,
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/discovery/${token}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status: "COMPLETED",
          completedAt: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        router.push(`/discover/${token}/success`);
      } else {
        console.error("Failed to submit discovery form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextSection = () => {
    if (currentSection < totalSections) {
      setCurrentSection(currentSection + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 1) {
      setCurrentSection(currentSection - 1);
    }
  };

  const getProgressPercentage = () => {
    return Math.round((currentSection / totalSections) * 100);
  };

  const getSectionTitle = (section: number): string => {
    switch (section) {
      case 1:
        return "Company & Contact Information";
      case 2:
        return "Department & Use Case";
      case 3:
        return "Business Objectives";
      case 4:
        return "Current Process";
      case 5:
        return "Technical Context";
      case 6:
        return "Success Criteria & Constraints";
      case 7:
        return "Additional Context";
      default:
        return "";
    }
  };

  const getSectionDescription = (section: number): string => {
    switch (section) {
      case 1:
        return "Let&apos;s start with the basics";
      case 2:
        return "What department will use this agent?";
      case 3:
        return "What are your goals for this agent?";
      case 4:
        return "Tell us about your current process";
      case 5:
        return "Technical setup";
      case 6:
        return "Requirements and constraints";
      case 7:
        return "Almost done! Any other details?";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">
                  Discovery Questionnaire
                </CardTitle>
                <CardDescription className="text-lg">
                  Section {currentSection} of {totalSections}:{" "}
                  {getSectionTitle(currentSection)}
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={saveProgress}
                  disabled={!hasUnsavedChanges || isSaving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Progress"}
                </Button>
                <div className="text-sm text-gray-500">
                  {project?.clientName}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>{getSectionDescription(currentSection)}</span>
                <span>{getProgressPercentage()}% Complete</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${getProgressPercentage()}%` }}
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            {renderSectionContent()}

            <div className="flex justify-between mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevSection}
                disabled={currentSection === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous Section
              </Button>

              {currentSection === totalSections ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                  size="lg"
                >
                  {isSubmitting ? "Submitting..." : "Submit Discovery"}
                </Button>
              ) : (
                <Button onClick={nextSection} size="lg">
                  Next Section
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  function renderSectionContent() {
    switch (currentSection) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">
                Let&apos;s start with the basics
              </h3>
              <p className="text-gray-600">
                We need some basic information to personalize your proposal.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) =>
                    handleInputChange("companyName", e.target.value)
                  }
                  placeholder="Acme Corporation"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactName">Your Full Name *</Label>
                <Input
                  id="contactName"
                  value={formData.contactName}
                  onChange={(e) =>
                    handleInputChange("contactName", e.target.value)
                  }
                  placeholder="Sarah Johnson"
                  required
                />
              </div>

              <div>
                <Label htmlFor="contactEmail">Your Email Address *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    handleInputChange("contactEmail", e.target.value)
                  }
                  placeholder="sarah@acmecorp.com"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  We&apos;ll send your proposal here
                </p>
              </div>

              <div>
                <Label htmlFor="contactRole">Your Role / Title *</Label>
                <Input
                  id="contactRole"
                  value={formData.contactRole}
                  onChange={(e) =>
                    handleInputChange("contactRole", e.target.value)
                  }
                  placeholder="VP of Customer Support"
                  required
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">
                What department will use this agent?
              </h3>
              <p className="text-gray-600">
                Help us understand the primary use case and department.
              </p>
            </div>

            <div>
              <Label htmlFor="primaryDepartment">Primary Department *</Label>
              <select
                id="primaryDepartment"
                value={formData.primaryDepartment}
                onChange={(e) =>
                  handleInputChange("primaryDepartment", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="">Select a department...</option>
                <option value="customer_support">
                  Customer Support / Service
                </option>
                <option value="sales">Sales</option>
                <option value="it_helpdesk">IT / Help Desk</option>
                <option value="hr">HR / People Operations</option>
                <option value="finance">Finance / Accounting</option>
                <option value="marketing">Marketing</option>
                <option value="operations">Operations</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <Label>What do you want your agent to do? *</Label>
              <p className="text-sm text-gray-600 mb-3">
                Select all that apply
              </p>
              <div className="space-y-3">
                {getUseCaseOptions(formData.primaryDepartment).map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3"
                  >
                    <Checkbox
                      id={option.value}
                      checked={formData.useCases.includes(option.value)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "useCases",
                          option.value,
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="visionDescription">
                Briefly describe what you envision *
              </Label>
              <Textarea
                id="visionDescription"
                value={formData.visionDescription}
                onChange={(e) =>
                  handleInputChange("visionDescription", e.target.value)
                }
                placeholder="I want an agent that can help customers track their orders and process returns without waiting for a human agent. It should be available 24/7 and handle at least 80% of these inquiries automatically."
                rows={4}
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                What&apos;s the main problem you&apos;re trying to solve? What
                should the agent accomplish?
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {formData.visionDescription.length} / 500 characters
              </p>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">
                What are your goals for this agent?
              </h3>
              <p className="text-gray-600">
                Understanding your objectives helps us prioritize the right
                features.
              </p>
            </div>

            <div>
              <Label>What&apos;s your primary business objective? *</Label>
              <div className="space-y-3 mt-3">
                {[
                  { value: "reduce_costs", label: "Reduce support costs" },
                  {
                    value: "improve_response_times",
                    label: "Improve response times",
                  },
                  {
                    value: "increase_satisfaction",
                    label: "Increase customer satisfaction",
                  },
                  {
                    value: "scale_without_hiring",
                    label: "Scale without hiring",
                  },
                  { value: "provide_24_7", label: "Provide 24/7 availability" },
                  { value: "reduce_workload", label: "Reduce agent workload" },
                  {
                    value: "improve_consistency",
                    label: "Improve consistency",
                  },
                  { value: "other", label: "Other" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="radio"
                      id={option.value}
                      name="primaryObjective"
                      value={option.value}
                      checked={formData.primaryObjective === option.value}
                      onChange={(e) =>
                        handleInputChange("primaryObjective", e.target.value)
                      }
                      className="h-4 w-4 text-blue-600"
                    />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>What&apos;s your target for automation?</Label>
              <div className="space-y-3 mt-3">
                {[
                  {
                    value: "50_70",
                    label: "Handle 50-70% of inquiries automatically",
                  },
                  {
                    value: "70_85",
                    label: "Handle 70-85% of inquiries automatically",
                  },
                  {
                    value: "85_plus",
                    label: "Handle 85%+ of inquiries automatically",
                  },
                  { value: "not_sure", label: "Not sure yet" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="radio"
                      id={option.value}
                      name="automationTarget"
                      value={option.value}
                      checked={formData.automationTarget === option.value}
                      onChange={(e) =>
                        handleInputChange("automationTarget", e.target.value)
                      }
                      className="h-4 w-4 text-blue-600"
                    />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                What percentage of inquiries do you want the agent to resolve
                without human intervention?
              </p>
            </div>

            <div>
              <Label htmlFor="successDefinition">
                What success looks like to you *
              </Label>
              <Textarea
                id="successDefinition"
                value={formData.successDefinition}
                onChange={(e) =>
                  handleInputChange("successDefinition", e.target.value)
                }
                placeholder="Success means reducing our average response time from 4 hours to under 5 minutes while maintaining a 4.5+ customer satisfaction score."
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="currentMetrics">
                Are there any specific metrics you track today?
              </Label>
              <Textarea
                id="currentMetrics"
                value={formData.currentMetrics}
                onChange={(e) =>
                  handleInputChange("currentMetrics", e.target.value)
                }
                placeholder="We currently track average handle time (8.5 min), CSAT (4.2/5), resolution rate (78%), and cost per conversation ($12)"
                rows={3}
              />
              <p className="text-sm text-gray-500 mt-1">
                This helps us show ROI. Examples: CSAT score, handle time, cost
                per conversation, resolution rate
              </p>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">
                Tell us about your current process
              </h3>
              <p className="text-gray-600">
                Understanding your current workflow helps us identify
                optimization opportunities.
              </p>
            </div>

            <div>
              <Label>How do customers currently reach you? *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                {[
                  { value: "phone", label: "Phone" },
                  { value: "email", label: "Email" },
                  { value: "live_chat", label: "Live chat on website" },
                  { value: "salesforce_chat", label: "Salesforce chat" },
                  { value: "mobile_app", label: "Mobile app" },
                  { value: "social_media", label: "Social media" },
                  { value: "in_person", label: "In-person" },
                  { value: "other", label: "Other" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={option.value}
                      checked={formData.currentChannels.includes(option.value)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "currentChannels",
                          option.value,
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor={option.value} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>What&apos;s your current volume?</Label>
              <div className="space-y-3 mt-3">
                {[
                  {
                    value: "less_100",
                    label: "Less than 100 conversations/month",
                  },
                  { value: "100_500", label: "100-500 conversations/month" },
                  { value: "500_2000", label: "500-2,000 conversations/month" },
                  {
                    value: "2000_10000",
                    label: "2,000-10,000 conversations/month",
                  },
                  { value: "10000_plus", label: "10,000+ conversations/month" },
                  { value: "not_sure", label: "Not sure" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="radio"
                      id={option.value}
                      name="monthlyVolume"
                      value={option.value}
                      checked={formData.monthlyVolume === option.value}
                      onChange={(e) =>
                        handleInputChange("monthlyVolume", e.target.value)
                      }
                      className="h-4 w-4 text-blue-600"
                    />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Approximate monthly conversation volume across all channels
              </p>
            </div>

            <div>
              <Label htmlFor="painPoints">
                What are the biggest pain points today? *
              </Label>
              <Textarea
                id="painPoints"
                value={formData.painPoints}
                onChange={(e) =>
                  handleInputChange("painPoints", e.target.value)
                }
                placeholder="Our customers wait an average of 4 hours for a response to simple questions like 'Where's my order?' Our team spends 60% of their time on repetitive inquiries that could be automated."
                rows={4}
                required
              />
            </div>

            <div>
              <Label htmlFor="commonQuestions">
                What questions or requests are most common?
              </Label>
              <Textarea
                id="commonQuestions"
                value={formData.commonQuestions}
                onChange={(e) =>
                  handleInputChange("commonQuestions", e.target.value)
                }
                placeholder="1. Order status/tracking (40%)\n2. Return/refund requests (25%)\n3. Shipping information (15%)\n4. Product availability (10%)\n5. Account questions (10%)"
                rows={4}
              />
              <p className="text-sm text-gray-500 mt-1">
                List the top 5-10 most frequent customer inquiries. This helps
                us prioritize what the agent handles first.
              </p>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">Technical setup</h3>
              <p className="text-gray-600">
                We need to understand your technical environment for seamless
                integration.
              </p>
            </div>

            <div>
              <Label>Do you currently use Salesforce? *</Label>
              <div className="space-y-3 mt-3">
                {[
                  { value: "yes", label: "Yes, we use Salesforce" },
                  {
                    value: "planning",
                    label: "No, but we&apos;re planning to",
                  },
                  { value: "no", label: "No, and no current plans" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="radio"
                      id={option.value}
                      name="usesSalesforce"
                      value={option.value}
                      checked={formData.usesSalesforce === option.value}
                      onChange={(e) =>
                        handleInputChange("usesSalesforce", e.target.value)
                      }
                      className="h-4 w-4 text-blue-600"
                    />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {formData.usesSalesforce === "yes" && (
              <div>
                <Label>Which Salesforce products do you use?</Label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                  {[
                    { value: "sales_cloud", label: "Sales Cloud" },
                    { value: "service_cloud", label: "Service Cloud" },
                    { value: "marketing_cloud", label: "Marketing Cloud" },
                    { value: "commerce_cloud", label: "Commerce Cloud" },
                    { value: "experience_cloud", label: "Experience Cloud" },
                    { value: "not_sure", label: "Not sure" },
                  ].map((option) => (
                    <div
                      key={option.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={option.value}
                        checked={formData.salesforceProducts.includes(
                          option.value
                        )}
                        onCheckedChange={(checked) =>
                          handleCheckboxChange(
                            "salesforceProducts",
                            option.value,
                            checked as boolean
                          )
                        }
                      />
                      <Label htmlFor={option.value} className="text-sm">
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label>Where is your customer data stored? *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                {[
                  { value: "salesforce", label: "Salesforce" },
                  { value: "dedicated_crm", label: "Dedicated CRM" },
                  { value: "ecommerce", label: "E-commerce platform" },
                  { value: "database", label: "Database" },
                  { value: "spreadsheets", label: "Spreadsheets" },
                  { value: "multiple", label: "Multiple systems" },
                  { value: "other", label: "Other" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={option.value}
                      checked={formData.dataStorageLocations.includes(
                        option.value
                      )}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "dataStorageLocations",
                          option.value,
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor={option.value} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="systemsToIntegrate">
                What systems need to be integrated?
              </Label>
              <Textarea
                id="systemsToIntegrate"
                value={formData.systemsToIntegrate}
                onChange={(e) =>
                  handleInputChange("systemsToIntegrate", e.target.value)
                }
                placeholder="Our order data is in Salesforce, shipping info comes from ShipStation API, and customer accounts are in our custom database."
                rows={3}
              />
              <p className="text-sm text-gray-500 mt-1">
                What systems does the agent need to access to answer questions?
                (e.g., order management, inventory, CRM, knowledge base)
              </p>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">
                Requirements and constraints
              </h3>
              <p className="text-gray-600">
                Help us understand your timeline, budget, and any specific
                requirements.
              </p>
            </div>

            <div>
              <Label>What&apos;s your target launch date?</Label>
              <div className="space-y-3 mt-3">
                {[
                  { value: "asap", label: "As soon as possible" },
                  { value: "1_month", label: "Within 1 month" },
                  { value: "2_3_months", label: "Within 2-3 months" },
                  { value: "3_6_months", label: "Within 3-6 months" },
                  { value: "flexible", label: "Flexible / exploring options" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="radio"
                      id={option.value}
                      name="targetLaunchDate"
                      value={option.value}
                      checked={formData.targetLaunchDate === option.value}
                      onChange={(e) =>
                        handleInputChange("targetLaunchDate", e.target.value)
                      }
                      className="h-4 w-4 text-blue-600"
                    />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                This helps us prioritize your project
              </p>
            </div>

            <div>
              <Label>What&apos;s your budget range for this project?</Label>
              <div className="space-y-3 mt-3">
                {[
                  { value: "under_10k", label: "Under $10,000" },
                  { value: "10k_25k", label: "$10,000 - $25,000" },
                  { value: "25k_50k", label: "$25,000 - $50,000" },
                  { value: "50k_100k", label: "$50,000 - $100,000" },
                  { value: "100k_plus", label: "$100,000+" },
                  { value: "need_help", label: "Need help determining budget" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="radio"
                      id={option.value}
                      name="budgetRange"
                      value={option.value}
                      checked={formData.budgetRange === option.value}
                      onChange={(e) =>
                        handleInputChange("budgetRange", e.target.value)
                      }
                      className="h-4 w-4 text-blue-600"
                    />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-1">
                This helps us right-size the solution. We offer options at
                different price points.
              </p>
            </div>

            <div>
              <Label htmlFor="requirements">
                Are there any specific requirements or constraints?
              </Label>
              <Textarea
                id="requirements"
                value={formData.requirements}
                onChange={(e) =>
                  handleInputChange("requirements", e.target.value)
                }
                placeholder="Agent must support Spanish language, comply with HIPAA, maintain 95% uptime SLA, handle PCI-compliant transactions"
                rows={4}
              />
              <p className="text-sm text-gray-500 mt-1">
                Examples: compliance requirements, languages, security needs,
                specific integrations, brand voice requirements
              </p>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold mb-2">
                Almost done! Any other details?
              </h3>
              <p className="text-gray-600">
                Any final thoughts or concerns we should know about?
              </p>
            </div>

            <div>
              <Label>
                What concerns do you have about implementing an AI agent?
              </Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
                {[
                  { value: "cost", label: "Cost" },
                  {
                    value: "technical_complexity",
                    label: "Technical complexity",
                  },
                  { value: "integration", label: "Integration challenges" },
                  {
                    value: "customer_acceptance",
                    label: "Customer acceptance",
                  },
                  { value: "accuracy", label: "Agent accuracy/quality" },
                  { value: "control", label: "Maintaining control" },
                  { value: "security", label: "Security and compliance" },
                  { value: "change_management", label: "Change management" },
                  { value: "no_concerns", label: "No concerns" },
                  { value: "other", label: "Other" },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <Checkbox
                      id={option.value}
                      checked={formData.concerns.includes(option.value)}
                      onCheckedChange={(checked) =>
                        handleCheckboxChange(
                          "concerns",
                          option.value,
                          checked as boolean
                        )
                      }
                    />
                    <Label htmlFor={option.value} className="text-sm">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="referralSource">How did you hear about us?</Label>
              <select
                id="referralSource"
                value={formData.referralSource}
                onChange={(e) =>
                  handleInputChange("referralSource", e.target.value)
                }
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select an option...</option>
                <option value="appexchange">Salesforce AppExchange</option>
                <option value="web_search">Web search (Google, etc.)</option>
                <option value="referral">Referral</option>
                <option value="social_media">Social media</option>
                <option value="conference">Conference/event</option>
                <option value="sales_outreach">Sales outreach</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="additionalContext">
                Anything else we should know?
              </Label>
              <Textarea
                id="additionalContext"
                value={formData.additionalContext}
                onChange={(e) =>
                  handleInputChange("additionalContext", e.target.value)
                }
                placeholder="Any additional context, specific features you need, or questions you have about the process."
                rows={4}
              />
            </div>

            <div>
              <Label>Would you like a live consultation? *</Label>
              <div className="space-y-3 mt-3">
                {[
                  { value: "yes", label: "Yes, schedule a call with me" },
                  { value: "no", label: "No, just send the proposal" },
                  {
                    value: "maybe",
                    label:
                      "Maybe, I&apos;ll decide after reviewing the proposal",
                  },
                ].map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="radio"
                      id={option.value}
                      name="wantsConsultation"
                      value={option.value}
                      checked={formData.wantsConsultation === option.value}
                      onChange={(e) =>
                        handleInputChange("wantsConsultation", e.target.value)
                      }
                      className="h-4 w-4 text-blue-600"
                      required
                    />
                    <Label htmlFor={option.value}>{option.label}</Label>
                  </div>
                ))}
              </div>
            </div>

            {formData.wantsConsultation === "yes" && (
              <div>
                <Label htmlFor="bestTimeToReach">Best time to reach you?</Label>
                <Textarea
                  id="bestTimeToReach"
                  value={formData.bestTimeToReach}
                  onChange={(e) =>
                    handleInputChange("bestTimeToReach", e.target.value)
                  }
                  placeholder="Weekdays 2-4 PM EST"
                  rows={2}
                />
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  }

  function getUseCaseOptions(department: string) {
    switch (department) {
      case "customer_support":
        return [
          {
            value: "answer_questions",
            label: "Answer common customer questions",
          },
          { value: "order_status", label: "Look up order status" },
          { value: "returns_refunds", label: "Process returns and refunds" },
          { value: "billing_inquiries", label: "Handle billing inquiries" },
          { value: "troubleshoot", label: "Troubleshoot technical issues" },
          { value: "schedule_appointments", label: "Schedule appointments" },
          { value: "escalate", label: "Escalate to human agents" },
          { value: "other", label: "Other (please specify)" },
        ];
      case "sales":
        return [
          { value: "qualify_leads", label: "Qualify leads" },
          { value: "product_questions", label: "Answer product questions" },
          { value: "pricing_info", label: "Provide pricing information" },
          { value: "schedule_demos", label: "Schedule demos" },
          { value: "process_quotes", label: "Process quotes" },
          { value: "track_opportunities", label: "Track opportunities" },
          { value: "nurture_leads", label: "Nurture leads" },
          { value: "other", label: "Other (please specify)" },
        ];
      case "it_helpdesk":
        return [
          { value: "reset_passwords", label: "Reset passwords" },
          { value: "it_questions", label: "Answer IT questions" },
          { value: "create_tickets", label: "Create support tickets" },
          { value: "track_tickets", label: "Track ticket status" },
          { value: "troubleshoot_issues", label: "Troubleshoot common issues" },
          { value: "access_requests", label: "Manage access requests" },
          { value: "system_status", label: "Provide system status" },
          { value: "other", label: "Other (please specify)" },
        ];
      case "hr":
        return [
          { value: "policy_questions", label: "Answer policy questions" },
          { value: "time_off", label: "Handle time-off requests" },
          { value: "benefits_info", label: "Provide benefits information" },
          { value: "onboard_employees", label: "Onboard new employees" },
          { value: "payroll_questions", label: "Answer payroll questions" },
          { value: "schedule_interviews", label: "Schedule interviews" },
          { value: "employee_records", label: "Manage employee records" },
          { value: "other", label: "Other (please specify)" },
        ];
      default:
        return [
          {
            value: "custom_description",
            label: "Custom use case (describe below)",
          },
        ];
    }
  }
}
