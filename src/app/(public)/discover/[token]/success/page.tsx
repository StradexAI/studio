"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";

export default function DiscoverySuccessPage() {
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

          <Button
            variant="outline"
            className="w-full"
            onClick={() => window.close()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Close Window
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
