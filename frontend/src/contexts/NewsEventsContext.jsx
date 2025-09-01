import React, { createContext, useContext, useState, useEffect } from 'react';
import googleSheetsService from '../services/googleSheetsApi';

const NewsEventsContext = createContext();

export const useNewsEvents = () => {
  const context = useContext(NewsEventsContext);
  if (!context) {
    throw new Error('useNewsEvents must be used within a NewsEventsProvider');
  }
  return context;
};

export const NewsEventsProvider = ({ children }) => {
  const [newsEventsData, setNewsEventsData] = useState(() => {
    // Try to load from localStorage first
    try {
      const storedData = localStorage.getItem('sesg_newsevents_data');
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error loading news events from localStorage:', error);
    }
    
    // Return empty array if localStorage fails
    return [];
  });

  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // News Events categories
  const categories = ["News", "Events", "Upcoming Events", "Announcement", "Press Release"];

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('sesg_newsevents_data', JSON.stringify(newsEventsData));
    } catch (error) {
      console.error('Error saving news events to localStorage:', error);
    }
  }, [newsEventsData]);

  // Initialize data from Google Sheets on first load (migration)
  useEffect(() => {
    const initializeData = async () => {
      if (initialized || newsEventsData.length > 0) return;
      
      try {
        setLoading(true);
        console.log('🔄 Migrating news events data from Google Sheets to localStorage...');
        
        const response = await googleSheetsService.getNewsEvents({
          page: 1,
          per_page: 100 // Get all news events
        });
        
        if (response && response.news_events && response.news_events.length > 0) {
          const migratedData = response.news_events.map((item, index) => ({
            id: item.id || Date.now() + index,
            title: item.title || '',
            short_description: item.short_description || '',
            description: item.description || '',
            full_content: item.full_content || item.description || '',
            category: item.category || 'News',
            date: item.date || new Date().toISOString().split('T')[0],
            location: item.location || '',
            image: item.image || '',
            featured: item.featured || false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));
          
          setNewsEventsData(migratedData);
          console.log(`✅ Successfully migrated ${migratedData.length} news events to localStorage`);
        }
      } catch (error) {
        console.error('❌ Error migrating news events data:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeData();
  }, [initialized, newsEventsData.length]);

  // Add new news event
  const addNewsEvent = (newNewsEvent) => {
    const newsEvent = {
      ...newNewsEvent,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setNewsEventsData(prev => [...prev, newsEvent]);
    return newsEvent;
  };

  // Update news event
  const updateNewsEvent = (id, updatedData) => {
    setNewsEventsData(prev => prev.map(item => 
      item.id === id 
        ? { ...item, ...updatedData, updated_at: new Date().toISOString() }
        : item
    ));
  };

  // Delete news event
  const deleteNewsEvent = (id) => {
    setNewsEventsData(prev => prev.filter(item => item.id !== id));
  };

  // Get news event by ID
  const getNewsEventById = (id) => {
    return newsEventsData.find(item => item.id === id);
  };

  // Get paginated news events with filters
  const getPaginatedNewsEvents = (filters = {}) => {
    let filteredData = [...newsEventsData];

    // Apply title filter
    if (filters.title_filter && filters.title_filter.trim()) {
      const searchTerm = filters.title_filter.toLowerCase();
      filteredData = filteredData.filter(item =>
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.short_description?.toLowerCase().includes(searchTerm)
      );
    }

    // Apply category filter
    if (filters.category_filter && filters.category_filter !== 'all' && filters.category_filter !== '') {
      filteredData = filteredData.filter(item => item.category === filters.category_filter);
    }

    // Apply sorting
    filteredData.sort((a, b) => {
      const getValue = (item, field) => {
        switch (field) {
          case 'date':
            return new Date(item.date || 0);
          case 'title':
            return item.title.toLowerCase();
          default:
            return item[field] || '';
        }
      };

      const valueA = getValue(a, filters.sort_by || 'date');
      const valueB = getValue(b, filters.sort_by || 'date');
      
      const isDesc = filters.sort_order === 'desc';
      
      if (valueA < valueB) return isDesc ? 1 : -1;
      if (valueA > valueB) return isDesc ? -1 : 1;
      return 0;
    });

    // Calculate pagination
    const page = parseInt(filters.page) || 1;
    const perPage = parseInt(filters.per_page) || 15;
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return {
      news_events: paginatedData,
      pagination: {
        current_page: page,
        per_page: perPage,
        total_items: filteredData.length,
        total_pages: Math.ceil(filteredData.length / perPage),
        has_prev: page > 1,
        has_next: page < Math.ceil(filteredData.length / perPage)
      }
    };
  };

  // Get statistics
  const getStatistics = () => {
    return {
      total_news_events: newsEventsData.length,
      by_category: categories.reduce((acc, category) => {
        acc[category] = newsEventsData.filter(item => item.category === category).length;
        return acc;
      }, {}),
      featured_count: newsEventsData.filter(item => item.featured).length,
      latest_date: newsEventsData.length > 0 
        ? Math.max(...newsEventsData.map(item => new Date(item.date).getTime()))
        : null
    };
  };

  const value = {
    newsEventsData,
    loading,
    categories,
    addNewsEvent,
    updateNewsEvent,
    deleteNewsEvent,
    getNewsEventById,
    getPaginatedNewsEvents,
    getStatistics
  };

  return (
    <NewsEventsContext.Provider value={value}>
      {children}
    </NewsEventsContext.Provider>
  );
};