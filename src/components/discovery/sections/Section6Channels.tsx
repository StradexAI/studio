"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { DiscoveryFormData } from "@/hooks/useDiscoveryForm";

interface Section6ChannelsProps {
  formData: DiscoveryFormData;
  updateField: (field: keyof DiscoveryFormData, value: any) => void;
}

const currentChannelOptions = [
  "Phone",
  "Email",
  "Live chat on website",
  "SMS/Text",
  "WhatsApp/Facebook Messenger",
  "Salesforce Chat",
  "Mobile app",
  "Slack (internal)",
  "In-person",
  "Other",
];

const desiredChannelOptions = [
  "Website chat (for customers)",
  "Email responses (for customers)",
  "SMS/WhatsApp (for customers)",
  "Internal Salesforce chat (for employees)",
  "Slack (for employees)",
  "Mobile app",
  "All of the above",
  "Not sure - recommend based on my situation",
];

export default function Section6Channels({
  formData,
  updateField,
}: Section6ChannelsProps) {
  const handleCurrentChannelChange = (channel: string, checked: boolean) => {
    const newChannels = checked
      ? [...formData.currentChannels, channel]
      : formData.currentChannels.filter((c) => c !== channel);
    updateField("currentChannels", newChannels);
  };

  const handleDesiredChannelChange = (channel: string, checked: boolean) => {
    const newChannels = checked
      ? [...formData.desiredChannels, channel]
      : formData.desiredChannels.filter((c) => c !== channel);
    updateField("desiredChannels", newChannels);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Where do customers reach you?
        </h3>
        <p className="text-blue-800 text-sm">
          Understanding your current channels and where you'd like AI agents
          deployed helps Claude know channels for each agent.
        </p>
      </div>

      {/* Current Channels */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">
          Current channels (check all that apply) *
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentChannelOptions.map((channel) => (
            <div key={channel} className="flex items-center space-x-2">
              <Checkbox
                id={`current-${channel}`}
                checked={formData.currentChannels.includes(channel)}
                onCheckedChange={(checked) =>
                  handleCurrentChannelChange(channel, checked as boolean)
                }
              />
              <Label htmlFor={`current-${channel}`} className="text-sm">
                {channel}
              </Label>
            </div>
          ))}
        </div>

        {formData.currentChannels.includes("Other") && (
          <div className="mt-4">
            <Label htmlFor="other-current">Please specify:</Label>
            <input
              id="other-current"
              type="text"
              placeholder="Describe other channels..."
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>

      {/* Desired Channels */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">
          Where would you like AI agents deployed? (check all that apply) *
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {desiredChannelOptions.map((channel) => (
            <div key={channel} className="flex items-center space-x-2">
              <Checkbox
                id={`desired-${channel}`}
                checked={formData.desiredChannels.includes(channel)}
                onCheckedChange={(checked) =>
                  handleDesiredChannelChange(channel, checked as boolean)
                }
              />
              <Label htmlFor={`desired-${channel}`} className="text-sm">
                {channel}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Channel Summary */}
      {(formData.currentChannels.length > 0 ||
        formData.desiredChannels.length > 0) && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <strong>Current:</strong>{" "}
              {formData.currentChannels.length > 0
                ? formData.currentChannels.join(", ")
                : "None selected"}
            </div>
            <div>
              <strong>Desired for AI:</strong>{" "}
              {formData.desiredChannels.length > 0
                ? formData.desiredChannels.join(", ")
                : "None selected"}
            </div>
          </div>
        </div>
      )}

      <div className="text-sm text-gray-600">
        <p>
          <strong>Why this works:</strong> Claude knows channels for each agent
        </p>
      </div>
    </div>
  );
}
