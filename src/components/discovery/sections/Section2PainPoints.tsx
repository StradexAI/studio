"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { DiscoveryFormData } from "@/hooks/useDiscoveryForm";

interface Section2PainPointsProps {
  formData: DiscoveryFormData;
  addPainPoint: () => void;
  removePainPoint: (index: number) => void;
  updatePainPoint: (index: number, field: string, value: string) => void;
}

const departments = [
  "Sales",
  "Service",
  "IT",
  "Marketing",
  "Operations",
  "HR",
  "Finance",
  "Other",
];

const frequencies = ["Daily", "Weekly", "Monthly", "Quarterly", "As needed"];

export default function Section2PainPoints({
  formData,
  addPainPoint,
  removePainPoint,
  updatePainPoint,
}: Section2PainPointsProps) {
  const [selectedPainPoint, setSelectedPainPoint] = useState(0);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Help us understand your biggest operational challenges
        </h3>
        <p className="text-blue-800 text-sm">
          Describe the problems you're facing - we'll recommend the best
          solutions. Start with your 3 biggest pain points, and add up to 2 more
          if needed.
        </p>
      </div>

      {/* Pain Point Selector */}
      <div className="flex gap-2 flex-wrap">
        {formData.painPoints.map((_, index) => (
          <Button
            key={index}
            variant={selectedPainPoint === index ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPainPoint(index)}
            className="text-sm"
          >
            Pain Point {index + 1}
            {index >= 3 && (
              <Trash2
                className="ml-2 h-3 w-3"
                onClick={(e) => {
                  e.stopPropagation();
                  removePainPoint(index);
                  if (selectedPainPoint === index) {
                    setSelectedPainPoint(Math.max(0, index - 1));
                  }
                }}
              />
            )}
          </Button>
        ))}
        {formData.painPoints.length < 5 && (
          <Button
            variant="outline"
            size="sm"
            onClick={addPainPoint}
            className="text-sm"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Another
          </Button>
        )}
      </div>

      {/* Selected Pain Point Form */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">
          Pain Point #{selectedPainPoint + 1}{" "}
          {selectedPainPoint >= 3 && "(Optional)"}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Department Affected *</Label>
            <select
              value={formData.painPoints[selectedPainPoint]?.department || ""}
              onChange={(e) =>
                updatePainPoint(selectedPainPoint, "department", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select department</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>How Often Does This Happen? *</Label>
            <select
              value={formData.painPoints[selectedPainPoint]?.frequency || ""}
              onChange={(e) =>
                updatePainPoint(selectedPainPoint, "frequency", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select frequency</option>
              {frequencies.map((freq) => (
                <option key={freq} value={freq}>
                  {freq}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <Label>Brief Description *</Label>
          <Textarea
            value={formData.painPoints[selectedPainPoint]?.description || ""}
            onChange={(e) =>
              updatePainPoint(selectedPainPoint, "description", e.target.value)
            }
            placeholder="What's the problem? (e.g., 'Customers wait 4 hours for simple order status questions')"
            rows={3}
            className="w-full"
          />
        </div>

        <div className="mt-4 space-y-2">
          <Label>What's This Costing You? *</Label>
          <Textarea
            value={formData.painPoints[selectedPainPoint]?.cost || ""}
            onChange={(e) =>
              updatePainPoint(selectedPainPoint, "cost", e.target.value)
            }
            placeholder="Time, money, customer satisfaction? (e.g., '2 FTEs spend 60% of time on this')"
            rows={2}
            className="w-full"
          />
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>
          <strong>Why this works:</strong> Claude can identify which 3 pain
          points = best agent opportunities
        </p>
      </div>
    </div>
  );
}
