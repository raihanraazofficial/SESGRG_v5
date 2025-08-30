/**
 * API Service for SESG Research Website
 * Handles all communication with the backend API
 */

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';
const FALLBACK_URL = 'http://localhost:8001';

class ApiService {
  constructor() {
    this.baseURL = `${API_BASE_URL}/api`;
  }

  async get(endpoint, params = {}) {
    // Try primary URL first, then fallback to localhost
    for (const baseUrl of [API_BASE_URL, FALLBACK_URL]) {
      try {
        const url = new URL(`${baseUrl}/api${endpoint}`);
        Object.keys(params).forEach(key => {
          if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
            url.searchParams.append(key, params[key]);
          }
        });

        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        console.error(`API GET request failed for ${baseUrl}:`, error);
        
        // If this is the last URL to try, throw the error
        if (baseUrl === FALLBACK_URL) {
          throw error;
        }
        // Otherwise, continue to next URL
      }
    }
  }

  // Publications API
  async getPublications(params = {}) {
    const defaultParams = {
      page: 1,
      per_page: 20,
      sort_by: 'year',
      sort_order: 'desc'
    };
    
    // Convert single search to individual filters for backend
    const processedParams = { ...defaultParams, ...params };
    if (params.search_filter) {
      processedParams.title_filter = params.search_filter;
      processedParams.author_filter = params.search_filter;
      processedParams.year_filter = params.search_filter;
      delete processedParams.search_filter;
    }
    
    return this.get('/publications', processedParams);
  }

  // Projects API
  async getProjects(params = {}) {
    const defaultParams = {
      page: 1,
      per_page: 20,
      sort_by: 'start_date',
      sort_order: 'desc'
    };
    return this.get('/projects', { ...defaultParams, ...params });
  }

  // Achievements API
  async getAchievements(params = {}) {
    const defaultParams = {
      page: 1,
      per_page: 12,
      sort_by: 'date',
      sort_order: 'desc'
    };
    return this.get('/achievements', { ...defaultParams, ...params });
  }

  async getAchievementDetails(achievementId) {
    return this.get(`/achievements/${achievementId}`);
  }

  // News & Events API
  async getNewsEvents(params = {}) {
    const defaultParams = {
      page: 1,
      per_page: 15,
      sort_by: 'date',
      sort_order: 'desc'
    };
    return this.get('/news-events', { ...defaultParams, ...params });
  }

  async getNewsEventDetails(newsId) {
    return this.get(`/news-events/${newsId}`);
  }

  // Research Statistics API
  async getResearchStatistics() {
    return this.get('/research-stats');
  }

  // Utility method to generate IEEE citation
  generateIEEECitation(publication) {
    try {
      // If IEEE formatted version is available from backend, use it
      if (publication.ieee_formatted) {
        return publication.ieee_formatted;
      }

      // Fallback: Generate IEEE citation based on category
      const authors = Array.isArray(publication.authors) ? publication.authors.join(', ') : publication.authors;
      const title = `"${publication.title}"`;
      const category = publication.category || 'Journal Articles';
      
      if (category === "Journal Articles") {
        // Authors, "Title," Journal Name, vol. X, no. Y, pp. Z-W, Year.
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
        // Authors, "Title," Conference Name, Location, pp. X-Y, Year.
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
        // Authors, "Chapter Title," in Book Title, Editors, Ed(s). Publisher, Location, pp. X-Y, Year.
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

  // Utility method to copy text to clipboard
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

  // Format date for display
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

  // Format research areas for display
  formatResearchAreas(areas) {
    if (!areas || !Array.isArray(areas)) return '';
    return areas.join(', ');
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;