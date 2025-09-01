import React, { createContext, useContext, useState, useEffect } from 'react';

const PeopleContext = createContext();

export const usePeople = () => {
  const context = useContext(PeopleContext);
  if (!context) {
    throw new Error('usePeople must be used within a PeopleProvider');
  }
  return context;
};

export const PeopleProvider = ({ children }) => {
  // Initialize with default data immediately
  const [peopleData, setPeopleData] = useState(() => {
    // Try to load from localStorage first
    try {
      const storedData = localStorage.getItem('sesgrg_people_data');
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
    
    // Return default data if localStorage fails
    return {
      advisors: [
        {
          id: 1,
          name: "A. S. Nazmul Huda, PhD",
          designation: "Associate Professor",
          affiliation: "Department of EEE, BRAC University",
          description: "Expert in power systems reliability, renewable energy, and smart grid optimization with strong focus on modeling, simulation, and condition monitoring.",
          expertise: [0, 2, 3], // Smart Grid Technologies, Renewable Energy Integration, Grid Optimization & Stability
          photo: "https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/Nazmul%20Huda.jpg",
          email: "nazmul.huda@bracu.ac.bd",
          phone: "+880-2-9844051",
          googleScholar: "https://scholar.google.com/citations?user=nazmul-huda",
          researchGate: "https://www.researchgate.net/profile/nazmul-huda",
          orcid: "https://orcid.org/0000-0000-0000-0001",
          linkedin: "https://linkedin.com/in/nazmul-huda",
          github: "https://github.com/nazmul-huda",
          ieee: "https://ieeexplore.ieee.org/author/nazmul-huda",
          website: "https://engineering.bracu.ac.bd/profile/as-nazmul-huda-phd"
        },
        {
          id: 2,
          name: "Shameem Ahmad, PhD",
          designation: "Associate Professor",
          affiliation: "Department of EEE, BRAC University",
          description: "Specialist in smart grids, microgrids, and AI-driven power system control with expertise in renewable energy and advanced power converters.",
          expertise: [1, 3, 0], // Microgrids & Distributed Energy Systems, Grid Optimization & Stability, Smart Grid Technologies
          photo: "https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/Shameem%20Ahmad.jpg",
          email: "shameem.ahmad@bracu.ac.bd",
          phone: "+880-2-9844052",
          googleScholar: "https://scholar.google.com/citations?user=shameem-ahmad",
          researchGate: "https://www.researchgate.net/profile/shameem-ahmad",
          orcid: "https://orcid.org/0000-0000-0000-0002",
          linkedin: "https://linkedin.com/in/shameem-ahmad",
          github: "https://github.com/shameem-ahmad",
          ieee: "https://ieeexplore.ieee.org/author/shameem-ahmad",
          website: "https://engineering.bracu.ac.bd/profile/shameem-ahmad-phd"
        },
        {
          id: 3,
          name: "Amirul Islam, PhD",
          designation: "Assistant Professor",
          affiliation: "Department of EEE, BRAC University",
          description: "Researcher in artificial intelligence and power systems with expertise in multimodal signal processing, smart grid automation, and interdisciplinary applications of AI.",
          expertise: [5, 6], // Power System Automation, Cybersecurity and AI for Power Infrastructure
          photo: "https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/Amirul%20Islam.jpg",
          email: "amirul.islam@bracu.ac.bd",
          phone: "+880-2-9844053",
          googleScholar: "https://scholar.google.com/citations?user=amirul-islam",
          researchGate: "https://www.researchgate.net/profile/amirul-islam",
          orcid: "https://orcid.org/0000-0000-0000-0003",
          linkedin: "https://linkedin.com/in/amirul-islam",
          github: "https://github.com/amirul-islam",
          ieee: "https://ieeexplore.ieee.org/author/amirul-islam",
          website: "https://engineering.bracu.ac.bd/profile/amirul-islam-phd"
        }
      ],
      teamMembers: [
        {
          id: 4,
          name: "Raihan Uddin",
          designation: "Research Assistant",
          affiliation: "Department of EEE, BRAC University",
          description: "Early-career researcher in power system optimization, microgrids, and applying deep learning and machine learning techniques for sustainable energy systems.",
          expertise: [1, 3, 2, 6], // Microgrids & Distributed Energy Systems, Grid Optimization & Stability, Renewable Energy Integration, Cybersecurity and AI for Power Infrastructure
          photo: "https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/Raihan%20Uddin.jpg",
          email: "uddin.raihan@bracu.ac.bd",
          phone: "+880-1XXXXXXXXX",
          googleScholar: "https://scholar.google.com/citations?user=raihan-uddin",
          researchGate: "https://www.researchgate.net/profile/raihan-uddin",
          orcid: "https://orcid.org/0000-0000-0000-0004",
          linkedin: "https://linkedin.com/in/raihan-uddin",
          github: "https://github.com/raihan-uddin",
          ieee: "https://ieeexplore.ieee.org/author/raihan-uddin",
          website: "https://raihanuddin.dev"
        },
        {
          id: 5,
          name: "Mumtahina Arika",
          designation: "Research Assistant",
          affiliation: "Department of EEE, BRAC University",
          description: "Early-career researcher in renewable energy systems and AI-driven condition monitoring of electrical equipment and wind turbines.",
          expertise: [2, 3], // Renewable Energy Integration, Grid Optimization & Stability
          photo: "https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/Mumtahina%20Akira.jpg",
          email: "mumtahina.arika@bracu.ac.bd",
          phone: "+880-1XXXXXXXXX",
          googleScholar: "https://scholar.google.com/citations?user=mumtahina-arika",
          researchGate: "https://www.researchgate.net/profile/mumtahina-arika",
          orcid: "https://orcid.org/0000-0000-0000-0005",
          linkedin: "https://linkedin.com/in/mumtahina-arika",
          github: "https://github.com/mumtahina-arika",
          ieee: "https://ieeexplore.ieee.org/author/mumtahina-arika",
          website: "https://mumtahinaarika.research.com"
        }
      ],
      collaborators: [] // Empty by default - will show "seeking members" message
    };
  });

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
    setPeopleData(prevData => ({
      ...prevData,
      [category]: prevData[category].filter(person => person.id !== personId)
    }));
    console.log(`✅ Deleted ${category} person with ID ${personId}`);
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