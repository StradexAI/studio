"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DiscoveryFormData } from "@/hooks/useDiscoveryForm";

interface Section9SuccessCriteriaProps {
  formData: DiscoveryFormData;
  updateField: (field: keyof DiscoveryFormData, value: any) => void;
}

const goalOptions = [
  "Reduce staffing costs",
  "Improve response times",
  "Scale without hiring",
  "Increase customer satisfaction",
  "Provide 24/7 availability",
  "Handle seasonal spikes",
  "Reduce human agent workload",
  "Improve consistency",
  "Other",
];

export default function Section9SuccessCriteria({
  formData,
  updateField,
}: Section9SuccessCriteriaProps) {
  const handleGoalChange = (goal: string, checked: boolean) => {
    if (checked) {
      // Only allow 3 goals maximum
      if (formData.topGoals.length < 3) {
        updateField("topGoals", [...formData.topGoals, goal]);
      }
    } else {
      updateField(
        "topGoals",
        formData.topGoals.filter((g) => g !== goal)
      );
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          What does success look like?
        </h3>
        <p className="text-blue-800 text-sm">
          Understanding your goals and success metrics helps Claude understand
          business priorities, calculate ROI, and set success metrics.
        </p>
      </div>

      {/* Goals Selection */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">What are your goals?</h4>
        <p className="text-sm text-gray-600 mb-4">
          Select your top 3 (required)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {goalOptions.map((goal) => (
            <div key={goal} className="flex items-center space-x-2">
              <Checkbox
                id={`goal-${goal}`}
                checked={formData.topGoals.includes(goal)}
                onCheckedChange={(checked) =>
                  handleGoalChange(goal, checked as boolean)
                }
                disabled={
                  !formData.topGoals.includes(goal) &&
                  formData.topGoals.length >= 3
                }
              />
              <Label htmlFor={`goal-${goal}`} className="text-sm">
                {goal}
              </Label>
            </div>
          ))}
        </div>

        {formData.topGoals.includes("Other") && (
          <div className="mt-4">
            <Label htmlFor="other-goal">Please specify:</Label>
            <input
              id="other-goal"
              type="text"
              placeholder="Describe your other goal..."
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div className="mt-4 text-sm text-gray-600">
          <strong>Selected:</strong>{" "}
          {formData.topGoals.length > 0
            ? formData.topGoals.join(", ")
            : "None selected"}
          ({formData.topGoals.length}/3)
        </div>
      </div>

      {/* Success Description */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">
          What would make this project successful?
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Describe what success looks like in 6 months
        </p>
        <Textarea
          value={formData.successDescription}
          onChange={(e) => updateField("successDescription", e.target.value)}
          placeholder="Example: Customer wait time drops from 4 hours to under 5 minutes, CSAT goes from 3.8 to 4.5, and we handle 2x the volume without adding headcount"
          rows={4}
          className="w-full"
        />
      </div>

      {/* Success Metrics */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">How would you measure success?</h4>
        <p className="text-sm text-gray-600 mb-4">
          What metrics will you track?
        </p>
        <Textarea
          value={formData.successMetrics}
          onChange={(e) => updateField("successMetrics", e.target.value)}
          placeholder={`Examples:
- Response time (target: <5 minutes)
- Resolution rate (target: 80% automated)
- CSAT score (target: 4.5/5)
- Cost per conversation (target: <$2 vs $15 with humans)`}
          rows={5}
          className="w-full"
        />
      </div>

      {/* Success Summary */}
      {(formData.topGoals.length > 0 ||
        formData.successDescription ||
        formData.successMetrics) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Success Summary</h4>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Top Goals:</strong>{" "}
              {formData.topGoals.length > 0
                ? formData.topGoals.join(", ")
                : "Not specified"}
            </div>
            {formData.successDescription && (
              <div>
                <strong>Success Description:</strong>{" "}
                {formData.successDescription}
              </div>
            )}
            {formData.successMetrics && (
              <div>
                <strong>Success Metrics:</strong> {formData.successMetrics}
              </div>
            )}
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600">
        <p>
          <strong>Why this works:</strong> Claude understands business
          priorities, calculates ROI, sets success metrics
        </p>
      </div>
    </div>
  );
}
