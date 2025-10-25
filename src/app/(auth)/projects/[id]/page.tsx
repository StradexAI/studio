"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Copy, Mail, FileText } from "lucide-react";
import { GenerateAnalysisButton } from "@/components/analysis/GenerateAnalysisButton";
import { DiscoveryReview } from "@/components/analysis/DiscoveryReview";
import { DiscoveryResponse } from "@/types/analysis";

interface Project {
  id: string;
  clientName: string;
  clientEmail: string;
  status: string;
  discoveryToken: string;
  discoveryUrl: string;
  createdAt: string;
  discoveryResponse?: any;
  analysis?: any;
  proposal?: any;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdatingDiscovery, setIsUpdatingDiscovery] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [projectId]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      }
    } catch (error) {
      console.error("Error fetching project:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDiscoveryUpdate = async (updatedData: DiscoveryResponse) => {
    try {
      setIsUpdatingDiscovery(true);
      const response = await fetch(`/api/projects/${projectId}/discovery`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        // Refresh project data
        await fetchProject();
      } else {
        throw new Error("Failed to update discovery data");
      }
    } catch (error) {
      console.error("Error updating discovery data:", error);
      throw error;
    } finally {
      setIsUpdatingDiscovery(false);
    }
  };

  const handleDiscoveryApproved = async () => {
    // Mark discovery as approved (could add a field for this)
    // For now, just refresh the project
    await fetchProject();
  };

  const handleGenerateAnalysis = async () => {
    // Navigate to analysis page where generation will happen
    router.push(`/projects/${projectId}/analysis`);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DISCOVERY":
        return "bg-blue-100 text-blue-800";
      case "PENDING_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "ANALYSIS_GENERATED":
        return "bg-purple-100 text-purple-800";
      case "ANALYSIS_REVIEWED":
        return "bg-indigo-100 text-indigo-800";
      case "PROPOSAL_DRAFT":
        return "bg-orange-100 text-orange-800";
      case "PROPOSAL_SENT":
        return "bg-amber-100 text-amber-800";
      case "CONTRACTED":
        return "bg-green-100 text-green-800";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800";
      case "DEPLOYED":
        return "bg-green-100 text-green-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "DISCOVERY":
        return "Discovery";
      case "PENDING_REVIEW":
        return "Discovery Review";
      case "ANALYSIS_GENERATED":
        return "Analysis Generated";
      case "ANALYSIS_REVIEWED":
        return "Analysis Reviewed";
      case "PROPOSAL_DRAFT":
        return "Proposal Draft";
      case "PROPOSAL_SENT":
        return "Proposal Sent";
      case "CONTRACTED":
        return "Contracted";
      case "IN_PROGRESS":
        return "In Progress";
      case "DEPLOYED":
        return "Deployed";
      case "COMPLETED":
        return "Completed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-red-600">Project Not Found</CardTitle>
            <CardDescription>
              The project you're looking for doesn't exist or you don't have
              access to it.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => router.push("/projects")}>
              Back to Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Projects
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">
                      {project.clientName}
                    </CardTitle>
                    <CardDescription>{project.clientEmail}</CardDescription>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {getStatusLabel(project.status)}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Discovery Link</h3>
                  <div className="flex items-center gap-2">
                    <input
                      value={project.discoveryUrl}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        navigator.clipboard.writeText(project.discoveryUrl)
                      }
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">
                      {project.discoveryResponse ? "✓" : "○"}
                    </div>
                    <div className="text-sm text-gray-600">Discovery</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">
                      {project.analysis ? "✓" : "○"}
                    </div>
                    <div className="text-sm text-gray-600">Analysis</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Discovery Review Section */}
            {project.discoveryResponse &&
              !project.analysis &&
              (project.status === "PENDING_REVIEW" ||
                project.status === "DISCOVERY") && (
                <DiscoveryReview
                  projectId={projectId}
                  discoveryData={project.discoveryResponse}
                  onDataUpdated={handleDiscoveryUpdate}
                  onApproved={handleDiscoveryApproved}
                  onGenerateAnalysis={handleGenerateAnalysis}
                />
              )}
          </div>

          {/* Actions */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open(`mailto:${project.clientEmail}`)}
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Email Client
                </Button>

                {/* Only show GenerateAnalysisButton if discovery review is not available */}
                {!(
                  project.discoveryResponse &&
                  !project.analysis &&
                  (project.status === "PENDING_REVIEW" ||
                    project.status === "DISCOVERY")
                ) && (
                  <GenerateAnalysisButton
                    projectId={projectId}
                    hasDiscoveryResponse={!!project.discoveryResponse}
                    hasExistingAnalysis={!!project.analysis}
                    projectStatus={project.status}
                  />
                )}

                {project.analysis && project.analysis.consultantReviewed && (
                  <Button
                    className="w-full justify-start"
                    onClick={() =>
                      router.push(`/projects/${projectId}/proposal`)
                    }
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Generate Proposal
                  </Button>
                )}

                <div className="text-xs text-gray-500 pt-2">
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
