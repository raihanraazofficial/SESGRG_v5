import React, { useState, useEffect, useMemo } from "react";
import { Lightbulb, Zap, Battery, Shield, Cpu, Network, Leaf, ArrowRight, Folder, FileText, Sun, Brain, ExternalLink, ArrowLeft, Users, BookOpen, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { researchAreas } from "../mock/data";
import googleSheetsService from "../services/googleSheetsApi";

const ResearchAreas = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [realTimeData, setRealTimeData] = useState({
    projects: [],
    publications: [],
    loading: false,
    lastUpdated: null
  });
  const [peopleData, setPeopleData] = useState([]);
  const [areaStats, setAreaStats] = useState({}); // New state for area-wise stats

  // Load real-time stats for all areas on component mount
  useEffect(() => {
    loadAllAreaStats();
  }, []);

  const loadAllAreaStats = async () => {
    try {
      const [projectsResponse, publicationsResponse] = await Promise.all([
        googleSheetsService.getProjects({}),
        googleSheetsService.getPublications({})
      ]);

      const stats = {};
      
      researchAreas.forEach(area => {
        const areaKeywords = getAreaKeywords(area.title);
        
        // Filter projects
        const areaProjects = projectsResponse.projects.filter(project => {
          if (project.research_areas && Array.isArray(project.research_areas)) {
            return project.research_areas.some(projArea => 
              areaKeywords.some(keyword => projArea.toLowerCase().includes(keyword.toLowerCase()))
            );
          }
          if (project.title) {
            return areaKeywords.some(keyword => 
              project.title.toLowerCase().includes(keyword.toLowerCase())
            );
          }
          return false;
        });

        // Filter publications
        const areaPublications = publicationsResponse.publications.filter(pub => {
          if (pub.research_areas && Array.isArray(pub.research_areas)) {
            return pub.research_areas.some(pubArea => 
              areaKeywords.some(keyword => pubArea.toLowerCase().includes(keyword.toLowerCase()))
            );
          }
          if (pub.title) {
            return areaKeywords.some(keyword => 
              pub.title.toLowerCase().includes(keyword.toLowerCase())
            );
          }
          return false;
        });

        stats[area.id] = {
          projects: areaProjects.length,
          publications: areaPublications.length
        };
      });

      setAreaStats(stats);
      console.log('📊 Loaded area stats:', stats);
    } catch (error) {
      console.error('Failed to load area stats:', error);
    }
  };

  const iconMap = {
    Lightbulb: Lightbulb,
    Zap: Zap,
    Battery: Battery,
    Shield: Shield,
    Cpu: Cpu,
    Network: Network,
    Leaf: Leaf,
    Sun: Sun,
    Brain: Brain
  };

  // Enhanced image mapping with fallback
  const getAreaImage = (areaId) => {
    const imageMap = {
      1: "https://images.unsplash.com/photo-1715605569717-494ac7c5656a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwzfHxzbWFydCUyMGdyaWQlMjB0ZWNobm9sb2d5fGVufDB8fHx8MTc1NjY2Njg3Mnww&ixlib=rb-4.1.0&q=85", // Smart Grid Technologies
      2: "https://images.unsplash.com/photo-1740240859880-7dcf28028122?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHw0fHxzbWFydCUyMGdyaWQlMjB0ZWNobm9sb2d5fGVufDB8fHx8MTc1NjY2Njg3Mnww&ixlib=rb-4.1.0&q=85", // Microgrids & Distributed Energy Systems
      3: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxyZW5ld2FibGUlMjBlbmVyZ3l8ZW58MHx8fHwxNzU2NjY2ODc4fDA&ixlib=rb-4.1.0&q=85", // Renewable Energy Integration
      4: "https://images.unsplash.com/photo-1696197302705-7c2cc6a7e8ac?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxwb3dlciUyMHN5c3RlbXN8ZW58MHx8fHwxNzU2NjY2ODgyfDA&ixlib=rb-4.1.0&q=85", // Grid Optimization & Stability
      5: "https://images.unsplash.com/photo-1548337138-e87d889cc369?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwyfHxyZW5ld2FibGUlMjBlbmVyZ3l8ZW58MHx8fHwxNzU2NjY2ODc4fDA&ixlib=rb-4.1.0&q=85", // Energy Storage Systems
      6: "https://images.unsplash.com/photo-1508791290064-c27cc1ef7a9a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwzfHxyZW5ld2FibGUlMjBlbmVyZ3l8ZW58MHx8fHwxNzU2NjY2ODc4fDA&ixlib=rb-4.1.0&q=85", // Power System Automation
      7: "https://images.pexels.com/photos/9799996/pexels-photo-9799996.jpeg" // Cybersecurity and AI for Power Infrastructure
    };
    return imageMap[areaId] || imageMap[1];
  };

  // People data for research areas - mirroring People.jsx structure
  const researchAreaPeople = [
    // Research area index mapping: 0-Smart Grid, 1-Microgrids, 2-Renewable Energy, 3-Grid Optimization, 4-Energy Storage, 5-Power System Automation, 6-Cybersecurity & AI
    {
      id: 1,
      name: "A. S. Nazmul Huda, PhD",
      designation: "Associate Professor",
      affiliation: "Department of EEE, BRAC University",
      category: "Advisor",
      expertise: [0, 2, 3], // Smart Grid Technologies, Renewable Energy Integration, Grid Optimization & Stability
      photo: "https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/Nazmul%20Huda.jpg"
    },
    {
      id: 2,
      name: "Shameem Ahmad, PhD", 
      designation: "Associate Professor",
      affiliation: "Department of EEE, BRAC University",
      category: "Advisor",
      expertise: [1, 3, 0], // Microgrids & Distributed Energy Systems, Grid Optimization & Stability, Smart Grid Technologies
      photo: "https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/Shameem%20Ahmad.jpg"
    },
    {
      id: 3,
      name: "Amirul Islam, PhD",
      designation: "Assistant Professor", 
      affiliation: "Department of EEE, BRAC University",
      category: "Advisor",
      expertise: [5, 6], // Power System Automation, Cybersecurity and AI for Power Infrastructure
      photo: "https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/Amirul%20Islam.jpg"
    },
    {
      id: 4,
      name: "Raihan Uddin",
      designation: "Research Assistant",
      affiliation: "Department of EEE, BRAC University", 
      category: "Team Member",
      expertise: [1, 3, 2, 6], // Microgrids & Distributed Energy Systems, Grid Optimization & Stability, Renewable Energy Integration, Cybersecurity and AI for Power Infrastructure
      photo: "https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/Raihan%20Uddin.jpg"
    },
    {
      id: 5,
      name: "Mumtahina Arika",
      designation: "Research Assistant",
      affiliation: "Department of EEE, BRAC University",
      category: "Team Member", 
      expertise: [2, 3], // Renewable Energy Integration, Grid Optimization & Stability
      photo: "https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/Mumtahina%20Akira.jpg"
    }
  ];

  // Research area names for mapping
  const researchAreaNames = [
    "Smart Grid Technologies",
    "Microgrids & Distributed Energy Systems", 
    "Renewable Energy Integration",
    "Grid Optimization & Stability",
    "Energy Storage Systems",
    "Power System Automation",
    "Cybersecurity and AI for Power Infrastructure"
  ];

  // Get area working in specific research area
  const getPeopleByResearchArea = (areaId) => {
    const areaIndex = areaId - 1; // Convert 1-based ID to 0-based index
    return researchAreaPeople.filter(person => 
      person.expertise.includes(areaIndex)
    );
  };

  // Get keyword variations for better matching
  const getAreaKeywords = (areaTitle) => {
    const keywordMap = {
      "Smart Grid Technologies": ["smart grid", "grid technology", "intelligent grid", "grid modernization", "smart power", "grid automation"],
      "Microgrids & Distributed Energy Systems": ["microgrid", "distributed energy", "local grid", "mini grid", "distributed generation", "peer-to-peer energy"],
      "Renewable Energy Integration": ["renewable energy", "solar integration", "wind integration", "clean energy", "green energy", "sustainable energy"],
      "Grid Optimization & Stability": ["grid optimization", "power system optimization", "grid stability", "load balancing", "power flow", "voltage control"],
      "Energy Storage Systems": ["energy storage", "battery storage", "grid storage", "power storage", "battery management", "storage systems"],
      "Power System Automation": ["power automation", "substation automation", "grid automation", "smart switching", "automated protection", "system automation"],
      "Cybersecurity and AI for Power Infrastructure": ["cybersecurity", "power security", "grid security", "AI power", "machine learning energy", "intelligent systems"]
    };
    
    return keywordMap[areaTitle] || [areaTitle.toLowerCase()];
  };

  // Real-time data fetching with improved filtering logic
  const fetchRealTimeData = async (areaId, areaTitle) => {
    setRealTimeData(prev => ({ ...prev, loading: true }));
    
    try {
      console.log('🔍 Fetching real-time data for:', areaTitle);
      
      // Fetch both projects and publications without area filter first
      const [projectsResponse, publicationsResponse] = await Promise.all([
        googleSheetsService.getProjects({}),
        googleSheetsService.getPublications({})
      ]);

      console.log('📊 Raw API data - Projects:', projectsResponse.projects?.length, 'Publications:', publicationsResponse.publications?.length);

      // Enhanced filtering logic with multiple matching strategies
      const areaKeywords = getAreaKeywords(areaTitle);
      console.log('🎯 Area keywords for matching:', areaKeywords);

      // Filter projects with improved matching
      const areaProjects = projectsResponse.projects.filter(project => {
        // Strategy 1: Direct research_areas field matching
        if (project.research_areas && Array.isArray(project.research_areas)) {
          const matchesArea = project.research_areas.some(area => 
            areaKeywords.some(keyword => area.toLowerCase().includes(keyword.toLowerCase()))
          );
          if (matchesArea) return true;
        }

        // Strategy 2: Title keyword matching
        if (project.title) {
          const matchesTitle = areaKeywords.some(keyword => 
            project.title.toLowerCase().includes(keyword.toLowerCase())
          );
          if (matchesTitle) return true;
        }

        // Strategy 3: Description matching
        if (project.description) {
          const matchesDesc = areaKeywords.some(keyword => 
            project.description.toLowerCase().includes(keyword.toLowerCase())
          );
          if (matchesDesc) return true;
        }

        return false;
      });

      const activeProjects = areaProjects.filter(p => p.status === 'Active');
      const completedProjects = areaProjects.filter(p => p.status === 'Completed');

      // Filter publications with enhanced matching
      const areaPublications = publicationsResponse.publications.filter(pub => {
        // Strategy 1: Direct research_areas field matching
        if (pub.research_areas && Array.isArray(pub.research_areas)) {
          const matchesArea = pub.research_areas.some(area => 
            areaKeywords.some(keyword => area.toLowerCase().includes(keyword.toLowerCase()))
          );
          if (matchesArea) return true;
        }

        // Strategy 2: Title keyword matching
        if (pub.title) {
          const matchesTitle = areaKeywords.some(keyword => 
            pub.title.toLowerCase().includes(keyword.toLowerCase())
          );
          if (matchesTitle) return true;
        }

        // Strategy 3: Keywords/tags matching
        if (pub.keywords && Array.isArray(pub.keywords)) {
          const matchesKeywords = pub.keywords.some(keyword => 
            areaKeywords.some(areaKeyword => keyword.toLowerCase().includes(areaKeyword.toLowerCase()))
          );
          if (matchesKeywords) return true;
        }

        // Strategy 4: Abstract matching (if available)
        if (pub.abstract) {
          const matchesAbstract = areaKeywords.some(keyword => 
            pub.abstract.toLowerCase().includes(keyword.toLowerCase())
          );
          if (matchesAbstract) return true;
        }

        return false;
      });

      const journalArticles = areaPublications.filter(p => p.category === 'Journal Articles');
      const conferenceProceedings = areaPublications.filter(p => p.category === 'Conference Proceedings'); 
      const bookChapters = areaPublications.filter(p => p.category === 'Book Chapters');

      console.log('✅ Filtered results:', {
        totalProjects: areaProjects.length,
        activeProjects: activeProjects.length,
        completedProjects: completedProjects.length,
        totalPublications: areaPublications.length,
        journalArticles: journalArticles.length,
        conferenceProceedings: conferenceProceedings.length,
        bookChapters: bookChapters.length
      });

      setRealTimeData({
        projects: {
          active: activeProjects,
          completed: completedProjects,
          total: areaProjects.length
        },
        publications: {
          journal: journalArticles,
          conference: conferenceProceedings,
          bookChapter: bookChapters,
          total: areaPublications.length
        },
        loading: false,
        lastUpdated: new Date().toLocaleTimeString()
      });

    } catch (error) {
      console.error('Error fetching real-time data:', error);
      setRealTimeData(prev => ({ ...prev, loading: false }));
    }
  };

  const openDetailedPage = async (area) => {
    console.log('🚀 Opening detailed page for:', area.title);
    
    let projects, publications, lastUpdated;
    const areaImage = getAreaImage(area.id);
    const areaPeople = getPeopleByResearchArea(area.id);
    
    // Show loading state
    setRealTimeData(prev => ({ ...prev, loading: true }));
    
    try {
      // Fetch real-time data and wait for it to complete
      console.log('🔍 Fetching real-time data for:', area.title);
      
      // Fetch both projects and publications without area filter first
      const [projectsResponse, publicationsResponse] = await Promise.all([
        googleSheetsService.getProjects({}),
        googleSheetsService.getPublications({})
      ]);

      console.log('📊 Raw API responses:', {
        projects: projectsResponse.projects?.length,
        publications: publicationsResponse.publications?.length
      });

      // Enhanced filtering logic with multiple matching strategies
      const areaKeywords = getAreaKeywords(area.title);
      console.log('🎯 Area keywords for matching:', areaKeywords);

      // Filter projects with improved matching
      const areaProjects = projectsResponse.projects.filter(project => {
        // Strategy 1: Direct research_areas field matching
        if (project.research_areas && Array.isArray(project.research_areas)) {
          const matchesArea = project.research_areas.some(area => 
            areaKeywords.some(keyword => area.toLowerCase().includes(keyword.toLowerCase()))
          );
          if (matchesArea) return true;
        }

        // Strategy 2: Title keyword matching
        if (project.title) {
          const matchesTitle = areaKeywords.some(keyword => 
            project.title.toLowerCase().includes(keyword.toLowerCase())
          );
          if (matchesTitle) return true;
        }

        // Strategy 3: Description matching
        if (project.description) {
          const matchesDesc = areaKeywords.some(keyword => 
            project.description.toLowerCase().includes(keyword.toLowerCase())
          );
          if (matchesDesc) return true;
        }

        return false;
      });

      const activeProjects = areaProjects.filter(p => p.status === 'Active');
      const completedProjects = areaProjects.filter(p => p.status === 'Completed');

      // Filter publications with enhanced matching
      const areaPublications = publicationsResponse.publications.filter(pub => {
        // Strategy 1: Direct research_areas field matching
        if (pub.research_areas && Array.isArray(pub.research_areas)) {
          const matchesArea = pub.research_areas.some(area => 
            areaKeywords.some(keyword => area.toLowerCase().includes(keyword.toLowerCase()))
          );
          if (matchesArea) return true;
        }

        // Strategy 2: Title keyword matching
        if (pub.title) {
          const matchesTitle = areaKeywords.some(keyword => 
            pub.title.toLowerCase().includes(keyword.toLowerCase())
          );
          if (matchesTitle) return true;
        }

        // Strategy 3: Keywords/tags matching
        if (pub.keywords && Array.isArray(pub.keywords)) {
          const matchesKeywords = pub.keywords.some(keyword => 
            areaKeywords.some(areaKeyword => keyword.toLowerCase().includes(areaKeyword.toLowerCase()))
          );
          if (matchesKeywords) return true;
        }

        return false;
      });

      const journalArticles = areaPublications.filter(p => p.category === 'Journal Articles');
      const conferenceProceedings = areaPublications.filter(p => p.category === 'Conference Proceedings'); 
      const bookChapters = areaPublications.filter(p => p.category === 'Book Chapters');

      // Prepare real-time data object for immediate use
      const freshRealTimeData = {
        projects: {
          active: activeProjects,
          completed: completedProjects,
          total: areaProjects.length
        },
        publications: {
          journal: journalArticles,
          conference: conferenceProceedings,
          bookChapter: bookChapters,
          total: areaPublications.length
        },
        loading: false,
        lastUpdated: new Date().toLocaleTimeString()
      };

      console.log('✅ Fresh real-time data prepared:', {
        totalProjects: freshRealTimeData.projects.total,
        activeProjects: freshRealTimeData.projects.active.length,
        completedProjects: freshRealTimeData.projects.completed.length,
        totalPublications: freshRealTimeData.publications.total,
        journalArticles: freshRealTimeData.publications.journal.length,
        conferenceProceedings: freshRealTimeData.publications.conference.length,
        bookChapters: freshRealTimeData.publications.bookChapter.length
      });

      // Update state and use fresh data
      setRealTimeData(freshRealTimeData);
      projects = freshRealTimeData.projects;
      publications = freshRealTimeData.publications;
      lastUpdated = freshRealTimeData.lastUpdated;
      
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      setRealTimeData(prev => ({ ...prev, loading: false }));
      
      // Show 0 when API fails instead of mock data
      projects = { active: [], completed: [], total: 0 };
      publications = { journal: [], conference: [], bookChapter: [], total: 0 };
      lastUpdated = 'Failed to load real-time data - showing 0 counts';
    }
    
    const detailHtml = `
      <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <!-- Enhanced Banner Section with Professional Blackish Overlay -->
        <div class="relative h-96 overflow-hidden">
          <!-- Professional Blackish Gradient Overlay for Better Text Contrast -->
          <div class="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/80"></div>
          <img 
            src="${areaImage}" 
            alt="${area.title}" 
            class="absolute inset-0 w-full h-full object-cover brightness-75 contrast-110"
            style="z-index: 1;"
            onerror="this.style.display='none'; console.log('Image failed to load: ${areaImage}');"
            onload="console.log('Image loaded successfully: ${areaImage}');"
          />
          <!-- Additional Professional Dark Gradient for Text Readability -->
          <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" style="z-index: 2;"></div>
          <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center" style="z-index: 3;">
            <div class="text-white max-w-4xl">
              <div class="flex items-center mb-6">
                <div class="w-16 h-16 bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center mr-4 shadow-xl border border-white/20">
                  <span class="text-2xl text-white drop-shadow-lg">⚡</span>
                </div>
                <div>
                  <h1 class="text-5xl md:text-6xl font-bold mb-3 text-white drop-shadow-xl" style="text-shadow: 2px 2px 8px rgba(0,0,0,0.8);">${area.title}</h1>
                  <div class="flex items-center space-x-6 text-gray-100">
                    <span class="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20"><i class="fas fa-project-diagram mr-2"></i>${projects?.total || 0} Projects</span>
                    <span class="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20"><i class="fas fa-file-alt mr-2"></i>${publications?.total || 0} Publications</span>
                    <span class="flex items-center bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full border border-white/20"><i class="fas fa-users mr-2"></i>${areaPeople.length} Team Members</span>
                  </div>
                </div>
              </div>
              <p class="text-xl text-gray-100 max-w-3xl leading-relaxed bg-black/20 backdrop-blur-sm p-4 rounded-xl border border-white/10" style="text-shadow: 1px 1px 4px rgba(0,0,0,0.8);">${area.description}</p>
              ${lastUpdated ? `<p class="text-sm text-green-300 mt-3 bg-green-500/20 backdrop-blur-sm px-3 py-1 rounded-full inline-block border border-green-400/30">🕒 Real-time data updated: ${lastUpdated}</p>` : ''}
            </div>
          </div>
          <!-- Enhanced Bottom Gradient -->
          <div class="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent" style="z-index: 4;"></div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <!-- Real-Time Projects & Publications Statistics -->
          <section class="mb-16">
            <div class="text-center mb-12">
              <h2 class="text-4xl font-bold text-gray-900 mb-4">Real-Time Research Data</h2>
              <div class="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <!-- Active Projects -->
              <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white text-center">
                <div class="text-3xl font-bold mb-2">${projects.active ? projects.active.length : '0'}</div>
                <div class="text-blue-100 text-sm">Active Projects</div>
              </div>
              <!-- Completed Projects -->
              <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white text-center">
                <div class="text-3xl font-bold mb-2">${projects.completed ? projects.completed.length : '0'}</div>
                <div class="text-green-100 text-sm">Completed Projects</div>
              </div>
              <!-- Journal Publications -->
              <div class="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white text-center">
                <div class="text-3xl font-bold mb-2">${publications.journal ? publications.journal.length : '0'}</div>
                <div class="text-purple-100 text-sm">Journal Articles</div>
              </div>
              <!-- Conference Publications -->
              <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white text-center">
                <div class="text-3xl font-bold mb-2">${publications.conference ? publications.conference.length : '0'}</div>
                <div class="text-orange-100 text-sm">Conference Papers</div>
              </div>
              <!-- Book Chapters -->
              <div class="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white text-center">
                <div class="text-3xl font-bold mb-2">${publications.bookChapter ? publications.bookChapter.length : '0'}</div>
                <div class="text-red-100 text-sm">Book Chapters</div>
              </div>
            </div>
          </section>

          <!-- Research Team Section -->
          <section class="mb-16">
            <div class="text-center mb-12">
              <h2 class="text-4xl font-bold text-gray-900 mb-4">Research Team</h2>
              <div class="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              ${areaPeople.map(person => `
                <div class="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow group">
                  <div class="flex items-center space-x-4 mb-4">
                    <img 
                      src="${person.photo}" 
                      alt="${person.name}"
                      class="w-16 h-16 rounded-full object-cover"
                      onerror="this.src='https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/noimg.jpg';"
                    />
                    <div>
                      <h3 class="font-bold text-gray-900 text-lg">${person.name}</h3>
                      <p class="text-sm text-emerald-600">${person.designation}</p>
                      <p class="text-xs text-gray-500">${person.affiliation}</p>
                    </div>
                  </div>
                  <div class="mb-3">
                    <span class="inline-block px-3 py-1 bg-${person.category === 'Advisor' ? 'blue' : person.category === 'Team Member' ? 'green' : 'purple'}-100 text-${person.category === 'Advisor' ? 'blue' : person.category === 'Team Member' ? 'green' : 'purple'}-800 text-xs font-medium rounded-full">
                      ${person.category}
                    </span>
                  </div>
                  <div class="space-y-2">
                    <h4 class="text-sm font-semibold text-gray-800">Research Interest:</h4>
                    <div class="flex flex-wrap gap-1">
                      ${person.expertise.map(expertiseIndex => 
                        `<span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">${researchAreaNames[expertiseIndex]}</span>`
                      ).join('')}
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- Enhanced Overview Section -->
          <section class="mb-16">
            <div class="text-center mb-12">
              <h2 class="text-4xl font-bold text-gray-900 mb-4">Research Overview</h2>
              <div class="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
            </div>
            <div class="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
              <div class="flex items-start space-x-6">
                <div class="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span class="text-2xl text-emerald-600">🔬</span>
                </div>
                <div>
                  <p class="text-lg text-gray-700 leading-relaxed">${area.overview}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Enhanced Objectives Section -->
          <section class="mb-16">
            <div class="text-center mb-12">
              <h2 class="text-4xl font-bold text-gray-900 mb-4">Research Objectives</h2>
              <div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              ${area.objectives.map((obj, index) => `
                <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
                  <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <span class="text-lg font-bold text-blue-600">${index + 1}</span>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900 mb-2">Objective ${index + 1}</h3>
                      <p class="text-gray-700">${obj}</p>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- Enhanced Applications Section -->
          <section class="mb-16">
            <div class="text-center mb-12">
              <h2 class="text-4xl font-bold text-gray-900 mb-4">Key Applications</h2>
              <div class="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              ${area.applications.map((app, index) => `
                <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-100">
                  <div class="text-center">
                    <div class="w-14 h-14 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span class="text-2xl">🎯</span>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-2">Application ${index + 1}</h3>
                    <p class="text-gray-700 text-sm">${app}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- Enhanced Navigation Section -->
          <section class="mb-16">
            <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 rounded-3xl p-10 text-white">
              <div class="text-center mb-8">
                <h2 class="text-3xl font-bold mb-4">Explore Related Research</h2>
                <p class="text-gray-300 max-w-2xl mx-auto">
                  Discover our latest publications, ongoing projects, and collaborative opportunities in ${area.title.toLowerCase()}.
                </p>
              </div>
              <div class="flex flex-col sm:flex-row gap-6 justify-center">
                <a href="/publications" target="_blank" class="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold transition-colors group">
                  <span class="mr-3">📚</span>
                  View Publications
                  <svg class="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
                <a href="/projects" target="_blank" class="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors border border-white/20 group">
                  <span class="mr-3">🔬</span>
                  View Projects
                  <svg class="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </div>
            </div>
          </section>

          <!-- Enhanced Back Button -->
          <div class="text-center">
            <button 
              onclick="window.history.back()" 
              class="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-10 py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
            >
              ← Back to Research Areas
            </button>
          </div>
        </div>
      </div>
    `;
    
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${area.title} - SESG Research</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .animate-float { animation: float 3s ease-in-out infinite; }
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
          img { max-width: 100%; height: auto; }
        </style>
      </head>
      <body class="bg-gray-50">
        ${detailHtml}
      </body>
      </html>
    `);
    newWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Publications Style */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 performance-optimized -mx-4 sm:-mx-6 lg:-mx-8 mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-6">
              <Link to="/" className="flex items-center text-white hover:text-emerald-400 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Research Areas</h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              Our multidisciplinary research spans across smart grid technologies, renewable energy systems, 
              and AI-driven energy solutions to create a sustainable future.
            </p>
          </div>
        </div>

        {/* Research Areas Grid */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 [&>*:nth-last-child(1):nth-child(3n+1)]:lg:col-start-2">
            {researchAreas.map((area) => {
              const IconComponent = iconMap[area.icon];
              const areaPeople = getPeopleByResearchArea(area.id);
              
              return (
                <Card key={area.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:scale-105 cursor-pointer">
                  <CardContent className="p-8" onClick={() => openDetailedPage(area)}>
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl mb-6 group-hover:from-emerald-200 group-hover:to-teal-200 transition-all duration-300">
                      <IconComponent className="h-8 w-8 text-emerald-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                      {area.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {area.description}
                    </p>
                    
                    {/* Enhanced stats with real-time data */}
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <Folder className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">
                              {areaStats[area.id]?.projects || 0} Projects
                              {areaStats[area.id] && (
                                <span className="ml-1 text-green-600 text-xs">●</span>
                              )}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <FileText className="h-4 w-4 text-gray-400 mr-1" />
                            <span className="text-sm text-gray-600">
                              {areaStats[area.id]?.publications || 0} Papers
                              {areaStats[area.id] && (
                                <span className="ml-1 text-green-600 text-xs">●</span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="text-sm text-gray-600">{areaPeople.length} Researchers</span>
                      </div>
                      {areaStats[area.id] && (
                        <div className="text-xs text-green-600 font-medium">
                          ● Real-time data
                        </div>
                      )}
                    </div>

                    {/* Team member preview */}
                    {areaPeople.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-800 mb-2">Research Team:</h4>
                        <div className="flex -space-x-2 overflow-hidden">
                          {areaPeople.slice(0, 4).map((person, index) => (
                            <img
                              key={person.id}
                              src={person.photo}
                              alt={person.name}
                              className="inline-block h-8 w-8 rounded-full ring-2 ring-white object-cover"
                              title={`${person.name} - ${person.category}`}
                              onError={(e) => {
                                e.target.src = 'https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/noimg.jpg';
                              }}
                            />
                          ))}
                          {areaPeople.length > 4 && (
                            <div className="inline-block h-8 w-8 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center">
                              <span className="text-xs text-gray-600">+{areaPeople.length - 4}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="mt-6 flex items-center justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full group-hover:bg-emerald-50 group-hover:border-emerald-200 relative"
                        onClick={async (e) => {
                          e.stopPropagation();
                          const button = e.target.closest('button');
                          const originalText = button.innerHTML;
                          button.innerHTML = '<div class="flex items-center justify-center"><svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>Loading...</div>';
                          button.disabled = true;
                          
                          await openDetailedPage(area);
                          
                          button.innerHTML = originalText;
                          button.disabled = false;
                        }}
                      >
                        Learn More <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Research Impact Section */}
          <section className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Research Impact & Applications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Grid Modernization</h3>
                <p className="text-sm text-gray-600">Upgrading infrastructure for 21st century energy needs</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <Sun className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Clean Energy Transition</h3>
                <p className="text-sm text-gray-600">Accelerating adoption of renewable energy sources</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">AI-Driven Optimization</h3>
                <p className="text-sm text-gray-600">Intelligent systems for maximum efficiency</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Energy Security</h3>
                <p className="text-sm text-gray-600">Protecting critical infrastructure from threats</p>
              </div>
            </div>
          </section>

          {/* Interdisciplinary Approach */}
          <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white rounded-2xl p-8 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Interdisciplinary Approach</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Our research combines expertise from multiple disciplines to tackle complex energy challenges 
                through innovative, holistic solutions.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { label: "Electrical Engineering", color: "bg-blue-500/20 text-blue-300" },
                { label: "Computer Science", color: "bg-emerald-500/20 text-emerald-300" },
                { label: "Environmental Science", color: "bg-amber-500/20 text-amber-300" },
                { label: "Policy & Economics", color: "bg-purple-500/20 text-purple-300" }
              ].map((discipline, index) => (
                <div key={index} className={`p-4 rounded-lg ${discipline.color} border border-current/20`}>
                  <p className="font-medium text-sm">{discipline.label}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Back to Top - Performance Optimized */}
          <div className="text-center pb-16">
            <Button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              size="lg" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 performance-optimized"
            >
              Back to Top
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResearchAreas;