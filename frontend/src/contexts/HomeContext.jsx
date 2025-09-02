import React, { createContext, useContext, useState, useEffect } from 'react';

const HomeContext = createContext();

export const useHome = () => {
  const context = useContext(HomeContext);
  if (!context) {
    throw new Error('useHome must be used within a HomeProvider');
  }
  return context;
};

// Default About Us content
const DEFAULT_ABOUT_US = {
  title: "About Us",
  content: "The Sustainable Energy and Smart Grid Research at BRAC University is dedicated to advancing cutting-edge research in renewable energy systems, smart grid technologies, and sustainable power infrastructure. Our interdisciplinary team works to address the global energy challenges through innovative solutions and collaborative research."
};

// Default carousel images
const DEFAULT_CAROUSEL_IMAGES = [
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
];

// Default objectives
const DEFAULT_OBJECTIVES = [
  "Advance smart grid technologies for enhanced energy distribution efficiency",
  "Integrate renewable energy sources into existing power infrastructure",
  "Develop AI-powered solutions for energy forecasting and optimization",
  "Enhance cybersecurity measures for power grid protection",
  "Create sustainable microgrids for distributed energy systems",
  "Research energy storage systems for improved grid stability",
  "Foster interdisciplinary collaboration in sustainable energy research"
];

export const HomeProvider = ({ children }) => {
  const [aboutUs, setAboutUs] = useState(DEFAULT_ABOUT_US);
  const [carouselImages, setCarouselImages] = useState(DEFAULT_CAROUSEL_IMAGES);
  const [objectives, setObjectives] = useState(DEFAULT_OBJECTIVES);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data from localStorage
  useEffect(() => {
    initializeHomeData();
  }, []);

  const initializeHomeData = () => {
    try {
      // Load About Us content
      const storedAboutUs = localStorage.getItem('sesg_home_about_us');
      if (storedAboutUs) {
        setAboutUs(JSON.parse(storedAboutUs));
      } else {
        localStorage.setItem('sesg_home_about_us', JSON.stringify(DEFAULT_ABOUT_US));
      }

      // Load carousel images
      const storedCarouselImages = localStorage.getItem('sesg_home_carousel_images');
      if (storedCarouselImages) {
        setCarouselImages(JSON.parse(storedCarouselImages));
      } else {
        localStorage.setItem('sesg_home_carousel_images', JSON.stringify(DEFAULT_CAROUSEL_IMAGES));
      }

      // Load objectives
      const storedObjectives = localStorage.getItem('sesg_home_objectives');
      if (storedObjectives) {
        setObjectives(JSON.parse(storedObjectives));
      } else {
        localStorage.setItem('sesg_home_objectives', JSON.stringify(DEFAULT_OBJECTIVES));
      }

    } catch (error) {
      console.error('Error initializing home data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // About Us Management
  const updateAboutUs = (newAboutUs) => {
    try {
      setAboutUs(newAboutUs);
      localStorage.setItem('sesg_home_about_us', JSON.stringify(newAboutUs));
      return { success: true };
    } catch (error) {
      console.error('Error updating about us:', error);
      return { success: false, error: 'Failed to update About Us content' };
    }
  };

  // Carousel Images Management
  const addCarouselImage = (imageData) => {
    try {
      const newImage = {
        id: Date.now(),
        ...imageData
      };
      const updatedImages = [...carouselImages, newImage];
      setCarouselImages(updatedImages);
      localStorage.setItem('sesg_home_carousel_images', JSON.stringify(updatedImages));
      return { success: true, image: newImage };
    } catch (error) {
      console.error('Error adding carousel image:', error);
      return { success: false, error: 'Failed to add carousel image' };
    }
  };

  const updateCarouselImage = (id, updatedData) => {
    try {
      const updatedImages = carouselImages.map(image =>
        image.id === id ? { ...image, ...updatedData } : image
      );
      setCarouselImages(updatedImages);
      localStorage.setItem('sesg_home_carousel_images', JSON.stringify(updatedImages));
      return { success: true };
    } catch (error) {
      console.error('Error updating carousel image:', error);
      return { success: false, error: 'Failed to update carousel image' };
    }
  };

  const deleteCarouselImage = (id) => {
    try {
      const updatedImages = carouselImages.filter(image => image.id !== id);
      setCarouselImages(updatedImages);
      localStorage.setItem('sesg_home_carousel_images', JSON.stringify(updatedImages));
      return { success: true };
    } catch (error) {
      console.error('Error deleting carousel image:', error);
      return { success: false, error: 'Failed to delete carousel image' };
    }
  };

  const reorderCarouselImages = (newOrder) => {
    try {
      setCarouselImages(newOrder);
      localStorage.setItem('sesg_home_carousel_images', JSON.stringify(newOrder));
      return { success: true };
    } catch (error) {
      console.error('Error reordering carousel images:', error);
      return { success: false, error: 'Failed to reorder carousel images' };
    }
  };

  // Objectives Management
  const addObjective = (objective) => {
    try {
      const updatedObjectives = [...objectives, objective];
      setObjectives(updatedObjectives);
      localStorage.setItem('sesg_home_objectives', JSON.stringify(updatedObjectives));
      return { success: true };
    } catch (error) {
      console.error('Error adding objective:', error);
      return { success: false, error: 'Failed to add objective' };
    }
  };

  const updateObjective = (index, newObjective) => {
    try {
      const updatedObjectives = objectives.map((obj, i) =>
        i === index ? newObjective : obj
      );
      setObjectives(updatedObjectives);
      localStorage.setItem('sesg_home_objectives', JSON.stringify(updatedObjectives));
      return { success: true };
    } catch (error) {
      console.error('Error updating objective:', error);
      return { success: false, error: 'Failed to update objective' };
    }
  };

  const deleteObjective = (index) => {
    try {
      const updatedObjectives = objectives.filter((_, i) => i !== index);
      setObjectives(updatedObjectives);
      localStorage.setItem('sesg_home_objectives', JSON.stringify(updatedObjectives));
      return { success: true };
    } catch (error) {
      console.error('Error deleting objective:', error);
      return { success: false, error: 'Failed to delete objective' };
    }
  };

  const reorderObjectives = (newOrder) => {
    try {
      setObjectives(newOrder);
      localStorage.setItem('sesg_home_objectives', JSON.stringify(newOrder));
      return { success: true };
    } catch (error) {
      console.error('Error reordering objectives:', error);
      return { success: false, error: 'Failed to reorder objectives' };
    }
  };

  // Get paginated objectives for large lists
  const getPaginatedObjectives = (page = 1, limit = 10) => {
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
    aboutUs,
    carouselImages,
    objectives,
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