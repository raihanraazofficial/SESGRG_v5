import React, { createContext, useContext, useState, useEffect } from 'react';
import firebaseService from '../services/firebaseService';

const PublicationsContext = createContext();

export const usePublications = () => {
  const context = useContext(PublicationsContext);
  if (!context) {
    throw new Error('usePublications must be used within a PublicationsProvider');
  }
  return context;
};

export const PublicationsProvider = ({ children }) => {
  const [publicationsData, setPublicationsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Research areas mapping
  const researchAreas = [
    "Smart Grid Technologies",
    "Microgrids & Distributed Energy Systems", 
    "Renewable Energy Integration",
    "Grid Optimization & Stability",
    "Energy Storage Systems",
    "Power System Automation",
    "Cybersecurity and AI for Power Infrastructure"
  ];

  // Load data from Firebase on initialization
  useEffect(() => {
    const loadPublicationsData = async () => {
      if (initialized) return;
      
      try {
        setLoading(true);
        console.log('🔄 Loading publications data from Firebase...');
        
        const firebasePublications = await firebaseService.getPublications();
        setPublicationsData(firebasePublications);
        
        console.log(`✅ Publications data loaded from Firebase: ${firebasePublications.length} publications`);
      } catch (error) {
        console.error('❌ Error loading publications data from Firebase:', error);
        setPublicationsData([]);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    loadPublicationsData();
  }, [initialized]);

  // Add new publication
  const addPublication = async (newPublication) => {
    try {
      const publication = await firebaseService.addPublication(newPublication);
      setPublicationsData(prev => [...prev, publication]);
      console.log('✅ Publication added to Firebase:', publication);
      return publication;
    } catch (error) {
      console.error('❌ Error adding publication:', error);
      throw error;
    }
  };

  // Update publication
  const updatePublication = async (id, updatedData) => {
    try {
      const updatedPublication = await firebaseService.updatePublication(id, updatedData);
      setPublicationsData(prev => 
        prev.map(pub => pub.id === id ? updatedPublication : pub)
      );
      console.log('✅ Publication updated in Firebase:', updatedPublication);
      return updatedPublication;
    } catch (error) {
      console.error('❌ Error updating publication:', error);
      throw error;
    }
  };

  // Delete publication
  const deletePublication = async (id) => {
    try {
      console.log('🔍 PublicationsContext: Deleting publication with ID:', id);
      
      if (!id && id !== 0) {
        throw new Error('Publication ID is required for deletion');
      }
      
      await firebaseService.deletePublication(id);
      
      setPublicationsData(prev => {
        const filtered = prev.filter(pub => pub.id !== id);
        console.log('✅ Publication deleted from Firebase. Old length:', prev.length, 'New length:', filtered.length);
        return filtered;
      });
      
      console.log('✅ Publication delete operation completed');
    } catch (error) {
      console.error('❌ Error in deletePublication:', error);
      throw error;
    }
  };

  // Get publication by ID
  const getPublicationById = (id) => {
    return publicationsData.find(pub => pub.id === id);
  };

  // Filter and search publications
  const getFilteredPublications = (filters = {}) => {
    let filtered = [...publicationsData];

    // Search filter
    if (filters.search_filter) {
      const searchTerm = filters.search_filter.toLowerCase();
      filtered = filtered.filter(pub => 
        pub.title.toLowerCase().includes(searchTerm) ||
        pub.authors.some(author => author.toLowerCase().includes(searchTerm)) ||
        pub.year.toString().includes(searchTerm) ||
        pub.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
      );
    }

    // Year filter
    if (filters.year_filter) {
      filtered = filtered.filter(pub => pub.year.toString() === filters.year_filter);
    }

    // Category filter
    if (filters.category_filter) {
      filtered = filtered.filter(pub => pub.category === filters.category_filter);
    }

    // Research area filter
    if (filters.area_filter) {
      filtered = filtered.filter(pub => 
        pub.research_areas.includes(filters.area_filter)
      );
    }

    // Author filter
    if (filters.author_filter) {
      const authorTerm = filters.author_filter.toLowerCase();
      filtered = filtered.filter(pub =>
        pub.authors.some(author => author.toLowerCase().includes(authorTerm))
      );
    }

    // Title filter
    if (filters.title_filter) {
      const titleTerm = filters.title_filter.toLowerCase();
      filtered = filtered.filter(pub =>
        pub.title.toLowerCase().includes(titleTerm)
      );
    }

    // Sort
    const sortBy = filters.sort_by || 'year';
    const sortOrder = filters.sort_order || 'desc';
    
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'title') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortBy === 'authors') {
        aVal = a.authors.join(', ').toLowerCase();
        bVal = b.authors.join(', ').toLowerCase();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  // Get paginated publications
  const getPaginatedPublications = (filters = {}) => {
    const page = filters.page || 1;
    const perPage = filters.per_page || 20;
    
    const filtered = getFilteredPublications(filters);
    const total = filtered.length;
    const totalPages = Math.ceil(total / perPage);
    const offset = (page - 1) * perPage;
    const paginatedData = filtered.slice(offset, offset + perPage);
    
    return {
      publications: paginatedData,
      pagination: {
        current_page: page,
        per_page: perPage,
        total_items: total,
        total_pages: totalPages,
        has_prev: page > 1,
        has_next: page < totalPages
      },
      statistics: getStatistics(filtered)
    };
  };

  // Get statistics
  const getStatistics = (data = publicationsData) => {
    const total = data.length;
    const totalCitations = data.reduce((sum, pub) => sum + (pub.citations || 0), 0);
    const years = data.map(pub => pub.year).filter(year => year);
    const latestYear = years.length > 0 ? Math.max(...years) : new Date().getFullYear();
    const uniqueAreas = [...new Set(data.flatMap(pub => pub.research_areas))];
    
    return {
      total_publications: total,
      total_citations: totalCitations,
      latest_year: latestYear,
      total_areas: uniqueAreas.length
    };
  };

  // Get all unique values for filters
  const getFilterOptions = () => {
    const years = [...new Set(publicationsData.map(pub => pub.year))].sort((a, b) => b - a);
    const categories = [...new Set(publicationsData.map(pub => pub.category))];
    const areas = [...new Set(publicationsData.flatMap(pub => pub.research_areas))].sort();
    const authors = [...new Set(publicationsData.flatMap(pub => pub.authors))].sort();
    
    return {
      years,
      categories,
      areas,
      authors
    };
  };

  // Get featured publications
  const getFeaturedPublications = async (limit = 5) => {
    try {
      return await firebaseService.getFeaturedPublications(limit);
    } catch (error) {
      console.error('Error getting featured publications:', error);
      return publicationsData
        .filter(pub => pub.featured)
        .sort((a, b) => b.year - a.year)
        .slice(0, limit);
    }
  };

  // Get latest publications
  const getLatestPublications = (limit = 5) => {
    return publicationsData
      .sort((a, b) => b.year - a.year)
      .slice(0, limit);
  };

  // Get publications by research area
  const getPublicationsByArea = (areaName) => {
    return publicationsData.filter(pub => 
      pub.research_areas.includes(areaName)
    );
  };

  const value = {
    publicationsData,
    loading,
    researchAreas,
    addPublication,
    updatePublication,
    deletePublication,
    getPublicationById,
    getFilteredPublications,
    getPaginatedPublications,
    getStatistics,
    getFilterOptions,
    getFeaturedPublications,
    getLatestPublications,
    getPublicationsByArea
  };

  return (
    <PublicationsContext.Provider value={value}>
      {children}
    </PublicationsContext.Provider>
  );
};