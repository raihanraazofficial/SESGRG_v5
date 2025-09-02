import React, { createContext, useContext, useState, useEffect } from 'react';
import firebaseService from '../services/firebaseService';

const FooterContext = createContext();

export const useFooter = () => {
  const context = useContext(FooterContext);
  if (!context) {
    throw new Error('useFooter must be used within a FooterProvider');
  }
  return context;
};

const defaultFooterData = {
  labInfo: {
    logo: "/Logo.jpg",
    name: "SESG Research",
    subtitle: "Sustainable Energy & Smart Grid",
    description: "Pioneering Research in Clean Energy, Renewable Integration, and Next-Generation Smart Grid Systems."
  },
  quickLinks: [
    {
      id: 'link-1',
      title: "BRAC University",
      url: "https://www.bracu.ac.bd",
      isExternal: true
    },
    {
      id: 'link-2',
      title: "BSRM School of Engineering",
      url: "https://soe.bracu.ac.bd",
      isExternal: true
    },
    {
      id: 'link-3',
      title: "Research Areas",
      url: "/research",
      isExternal: false
    },
    {
      id: 'link-4',
      title: "Publications",
      url: "/publications",
      isExternal: false
    }
  ],
  contactInfo: {
    email: "sesg@bracu.ac.bd",
    phone: "+880-2-9844051-4",
    address: {
      line1: "BRAC University",
      line2: "66 Mohakhali, Dhaka 1212",
      line3: "Bangladesh"
    },
    mapLink: "/contact",
    mapText: "View on Map →"
  },
  socialMedia: [
    {
      id: 'facebook',
      name: 'Facebook',
      url: '#',
      icon: 'Facebook',
      bgColor: 'bg-blue-600',
      hoverColor: 'hover:bg-blue-700'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      url: '#',
      icon: 'Linkedin',
      bgColor: 'bg-blue-700',
      hoverColor: 'hover:bg-blue-800'
    },
    {
      id: 'twitter',
      name: 'Twitter',
      url: '#',
      icon: 'Twitter',
      bgColor: 'bg-sky-500',
      hoverColor: 'hover:bg-sky-600'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      url: '#',
      icon: 'Instagram',
      bgColor: 'bg-pink-600',
      hoverColor: 'hover:bg-pink-700'
    },
    {
      id: 'youtube',
      name: 'YouTube',
      url: '#',
      icon: 'Youtube',
      bgColor: 'bg-red-600',
      hoverColor: 'hover:bg-red-700'
    }
  ],
  socialDescription: "Stay connected with our latest research updates and announcements.",
  bottomBar: {
    copyright: "Sustainable Energy and Smart Grid Research. All rights reserved.",
    links: [
      {
        id: 'faq',
        title: 'FAQ',
        url: '/faq'
      },
      {
        id: 'privacy',
        title: 'Privacy Policy',
        url: '/privacy'
      },
      {
        id: 'terms',
        title: 'Terms & Conditions',
        url: '/terms'
      },
      {
        id: 'contact',
        title: 'Contact',
        url: '/contact'
      }
    ]
  }
};

export const FooterProvider = ({ children }) => {
  const [footerData, setFooterData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Load data from Firebase on initialization
  useEffect(() => {
    const loadFooterData = async () => {
      if (initialized) return;
      
      try {
        setIsLoading(true);
        console.log('🔄 Loading footer data from Firebase...');
        
        const firebaseFooterData = await firebaseService.getFooterData();
        
        if (firebaseFooterData) {
          setFooterData(firebaseFooterData);
          console.log('✅ Footer data loaded from Firebase');
        } else {
          // Initialize with default data if no data in Firebase
          console.log('📋 No footer data in Firebase, initializing with defaults...');
          await firebaseService.updateFooterData(defaultFooterData);
          setFooterData(defaultFooterData);
          console.log('✅ Default footer data initialized in Firebase');
        }
        
      } catch (error) {
        console.error('❌ Error loading footer data from Firebase:', error);
        // Fallback to default data
        setFooterData(defaultFooterData);
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    };

    loadFooterData();
  }, [initialized]);

  // Save to Firebase whenever data changes
  const saveFooterData = async (newData) => {
    try {
      await firebaseService.updateFooterData(newData);
      setFooterData(newData);
      console.log('✅ Footer data saved to Firebase');
    } catch (error) {
      console.error('❌ Error saving footer data to Firebase:', error);
      throw error;
    }
  };

  // Update lab info
  const updateLabInfo = async (newLabInfo) => {
    const updatedData = {
      ...footerData,
      labInfo: { ...footerData.labInfo, ...newLabInfo }
    };
    await saveFooterData(updatedData);
  };

  // Quick Links management
  const addQuickLink = async (newLink) => {
    const linkWithId = {
      ...newLink,
      id: `link-${Date.now()}`
    };
    const updatedData = {
      ...footerData,
      quickLinks: [...footerData.quickLinks, linkWithId]
    };
    await saveFooterData(updatedData);
  };

  const updateQuickLink = async (linkId, updatedLink) => {
    const updatedData = {
      ...footerData,
      quickLinks: footerData.quickLinks.map(link =>
        link.id === linkId ? { ...link, ...updatedLink } : link
      )
    };
    await saveFooterData(updatedData);
  };

  const deleteQuickLink = async (linkId) => {
    const updatedData = {
      ...footerData,
      quickLinks: footerData.quickLinks.filter(link => link.id !== linkId)
    };
    await saveFooterData(updatedData);
  };

  // Contact info management
  const updateContactInfo = async (newContactInfo) => {
    const updatedData = {
      ...footerData,
      contactInfo: { ...footerData.contactInfo, ...newContactInfo }
    };
    await saveFooterData(updatedData);
  };

  // Social Media management
  const addSocialMedia = async (newSocialMedia) => {
    const socialWithId = {
      ...newSocialMedia,
      id: `social-${Date.now()}`
    };
    const updatedData = {
      ...footerData,
      socialMedia: [...footerData.socialMedia, socialWithId]
    };
    await saveFooterData(updatedData);
  };

  const updateSocialMedia = async (socialId, updatedSocial) => {
    const updatedData = {
      ...footerData,
      socialMedia: footerData.socialMedia.map(social =>
        social.id === socialId ? { ...social, ...updatedSocial } : social
      )
    };
    await saveFooterData(updatedData);
  };

  const deleteSocialMedia = async (socialId) => {
    const updatedData = {
      ...footerData,
      socialMedia: footerData.socialMedia.filter(social => social.id !== socialId)
    };
    await saveFooterData(updatedData);
  };

  const updateSocialDescription = async (newDescription) => {
    const updatedData = {
      ...footerData,
      socialDescription: newDescription
    };
    await saveFooterData(updatedData);
  };

  // Bottom Bar management
  const updateBottomBar = async (newBottomBar) => {
    const updatedData = {
      ...footerData,
      bottomBar: { ...footerData.bottomBar, ...newBottomBar }
    };
    await saveFooterData(updatedData);
  };

  const addBottomBarLink = async (newLink) => {
    const linkWithId = {
      ...newLink,
      id: `bottom-link-${Date.now()}`
    };
    const updatedData = {
      ...footerData,
      bottomBar: {
        ...footerData.bottomBar,
        links: [...footerData.bottomBar.links, linkWithId]
      }
    };
    await saveFooterData(updatedData);
  };

  const updateBottomBarLink = async (linkId, updatedLink) => {
    const updatedData = {
      ...footerData,
      bottomBar: {
        ...footerData.bottomBar,
        links: footerData.bottomBar.links.map(link =>
          link.id === linkId ? { ...link, ...updatedLink } : link
        )
      }
    };
    await saveFooterData(updatedData);
  };

  const deleteBottomBarLink = async (linkId) => {
    const updatedData = {
      ...footerData,
      bottomBar: {
        ...footerData.bottomBar,
        links: footerData.bottomBar.links.filter(link => link.id !== linkId)
      }
    };
    await saveFooterData(updatedData);
  };

  // Reset to defaults
  const resetFooterData = async () => {
    await saveFooterData(defaultFooterData);
  };

  const value = {
    footerData,
    isLoading,
    
    // Lab Info
    updateLabInfo,
    
    // Quick Links
    addQuickLink,
    updateQuickLink,
    deleteQuickLink,
    
    // Contact Info
    updateContactInfo,
    
    // Social Media
    addSocialMedia,
    updateSocialMedia,
    deleteSocialMedia,
    updateSocialDescription,
    
    // Bottom Bar
    updateBottomBar,
    addBottomBarLink,
    updateBottomBarLink,
    deleteBottomBarLink,
    
    // Utility
    resetFooterData
  };

  return (
    <FooterContext.Provider value={value}>
      {children}
    </FooterContext.Provider>
  );
};

export default FooterContext;