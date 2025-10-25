"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DiscoveryFormData } from "@/hooks/useDiscoveryForm";

interface Section11RequirementsProps {
  formData: DiscoveryFormData;
  updateField: (field: keyof DiscoveryFormData, value: any) => void;
}

const concernOptions = [
  "Cost",
  "Technical complexity",
  "Customer acceptance",
  "Agent accuracy/quality",
  "Integration challenges",
  "Maintaining control",
  "Security/compliance",
  "Change management",
  "No concerns",
];

export default function Section11Requirements({
  formData,
  updateField,
}: Section11RequirementsProps) {
  const handleConcernChange = (concern: string, checked: boolean) => {
    const newConcerns = checked
      ? [...formData.concerns, concern]
      : formData.concerns.filter((c) => c !== concern);
    updateField("concerns", newConcerns);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Special Requirements
        </h3>
        <p className="text-blue-800 text-sm">
          Understanding your technical requirements and concerns helps us
          address potential challenges upfront.
        </p>
      </div>

      {/* Technical Requirements */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">
          Any technical requirements or constraints?
        </h4>
        <Textarea
          value={formData.technicalRequirements}
          onChange={(e) => updateField("technicalRequirements", e.target.value)}
          placeholder={`Examples:
- Must support Spanish language
- Need HIPAA compliance
- Must integrate with custom billing system
- Require 99.9% uptime SLA
- Must work with legacy system`}
          rows={5}
          className="w-full"
        />
      </div>

      {/* Concerns */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">Any concerns about AI agents?</h4>
        <p className="text-sm text-gray-600 mb-4">Check all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {concernOptions.map((concern) => (
            <div key={concern} className="flex items-center space-x-2">
              <Checkbox
                id={`concern-${concern}`}
                checked={formData.concerns.includes(concern)}
                onCheckedChange={(checked) =>
                  handleConcernChange(concern, checked as boolean)
                }
              />
              <Label htmlFor={`concern-${concern}`} className="text-sm">
                {concern}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements Summary */}
      {(formData.technicalRequirements || formData.concerns.length > 0) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Requirements Summary</h4>
          <div className="space-y-2 text-sm">
            {formData.technicalRequirements && (
              <div>
                <strong>Technical Requirements:</strong>{" "}
                {formData.technicalRequirements}
              </div>
            )}
            {formData.concerns.length > 0 && (
              <div>
                <strong>Concerns:</strong> {formData.concerns.join(", ")}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600">
        <p>
          <strong>Why this works:</strong> Helps us address potential challenges
          upfront and create tailored solutions
        </p>
      </div>
    </div>
  );
}
