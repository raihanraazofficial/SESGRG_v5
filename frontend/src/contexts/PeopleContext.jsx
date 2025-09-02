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

  // Update person data with Firebase
  const updatePerson = async (category, personId, updatedData) => {
    try {
      // Find person in Firebase and update
      const firebasePeople = await firebaseService.getPeople();
      const person = firebasePeople.find(p => p.id === personId && p.category === category);
      
      if (!person) {
        throw new Error(`Person with ID ${personId} not found in ${category}`);
      }
      
      await firebaseService.updatePerson(person.id, { ...updatedData, category });
      
      // Update local state
      setPeopleData(prevData => ({
        ...prevData,
        [category]: prevData[category].map(person =>
          person.id === personId ? { ...person, ...updatedData } : person
        )
      }));
      
      console.log(`✅ Updated ${category} person with ID ${personId} in Firebase`);
    } catch (error) {
      console.error('Error updating person:', error);
      throw error;
    }
  };

  // Add new person with Firebase
  const addPerson = async (category, personData) => {
    try {
      const newPersonData = { ...personData, category };
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