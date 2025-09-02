import React, { createContext, useContext, useState, useEffect } from 'react';
import firebaseService from '../services/firebaseService';

const ContactContext = createContext();

export const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
};

// Default contact information
const DEFAULT_CONTACT_DATA = {
  address: {
    title: "Lab Address",
    content: "Sustainable Energy and Smart Grid Research\nDepartment of Electrical and Electronic Engineering\nBRAC University\n66 Mohakhali, Dhaka 1212, Bangladesh"
  },
  phone: {
    title: "Phone",
    numbers: ["+880-2-9844051", "+880-2-9844051-54"]
  },
  email: {
    title: "Email",
    addresses: ["sesg@bracu.ac.bd", "info@bracu.ac.bd"]
  },
  officeHours: {
    title: "Office Hours",
    schedule: "Sunday - Thursday: 9:00 AM - 5:00 PM\nFriday: 9:00 AM - 12:00 PM\nSaturday: Closed"
  },
  inquiryTypes: [
    { id: 1, label: "Research Collaboration", value: "research_collaboration" },
    { id: 2, label: "Student Opportunities", value: "student_opportunities" },
    { id: 3, label: "Industry Partnership", value: "industry_partnership" },
    { id: 4, label: "Academic Inquiry", value: "academic_inquiry" },
    { id: 5, label: "General Information", value: "general_info" },
    { id: 6, label: "Technical Support", value: "technical_support" }
  ],
  cards: [
    {
      id: 1,
      title: "Research Collaboration",
      content: "Interested in collaborative research? We welcome partnerships with academic institutions and industry leaders.",
      icon: "collaboration"
    },
    {
      id: 2,
      title: "Student Opportunities", 
      content: "Looking for research opportunities? We offer positions for undergraduate and graduate students.",
      icon: "education"
    },
    {
      id: 3,
      title: "Industry Partnerships",
      content: "Connect with our lab for technology transfer, consultancy, and industrial research projects.",
      icon: "industry"
    }
  ],
  directions: {
    publicTransportation: {
      title: "Public Transportation",
      items: [
        "Take bus from Gulshan, Banani, or Mohakhali areas",
        "CNG auto-rickshaw available from nearby locations", 
        "Uber and Pathao ride-sharing services available"
      ]
    },
    byCar: {
      title: "By Car",
      items: [
        "Located on Mohakhali Road, easily accessible",
        "Parking facilities available on campus",
        "Approximately 15 minutes from Gulshan Circle"
      ]
    }
  },
  mapConfig: {
    embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.923235053417!2d90.42224541501535!3d23.77321088458117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7715a40c603%3A0xec01cd75f33139f5!2sBRAC%20University!5e0!3m2!1sen!2sbd!4v1693140400000",
    title: "BRAC University Location"
  },
  emailjsConfig: {
    serviceId: "service_t24jk5y",
    templateId: "template_4463jfm", 
    publicKey: "SO-7N8WkgVst2B5lq",
    toEmail: "raihanraaz.official@gmail.com",
    enabled: true
  }
};

export const ContactProvider = ({ children }) => {
  const [contactData, setContactData] = useState(DEFAULT_CONTACT_DATA);
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Load data from Firebase on initialization
  useEffect(() => {
    const loadContactData = async () => {
      if (initialized) return;
      
      try {
        setIsLoading(true);
        console.log('🔄 Loading contact data from Firebase...');
        
        const firebaseContactData = await firebaseService.getContactData();
        
        if (firebaseContactData) {
          setContactData(firebaseContactData);
          console.log('✅ Contact data loaded from Firebase');
        } else {
          // Initialize with default data if no data in Firebase
          console.log('📋 No contact data in Firebase, initializing with defaults...');
          try {
            await firebaseService.updateContactData(DEFAULT_CONTACT_DATA);
            console.log('✅ Default contact data initialized in Firebase');
          } catch (initError) {
            console.warn('⚠️ Could not initialize Firebase data, using defaults locally:', initError);
          }
          setContactData(DEFAULT_CONTACT_DATA);
        }
        
      } catch (error) {
        console.error('❌ Error loading contact data from Firebase:', error);
        // Fallback to default data - ensure we always have data
        console.log('🔄 Falling back to default contact data');
        setContactData(DEFAULT_CONTACT_DATA);
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    };

    loadContactData();
  }, [initialized]);

  // Contact Info Management
  const updateContactInfo = async (newContactInfo) => {
    try {
      const updatedData = { ...contactData, ...newContactInfo };
      await firebaseService.updateContactData(updatedData);
      setContactData(updatedData);
      
      console.log('✅ Contact info updated in Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating contact info:', error);
      return { success: false, error: 'Failed to update contact information' };
    }
  };

  // Inquiry Types Management
  const addInquiryType = async (inquiryType) => {
    try {
      const newInquiryType = {
        id: Date.now(),
        ...inquiryType
      };
      
      const updatedData = {
        ...contactData,
        inquiryTypes: [...(contactData?.inquiryTypes || []), newInquiryType]
      };
      
      await firebaseService.updateContactData(updatedData);
      setContactData(updatedData);
      
      console.log('✅ Inquiry type added to Firebase');
      return { success: true, inquiryType: newInquiryType };
    } catch (error) {
      console.error('❌ Error adding inquiry type:', error);
      return { success: false, error: 'Failed to add inquiry type' };
    }
  };

  const updateInquiryType = async (id, updatedData) => {
    try {
      const updatedInquiryTypes = contactData.inquiryTypes.map(type =>
        type.id === id ? { ...type, ...updatedData } : type
      );
      
      const newContactData = {
        ...contactData,
        inquiryTypes: updatedInquiryTypes
      };
      
      await firebaseService.updateContactData(newContactData);
      setContactData(newContactData);
      
      console.log('✅ Inquiry type updated in Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating inquiry type:', error);
      return { success: false, error: 'Failed to update inquiry type' };
    }
  };

  const deleteInquiryType = async (id) => {
    try {
      const updatedInquiryTypes = contactData.inquiryTypes.filter(type => type.id !== id);
      
      const newContactData = {
        ...contactData,
        inquiryTypes: updatedInquiryTypes
      };
      
      await firebaseService.updateContactData(newContactData);
      setContactData(newContactData);
      
      console.log('✅ Inquiry type deleted from Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting inquiry type:', error);
      return { success: false, error: 'Failed to delete inquiry type' };
    }
  };

  // Cards Management
  const addCard = async (cardData) => {
    try {
      const newCard = {
        id: Date.now(),
        ...cardData
      };
      
      const updatedData = {
        ...contactData,
        cards: [...(contactData?.cards || []), newCard]
      };
      
      await firebaseService.updateContactData(updatedData);
      setContactData(updatedData);
      
      console.log('✅ Card added to Firebase');
      return { success: true, card: newCard };
    } catch (error) {
      console.error('❌ Error adding card:', error);
      return { success: false, error: 'Failed to add card' };
    }
  };

  const updateCard = async (id, updatedData) => {
    try {
      const updatedCards = contactData.cards.map(card =>
        card.id === id ? { ...card, ...updatedData } : card
      );
      
      const newContactData = {
        ...contactData,
        cards: updatedCards
      };
      
      await firebaseService.updateContactData(newContactData);
      setContactData(newContactData);
      
      console.log('✅ Card updated in Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating card:', error);
      return { success: false, error: 'Failed to update card' };
    }
  };

  const deleteCard = async (id) => {
    try {
      const updatedCards = contactData.cards.filter(card => card.id !== id);
      
      const newContactData = {
        ...contactData,
        cards: updatedCards
      };
      
      await firebaseService.updateContactData(newContactData);
      setContactData(newContactData);
      
      console.log('✅ Card deleted from Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error deleting card:', error);
      return { success: false, error: 'Failed to delete card' };
    }
  };

  // Directions Management
  const updateDirections = async (newDirections) => {
    try {
      const updatedData = {
        ...contactData,
        directions: newDirections
      };
      
      await firebaseService.updateContactData(updatedData);
      setContactData(updatedData);
      
      console.log('✅ Directions updated in Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating directions:', error);
      return { success: false, error: 'Failed to update directions' };
    }
  };

  // EmailJS Configuration Management
  const updateEmailjsConfig = async (newConfig) => {
    try {
      const updatedData = {
        ...contactData,
        emailjsConfig: newConfig
      };
      
      await firebaseService.updateContactData(updatedData);
      setContactData(updatedData);
      
      console.log('✅ EmailJS config updated in Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating EmailJS config:', error);
      return { success: false, error: 'Failed to update EmailJS configuration' };
    }
  };

  const updateMapConfig = async (newMapConfig) => {
    try {
      const updatedData = {
        ...contactData,
        mapConfig: newMapConfig
      };
      
      await firebaseService.updateContactData(updatedData);
      setContactData(updatedData);
      
      console.log('✅ Map config updated in Firebase');
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating map config:', error);
      return { success: false, error: 'Failed to update map configuration' };
    }
  };

  // Inquiry Submission Management (stored separately as collection)
  const submitInquiry = async (inquiryData) => {
    try {
      const newInquiry = {
        ...inquiryData,
        submittedAt: new Date().toISOString(),
        status: 'new'
      };
      
      // For now, we'll store inquiries in a separate approach
      // Could be implemented as a separate collection later
      const updatedInquiries = [newInquiry, ...inquiries];
      setInquiries(updatedInquiries);
      
      console.log('✅ Inquiry submitted');
      return { success: true, inquiry: newInquiry };
    } catch (error) {
      console.error('❌ Error submitting inquiry:', error);
      return { success: false, error: 'Failed to submit inquiry' };
    }
  };

  const updateInquiryStatus = (id, status) => {
    try {
      const updatedInquiries = inquiries.map(inquiry =>
        inquiry.id === id ? { ...inquiry, status, updatedAt: new Date().toISOString() } : inquiry
      );
      setInquiries(updatedInquiries);
      return { success: true };
    } catch (error) {
      console.error('Error updating inquiry status:', error);
      return { success: false, error: 'Failed to update inquiry status' };
    }
  };

  const deleteInquiry = (id) => {
    try {
      const updatedInquiries = inquiries.filter(inquiry => inquiry.id !== id);
      setInquiries(updatedInquiries);
      return { success: true };
    } catch (error) {
      console.error('Error deleting inquiry:', error);
      return { success: false, error: 'Failed to delete inquiry' };
    }
  };

  // Get paginated inquiries
  const getPaginatedInquiries = (page = 1, limit = 10, status = 'all') => {
    let filteredInquiries = inquiries;
    
    if (status !== 'all') {
      filteredInquiries = inquiries.filter(inquiry => inquiry.status === status);
    }

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedInquiries = filteredInquiries.slice(startIndex, endIndex);

    return {
      inquiries: paginatedInquiries,
      totalInquiries: filteredInquiries.length,
      totalPages: Math.ceil(filteredInquiries.length / limit),
      currentPage: page,
      hasNextPage: endIndex < filteredInquiries.length,
      hasPrevPage: page > 1
    };
  };

  // Get inquiry statistics
  const getInquiryStats = () => {
    const stats = {
      total: inquiries.length,
      new: inquiries.filter(i => i.status === 'new').length,
      inProgress: inquiries.filter(i => i.status === 'in_progress').length,
      resolved: inquiries.filter(i => i.status === 'resolved').length,
      closed: inquiries.filter(i => i.status === 'closed').length
    };

    return stats;
  };

  const value = {
    // State
    contactInfo: contactData,
    inquiryTypes: contactData?.inquiryTypes || [],
    cards: contactData?.cards || [],
    directions: contactData?.directions || {},
    mapConfig: contactData?.mapConfig || {},
    emailjsConfig: contactData?.emailjsConfig || {},
    inquiries,
    isLoading,

    // Contact Info Methods
    updateContactInfo,

    // Inquiry Types Methods
    addInquiryType,
    updateInquiryType,
    deleteInquiryType,

    // Cards Methods
    addCard,
    updateCard,
    deleteCard,

    // Directions Methods
    updateDirections,

    // Map Methods
    updateMapConfig,

    // EmailJS Methods
    updateEmailjsConfig,

    // Inquiry Methods
    submitInquiry,
    updateInquiryStatus,
    deleteInquiry,
    getPaginatedInquiries,
    getInquiryStats
  };

  return (
    <ContactContext.Provider value={value}>
      {children}
    </ContactContext.Provider>
  );
};

export default ContactProvider;