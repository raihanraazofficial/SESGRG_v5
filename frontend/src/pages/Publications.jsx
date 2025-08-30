import React, { useState, useEffect } from "react";
import { Search, Filter, Copy, ExternalLink, Mail, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import apiService from "../services/api";

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

  const researchAreas = [
    "Smart Grid Technologies",
    "Microgrids & Distributed Energy Systems", 
    "Renewable Energy Integration",
    "Grid Optimization & Stability",
    "Energy Storage Systems",
    "Power System Automation",
    "Cybersecurity and AI for Power Infrastructure"
  ];

  const categories = ["Journal Articles", "Conference Proceedings", "Book Chapters", "Books"];
  const years = Array.from({length: 10}, (_, i) => (new Date().getFullYear() - i).toString());

  useEffect(() => {
    fetchPublications();
  }, [filters]);

  const fetchPublications = async () => {
    try {
      setLoading(true);
      const response = await apiService.getPublications(filters);
      setPublications(response.publications || []);
      setPagination(response.pagination || {});
      setStatistics(response.statistics || {});
    } catch (error) {
      console.error('Error fetching publications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
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
    const citation = apiService.generateIEEECitation(publication);
    const success = await apiService.copyToClipboard(citation);
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
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Publications</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Explore our research publications in sustainable energy and smart grid technologies. 
            Discover cutting-edge research that's shaping the future of energy systems.
          </p>
          
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
            <Button
              variant={filters.category_filter === 'Books' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('category_filter', 'Books')}
              className="px-3 py-2 md:px-6 text-sm md:text-base"
            >
              Books
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
                  value={filters.year_filter}
                  onValueChange={(value) => handleFilterChange('year_filter', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Years</SelectItem>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.category_filter}
                  onValueChange={(value) => handleFilterChange('category_filter', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
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
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
            <span className="ml-3 text-lg text-gray-600">Loading Publications...</span>
          </div>
        )}

        {/* Publications List */}
        {!loading && publications.length > 0 && (
          <div className="space-y-6">
            {publications.map((publication) => (
              <Card key={publication.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight">
                        {publication.title}
                      </h3>
                      <p className="text-gray-700 mb-2">
                        <strong>Authors:</strong> {publication.authors.join(', ')}
                      </p>
                      <p className="text-gray-600 mb-3">
                        {publication.publication_info}
                      </p>
                      {publication.abstract && (
                        <p className="text-gray-600 text-sm mb-3 leading-relaxed">
                          {publication.abstract}
                        </p>
                      )}
                    </div>
                    <div className="ml-6 text-right">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        publication.category === 'Journal Articles' ? 'bg-blue-100 text-blue-700' :
                        publication.category === 'Conference Proceedings' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {publication.category}
                      </span>
                      <p className="text-2xl font-bold text-emerald-600 mt-2">
                        {publication.citations}
                      </p>
                      <p className="text-sm text-gray-500">Citations</p>
                    </div>
                  </div>

                  {/* Research Areas */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {publication.research_areas.map((area, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                      >
                        {area}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex space-x-4">
                      {publication.open_access && publication.full_paper_link ? (
                        <Button
                          variant="default"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => window.open(publication.full_paper_link, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Read Full Paper
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          onClick={() => requestPaper(publication)}
                        >
                          <Mail className="h-4 w-4 mr-2" />
                          Request Full Paper
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        onClick={() => copyPaperCitation(publication)}
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Citation
                      </Button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{publication.year}</p>
                      <p className="text-sm text-gray-500">Published</p>
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
          <div className="flex items-center justify-between mt-12 p-6 bg-white rounded-lg shadow">
            <div className="text-sm text-gray-600">
              Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
              {Math.min(pagination.current_page * pagination.per_page, pagination.total_items)} of{' '}
              {pagination.total_items} publications
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

export default Publications;
