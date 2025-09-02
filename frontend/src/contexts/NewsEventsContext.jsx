import React, { createContext, useContext, useState, useEffect } from 'react';
import firebaseService from '../services/firebaseService';

const NewsEventsContext = createContext();

export const useNewsEvents = () => {
  const context = useContext(NewsEventsContext);
  if (!context) {
    throw new Error('useNewsEvents must be used within a NewsEventsProvider');
  }
  return context;
};

export const NewsEventsProvider = ({ children }) => {
  const [newsEventsData, setNewsEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // News Events categories
  const categories = ["News", "Events", "Upcoming Events", "Announcement", "Press Release"];

  // Load data from Firebase on initialization
  useEffect(() => {
    const loadNewsEventsData = async () => {
      if (initialized) return;
      
      try {
        setLoading(true);
        console.log('🔄 Loading news events data from Firebase...');
        
        const firebaseNewsEvents = await firebaseService.getNewsEvents();
        setNewsEventsData(firebaseNewsEvents);
        
        console.log(`✅ News events data loaded from Firebase: ${firebaseNewsEvents.length} news events`);
      } catch (error) {
        console.error('❌ Error loading news events data from Firebase:', error);
        setNewsEventsData([]);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    loadNewsEventsData();
  }, [initialized]);

  // Add new news event
  const addNewsEvent = async (newNewsEvent) => {
    try {
      const newsEvent = await firebaseService.addNewsEvent(newNewsEvent);
      setNewsEventsData(prev => [...prev, newsEvent]);
      console.log('✅ News event added to Firebase:', newsEvent);
      return newsEvent;
    } catch (error) {
      console.error('❌ Error adding news event:', error);
      throw error;
    }
  };

  // Update news event
  const updateNewsEvent = async (id, updatedData) => {
    try {
      const updatedNewsEvent = await firebaseService.updateNewsEvent(id, updatedData);
      setNewsEventsData(prev => prev.map(item => 
        item.id === id ? updatedNewsEvent : item
      ));
      console.log('✅ News event updated in Firebase:', updatedNewsEvent);
    } catch (error) {
      console.error('❌ Error updating news event:', error);
      throw error;
    }
  };

  // Delete news event
  const deleteNewsEvent = async (id) => {
    try {
      console.log('🔍 NewsEventsContext: Deleting news event with ID:', id);
      
      if (!id && id !== 0) {
        throw new Error('News event ID is required for deletion');
      }
      
      await firebaseService.deleteNewsEvent(id);
      
      setNewsEventsData(prev => {
        const filtered = prev.filter(item => item.id !== id);
        console.log('✅ News event deleted from Firebase. Old length:', prev.length, 'New length:', filtered.length);
        return filtered;
      });
      
      console.log('✅ News event delete operation completed');
    } catch (error) {
      console.error('❌ Error in deleteNewsEvent:', error);
      throw error;
    }
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

  // Get featured news events
  const getFeaturedNewsEvents = async (limit = 3) => {
    try {
      return await firebaseService.getFeaturedNewsEvents(limit);
    } catch (error) {
      console.error('Error getting featured news events:', error);
      return newsEventsData
        .filter(item => item.featured)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
    }
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
    getStatistics,
    getFeaturedNewsEvents
  };

  return (
    <NewsEventsContext.Provider value={value}>
      {children}
    </NewsEventsContext.Provider>
  );
};