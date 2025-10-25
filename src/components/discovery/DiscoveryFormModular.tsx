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
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useDiscoveryForm } from "@/hooks/useDiscoveryForm";
import { DiscoveryResponse } from "@/types/analysis";

// Import section components
import Section1Basics from "./sections/Section1Basics";
import Section2PainPoints from "./sections/Section2PainPoints";
import Section3CommonQuestions from "./sections/Section3CommonQuestions";
import Section4RealConversations from "./sections/Section4RealConversations";
import Section5VolumeStaffing from "./sections/Section5VolumeStaffing";
import Section6Channels from "./sections/Section6Channels";
import Section7Salesforce from "./sections/Section7Salesforce";
import Section8Workflows from "./sections/Section8Workflows";
import Section9SuccessCriteria from "./sections/Section9SuccessCriteria";
import Section10BudgetTimeline from "./sections/Section10BudgetTimeline";
import Section11Requirements from "./sections/Section11Requirements";
import Section12FinalDetails from "./sections/Section12FinalDetails";

interface DiscoveryFormProps {
  project: { id: string; clientName: string; status: string } | null;
  token: string;
}

export default function DiscoveryForm({ project, token }: DiscoveryFormProps) {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
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
  } = useDiscoveryForm();

  const totalSections = 12;

  const getSectionTitle = (section: number): string => {
    switch (section) {
      case 1:
        return "The Basics";
      case 2:
        return "Where Are You Struggling?";
      case 3:
        return "What Do Your Customers Ask About?";
      case 4:
        return "Show Us Real Conversations";
      case 5:
        return "Your Current Situation";
      case 6:
        return "Where Do Customers Reach You?";
      case 7:
        return "Your Salesforce Environment";
      case 8:
        return "Current Process Workflows";
      case 9:
        return "What Does Success Look Like?";
      case 10:
        return "Budget & Timeline";
      case 11:
        return "Special Requirements";
      case 12:
        return "Almost Done!";
      default:
        return "";
    }
  };

  const getSectionDescription = (section: number): string => {
    switch (section) {
      case 1:
        return "Let's start with the basics";
      case 2:
        return "Help us understand your biggest operational challenges";
      case 3:
        return "Understanding common questions helps us build smarter agents";
      case 4:
        return "Real examples help us understand your unique needs";
      case 5:
        return "Help us understand your volume and staffing";
      case 6:
        return "Current channels and where you'd like AI agents deployed";
      case 7:
        return "Understanding your setup helps us plan implementation";
      case 8:
        return "Walk us through how things work today";
      case 9:
        return "What are your goals and how will you measure success?";
      case 10:
        return "Timeline and budget preferences";
      case 11:
        return "Any technical requirements or constraints?";
      case 12:
        return "Anything else we should know?";
      default:
        return "";
    }
  };

  const getProgressPercentage = (): number => {
    return Math.round((currentSection / totalSections) * 100);
  };

  const saveProgress = useCallback(async () => {
    if (!hasUnsavedChanges) return;

    try {
      setIsSaving(true);
      const response = await fetch(`/api/discovery/${token}/save`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          currentSection,
        }),
      });

      if (response.ok) {
        setHasUnsavedChanges(false);
      } else {
        console.error("Failed to save progress");
      }
    } catch (error) {
      console.error("Error saving progress:", error);
    } finally {
      setIsSaving(false);
    }
  }, [
    hasUnsavedChanges,
    token,
    formData,
    currentSection,
    setHasUnsavedChanges,
  ]);

  // Load existing data on mount
  useEffect(() => {
    const fetchExistingData = async () => {
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
              loadExistingData(saveData.discoveryResponse);
              setCurrentSection(saveData.discoveryResponse.currentSection || 1);
            }
          }
        }
      } catch (error) {
        console.error("Error loading existing data:", error);
      }
    };

    fetchExistingData();
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
          currentSection,
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

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return <Section1Basics formData={formData} updateField={updateField} />;
      case 2:
        return (
          <Section2PainPoints
            formData={formData}
            addPainPoint={addPainPoint}
            removePainPoint={removePainPoint}
            updatePainPoint={updatePainPoint}
          />
        );
      case 3:
        return (
          <Section3CommonQuestions
            formData={formData}
            addQuestion={addQuestion}
            removeQuestion={removeQuestion}
            updateField={updateField}
          />
        );
      case 4:
        return (
          <Section4RealConversations
            formData={formData}
            addConversation={addConversation}
            removeConversation={removeConversation}
            updateConversation={updateConversation}
          />
        );
      case 5:
        return (
          <Section5VolumeStaffing
            formData={formData}
            updateField={updateField}
            updateNestedField={updateNestedField}
            calculateTotalVolume={calculateTotalVolume}
          />
        );
      case 6:
        return (
          <Section6Channels formData={formData} updateField={updateField} />
        );
      case 7:
        return (
          <Section7Salesforce
            formData={formData}
            updateField={updateField}
            updateNestedField={updateNestedField}
          />
        );
      case 8:
        return (
          <Section8Workflows
            formData={formData}
            addWorkflowStep={addWorkflowStep}
            removeWorkflowStep={removeWorkflowStep}
            updateWorkflowStep={updateWorkflowStep}
            updateNestedField={updateNestedField}
          />
        );
      case 9:
        return (
          <Section9SuccessCriteria
            formData={formData}
            updateField={updateField}
          />
        );
      case 10:
        return (
          <Section10BudgetTimeline
            formData={formData}
            updateField={updateField}
          />
        );
      case 11:
        return (
          <Section11Requirements
            formData={formData}
            updateField={updateField}
          />
        );
      case 12:
        return (
          <Section12FinalDetails
            formData={formData}
            updateField={updateField}
          />
        );
      default:
        return <div>Section {currentSection} - Coming Soon</div>;
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
            {renderSection()}

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t">
              <Button
                variant="outline"
                onClick={prevSection}
                disabled={currentSection === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <div className="flex gap-2">
                {currentSection === totalSections ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Discovery"}
                  </Button>
                ) : (
                  <Button onClick={nextSection}>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
