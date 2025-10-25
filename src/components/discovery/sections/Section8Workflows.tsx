"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { DiscoveryFormData } from "@/hooks/useDiscoveryForm";

interface Section8WorkflowsProps {
  formData: DiscoveryFormData;
  addWorkflowStep: () => void;
  removeWorkflowStep: (index: number) => void;
  updateWorkflowStep: (index: number, value: string) => void;
  updateNestedField: (path: string[], value: any) => void;
}

export default function Section8Workflows({
  formData,
  addWorkflowStep,
  removeWorkflowStep,
  updateWorkflowStep,
  updateNestedField,
}: Section8WorkflowsProps) {
  const [selectedPainPoint, setSelectedPainPoint] = useState(0);

  const updateWorkflowField = (field: string, value: string) => {
    updateNestedField(["currentWorkflow", field], value);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Walk us through how things work today
        </h3>
        <p className="text-blue-800 text-sm">
          Pick your biggest pain point and describe the current process
          step-by-step. We'll identify automation opportunities.
        </p>
      </div>

      {/* Pain Point Selector */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">
          Pick your biggest pain point from Section 2
        </h4>
        <div className="flex gap-2 flex-wrap">
          {formData.painPoints.map((painPoint, index) => (
            <Button
              key={index}
              variant={selectedPainPoint === index ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedPainPoint(index)}
              className="text-sm"
            >
              Pain Point {index + 1}
            </Button>
          ))}
        </div>

        {formData.painPoints[selectedPainPoint] && (
          <div className="mt-4 p-3 bg-gray-50 rounded">
            <p className="text-sm">
              <strong>Selected:</strong>{" "}
              {formData.painPoints[selectedPainPoint].description}
            </p>
          </div>
        )}
      </div>

      {/* Workflow Steps */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">
          Step-by-step, what happens today?
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          (We'll identify automation opportunities)
        </p>

        <div className="space-y-3">
          {formData.currentWorkflow.steps.map((step, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600">
                {index + 1}
              </div>
              <Input
                value={step}
                onChange={(e) => updateWorkflowStep(index, e.target.value)}
                placeholder={`Step ${index + 1}: ${index === 0 ? "Customer sends email to support@company.com" : "What happens next?"}`}
                className="flex-1"
              />
              {formData.currentWorkflow.steps.length > 3 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => removeWorkflowStep(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}

          <Button
            variant="outline"
            onClick={addWorkflowStep}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Another Step
          </Button>
        </div>
      </div>

      {/* Additional Workflow Information */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">Additional Process Details</h4>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>What systems are touched?</Label>
            <Textarea
              value={formData.currentWorkflow.systemsTouched}
              onChange={(e) =>
                updateWorkflowField("systemsTouched", e.target.value)
              }
              placeholder="e.g., Email, Salesforce, ShipStation API, carrier websites"
              rows={2}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>What data is looked up?</Label>
            <Textarea
              value={formData.currentWorkflow.dataLookedUp}
              onChange={(e) =>
                updateWorkflowField("dataLookedUp", e.target.value)
              }
              placeholder="e.g., Order number, customer account, shipping carrier, tracking number"
              rows={2}
              className="w-full"
            />
          </div>

          <div className="space-y-2">
            <Label>What gets updated?</Label>
            <Textarea
              value={formData.currentWorkflow.whatGetsUpdated}
              onChange={(e) =>
                updateWorkflowField("whatGetsUpdated", e.target.value)
              }
              placeholder="e.g., Case status in Salesforce, last contact date"
              rows={2}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>
          <strong>Why this works:</strong> Claude determines:
        </p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>
            What Actions agent needs (update records, call APIs, query data)
          </li>
          <li>What Flows are needed (data lookups, updates, routing)</li>
          <li>Integration requirements</li>
          <li>Complexity level</li>
        </ul>
      </div>
    </div>
  );
}
