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
  }

  async fetchFromGoogleSheets(url) {
    try {
      console.log('Fetching from Google Sheets URL:', url);
      
      // Use allorigins.win CORS proxy
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      console.log('Using proxy URL:', proxyUrl);
      
      const response = await fetch(proxyUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`CORS Proxy request failed: ${response.status} ${response.statusText}`);
      }

      const proxyData = await response.json();
      console.log('Proxy response keys:', Object.keys(proxyData));
      
      // allorigins returns data in { contents: "actual data" } format
      const actualData = JSON.parse(proxyData.contents);
      console.log('Actual data structure:', Object.keys(actualData));
      return actualData;
    } catch (error) {
      console.error('Google Sheets API error:', error);
      throw error;
    }
  }

  // Publications API
  async getPublications(params = {}) {
    try {
      const data = await this.fetchFromGoogleSheets(this.publicationsUrl);
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

      // Calculate statistics
      const statistics = {
        total_publications: publications.length,
        total_citations: publications.reduce((sum, pub) => sum + (parseInt(pub.citations) || 0), 0),
        latest_year: publications.reduce((latest, pub) => Math.max(latest, parseInt(pub.year) || 0), 0),
        total_areas: [...new Set(publications.flatMap(pub => pub.research_areas || []))].length
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
      const data = await this.fetchFromGoogleSheets(this.projectsUrl);
      // Projects API returns {projects: [...], pagination: {...}}
      const projects = data.projects || data.data || [];

      // Apply client-side filtering
      let filteredData = projects;

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

      return {
        projects: paginatedData,
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
      console.error('Error fetching projects from Google Sheets:', error);
      return { projects: [], pagination: {} };
    }
  }

  // Achievements API
  async getAchievements(params = {}) {
    try {
      const data = await this.fetchFromGoogleSheets(this.achievementsUrl);
      const achievements = data.data || [];

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
      const data = await this.fetchFromGoogleSheets(this.newsEventsUrl);
      const newsEvents = data.data || [];

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
      // If IEEE formatted version is available, use it
      if (publication.ieee_formatted) {
        return publication.ieee_formatted;
      }

      // Fallback: Generate IEEE citation based on category
      const authors = Array.isArray(publication.authors) ? publication.authors.join(', ') : publication.authors;
      const title = `"${publication.title}"`;
      const category = publication.category || 'Journal Articles';
      
      if (category === "Journal Articles") {
        let citation = `${authors}, ${title}`;
        if (publication.journal_book_conference_name) {
          citation += `, ${publication.journal_book_conference_name}`;
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
        if (publication.journal_book_conference_name) {
          citation += `, ${publication.journal_book_conference_name}`;
        }
        if (publication.location) {
          citation += `, ${publication.location}`;
        }
        if (publication.pages) {
          citation += `, pp. ${publication.pages}`;
        }
        citation += `, ${publication.year}.`;
        return citation;
        
      } else if (category === "Book Chapters") {
        let citation = `${authors}, ${title}`;
        if (publication.journal_book_conference_name) {
          citation += `, in ${publication.journal_book_conference_name}`;
        }
        if (publication.editors) {
          citation += `, ${publication.editors}, Ed(s).`;
        }
        if (publication.publisher) {
          citation += ` ${publication.publisher}`;
        }
        if (publication.location) {
          citation += `, ${publication.location}`;
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
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService();
export default googleSheetsService;