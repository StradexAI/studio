"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Search, Filter } from "lucide-react";
import Link from "next/link";

interface Project {
  id: string;
  clientName: string;
  status: string;
  createdAt: string;
  hasDiscoveryResponse: boolean;
  hasAnalysis: boolean;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/projects");
      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DISCOVERY":
        return "bg-blue-100 text-blue-800";
      case "PENDING_REVIEW":
        return "bg-yellow-100 text-yellow-800";
      case "PROPOSAL_DRAFT":
        return "bg-orange-100 text-orange-800";
      case "PROPOSAL_SENT":
        return "bg-purple-100 text-purple-800";
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
      case "PROPOSAL_DRAFT":
        return "Proposal Draft";
      case "PROPOSAL_SENT":
        return "Proposal Sent";
      case "COMPLETED":
        return "Completed";
      default:
        return status;
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600 mt-1">
                Manage your client projects and track their progress.
              </p>
            </div>
            <Link href="/projects/new">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent w-full"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="">All Statuses</option>
            <option value="DISCOVERY">Discovery</option>
            <option value="PENDING_REVIEW">Pending Review</option>
            <option value="PROPOSAL_DRAFT">Proposal Draft</option>
            <option value="PROPOSAL_SENT">Proposal Sent</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{project.clientName}</CardTitle>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      project.status
                    )}`}
                  >
                    {getStatusLabel(project.status)}
                  </span>
                </div>
                <CardDescription>
                  Created {new Date(project.createdAt).toLocaleDateString()}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`w-2 h-2 rounded-full ${project.hasDiscoveryResponse ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    Discovery {project.hasDiscoveryResponse ? 'Complete' : 'Pending'}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className={`w-2 h-2 rounded-full ${project.hasAnalysis ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    Analysis {project.hasAnalysis ? 'Complete' : 'Pending'}
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Link href={`/projects/${project.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  {project.hasAnalysis && (
                    <Link href={`/projects/${project.id}/proposal`} className="flex-1">
                      <Button size="sm" className="w-full">
                        Generate Proposal
                      </Button>
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 text-lg mb-4">
              {projects.length === 0 ? "No projects yet" : "No projects match your filters"}
            </div>
            {projects.length === 0 && (
              <Link href="/projects/new">
                <Button>Create Your First Project</Button>
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
