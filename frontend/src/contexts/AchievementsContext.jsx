import React, { createContext, useContext, useState, useEffect } from 'react';
import googleSheetsService from '../services/googleSheetsApi';

const AchievementsContext = createContext();

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};

export const AchievementsProvider = ({ children }) => {
  const [achievementsData, setAchievementsData] = useState(() => {
    // Try to load from localStorage first
    try {
      const storedData = localStorage.getItem('sesg_achievements_data');
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error loading achievements from localStorage:', error);
    }
    
    // Return empty array if localStorage fails
    return [];
  });

  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Achievement categories
  const categories = ["Award", "Partnership", "Publication", "Grant", "Recognition", "Milestone"];

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('sesg_achievements_data', JSON.stringify(achievementsData));
    } catch (error) {
      console.error('Error saving achievements to localStorage:', error);
    }
  }, [achievementsData]);

  // Initialize data from Google Sheets on first load (migration)
  useEffect(() => {
    const initializeData = async () => {
      if (initialized || achievementsData.length > 0) return;
      
      try {
        setLoading(true);
        console.log('🔄 Migrating achievements data from Google Sheets to localStorage...');
        
        const response = await googleSheetsService.getAchievements({
          page: 1,
          per_page: 100 // Get all achievements
        });
        
        if (response && response.achievements && response.achievements.length > 0) {
          const migratedData = response.achievements.map((achievement, index) => ({
            id: achievement.id || Date.now() + index,
            title: achievement.title || '',
            short_description: achievement.short_description || '',
            description: achievement.description || achievement.full_content || '',
            category: achievement.category || 'Award',
            date: achievement.date || new Date().toISOString().split('T')[0],
            image: achievement.image || '',
            featured: achievement.featured || false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }));
          
          setAchievementsData(migratedData);
          console.log(`✅ Successfully migrated ${migratedData.length} achievements to localStorage`);
        }
      } catch (error) {
        console.error('❌ Error migrating achievements data:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeData();
  }, [initialized, achievementsData.length]);

  // Add new achievement
  const addAchievement = (newAchievement) => {
    const achievement = {
      ...newAchievement,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setAchievementsData(prev => [...prev, achievement]);
    return achievement;
  };

  // Update achievement
  const updateAchievement = (id, updatedData) => {
    const updatedAchievement = {
      ...updatedData,
      id: id,
      updated_at: new Date().toISOString()
    };
    
    setAchievementsData(prev => 
      prev.map(achievement => achievement.id === id ? updatedAchievement : achievement)
    );
    return updatedAchievement;
  };

  // Delete achievement
  const deleteAchievement = (id) => {
    try {
      console.log('🔍 AchievementsContext: Deleting achievement with ID:', id);
      console.log('🔍 Current achievements data:', achievementsData);
      
      if (!id) {
        throw new Error('Achievement ID is required for deletion');
      }
      
      const existingAchievement = achievementsData.find(achievement => achievement.id === id);
      if (!existingAchievement) {
        throw new Error(`Achievement with ID ${id} not found`);
      }
      
      console.log('🔍 Found achievement to delete:', existingAchievement);
      
      setAchievementsData(prev => {
        const filtered = prev.filter(achievement => achievement.id !== id);
        console.log('✅ Achievement deleted. New data length:', filtered.length);
        return filtered;
      });
      
      console.log('✅ Achievement delete operation completed');
    } catch (error) {
      console.error('❌ Error in deleteAchievement:', error);
      throw error; // Re-throw to let calling component handle it
    }
  };

  // Get achievement by ID
  const getAchievementById = (id) => {
    return achievementsData.find(achievement => achievement.id === id);
  };

  // Filter and search achievements
  const getFilteredAchievements = (filters = {}) => {
    let filtered = [...achievementsData];

    // Title filter
    if (filters.title_filter) {
      const titleTerm = filters.title_filter.toLowerCase();
      filtered = filtered.filter(achievement =>
        achievement.title.toLowerCase().includes(titleTerm) ||
        achievement.short_description.toLowerCase().includes(titleTerm)
      );
    }

    // Category filter
    if (filters.category_filter && filters.category_filter !== 'all') {
      filtered = filtered.filter(achievement => achievement.category === filters.category_filter);
    }

    // Sort
    const sortBy = filters.sort_by || 'date';
    const sortOrder = filters.sort_order || 'desc';
    
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'title') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortBy === 'date') {
        aVal = new Date(aVal);
        bVal = new Date(bVal);
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  // Get paginated achievements
  const getPaginatedAchievements = (filters = {}) => {
    const page = filters.page || 1;
    const perPage = filters.per_page || 12;
    
    const filtered = getFilteredAchievements(filters);
    const total = filtered.length;
    const totalPages = Math.ceil(total / perPage);
    const offset = (page - 1) * perPage;
    const paginatedData = filtered.slice(offset, offset + perPage);
    
    return {
      achievements: paginatedData,
      pagination: {
        current_page: page,
        per_page: perPage,
        total_items: total,
        total_pages: totalPages,
        has_prev: page > 1,
        has_next: page < totalPages
      }
    };
  };

  // Get statistics
  const getStatistics = () => {
    const total = achievementsData.length;
    const byCategory = categories.reduce((acc, category) => {
      acc[category] = achievementsData.filter(a => a.category === category).length;
      return acc;
    }, {});
    
    return {
      total_achievements: total,
      by_category: byCategory,
      featured_count: achievementsData.filter(a => a.featured).length
    };
  };

  // Get featured achievements
  const getFeaturedAchievements = (limit = 3) => {
    return achievementsData
      .filter(achievement => achievement.featured)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  // Get latest achievements
  const getLatestAchievements = (limit = 5) => {
    return achievementsData
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, limit);
  };

  const value = {
    achievementsData,
    loading,
    categories,
    addAchievement,
    updateAchievement,
    deleteAchievement,
    getAchievementById,
    getFilteredAchievements,
    getPaginatedAchievements,
    getStatistics,
    getFeaturedAchievements,
    getLatestAchievements
  };

  return (
    <AchievementsContext.Provider value={value}>
      {children}
    </AchievementsContext.Provider>
  );
};