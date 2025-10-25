"use client";

import { Label } from "@/components/ui/label";
import { DiscoveryFormData } from "@/hooks/useDiscoveryForm";

interface Section10BudgetTimelineProps {
  formData: DiscoveryFormData;
  updateField: (field: keyof DiscoveryFormData, value: any) => void;
}

const timelineOptions = [
  "ASAP - Urgent need",
  "Within 1-2 months",
  "Within 3-6 months",
  "Flexible - Exploring options",
];

const implementationBudgetRanges = [
  "Under $25K",
  "$25-50K",
  "$50-100K",
  "$100-200K",
  "$200K+",
  "Not sure - help me understand typical costs",
];

const monthlyBudgetRanges = [
  "Under $5K/month",
  "$5-10K/month",
  "$10-20K/month",
  "$20K+/month",
  "Not sure - help me understand typical costs",
];

export default function Section10BudgetTimeline({
  formData,
  updateField,
}: Section10BudgetTimelineProps) {
  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Budget & Timeline</h3>
        <p className="text-blue-800 text-sm">
          Understanding your budget and timeline helps us create realistic
          proposals and implementation plans.
        </p>
      </div>

      {/* Timeline */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">Timeline *</h4>
        <div className="space-y-3">
          {timelineOptions.map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                name="timeline"
                value={option}
                checked={formData.timeline === option}
                onChange={(e) => updateField("timeline", e.target.value)}
                className="text-blue-600"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">Budget *</h4>
        <p className="text-sm text-gray-600 mb-4">
          What's your budget range for this project?
        </p>

        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium">
              Implementation (one-time)
            </Label>
            <div className="space-y-2 mt-2">
              {implementationBudgetRanges.map((range) => (
                <label key={range} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="implementationBudget"
                    value={range}
                    checked={formData.implementationBudget === range}
                    onChange={(e) =>
                      updateField("implementationBudget", e.target.value)
                    }
                    className="text-blue-600"
                  />
                  <span className="text-sm">{range}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium">Monthly (ongoing)</Label>
            <div className="space-y-2 mt-2">
              {monthlyBudgetRanges.map((range) => (
                <label key={range} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="monthlyBudget"
                    value={range}
                    checked={formData.monthlyBudget === range}
                    onChange={(e) =>
                      updateField("monthlyBudget", e.target.value)
                    }
                    className="text-blue-600"
                  />
                  <span className="text-sm">{range}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Budget Summary */}
      {(formData.timeline ||
        formData.implementationBudget ||
        formData.monthlyBudget) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Budget & Timeline Summary</h4>
          <div className="space-y-1 text-sm">
            <div>
              <strong>Timeline:</strong> {formData.timeline || "Not specified"}
            </div>
            <div>
              <strong>Implementation Budget:</strong>{" "}
              {formData.implementationBudget || "Not specified"}
            </div>
            <div>
              <strong>Monthly Budget:</strong>{" "}
              {formData.monthlyBudget || "Not specified"}
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600">
        <p>
          <strong>Why this works:</strong> Helps us create realistic proposals
          and implementation plans
        </p>
      </div>
    </div>
  );
}
