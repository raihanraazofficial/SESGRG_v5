import React, { useState, useEffect } from "react";
import { Search, Filter, Copy, ExternalLink, Mail, ChevronLeft, ChevronRight, Loader2, RefreshCw, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import SkeletonCard from "../components/SkeletonCard";
import googleSheetsService from "../services/googleSheetsApi";

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [statistics, setStatistics] = useState({});
  const [filters, setFilters] = useState({
    year_filter: '',
    area_filter: '',
    category_filter: '',
    author_filter: '',
    title_filter: '',
    search_filter: '',
    sort_by: 'year',
    sort_order: 'desc',
    page: 1,
    per_page: 20
  });
  const [showFilters, setShowFilters] = useState(false);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableAreas, setAvailableAreas] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingSource, setLoadingSource] = useState(''); // Track if loading from cache or fresh

  const researchAreas = [
    "Smart Grid Technologies",
    "Microgrids & Distributed Energy Systems", 
    "Renewable Energy Integration",
    "Grid Optimization & Stability",
    "Energy Storage Systems",
    "Power System Automation",
    "Cybersecurity and AI for Power Infrastructure"
  ];

  const categories = ["Journal Articles", "Conference Proceedings", "Book Chapters"];
  const years = Array.from({length: 10}, (_, i) => (new Date().getFullYear() - i).toString());

  useEffect(() => {
    fetchPublications();
  }, [filters]);

  const fetchPublications = async (retryCount = 0) => {
    try {
      setLoading(true);
      setLoadingSource('⚡ Loading...');
      console.log('Fetching publications with filters:', filters);
      
      const response = await googleSheetsService.getPublications(filters);
      console.log('Publications response:', response);
      
      const pubs = response.publications || [];
      console.log('Publications data:', pubs.length, 'items');
      
      // Only update state if we have valid response
      if (response && (pubs.length > 0 || response.statistics)) {
        setPublications(pubs);
        setPagination(response.pagination || {});
        setStatistics(response.statistics || {});
        
        // Extract unique years and research areas from all publications
        if (pubs.length > 0) {
          const uniqueYears = [...new Set(pubs.map(pub => pub.year))].sort((a, b) => b - a);
          const allAreas = pubs.flatMap(pub => pub.research_areas || []);
          const uniqueAreas = [...new Set(allAreas)].sort();
          
          setAvailableYears(uniqueYears);
          setAvailableAreas(uniqueAreas);
        }
        
        console.log('✅ Publications loaded successfully:', pubs.length, 'items');
      } else {
        console.log('⚠️ Empty response received, keeping existing data');
        // Keep existing data, just set default statistics if none exist
        if (!statistics.total_publications) {
          setStatistics({
            total_publications: 0,
            total_citations: 0,
            latest_year: new Date().getFullYear(),
            total_areas: 7
          });
        }
      }
    } catch (error) {
      console.error('Error fetching publications:', error);
      
      // Retry once on first failure
      if (retryCount === 0) {
        console.log('🔄 Retrying publications fetch after error...');
        setTimeout(() => fetchPublications(1), 2000);
        return;
      }
      
      // On final failure, set empty defaults
      console.error('❌ Final failure fetching publications');
      setStatistics({
        total_publications: 0,
        total_citations: 0,
        latest_year: new Date().getFullYear(),
        total_areas: 7
      });
      
      // Don't show alert immediately - user can use refresh button
      console.log('💡 User can use Refresh Data button to retry');
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

  const copyPaperCitation = async (publication) => {
    const citation = googleSheetsService.generateIEEECitation(publication);
    const success = await googleSheetsService.copyToClipboard(citation);
    if (success) {
      alert('Citation copied to clipboard!');
    } else {
      alert('Failed to copy citation. Please try again.');
    }
  };

  const requestPaper = (publication) => {
    const subject = `Request for Paper: ${publication.title}`;
    const body = `Dear SESG Research Team,

I would like to request access to the following paper:

Title: ${publication.title}
Authors: ${publication.authors.join(', ')}
Publication: ${publication.publication_info}

Thank you for your time.

Best regards,`;
    
    window.location.href = `mailto:sesg@bracu.ac.bd?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const renderIEEEFormat = (publication) => {
    try {
      // Generate proper IEEE citation based on category
      const authors = Array.isArray(publication.authors) ? publication.authors.join(', ') : (publication.authors || '');
      const title = `"${publication.title}"`;
      const category = publication.category || 'Journal Articles';
      
      if (category === "Journal Articles") {
        let citation = `<strong>${authors}</strong>, ${title}`;
        
        if (publication.journal_name) {
          citation += `, <em>${publication.journal_name}</em>`;
        }
        
        if (publication.volume) {
          citation += `, vol. ${publication.volume}`;
        }
        
        if (publication.issue) {
          citation += `, no. ${publication.issue}`;
        }
        
        if (publication.pages) {
          citation += `, pp. ${publication.pages}`;
        }
        
        citation += `, ${publication.year}.`;
        return citation;
        
      } else if (category === "Conference Proceedings") {
        let citation = `<strong>${authors}</strong>, ${title}`;
        
        if (publication.conference_name) {
          citation += `, <em>${publication.conference_name}</em>`;
        }
        
        // Location (city, country)
        const location = [];
        if (publication.city) location.push(publication.city);
        if (publication.country) location.push(publication.country);
        if (location.length > 0) {
          citation += `, ${location.join(', ')}`;
        }
        
        if (publication.pages) {
          citation += `, pp. ${publication.pages}`;
        }
        
        citation += `, ${publication.year}.`;
        return citation;
        
      } else if (category === "Book Chapters") {
        let citation = `<strong>${authors}</strong>, ${title}`;
        
        if (publication.book_title) {
          citation += `, <em>${publication.book_title}</em>`;
        }
        
        if (publication.editor) {
          citation += `, ${publication.editor}, Ed(s).`;
        }
        
        if (publication.publisher) {
          citation += ` ${publication.publisher}`;
        }
        
        // Location for book chapters
        const location = [];
        if (publication.city) location.push(publication.city);
        if (publication.country) location.push(publication.country);
        if (location.length > 0) {
          citation += `, ${location.join(', ')}`;
        }
        
        if (publication.pages) {
          citation += `, pp. ${publication.pages}`;
        }
        
        citation += `, ${publication.year}.`;
        return citation;
      }
      
      // Generic fallback
      return `<strong>${authors}</strong>, ${title}, ${publication.year}.`;
      
    } catch (error) {
      console.error('Error generating IEEE citation:', error);
      return 'Citation format error';
    }
  };

  const clearFilters = () => {
    setFilters({
      year_filter: '',
      area_filter: '',
      category_filter: '',
      author_filter: '',
      title_filter: '',
      search_filter: '',
      sort_by: 'year',
      sort_order: 'desc',
      page: 1,
      per_page: 20
    });
    // Reset available options
    setAvailableYears([]);
    setAvailableAreas([]);
  };

  const handleRefreshData = async () => {
    try {
      setRefreshing(true);
      console.log('Refreshing publications data...');
      
      // Force refresh data (bypass cache)
      const response = await googleSheetsService.forceRefreshPublications(filters);
      console.log('Publications refreshed:', response);
      
      const pubs = response.publications || [];
      setPublications(pubs);
      setPagination(response.pagination || {});
      setStatistics(response.statistics || {});
      
      // Update available filters
      if (pubs.length > 0) {
        const uniqueYears = [...new Set(pubs.map(pub => pub.year))].sort((a, b) => b - a);
        const allAreas = pubs.flatMap(pub => pub.research_areas || []);
        const uniqueAreas = [...new Set(allAreas)].sort();
        
        setAvailableYears(uniqueYears);
        setAvailableAreas(uniqueAreas);
      }
      
      alert('Publications data refreshed successfully!');
    } catch (error) {
      console.error('Error refreshing publications:', error);
      alert('Failed to refresh publications. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 performance-optimized">
      <style>{`
        .ieee-citation em {
          font-style: italic;
          font-weight: normal;
        }
        .ieee-citation strong {
          font-weight: bold;
        }
        .ieee-citation {
          line-height: 1.6;
          font-size: 14px;
        }
        @media (min-width: 768px) {
          .ieee-citation {
            font-size: 16px;
          }
        }
      `}</style>
      {/* Header - People Style */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-24 performance-optimized">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link to="/" className="flex items-center text-white hover:text-emerald-400 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Publications</h1>
              <p className="text-xl text-gray-300 max-w-3xl">
                Explore our research publications in sustainable energy and smart grid technologies. 
                Discover cutting-edge research that's shaping the future of energy systems.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshData}
              disabled={refreshing}
              className="ml-4 flex items-center space-x-2 border-white text-white hover:bg-white hover:text-gray-900"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">{refreshing ? 'Refreshing...' : 'Refresh Data'}</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">

        {/* Header - Original Content */}
        <div className="text-center mb-12">
          <div style={{display: 'none'}}>{/* Hidden original header */}</div>
          
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="text-center p-6 border-l-4 border-l-emerald-600 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <p className="text-3xl font-bold text-emerald-600 mb-2">{statistics.total_publications || 0}</p>
                <p className="text-gray-600 font-medium">Total Publications</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <p className="text-3xl font-bold text-blue-600 mb-2">{statistics.total_citations || 0}</p>
                <p className="text-gray-600 font-medium">Total Citations</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-l-4 border-l-purple-600 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <p className="text-3xl font-bold text-purple-600 mb-2">{statistics.latest_year || new Date().getFullYear()}</p>
                <p className="text-gray-600 font-medium">Latest Year</p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 border-l-4 border-l-orange-600 hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <p className="text-3xl font-bold text-orange-600 mb-2">{statistics.total_areas || 7}</p>
                <p className="text-gray-600 font-medium">Total Research Areas</p>
              </CardContent>
            </Card>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8">
            <Button
              variant={filters.category_filter === '' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('category_filter', '')}
              className="px-3 py-2 md:px-6 text-sm md:text-base"
            >
              All Publications
            </Button>
            <Button
              variant={filters.category_filter === 'Journal Articles' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('category_filter', 'Journal Articles')}
              className="px-3 py-2 md:px-6 text-sm md:text-base"
            >
              Journals
            </Button>
            <Button
              variant={filters.category_filter === 'Conference Proceedings' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('category_filter', 'Conference Proceedings')}
              className="px-3 py-2 md:px-6 text-sm md:text-base"
            >
              Conferences
            </Button>
            <Button
              variant={filters.category_filter === 'Book Chapters' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('category_filter', 'Book Chapters')}
              className="px-3 py-2 md:px-6 text-sm md:text-base"
            >
              Book Chapters
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
                  placeholder="Search by title, author, or year..."
                  value={filters.search_filter}
                  onChange={(e) => handleFilterChange('search_filter', e.target.value)}
                  className="pl-10 text-lg py-3"
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">
                You can search by publication title, author name, or publication year
              </p>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <Select
                  value={filters.year_filter || "all"}
                  onValueChange={(value) => handleFilterChange('year_filter', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Year" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64 overflow-y-auto">
                    <SelectItem value="all">All Years</SelectItem>
                    {availableYears.length > 0 ? availableYears.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    )) : years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.category_filter || "all"}
                  onValueChange={(value) => handleFilterChange('category_filter', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.area_filter || "all"}
                  onValueChange={(value) => handleFilterChange('area_filter', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by Research Area" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Areas</SelectItem>
                    {availableAreas.length > 0 ? availableAreas.map(area => (
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
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="year-desc">Year (Newest First)</SelectItem>
                      <SelectItem value="year-asc">Year (Oldest First)</SelectItem>
                      <SelectItem value="citations-desc">Citations (High to Low)</SelectItem>
                      <SelectItem value="citations-asc">Citations (Low to High)</SelectItem>
                      <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                      <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                      <SelectItem value="area-asc">Research Area (A-Z)</SelectItem>
                      <SelectItem value="area-desc">Research Area (Z-A)</SelectItem>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white p-6 rounded-lg border shadow-sm">
                    <div className="h-8 bg-gray-300 rounded w-16 mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-32"></div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Publications Skeleton */}
            <div className="space-y-6">
              {Array.from({ length: 5 }, (_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-white p-8 rounded-lg border shadow-sm">
                    <div className="space-y-4">
                      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-20 bg-gray-100 rounded-lg"></div>
                      <div className="flex space-x-2">
                        <div className="h-6 bg-gray-300 rounded w-20"></div>
                        <div className="h-6 bg-gray-300 rounded w-24"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Publications List */}
        {!loading && publications.length > 0 && (
          <div className="space-y-6">
            {publications.map((publication) => (
              <Card key={publication.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start space-y-4 lg:space-y-0">
                    <div className="flex-1 lg:mr-6">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 leading-tight">
                        {publication.title}
                      </h3>
                      
                      {/* IEEE Formatted Citation */}
                      <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                        <p className="text-gray-800 text-sm md:text-base leading-relaxed">
                          <span 
                            className="ieee-citation"
                            dangerouslySetInnerHTML={{
                              __html: renderIEEEFormat(publication)
                            }}
                          />
                        </p>
                      </div>

                      {/* Research Areas - 7 colors for 7 research areas */}
                      <div className="flex flex-wrap gap-2">
                        {publication.research_areas.map((area, index) => (
                          <span
                            key={index}
                            className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                              index % 7 === 0 ? 'bg-emerald-100 text-emerald-700' :
                              index % 7 === 1 ? 'bg-blue-100 text-blue-700' :
                              index % 7 === 2 ? 'bg-purple-100 text-purple-700' :
                              index % 7 === 3 ? 'bg-orange-100 text-orange-700' :
                              index % 7 === 4 ? 'bg-red-100 text-red-700' :
                              index % 7 === 5 ? 'bg-indigo-100 text-indigo-700' :
                              'bg-pink-100 text-pink-700'
                            }`}
                          >
                            {area}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex lg:flex-col justify-between lg:justify-start items-center lg:items-end lg:text-right space-x-4 lg:space-x-0 lg:space-y-2">
                      <span className={`px-3 py-1 rounded-full text-xs md:text-sm font-medium ${
                        publication.category === 'Journal Articles' ? 'bg-blue-100 text-blue-700' :
                        publication.category === 'Conference Proceedings' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {publication.category}
                      </span>
                      <div className="text-center lg:text-right">
                        <p className="text-xl md:text-2xl font-bold text-emerald-600">
                          {publication.citations}
                        </p>
                        <p className="text-xs md:text-sm text-gray-500">Citations</p>
                      </div>
                      <div className="text-center lg:text-right">
                        <p className="text-lg font-semibold text-gray-900">{publication.year}</p>
                        <p className="text-xs md:text-sm text-gray-500">Published</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between pt-3 border-t border-gray-200 space-y-2 md:space-y-0">
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
                      {publication.open_access && publication.full_paper_link ? (
                        <Button
                          variant="default"
                          className="bg-emerald-600 hover:bg-emerald-700 text-sm md:text-base"
                          onClick={() => window.open(publication.full_paper_link, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Read Full Paper
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => requestPaper(publication)}
                          className="text-sm md:text-base"
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Request Full Paper
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        onClick={() => copyPaperCitation(publication)}
                        className="text-sm md:text-base"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Citation
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && publications.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No publications found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters.</p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.total_pages > 1 && (
          <div className="mt-12 p-4 md:p-6 bg-white rounded-lg shadow">
            <div className="text-sm text-gray-600 text-center mb-4">
              Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
              {Math.min(pagination.current_page * pagination.per_page, pagination.total_items)} of{' '}
              {pagination.total_items} publications
            </div>
            
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* Main Pagination Controls - Centered */}
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
                
                {/* Page Numbers */}
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
              
              {/* Go to Page - Below main pagination */}
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

        {/* Back to Top - Performance Optimized - Moved after pagination */}
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
    </div>
  );
};

export default Publications;
