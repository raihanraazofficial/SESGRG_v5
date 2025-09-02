import React, { createContext, useContext, useState, useEffect } from 'react';
import firebaseService from '../services/firebaseService';

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
    description: "Research and installation of solar panel systems for sustainable energy generation",
    order: 1
  },
  {
    id: 2,
    url: "https://images.unsplash.com/photo-1639313521811-fdfb1c040ddb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHw0fHxzdXN0YWluYWJsZSUyMGVuZXJneSUyMHJlc2VhcmNoJTIwbGFib3JhdG9yeXxlbnwwfHx8fDE3NTY2NTQxNDl8MA&ixlib=rb-4.1.0&q=85",
    caption: "Control Room Monitoring",
    category: "Smart Grid",
    description: "Advanced monitoring systems for smart grid control and management",
    order: 2
  },
  {
    id: 3,
    url: "https://images.pexels.com/photos/3861435/pexels-photo-3861435.jpeg",
    caption: "Laboratory Research Work",
    category: "Research Activities",
    description: "Ongoing laboratory research activities in sustainable energy technologies",
    order: 3
  },
  {
    id: 4,
    url: "https://images.unsplash.com/photo-1606206873764-fd15e242df52?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwxfHxyZXNlYXJjaCUyMGxhYm9yYXRvcnl8ZW58MHx8fHwxNzU2NjU0MTU2fDA&ixlib=rb-4.1.0&q=85",
    caption: "Laboratory Equipment Analysis",
    category: "Research Activities",
    description: "Advanced equipment analysis for energy research applications",
    order: 4
  },
  {
    id: 5,
    url: "https://images.unsplash.com/photo-1608037222011-cbf484177126?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw0fHxyZXNlYXJjaCUyMGxhYm9yYXRvcnl8ZW58MHx8fHwxNzU2NjU0MTU2fDA&ixlib=rb-4.1.0&q=85",
    caption: "University Laboratory Environment",
    category: "Research Activities",
    description: "Professional laboratory environment for advanced research",
    order: 5
  },
  {
    id: 6,
    url: "https://images.pexels.com/photos/8539753/pexels-photo-8539753.jpeg",
    caption: "Professional Research Activities",
    category: "Research Activities",
    description: "Professional research activities in energy systems",
    order: 6
  },
  {
    id: 7,
    url: "https://images.unsplash.com/photo-1632103996718-4a47cf68b75e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85",
    caption: "Wind Turbine Research",
    category: "Renewable Energy",
    description: "Wind turbine technology research and development",
    order: 7
  },
  {
    id: 8,
    url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85",
    caption: "Wind Farm Installation",
    category: "Renewable Energy",
    description: "Large-scale wind farm installation and monitoring",
    order: 8
  },
  {
    id: 9,
    url: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85",
    caption: "Solar Panel Farm",
    category: "Renewable Energy",
    description: "Utility-scale solar panel farm for clean energy production",
    order: 9
  },
  {
    id: 10,
    url: "https://images.unsplash.com/photo-1467533003447-e295ff1b0435?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw0fHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85",
    caption: "Modern Wind Turbines",
    category: "Renewable Energy",
    description: "State-of-the-art wind turbine technology",
    order: 10
  },
  {
    id: 11,
    url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGdyaWR8ZW58MHx8fHwxNzU2NTM1MTU3fDA&ixlib=rb-4.1.0&q=85",
    caption: "Power Transmission Infrastructure",
    category: "Smart Grid",
    description: "Advanced power transmission and distribution infrastructure",
    order: 11
  }
];

const DEFAULT_CATEGORIES = [
  "Renewable Energy",
  "Smart Grid", 
  "Research Activities"
];

export const GalleryProvider = ({ children }) => {
  const [galleryItems, setGalleryItems] = useState([]);
  const [categories, setCategories] = useState(DEFAULT_CATEGORIES);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Load data from Firebase on initialization
  useEffect(() => {
    const loadGalleryData = async () => {
      if (initialized) return;
      
      try {
        setIsLoading(true);
        console.log('🔄 Loading gallery data from Firebase...');
        
        const firebaseGallery = await firebaseService.getGalleryImages();
        
        if (firebaseGallery.length > 0) {
          setGalleryItems(firebaseGallery);
          // Extract unique categories from gallery items
          const uniqueCategories = [...new Set(firebaseGallery.map(item => item.category))];
          setCategories(uniqueCategories.length > 0 ? uniqueCategories : DEFAULT_CATEGORIES);
          console.log(`✅ Gallery data loaded from Firebase: ${firebaseGallery.length} items`);
        } else {
          // Initialize with default data if no data in Firebase
          console.log('📋 No gallery data in Firebase, initializing with defaults...');
          for (const item of DEFAULT_GALLERY) {
            await firebaseService.addGalleryImage(item);
          }
          setGalleryItems(DEFAULT_GALLERY);
          setCategories(DEFAULT_CATEGORIES);
          console.log('✅ Default gallery data initialized in Firebase');
        }
        
      } catch (error) {
        console.error('❌ Error loading gallery data from Firebase:', error);
        // Fallback to default data
        setGalleryItems(DEFAULT_GALLERY);
        setCategories(DEFAULT_CATEGORIES);
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    };

    loadGalleryData();
  }, [initialized]);

  // Gallery Item Management
  const addGalleryItem = async (itemData) => {
    try {
      const newItemData = {
        ...itemData,
        order: galleryItems.length + 1
      };
      
      const newItem = await firebaseService.addGalleryImage(newItemData);
      setGalleryItems(prev => [...prev, newItem]);
      
      // Update categories if new category
      if (itemData.category && !categories.includes(itemData.category)) {
        setCategories(prev => [...prev, itemData.category]);
      }
      
      console.log('✅ Gallery item added to Firebase:', newItem);
      return { success: true, item: newItem };
    } catch (error) {
      console.error('❌ Error adding gallery item:', error);
      return { success: false, error: 'Failed to add gallery item' };
    }
  };

  const updateGalleryItem = async (id, updatedData) => {
    try {
      const updatedItem = await firebaseService.updateGalleryImage(id, updatedData);
      setGalleryItems(prev =>
        prev.map(item => item.id === id ? updatedItem : item)
      );
      
      // Update categories if category changed
      if (updatedData.category && !categories.includes(updatedData.category)) {
        setCategories(prev => [...prev, updatedData.category]);
      }
      
      console.log('✅ Gallery item updated in Firebase:', updatedItem);
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating gallery item:', error);
      return { success: false, error: 'Failed to update gallery item' };
    }
  };

  const deleteGalleryItem = async (id) => {
    try {
      await firebaseService.deleteGalleryImage(id);
      
      const updatedItems = galleryItems.filter(item => item.id !== id);
      setGalleryItems(updatedItems);
      
      console.log('✅ Gallery item deleted from Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting gallery item:', error);
      return { success: false, error: 'Failed to delete gallery item' };
    }
  };

  // Category Management (helper methods - categories derived from items)
  const addCategory = (category) => {
    try {
      if (!categories.includes(category)) {
        setCategories(prev => [...prev, category]);
        return { success: true };
      }
      return { success: false, error: 'Category already exists' };
    } catch (error) {
      console.error('Error adding category:', error);
      return { success: false, error: 'Failed to add category' };
    }
  };

  const updateCategory = async (oldCategory, newCategory) => {
    try {
      // Update all gallery items with old category
      const itemsToUpdate = galleryItems.filter(item => item.category === oldCategory);
      
      for (const item of itemsToUpdate) {
        await firebaseService.updateGalleryImage(item.id, { 
          ...item, 
          category: newCategory 
        });
      }
      
      // Update local state
      setGalleryItems(prev =>
        prev.map(item =>
          item.category === oldCategory ? { ...item, category: newCategory } : item
        )
      );
      
      setCategories(prev =>
        prev.map(cat => cat === oldCategory ? newCategory : cat)
      );
      
      console.log('✅ Category updated in Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating category:', error);
      return { success: false, error: 'Failed to update category' };
    }
  };

  const deleteCategory = async (category) => {
    try {
      // Update all gallery items with this category to default category
      const itemsToUpdate = galleryItems.filter(item => item.category === category);
      
      for (const item of itemsToUpdate) {
        await firebaseService.updateGalleryImage(item.id, { 
          ...item, 
          category: 'Research Activities' 
        });
      }
      
      // Update local state
      setGalleryItems(prev =>
        prev.map(item =>
          item.category === category ? { ...item, category: 'Research Activities' } : item
        )
      );
      
      setCategories(prev => prev.filter(cat => cat !== category));
      
      console.log('✅ Category deleted from Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting category:', error);
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