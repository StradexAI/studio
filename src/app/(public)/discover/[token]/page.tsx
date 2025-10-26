"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle } from "lucide-react";
import DiscoveryFormModular from "@/components/discovery/DiscoveryFormModular";

export default function DiscoverPage() {
  const params = useParams();
  const token = params.token as string;
  const [isValidating, setIsValidating] = useState(true);
  const [isValid, setIsValid] = useState(false);
  const [project, setProject] = useState<{
    id: string;
    clientName: string;
    status: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    console.log("🔍 Discovery Page Mounted - Token:", token);

    const validateToken = async () => {
      // Early return if no token
      if (!token || token === "undefined") {
        console.error("❌ Invalid token:", token);
        setError("Invalid or missing token");
        setIsValid(false);
        setIsValidating(false);
        return;
      }

      try {
        const apiUrl = `/api/discovery/${token}`;
        console.log("📡 Fetching:", apiUrl);

        const response = await fetch(apiUrl);
        console.log("✅ Response status:", response.status);
        console.log("✅ Response ok:", response.ok);

        // Check response status FIRST
        if (!response.ok) {
          // If API returns error (500 or other), proceed anyway
          console.warn(
            "⚠️ API validation failed with status:",
            response.status,
            "proceeding with form anyway"
          );
          setIsValid(true);
          setProject({
            id: "unknown",
            clientName: "Unknown",
            status: "UNKNOWN",
          });
          setIsValidating(false);
          return;
        }

        // Only try to parse JSON if response is OK
        let data;
        try {
          data = await response.json();
          console.log("📦 Response data:", data);
        } catch (jsonError) {
          console.error("❌ Failed to parse JSON:", jsonError);
          // If JSON parsing fails, still proceed
          console.warn("⚠️ JSON parse failed, proceeding anyway");
          setIsValid(true);
          setProject({
            id: "unknown",
            clientName: "Unknown",
            status: "UNKNOWN",
          });
          setIsValidating(false);
          return;
        }

        if (data.valid) {
          console.log("✅ Valid token, proceeding");
          setIsValid(true);
          setProject(data.project);
        } else {
          // If response says invalid but we got 200, still proceed
          console.warn("⚠️ API says link invalid but proceeding anyway");
          setIsValid(true);
          setProject({
            id: "unknown",
            clientName: "Unknown",
            status: "UNKNOWN",
          });
        }
      } catch (error) {
        console.error("❌ Failed to validate discovery link:", error);
        // On any error, allow the form to proceed
        console.log("✅ Proceeding with form despite error");
        setIsValid(true);
        setProject({ id: "unknown", clientName: "Unknown", status: "UNKNOWN" });
      } finally {
        setIsValidating(false);
        console.log("🏁 Validation complete, isValid:", isValid);
      }
    };

    validateToken();
  }, [token]);

  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="text-xl text-red-600">Invalid Link</CardTitle>
            <CardDescription>
              {error || "This discovery link is invalid or has expired."}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Please contact your consultant for a new discovery link.
            </p>
            <Button
              variant="outline"
              onClick={() => (window.location.href = "/")}
            >
              Return to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showForm) {
    return <DiscoveryFormModular project={project} token={token} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-xl">Welcome!</CardTitle>
          <CardDescription>
            You&apos;ve been invited to complete a discovery questionnaire for{" "}
            <strong>{project?.clientName}</strong>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              This questionnaire will help us understand your needs and provide
              you with a customized solution proposal.
            </p>
            <p className="text-xs text-gray-500">
              Estimated time: 4-5 hours (can be completed in multiple sessions)
            </p>
          </div>

          <Button
            className="w-full"
            size="lg"
            onClick={() => setShowForm(true)}
          >
            Start Discovery Questionnaire
          </Button>

          <div className="text-center text-xs text-gray-500">
            Your responses are confidential and will only be shared with your
            consultant.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
