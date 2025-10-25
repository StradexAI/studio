"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Edit,
  Save,
  X,
  AlertCircle,
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { DiscoveryResponse, validateDiscoveryResponse } from "@/types/analysis";

interface DiscoveryDataEditorProps {
  projectId: string;
  initialData: DiscoveryResponse;
  onSave: (data: DiscoveryResponse) => Promise<void>;
  onCancel: () => void;
}

export function DiscoveryDataEditor({
  projectId,
  initialData,
  onSave,
  onCancel,
}: DiscoveryDataEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<DiscoveryResponse>(initialData);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      // Validate the data
      const validationErrors = validateDiscoveryResponse(editedData);
      if (validationErrors.length > 0) {
        setError(
          `Validation failed: ${validationErrors.map((e) => e.message).join(", ")}`
        );
        return;
      }

      await onSave(editedData);
      setIsEditing(false);
    } catch (err) {
      console.error("Error saving discovery data:", err);
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedData(initialData);
    setIsEditing(false);
    setError(null);
    onCancel();
  };

  const updateField = (field: keyof DiscoveryResponse, value: string) => {
    setEditedData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const getFieldValue = (field: keyof DiscoveryResponse): string => {
    const value = editedData[field];
    if (Array.isArray(value)) {
      return value.join(", ");
    }
    return (value as string) || "";
  };

  const isFieldRequired = (field: keyof DiscoveryResponse): boolean => {
    const requiredFields: (keyof DiscoveryResponse)[] = [
      "companyName",
      "industry",
      "companySize",
      "painPoints",
      "commonQuestions",
      "realConversations",
      "volumeMetrics",
      "staffingInfo",
      "currentWorkflow",
      "topGoals",
      "successDescription",
      "successMetrics",
      "timeline",
      "implementationBudget",
      "monthlyBudget",
    ];
    return requiredFields.includes(field);
  };

  if (!isEditing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Discovery Data
              </CardTitle>
              <CardDescription>
                Client-provided information used for analysis generation
              </CardDescription>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Data
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium text-gray-600">
                Company
              </Label>
              <p className="text-sm">
                {initialData.companyName || "Not provided"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">
                Industry
              </Label>
              <p className="text-sm">
                {initialData.industry || "Not provided"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">
                Company Size
              </Label>
              <p className="text-sm">
                {initialData.companySize || "Not provided"}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-600">
                Timeline
              </Label>
              <p className="text-sm">
                {initialData.timeline || "Not provided"}
              </p>
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-600">
              Current Processes
            </Label>
            <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
              {getFieldValue("currentWorkflow") || "Not provided"}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-600">
              Pain Points
            </Label>
            <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
              {getFieldValue("painPoints") || "Not provided"}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-600">
              Business Goals
            </Label>
            <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">
              {getFieldValue("topGoals") || "Not provided"}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Edit Discovery Data
            </CardTitle>
            <CardDescription>
              Update client information to improve analysis quality
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-md">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="companyName" className="text-sm font-medium">
              Company Name{" "}
              {isFieldRequired("companyName") && (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <Input
              id="companyName"
              value={getFieldValue("companyName")}
              onChange={(e) => updateField("companyName", e.target.value)}
              placeholder="Enter company name"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="industry" className="text-sm font-medium">
              Industry{" "}
              {isFieldRequired("industry") && (
                <span className="text-red-500">*</span>
              )}
            </Label>
            <Input
              id="industry"
              value={getFieldValue("industry")}
              onChange={(e) => updateField("industry", e.target.value)}
              placeholder="Enter industry"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="companySize" className="text-sm font-medium">
              Company Size
            </Label>
            <Input
              id="companySize"
              value={getFieldValue("companySize")}
              onChange={(e) => updateField("companySize", e.target.value)}
              placeholder="e.g., 10-50 employees"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="timeline" className="text-sm font-medium">
              Timeline
            </Label>
            <Input
              id="timeline"
              value={getFieldValue("timeline")}
              onChange={(e) => updateField("timeline", e.target.value)}
              placeholder="e.g., 3-6 months"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="currentWorkflow" className="text-sm font-medium">
            Current Workflow{" "}
            {isFieldRequired("currentWorkflow") && (
              <span className="text-red-500">*</span>
            )}
          </Label>
          <Textarea
            id="currentWorkflow"
            value={getFieldValue("currentWorkflow")}
            onChange={(e) => updateField("currentWorkflow", e.target.value)}
            placeholder="Describe current business processes..."
            rows={4}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="painPoints" className="text-sm font-medium">
            Pain Points{" "}
            {isFieldRequired("painPoints") && (
              <span className="text-red-500">*</span>
            )}
          </Label>
          <Textarea
            id="painPoints"
            value={getFieldValue("painPoints")}
            onChange={(e) => updateField("painPoints", e.target.value)}
            placeholder="Describe current challenges and pain points..."
            rows={4}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="topGoals" className="text-sm font-medium">
            Top Goals{" "}
            {isFieldRequired("topGoals") && (
              <span className="text-red-500">*</span>
            )}
          </Label>
          <Textarea
            id="topGoals"
            value={getFieldValue("topGoals")}
            onChange={(e) => updateField("topGoals", e.target.value)}
            placeholder="Describe business objectives and goals..."
            rows={4}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="successDescription" className="text-sm font-medium">
            Success Description
          </Label>
          <Textarea
            id="successDescription"
            value={getFieldValue("successDescription")}
            onChange={(e) => updateField("successDescription", e.target.value)}
            placeholder="What outcomes are expected from automation..."
            rows={3}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="salesforceProducts" className="text-sm font-medium">
            Salesforce Products
          </Label>
          <Textarea
            id="salesforceProducts"
            value={getFieldValue("salesforceProducts")}
            onChange={(e) => updateField("salesforceProducts", e.target.value)}
            placeholder="List current systems and tools..."
            rows={3}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="implementationBudget" className="text-sm font-medium">
            Implementation Budget
          </Label>
          <Input
            id="implementationBudget"
            value={getFieldValue("implementationBudget")}
            onChange={(e) =>
              updateField("implementationBudget", e.target.value)
            }
            placeholder="e.g., $50,000 - $100,000"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="additionalContext" className="text-sm font-medium">
            Additional Information
          </Label>
          <Textarea
            id="additionalContext"
            value={getFieldValue("additionalContext")}
            onChange={(e) => updateField("additionalContext", e.target.value)}
            placeholder="Any additional context or requirements..."
            rows={3}
            className="mt-1"
          />
        </div>

        <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <AlertCircle className="h-4 w-4 text-blue-600" />
          <p className="text-sm text-blue-600">
            <strong>Note:</strong> Updating discovery data will mark the
            analysis as needing review. You may want to regenerate the analysis
            with the improved data.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
