"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  MessageSquare,
  Zap,
  Database,
  DollarSign,
  Play,
  Users,
  Settings,
} from "lucide-react";
import { AgentforceUseCase } from "@/types/analysis";

interface UseCaseCardProps {
  useCase: AgentforceUseCase;
  index: number;
}

export function UseCaseCard({ useCase, index }: UseCaseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel.toLowerCase()) {
      case "chat":
        return <MessageSquare className="h-4 w-4" />;
      case "voice":
        return <Users className="h-4 w-4" />;
      case "messaging":
        return <MessageSquare className="h-4 w-4" />;
      default:
        return <Settings className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full font-semibold">
              {index + 1}
            </div>
            <div>
              <CardTitle className="text-lg">{useCase.name}</CardTitle>
              <CardDescription>{useCase.description}</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getPriorityColor(useCase.priority)}>
              {useCase.priority.toUpperCase()} PRIORITY
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Channels */}
        <div className="mb-4">
          <h4 className="font-semibold text-sm text-gray-700 mb-2">Channels</h4>
          <div className="flex flex-wrap gap-2">
            {useCase.channels.map((channel, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="flex items-center gap-1"
              >
                {getChannelIcon(channel)}
                {channel}
              </Badge>
            ))}
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-sm">Pricing Summary</span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Implementation:</span>
              <span className="font-semibold ml-1">
                ${useCase.pricing.implementationCost.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Monthly Volume:</span>
              <span className="font-semibold ml-1">
                {useCase.pricing.monthlyConversationVolume.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Actions/Conv:</span>
              <span className="font-semibold ml-1">
                {useCase.pricing.avgActionsPerConversation}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Monthly Cost:</span>
              <span className="font-semibold ml-1">
                ${useCase.pricing.monthlyAgentforceCost.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="space-y-6">
            {/* Topics */}
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">
                Conversation Topics
              </h4>
              <div className="space-y-2">
                {useCase.topics.map((topic, idx) => (
                  <div key={idx} className="p-2 border rounded-md">
                    <div className="font-medium text-sm">
                      {topic.displayName}
                    </div>
                    <div className="text-xs text-gray-600">
                      {topic.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">
                Salesforce Actions
              </h4>
              <div className="space-y-2">
                {useCase.actions.map((action, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 border rounded-md"
                  >
                    <Zap className="h-4 w-4 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium text-sm">{action.name}</div>
                      <div className="text-xs text-gray-600">
                        {action.description}
                      </div>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {action.type.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Variables */}
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">
                Conversation Variables
              </h4>
              <div className="space-y-1">
                {useCase.variables.map((variable, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Database className="h-3 w-3 text-gray-500" />
                    <span className="font-mono text-xs">{variable.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {variable.type}
                    </Badge>
                    <span className="text-gray-600 text-xs">
                      {variable.description}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Integrations */}
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">
                System Integrations
              </h4>
              <div className="space-y-2">
                {useCase.integrations.map((integration, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <div>
                      <div className="font-medium text-sm">
                        {integration.system}
                      </div>
                      {integration.notes && (
                        <div className="text-xs text-gray-600">
                          {integration.notes}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.required && (
                        <Badge variant="destructive" className="text-xs">
                          Required
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {integration.complexity}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Conversations */}
            <div>
              <h4 className="font-semibold text-sm text-gray-700 mb-2">
                Sample Conversations
              </h4>
              <div className="space-y-4">
                {useCase.sampleConversations.map((conversation, idx) => (
                  <div key={idx} className="border rounded-lg p-4">
                    <div className="font-medium text-sm mb-2">
                      {conversation.scenario}
                    </div>
                    <div className="space-y-2">
                      {conversation.conversation.map((turn, turnIdx) => (
                        <div
                          key={turnIdx}
                          className={`flex gap-2 ${turn.speaker === "Customer" ? "justify-start" : "justify-end"}`}
                        >
                          <div
                            className={`max-w-xs p-2 rounded-lg text-sm ${
                              turn.speaker === "Customer"
                                ? "bg-gray-100 text-gray-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            <div className="text-xs font-semibold mb-1">
                              {turn.speaker === "Customer"
                                ? "Customer"
                                : "Agent"}
                            </div>
                            <div>{turn.message}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
