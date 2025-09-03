import React, { createContext, useContext, useState, useEffect } from 'react';
import firebaseService from '../services/firebaseService';

const HomeContext = createContext();

export const useHome = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
};

// Default home page content - only used if Firebase has no data
const DEFAULT_HOME_DATA = {
  aboutUs: {
    title: "About Us",
    content: "The Sustainable Energy and Smart Grid Research Group (SESGRG) is an independent research group established in 2025, affiliated with the BSRM School of Engineering, BRAC University. We specialize in sustainable energy systems, smart grid technologies, and advanced power network optimization, taking a comprehensive approach that spans generation, transmission, distribution, and microgrids. Committed to developing innovative and resilient energy solutions, we address modern power system challenges while promoting environmental stewardship through cutting-edge research and collaboration. Guided by principles of excellence, integrity, and sustainability, our vision is to revolutionize global power systems by advancing human well-being through intelligent infrastructure and renewable energy integration."
  },
  carouselImages: [
    {
      id: 1,
      url: "https://images.unsplash.com/photo-1632103996718-4a47cf68b75e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85",
      alt: "Wind turbine in desert landscape",
      caption: "Wind Energy Research"
    },
    {
      id: 2,
      url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85",
      alt: "Wind farm at golden hour",
      caption: "Renewable Energy Systems"
    },
    {
      id: 3,
      url: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85",
      alt: "Solar panel farm aerial view",
      caption: "Solar Energy Infrastructure"
    },
    {
      id: 4,
      url: "https://images.unsplash.com/photo-1467533003447-e295ff1b0435?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw0fHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85",
      alt: "Modern wind turbines",
      caption: "Modern Wind Technology"
    },
    {
      id: 5,
      url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGdyaWR8ZW58MHx8fHwxNzU2NTM1MTU3fDA&ixlib=rb-4.1.0&q=85",
      alt: "Power transmission infrastructure",
      caption: "Smart Grid Technology"
    }
  ],
  objectives: [
    "Bridge the gap between research and real-world applications.",
    "Optimize power network efficiency and reliability.",
    "Advance renewable energy integration technologies.",
    "Create sustainable microgrids for distributed energy systems.",
    "Develop Energy Storage and EV Integration Systems.",
    "Enhance Cybersecurity and AI Measures for Power Grid Protection.",
    "Promote Sustainable Energy Policy and Economics."
  ]
};

export const HomeProvider = ({ children }) => {
  // Start with no data and loading state
  const [homeData, setHomeData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Clear any old localStorage data on component mount
  useEffect(() => {
    console.log('🧹 Clearing old localStorage data to prevent data conflicts...');
    // Clear the specific localStorage key that might contain old data
    localStorage.removeItem('sesg_home_data');
    console.log('✅ Old localStorage data cleared');
  }, []);

  // Load data from Firebase on initialization
  useEffect(() => {
    const loadHomeData = async () => {
      if (initialized) return;
      
      try {
        console.log('🔄 Loading home data from Firebase...');
        setIsLoading(true);
        
        // Set timeout to prevent indefinite loading
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Firebase loading timeout')), 8000)
        );
        
        const firebasePromise = firebaseService.getHomeData();
        
        const firebaseHomeData = await Promise.race([firebasePromise, timeoutPromise]);
        
        if (firebaseHomeData && Object.keys(firebaseHomeData).length > 0) {
          console.log('✅ Firebase home data loaded successfully, displaying updated content');
          setHomeData(firebaseHomeData);
        } else {
          console.log('📋 No Firebase data found, initializing with latest defaults...');
          // Initialize Firebase with updated default data if none exists
          await firebaseService.updateHomeData(DEFAULT_HOME_DATA);
          setHomeData(DEFAULT_HOME_DATA);
        }
      } catch (error) {
        console.error('❌ Error loading home data from Firebase:', error);
        console.log('📋 Using latest default data due to error');
        // Use updated default data if Firebase fails
        setHomeData(DEFAULT_HOME_DATA);
      } finally {
        setIsLoading(false);
        setInitialized(true);
        console.log('✅ Home data loading completed');
      }
    };

    loadHomeData();
  }, [initialized]);

  // About Us Management
  const updateAboutUs = async (newAboutUs) => {
    try {
      const updatedData = {
        ...homeData,
        aboutUs: newAboutUs
      };
      
      await firebaseService.updateHomeData(updatedData);
      setHomeData(updatedData);
      
      console.log('✅ About Us updated in Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating about us:', error);
      return { success: false, error: 'Failed to update About Us content' };
    }
  };

  // Carousel Images Management
  const addCarouselImage = async (imageData) => {
    try {
      const newImage = {
        id: Date.now(),
        ...imageData
      };
      
      const updatedImages = [...(homeData?.carouselImages || []), newImage];
      const updatedData = {
        ...homeData,
        carouselImages: updatedImages
      };
      
      await firebaseService.updateHomeData(updatedData);
      setHomeData(updatedData);
      
      console.log('✅ Carousel image added to Firebase');
      return { success: true, image: newImage };
    } catch (error) {
      console.error('❌ Error adding carousel image:', error);
      return { success: false, error: 'Failed to add carousel image' };
    }
  };

  const updateCarouselImage = async (id, updatedImageData) => {
    try {
      const updatedImages = homeData.carouselImages.map(image =>
        image.id === id ? { ...image, ...updatedImageData } : image
      );
      
      const updatedData = {
        ...homeData,
        carouselImages: updatedImages
      };
      
      await firebaseService.updateHomeData(updatedData);
      setHomeData(updatedData);
      
      console.log('✅ Carousel image updated in Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating carousel image:', error);
      return { success: false, error: 'Failed to update carousel image' };
    }
  };

  const deleteCarouselImage = async (id) => {
    try {
      const updatedImages = homeData.carouselImages.filter(image => image.id !== id);
      const updatedData = {
        ...homeData,
        carouselImages: updatedImages
      };
      
      await firebaseService.updateHomeData(updatedData);
      setHomeData(updatedData);
      
      console.log('✅ Carousel image deleted from Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting carousel image:', error);
      return { success: false, error: 'Failed to delete carousel image' };
    }
  };

  const reorderCarouselImages = async (newOrder) => {
    try {
      const updatedData = {
        ...homeData,
        carouselImages: newOrder
      };
      
      await firebaseService.updateHomeData(updatedData);
      setHomeData(updatedData);
      
      console.log('✅ Carousel images reordered in Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error reordering carousel images:', error);
      return { success: false, error: 'Failed to reorder carousel images' };
    }
  };

  // Objectives Management
  const addObjective = async (objective) => {
    try {
      const updatedObjectives = [...(homeData?.objectives || []), objective];
      const updatedData = {
        ...homeData,
        objectives: updatedObjectives
      };
      
      await firebaseService.updateHomeData(updatedData);
      setHomeData(updatedData);
      
      console.log('✅ Objective added to Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error adding objective:', error);
      return { success: false, error: 'Failed to add objective' };
    }
  };

  const updateObjective = async (index, newObjective) => {
    try {
      const updatedObjectives = homeData.objectives.map((obj, i) =>
        i === index ? newObjective : obj
      );
      
      const updatedData = {
        ...homeData,
        objectives: updatedObjectives
      };
      
      await firebaseService.updateHomeData(updatedData);
      setHomeData(updatedData);
      
      console.log('✅ Objective updated in Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating objective:', error);
      return { success: false, error: 'Failed to update objective' };
    }
  };

  const deleteObjective = async (index) => {
    try {
      const updatedObjectives = homeData.objectives.filter((_, i) => i !== index);
      const updatedData = {
        ...homeData,
        objectives: updatedObjectives
      };
      
      await firebaseService.updateHomeData(updatedData);
      setHomeData(updatedData);
      
      console.log('✅ Objective deleted from Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting objective:', error);
      return { success: false, error: 'Failed to delete objective' };
    }
  };

  const reorderObjectives = async (newOrder) => {
    try {
      const updatedData = {
        ...homeData,
        objectives: newOrder
      };
      
      await firebaseService.updateHomeData(updatedData);
      setHomeData(updatedData);
      
      console.log('✅ Objectives reordered in Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error reordering objectives:', error);
      return { success: false, error: 'Failed to reorder objectives' };
    }
  };

  // Get paginated objectives for large lists
  const getPaginatedObjectives = (page = 1, limit = 10) => {
    const objectives = homeData?.objectives || [];
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedObjectives = objectives.slice(startIndex, endIndex);

    return {
      objectives: paginatedObjectives,
      totalObjectives: objectives.length,
      totalPages: Math.ceil(objectives.length / limit),
      currentPage: page,
      hasNextPage: endIndex < objectives.length,
      hasPrevPage: page > 1
    };
  };

  const value = {
    // State
    aboutUs: homeData?.aboutUs || {},
    carouselImages: homeData?.carouselImages || [],
    objectives: homeData?.objectives || [],
    isLoading,

    // About Us Methods
    updateAboutUs,

    // Carousel Images Methods
    addCarouselImage,
    updateCarouselImage,
    deleteCarouselImage,
    reorderCarouselImages,

    // Objectives Methods
    addObjective,
    updateObjective,
    deleteObjective,
    reorderObjectives,
    getPaginatedObjectives
  };

  return (
    <HomeContext.Provider value={value}>
      {children}
    </HomeContext.Provider>
  );
};

export default HomeProvider;