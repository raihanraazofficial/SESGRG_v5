import React, { useState, useEffect } from "react";
import { Search, Trophy, Calendar, ArrowRight, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import apiService from "../services/api";

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    title_filter: '',
    category_filter: '',
    sort_by: 'date',
    sort_order: 'desc',
    page: 1,
    per_page: 12
  });

  useEffect(() => {
    fetchAchievements();
  }, [filters]);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAchievements(filters);
      setAchievements(response.achievements || []);
      setPagination(response.pagination || {});
    } catch (error) {
      console.error('Error fetching achievements:', error);
    } finally {
      setLoading(false);
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
      category_filter: '',
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

  const generateBlogContent = (achievement) => {
    // Generate blog-style content from the achievement description
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
        </div>
        
        ${achievement.image ? `<div class="mb-12">
          <img src="${achievement.image}" alt="${achievement.title}" class="w-full h-96 object-cover rounded-2xl shadow-2xl">
        </div>` : ''}
        
        <div class="prose prose-lg max-w-none">
          <div class="bg-emerald-50 border-l-4 border-emerald-400 p-6 mb-8 rounded-r-lg">
            <p class="text-emerald-800 font-medium text-lg leading-relaxed">${achievement.short_description}</p>
          </div>
          
          ${achievement.description.split('\n\n').map(paragraph => {
            if (paragraph.trim().startsWith('**') && paragraph.trim().endsWith('**')) {
              return `<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-6">${paragraph.replace(/\*\*/g, '')}</h2>`;
            } else if (paragraph.trim().startsWith('*')) {
              const items = paragraph.split('*').filter(item => item.trim());
              return `<ul class="list-disc pl-6 mb-6 space-y-2">${items.map(item => `<li class="text-gray-700 leading-relaxed">${item.trim()}</li>`).join('')}</ul>`;
            } else if (paragraph.trim().startsWith('"') && paragraph.trim().endsWith('"')) {
              return `<blockquote class="border-l-4 border-gray-300 pl-6 my-8 italic text-lg text-gray-600">${paragraph}</blockquote>`;
            } else {
              return `<p class="mb-6 text-gray-700 leading-relaxed text-lg">${paragraph}</p>`;
            }
          }).join('')}
          
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-emerald-100 rounded-full">
              <Trophy className="h-8 w-8 text-emerald-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Achievements</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Celebrating our milestones, awards, and recognition in sustainable energy and smart grid research. 
            These achievements reflect our commitment to excellence and innovation in advancing the field.
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Search Achievements</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search achievements by title..."
                  value={filters.title_filter}
                  onChange={(e) => handleFilterChange('title_filter', e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex justify-end">
                <Button variant="outline" onClick={clearFilters}>
                  Clear Search
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="ml-3 text-lg text-gray-600">Loading Achievements...</span>
          </div>
        )}

        {/* Achievements Grid */}
        {!loading && achievements.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden group">
                {/* Achievement Image */}
                {achievement.image && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={achievement.image}
                      alt={achievement.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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
    </div>
  );
};

export default Achievements;