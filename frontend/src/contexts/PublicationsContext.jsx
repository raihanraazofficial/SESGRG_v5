import React, { createContext, useContext, useState, useEffect } from 'react';
import googleSheetsService from '../services/googleSheetsApi';

const PublicationsContext = createContext();

export const usePublications = () => {
  const context = useContext(PublicationsContext);
  if (!context) {
    throw new Error('usePublications must be used within a PublicationsProvider');
  }
  return context;
};

export const PublicationsProvider = ({ children }) => {
  const [publicationsData, setPublicationsData] = useState(() => {
    // Try to load from localStorage first
    try {
      const storedData = localStorage.getItem('sesg_publications_data');
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error loading publications from localStorage:', error);
    }
    
    // Return empty array if localStorage fails
    return [];
  });

  const [loading, setLoading] = useState(false);
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

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('sesg_publications_data', JSON.stringify(publicationsData));
    } catch (error) {
      console.error('Error saving publications to localStorage:', error);
    }
  }, [publicationsData]);

  // Initialize data from Google Sheets on first load (migration)
  useEffect(() => {
    const initializeData = async () => {
      if (initialized || publicationsData.length > 0) return;
      
      try {
        setLoading(true);
        console.log('🔄 Migrating publications data from Google Sheets to localStorage...');
        
        const response = await googleSheetsService.getPublications({
          page: 1,
          per_page: 100 // Get all publications
        });
        
        if (response && response.publications && response.publications.length > 0) {
          const migratedData = response.publications.map((pub, index) => ({
            id: pub.id || Date.now() + index,
            title: pub.title || '',
            authors: Array.isArray(pub.authors) ? pub.authors : 
                    typeof pub.authors === 'string' ? pub.authors.split(',').map(a => a.trim()) : [],
            year: pub.year || new Date().getFullYear(),
            category: pub.category || 'Journal Articles',
            research_areas: Array.isArray(pub.research_areas) ? pub.research_areas : [],
            citations: pub.citations || 0,
            journal_name: pub.journal_name || '',
            conference_name: pub.conference_name || '',
            book_title: pub.book_title || '',
            volume: pub.volume || '',
            issue: pub.issue || '',
            pages: pub.pages || '',
            publisher: pub.publisher || '',
            editor: pub.editor || '',
            city: pub.city || '',
            country: pub.country || '',
            doi_link: pub.doi_link || pub.full_paper_link || '',
            full_paper_link: pub.full_paper_link || '',
            open_access: pub.open_access || false,
            featured: pub.featured || false,
            abstract: pub.abstract || '',
            keywords: Array.isArray(pub.keywords) ? pub.keywords : 
                     typeof pub.keywords === 'string' ? pub.keywords.split(',').map(k => k.trim()) : []
          }));
          
          setPublicationsData(migratedData);
          console.log(`✅ Successfully migrated ${migratedData.length} publications to localStorage`);
        }
      } catch (error) {
        console.error('❌ Error migrating publications data:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeData();
  }, [initialized, publicationsData.length]);

  // Add new publication
  const addPublication = (newPublication) => {
    const publication = {
      ...newPublication,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setPublicationsData(prev => [...prev, publication]);
    return publication;
  };

  // Update publication
  const updatePublication = (id, updatedData) => {
    const updatedPublication = {
      ...updatedData,
      id: id,
      updated_at: new Date().toISOString()
    };
    
    setPublicationsData(prev => 
      prev.map(pub => pub.id === id ? updatedPublication : pub)
    );
    return updatedPublication;
  };

  // Delete publication
  const deletePublication = (id) => {
    setPublicationsData(prev => prev.filter(pub => pub.id !== id));
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
  const getFeaturedPublications = (limit = 5) => {
    return publicationsData
      .filter(pub => pub.featured)
      .sort((a, b) => b.year - a.year)
      .slice(0, limit);
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