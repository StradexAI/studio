"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Copy, Mail } from "lucide-react";

export default function NewProjectPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    clientName: "",
    clientEmail: "",
    clientContactName: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdProject, setCreatedProject] = useState<any>(null);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create project");
      }

      setCreatedProject(data);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const sendEmailTemplate = () => {
    const subject = encodeURIComponent(`Discovery Questionnaire - ${formData.clientName}`);
    const body = encodeURIComponent(`Hi ${formData.clientContactName || 'there'},

I hope this email finds you well. I'm excited to work with ${formData.clientName} on implementing Agentforce to streamline your operations.

I've prepared a brief discovery questionnaire to better understand your current processes and requirements. This will help me provide you with a customized solution proposal.

Please complete the questionnaire at your convenience:
${createdProject?.discoveryUrl}

The questionnaire should take about 15-20 minutes to complete. Your responses will help me design the optimal Agentforce solution for your needs.

Please let me know if you have any questions or if you'd prefer to discuss this over a call first.

Best regards,
[Your Name]`);

    window.open(`mailto:${formData.clientEmail}?subject=${subject}&body=${body}`);
  };

  if (createdProject) {
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

          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <CardTitle className="text-2xl">Project Created Successfully!</CardTitle>
              <CardDescription>
                Your discovery link is ready to share with {formData.clientName}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Discovery Link</h3>
                <div className="flex items-center gap-2">
                  <Input
                    value={createdProject.discoveryUrl}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(createdProject.discoveryUrl)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  onClick={sendEmailTemplate}
                  className="flex items-center gap-2 flex-1"
                >
                  <Mail className="h-4 w-4" />
                  Send Email Template
                </Button>
                <Button
                  variant="outline"
                  onClick={() => router.push("/projects")}
                  className="flex-1"
                >
                  View All Projects
                </Button>
              </div>

              <div className="text-sm text-gray-600">
                <p className="font-medium mb-2">Next Steps:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Share the discovery link with your client</li>
                  <li>Client completes the questionnaire (15-20 minutes)</li>
                  <li>You'll receive an email notification when complete</li>
                  <li>Review the AI-generated analysis</li>
                  <li>Generate and send the proposal</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
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

        <Card>
          <CardHeader>
            <CardTitle>Create New Project</CardTitle>
            <CardDescription>
              Create a new project and generate a discovery link for your client.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Company Name *
                </label>
                <Input
                  type="text"
                  placeholder="TechCorp Industries"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Email *
                </label>
                <Input
                  type="email"
                  placeholder="john.smith@techcorp.com"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Name
                </label>
                <Input
                  type="text"
                  placeholder="John Smith"
                  value={formData.clientContactName}
                  onChange={(e) => setFormData({ ...formData, clientContactName: e.target.value })}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? "Creating..." : "Create Project"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
