import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, DollarSign, Users, ChevronLeft, ChevronRight, Loader2, ExternalLink, RefreshCw } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import SkeletonCard from "../components/SkeletonCard";
import googleSheetsService from "../services/googleSheetsApi";

const Projects = () => {
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
  const [refreshing, setRefreshing] = useState(false);
  const [availableAreas, setAvailableAreas] = useState([]);
  const [loadingSource, setLoadingSource] = useState('');

  const researchAreas = [
    "Smart Grid Technologies",
    "Microgrids & Distributed Energy Systems", 
    "Renewable Energy Integration",
    "Grid Optimization & Stability",
    "Energy Storage Systems",
    "Power System Automation",
    "Cybersecurity and AI for Power Infrastructure"
  ];

  const statuses = ["Active", "Completed", "Planning"];

  useEffect(() => {
    fetchProjects();
  }, [filters]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setLoadingSource('⚡ Loading...');
      console.log('⚡ Fetching projects with filters:', filters);
      const response = await googleSheetsService.getProjects(filters);
      
      const projectsData = response.projects || [];
      setProjects(projectsData);
      setPagination(response.pagination || {});
      setStatistics(response.statistics || {});
      
      // Extract unique research areas from all projects
      if (projectsData.length > 0) {
        const allAreas = projectsData.flatMap(project => project.research_areas || []);
        const uniqueAreas = [...new Set(allAreas)].sort();
        setAvailableAreas(uniqueAreas);
      }
      
      console.log('✅ Projects loaded:', projectsData.length, 'items');
    } catch (error) {
      console.error('❌ Error fetching projects:', error);
      alert('Failed to load projects. Please check your internet connection and try again.');
    } finally {
      setLoading(false);
      setLoadingSource('');
    }
  };

  const handleFilterChange = (key, value) => {
    // Convert "all" to empty string for backend compatibility
    const processedValue = value === "all" ? "" : value;
    
    setFilters(prev => ({
      ...prev,
      [key]: processedValue,
      page: 1 // Reset to first page when filtering
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
    // Reset available options
    setAvailableAreas([]);
  };

  const handleRefreshData = async () => {
    try {
      setRefreshing(true);
      console.log('Refreshing projects data...');
      
      // Force refresh data (bypass cache)
      const response = await googleSheetsService.forceRefreshProjects(filters);
      console.log('Projects refreshed:', response);
      
      const projectsData = response.projects || [];
      setProjects(projectsData);
      setPagination(response.pagination || {});
      setStatistics(response.statistics || {});
      
      // Update available filters
      if (projectsData.length > 0) {
        const allAreas = projectsData.flatMap(project => project.research_areas || []);
        const uniqueAreas = [...new Set(allAreas)].sort();
        setAvailableAreas(uniqueAreas);
      }
      
      alert('Projects data refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing projects:', error);
      alert('Failed to refresh projects. Please try again.');
    } finally {
      setRefreshing(false);
    }
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900">Research Projects</h1>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshData}
              disabled={refreshing}
              className="ml-4 flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            </Button>
          </div>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Explore our ongoing and completed research projects in sustainable energy and smart grid technologies. 
            Discover how we're advancing the field through collaborative research and innovation.
          </p>
          
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
              className="px-3 py-2 md:px-6 text-sm md:text-base"
            >
              All Projects
            </Button>
            <Button
              variant={filters.status_filter === 'Active' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('status_filter', 'Active')}
              className="px-3 py-2 md:px-6 text-sm md:text-base"
            >
              Active
            </Button>
            <Button
              variant={filters.status_filter === 'Completed' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('status_filter', 'Completed')}
              className="px-3 py-2 md:px-6 text-sm md:text-base"
            >
              Completed
            </Button>
            <Button
              variant={filters.status_filter === 'Planning' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('status_filter', 'Planning')}
              className="px-3 py-2 md:px-6 text-sm md:text-base"
            >
              Planning
            </Button>
          </div>
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
                  placeholder="Search by title, status, or research area..."
                  value={filters.search_filter}
                  onChange={(e) => handleFilterChange('search_filter', e.target.value)}
                  className="pl-10 text-lg py-3"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                You can search by project title, status, or research area
              </p>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <Select
                  value={filters.status_filter}
                  onValueChange={(value) => handleFilterChange('status_filter', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Project Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    {statuses.map(status => (
                      <SelectItem key={status} value={status}>{status}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.area_filter}
                  onValueChange={(value) => handleFilterChange('area_filter', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Research Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Areas</SelectItem>
                    {researchAreas.map(area => (
                      <SelectItem key={area} value={area}>{area}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={`${filters.sort_by}-${filters.sort_order}`}
                  onValueChange={(value) => {
                    const [sort_by, sort_order] = value.split('-');
                    handleFilterChange('sort_by', sort_by);
                    handleFilterChange('sort_order', sort_order);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="start_date-desc">Start Date (Newest)</SelectItem>
                    <SelectItem value="start_date-asc">Start Date (Oldest)</SelectItem>
                    <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                    <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                  </SelectContent>
                </Select>
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
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="ml-3 text-lg text-gray-600">⚡ Loading Projects...</span>
          </div>
        )}

        {/* Projects Grid */}
        {!loading && projects.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {projects.map((project) => (
              <Card key={project.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden">
                {/* Project Image */}
                {project.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
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
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {project.description}
                      </p>
                    </div>

                    {/* Project Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-emerald-600" />
                        <span>
                          {googleSheetsService.formatDate(project.start_date)} - {googleSheetsService.formatDate(project.end_date)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2 text-emerald-600" />
                        <span>{project.budget}</span>
                      </div>
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
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between mt-12 p-6 bg-white rounded-lg shadow">
            <div className="text-sm text-gray-600">
              Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
              {Math.min(pagination.current_page * pagination.per_page, pagination.total_items)} of{' '}
              {pagination.total_items} projects
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => goToPage(pagination.current_page - 1)}
                disabled={!pagination.has_prev}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.total_pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.current_page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.current_page >= pagination.total_pages - 2) {
                    pageNum = pagination.total_pages - 4 + i;
                  } else {
                    pageNum = pagination.current_page - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === pagination.current_page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => goToPage(pagination.current_page + 1)}
                disabled={!pagination.has_next}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            {/* Go to Page */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Go to page:</span>
              <Input
                type="number"
                min="1"
                max={pagination.total_pages}
                className="w-20"
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
        )}
      </div>
    </div>
  );
};

export default Projects;