import React, { createContext, useContext, useState, useEffect } from 'react';
import firebaseService from '../services/firebaseService';

const PeopleContext = createContext();

export const usePeople = () => {
  const context = useContext(PeopleContext);
  if (!context) {
    throw new Error('usePeople must be used within a PeopleProvider');
  }
  return context;
};

export const PeopleProvider = ({ children }) => {
  const [peopleData, setPeopleData] = useState({
    advisors: [],
    teamMembers: [],
    collaborators: []
  });
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  // Research areas mapping
  const researchAreas = [
    "Smart Grid Technologies",
    "Microgrids & Distributed Energy Systems", 
    "Renewable Energy Integration",
    "Grid Optimization & Stability",
    "Energy Storage Systems",
    "Power System Automation",
    "Cybersecurity and AI for Power Infrastructure"
  ];

  // Load data from Firebase on initialization
  useEffect(() => {
    const loadPeopleData = async () => {
      if (initialized) return;
      
      try {
        setLoading(true);
        console.log('🔄 Loading people data from Firebase...');
        
        const firebasePeople = await firebaseService.getPeople();
        
        // Group people by category
        const groupedData = {
          advisors: firebasePeople.filter(person => person.category === 'advisors'),
          teamMembers: firebasePeople.filter(person => person.category === 'teamMembers'),
          collaborators: firebasePeople.filter(person => person.category === 'collaborators')
        };
        
        setPeopleData(groupedData);
        console.log('✅ People data loaded from Firebase:', {
          advisors: groupedData.advisors.length,
          teamMembers: groupedData.teamMembers.length,
          collaborators: groupedData.collaborators.length
        });
        
      } catch (error) {
        console.error('❌ Error loading people data from Firebase:', error);
        // Keep default empty structure if Firebase fails
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    loadPeopleData();
  }, [initialized]);

  // Get people by research area (for ResearchAreas.jsx)
  const getPeopleByResearchArea = (areaId) => {
    const areaIndex = areaId - 1; // Convert 1-based ID to 0-based index
    const allPeople = [
      ...peopleData.advisors.map(p => ({ ...p, category: 'Advisor' })),
      ...peopleData.teamMembers.map(p => ({ ...p, category: 'Team Member' })),
      ...peopleData.collaborators.map(p => ({ ...p, category: 'Collaborator' }))
    ];
    
    return allPeople.filter(person => 
      person.expertise && person.expertise.includes(areaIndex)
    );
  };

  // Update person data with Firebase - Updated to match ContentManagement interface
  const updatePerson = async (personId, updatedData) => {
    try {
      // Determine category from formData
      let category = 'teamMembers'; // Default
      if (updatedData.category) {
        const categoryMap = {
          'Advisor': 'advisors',
          'Team Member': 'teamMembers',
          'Collaborator': 'collaborators'
        };
        category = categoryMap[updatedData.category] || 'teamMembers';
      }

      // Find person in Firebase and update
      const firebasePeople = await firebaseService.getPeople();
      const person = firebasePeople.find(p => p.id === personId);
      
      if (!person) {
        throw new Error(`Person with ID ${personId} not found`);
      }
      
      await firebaseService.updatePerson(person.id, { ...updatedData, category });
      
      // Update local state - remove from old category and add to new category
      setPeopleData(prevData => {
        // Remove from old category
        const oldCategory = person.category;
        const updatedState = {
          advisors: prevData.advisors.filter(p => p.id !== personId),
          teamMembers: prevData.teamMembers.filter(p => p.id !== personId),
          collaborators: prevData.collaborators.filter(p => p.id !== personId)
        };
        
        // Add to new category
        updatedState[category] = [...updatedState[category], { ...person, ...updatedData, category }];
        
        return updatedState;
      });
      
      console.log(`✅ Updated person with ID ${personId} in Firebase`);
    } catch (error) {
      console.error('Error updating person:', error);
      throw error;
    }
  };

  // Add new person with Firebase - Updated to match ContentManagement interface
  const addPerson = async (personData) => {
    try {
      // Determine category from formData
      let category = 'teamMembers'; // Default
      if (personData.category) {
        const categoryMap = {
          'Advisor': 'advisors',
          'Team Member': 'teamMembers',
          'Collaborator': 'collaborators'
        };
        category = categoryMap[personData.category] || 'teamMembers';
      }

      // Generate unique ID
      const newPersonData = { 
        ...personData, 
        category,
        id: `person_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      };
      
      const newPerson = await firebaseService.addPerson(newPersonData);
      
      // Update local state
      setPeopleData(prevData => ({
        ...prevData,
        [category]: [...prevData[category], newPerson]
      }));
      
      console.log(`✅ Added new ${category} to Firebase:`, newPerson);
      return newPerson;
    } catch (error) {
      console.error('Error adding person:', error);
      throw error;
    }
  };

  // Delete person with Firebase
  const deletePerson = async (category, personId) => {
    try {
      // Validate inputs
      if (!category || !personId) {
        throw new Error('Category and person ID are required for deletion');
      }
      
      if (!['advisors', 'teamMembers', 'collaborators'].includes(category)) {
        throw new Error(`Invalid category: ${category}. Must be advisors, teamMembers, or collaborators`);
      }
      
      // Find person in Firebase
      const firebasePeople = await firebaseService.getPeople();
      const person = firebasePeople.find(p => p.id === personId && p.category === category);
      
      if (!person) {
        throw new Error(`Person with ID ${personId} not found in ${category}`);
      }
      
      // Delete from Firebase
      await firebaseService.deletePerson(person.id);
      
      // Update local state
      setPeopleData(prevData => ({
        ...prevData,
        [category]: prevData[category].filter(person => person.id !== personId)
      }));
      
      console.log(`✅ Deleted ${category} person with ID ${personId} from Firebase`);
    } catch (error) {
      console.error('Error in deletePerson:', error);
      throw error; // Re-throw to let calling component handle it
    }
  };

  // Get all people data
  const getAllPeopleData = () => peopleData;

  const value = {
    peopleData,
    loading,
    researchAreas,
    getPeopleByResearchArea,
    updatePerson,
    addPerson,
    deletePerson,
    getAllPeopleData
  };

  return (
    <PeopleContext.Provider value={value}>
      {children}
    </PeopleContext.Provider>
  );
};