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

  // Save data to localStorage whenever peopleData changes
  useEffect(() => {
    try {
      localStorage.setItem('sesgrg_people_data', JSON.stringify(peopleData));
      console.log('💾 Saved people data to localStorage');
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
    }
  }, [peopleData]);

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

  // Update person data
  const updatePerson = (category, personId, updatedData) => {
    setPeopleData(prevData => ({
      ...prevData,
      [category]: prevData[category].map(person =>
        person.id === personId ? { ...person, ...updatedData } : person
      )
    }));
    console.log(`✅ Updated ${category} person with ID ${personId}`);
  };

  // Add new person
  const addPerson = (category, personData) => {
    const newId = Math.max(
      ...peopleData.advisors.map(p => p.id),
      ...peopleData.teamMembers.map(p => p.id),
      ...peopleData.collaborators.map(p => p.id)
    ) + 1;
    
    const newPerson = { ...personData, id: newId };
    
    setPeopleData(prevData => ({
      ...prevData,
      [category]: [...prevData[category], newPerson]
    }));
    console.log(`✅ Added new ${category}:`, newPerson);
  };

  // Delete person
  const deletePerson = (category, personId) => {
    try {
      // Validate inputs
      if (!category || !personId) {
        throw new Error('Category and person ID are required for deletion');
      }
      
      if (!['advisors', 'teamMembers', 'collaborators'].includes(category)) {
        throw new Error(`Invalid category: ${category}. Must be advisors, teamMembers, or collaborators`);
      }
      
      setPeopleData(prevData => {
        // Check if category exists and person exists
        if (!prevData[category]) {
          throw new Error(`Category ${category} not found in people data`);
        }
        
        const personExists = prevData[category].some(person => person.id === personId);
        if (!personExists) {
          throw new Error(`Person with ID ${personId} not found in ${category}`);
        }
        
        const updatedData = {
          ...prevData,
          [category]: prevData[category].filter(person => person.id !== personId)
        };
        
        // Save updated data to localStorage
        try {
          localStorage.setItem('sesgrg_people_data', JSON.stringify(updatedData));
          console.log(`✅ Deleted ${category} person with ID ${personId} and updated localStorage`);
        } catch (error) {
          console.error('Error saving to localStorage after delete:', error);
          throw new Error('Failed to save changes to localStorage');
        }
        
        return updatedData;
      });
    } catch (error) {
      console.error('Error in deletePerson:', error);
      throw error; // Re-throw to let calling component handle it
    }
  };

  // Get all people data
  const getAllPeopleData = () => peopleData;

  const value = {
    peopleData,
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