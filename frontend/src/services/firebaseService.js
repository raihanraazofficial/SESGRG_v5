import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  where, 
  limit as firebaseLimit,
  startAfter,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from './firebase';

/**
 * Firebase Service for SESG Research Website
 * Handles all Firestore database operations
 */
class FirebaseService {
  constructor() {
    this.collections = {
      users: 'users',
      people: 'people',
      publications: 'publications',
      projects: 'projects',
      achievements: 'achievements',
      newsEvents: 'newsEvents',
      researchAreas: 'researchAreas',
      gallery: 'gallery',
      contact: 'contact',
      footer: 'footer',
      home: 'home'
    };
  }

  // =================== GENERIC FIRESTORE OPERATIONS ===================

  /**
   * Get all documents from a collection
   */
  async getAllDocuments(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      return documents;
    } catch (error) {
      console.error(`Error getting documents from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Get a single document by ID
   */
  async getDocument(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      } else {
        return null;
      }
    } catch (error) {
      console.error(`Error getting document from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Add a new document to a collection
   */
  async addDocument(collectionName, data) {
    try {
      const docData = {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(collection(db, collectionName), docData);
      return { id: docRef.id, ...docData };
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Update a document in a collection
   */
  async updateDocument(collectionName, docId, data) {
    try {
      const docRef = doc(db, collectionName, docId);
      const updateData = {
        ...data,
        updatedAt: serverTimestamp()
      };
      
      await updateDoc(docRef, updateData);
      return { id: docId, ...data, updatedAt: new Date() };
    } catch (error) {
      console.error(`Error updating document in ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Delete a document from a collection
   */
  async deleteDocument(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`Error deleting document from ${collectionName}:`, error);
      throw error;
    }
  }

  /**
   * Query documents with filters
   */
  async queryDocuments(collectionName, filters = []) {
    try {
      const collectionRef = collection(db, collectionName);
      const q = query(collectionRef, ...filters);
      const querySnapshot = await getDocs(q);
      
      const documents = [];
      querySnapshot.forEach((doc) => {
        documents.push({ id: doc.id, ...doc.data() });
      });
      
      return documents;
    } catch (error) {
      console.error(`Error querying documents from ${collectionName}:`, error);
      throw error;
    }
  }

  // =================== USERS COLLECTION ===================

  async getUsers() {
    return await this.getAllDocuments(this.collections.users);
  }

  async getUserByUsername(username) {
    try {
      const users = await this.queryDocuments(this.collections.users, [
        where('username', '==', username)
      ]);
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error getting user by username:', error);
      throw error;
    }
  }

  async addUser(userData) {
    return await this.addDocument(this.collections.users, userData);
  }

  async updateUser(userId, userData) {
    return await this.updateDocument(this.collections.users, userId, userData);
  }

  async deleteUser(userId) {
    return await this.deleteDocument(this.collections.users, userId);
  }

  // =================== PEOPLE COLLECTION ===================

  async getPeople() {
    return await this.getAllDocuments(this.collections.people);
  }

  async getPeopleByCategory(category) {
    return await this.queryDocuments(this.collections.people, [
      where('category', '==', category)
    ]);
  }

  async addPerson(personData) {
    return await this.addDocument(this.collections.people, personData);
  }

  async updatePerson(personId, personData) {
    return await this.updateDocument(this.collections.people, personId, personData);
  }

  async deletePerson(personId) {
    return await this.deleteDocument(this.collections.people, personId);
  }

  // =================== PUBLICATIONS COLLECTION ===================

  async getPublications(filters = {}) {
    try {
      let queryFilters = [];
      
      // Add ordering
      queryFilters.push(orderBy('year', 'desc'));
      
      // Add category filter if specified
      if (filters.category && filters.category !== 'all') {
        queryFilters.push(where('category', '==', filters.category));
      }
      
      // Add year filter if specified
      if (filters.year) {
        queryFilters.push(where('year', '==', parseInt(filters.year)));
      }

      // Add featured filter if specified
      if (filters.featured === true) {
        queryFilters.push(where('featured', '==', true));
      }
      
      return await this.queryDocuments(this.collections.publications, queryFilters);
    } catch (error) {
      console.error('Error getting publications:', error);
      throw error;
    }
  }

  async addPublication(publicationData) {
    return await this.addDocument(this.collections.publications, publicationData);
  }

  async updatePublication(publicationId, publicationData) {
    return await this.updateDocument(this.collections.publications, publicationId, publicationData);
  }

  async deletePublication(publicationId) {
    return await this.deleteDocument(this.collections.publications, publicationId);
  }

  async getFeaturedPublications(limitCount = 5) {
    return await this.queryDocuments(this.collections.publications, [
      where('featured', '==', true),
      orderBy('year', 'desc'),
      firebaseLimit(limitCount)
    ]);
  }

  // =================== PROJECTS COLLECTION ===================

  async getProjects(filters = {}) {
    try {
      let queryFilters = [];
      
      // Add ordering
      queryFilters.push(orderBy('start_date', 'desc'));
      
      // Add status filter if specified
      if (filters.status && filters.status !== 'all') {
        queryFilters.push(where('status', '==', filters.status));
      }

      // Add featured filter if specified
      if (filters.featured === true) {
        queryFilters.push(where('featured', '==', true));
      }
      
      return await this.queryDocuments(this.collections.projects, queryFilters);
    } catch (error) {
      console.error('Error getting projects:', error);
      throw error;
    }
  }

  async addProject(projectData) {
    return await this.addDocument(this.collections.projects, projectData);
  }

  async updateProject(projectId, projectData) {
    return await this.updateDocument(this.collections.projects, projectId, projectData);
  }

  async deleteProject(projectId) {
    return await this.deleteDocument(this.collections.projects, projectId);
  }

  async getFeaturedProjects(limitCount = 5) {
    return await this.queryDocuments(this.collections.projects, [
      where('featured', '==', true),
      orderBy('start_date', 'desc'),
      firebaseLimit(limitCount)
    ]);
  }

  // =================== ACHIEVEMENTS COLLECTION ===================

  async getAchievements(filters = {}) {
    try {
      let queryFilters = [];
      
      // Add ordering
      queryFilters.push(orderBy('date', 'desc'));
      
      // Add category filter if specified
      if (filters.category && filters.category !== 'all') {
        queryFilters.push(where('category', '==', filters.category));
      }

      // Add featured filter if specified
      if (filters.featured === true) {
        queryFilters.push(where('featured', '==', true));
      }
      
      return await this.queryDocuments(this.collections.achievements, queryFilters);
    } catch (error) {
      console.error('Error getting achievements:', error);
      throw error;
    }
  }

  async addAchievement(achievementData) {
    return await this.addDocument(this.collections.achievements, achievementData);
  }

  async updateAchievement(achievementId, achievementData) {
    return await this.updateDocument(this.collections.achievements, achievementId, achievementData);
  }

  async deleteAchievement(achievementId) {
    return await this.deleteDocument(this.collections.achievements, achievementId);
  }

  async getFeaturedAchievements(limitCount = 3) {
    return await this.queryDocuments(this.collections.achievements, [
      where('featured', '==', true),
      orderBy('date', 'desc'),
      firebaseLimit(limitCount)
    ]);
  }

  // =================== NEWS EVENTS COLLECTION ===================

  async getNewsEvents(filters = {}) {
    try {
      let queryFilters = [];
      
      // Add ordering
      queryFilters.push(orderBy('date', 'desc'));
      
      // Add category filter if specified
      if (filters.category && filters.category !== 'all') {
        queryFilters.push(where('category', '==', filters.category));
      }

      // Add featured filter if specified
      if (filters.featured === true) {
        queryFilters.push(where('featured', '==', true));
      }
      
      return await this.queryDocuments(this.collections.newsEvents, queryFilters);
    } catch (error) {
      console.error('Error getting news events:', error);
      throw error;
    }
  }

  async addNewsEvent(newsEventData) {
    return await this.addDocument(this.collections.newsEvents, newsEventData);
  }

  async updateNewsEvent(newsEventId, newsEventData) {
    return await this.updateDocument(this.collections.newsEvents, newsEventId, newsEventData);
  }

  async deleteNewsEvent(newsEventId) {
    return await this.deleteDocument(this.collections.newsEvents, newsEventId);
  }

  async getFeaturedNewsEvents(limitCount = 3) {
    return await this.queryDocuments(this.collections.newsEvents, [
      where('featured', '==', true),
      orderBy('date', 'desc'),
      firebaseLimit(limitCount)
    ]);
  }

  // =================== RESEARCH AREAS COLLECTION ===================

  async getResearchAreas() {
    return await this.queryDocuments(this.collections.researchAreas, [
      orderBy('areaNumber', 'asc')
    ]);
  }

  async addResearchArea(researchAreaData) {
    return await this.addDocument(this.collections.researchAreas, researchAreaData);
  }

  async updateResearchArea(researchAreaId, researchAreaData) {
    return await this.updateDocument(this.collections.researchAreas, researchAreaId, researchAreaData);
  }

  async deleteResearchArea(researchAreaId) {
    return await this.deleteDocument(this.collections.researchAreas, researchAreaId);
  }

  // =================== GALLERY COLLECTION ===================

  async getGalleryImages() {
    return await this.queryDocuments(this.collections.gallery, [
      orderBy('order', 'asc')
    ]);
  }

  async addGalleryImage(imageData) {
    return await this.addDocument(this.collections.gallery, imageData);
  }

  async updateGalleryImage(imageId, imageData) {
    return await this.updateDocument(this.collections.gallery, imageId, imageData);
  }

  async deleteGalleryImage(imageId) {
    return await this.deleteDocument(this.collections.gallery, imageId);
  }

  // =================== OTHER COLLECTIONS ===================

  async getContactData() {
    const contacts = await this.getAllDocuments(this.collections.contact);
    return contacts.length > 0 ? contacts[0] : null;
  }

  async updateContactData(contactData) {
    const existing = await this.getContactData();
    if (existing) {
      return await this.updateDocument(this.collections.contact, existing.id, contactData);
    } else {
      return await this.addDocument(this.collections.contact, contactData);
    }
  }

  async getFooterData() {
    const footers = await this.getAllDocuments(this.collections.footer);
    return footers.length > 0 ? footers[0] : null;
  }

  async updateFooterData(footerData) {
    const existing = await this.getFooterData();
    if (existing) {
      return await this.updateDocument(this.collections.footer, existing.id, footerData);
    } else {
      return await this.addDocument(this.collections.footer, footerData);
    }
  }

  async getHomeData() {
    const homes = await this.getAllDocuments(this.collections.home);
    return homes.length > 0 ? homes[0] : null;
  }

  async updateHomeData(homeData) {
    const existing = await this.getHomeData();
    if (existing) {
      return await this.updateDocument(this.collections.home, existing.id, homeData);
    } else {
      return await this.addDocument(this.collections.home, homeData);
    }
  }

  // =================== DATA MIGRATION UTILITY ===================

  /**
   * Migrate data from localStorage to Firebase
   */
  async migrateFromLocalStorage() {
    try {
      console.log('🔄 Starting data migration from localStorage to Firebase...');
      
      // Migration results tracking
      const migrationResults = {
        users: 0,
        people: 0,
        publications: 0,
        projects: 0,
        achievements: 0,
        newsEvents: 0,
        researchAreas: 0,
        gallery: 0,
        contact: 0,
        footer: 0,
        home: 0
      };

      // Migrate Users
      const usersData = JSON.parse(localStorage.getItem('sesg_users') || '[]');
      for (const user of usersData) {
        await this.addUser(user);
        migrationResults.users++;
      }

      // Migrate People
      const peopleData = JSON.parse(localStorage.getItem('sesgrg_people_data') || '{}');
      if (peopleData.advisors) {
        for (const advisor of peopleData.advisors) {
          await this.addPerson({ ...advisor, category: 'advisors' });
          migrationResults.people++;
        }
      }
      if (peopleData.teamMembers) {
        for (const member of peopleData.teamMembers) {
          await this.addPerson({ ...member, category: 'teamMembers' });
          migrationResults.people++;
        }
      }
      if (peopleData.collaborators) {
        for (const collaborator of peopleData.collaborators) {
          await this.addPerson({ ...collaborator, category: 'collaborators' });
          migrationResults.people++;
        }
      }

      // Migrate Publications
      const publicationsData = JSON.parse(localStorage.getItem('sesg_publications_data') || '[]');
      for (const publication of publicationsData) {
        await this.addPublication(publication);
        migrationResults.publications++;
      }

      // Migrate Projects
      const projectsData = JSON.parse(localStorage.getItem('sesg_projects_data') || '[]');
      for (const project of projectsData) {
        await this.addProject(project);
        migrationResults.projects++;
      }

      // Migrate Achievements
      const achievementsData = JSON.parse(localStorage.getItem('sesg_achievements_data') || '[]');
      for (const achievement of achievementsData) {
        await this.addAchievement(achievement);
        migrationResults.achievements++;
      }

      // Migrate News Events
      const newsEventsData = JSON.parse(localStorage.getItem('sesg_newsevents_data') || '[]');
      for (const newsEvent of newsEventsData) {
        await this.addNewsEvent(newsEvent);
        migrationResults.newsEvents++;
      }

      // Migrate Research Areas
      const researchAreasData = JSON.parse(localStorage.getItem('sesg_research_areas') || '[]');
      for (const area of researchAreasData) {
        await this.addResearchArea(area);
        migrationResults.researchAreas++;
      }

      // Migrate Gallery
      const galleryData = JSON.parse(localStorage.getItem('sesg_gallery_data') || '[]');
      for (const image of galleryData) {
        await this.addGalleryImage(image);
        migrationResults.gallery++;
      }

      // Migrate Contact
      const contactData = JSON.parse(localStorage.getItem('sesg_contact_data') || 'null');
      if (contactData) {
        await this.updateContactData(contactData);
        migrationResults.contact = 1;
      }

      // Migrate Footer
      const footerData = JSON.parse(localStorage.getItem('sesg_footer_data') || 'null');
      if (footerData) {
        await this.updateFooterData(footerData);
        migrationResults.footer = 1;
      }

      // Migrate Home
      const homeData = JSON.parse(localStorage.getItem('sesg_home_data') || 'null');
      if (homeData) {
        await this.updateHomeData(homeData);
        migrationResults.home = 1;
      }

      console.log('✅ Data migration completed successfully!');
      console.log('📊 Migration Results:', migrationResults);
      
      return migrationResults;
    } catch (error) {
      console.error('❌ Data migration failed:', error);
      throw error;
    }
  }

  /**
   * Clear all localStorage data after successful migration
   */
  clearLocalStorageData() {
    try {
      const keysToRemove = [
        'sesg_users',
        'sesg_auth_user',
        'sesg_auth_expiry',
        'sesgrg_people_data',
        'sesg_publications_data',
        'sesg_projects_data',
        'sesg_achievements_data',
        'sesg_newsevents_data',
        'sesg_research_areas',
        'sesg_gallery_data',
        'sesg_contact_data',
        'sesg_footer_data',
        'sesg_home_data'
      ];

      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
      });

      console.log('✅ localStorage data cleared successfully');
      return true;
    } catch (error) {
      console.error('❌ Error clearing localStorage:', error);
      return false;
    }
  }
}

// Export singleton instance
export const firebaseService = new FirebaseService();
export default firebaseService;