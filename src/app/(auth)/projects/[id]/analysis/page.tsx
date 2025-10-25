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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  ArrowLeft,
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Save,
  X,
  Plus,
  Trash2,
  RefreshCw,
  Database,
} from "lucide-react";
import { DiscoveryDataEditor } from "@/components/analysis/DiscoveryDataEditor";
import { UseCaseCard } from "@/components/analysis/UseCaseCard";
import { PlatformRequirementsCard } from "@/components/analysis/PlatformRequirementsCard";
import {
  Analysis,
  ScoringBreakdown,
  getScoreLabel,
  getScoreColor,
  calculateOpportunityScore,
  DiscoveryResponse,
  AgentforceUseCase,
  PlatformRequirements,
} from "@/types/analysis";

interface Project {
  id: string;
  clientName: string;
  clientEmail: string;
  status: string;
  discoveryResponse: any;
}

export default function AnalysisPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Discovery data state
  const [discoveryData, setDiscoveryData] = useState<DiscoveryResponse | null>(
    null
  );
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Editable state
  const [editedAnalysis, setEditedAnalysis] = useState<Analysis | null>(null);
  const [newTopic, setNewTopic] = useState("");
  const [newAction, setNewAction] = useState("");

  useEffect(() => {
    fetchAnalysis();
  }, [projectId]);

  const fetchAnalysis = async () => {
    try {
      setLoading(true);

      // Fetch project details
      const projectResponse = await fetch(`/api/projects/${projectId}`);
      if (!projectResponse.ok) {
        throw new Error("Failed to fetch project");
      }
      const projectData = await projectResponse.json();
      setProject(projectData);

      // Fetch discovery data
      const discoveryResponse = await fetch(
        `/api/projects/${projectId}/discovery`
      );
      if (discoveryResponse.ok) {
        const discoveryData = await discoveryResponse.json();
        setDiscoveryData(discoveryData.discoveryResponse);
      }

      // Fetch analysis
      const analysisResponse = await fetch(
        `/api/projects/${projectId}/analysis`
      );
      if (!analysisResponse.ok) {
        if (analysisResponse.status === 404) {
          throw new Error(
            "Analysis not found. Please generate an analysis first."
          );
        }
        throw new Error("Failed to fetch analysis");
      }
      const analysisData = await analysisResponse.json();
      setAnalysis(analysisData);
      setEditedAnalysis(analysisData);
    } catch (error) {
      console.error("Error fetching analysis:", error);
      setError(
        error instanceof Error ? error.message : "Failed to load analysis"
      );
    } finally {
      setLoading(false);
    }
  };

  const generateAnalysis = async () => {
    try {
      setLoading(true);
      setError("");

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

      // After generating, fetch the new analysis
      await fetchAnalysis();
    } catch (error) {
      console.error("Error generating analysis:", error);
      setError(
        error instanceof Error ? error.message : "Failed to generate analysis"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editedAnalysis) return;

    try {
      setSaving(true);

      const response = await fetch(`/api/projects/${projectId}/analysis`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...editedAnalysis,
          consultantReviewed: true,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save analysis");
      }

      const updatedAnalysis = await response.json();
      setAnalysis(updatedAnalysis);
      setEditedAnalysis(updatedAnalysis);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving analysis:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditedAnalysis(analysis);
    setIsEditing(false);
    setNewTopic("");
    setNewAction("");
  };

  // Handle discovery data updates
  const handleDiscoveryUpdate = async (updatedData: DiscoveryResponse) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/discovery`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update discovery data");
      }

      setDiscoveryData(updatedData);

      // If analysis exists, mark it as needing regeneration
      if (analysis) {
        setAnalysis((prev) =>
          prev ? { ...prev, consultantReviewed: false } : null
        );
        setEditedAnalysis((prev) =>
          prev ? { ...prev, consultantReviewed: false } : null
        );
      }
    } catch (error) {
      console.error("Error updating discovery data:", error);
      throw error;
    }
  };

  // Regenerate analysis with updated discovery data
  const regenerateAnalysis = async () => {
    try {
      setIsRegenerating(true);
      setError("");

      // Delete existing analysis first
      if (analysis) {
        await fetch(`/api/projects/${projectId}/analysis`, {
          method: "DELETE",
        });
      }

      // Generate new analysis
      const response = await fetch(`/api/projects/${projectId}/analysis`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to regenerate analysis");
      }

      // Fetch the new analysis
      await fetchAnalysis();
    } catch (error) {
      console.error("Error regenerating analysis:", error);
      setError(
        error instanceof Error ? error.message : "Failed to regenerate analysis"
      );
    } finally {
      setIsRegenerating(false);
    }
  };

  const updateBreakdownScore = (key: keyof ScoringBreakdown, value: number) => {
    if (!editedAnalysis) return;

    const newBreakdown = {
      ...editedAnalysis.scoringBreakdown,
      [key]: value,
    };

    // Recalculate opportunity score using the helper function
    const avgScore = calculateOpportunityScore(newBreakdown);

    setEditedAnalysis({
      ...editedAnalysis,
      scoringBreakdown: newBreakdown,
      opportunityScore: avgScore,
    });
  };

  const addTopic = () => {
    if (!editedAnalysis || !newTopic.trim()) return;

    setEditedAnalysis({
      ...editedAnalysis,
      recommendedTopics: [...editedAnalysis.recommendedTopics, newTopic.trim()],
    });
    setNewTopic("");
  };

  const removeTopic = (index: number) => {
    if (!editedAnalysis) return;

    setEditedAnalysis({
      ...editedAnalysis,
      recommendedTopics: editedAnalysis.recommendedTopics.filter(
        (_, i) => i !== index
      ),
    });
  };

  const addAction = () => {
    if (!editedAnalysis || !newAction.trim()) return;

    setEditedAnalysis({
      ...editedAnalysis,
      recommendedActions: [
        ...editedAnalysis.recommendedActions,
        newAction.trim(),
      ],
    });
    setNewAction("");
  };

  const removeAction = (index: number) => {
    if (!editedAnalysis) return;

    setEditedAnalysis({
      ...editedAnalysis,
      recommendedActions: editedAnalysis.recommendedActions.filter(
        (_, i) => i !== index
      ),
    });
  };

  // Helper functions are now imported from types/analysis

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-600">Error</CardTitle>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => router.push(`/projects/${projectId}`)}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Project
            </Button>
            {error.includes("Analysis not found") && (
              <Button className="w-full" onClick={generateAnalysis}>
                Generate Analysis
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!analysis || !project || !editedAnalysis) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Analysis Found</h2>
          <p className="text-gray-600 mb-4">
            This project doesn't have an analysis yet.
          </p>
          <Button onClick={() => router.push(`/projects/${projectId}`)}>
            Back to Project
          </Button>
        </div>
      </div>
    );
  }

  const displayData = isEditing ? editedAnalysis : analysis;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push(`/projects/${projectId}`)}
                disabled={isEditing}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Project
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Analysis Review
                </h1>
                <p className="text-gray-600 mt-1">
                  {project.clientName} - AI Agent Opportunity Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={analysis.consultantReviewed ? "default" : "secondary"}
              >
                {analysis.consultantReviewed ? "Reviewed" : "Pending Review"}
              </Badge>

              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Analysis
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} disabled={saving}>
                    {saving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Discovery Data Editor */}
        {discoveryData && (
          <div className="mb-8">
            <DiscoveryDataEditor
              projectId={projectId}
              initialData={discoveryData}
              onSave={handleDiscoveryUpdate}
              onCancel={() => {}}
            />

            {/* Regenerate Analysis Button */}
            {analysis && !analysis.consultantReviewed && (
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={regenerateAnalysis}
                  disabled={isRegenerating}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  {isRegenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      Regenerating Analysis...
                    </>
                  ) : (
                    <>
                      <Database className="h-4 w-4" />
                      Regenerate Analysis with Updated Data
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Opportunity Scores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Opportunity Score
                  </CardTitle>
                  <CardDescription>
                    Overall AI automation potential
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold ${getScoreColor(displayData.opportunityScore).text} ${getScoreColor(displayData.opportunityScore).bg}`}
                    >
                      {displayData.opportunityScore}
                    </div>
                    <p className="text-lg font-semibold mt-2">
                      {getScoreLabel(displayData.opportunityScore)}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="h-5 w-5" />
                    Agentforce Fit Score
                  </CardTitle>
                  <CardDescription>
                    How well suited for Agentforce platform
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div
                      className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold ${getScoreColor((displayData as any).agentforceFitScore || 0).text} ${getScoreColor((displayData as any).agentforceFitScore || 0).bg}`}
                    >
                      {(displayData as any).agentforceFitScore || 0}
                    </div>
                    <p className="text-lg font-semibold mt-2">
                      {getScoreLabel(
                        (displayData as any).agentforceFitScore || 0
                      )}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Scoring Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Scoring Breakdown</CardTitle>
                <CardDescription>
                  Detailed analysis of key opportunity factors
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(displayData.scoringBreakdown).map(
                    ([key, score]) => (
                      <div key={key} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium capitalize">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </Label>
                          <span className="text-sm font-medium">{score}</span>
                        </div>
                        {isEditing ? (
                          <Slider
                            value={[score]}
                            onValueChange={(value) =>
                              updateBreakdownScore(
                                key as keyof ScoringBreakdown,
                                value[0]
                              )
                            }
                            max={100}
                            step={1}
                            className="w-full"
                          />
                        ) : (
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    )
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Platform Requirements */}
            {(displayData as any).platformRequirements && (
              <PlatformRequirementsCard
                requirements={(displayData as any).platformRequirements}
              />
            )}

            {/* Use Cases */}
            {(displayData as any).useCases &&
            Array.isArray((displayData as any).useCases) ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    Agentforce Use Cases
                  </h2>
                  <p className="text-gray-600">
                    Three prioritized use cases with complete implementation
                    details
                  </p>
                </div>
                {(displayData as any).useCases.map(
                  (useCase: AgentforceUseCase, index: number) => (
                    <UseCaseCard key={index} useCase={useCase} index={index} />
                  )
                )}
              </div>
            ) : (
              /* Fallback for legacy analysis format */
              <>
                {/* AI Insights */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      AI Insights
                    </CardTitle>
                    <CardDescription>
                      Key findings and recommendations from the analysis
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {isEditing ? (
                      <Textarea
                        value={editedAnalysis.aiInsights}
                        onChange={(e) =>
                          setEditedAnalysis({
                            ...editedAnalysis,
                            aiInsights: e.target.value,
                          })
                        }
                        rows={10}
                        className="w-full"
                        placeholder="Enter AI insights and recommendations..."
                      />
                    ) : (
                      <div className="prose max-w-none">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {displayData.aiInsights}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Recommended Topics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Topics</CardTitle>
                    <CardDescription>
                      Key areas the AI agent should focus on
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex flex-wrap gap-2">
                        {displayData.recommendedTopics.map((topic, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="flex items-center gap-1"
                          >
                            {topic}
                            {isEditing && (
                              <button
                                onClick={() => removeTopic(index)}
                                className="ml-1 hover:text-red-600"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            )}
                          </Badge>
                        ))}
                      </div>

                      {isEditing && (
                        <div className="flex gap-2">
                          <Input
                            value={newTopic}
                            onChange={(e) => setNewTopic(e.target.value)}
                            placeholder="Add a new topic..."
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addTopic();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={addTopic}
                            disabled={!newTopic.trim()}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recommended Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recommended Actions</CardTitle>
                    <CardDescription>
                      Next steps for implementing the AI agent solution
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <ul className="space-y-2">
                        {displayData.recommendedActions.map((action, index) => (
                          <li
                            key={index}
                            className="flex items-start gap-2 group"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-sm flex-1">{action}</span>
                            {isEditing && (
                              <button
                                onClick={() => removeAction(index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>

                      {isEditing && (
                        <div className="flex gap-2">
                          <Input
                            value={newAction}
                            onChange={(e) => setNewAction(e.target.value)}
                            placeholder="Add a new action..."
                            onKeyPress={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addAction();
                              }
                            }}
                          />
                          <Button
                            type="button"
                            size="sm"
                            onClick={addAction}
                            disabled={!newAction.trim()}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Financial Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Financial Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm text-gray-600">
                    Implementation Cost
                  </Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedAnalysis.estimatedImplementationCost}
                      onChange={(e) =>
                        setEditedAnalysis({
                          ...editedAnalysis,
                          estimatedImplementationCost:
                            parseInt(e.target.value) || 0,
                        })
                      }
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-semibold">
                      $
                      {displayData.estimatedImplementationCost.toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm text-gray-600">Monthly Cost</Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedAnalysis.estimatedMonthlyCost}
                      onChange={(e) =>
                        setEditedAnalysis({
                          ...editedAnalysis,
                          estimatedMonthlyCost: parseInt(e.target.value) || 0,
                        })
                      }
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-semibold">
                      ${displayData.estimatedMonthlyCost.toLocaleString()}
                    </p>
                  )}
                </div>

                <div>
                  <Label className="text-sm text-gray-600">
                    Year 1 Savings
                  </Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedAnalysis.projectedYear1Savings}
                      onChange={(e) =>
                        setEditedAnalysis({
                          ...editedAnalysis,
                          projectedYear1Savings: parseInt(e.target.value) || 0,
                        })
                      }
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-semibold text-green-600">
                      ${displayData.projectedYear1Savings.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t">
                  <Label className="text-sm text-gray-600">
                    Payback Period
                  </Label>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedAnalysis.paybackMonths}
                      onChange={(e) =>
                        setEditedAnalysis({
                          ...editedAnalysis,
                          paybackMonths: parseInt(e.target.value) || 0,
                        })
                      }
                      className="mt-1"
                    />
                  ) : (
                    <p className="font-semibold">
                      {displayData.paybackMonths} months
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Project Info */}
            <Card>
              <CardHeader>
                <CardTitle>Project Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Client</span>
                  <p className="font-medium">{project.clientName}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Status</span>
                  <p className="font-medium">{project.status}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">
                    Analysis Generated
                  </span>
                  <p className="font-medium">
                    {new Date(analysis.generatedAt).toLocaleDateString()}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start"
                  onClick={() => router.push(`/projects/${projectId}/proposal`)}
                  disabled={isEditing || !analysis.consultantReviewed}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Proposal
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => window.open(`mailto:${project.clientEmail}`)}
                  disabled={isEditing}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Email Client
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
