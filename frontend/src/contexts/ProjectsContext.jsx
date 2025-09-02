import React, { createContext, useContext, useState, useEffect } from 'react';
import firebaseService from '../services/firebaseService';

const ProjectsContext = createContext();

export const useProjects = () => {
  const context = useContext(ProjectsContext);
  if (!context) {
    throw new Error('useProjects must be used within a ProjectsProvider');
  }
  return context;
};

export const ProjectsProvider = ({ children }) => {
  const [projectsData, setProjectsData] = useState([]);
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

  const statuses = ["Active", "Completed", "Planning"];

  // Load data from Firebase on initialization
  useEffect(() => {
    const loadProjectsData = async () => {
      if (initialized) return;
      
      try {
        setLoading(true);
        console.log('🔄 Loading projects data from Firebase...');
        
        const firebaseProjects = await firebaseService.getProjects();
        setProjectsData(firebaseProjects);
        
        console.log(`✅ Projects data loaded from Firebase: ${firebaseProjects.length} projects`);
      } catch (error) {
        console.error('❌ Error loading projects data from Firebase:', error);
        setProjectsData([]);
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    loadProjectsData();
  }, [initialized]);

  // Add new project
  const addProject = async (newProject) => {
    try {
      const project = await firebaseService.addProject(newProject);
      setProjectsData(prev => [...prev, project]);
      console.log('✅ Project added to Firebase:', project);
      return project;
    } catch (error) {
      console.error('❌ Error adding project:', error);
      throw error;
    }
  };

  // Update project
  const updateProject = async (id, updatedData) => {
    try {
      const updatedProject = await firebaseService.updateProject(id, updatedData);
      setProjectsData(prev => 
        prev.map(project => project.id === id ? updatedProject : project)
      );
      console.log('✅ Project updated in Firebase:', updatedProject);
      return updatedProject;
    } catch (error) {
      console.error('❌ Error updating project:', error);
      throw error;
    }
  };

  // Delete project
  const deleteProject = async (id) => {
    try {
      console.log('🔍 ProjectsContext: Deleting project with ID:', id);
      
      if (!id && id !== 0) {
        throw new Error('Project ID is required for deletion');
      }
      
      await firebaseService.deleteProject(id);
      
      setProjectsData(prev => {
        const filtered = prev.filter(project => project.id !== id);
        console.log('✅ Project deleted from Firebase. Old length:', prev.length, 'New length:', filtered.length);
        return filtered;
      });
      
      console.log('✅ Project delete operation completed');
    } catch (error) {
      console.error('❌ Error in deleteProject:', error);
      throw error;
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
  const getFeaturedProjects = async (limit = 5) => {
    try {
      return await firebaseService.getFeaturedProjects(limit);
    } catch (error) {
      console.error('Error getting featured projects:', error);
      return projectsData
        .filter(project => project.featured)
        .sort((a, b) => new Date(b.start_date) - new Date(a.start_date))
        .slice(0, limit);
    }
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