import React, { createContext, useContext, useState, useEffect } from 'react';
import firebaseService from '../services/firebaseService';

const ResearchAreasContext = createContext();

export const useResearchAreas = () => {
  const context = useContext(ResearchAreasContext);
  if (!context) {
    throw new Error('useResearchAreas must be used within a ResearchAreasProvider');
  }
  return context;
};

// Default research areas
const DEFAULT_RESEARCH_AREAS = [
  {
    id: 1,
    title: "Smart Grid Technologies",
    description: "Next-generation intelligent grid systems for improved reliability and efficiency.",
    image: "https://images.unsplash.com/photo-1632103996718-4a47cf68b75e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85",
    areaNumber: 1
  },
  {
    id: 2,
    title: "Microgrids & Distributed Energy Systems", 
    description: "Localized energy grids that can operate independently or with traditional grids.",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85",
    areaNumber: 2
  },
  {
    id: 3,
    title: "Renewable Energy Integration",
    description: "Seamless integration of solar, wind, and other renewable sources.",
    image: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85",
    areaNumber: 3
  },
  {
    id: 4,
    title: "Grid Optimization & Stability",
    description: "Advanced algorithms for power system optimization and stability analysis.",
    image: "https://images.unsplash.com/photo-1467533003447-e295ff1b0435?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw0fHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85",
    areaNumber: 4
  },
  {
    id: 5,
    title: "Energy Storage Systems",
    description: "Battery management and energy storage solutions for grid applications.",
    image: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGdyaWR8ZW58MHx8fHwxNzU2NTM1MTU3fDA&ixlib=rb-4.1.0&q=85",
    areaNumber: 5
  },
  {
    id: 6,
    title: "Power System Automation",
    description: "Automated control systems for modern power grid operations.",
    image: "https://images.unsplash.com/photo-1632103996718-4a47cf68b75e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85",
    areaNumber: 6
  },
  {
    id: 7,
    title: "Cybersecurity and AI for Power Infrastructure",
    description: "Advanced AI-driven cybersecurity solutions protecting critical power infrastructure from emerging threats.",
    image: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85",
    areaNumber: 7
  }
];

export const ResearchAreasProvider = ({ children }) => {
  const [researchAreas, setResearchAreas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Load data from Firebase on initialization
  useEffect(() => {
    const loadResearchAreasData = async () => {
      if (initialized) return;
      
      try {
        setIsLoading(true);
        console.log('🔄 Loading research areas data from Firebase...');
        
        const firebaseAreas = await firebaseService.getResearchAreas();
        
        if (firebaseAreas.length > 0) {
          setResearchAreas(firebaseAreas);
          console.log(`✅ Research areas data loaded from Firebase: ${firebaseAreas.length} areas`);
        } else {
          // Initialize with default data if no data in Firebase
          console.log('📋 No research areas in Firebase, initializing with defaults...');
          for (const area of DEFAULT_RESEARCH_AREAS) {
            await firebaseService.addResearchArea(area);
          }
          setResearchAreas(DEFAULT_RESEARCH_AREAS);
          console.log('✅ Default research areas initialized in Firebase');
        }
        
      } catch (error) {
        console.error('❌ Error loading research areas data from Firebase:', error);
        // Fallback to default data
        setResearchAreas(DEFAULT_RESEARCH_AREAS);
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    };

    loadResearchAreasData();
  }, [initialized]);

  // Add new research area
  const addResearchArea = async (areaData) => {
    try {
      const newAreaData = {
        ...areaData,
        areaNumber: researchAreas.length + 1
      };
      
      const newArea = await firebaseService.addResearchArea(newAreaData);
      setResearchAreas(prev => [...prev, newArea]);
      
      console.log('✅ Research area added to Firebase:', newArea);
      return { success: true, area: newArea };
    } catch (error) {
      console.error('❌ Error adding research area:', error);
      return { success: false, error: 'Failed to add research area' };
    }
  };

  // Update research area
  const updateResearchArea = async (id, updatedData) => {
    try {
      const updatedArea = await firebaseService.updateResearchArea(id, updatedData);
      setResearchAreas(prev => 
        prev.map(area => area.id === id ? updatedArea : area)
      );
      
      console.log('✅ Research area updated in Firebase:', updatedArea);
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating research area:', error);
      return { success: false, error: 'Failed to update research area' };
    }
  };

  // Delete research area
  const deleteResearchArea = async (id) => {
    try {
      await firebaseService.deleteResearchArea(id);
      
      const updatedAreas = researchAreas.filter(area => area.id !== id);
      // Re-number the areas
      const renumberedAreas = updatedAreas.map((area, index) => ({
        ...area,
        areaNumber: index + 1
      }));
      
      // Update area numbers in Firebase
      for (const area of renumberedAreas) {
        await firebaseService.updateResearchArea(area.id, { areaNumber: area.areaNumber });
      }
      
      setResearchAreas(renumberedAreas);
      console.log('✅ Research area deleted from Firebase and areas renumbered');
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting research area:', error);
      return { success: false, error: 'Failed to delete research area' };
    }
  };

  // Reorder research areas
  const reorderResearchAreas = async (newOrder) => {
    try {
      // Re-number based on new order
      const renumberedAreas = newOrder.map((area, index) => ({
        ...area,
        areaNumber: index + 1
      }));
      
      // Update in Firebase
      for (const area of renumberedAreas) {
        await firebaseService.updateResearchArea(area.id, { areaNumber: area.areaNumber });
      }
      
      setResearchAreas(renumberedAreas);
      console.log('✅ Research areas reordered in Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error reordering research areas:', error);
      return { success: false, error: 'Failed to reorder research areas' };
    }
  };

  // Get research area by ID
  const getResearchAreaById = (id) => {
    return researchAreas.find(area => area.id === id);
  };

  // Get paginated research areas
  const getPaginatedResearchAreas = (page = 1, limit = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedAreas = researchAreas.slice(startIndex, endIndex);

    return {
      areas: paginatedAreas,
      totalAreas: researchAreas.length,
      totalPages: Math.ceil(researchAreas.length / limit),
      currentPage: page,
      hasNextPage: endIndex < researchAreas.length,
      hasPrevPage: page > 1
    };
  };

  const value = {
    // State
    researchAreas,
    isLoading,

    // Methods
    addResearchArea,
    updateResearchArea,
    deleteResearchArea,
    reorderResearchAreas,
    getResearchAreaById,
    getPaginatedResearchAreas
  };

  return (
    <ResearchAreasContext.Provider value={value}>
      {children}
    </ResearchAreasContext.Provider>
  );
};

export default ResearchAreasProvider;