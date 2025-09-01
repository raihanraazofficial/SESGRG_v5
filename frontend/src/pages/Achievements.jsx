import React, { useState, useEffect } from "react";
import { Search, Trophy, Calendar, ArrowRight, ChevronLeft, ChevronRight, Loader2, Filter, RefreshCw, ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import SkeletonCard from "../components/SkeletonCard";
import { useAchievements } from "../contexts/AchievementsContext";
import { useAuth } from "../contexts/AuthContext";
import { generateBlogContent } from "../components/BlogContentRenderer";
import "../styles/smooth-filters.css";

const Achievements = () => {
  const {
    achievementsData,
    loading,
    categories,
    getPaginatedAchievements
  } = useAchievements();

  const { isAuthenticated } = useAuth();

  const [achievements, setAchievements] = useState([]);
  const [pagination, setPagination] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    title_filter: '',
    category_filter: 'all',
    sort_by: 'date',
    sort_order: 'desc',
    page: 1,
    per_page: 12
  });

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState(null);

  // Load achievements whenever achievementsData or filters change
  useEffect(() => {
    if (achievementsData.length > 0 || !loading) {
      const result = getPaginatedAchievements(filters);
      setAchievements(result.achievements || []);
      setPagination(result.pagination || {});
    }
  }, [achievementsData, filters, getPaginatedAchievements, loading]);

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

  // Authentication functions
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    setShowAuthModal(false);
    
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const requireAuth = (action) => {
    if (isAuthenticated) {
      action();
    } else {
      setPendingAction(() => action);
      setShowAuthModal(true);
    }
  };

  // CRUD handlers
  const handleAddAchievement = async (achievementData) => {
    try {
      await addAchievement(achievementData);
      console.log('✅ Achievement added successfully');
    } catch (error) {
      console.error('❌ Error adding achievement:', error);
      throw error;
    }
  };

  const handleUpdateAchievement = async (id, updatedData) => {
    try {
      await updateAchievement(id, updatedData);
      console.log('✅ Achievement updated successfully');
    } catch (error) {
      console.error('❌ Error updating achievement:', error);  
      throw error;
    }
  };

  const handleDeleteAchievement = async (id) => {
    try {
      await deleteAchievement(id);
      console.log('✅ Achievement deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting achievement:', error);
      throw error;
    }
  };

  // Action handlers
  const handleAddClick = () => {
    requireAuth(() => setShowAddModal(true));
  };

  const handleEditClick = (achievement) => {
    requireAuth(() => {
      setSelectedAchievement(achievement);
      setShowEditModal(true);
    });
  };

  const handleDeleteClick = (achievement) => {
    requireAuth(() => {
      setSelectedAchievement(achievement);
      setShowDeleteModal(true);
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);
    // Force re-render by updating filters
    setFilters(prev => ({ ...prev }));
    setTimeout(() => setRefreshing(false), 1000);
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
            <div className="flex items-center space-x-3">
              {isAuthenticated && (
                <div className="bg-emerald-600/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-emerald-400/30">
                  <span className="text-emerald-400 text-sm font-medium">Admin Mode Active</span>
                </div>
              )}
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="border-white text-white hover:bg-white hover:text-gray-900"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Add Achievement Button */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Research Achievements</h2>
          <Button
            onClick={handleAddClick}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isAuthenticated ? (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Add New Achievement
              </>
            ) : (
              <>
                <Shield className="h-4 w-4 mr-2" />
                Add New Achievement
              </>
            )}
          </Button>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex justify-center flex-wrap gap-4 mb-8">
          <Button
            variant={filters.category_filter === 'all' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('category_filter', 'all')}
            className="px-6 py-2 filter-button"
          >
            All Categories
          </Button>
          {categories.map(category => (
            <Button
              key={category}
              variant={filters.category_filter === category ? 'default' : 'outline'}
              onClick={() => handleFilterChange('category_filter', category)}
              className="px-6 py-2 filter-button"
            >
              {category}s
            </Button>
          ))}
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
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={`${filters.sort_by}-${filters.sort_order}`}
                onValueChange={(value) => {
                  const [sort_by, sort_order] = value.split('-');
                  setFilters(prev => ({ ...prev, sort_by, sort_order, page: 1 }));
                }}
              >
                <SelectTrigger className="dropdown-container">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent className="max-h-64 overflow-y-auto" side="bottom" align="start" sideOffset={4}>
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
                      {/* Action Buttons */}
                      <div className="absolute bottom-6 right-6 flex space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditClick(achievements[0])}
                          className="bg-white/90 backdrop-blur-sm border-white hover:bg-white"
                        >
                          {isAuthenticated ? <Edit className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteClick(achievements[0])}
                          className="bg-red-500/90 backdrop-blur-sm border-red-500 text-white hover:bg-red-600"
                        >
                          {isAuthenticated ? <Trash2 className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                        </Button>
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
                        {/* Action Buttons */}
                        <div className="absolute bottom-4 right-4 flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(achievement)}
                            className="bg-white/90 backdrop-blur-sm border-white hover:bg-white"
                          >
                            {isAuthenticated ? <Edit className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteClick(achievement)}
                            className="bg-red-500/90 backdrop-blur-sm border-red-500 text-white hover:bg-red-600"
                          >
                            {isAuthenticated ? <Trash2 className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                          </Button>
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
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or add a new achievement.</p>
            <div className="flex justify-center space-x-4">
              <Button onClick={clearFilters}>Clear Search</Button>
              <Button onClick={handleAddClick} className="bg-emerald-600 hover:bg-emerald-700">
                {isAuthenticated ? (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Achievement
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Add Achievement
                  </>
                )}
              </Button>
            </div>
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

      {/* Modals */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
        title="Authentication Required"
      />

      <AddAchievementModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddAchievement}
        categories={categories}
      />

      <EditAchievementModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onUpdate={handleUpdateAchievement}
        achievement={selectedAchievement}
        categories={categories}
      />

      <DeleteAchievementModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteAchievement}
        achievement={selectedAchievement}
      />
    </div>
  );
};

export default Achievements;