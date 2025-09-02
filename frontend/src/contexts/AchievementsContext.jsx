import React, { createContext, useContext, useState, useEffect } from 'react';
import firebaseService from '../services/firebaseService';

const AchievementsContext = createContext();

export const useAchievements = () => {
  const context = useContext(AchievementsContext);
  if (!context) {
    throw new Error('useAchievements must be used within an AchievementsProvider');
  }
  return context;
};

export const AchievementsProvider = ({ children }) => {
  const [achievementsData, setAchievementsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Achievement categories
  const categories = ["Award", "Partnership", "Publication", "Grant", "Recognition", "Milestone"];

  // Load data from Firebase on initialization
  useEffect(() => {
    const loadAchievementsData = async () => {
      if (initialized) return;
      
      try {
        setLoading(true);
        console.log('🔄 Loading achievements data from Firebase...');
        
        const firebaseAchievements = await firebaseService.getAchievements();
        setAchievementsData(firebaseAchievements);
        
        console.log(`✅ Achievements data loaded from Firebase: ${firebaseAchievements.length} achievements`);
      } catch (error) {
        console.error('❌ Error loading achievements data from Firebase:', error);
        setAchievementsData([]);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    loadAchievementsData();
  }, [initialized]);

  // Add new achievement
  const addAchievement = async (newAchievement) => {
    try {
      const achievement = await firebaseService.addAchievement(newAchievement);
      setAchievementsData(prev => [...prev, achievement]);
      console.log('✅ Achievement added to Firebase:', achievement);
      return achievement;
    } catch (error) {
      console.error('❌ Error adding achievement:', error);
      throw error;
    }
  };

  // Update achievement
  const updateAchievement = async (id, updatedData) => {
    try {
      const updatedAchievement = await firebaseService.updateAchievement(id, updatedData);
      setAchievementsData(prev => 
        prev.map(achievement => achievement.id === id ? updatedAchievement : achievement)
      );
      console.log('✅ Achievement updated in Firebase:', updatedAchievement);
      return updatedAchievement;
    } catch (error) {
      console.error('❌ Error updating achievement:', error);
      throw error;
    }
  };

  // Delete achievement
  const deleteAchievement = async (id) => {
    try {
      console.log('🔍 AchievementsContext: Deleting achievement with ID:', id);
      
      if (!id && id !== 0) {
        throw new Error('Achievement ID is required for deletion');
      }
      
      await firebaseService.deleteAchievement(id);
      
      setAchievementsData(prev => {
        const filtered = prev.filter(achievement => achievement.id !== id);
        console.log('✅ Achievement deleted from Firebase. Old length:', prev.length, 'New length:', filtered.length);
        return filtered;
      });
      
      console.log('✅ Achievement delete operation completed');
    } catch (error) {
      console.error('❌ Error in deleteAchievement:', error);
      throw error;
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
  const getFeaturedAchievements = async (limit = 3) => {
    try {
      return await firebaseService.getFeaturedAchievements(limit);
    } catch (error) {
      console.error('Error getting featured achievements:', error);
      return achievementsData
        .filter(achievement => achievement.featured)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, limit);
    }
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