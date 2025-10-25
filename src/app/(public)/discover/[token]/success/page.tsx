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
import { CheckCircle, ArrowLeft, X } from "lucide-react";

export default function DiscoverySuccessPage() {
  const [closeAttempted, setCloseAttempted] = useState(false);

  const handleCloseWindow = () => {
    setCloseAttempted(true);

    // Try to close the window
    if (window.opener) {
      // If opened in a popup, close it
      window.close();
    } else {
      // If not a popup, try to go back or show alternative
      if (window.history.length > 1) {
        window.history.back();
      } else {
        // If no history, redirect to a safe page
        window.location.href = "about:blank";
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-xl text-green-600">Thank You!</CardTitle>
          <CardDescription>
            Your discovery questionnaire has been submitted successfully.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              We&apos;ve received your responses and will review them carefully.
              Your consultant will be in touch within 24-48 hours with your
              customized solution proposal.
            </p>
            <p className="text-xs text-gray-500">
              You can close this window now.
            </p>
          </div>

          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleCloseWindow}
            >
              <X className="h-4 w-4 mr-2" />
              Close Window
            </Button>

            {closeAttempted && (
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-2">
                  If the window doesn&apos;t close automatically, you can:
                </p>
                <div className="space-y-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => window.history.back()}
                  >
                    <ArrowLeft className="h-3 w-3 mr-1" />
                    Go Back
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-xs"
                    onClick={() => (window.location.href = "about:blank")}
                  >
                    Close Tab
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
