/**
 * Google Sheets API Service for SESG Research Website
 * Handles all communication with Google Sheets APIs directly from frontend
 */

class GoogleSheetsService {
  constructor() {
    // Use allorigins CORS proxy to handle cross-origin requests  
    this.publicationsUrl = process.env.REACT_APP_PUBLICATIONS_API_URL;
    this.projectsUrl = process.env.REACT_APP_PROJECTS_API_URL;
    this.achievementsUrl = process.env.REACT_APP_ACHIEVEMENTS_API_URL;
    this.newsEventsUrl = process.env.REACT_APP_NEWS_EVENTS_API_URL;
    
    // Cache configuration
    this.cacheTimeout = 3 * 60 * 1000; // 3 minutes cache for more responsive updates
    this.cacheKeys = {
      publications: 'sesg_publications_cache',
      projects: 'sesg_projects_cache',
      achievements: 'sesg_achievements_cache',
      newsEvents: 'sesg_news_events_cache'
    };
    
    // Initialize background refresh for better performance
    this.initBackgroundRefresh();
  }

  // Cache management
  setCacheData(key, data) {
    try {
      const cacheData = {
        data: data,
        timestamp: Date.now(),
        expiry: Date.now() + this.cacheTimeout
      };
      localStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Cache storage failed:', error);
    }
  }

  getCachedData(key) {
    try {
      const cached = localStorage.getItem(key);
      if (!cached) return null;
      
      const cacheData = JSON.parse(cached);
      
      // Check if cache is still valid
      if (Date.now() > cacheData.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      
      return cacheData.data;
    } catch (error) {
      console.warn('Cache retrieval failed:', error);
      return null;
    }
  }

  async fetchFromGoogleSheets(url, cacheKey = null) {
    try {
      // Check cache first
      if (cacheKey) {
        const cachedData = this.getCachedData(cacheKey);
        if (cachedData) {
          console.log('⚡ Fast load: Using cached data for:', cacheKey);
          return cachedData;
        }
        console.log('🌐 Cache miss: Fetching fresh data for:', cacheKey);
      }

      console.log('🚀 Fetching directly from Google Apps Script URL:', url);
      
      // Direct fetch to Google Apps Script (CORS-free by design)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal,
        mode: 'cors', // Google Apps Script supports CORS
        credentials: 'omit' // No credentials needed
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Direct fetch successful!', data.publications?.length || data.projects?.length || data.achievements?.length || data.news_events?.length || 0, 'items loaded');
      
      // Cache the successful result
      if (cacheKey) {
        this.setCacheData(cacheKey, data);
      }
      
      return data;
      
    } catch (error) {
      console.error('❌ Google Sheets API error:', error.message);
      throw error;
    }
  }

  // Publications API
  async getPublications(params = {}) {
    try {
      const data = await this.fetchFromGoogleSheets(this.publicationsUrl, this.cacheKeys.publications);
      // Google Sheets API returns direct array of publications
      const publications = Array.isArray(data.publications) ? data.publications : 
                          (Array.isArray(data) ? data : []);

      console.log('Raw publications data:', publications.length, 'items');
      console.log('First publication:', publications[0]);
      
      // Apply client-side filtering and pagination
      let filteredData = publications;

      // Filter by search
      if (params.search_filter) {
        const searchTerm = params.search_filter.toLowerCase();
        filteredData = filteredData.filter(pub => 
          (pub.title && pub.title.toLowerCase().includes(searchTerm)) ||
          (pub.authors && pub.authors.some && pub.authors.some(author => author.toLowerCase().includes(searchTerm))) ||
          (pub.authors && typeof pub.authors === 'string' && pub.authors.toLowerCase().includes(searchTerm)) ||
          (pub.year && pub.year.toString().includes(searchTerm))
        );
      }

      // Filter by category
      if (params.category_filter) {
        filteredData = filteredData.filter(pub => pub.category === params.category_filter);
      }

      // Filter by year
      if (params.year_filter) {
        filteredData = filteredData.filter(pub => pub.year && pub.year.toString() === params.year_filter);
      }

      // Filter by research area
      if (params.area_filter) {
        filteredData = filteredData.filter(pub => 
          pub.research_areas && pub.research_areas.includes && pub.research_areas.includes(params.area_filter)
        );
      }

      // Filter by author
      if (params.author_filter) {
        const authorTerm = params.author_filter.toLowerCase();
        filteredData = filteredData.filter(pub =>
          (pub.authors && pub.authors.some && pub.authors.some(author => author.toLowerCase().includes(authorTerm))) ||
          (pub.authors && typeof pub.authors === 'string' && pub.authors.toLowerCase().includes(authorTerm))
        );
      }

      // Filter by title
      if (params.title_filter) {
        const titleTerm = params.title_filter.toLowerCase();
        filteredData = filteredData.filter(pub =>
          pub.title && pub.title.toLowerCase().includes(titleTerm)
        );
      }

      // Sorting
      const sortBy = params.sort_by || 'year';
      const sortOrder = params.sort_order || 'desc';
      
      filteredData.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (sortBy === 'year' || sortBy === 'citations') {
          aVal = parseInt(aVal) || 0;
          bVal = parseInt(bVal) || 0;
        }
        
        if (sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        } else {
          return aVal > bVal ? 1 : -1;
        }
      });

      // Pagination
      const page = params.page || 1;
      const perPage = params.per_page || 20;
      const totalItems = filteredData.length;
      const totalPages = Math.ceil(totalItems / perPage);
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      // Calculate statistics based on FILTERED data to reflect current view
      const statistics = {
        total_publications: filteredData.length, // Use filtered data
        total_citations: filteredData.reduce((sum, pub) => sum + (parseInt(pub.citations) || 0), 0), // Use filtered data
        latest_year: filteredData.length > 0 ? filteredData.reduce((latest, pub) => Math.max(latest, parseInt(pub.year) || 0), 0) : new Date().getFullYear(),
        total_areas: filteredData.length > 0 ? [...new Set(filteredData.flatMap(pub => pub.research_areas || []))].length : 0 // Use filtered data
      };

      return {
        publications: paginatedData,
        pagination: {
          current_page: page,
          per_page: perPage,
          total_items: totalItems,
          total_pages: totalPages,
          has_prev: page > 1,
          has_next: page < totalPages
        },
        statistics
      };
    } catch (error) {
      console.error('Error fetching publications from Google Sheets:', error);
      return { publications: [], pagination: {}, statistics: {} };
    }
  }

  // Projects API
  async getProjects(params = {}) {
    try {
      const data = await this.fetchFromGoogleSheets(this.projectsUrl, this.cacheKeys.projects);
      // Projects API returns {projects: [...], pagination: {...}}
      const projects = Array.isArray(data.projects) ? data.projects : 
                      (Array.isArray(data) ? data : []);

      console.log('Raw projects data:', projects.length, 'items');
      console.log('First project:', projects[0]);

      // Apply client-side filtering
      let filteredData = projects;

      // Filter by general search (title, status, research area)
      if (params.search_filter) {
        const searchTerm = params.search_filter.toLowerCase();
        filteredData = filteredData.filter(project => {
          // Search in title
          const titleMatch = project.title && project.title.toLowerCase().includes(searchTerm);
          
          // Search in status
          const statusMatch = project.status && project.status.toLowerCase().includes(searchTerm);
          
          // Search in research areas
          const areaMatch = project.research_areas && Array.isArray(project.research_areas) && 
                           project.research_areas.some(area => area.toLowerCase().includes(searchTerm));
          
          return titleMatch || statusMatch || areaMatch;
        });
      }

      // Filter by title
      if (params.title_filter) {
        const titleTerm = params.title_filter.toLowerCase();
        filteredData = filteredData.filter(project =>
          project.title && project.title.toLowerCase().includes(titleTerm)
        );
      }

      // Filter by status
      if (params.status_filter) {
        filteredData = filteredData.filter(project => project.status === params.status_filter);
      }

      // Filter by research area
      if (params.area_filter) {
        filteredData = filteredData.filter(project =>
          project.research_areas && project.research_areas.includes && project.research_areas.includes(params.area_filter)
        );
      }

      // Sorting
      const sortBy = params.sort_by || 'start_date';
      const sortOrder = params.sort_order || 'desc';
      
      filteredData.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (sortBy === 'start_date' || sortBy === 'end_date') {
          aVal = new Date(aVal) || new Date(0);
          bVal = new Date(bVal) || new Date(0);
        }
        
        if (sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        } else {
          return aVal > bVal ? 1 : -1;
        }
      });

      // Pagination
      const page = params.page || 1;
      const perPage = params.per_page || 20;
      const totalItems = filteredData.length;
      const totalPages = Math.ceil(totalItems / perPage);
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      // Calculate statistics (for ALL projects, not just filtered)
      const statistics = {
        total_projects: projects.length,
        active_projects: projects.filter(p => p.status === 'Active').length,
        completed_projects: projects.filter(p => p.status === 'Completed').length,
        planning_projects: projects.filter(p => p.status === 'Planning').length
      };

      return {
        projects: paginatedData,
        pagination: {
          current_page: page,
          per_page: perPage,
          total_items: totalItems,
          total_pages: totalPages,
          has_prev: page > 1,
          has_next: page < totalPages
        },
        statistics
      };
    } catch (error) {
      console.error('Error fetching projects from Google Sheets:', error);
      return { projects: [], pagination: {}, statistics: {} };
    }
  }

  // Achievements API
  async getAchievements(params = {}) {
    try {
      const data = await this.fetchFromGoogleSheets(this.achievementsUrl, this.cacheKeys.achievements);
      const achievements = Array.isArray(data.achievements) ? data.achievements :
                         (Array.isArray(data.data) ? data.data :
                         (Array.isArray(data) ? data : []));

      console.log('Raw achievements data:', achievements.length, 'items');
      console.log('First achievement:', achievements[0]);

      // Apply client-side filtering
      let filteredData = achievements;

      // Filter by title
      if (params.title_filter) {
        const titleTerm = params.title_filter.toLowerCase();
        filteredData = filteredData.filter(achievement =>
          achievement.title && achievement.title.toLowerCase().includes(titleTerm)
        );
      }

      // Filter by category
      if (params.category_filter) {
        filteredData = filteredData.filter(achievement => achievement.category === params.category_filter);
      }

      // Filter by year
      if (params.year_filter) {
        filteredData = filteredData.filter(achievement => {
          const achievementYear = new Date(achievement.date).getFullYear();
          return achievementYear.toString() === params.year_filter;
        });
      }

      // Sorting
      const sortBy = params.sort_by || 'date';
      const sortOrder = params.sort_order || 'desc';
      
      filteredData.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (sortBy === 'date') {
          aVal = new Date(aVal) || new Date(0);
          bVal = new Date(bVal) || new Date(0);
        }
        
        if (sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        } else {
          return aVal > bVal ? 1 : -1;
        }
      });

      // Pagination
      const page = params.page || 1;
      const perPage = params.per_page || 12;
      const totalItems = filteredData.length;
      const totalPages = Math.ceil(totalItems / perPage);
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      return {
        achievements: paginatedData,
        pagination: {
          current_page: page,
          per_page: perPage,
          total_items: totalItems,
          total_pages: totalPages,
          has_prev: page > 1,
          has_next: page < totalPages
        }
      };
    } catch (error) {
      console.error('Error fetching achievements from Google Sheets:', error);
      return { achievements: [], pagination: {} };
    }
  }

  // News & Events API
  async getNewsEvents(params = {}) {
    try {
      const data = await this.fetchFromGoogleSheets(this.newsEventsUrl, this.cacheKeys.newsEvents);
      const newsEvents = Array.isArray(data.news_events) ? data.news_events :
                        (Array.isArray(data.data) ? data.data :
                        (Array.isArray(data) ? data : []));

      console.log('Raw news events data:', newsEvents.length, 'items');
      console.log('First news event:', newsEvents[0]);

      // Apply client-side filtering
      let filteredData = newsEvents;

      // Filter by title
      if (params.title_filter) {
        const titleTerm = params.title_filter.toLowerCase();
        filteredData = filteredData.filter(item =>
          item.title && item.title.toLowerCase().includes(titleTerm)
        );
      }

      // Filter by category
      if (params.category_filter) {
        filteredData = filteredData.filter(item => item.category === params.category_filter);
      }

      // Sorting
      const sortBy = params.sort_by || 'date';
      const sortOrder = params.sort_order || 'desc';
      
      filteredData.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];
        
        if (sortBy === 'date') {
          aVal = new Date(aVal) || new Date(0);
          bVal = new Date(bVal) || new Date(0);
        }
        
        if (sortOrder === 'desc') {
          return bVal > aVal ? 1 : -1;
        } else {
          return aVal > bVal ? 1 : -1;
        }
      });

      // Pagination
      const page = params.page || 1;
      const perPage = params.per_page || 15;
      const totalItems = filteredData.length;
      const totalPages = Math.ceil(totalItems / perPage);
      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedData = filteredData.slice(startIndex, endIndex);

      return {
        news_events: paginatedData,
        pagination: {
          current_page: page,
          per_page: perPage,
          total_items: totalItems,
          total_pages: totalPages,
          has_prev: page > 1,
          has_next: page < totalPages
        }
      };
    } catch (error) {
      console.error('Error fetching news & events from Google Sheets:', error);
      return { news_events: [], pagination: {} };
    }
  }

  // Utility method to generate IEEE citation (same as original apiService)
  generateIEEECitation(publication) {
    try {
      // Generate proper IEEE citation based on category with correct field names
      const authors = Array.isArray(publication.authors) ? publication.authors.join(', ') : (publication.authors || '');
      const title = `"${publication.title}"`;
      const category = publication.category || 'Journal Articles';
      
      if (category === "Journal Articles") {
        let citation = `${authors}, ${title}`;
        
        if (publication.journal_name) {
          citation += `, ${publication.journal_name}`;
        }
        
        if (publication.volume) {
          citation += `, vol. ${publication.volume}`;
        }
        
        if (publication.issue) {
          citation += `, no. ${publication.issue}`;
        }
        
        if (publication.pages) {
          citation += `, pp. ${publication.pages}`;
        }
        
        citation += `, ${publication.year}.`;
        return citation;
        
      } else if (category === "Conference Proceedings") {
        let citation = `${authors}, ${title}`;
        
        if (publication.conference_name) {
          citation += `, ${publication.conference_name}`;
        }
        
        // Location (city, country)
        const location = [];
        if (publication.city) location.push(publication.city);
        if (publication.country) location.push(publication.country);
        if (location.length > 0) {
          citation += `, ${location.join(', ')}`;
        }
        
        if (publication.pages) {
          citation += `, pp. ${publication.pages}`;
        }
        
        citation += `, ${publication.year}.`;
        return citation;
        
      } else if (category === "Book Chapters") {
        let citation = `${authors}, ${title}`;
        
        if (publication.book_title) {
          citation += `, ${publication.book_title}`;
        }
        
        if (publication.editor) {
          citation += `, ${publication.editor}, Ed(s).`;
        }
        
        if (publication.publisher) {
          citation += ` ${publication.publisher}`;
        }
        
        // Location for book chapters
        const location = [];
        if (publication.city) location.push(publication.city);
        if (publication.country) location.push(publication.country);
        if (location.length > 0) {
          citation += `, ${location.join(', ')}`;
        }
        
        if (publication.pages) {
          citation += `, pp. ${publication.pages}`;
        }
        
        citation += `, ${publication.year}.`;
        return citation;
      }
      
      // Generic fallback
      return `${authors}, ${title}, ${publication.year}.`;
      
    } catch (error) {
      console.error('Error generating citation:', error);
      return 'Citation format error';
    }
  }

  // Utility method to copy text to clipboard (same as original apiService)
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      try {
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
      } catch (fallbackError) {
        document.body.removeChild(textArea);
        console.error('Copy to clipboard failed:', fallbackError);
        return false;
      }
    }
  }

  // Format date for display (same as original apiService)
  formatDate(dateString) {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  }

  // Format research areas for display (same as original apiService)
  formatResearchAreas(areas) {
    if (!areas || !Array.isArray(areas)) return '';
    return areas.join(', ');
  }

  // Clear all cached data
  clearAllCache() {
    try {
      Object.values(this.cacheKeys).forEach(key => {
        localStorage.removeItem(key);
      });
      console.log('✅ All cache cleared');
      return true;
    } catch (error) {
      console.error('Cache clear failed:', error);
      return false;
    }
  }

  // Force refresh data (bypass cache)
  async forceRefreshPublications(params = {}) {
    this.clearAllCache();
    return await this.getPublications(params);
  }

  async forceRefreshProjects(params = {}) {
    this.clearAllCache();
    return await this.getProjects(params);
  }

  async forceRefreshAchievements(params = {}) {
    this.clearAllCache();
    return await this.getAchievements(params);
  }

  async forceRefreshNewsEvents(params = {}) {
    this.clearAllCache();
    return await this.getNewsEvents(params);
  }

  // Background refresh mechanism for better user experience
  async backgroundRefresh() {
    try {
      console.log('🔄 Starting background data refresh...');
      
      // Refresh all data in background (don't clear cache, just update it)
      const promises = [
        this.fetchFromGoogleSheets(this.publicationsUrl, this.cacheKeys.publications),
        this.fetchFromGoogleSheets(this.projectsUrl, this.cacheKeys.projects),
        this.fetchFromGoogleSheets(this.achievementsUrl, this.cacheKeys.achievements),
        this.fetchFromGoogleSheets(this.newsEventsUrl, this.cacheKeys.newsEvents)
      ];
      
      await Promise.allSettled(promises);
      console.log('✅ Background refresh completed');
      
    } catch (error) {
      console.warn('Background refresh failed:', error);
    }
  }

  // Auto-start background refresh on service initialization
  initBackgroundRefresh() {
    // Start background refresh after 30 seconds, then every 4 minutes
    setTimeout(() => {
      this.backgroundRefresh();
      setInterval(() => this.backgroundRefresh(), 4 * 60 * 1000); // Every 4 minutes
    }, 30000); // Initial 30 second delay
  }
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;