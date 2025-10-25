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
  CheckCircle,
  Edit,
  Eye,
  AlertCircle,
  ArrowRight,
  FileText,
} from "lucide-react";
import { DiscoveryDataEditor } from "@/components/analysis/DiscoveryDataEditor";
import { DiscoveryResponse } from "@/types/analysis";

interface DiscoveryReviewProps {
  projectId: string;
  discoveryData: DiscoveryResponse;
  onDataUpdated: (updatedData: DiscoveryResponse) => Promise<void>;
  onApproved: () => void;
  onGenerateAnalysis: () => void;
}

export function DiscoveryReview({
  projectId,
  discoveryData,
  onDataUpdated,
  onApproved,
  onGenerateAnalysis,
}: DiscoveryReviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleApprove = async () => {
    setIsApproving(true);
    try {
      await onApproved();
    } finally {
      setIsApproving(false);
    }
  };

  const handleGenerateAnalysis = async () => {
    setIsGenerating(true);
    try {
      await onGenerateAnalysis();
    } finally {
      setIsGenerating(false);
    }
  };

  const getDataQualityScore = (data: DiscoveryResponse): number => {
    let score = 0;
    const fields = [
      "companyName",
      "industry",
      "primaryDepartment",
      "painPoints",
      "businessGoals",
      "currentChannels",
      "monthlyVolume",
      "salesforceProducts",
    ];

    fields.forEach((field) => {
      const value = data[field as keyof DiscoveryResponse];
      if (
        value &&
        (typeof value === "string"
          ? value.trim()
          : Array.isArray(value)
            ? value.length > 0
            : true)
      ) {
        score += 1;
      }
    });

    return Math.round((score / fields.length) * 100);
  };

  const qualityScore = getDataQualityScore(discoveryData);
  const getQualityColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getQualityLabel = (score: number) => {
    if (score >= 80) return "High Quality";
    if (score >= 60) return "Medium Quality";
    return "Low Quality";
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Discovery Data Review
            </CardTitle>
            <CardDescription>
              Review and edit client discovery data before generating analysis
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getQualityColor(qualityScore)}>
              {qualityScore}% - {getQualityLabel(qualityScore)}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Data Quality Assessment */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4 text-blue-600" />
            <span className="font-semibold text-sm">
              Data Quality Assessment
            </span>
          </div>
          <p className="text-sm text-gray-600 mb-3">
            {qualityScore >= 80
              ? "High quality data - ready for analysis generation"
              : qualityScore >= 60
                ? "Medium quality data - consider reviewing key fields"
                : "Low quality data - please review and improve before analysis"}
          </p>

          {qualityScore < 80 && (
            <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
              <strong>Recommendation:</strong> Review the discovery data to
              improve quality before generating analysis. This will ensure more
              accurate Agentforce recommendations.
            </div>
          )}
        </div>

        {/* Discovery Data Editor */}
        <DiscoveryDataEditor
          projectId={projectId}
          initialData={discoveryData}
          onSave={onDataUpdated}
          onCancel={() => setIsEditing(false)}
        />

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button
            onClick={handleApprove}
            disabled={isApproving || isGenerating}
            className="flex-1"
          >
            {isApproving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Approving...
              </>
            ) : (
              <>
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Data Quality
              </>
            )}
          </Button>

          <Button
            onClick={handleGenerateAnalysis}
            disabled={isApproving || isGenerating || qualityScore < 60}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <ArrowRight className="h-4 w-4 mr-2" />
                Generate Analysis
              </>
            )}
          </Button>
        </div>

        {qualityScore < 60 && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            <strong>Note:</strong> Data quality is too low for reliable
            analysis. Please improve the discovery data before generating
            analysis.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
