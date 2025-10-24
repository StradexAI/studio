"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Users, Clock, CheckCircle, AlertCircle } from "lucide-react";

export default function DashboardPage() {
  const { data: session } = useSession();

  // Mock data - will be replaced with real data from API
  const stats = [
    {
      title: "Projects in Discovery",
      value: "12",
      description: "Clients completing discovery",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Pending Review",
      value: "8",
      description: "Awaiting consultant review",
      icon: Clock,
      color: "text-yellow-600",
    },
    {
      title: "In Progress",
      value: "5",
      description: "Implementation ongoing",
      icon: AlertCircle,
      color: "text-orange-600",
    },
    {
      title: "Completed",
      value: "23",
      description: "Successfully deployed",
      icon: CheckCircle,
      color: "text-green-600",
    },
  ];

  const recentProjects = [
    {
      id: "1",
      clientName: "TechCorp Industries",
      status: "PENDING_REVIEW",
      createdAt: "2024-10-23",
    },
    {
      id: "2",
      clientName: "FinanceBank Ltd",
      status: "IN_PROGRESS",
      createdAt: "2024-10-22",
    },
    {
      id: "3",
      clientName: "RetailCo Inc",
      status: "DISCOVERY",
      createdAt: "2024-10-21",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DISCOVERY":
        return "bg-blue-100 text-blue-800";
      case "PENDING_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "IN_PROGRESS":
        return "bg-orange-100 text-orange-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "DISCOVERY":
        return "Discovery";
      case "PENDING_REVIEW":
        return "Pending Review";
      case "IN_PROGRESS":
        return "In Progress";
      case "COMPLETED":
        return "Completed";
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {session?.user?.name || "Consultant"}!
              </h1>
              <p className="text-gray-600 mt-1">
                Here's what's happening with your projects today.
              </p>
            </div>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Project
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-500 mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>
                Your latest project activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {project.clientName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Created {new Date(project.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {getStatusLabel(project.status)}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks and shortcuts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New Project
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-2" />
                  View All Projects
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Clock className="h-4 w-4 mr-2" />
                  Review Pending Analysis
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Generate Proposals
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
