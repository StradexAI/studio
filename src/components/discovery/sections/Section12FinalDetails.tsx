"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DiscoveryFormData } from "@/hooks/useDiscoveryForm";

interface Section12FinalDetailsProps {
  formData: DiscoveryFormData;
  updateField: (field: keyof DiscoveryFormData, value: any) => void;
}

const referralSources = [
  "Google search",
  "LinkedIn",
  "Salesforce AppExchange",
  "Referral from colleague",
  "Conference/Event",
  "Social media",
  "Partner recommendation",
  "Other",
];

const consultationOptions = [
  "Yes, schedule a call",
  "No, send me the proposal",
  "Maybe, I'll decide after seeing the proposal",
];

export default function Section12FinalDetails({
  formData,
  updateField,
}: Section12FinalDetailsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-green-50 p-4 rounded-lg">
        <h3 className="font-semibold text-green-900 mb-2">Almost Done!</h3>
        <p className="text-green-800 text-sm">
          Just a few final details to complete your discovery form.
        </p>
      </div>

      {/* Additional Information */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">Anything else we should know?</h4>
        <Textarea
          value={formData.additionalContext}
          onChange={(e) => updateField("additionalContext", e.target.value)}
          placeholder="Any additional context, specific needs, or information that would help us create the best proposal for you..."
          rows={4}
          className="w-full"
        />
      </div>

      {/* Referral Source */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">How did you hear about us?</h4>
        <select
          value={formData.referralSource}
          onChange={(e) => updateField("referralSource", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select an option</option>
          {referralSources.map((source) => (
            <option key={source} value={source}>
              {source}
            </option>
          ))}
        </select>

        {formData.referralSource === "Other" && (
          <div className="mt-3">
            <Label htmlFor="other-referral">Please specify:</Label>
            <input
              id="other-referral"
              type="text"
              placeholder="How did you hear about us?"
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Consultation Preference */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">
          Prefer a live consultation first?
        </h4>
        <div className="space-y-3">
          {consultationOptions.map((option) => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="radio"
                name="consultationPreference"
                value={option}
                checked={formData.wantsConsultation === option}
                onChange={(e) =>
                  updateField("wantsConsultation", e.target.value)
                }
                className="text-blue-600"
              />
              <span className="text-sm">{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Form Summary */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <h4 className="font-semibold mb-4">Discovery Form Summary</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Company:</strong> {formData.companyName || "Not provided"}
          </div>
          <div>
            <strong>Industry:</strong> {formData.industry || "Not provided"}
          </div>
          <div>
            <strong>Size:</strong> {formData.companySize || "Not provided"}
          </div>
          <div>
            <strong>Pain Points:</strong>{" "}
            {formData.painPoints.filter((p) => p.description.trim()).length}{" "}
            identified
          </div>
          <div>
            <strong>Common Questions:</strong>{" "}
            {formData.commonQuestions.filter((q) => q.trim()).length} listed
          </div>
          <div>
            <strong>Real Conversations:</strong>{" "}
            {
              formData.realConversations.filter((c) => c.conversation.trim())
                .length
            }{" "}
            shared
          </div>
          <div>
            <strong>Monthly Volume:</strong>{" "}
            {formData.volumeMetrics
              ? Object.values(formData.volumeMetrics).reduce(
                  (sum, val) => sum + (parseInt(val) || 0),
                  0
                ) * 22
              : 0}{" "}
            interactions
          </div>
          <div>
            <strong>Timeline:</strong> {formData.timeline || "Not specified"}
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>
          <strong>Next Steps:</strong> After submitting this form, our team will
          review your information and generate a comprehensive Agentforce
          analysis with 3 specific agent recommendations, pricing, and
          implementation plan.
        </p>
      </div>
    </div>
  );
}
