import React, { useState, useMemo } from "react";
import { Calendar, DollarSign, Users, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { projects } from "../mock/data";

const Projects = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const statuses = ["all", "Active", "Completed", "Planning"];
  const categories = ["all", "Machine Learning", "Grid Resilience", "Renewable Energy"];

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesStatus = selectedStatus === "all" || project.status === selectedStatus;
      const matchesCategory = selectedCategory === "all" || project.category === selectedCategory;
      return matchesStatus && matchesCategory;
    });
  }, [selectedStatus, selectedCategory]);

  const getStatusIcon = (status) => {
    switch (status) {
      case "Active":
        return <AlertCircle className="h-4 w-4" />;
      case "Completed":
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Completed":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-amber-100 text-amber-700 border-amber-200";
    }
  };

  const ProjectCard = ({ project }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <Badge className={`${getStatusColor(project.status)} border flex items-center gap-1`}>
              {getStatusIcon(project.status)}
              {project.status}
            </Badge>
            <Badge variant="outline" className="text-gray-600">
              {project.category}
            </Badge>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 hover:text-emerald-600 transition-colors">
            {project.title}
          </h3>
          
          <p className="text-gray-600 leading-relaxed">
            {project.description}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2" />
              <span>
                {new Date(project.startDate).toLocaleDateString()} - {new Date(project.endDate).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>{project.funding}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-gray-600">
              <strong className="mr-2">Sponsor:</strong> {project.sponsor}
            </div>
            <div className="flex items-start text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2 mt-0.5" />
              <div>
                <strong>Team:</strong> {project.teamMembers.join(", ")}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Research Projects</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our ongoing and completed research projects advancing sustainable energy technologies and smart grid systems.
          </p>
        </div>

        {/* Project Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <p className="text-2xl font-bold text-emerald-600">{projects.length}</p>
            <p className="text-sm text-gray-600">Total Projects</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-600">
              {projects.filter(p => p.status === "Active").length}
            </p>
            <p className="text-sm text-gray-600">Active Projects</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <p className="text-2xl font-bold text-purple-600">
              ${projects.reduce((sum, p) => sum + parseFloat(p.funding.replace(/[$M]/g, "")), 0).toFixed(1)}M
            </p>
            <p className="text-sm text-gray-600">Total Funding</p>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <p className="text-2xl font-bold text-amber-600">
              {projects.filter(p => p.status === "Completed").length}
            </p>
            <p className="text-sm text-gray-600">Completed</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status === "all" ? "All Statuses" : status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Showing {filteredProjects.length} of {projects.length} projects
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Clock className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more projects.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;