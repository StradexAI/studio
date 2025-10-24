import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            StradexAI Agentforce Studio
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Automation platform for Agentforce consultants that reduces implementation time from 600 hours to 150 hours
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-primary">75% Time Reduction</CardTitle>
              <CardDescription>
                Deliver projects 4X faster with AI-powered automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                From 24-week traditional approach to 8-week delivery while maintaining expert positioning with clients.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">AI-Powered Analysis</CardTitle>
              <CardDescription>
                Generate professional analysis in minutes, not hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Claude AI analyzes discovery responses and generates comprehensive architecture recommendations.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-primary">Client-Facing Professional</CardTitle>
              <CardDescription>
                Clients see only consultant expertise, never AI automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                All automation happens behind the scenes. Clients receive professional consultant-led deliverables.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-16">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
            <p className="text-gray-600 mb-6">
              This platform is currently in development. Contact us to learn more about early access.
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/login">
                <Button size="lg">
                  Consultant Login
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
