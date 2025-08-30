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
    return this.get('/publications', { ...defaultParams, ...params });
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
      const authors = publication.authors.join(', ');
      const title = `"${publication.title}"`;
      const publicationInfo = publication.publication_info;
      
      return `${authors}, ${title}, ${publicationInfo}.`;
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