import React, { createContext, useContext, useState, useEffect } from 'react';

const GalleryContext = createContext();

export const useGallery = () => {
  const context = useContext(GalleryContext);
  if (!context) {
    throw new Error('useGallery must be used within a GalleryProvider');
  }
  return context;
};

// Default gallery data (current hardcoded images)
const DEFAULT_GALLERY = [
  {
    id: 1,
    url: "https://images.unsplash.com/photo-1655300256620-680cb0f1cec3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGVuZXJneSUyMHJlc2VhcmNoJTIwbGFib3JhdG9yeXxlbnwwfHx8fDE3NTY2NTQxNDl8MA&ixlib=rb-4.1.0&q=85",
    caption: "Solar Panel Installation Research",
    category: "Renewable Energy",
    description: "Research and installation of solar panel systems for sustainable energy generation"
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1639313521811-fdfb1c040ddb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxzdXN0YWluYWJsZSUyMGVuZXJneSUyMHJlc2VhcmNoJTIwbGFib3JhdG9yeXxlbnwwfHx8fDE3NTY2NTQxNDl8MA&ixlib=rb-4.1.0&q=85",
    caption: "Control Room Monitoring",
    category: "Smart Grid",
    description: "Advanced monitoring systems for smart grid control and management"
  },
  {
    id: 3,
    url: "https://images.pexels.com/photos/3861435/pexels-photo-3861435.jpeg",
    caption: "Laboratory Research Work",
    category: "Research Activities",
    description: "Ongoing laboratory research activities in sustainable energy technologies"
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1606206873764-fd15e242df52?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMGxhYm9yYXRvcnl8ZW58MHx8fHwxNzU2NjU0MTU2fDA&ixlib=rb-4.1.0&q=85",
    caption: "Laboratory Equipment Analysis",
    category: "Research Activities",
    description: "Advanced equipment analysis for energy research applications"
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1608037222011-cbf484177126?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw0fHxyZXNlYXJjaCUyMGxhYm9yYXRvcnl8ZW58MHx8fHwxNzU2NjU0MTU2fDA&ixlib=rb-4.1.0&q=85",
    caption: "University Laboratory Environment",
    category: "Research Activities",
    description: "Professional laboratory environment for advanced research"
  },
  {
    id: 6,
    url: "https://images.pexels.com/photos/8539753/pexels-photo-8539753.jpeg",
    caption: "Professional Research Activities",
    category: "Research Activities",
    description: "Professional research activities in energy systems"
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1632103996718-4a47cf68b75e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85",
    caption: "Wind Turbine Research",
    category: "Renewable Energy",
    description: "Wind turbine technology research and development"
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85",
    caption: "Wind Farm Installation",
    category: "Renewable Energy",
    description: "Large-scale wind farm installation and monitoring"
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85",
    caption: "Solar Panel Farm",
    category: "Renewable Energy",
    description: "Utility-scale solar panel farm for clean energy production"
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1467533003447-e295ff1b0435?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw0fHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85",
    caption: "Modern Wind Turbines",
    category: "Renewable Energy",
    description: "State-of-the-art wind turbine technology"
  },
  {
    id: 11,
    url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGdyaWR8ZW58MHx8fHwxNzU2NTM1MTU3fDA&ixlib=rb-4.1.0&q=85",
    caption: "Power Transmission Infrastructure",
    category: "Smart Grid",
    description: "Advanced power transmission and distribution infrastructure"
  }
];

const DEFAULT_CATEGORIES = [
  "Renewable Energy",
  "Smart Grid", 
  "Research Activities"
];

export const GalleryProvider = ({ children }) => {
  const [galleryItems, setGalleryItems] = useState(DEFAULT_GALLERY);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data from localStorage
  useEffect(() => {
    initializeGalleryData();
  }, []);

  const initializeGalleryData = () => {
    try {
      // Load gallery items
      const storedGallery = localStorage.getItem('sesg_gallery_items');
      if (storedGallery) {
        setGalleryItems(JSON.parse(storedGallery));
      } else {
        localStorage.setItem('sesg_gallery_items', JSON.stringify(DEFAULT_GALLERY));
      }

      // Load categories
      const storedCategories = localStorage.getItem('sesg_gallery_categories');
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories));
      } else {
        localStorage.setItem('sesg_gallery_categories', JSON.stringify(DEFAULT_CATEGORIES));
      }

    } catch (error) {
      console.error('Error initializing gallery data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Gallery Item Management
  const addGalleryItem = (itemData) => {
    try {
      const newItem = {
        id: Date.now(),
        ...itemData
      };
      const updatedItems = [...galleryItems, newItem];
      setGalleryItems(updatedItems);
      localStorage.setItem('sesg_gallery_items', JSON.stringify(updatedItems));
      return { success: true, item: newItem };
    } catch (error) {
      console.error('Error adding gallery item:', error);
      return { success: false, error: 'Failed to add gallery item' };
    }
  };

  const updateGalleryItem = (id, updatedData) => {
    try {
      const updatedItems = galleryItems.map(item =>
        item.id === id ? { ...item, ...updatedData } : item
      );
      setGalleryItems(updatedItems);
      localStorage.setItem('sesg_gallery_items', JSON.stringify(updatedItems));
      return { success: true };
    } catch (error) {
      console.error('Error updating gallery item:', error);
      return { success: false, error: 'Failed to update gallery item' };
    }
  };

  const deleteGalleryItem = (id) => {
    try {
      const updatedItems = galleryItems.filter(item => item.id !== id);
      setGalleryItems(updatedItems);
      localStorage.setItem('sesg_gallery_items', JSON.stringify(updatedItems));
      return { success: true };
    } catch (error) {
      console.error('Error deleting gallery item:', error);
      return { success: false, error: 'Failed to delete gallery item' };
    }
  };

  // Category Management
  const addCategory = (category) => {
    try {
      const updatedCategories = [...categories, category];
      setCategories(updatedCategories);
      localStorage.setItem('sesg_gallery_categories', JSON.stringify(updatedCategories));
      return { success: true };
    } catch (error) {
      console.error('Error adding category:', error);
      return { success: false, error: 'Failed to add category' };
    }
  };

  const updateCategory = (oldCategory, newCategory) => {
    try {
      const updatedCategories = categories.map(cat => 
        cat === oldCategory ? newCategory : cat
      );
      setCategories(updatedCategories);
      
      // Update gallery items with new category
      const updatedItems = galleryItems.map(item =>
        item.category === oldCategory ? { ...item, category: newCategory } : item
      );
      setGalleryItems(updatedItems);
      
      localStorage.setItem('sesg_gallery_categories', JSON.stringify(updatedCategories));
      localStorage.setItem('sesg_gallery_items', JSON.stringify(updatedItems));
      return { success: true };
    } catch (error) {
      console.error('Error updating category:', error);
      return { success: false, error: 'Failed to update category' };
    }
  };

  const deleteCategory = (category) => {
    try {
      const updatedCategories = categories.filter(cat => cat !== category);
      setCategories(updatedCategories);
      
      // Update gallery items - remove category or set to default
      const updatedItems = galleryItems.map(item =>
        item.category === category ? { ...item, category: 'Research Activities' } : item
      );
      setGalleryItems(updatedItems);
      
      localStorage.setItem('sesg_gallery_categories', JSON.stringify(updatedCategories));
      localStorage.setItem('sesg_gallery_items', JSON.stringify(updatedItems));
      return { success: true };
    } catch (error) {
      console.error('Error deleting category:', error);
      return { success: false, error: 'Failed to delete category' };
    }
  };

  // Get items by category
  const getItemsByCategory = (category) => {
    return galleryItems.filter(item => item.category === category);
  };

  // Get paginated items
  const getPaginatedItems = (page = 1, limit = 12, categoryFilter = 'all') => {
    let filteredItems = galleryItems;
    
    if (categoryFilter && categoryFilter !== 'all') {
      filteredItems = galleryItems.filter(item => item.category === categoryFilter);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedItems = filteredItems.slice(startIndex, endIndex);

    return {
      items: paginatedItems,
      totalItems: filteredItems.length,
      totalPages: Math.ceil(filteredItems.length / limit),
      currentPage: page,
      hasNextPage: endIndex < filteredItems.length,
      hasPrevPage: page > 1
    };
  };

  const value = {
    // State
    galleryItems,
    categories,
    isLoading,

    // Gallery Item Methods
    addGalleryItem,
    updateGalleryItem,
    deleteGalleryItem,

    // Category Methods
    addCategory,
    updateCategory,
    deleteCategory,

    // Utility Methods
    getItemsByCategory,
    getPaginatedItems
  };

  return (
    <GalleryContext.Provider value={value}>
      {children}
    </GalleryContext.Provider>
  );
};

export default GalleryProvider;