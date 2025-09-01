import React, { createContext, useContext, useState, useEffect } from 'react';

const ContactContext = createContext();

export const useContact = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContact must be used within a ContactProvider');
  }
  return context;
};

// Default contact information
const DEFAULT_CONTACT_INFO = {
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
  }
};

// Default inquiry types
const DEFAULT_INQUIRY_TYPES = [
  { id: 1, label: "Research Collaboration", value: "research_collaboration" },
  { id: 2, label: "Student Opportunities", value: "student_opportunities" },
  { id: 3, label: "Industry Partnership", value: "industry_partnership" },
  { id: 4, label: "Academic Inquiry", value: "academic_inquiry" },
  { id: 5, label: "General Information", value: "general_info" },
  { id: 6, label: "Technical Support", value: "technical_support" }
];

// Default cards information
const DEFAULT_CARDS = [
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
];

// Default directions information
const DEFAULT_DIRECTIONS = {
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
};

const DEFAULT_MAP_CONFIG = {
  embedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.923235053417!2d90.42224541501535!3d23.77321088458117!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c7715a40c603%3A0xec01cd75f33139f5!2sBRAC%20University!5e0!3m2!1sen!2sbd!4v1693140400000",
  title: "BRAC University Location"
};

// Default EmailJS configuration
const DEFAULT_EMAILJS_CONFIG = {
  serviceId: "service_t24jk5y",
  templateId: "template_4463jfm", 
  publicKey: "SO-7N8WkgVst2B5lq",
  toEmail: "raihanraaz.official@gmail.com",
  enabled: true
};

export const ContactProvider = ({ children }) => {
  const [contactInfo, setContactInfo] = useState(DEFAULT_CONTACT_INFO);
  const [inquiryTypes, setInquiryTypes] = useState(DEFAULT_INQUIRY_TYPES);
  const [cards, setCards] = useState(DEFAULT_CARDS);
  const [directions, setDirections] = useState(DEFAULT_DIRECTIONS);
  const [mapConfig, setMapConfig] = useState(DEFAULT_MAP_CONFIG);
  const [emailjsConfig, setEmailjsConfig] = useState(DEFAULT_EMAILJS_CONFIG);
  const [inquiries, setInquiries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data from localStorage
  useEffect(() => {
    initializeContactData();
  }, []);

  const initializeContactData = () => {
    try {
      // Load contact info
      const storedContactInfo = localStorage.getItem('sesg_contact_info');
      if (storedContactInfo) {
        setContactInfo(JSON.parse(storedContactInfo));
      } else {
        localStorage.setItem('sesg_contact_info', JSON.stringify(DEFAULT_CONTACT_INFO));
      }

      // Load inquiry types
      const storedInquiryTypes = localStorage.getItem('sesg_inquiry_types');
      if (storedInquiryTypes) {
        setInquiryTypes(JSON.parse(storedInquiryTypes));
      } else {
        localStorage.setItem('sesg_inquiry_types', JSON.stringify(DEFAULT_INQUIRY_TYPES));
      }

      // Load cards
      const storedCards = localStorage.getItem('sesg_contact_cards');
      if (storedCards) {
        setCards(JSON.parse(storedCards));
      } else {
        localStorage.setItem('sesg_contact_cards', JSON.stringify(DEFAULT_CARDS));
      }

      // Load directions
      const storedDirections = localStorage.getItem('sesg_contact_directions');
      if (storedDirections) {
        setDirections(JSON.parse(storedDirections));
      } else {
        localStorage.setItem('sesg_contact_directions', JSON.stringify(DEFAULT_DIRECTIONS));
      }

      // Load map config
      const storedMapConfig = localStorage.getItem('sesg_map_config');
      if (storedMapConfig) {
        setMapConfig(JSON.parse(storedMapConfig));
      } else {
        localStorage.setItem('sesg_map_config', JSON.stringify(DEFAULT_MAP_CONFIG));
      }

      // Load EmailJS config
      const storedEmailjsConfig = localStorage.getItem('sesg_emailjs_config');
      if (storedEmailjsConfig) {
        setEmailjsConfig(JSON.parse(storedEmailjsConfig));
      } else {
        localStorage.setItem('sesg_emailjs_config', JSON.stringify(DEFAULT_EMAILJS_CONFIG));
      }

      // Load inquiries
      const storedInquiries = localStorage.getItem('sesg_contact_inquiries');
      if (storedInquiries) {
        setInquiries(JSON.parse(storedInquiries));
      }

    } catch (error) {
      console.error('Error initializing contact data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Contact Info Management
  const updateContactInfo = (newContactInfo) => {
    try {
      setContactInfo(newContactInfo);
      localStorage.setItem('sesg_contact_info', JSON.stringify(newContactInfo));
      return { success: true };
    } catch (error) {
      console.error('Error updating contact info:', error);
      return { success: false, error: 'Failed to update contact information' };
    }
  };

  // Inquiry Types Management
  const addInquiryType = (inquiryType) => {
    try {
      const newInquiryType = {
        id: Date.now(),
        ...inquiryType
      };
      const updatedTypes = [...inquiryTypes, newInquiryType];
      setInquiryTypes(updatedTypes);
      localStorage.setItem('sesg_inquiry_types', JSON.stringify(updatedTypes));
      return { success: true, inquiryType: newInquiryType };
    } catch (error) {
      console.error('Error adding inquiry type:', error);
      return { success: false, error: 'Failed to add inquiry type' };
    }
  };

  const updateInquiryType = (id, updatedData) => {
    try {
      const updatedTypes = inquiryTypes.map(type =>
        type.id === id ? { ...type, ...updatedData } : type
      );
      setInquiryTypes(updatedTypes);
      localStorage.setItem('sesg_inquiry_types', JSON.stringify(updatedTypes));
      return { success: true };
    } catch (error) {
      console.error('Error updating inquiry type:', error);
      return { success: false, error: 'Failed to update inquiry type' };
    }
  };

  const deleteInquiryType = (id) => {
    try {
      const updatedTypes = inquiryTypes.filter(type => type.id !== id);
      setInquiryTypes(updatedTypes);
      localStorage.setItem('sesg_inquiry_types', JSON.stringify(updatedTypes));
      return { success: true };
    } catch (error) {
      console.error('Error deleting inquiry type:', error);
      return { success: false, error: 'Failed to delete inquiry type' };
    }
  };

  // Cards Management
  const addCard = (cardData) => {
    try {
      const newCard = {
        id: Date.now(),
        ...cardData
      };
      const updatedCards = [...cards, newCard];
      setCards(updatedCards);
      localStorage.setItem('sesg_contact_cards', JSON.stringify(updatedCards));
      return { success: true, card: newCard };
    } catch (error) {
      console.error('Error adding card:', error);
      return { success: false, error: 'Failed to add card' };
    }
  };

  const updateCard = (id, updatedData) => {
    try {
      const updatedCards = cards.map(card =>
        card.id === id ? { ...card, ...updatedData } : card
      );
      setCards(updatedCards);
      localStorage.setItem('sesg_contact_cards', JSON.stringify(updatedCards));
      return { success: true };
    } catch (error) {
      console.error('Error updating card:', error);
      return { success: false, error: 'Failed to update card' };
    }
  };

  const deleteCard = (id) => {
    try {
      const updatedCards = cards.filter(card => card.id !== id);
      setCards(updatedCards);
      localStorage.setItem('sesg_contact_cards', JSON.stringify(updatedCards));
      return { success: true };
    } catch (error) {
      console.error('Error deleting card:', error);
      return { success: false, error: 'Failed to delete card' };
    }
  };

  // Directions Management
  const updateDirections = (newDirections) => {
    try {
      setDirections(newDirections);
      localStorage.setItem('sesg_contact_directions', JSON.stringify(newDirections));
      return { success: true };
    } catch (error) {
      console.error('Error updating directions:', error);
      return { success: false, error: 'Failed to update directions' };
    }
  };

  // Map Configuration Management
  const updateMapConfig = (newMapConfig) => {
    try {
      setMapConfig(newMapConfig);
      localStorage.setItem('sesg_map_config', JSON.stringify(newMapConfig));
      return { success: true };
    } catch (error) {
      console.error('Error updating map config:', error);
      return { success: false, error: 'Failed to update map configuration' };
    }
  };

  // Inquiry Submission Management
  const submitInquiry = (inquiryData) => {
    try {
      const newInquiry = {
        id: Date.now(),
        ...inquiryData,
        submittedAt: new Date().toISOString(),
        status: 'new'
      };
      
      const updatedInquiries = [newInquiry, ...inquiries];
      setInquiries(updatedInquiries);
      localStorage.setItem('sesg_contact_inquiries', JSON.stringify(updatedInquiries));
      return { success: true, inquiry: newInquiry };
    } catch (error) {
      console.error('Error submitting inquiry:', error);
      return { success: false, error: 'Failed to submit inquiry' };
    }
  };

  const updateInquiryStatus = (id, status) => {
    try {
      const updatedInquiries = inquiries.map(inquiry =>
        inquiry.id === id ? { ...inquiry, status, updatedAt: new Date().toISOString() } : inquiry
      );
      setInquiries(updatedInquiries);
      localStorage.setItem('sesg_contact_inquiries', JSON.stringify(updatedInquiries));
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
      localStorage.setItem('sesg_contact_inquiries', JSON.stringify(updatedInquiries));
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
    contactInfo,
    inquiryTypes,
    cards,
    directions,
    mapConfig,
    inquiries,
    isLoading,

    // Contact Info Methods
    updateContactInfo,

    // Inquiry Types Methods
    addInquiryType,
    updateInquiryType,
    deleteInquiryType,

    // Cards Methods
    updateCard,

    // Directions Methods
    updateDirections,

    // Map Methods
    updateMapConfig,

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