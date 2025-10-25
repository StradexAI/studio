"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DiscoveryFormData } from "@/hooks/useDiscoveryForm";

interface Section5VolumeStaffingProps {
  formData: DiscoveryFormData;
  updateField: (field: keyof DiscoveryFormData, value: any) => void;
  updateNestedField: (path: string[], value: any) => void;
  calculateTotalVolume: () => { daily: number; monthly: number };
}

const responseTimes = [
  "<5 min",
  "5-15 min",
  "15-30 min",
  "30-60 min",
  "1+ hour",
];

const costRanges = [
  "$50-75K/year",
  "$75-100K/year",
  "$100-150K/year",
  "$150K+/year",
  "Not sure",
];

export default function Section5VolumeStaffing({
  formData,
  updateField,
  updateNestedField,
  calculateTotalVolume,
}: Section5VolumeStaffingProps) {
  const volumeTotals = calculateTotalVolume();

  const updateVolumeMetric = (channel: string, value: string) => {
    updateNestedField(["volumeMetrics", channel], value);
  };

  const updateStaffingInfo = (field: string, value: any) => {
    updateNestedField(["staffingInfo", field], value);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Help us understand your volume and staffing
        </h3>
        <p className="text-blue-800 text-sm">
          This information helps Claude calculate baseline costs for ROI and
          determine conversation volumes for pricing.
        </p>
      </div>

      {/* Volume Metrics */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">
          How many interactions do you handle?
        </h4>
        <p className="text-sm text-gray-600 mb-4">
          Per day (we'll calculate monthly totals)
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Phone calls</Label>
            <Input
              type="number"
              value={formData.volumeMetrics.phone}
              onChange={(e) => updateVolumeMetric("phone", e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label>Emails</Label>
            <Input
              type="number"
              value={formData.volumeMetrics.email}
              onChange={(e) => updateVolumeMetric("email", e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label>Live chat</Label>
            <Input
              type="number"
              value={formData.volumeMetrics.chat}
              onChange={(e) => updateVolumeMetric("chat", e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label>Form submissions</Label>
            <Input
              type="number"
              value={formData.volumeMetrics.forms}
              onChange={(e) => updateVolumeMetric("forms", e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label>Social media messages</Label>
            <Input
              type="number"
              value={formData.volumeMetrics.social}
              onChange={(e) => updateVolumeMetric("social", e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label>In-person</Label>
            <Input
              type="number"
              value={formData.volumeMetrics.inPerson}
              onChange={(e) => updateVolumeMetric("inPerson", e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="space-y-2">
            <Label>Other</Label>
            <Input
              type="number"
              value={formData.volumeMetrics.other}
              onChange={(e) => updateVolumeMetric("other", e.target.value)}
              placeholder="0"
              min="0"
            />
          </div>
        </div>

        {/* Volume Totals */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {volumeTotals.daily}
              </div>
              <div className="text-sm text-gray-600">Total per day</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {volumeTotals.monthly}
              </div>
              <div className="text-sm text-gray-600">Total per month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Staffing Information */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">How is this work handled today?</h4>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Number of people who do this work *</Label>
            <Input
              type="number"
              value={formData.staffingInfo.numPeople}
              onChange={(e) => updateStaffingInfo("numPeople", e.target.value)}
              placeholder="e.g., 5"
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label>
              What percentage of their time is spent on repetitive/simple
              questions? *
            </Label>
            <div className="px-4">
              <Slider
                value={[formData.staffingInfo.percentRepetitive]}
                onValueChange={(value) =>
                  updateStaffingInfo("percentRepetitive", value[0])
                }
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>0%</span>
                <span className="font-medium">
                  {formData.staffingInfo.percentRepetitive}%
                </span>
                <span>100%</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Average time to respond to a simple question *</Label>
            <select
              value={formData.staffingInfo.avgResponseTime}
              onChange={(e) =>
                updateStaffingInfo("avgResponseTime", e.target.value)
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select response time</option>
              {responseTimes.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>
              Average loaded cost per employee (salary + benefits) *
            </Label>
            <div className="space-y-2">
              {costRanges.map((range, index) => (
                <label key={index} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="avgCostPerEmployee"
                    value={range}
                    checked={formData.staffingInfo.avgCostPerEmployee === range}
                    onChange={(e) =>
                      updateStaffingInfo("avgCostPerEmployee", e.target.value)
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

      <div className="text-sm text-gray-600">
        <p>
          <strong>Why this works:</strong> Claude calculates baseline costs for
          ROI, determines conversation volumes for pricing
        </p>
      </div>
    </div>
  );
}
