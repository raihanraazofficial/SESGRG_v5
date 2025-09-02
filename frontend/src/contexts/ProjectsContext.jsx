import React, { createContext, useContext, useState, useEffect } from 'react';
import googleSheetsService from '../services/googleSheetsApi';

const ProjectsContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};

export const ProjectsProvider = ({ children }) => {
  const [projectsData, setProjectsData] = useState(() => {
    // Try to load from localStorage first
    try {
      const storedData = localStorage.getItem('sesg_projects_data');
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (error) {
      console.error('Error loading projects from localStorage:', error);
    }
    
    // Return empty array if localStorage fails
    return [];
  });

  const [loading, setLoading] = useState(false);
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

  const statuses = ["Active", "Completed", "Planning"];

  // Save to localStorage whenever data changes
  useEffect(() => {
    try {
      localStorage.setItem('sesg_projects_data', JSON.stringify(projectsData));
    } catch (error) {
      console.error('Error saving projects to localStorage:', error);
    }
  }, [projectsData]);

  // Initialize data from Google Sheets on first load (migration)
  useEffect(() => {
    const initializeData = async () => {
      if (initialized || projectsData.length > 0) return;
      
      try {
        setLoading(true);
        console.log('🔄 Migrating projects data from Google Sheets to localStorage...');
        
        const response = await googleSheetsService.getProjects({
          page: 1,
          per_page: 100 // Get all projects
        });
        
        if (response && response.projects && response.projects.length > 0) {
          const migratedData = response.projects.map((project, index) => ({
            id: project.id || Date.now() + index,
            title: project.title || '',
            description: project.description || '',
            status: project.status || 'Planning',
            start_date: project.start_date || '',
            end_date: project.end_date || '',
            principal_investigator: project.principal_investigator || '',
            team_members: Array.isArray(project.team_members) ? project.team_members : 
                        typeof project.team_members === 'string' ? project.team_members.split(',').map(m => m.trim()) : [],
            funding_agency: project.funding_agency || '',
            budget: project.budget || '',
            research_areas: Array.isArray(project.research_areas) ? project.research_areas : [],
            objectives: Array.isArray(project.objectives) ? project.objectives : 
                       typeof project.objectives === 'string' ? project.objectives.split('\n').filter(o => o.trim()) : [],
            expected_outcomes: Array.isArray(project.expected_outcomes) ? project.expected_outcomes : 
                              typeof project.expected_outcomes === 'string' ? project.expected_outcomes.split('\n').filter(o => o.trim()) : [],
            current_progress: project.current_progress || '',
            publications: Array.isArray(project.publications) ? project.publications : [],
            website: project.website || '',
            image: project.image || '',
            featured: project.featured || false,
            keywords: Array.isArray(project.keywords) ? project.keywords : 
                     typeof project.keywords === 'string' ? project.keywords.split(',').map(k => k.trim()) : []
          }));
          
          setProjectsData(migratedData);
          console.log(`✅ Successfully migrated ${migratedData.length} projects to localStorage`);
        }
      } catch (error) {
        console.error('❌ Error migrating projects data:', error);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initializeData();
  }, [initialized, projectsData.length]);

  // Add new project
  const addProject = (newProject) => {
    const project = {
      ...newProject,
      id: Date.now(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    setProjectsData(prev => [...prev, project]);
    return project;
  };

  // Update project
  const updateProject = (id, updatedData) => {
    const updatedProject = {
      ...updatedData,
      id: id,
      updated_at: new Date().toISOString()
    };
    
    setProjectsData(prev => 
      prev.map(project => project.id === id ? updatedProject : project)
    );
    return updatedProject;
  };

  // Delete project
  const deleteProject = (id) => {
    try {
      console.log('🔍 ProjectsContext: Deleting project with ID:', id, 'Type:', typeof id);
      console.log('🔍 Current projects data:', projectsData);
      
      if (!id && id !== 0) {
        throw new Error('Project ID is required for deletion');
      }
      
      // Convert id to string for consistent comparison (localStorage often stores IDs as strings)
      const idStr = String(id);
      const idNum = Number(id);
      
      console.log('🔍 Searching for project with ID (string):', idStr, 'or (number):', idNum);
      
      const existingProject = projectsData.find(project => 
        String(project.id) === idStr || project.id === idNum
      );
      
      if (!existingProject) {
        console.log('❌ Project not found. Available IDs:', projectsData.map(p => ({ id: p.id, type: typeof p.id })));
        throw new Error(`Project with ID ${id} not found`);
      }
      
      console.log('🔍 Found project to delete:', existingProject);
      
      setProjectsData(prev => {
        const filtered = prev.filter(project => 
          String(project.id) !== idStr && project.id !== idNum
        );
        console.log('✅ Project deleted. Old length:', prev.length, 'New length:', filtered.length);
        return filtered;
      });
      
      console.log('✅ Project delete operation completed');
    } catch (error) {
      console.error('❌ Error in deleteProject:', error);
      throw error; // Re-throw to let calling component handle it
    }
  };

  // Get project by ID
  const getProjectById = (id) => {
    return projectsData.find(project => project.id === id);
  };

  // Filter and search projects
  const getFilteredProjects = (filters = {}) => {
    let filtered = [...projectsData];

    // Search filter
    if (filters.search_filter) {
      const searchTerm = filters.search_filter.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(searchTerm) ||
        project.description.toLowerCase().includes(searchTerm) ||
        project.status.toLowerCase().includes(searchTerm) ||
        project.principal_investigator.toLowerCase().includes(searchTerm) ||
        project.research_areas.some(area => area.toLowerCase().includes(searchTerm)) ||
        project.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
      );
    }

    // Status filter
    if (filters.status_filter) {
      filtered = filtered.filter(project => project.status === filters.status_filter);
    }

    // Research area filter
    if (filters.area_filter) {
      filtered = filtered.filter(project => 
        project.research_areas.includes(filters.area_filter)
      );
    }

    // Title filter
    if (filters.title_filter) {
      const titleTerm = filters.title_filter.toLowerCase();
      filtered = filtered.filter(project =>
        project.title.toLowerCase().includes(titleTerm)
      );
    }

    // Sort
    const sortBy = filters.sort_by || 'start_date';
    const sortOrder = filters.sort_order || 'desc';
    
    filtered.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];
      
      if (sortBy === 'title') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (sortBy === 'start_date' || sortBy === 'end_date') {
        aVal = new Date(aVal || '1970-01-01');
        bVal = new Date(bVal || '1970-01-01');
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  // Get paginated projects
  const getPaginatedProjects = (filters = {}) => {
    const page = filters.page || 1;
    const perPage = filters.per_page || 20;
    
    const filtered = getFilteredProjects(filters);
    const total = filtered.length;
    const totalPages = Math.ceil(total / perPage);
    const offset = (page - 1) * perPage;
    const paginatedData = filtered.slice(offset, offset + perPage);
    
    return {
      projects: paginatedData,
      pagination: {
        current_page: page,
        per_page: perPage,
        total_items: total,
        total_pages: totalPages,
        has_prev: page > 1,
        has_next: page < totalPages
      },
      statistics: getStatistics(filtered)
    };
  };

  // Get statistics
  const getStatistics = (data = projectsData) => {
    const total = data.length;
    const active = data.filter(p => p.status === 'Active').length;
    const completed = data.filter(p => p.status === 'Completed').length;
    const planning = data.filter(p => p.status === 'Planning').length;
    
    return {
      total_projects: total,
      active_projects: active,
      completed_projects: completed,
      planning_projects: planning
    };
  };

  // Get all unique values for filters
  const getFilterOptions = () => {
    const statuses = [...new Set(projectsData.map(p => p.status))];
    const areas = [...new Set(projectsData.flatMap(p => p.research_areas))].sort();
    const investigators = [...new Set(projectsData.map(p => p.principal_investigator))].sort();
    
    return {
      statuses,
      areas,
      investigators
    };
  };

  // Get featured projects
  const getFeaturedProjects = (limit = 5) => {
    return projectsData
      .filter(project => project.featured)
      .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
      .slice(0, limit);
  };

  // Get latest projects
  const getLatestProjects = (limit = 5) => {
    return projectsData
      .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
      .slice(0, limit);
  };

  // Get projects by research area
  const getProjectsByArea = (areaName) => {
    return projectsData.filter(project => 
      project.research_areas.includes(areaName)
    );
  };

  // Get active projects
  const getActiveProjects = () => {
    return projectsData.filter(project => project.status === 'Active');
  };

  // Get completed projects
  const getCompletedProjects = () => {
    return projectsData.filter(project => project.status === 'Completed');
  };

  // Format date helper
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch (error) {
      return dateString;
    }
  };

  const value = {
    projectsData,
    loading,
    researchAreas,
    statuses,
    addProject,
    updateProject,
    deleteProject,
    getProjectById,
    getFilteredProjects,
    getPaginatedProjects,
    getStatistics,
    getFilterOptions,
    getFeaturedProjects,
    getLatestProjects,
    getProjectsByArea,
    getActiveProjects,
    getCompletedProjects,
    formatDate
  };

  return (
    <ProjectsContext.Provider value={value}>
      {children}
    </ProjectsContext.Provider>
  );
};