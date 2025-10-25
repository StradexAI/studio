"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface GenerateAnalysisButtonProps {
  projectId: string;
  hasDiscoveryResponse: boolean;
  hasExistingAnalysis: boolean;
  projectStatus: string;
}

export function GenerateAnalysisButton({
  projectId,
  hasDiscoveryResponse,
  hasExistingAnalysis,
  projectStatus,
}: GenerateAnalysisButtonProps) {
  const router = useRouter();
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateAnalysis = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      const response = await fetch(`/api/projects/${projectId}/analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate analysis");
      }

      // Success! Navigate to analysis page
      router.push(`/projects/${projectId}/analysis`);
    } catch (err) {
      console.error("Error generating analysis:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsGenerating(false);
    }
  };

  // Don't show button if no discovery response yet
  if (!hasDiscoveryResponse) {
    return (
      <Button disabled variant="outline" className="w-full justify-start">
        <Sparkles className="h-4 w-4 mr-2" />
        Awaiting Discovery Response
      </Button>
    );
  }

  // Show "View Analysis" if already generated
  if (hasExistingAnalysis) {
    return (
      <Button
        onClick={() => router.push(`/projects/${projectId}/analysis`)}
        variant="outline"
        className="w-full justify-start"
      >
        <Sparkles className="h-4 w-4 mr-2" />
        View Analysis
      </Button>
    );
  }

  // Show generate button with confirmation
  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button disabled={isGenerating} className="w-full justify-start">
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Generate AI Analysis
              </>
            )}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Generate AI Analysis?</AlertDialogTitle>
            <AlertDialogDescription>
              This will use Claude AI to analyze the client's discovery
              responses and generate a comprehensive opportunity assessment.
              This typically takes 10-30 seconds and costs approximately
              $0.02-0.05.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleGenerateAnalysis}>
              Generate Analysis
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {error && <div className="mt-2 text-sm text-red-600">Error: {error}</div>}
    </>
  );
}

// ============================================
// Simple Button (Alternative Version)
// ============================================

export function SimpleGenerateAnalysisButton({
  projectId,
}: {
  projectId: string;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (!confirm("Generate AI analysis? This will take about 20-30 seconds.")) {
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/projects/${projectId}/analysis`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Failed to generate analysis");
      }

      router.push(`/projects/${projectId}/analysis`);
    } catch (error) {
      alert("Error generating analysis: " + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className="w-full justify-start"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generating...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4 mr-2" />
          Generate Analysis
        </>
      )}
    </Button>
  );
}

// ============================================
// Status-Based Display Component
// ============================================

interface AnalysisStatusProps {
  projectId: string;
  hasDiscovery: boolean;
  hasAnalysis: boolean;
  analysisReviewed?: boolean;
}

export function AnalysisStatusDisplay({
  projectId,
  hasDiscovery,
  hasAnalysis,
  analysisReviewed,
}: AnalysisStatusProps) {
  const router = useRouter();

  // No discovery yet
  if (!hasDiscovery) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-semibold mb-2">Analysis Status</h3>
        <p className="text-sm text-gray-600 mb-3">
          Waiting for client to complete discovery form
        </p>
        <Button disabled variant="outline" className="w-full">
          Generate Analysis
        </Button>
      </div>
    );
  }

  // Analysis exists
  if (hasAnalysis) {
    return (
      <div className="border rounded-lg p-4 bg-green-50">
        <h3 className="font-semibold mb-2">Analysis Status</h3>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2 w-2 rounded-full bg-green-600"></div>
          <p className="text-sm text-gray-600">
            {analysisReviewed ? "Analysis Reviewed" : "Analysis Generated"}
          </p>
        </div>
        <Button
          onClick={() => router.push(`/projects/${projectId}/analysis`)}
          className="w-full"
        >
          {analysisReviewed ? "View Analysis" : "Review Analysis"}
        </Button>
      </div>
    );
  }

  // Ready to generate
  return (
    <div className="border rounded-lg p-4 bg-blue-50">
      <h3 className="font-semibold mb-2">Analysis Status</h3>
      <p className="text-sm text-gray-600 mb-3">
        Discovery complete. Ready to generate AI analysis.
      </p>
      <GenerateAnalysisButton
        projectId={projectId}
        hasDiscoveryResponse={hasDiscovery}
        hasExistingAnalysis={hasAnalysis}
        projectStatus="Discovery Completed"
      />
    </div>
  );
}

// ============================================
// Batch Analysis Generation (Advanced)
// ============================================

interface BatchGenerateButtonProps {
  projectIds: string[];
  onComplete?: () => void;
}

export function BatchGenerateAnalysisButton({
  projectIds,
  onComplete,
}: BatchGenerateButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    success: string[];
    failed: string[];
  }>({ success: [], failed: [] });

  const handleBatchGenerate = async () => {
    if (!confirm(`Generate analyses for ${projectIds.length} projects?`)) {
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    const success: string[] = [];
    const failed: string[] = [];

    for (let i = 0; i < projectIds.length; i++) {
      const projectId = projectIds[i];

      try {
        const res = await fetch(`/api/projects/${projectId}/analysis`, {
          method: "POST",
        });

        if (res.ok) {
          success.push(projectId);
        } else {
          failed.push(projectId);
        }
      } catch (error) {
        failed.push(projectId);
      }

      setProgress(((i + 1) / projectIds.length) * 100);

      // Rate limiting: wait 1 second between requests
      if (i < projectIds.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    setResults({ success, failed });
    setIsGenerating(false);
    onComplete?.();
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={handleBatchGenerate}
        disabled={isGenerating || projectIds.length === 0}
      >
        {isGenerating ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Generating {Math.round(progress)}%
          </>
        ) : (
          <>
            <Sparkles className="h-4 w-4 mr-2" />
            Generate {projectIds.length} Analyses
          </>
        )}
      </Button>

      {isGenerating && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {!isGenerating &&
        (results.success.length > 0 || results.failed.length > 0) && (
          <div className="text-sm">
            <p className="text-green-600">
              Success: {results.success.length} projects
            </p>
            <p className="text-red-600">
              Failed: {results.failed.length} projects
            </p>
          </div>
        )}
    </div>
  );
}
