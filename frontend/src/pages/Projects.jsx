import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, DollarSign, Users, ChevronLeft, ChevronRight, Loader2, ExternalLink, RefreshCw, ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import SkeletonCard from "../components/SkeletonCard";
import { useProjects } from "../contexts/ProjectsContext";
import { useAuth } from "../contexts/AuthContext";
import "../styles/smooth-filters.css";

const Projects = () => {
  const { 
    getPaginatedProjects, 
    getFilterOptions, 
    researchAreas,
    statuses,
    formatDate
  } = useProjects();
  
  const { isAuthenticated } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [statistics, setStatistics] = useState({});
  const [filters, setFilters] = useState({
    status_filter: '',
    area_filter: '',
    title_filter: '',
    search_filter: '',
    sort_by: 'start_date',
    sort_order: 'desc',
    page: 1,
    per_page: 20
  });
  const [showFilters, setShowFilters] = useState(false);
  const [availableAreas, setAvailableAreas] = useState([]);
  const [allAreas, setAllAreas] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      
      const response = getPaginatedProjects(filters);
      const projectsData = response.projects || [];
      
      setProjects(projectsData);
      setPagination(response.pagination || {});
      setStatistics(response.statistics || {
        total_projects: 0,
        active_projects: 0,
        completed_projects: 0,
        planning_projects: 0
      });
      
      // Get filter options
      const filterOptions = getFilterOptions();
      setAvailableAreas(filterOptions.areas);
      setAllAreas(filterOptions.areas);
      
      console.log('✅ Projects loaded successfully:', projectsData.length, 'items');
    } catch (error) {
      console.error('Error fetching projects:', error);
      setStatistics({
        total_projects: 0,
        active_projects: 0,
        completed_projects: 0,
        planning_projects: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const processedValue = value === "all" ? "" : value;
    
    setFilters(prev => ({
      ...prev,
      [key]: processedValue,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.total_pages) {
      handlePageChange(page);
    }
  };

  const clearFilters = () => {
    setFilters({
      status_filter: '',
      area_filter: '',
      title_filter: '',
      search_filter: '',
      sort_by: 'start_date',
      sort_order: 'desc',
      page: 1,
      per_page: 20
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700';
      case 'Completed':
        return 'bg-blue-100 text-blue-700';
      case 'Planning':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen pt-16 md:pt-20 bg-gray-50 performance-optimized">
      {/* Header - Gallery Style */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 performance-optimized">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link to="/" className="flex items-center text-white hover:text-emerald-400 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Research Projects</h1>
              <p className="text-xl text-gray-300 max-w-3xl">
                Explore our ongoing and completed research projects in sustainable energy and smart grid technologies. 
                Discover how we're advancing the field through collaborative research and innovation.
              </p>
            </div>
            
            {/* Only show Admin Login button for non-authenticated users */}
            {!isAuthenticated && (
              <div className="flex flex-col items-start space-y-2">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  <span>Admin Login</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center p-6 border-l-4 border-l-emerald-600 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <p className="text-3xl font-bold text-emerald-600 mb-2">{statistics.total_projects || 0}</p>
              <p className="text-gray-600 font-medium">Total Projects</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6 border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <p className="text-3xl font-bold text-blue-600 mb-2">{statistics.active_projects || 0}</p>
              <p className="text-gray-600 font-medium">Active Projects</p>
            </CardContent>
          </Card>
          <Card className="text-center p-6 border-l-4 border-l-purple-600 hover:shadow-lg transition-shadow">
            <CardContent className="p-0">
              <p className="text-3xl font-bold text-purple-600 mb-2">{statistics.completed_projects || 0}</p>
              <p className="text-gray-600 font-medium">Completed Projects</p>
            </CardContent>
          </Card>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
          <Button
            variant={filters.status_filter === '' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('status_filter', '')}
            className="px-3 py-2 md:px-6 text-sm md:text-base filter-button"
          >
            All Projects
          </Button>
          <Button
            variant={filters.status_filter === 'Active' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('status_filter', 'Active')}
            className="px-3 py-2 md:px-6 text-sm md:text-base filter-button"
          >
            Active
          </Button>
          <Button
            variant={filters.status_filter === 'Completed' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('status_filter', 'Completed')}
            className="px-3 py-2 md:px-6 text-sm md:text-base filter-button"
          >
            Completed
          </Button>
          <Button
            variant={filters.status_filter === 'Planning' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('status_filter', 'Planning')}
            className="px-3 py-2 md:px-6 text-sm md:text-base filter-button"
          >
            Planning
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
              </Button>
            </div>

            {/* Single Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title, status, investigator, or research area..."
                  value={filters.search_filter}
                  onChange={(e) => handleFilterChange('search_filter', e.target.value)}
                  className="pl-10 text-lg py-3"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                You can search by project title, status, principal investigator, or research area
              </p>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg dropdown-container" style={{overflow: 'visible'}}>
                <Select
                  value={filters.status_filter || "all"}
                  onValueChange={(value) => handleFilterChange('status_filter', value)}
                >
                  <SelectTrigger className="dropdown-container">
                    <SelectValue placeholder="Filter by Status" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64 overflow-y-auto" side="bottom" align="start" sideOffset={4}>
                    <SelectItem value="all">All Status</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.area_filter || "all"}
                  onValueChange={(value) => handleFilterChange('area_filter', value)}
                >
                  <SelectTrigger className="dropdown-container">
                    <SelectValue placeholder="Filter by Research Area" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64 overflow-y-auto" side="bottom" align="start" sideOffset={4}>
                    <SelectItem value="all">All Areas</SelectItem>
                    {allAreas.length > 0 ? allAreas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    )) : researchAreas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex space-x-2">
                  <Select
                    value={`${filters.sort_by}-${filters.sort_order}`}
                    onValueChange={(value) => {
                      const [sort_by, sort_order] = value.split('-');
                      handleFilterChange('sort_by', sort_by);
                      handleFilterChange('sort_order', sort_order);
                    }}
                  >
                    <SelectTrigger className="dropdown-container">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64 overflow-y-auto" side="bottom" align="start" sideOffset={4}>
                      <SelectItem value="start_date-desc">Start Date (Newest)</SelectItem>
                      <SelectItem value="start_date-asc">Start Date (Oldest)</SelectItem>
                      <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                      <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                      <SelectItem value="status-asc">Status (A-Z)</SelectItem>
                      <SelectItem value="status-desc">Status (Z-A)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Clear Filters */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="space-y-8">
            {/* Statistics Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Projects Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {Array.from({ length: 6 }, (_, i) => (
                <SkeletonCard key={i} variant="regular" />
              ))}
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden performance-optimized">
                {/* Project Image */}
                {project.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500 lazy-image performance-optimized"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                        {project.status}
                      </span>
                    </div>
                  </div>
                )}
                
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Title and Description */}
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                          {project.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed">
                          {project.description}
                        </p>
                      </div>
                    </div>

                    {/* Project Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
                        <span>
                          {formatDate(project.start_date)} - {formatDate(project.end_date)}
                        </span>
                      </div>
                      {project.budget && (
                        <div className="flex items-center text-gray-600">
                          <DollarSign className="h-4 w-4 mr-2 text-emerald-600" />
                          <span>{project.budget}</span>
                        </div>
                      )}
                    </div>

                    {/* Principal Investigator */}
                    <div>
                      <p className="text-sm font-medium text-gray-900">Principal Investigator:</p>
                      <p className="text-sm text-gray-600">{project.principal_investigator}</p>
                    </div>

                    {/* Team Members */}
                    {project.team_members && project.team_members.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 mb-2">Team Members:</p>
                        <div className="flex flex-wrap gap-2">
                          {project.team_members.slice(0, 3).map((member, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                            >
                              {member}
                            </span>
                          ))}
                          {project.team_members.length > 3 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                              +{project.team_members.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Research Areas */}
                    <div className="flex flex-wrap gap-2">
                      {project.research_areas.map((area, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full"
                        >
                          {area}
                        </span>
                      ))}
                    </div>

                    {/* Funding Agency */}
                    {project.funding_agency && (
                      <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-900">Funded by:</p>
                            <p className="text-sm text-gray-600">{project.funding_agency}</p>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center text-gray-600">
                              <Users className="h-4 w-4 mr-1" />
                              <span className="text-sm">{(project.team_members?.length || 0) + 1} members</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Project Website Link */}
                    {project.website && (
                      <div className="pt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full"
                          onClick={() => window.open(project.website, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Visit Project Website
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && projects.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No projects found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters.</p>
            <div className="space-x-4">
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.total_pages > 1 && (
          <div className="mt-12 p-4 md:p-6 bg-white rounded-lg shadow">
            <div className="text-sm text-gray-600 text-center mb-4">
              Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
              {Math.min(pagination.current_page * pagination.per_page, pagination.total_items)} of{' '}
              {pagination.total_items} projects
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(pagination.current_page - 1)}
                  disabled={!pagination.has_prev}
                  className="text-xs md:text-sm"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <div className="flex space-x-1">
                  {Array.from({ length: Math.min(3, pagination.total_pages) }, (_, i) => {
                    let pageNum;
                    if (pagination.total_pages <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.current_page <= 2) {
                      pageNum = i + 1;
                    } else if (pagination.current_page >= pagination.total_pages - 1) {
                      pageNum = pagination.total_pages - 2 + i;
                    } else {
                      pageNum = pagination.current_page - 1 + i;
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={pageNum === pagination.current_page ? "default" : "outline"}
                        size="sm"
                        onClick={() => goToPage(pageNum)}
                        className="w-8 md:w-10 text-xs md:text-sm"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToPage(pagination.current_page + 1)}
                  disabled={!pagination.has_next}
                  className="text-xs md:text-sm"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs md:text-sm text-gray-600">Go to page:</span>
                <Input
                  type="number"
                  min="1"
                  max={pagination.total_pages}
                  className="w-16 md:w-20 text-xs md:text-sm"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const page = parseInt(e.target.value);
                      if (page && page >= 1 && page <= pagination.total_pages) {
                        goToPage(page);
                        e.target.value = '';
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Back to Top */}
        <div className="text-center pt-8 pb-16">
          <Button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            size="lg" 
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 performance-optimized"
          >
            Back to Top
          </Button>
        </div>
      </div>

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />

      <AddProjectModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddProject}
        researchAreas={researchAreas}
        statuses={statuses}
      />

      <EditProjectModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedProject(null);
        }}
        onUpdate={handleEditProject}
        project={selectedProject}
        researchAreas={researchAreas}
        statuses={statuses}
      />

      <DeleteProjectModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedProject(null);
        }}
        onDelete={handleDeleteProject}
        project={selectedProject}
      />
    </div>
  );
};

export default Projects;