"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Cloud,
  Database,
  Settings,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { PlatformRequirements } from "@/types/analysis";

interface PlatformRequirementsCardProps {
  requirements: PlatformRequirements;
}

export function PlatformRequirementsCard({
  requirements,
}: PlatformRequirementsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Agentforce Platform Requirements
        </CardTitle>
        <CardDescription>
          Required Salesforce products and platform configuration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Salesforce Products */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">
            Salesforce Products
          </h4>
          <div className="flex flex-wrap gap-2">
            {requirements.salesforceProducts.map((product, idx) => (
              <Badge
                key={idx}
                variant="outline"
                className="flex items-center gap-1"
              >
                <CheckCircle className="h-3 w-3 text-green-600" />
                {product}
              </Badge>
            ))}
          </div>
        </div>

        {/* Agentforce Edition */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">
            Agentforce Edition
          </h4>
          <Badge
            variant={
              requirements.agentforceEdition === "Unlimited"
                ? "default"
                : "secondary"
            }
            className="flex items-center gap-1"
          >
            <Settings className="h-3 w-3" />
            {requirements.agentforceEdition}
          </Badge>
        </div>

        {/* Data Cloud Requirements */}
        <div>
          <h4 className="font-semibold text-sm text-gray-700 mb-2">
            Data Cloud
          </h4>
          <div className="flex items-center gap-2">
            {requirements.dataCloudRequired ? (
              <>
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium text-orange-600">
                  Required
                </span>
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  Not Required
                </span>
              </>
            )}
          </div>
          {requirements.dataCloudReason && (
            <p className="text-xs text-gray-600 mt-1 ml-6">
              {requirements.dataCloudReason}
            </p>
          )}
        </div>

        {/* Additional Notes */}
        {requirements.dataCloudRequired && requirements.dataCloudReason && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
            <div className="flex items-start gap-2">
              <Database className="h-4 w-4 text-blue-600 mt-0.5" />
              <div>
                <div className="text-sm font-medium text-blue-800">
                  Data Cloud Integration
                </div>
                <div className="text-xs text-blue-600 mt-1">
                  {requirements.dataCloudReason}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
