"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DiscoveryFormData } from "@/hooks/useDiscoveryForm";

interface Section7SalesforceProps {
  formData: DiscoveryFormData;
  updateField: (field: keyof DiscoveryFormData, value: any) => void;
  updateNestedField: (path: string[], value: any) => void;
}

const salesforceProducts = [
  "Sales Cloud",
  "Service Cloud",
  "Marketing Cloud",
  "Commerce Cloud",
  "Experience Cloud",
  "Data Cloud",
  "Other",
];

const editions = ["Essentials", "Professional", "Enterprise", "Unlimited"];

const automationOptions = [
  "Workflows or automation rules",
  "Custom fields and objects",
  "Third-party integrations (e.g., DocuSign, Slack, etc.)",
  "Custom code/developers on staff",
  "None of the above",
  "Not sure",
];

const dataLocationOptions = [
  "In Salesforce",
  "In another CRM",
  "In spreadsheets",
  "In a custom database",
  "Across multiple systems",
  "We need to enrich data from external sources (e.g., LinkedIn, ZoomInfo)",
];

const skillLevels = [
  "Beginner - We use basic features",
  "Intermediate - We've customized it some",
  "Advanced - We have admins/developers",
];

export default function Section7Salesforce({
  formData,
  updateField,
  updateNestedField,
}: Section7SalesforceProps) {
  const [otherProduct, setOtherProduct] = useState("");

  const handleProductChange = (product: string, checked: boolean) => {
    const newProducts = checked
      ? [...formData.salesforceProducts, product]
      : formData.salesforceProducts.filter((p) => p !== product);
    updateField("salesforceProducts", newProducts);
  };

  const handleAutomationChange = (option: string, checked: boolean) => {
    const newAutomation = checked
      ? [...formData.existingAutomation, option]
      : formData.existingAutomation.filter((a) => a !== option);
    updateField("existingAutomation", newAutomation);
  };

  const handleDataLocationChange = (location: string, checked: boolean) => {
    const newLocations = checked
      ? [...formData.dataLocations, location]
      : formData.dataLocations.filter((l) => l !== location);
    updateField("dataLocations", newLocations);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Understanding your setup helps us plan implementation
        </h3>
        <p className="text-blue-800 text-sm">
          This information helps Claude determine flow complexity, Apex needs,
          Data Cloud requirements, and implementation hours.
        </p>
      </div>

      {/* Salesforce Usage */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">Salesforce usage *</h4>
        <div className="space-y-3">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="usesSalesforce"
              value="active"
              checked={formData.usesSalesforce === "active"}
              onChange={(e) => updateField("usesSalesforce", e.target.value)}
              className="text-blue-600"
            />
            <span>Yes, we use Salesforce actively</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="usesSalesforce"
              value="getting-started"
              checked={formData.usesSalesforce === "getting-started"}
              onChange={(e) => updateField("usesSalesforce", e.target.value)}
              className="text-blue-600"
            />
            <span>Yes, but we're just getting started</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="usesSalesforce"
              value="no"
              checked={formData.usesSalesforce === "no"}
              onChange={(e) => updateField("usesSalesforce", e.target.value)}
              className="text-blue-600"
            />
            <span>No, not yet (we can still help!)</span>
          </label>
        </div>

        {/* Conditional fields for active users */}
        {formData.usesSalesforce === "active" && (
          <div className="mt-6 space-y-6">
            <div>
              <Label className="text-sm font-medium">Which products?</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                {salesforceProducts.map((product) => (
                  <div key={product} className="flex items-center space-x-2">
                    <Checkbox
                      id={`product-${product}`}
                      checked={formData.salesforceProducts.includes(product)}
                      onCheckedChange={(checked) =>
                        handleProductChange(product, checked as boolean)
                      }
                    />
                    <Label htmlFor={`product-${product}`} className="text-sm">
                      {product}
                    </Label>
                  </div>
                ))}
              </div>

              {formData.salesforceProducts.includes("Other") && (
                <div className="mt-3">
                  <Input
                    value={otherProduct}
                    onChange={(e) => setOtherProduct(e.target.value)}
                    placeholder="Please specify other Salesforce products..."
                    className="w-full"
                  />
                </div>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium">Edition</Label>
              <select
                value={formData.salesforceEdition}
                onChange={(e) =>
                  updateField("salesforceEdition", e.target.value)
                }
                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select edition</option>
                {editions.map((edition) => (
                  <option key={edition} value={edition}>
                    {edition}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Current Automation */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">
          Current automation & customization
        </h4>
        <p className="text-sm text-gray-600 mb-4">Do you have any of these?</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {automationOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox
                id={`automation-${option}`}
                checked={formData.existingAutomation.includes(option)}
                onCheckedChange={(checked) =>
                  handleAutomationChange(option, checked as boolean)
                }
              />
              <Label htmlFor={`automation-${option}`} className="text-sm">
                {option}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Data Locations */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">Where is your customer data?</h4>
        <p className="text-sm text-gray-600 mb-4">Check all that apply</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {dataLocationOptions.map((location) => (
            <div key={location} className="flex items-center space-x-2">
              <Checkbox
                id={`data-${location}`}
                checked={formData.dataLocations.includes(location)}
                onCheckedChange={(checked) =>
                  handleDataLocationChange(location, checked as boolean)
                }
              />
              <Label htmlFor={`data-${location}`} className="text-sm">
                {location}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Team Skill Level */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">
          How would you rate your team's Salesforce knowledge?
        </h4>
        <div className="space-y-3">
          {skillLevels.map((level) => (
            <label key={level} className="flex items-center space-x-2">
              <input
                type="radio"
                name="teamSkillLevel"
                value={level}
                checked={formData.teamSkillLevel === level}
                onChange={(e) => updateField("teamSkillLevel", e.target.value)}
                className="text-blue-600"
              />
              <span className="text-sm">{level}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>
          <strong>Why this works:</strong> Claude determines:
        </p>
        <ul className="list-disc list-inside mt-1 space-y-1">
          <li>Flow complexity (existing automation = easier)</li>
          <li>Apex needs (complex integrations = might need custom code)</li>
          <li>Data Cloud needs (external enrichment = +$3K/month)</li>
          <li>Implementation hours (beginner team = more hours)</li>
        </ul>
      </div>
    </div>
  );
}
