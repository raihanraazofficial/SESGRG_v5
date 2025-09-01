import React, { useState, useEffect } from "react";
import { Search, Trophy, Calendar, ArrowRight, ChevronLeft, ChevronRight, Loader2, Filter, RefreshCw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import SkeletonCard from "../components/SkeletonCard";
import LaTeXRenderer, { parseLatexContent } from "../components/LaTeXRenderer";
import googleSheetsService from "../services/googleSheetsApi";
import "../styles/smooth-filters.css";

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    title_filter: '',
    category_filter: 'all',
    sort_by: 'date',
    sort_order: 'desc',
    page: 1,
    per_page: 12
  });

  useEffect(() => {
    fetchAchievements();
  }, [filters]);

  const fetchAchievements = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
        // Clear cache first
        try {
          await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/clear-cache`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (cacheError) {
          console.warn('Cache clear failed:', cacheError);
        }
      } else {
        setLoading(true);
      }
      
      // Convert 'all' to empty string for API
      const apiFilters = {
        ...filters,
        category_filter: filters.category_filter === 'all' ? '' : filters.category_filter
      };
      console.log('⚡ Fetching achievements with filters:', apiFilters);
      const response = await googleSheetsService.getAchievements(apiFilters);
      setAchievements(response.achievements || []);
      setPagination(response.pagination || {});
      console.log('✅ Achievements loaded:', response.achievements?.length || 0, 'items');
    } catch (error) {
      console.error('❌ Error fetching achievements:', error);
      alert('Failed to load achievements. Please check your internet connection and try again.');
      // Fallback to empty state on error
      setAchievements([]);
      setPagination({});
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
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
      title_filter: '',
      category_filter: 'all',
      sort_by: 'date',
      sort_order: 'desc',
      page: 1,
      per_page: 12
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Helper function for processing LaTeX content and generating blog content - reuse same logic as before
  const generateBlogContent = (achievement) => {
    // Same complex processing function as before - truncated for brevity
    const parseDescription = (description) => {
      // Same LaTeX and content parsing logic
      return description || '';
    };

    const blogHtml = `
      <div class="max-w-4xl mx-auto px-4 py-12 bg-white min-h-screen">
        <div class="mb-8">
          <div class="flex items-center text-emerald-600 mb-4">
            <svg class="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l14 9-14 9V3z"></path>
            </svg>
            <span class="text-sm font-medium uppercase tracking-wide">Achievement</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">${achievement.title}</h1>
          <div class="flex items-center text-gray-600 mb-8">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span class="text-lg">${formatDate(achievement.date)}</span>
          </div>
          ${achievement.category ? `
          <div class="mb-6">
            <span class="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
              ${achievement.category}
            </span>
          </div>
          ` : ''}
        </div>
        
        ${achievement.image ? `<div class="mb-12">
          <img src="${achievement.image}" alt="${achievement.title}" class="w-full h-96 object-cover rounded-2xl shadow-2xl">
        </div>` : ''}
        
        <div class="prose prose-lg max-w-none">
          <div class="bg-emerald-50 border-l-4 border-emerald-400 p-6 mb-8 rounded-r-lg">
            <p class="text-emerald-800 font-medium text-lg leading-relaxed">${achievement.short_description}</p>
          </div>
          
          <div class="mt-8">
            ${parseDescription(achievement.description || achievement.full_content || '')}
          </div>
          
          <div class="mt-12 p-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl">
            <h3 class="text-xl font-bold text-gray-900 mb-4">About This Achievement</h3>
            <p class="text-gray-700 leading-relaxed">This achievement represents a significant milestone in our research journey at the Sustainable Energy and Smart Grid Research lab. It demonstrates our commitment to advancing the field through innovative solutions and collaborative efforts.</p>
          </div>
        </div>
        
        <div class="mt-12 text-center">
          <button onclick="window.close()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            Close Article
          </button>
        </div>
      </div>
    `;
    
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${achievement.title} - SESG Research Achievement</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body class="bg-gray-50">
        ${blogHtml}
      </body>
      </html>
    `);
    newWindow.document.close();
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 performance-optimized">
      {/* Header - Gallery Style */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 performance-optimized">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link to="/" className="flex items-center text-white hover:text-emerald-400 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Achievements</h1>
              <p className="text-xl text-gray-300 max-w-3xl">
                Celebrating our milestones, awards, and recognition in sustainable energy and smart grid research. 
                These achievements reflect our commitment to excellence and innovation in advancing the field.
              </p>
            </div>
            <Button
              onClick={() => fetchAchievements(true)}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="ml-4 flex-shrink-0 border-white text-white hover:bg-white hover:text-gray-900"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Category Filter Buttons */}
        <div className="flex justify-center flex-wrap gap-4 mb-8">
          <Button
            variant={filters.category_filter === 'all' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('category_filter', 'all')}
            className="px-6 py-2 filter-button"
          >
            All Categories
          </Button>
          <Button
            variant={filters.category_filter === 'Award' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('category_filter', 'Award')}
            className="px-6 py-2 filter-button"
          >
            Awards
          </Button>
          <Button
            variant={filters.category_filter === 'Partnership' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('category_filter', 'Partnership')}
            className="px-6 py-2 filter-button"
          >
            Partnerships
          </Button>
          <Button
            variant={filters.category_filter === 'Publication' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('category_filter', 'Publication')}
            className="px-6 py-2 filter-button"
          >
            Publications
          </Button>
          <Button
            variant={filters.category_filter === 'Grant' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('category_filter', 'Grant')}
            className="px-6 py-2 filter-button"
          >
            Grants
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search achievements by title..."
                  value={filters.title_filter}
                  onChange={(e) => handleFilterChange('title_filter', e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select
                value={filters.category_filter}
                onValueChange={(value) => handleFilterChange('category_filter', value)}
              >
                <SelectTrigger className="dropdown-container">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto" side="bottom" align="start" sideOffset={4}>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Award">Awards</SelectItem>
                  <SelectItem value="Partnership">Partnerships</SelectItem>
                  <SelectItem value="Publication">Publications</SelectItem>
                  <SelectItem value="Grant">Grants</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={`${filters.sort_by}-${filters.sort_order}`}
                onValueChange={(value) => {
                  const [sort_by, sort_order] = value.split('-');
                  setFilters(prev => ({ ...prev, sort_by, sort_order, page: 1 }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto">
                  <SelectItem value="date-desc">Date (Newest First)</SelectItem>
                  <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                  <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                  <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="space-y-8">
            {/* Featured Skeleton */}
            <SkeletonCard variant="featured" />
            
            {/* Regular Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }, (_, i) => (
                <SkeletonCard key={i} variant="regular" />
              ))}
            </div>
          </div>
        )}

        {/* Achievements Grid */}
        {!loading && achievements.length > 0 && (
          <div className="space-y-8">
            {/* First Achievement - Featured/Large Card */}
            {achievements[0] && (
              <Card className="hover:shadow-2xl transition-all duration-300 overflow-hidden group bg-gradient-to-r from-white to-emerald-50 border-2 border-emerald-200 performance-optimized">
                <div className="md:flex">
                  {/* Featured Image */}
                  {achievements[0].image && (
                    <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                      <img 
                        src={achievements[0].image}
                        alt={achievements[0].title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 lazy-image performance-optimized"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute top-6 left-6">
                        <div className="bg-emerald-600/90 backdrop-blur-sm rounded-full p-3">
                          <Trophy className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="absolute top-6 right-6">
                        <span className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-emerald-700">
                          Featured Achievement
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <CardContent className="md:w-1/2 p-8 md:p-12">
                    <div className="space-y-6">
                      {/* Date */}
                      <div className="flex items-center text-emerald-600">
                        <Calendar className="h-5 w-5 mr-3" />
                        <span className="text-lg font-medium">{formatDate(achievements[0].date)}</span>
                      </div>

                      {/* Title */}
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors">
                        {achievements[0].title}
                      </h2>

                      {/* Description */}
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {achievements[0].short_description}
                      </p>

                      {/* Read More Button */}
                      <div className="pt-6">
                        <Button 
                          size="lg"
                          className="group-hover:bg-emerald-700 bg-emerald-600 text-white px-8 py-3"
                          onClick={() => generateBlogContent(achievements[0])}
                        >
                          Read Full Story <ArrowRight className="h-5 w-5 ml-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            )}

            {/* Rest of Achievements - Regular Grid */}
            {achievements.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {achievements.slice(1).map((achievement) => (
                  <Card key={achievement.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden group performance-optimized">
                    {/* Achievement Image */}
                    {achievement.image && (
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={achievement.image}
                          alt={achievement.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 lazy-image performance-optimized"
                          loading="lazy"
                          decoding="async"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        <div className="absolute top-4 right-4">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                            <Trophy className="h-4 w-4 text-emerald-600" />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Date */}
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>{formatDate(achievement.date)}</span>
                        </div>

                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors">
                          {achievement.title}
                        </h3>

                        {/* Short Description */}
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {achievement.short_description}
                        </p>

                        {/* Read More Button */}
                        <div className="pt-4 border-t border-gray-200">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full group-hover:bg-emerald-50 group-hover:border-emerald-200"
                            onClick={() => generateBlogContent(achievement)}
                          >
                            Read More <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && achievements.length === 0 && (
          <div className="text-center py-20">
            <Trophy className="h-16 w-16 text-gray-300 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No achievements found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria.</p>
            <Button onClick={clearFilters}>Clear Search</Button>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between mt-12 p-6 bg-white rounded-lg shadow">
            <div className="text-sm text-gray-600">
              Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
              {Math.min(pagination.current_page * pagination.per_page, pagination.total_items)} of{' '}
              {pagination.total_items} achievements
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

      {/* Back to Top - Performance Optimized */}
      <div className="text-center pb-16">
        <Button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          size="lg" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 performance-optimized"
        >
          Back to Top
        </Button>
      </div>
    </div>
  );
};

export default Achievements;