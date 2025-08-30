import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, Clock, ChevronLeft, ChevronRight, Loader2, ArrowRight, MapPin } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import apiService from "../services/api";
import { generateAdvancedBlogContent } from "../utils/blogGenerator";

const NewsEvents = () => {
  const [newsEvents, setNewsEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    category_filter: '',
    title_filter: '',
    sort_by: 'date',
    sort_order: 'desc',
    page: 1,
    per_page: 15
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["News", "Event", "Upcoming Event"];

  useEffect(() => {
    fetchNewsEvents();
  }, [filters]);

  const fetchNewsEvents = async () => {
    try {
      setLoading(true);
      const response = await apiService.getNewsEvents(filters);
      setNewsEvents(response.news_events || []);
      setPagination(response.pagination || {});
    } catch (error) {
      console.error('Error fetching news and events:', error);
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
      category_filter: '',
      title_filter: '',
      sort_by: 'date',
      sort_order: 'desc',
      page: 1,
      per_page: 15
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'News':
        return 'bg-emerald-100 text-emerald-700';
      case 'Events':
        return 'bg-blue-100 text-blue-700';
      case 'Upcoming Events':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateBlogContent = (item) => {
    // Use the same advanced blog generator as achievements page with emerald theme
    generateAdvancedBlogContent(item, 'achievement');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">News & Events</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Stay updated with the latest news, events, and achievements from our research lab. 
            Discover our recent breakthroughs and upcoming activities in sustainable energy and smart grid research.
          </p>

          {/* Category Filter Buttons */}
          <div className="flex justify-center flex-wrap gap-4 mb-8">
            <Button
              variant={filters.category_filter === '' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('category_filter', '')}
              className="px-6 py-2"
            >
              All Categories
            </Button>
            <Button
              variant={filters.category_filter === 'News' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('category_filter', 'News')}
              className="px-6 py-2"
            >
              News
            </Button>
            <Button
              variant={filters.category_filter === 'Event' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('category_filter', 'Event')}
              className="px-6 py-2"
            >
              Events
            </Button>
            <Button
              variant={filters.category_filter === 'Upcoming Event' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('category_filter', 'Upcoming Event')}
              className="px-6 py-2"
            >
              Upcoming Events
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

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title..."
                  value={filters.title_filter}
                  onChange={(e) => handleFilterChange('title_filter', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                  <Select
                    value={filters.category_filter || "all"}
                    onValueChange={(value) => handleFilterChange('category_filter', value === "all" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                  <Select
                    value={`${filters.sort_by}-${filters.sort_order}`}
                    onValueChange={(value) => {
                      const [sort_by, sort_order] = value.split('-');
                      handleFilterChange('sort_by', sort_by);
                      handleFilterChange('sort_order', sort_order);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sort Option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="date-desc">Date (Newest First)</SelectItem>
                      <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                      <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                      <SelectItem value="title-desc">Title (Z-A)</SelectItem>
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
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="ml-3 text-lg text-gray-600">Loading News & Events...</span>
          </div>
        )}

        {/* News & Events Grid */}
        {!loading && newsEvents.length > 0 && (
          <div className="space-y-8">
            {/* First News/Event - Featured/Large Card */}
            {newsEvents[0] && (
              <Card className="hover:shadow-2xl transition-all duration-300 overflow-hidden group bg-gradient-to-r from-white to-blue-50 border-2 border-blue-200">
                <div className="md:flex">
                  {/* Featured Image */}
                  {newsEvents[0].image && (
                    <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                      <img 
                        src={newsEvents[0].image}
                        alt={newsEvents[0].title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute top-6 left-6">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(newsEvents[0].category)}`}>
                          {newsEvents[0].category}
                        </span>
                      </div>
                      <div className="absolute top-6 right-6">
                        <span className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-blue-700">
                          Featured Story
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <CardContent className="md:w-1/2 p-8 md:p-12">
                    <div className="space-y-6">
                      {/* Date and Location */}
                      <div className="space-y-2">
                        <div className="flex items-center text-blue-600">
                          <Calendar className="h-5 w-5 mr-3" />
                          <span className="text-lg font-medium">{formatDate(newsEvents[0].date)}</span>
                        </div>
                        {newsEvents[0].location && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-5 w-5 mr-3" />
                            <span className="text-lg">{newsEvents[0].location}</span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {newsEvents[0].title}
                      </h2>

                      {/* Description */}
                      <p className="text-gray-700 text-lg leading-relaxed line-clamp-4">
                        {newsEvents[0].description}
                      </p>

                      {/* Read More Button */}
                      <div className="pt-6">
                        <Button 
                          size="lg"
                          className="group-hover:bg-blue-700 bg-blue-600 text-white px-8 py-3"
                          onClick={() => generateBlogContent(newsEvents[0])}
                        >
                          Read Full Story <ArrowRight className="h-5 w-5 ml-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            )}

            {/* Rest of News & Events - Regular Grid */}
            {newsEvents.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsEvents.slice(1).map((item) => (
                  <Card key={item.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    {/* Image */}
                    {item.image && (
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Title */}
                        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors">
                          {item.title}
                        </h3>

                        {/* Date and Location */}
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{formatDate(item.date)}</span>
                          </div>
                          {item.location && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{item.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {item.description}
                        </p>

                        {/* Read More Button */}
                        <div className="pt-4 border-t border-gray-200">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full group-hover:bg-emerald-50 group-hover:border-emerald-200"
                            onClick={() => generateBlogContent(item)}
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
        {!loading && newsEvents.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No news or events found</h3>
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
              {pagination.total_items} items
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

        {/* Google Calendar Iframe */}
        <div className="mt-16">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Upcoming Events Calendar</h3>
              <div className="w-full h-96 rounded-lg overflow-hidden">
                <iframe
                  src="https://calendar.google.com/calendar/embed?src=en.bd%23holiday%40group.v.calendar.google.com&ctz=Asia%2FDhaka"
                  style={{ border: 0 }}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  className="rounded-lg"
                  title="SESG Research Events Calendar"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewsEvents;