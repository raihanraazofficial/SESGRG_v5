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
  const [footerData, setFooterData] = useState(defaultFooterData);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedFooterData = localStorage.getItem('sesg_footer_data');
      if (savedFooterData) {
        const parsedData = JSON.parse(savedFooterData);
        setFooterData(parsedData);
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading footer data from localStorage:', error);
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever data changes
  const saveFooterData = (newData) => {
    try {
      localStorage.setItem('sesg_footer_data', JSON.stringify(newData));
      setFooterData(newData);
    } catch (error) {
      console.error('Error saving footer data to localStorage:', error);
      throw error;
    }
  };

  // Update lab info
  const updateLabInfo = (newLabInfo) => {
    const updatedData = {
      ...footerData,
      labInfo: { ...footerData.labInfo, ...newLabInfo }
    };
    saveFooterData(updatedData);
  };

  // Quick Links management
  const addQuickLink = (newLink) => {
    const linkWithId = {
      ...newLink,
      id: `link-${Date.now()}`
    };
    const updatedData = {
      ...footerData,
      quickLinks: [...footerData.quickLinks, linkWithId]
    };
    saveFooterData(updatedData);
  };

  const updateQuickLink = (linkId, updatedLink) => {
    const updatedData = {
      ...footerData,
      quickLinks: footerData.quickLinks.map(link =>
        link.id === linkId ? { ...link, ...updatedLink } : link
      )
    };
    saveFooterData(updatedData);
  };

  const deleteQuickLink = (linkId) => {
    const updatedData = {
      ...footerData,
      quickLinks: footerData.quickLinks.filter(link => link.id !== linkId)
    };
    saveFooterData(updatedData);
  };

  // Contact info management
  const updateContactInfo = (newContactInfo) => {
    const updatedData = {
      ...footerData,
      contactInfo: { ...footerData.contactInfo, ...newContactInfo }
    };
    saveFooterData(updatedData);
  };

  // Social Media management
  const addSocialMedia = (newSocialMedia) => {
    const socialWithId = {
      ...newSocialMedia,
      id: `social-${Date.now()}`
    };
    const updatedData = {
      ...footerData,
      socialMedia: [...footerData.socialMedia, socialWithId]
    };
    saveFooterData(updatedData);
  };

  const updateSocialMedia = (socialId, updatedSocial) => {
    const updatedData = {
      ...footerData,
      socialMedia: footerData.socialMedia.map(social =>
        social.id === socialId ? { ...social, ...updatedSocial } : social
      )
    };
    saveFooterData(updatedData);
  };

  const deleteSocialMedia = (socialId) => {
    const updatedData = {
      ...footerData,
      socialMedia: footerData.socialMedia.filter(social => social.id !== socialId)
    };
    saveFooterData(updatedData);
  };

  const updateSocialDescription = (newDescription) => {
    const updatedData = {
      ...footerData,
      socialDescription: newDescription
    };
    saveFooterData(updatedData);
  };

  // Bottom Bar management
  const updateBottomBar = (newBottomBar) => {
    const updatedData = {
      ...footerData,
      bottomBar: { ...footerData.bottomBar, ...newBottomBar }
    };
    saveFooterData(updatedData);
  };

  const addBottomBarLink = (newLink) => {
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
    saveFooterData(updatedData);
  };

  const updateBottomBarLink = (linkId, updatedLink) => {
    const updatedData = {
      ...footerData,
      bottomBar: {
        ...footerData.bottomBar,
        links: footerData.bottomBar.links.map(link =>
          link.id === linkId ? { ...link, ...updatedLink } : link
        )
      }
    };
    saveFooterData(updatedData);
  };

  const deleteBottomBarLink = (linkId) => {
    const updatedData = {
      ...footerData,
      bottomBar: {
        ...footerData.bottomBar,
        links: footerData.bottomBar.links.filter(link => link.id !== linkId)
      }
    };
    saveFooterData(updatedData);
  };

  // Reset to defaults
  const resetFooterData = () => {
    saveFooterData(defaultFooterData);
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