"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
import { DiscoveryFormData } from "@/hooks/useDiscoveryForm";

interface Section4RealConversationsProps {
  formData: DiscoveryFormData;
  addConversation: () => void;
  removeConversation: (index: number) => void;
  updateConversation: (index: number, field: string, value: string) => void;
}

const durations = ["5 min", "10 min", "15 min", "30 min", "1+ hour"];

const conversationExample = `Customer: Hi, I placed an order last week and haven't received any updates. Can you help me track it?

Your team: Hi! I'd be happy to help you track your order. Can you please provide me with your order number or the email address you used when placing the order?

Customer: Sure, my order number is #12345 and I used john@email.com

Your team: Thank you! I can see your order was shipped on Monday and is currently out for delivery. Here's your tracking number: 1Z999AA10123456784. You can track it on the FedEx website. It should arrive today by 5pm.

Customer: Perfect! Thank you so much for your help.

Your team: You're welcome! Is there anything else I can help you with today?`;

export default function Section4RealConversations({
  formData,
  addConversation,
  removeConversation,
  updateConversation,
}: Section4RealConversationsProps) {
  const [selectedConversation, setSelectedConversation] = useState(0);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">
          Real examples help us understand your unique needs
        </h3>
        <p className="text-blue-800 text-sm">
          Share 3-5 typical customer interactions. Claude uses these to create
          realistic mock conversations AND understand what actions are needed.
        </p>
      </div>

      {/* Conversation Selector */}
      <div className="flex gap-2 flex-wrap">
        {formData.realConversations.map((_, index) => (
          <Button
            key={index}
            variant={selectedConversation === index ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedConversation(index)}
            className="text-sm"
          >
            Example {index + 1}
            {index > 0 && (
              <Trash2
                className="ml-2 h-3 w-3"
                onClick={(e) => {
                  e.stopPropagation();
                  removeConversation(index);
                  if (selectedConversation === index) {
                    setSelectedConversation(Math.max(0, index - 1));
                  }
                }}
              />
            )}
          </Button>
        ))}
        {formData.realConversations.length < 5 && (
          <Button
            variant="outline"
            size="sm"
            onClick={addConversation}
            className="text-sm"
          >
            <Plus className="h-3 w-3 mr-1" />
            Add Another
          </Button>
        )}
      </div>

      {/* Selected Conversation Form */}
      <div className="border rounded-lg p-6 bg-white">
        <h4 className="font-semibold mb-4">
          Example #{selectedConversation + 1}{" "}
          {selectedConversation > 0 && "(Optional)"}
        </h4>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>What triggers this interaction? *</Label>
            <Input
              value={
                formData.realConversations[selectedConversation]?.trigger || ""
              }
              onChange={(e) =>
                updateConversation(
                  selectedConversation,
                  "trigger",
                  e.target.value
                )
              }
              placeholder="e.g., Customer receives order confirmation email and replies asking about delivery time"
            />
          </div>

          <div className="space-y-2">
            <Label>Paste a real conversation (anonymize if needed) *</Label>
            <Textarea
              value={
                formData.realConversations[selectedConversation]
                  ?.conversation || ""
              }
              onChange={(e) =>
                updateConversation(
                  selectedConversation,
                  "conversation",
                  e.target.value
                )
              }
              placeholder={conversationExample}
              rows={8}
              className="w-full font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              Format: Customer: [what they said] → Your team: [how you
              responded] → etc.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>How did it end? *</Label>
              <Input
                value={
                  formData.realConversations[selectedConversation]?.outcome ||
                  ""
                }
                onChange={(e) =>
                  updateConversation(
                    selectedConversation,
                    "outcome",
                    e.target.value
                  )
                }
                placeholder="e.g., Provided tracking link, customer satisfied"
              />
            </div>

            <div className="space-y-2">
              <Label>How long did this take? *</Label>
              <select
                value={
                  formData.realConversations[selectedConversation]?.duration ||
                  ""
                }
                onChange={(e) =>
                  updateConversation(
                    selectedConversation,
                    "duration",
                    e.target.value
                  )
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select duration</option>
                {durations.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>
          <strong>Why this works:</strong> Claude uses these to create realistic
          mock conversations AND understand what actions are needed
        </p>
      </div>
    </div>
  );
}
