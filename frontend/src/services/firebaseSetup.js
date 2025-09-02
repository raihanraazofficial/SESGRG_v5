import { firebaseService } from './firebaseService';

/**
 * Firebase Setup and Test Utility
 * Tests Firebase connection and populates with sample data
 */
class FirebaseSetup {
  constructor() {
    this.sampleData = {
      people: [
        {
          id: "advisor-1",
          name: "Dr. A.S. Nazmul Huda",
          designation: "Professor",
          affiliation: "Department of EEE, University of Dhaka",
          description: "Expert in Smart Grid Technologies and Renewable Energy Integration",
          expertise: ["Smart Grid", "Renewable Energy", "Power Systems", "Energy Storage"],
          photo: "/images/advisors/nazmul-huda.jpg",
          email: "nazmul@du.ac.bd",
          phone: "+880-1234567890",
          googleScholar: "https://scholar.google.com/citations?user=example1",
          researchGate: "https://www.researchgate.net/profile/example1",
          linkedin: "https://linkedin.com/in/example1",
          category: "advisors"
        },
        {
          id: "member-1", 
          name: "Md. Raihan Raaz",
          designation: "Research Assistant",
          affiliation: "SESG Research Group",
          description: "PhD student working on microgrids and energy optimization",
          expertise: ["Microgrids", "Optimization", "Machine Learning", "IoT"],
          photo: "/images/team/raihan-raaz.jpg",
          email: "raihan@sesg.org",
          phone: "+880-1987654321",
          category: "teamMembers"
        }
      ],
      publications: [
        {
          id: "pub-1",
          title: "Advanced Smart Grid Technologies for Sustainable Energy Systems",
          authors: ["Dr. A.S. Nazmul Huda", "Md. Raihan Raaz"],
          journal_name: "IEEE Transactions on Smart Grid",
          volume: "15",
          issue: "3",
          pages: "1245-1258",
          year: 2024,
          category: "Journal Article",
          featured: true,
          research_areas: ["Smart Grid Technologies"],
          doi: "10.1109/TSG.2024.1234567"
        },
        {
          id: "pub-2",
          title: "Microgrid Optimization Using Machine Learning Techniques",
          authors: ["Md. Raihan Raaz", "Dr. A.S. Nazmul Huda"],
          conference_name: "IEEE Power & Energy Society General Meeting",
          pages: "1-5",
          year: 2024,
          category: "Conference Proceedings",
          research_areas: ["Microgrids & Distributed Energy Systems"],
          city: "Seattle",
          country: "USA"
        }
      ],
      projects: [
        {
          id: "proj-1",
          title: "Smart Microgrid Development for Rural Bangladesh",
          description: "Development of intelligent microgrid systems for rural electrification in Bangladesh",
          start_date: "2024-01-01",
          end_date: "2026-12-31",
          status: "Active",
          budget: 500000,
          funding_agency: "Bangladesh Government",
          team_members: ["Dr. A.S. Nazmul Huda", "Md. Raihan Raaz"],
          research_areas: ["Microgrids & Distributed Energy Systems", "Renewable Energy Integration"],
          featured: true
        }
      ],
      achievements: [
        {
          id: "ach-1",
          title: "Best Paper Award - IEEE PGSM 2024",
          description: "Received best paper award for research on microgrid optimization",
          date: "2024-07-15",
          category: "Award",
          featured: true,
          impact: "International recognition for innovative research in energy systems"
        }
      ],
      newsEvents: [
        {
          id: "news-1",
          title: "SESG Research Group Established",
          short_description: "New research group focused on sustainable energy and smart grids launched at University of Dhaka",
          description: "The Sustainable Energy & Smart Grid (SESG) Research Group has been officially established to advance research in renewable energy integration and smart grid technologies.",
          date: "2024-01-15",
          category: "Announcement",
          featured: true,
          image: "/images/news/sesg-launch.jpg"
        }
      ],
      researchAreas: [
        {
          id: "area-1",
          title: "Smart Grid Technologies",
          description: "Research on intelligent power grid systems and automation",
          image: "/images/research/smart-grid.jpg",
          areaNumber: 1
        },
        {
          id: "area-2", 
          title: "Microgrids & Distributed Energy Systems",
          description: "Development of localized energy systems and microgrids",
          image: "/images/research/microgrids.jpg",
          areaNumber: 2
        }
      ],
      gallery: [
        {
          id: "img-1",
          title: "Smart Grid Laboratory",
          description: "State-of-the-art smart grid testing facility",
          url: "/images/gallery/lab-1.jpg",
          category: "Laboratory",
          order: 1
        }
      ]
    };
  }

  /**
   * Test Firebase connection
   */
  async testConnection() {
    try {
      console.log('🔄 Testing Firebase connection...');
      
      // Try to read from a collection (this will create it if it doesn't exist)
      const testDoc = await firebaseService.addDocument('test', {
        message: 'Firebase connection test',
        timestamp: new Date().toISOString()
      });
      
      console.log('✅ Firebase connection successful! Test document created:', testDoc.id);
      
      // Clean up test document
      await firebaseService.deleteDocument('test', testDoc.id);
      console.log('🧹 Test document cleaned up');
      
      return true;
    } catch (error) {
      console.error('❌ Firebase connection failed:', error);
      throw error;
    }
  }

  /**
   * Check if collections have data
   */
  async checkExistingData() {
    try {
      console.log('🔍 Checking existing data in Firebase...');
      
      const collections = ['people', 'publications', 'projects', 'achievements', 'newsEvents', 'researchAreas', 'gallery'];
      const dataStatus = {};
      
      for (const collection of collections) {
        const data = await firebaseService.getAllDocuments(collection);
        dataStatus[collection] = data.length;
        console.log(`📊 ${collection}: ${data.length} documents`);
      }
      
      return dataStatus;
    } catch (error) {
      console.error('❌ Error checking existing data:', error);
      throw error;
    }
  }

  /**
   * Populate Firebase with sample data
   */
  async populateSampleData() {
    try {
      console.log('🚀 Populating Firebase with sample data...');
      
      const results = {
        people: 0,
        publications: 0,
        projects: 0,
        achievements: 0,
        newsEvents: 0,
        researchAreas: 0,
        gallery: 0
      };

      // Add People
      for (const person of this.sampleData.people) {
        await firebaseService.addPerson(person);
        results.people++;
      }

      // Add Publications
      for (const publication of this.sampleData.publications) {
        await firebaseService.addPublication(publication);
        results.publications++;
      }

      // Add Projects
      for (const project of this.sampleData.projects) {
        await firebaseService.addProject(project);
        results.projects++;
      }

      // Add Achievements
      for (const achievement of this.sampleData.achievements) {
        await firebaseService.addAchievement(achievement);
        results.achievements++;
      }

      // Add News Events
      for (const newsEvent of this.sampleData.newsEvents) {
        await firebaseService.addNewsEvent(newsEvent);
        results.newsEvents++;
      }

      // Add Research Areas
      for (const area of this.sampleData.researchAreas) {
        await firebaseService.addResearchArea(area);
        results.researchAreas++;
      }

      // Add Gallery Images
      for (const image of this.sampleData.gallery) {
        await firebaseService.addGalleryImage(image);
        results.gallery++;
      }

      // Add default Home data
      await firebaseService.updateHomeData({
        hero: {
          title: "Sustainable Energy & Smart Grid Research",
          subtitle: "Pioneering Research in Clean Energy, Renewable Integration, and Next-Generation Smart Grid Systems",
          backgroundImage: "/images/hero/smart-grid-bg.jpg"
        },
        aboutUs: {
          title: "About SESG Research Group",
          description: "We are dedicated to advancing sustainable energy technologies and smart grid systems through innovative research and development.",
          image: "/images/about/research-team.jpg"
        },
        objectives: [
          "Develop intelligent smart grid technologies",
          "Advance renewable energy integration",
          "Create sustainable energy solutions",
          "Foster international collaboration"
        ]
      });

      // Add default Contact data
      await firebaseService.updateContactData({
        address: "Department of EEE, University of Dhaka, Dhaka-1000, Bangladesh",
        phone: "+880-2-9661900",
        email: "contact@sesg.org",
        officeHours: "Sunday to Thursday: 9:00 AM - 5:00 PM",
        mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.8977!2d90.3945!3d23.7280!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQzJzQwLjgiTiA5MMKwMjMnNDAuMiJF!5e0!3m2!1sen!2sbd!4v1234567890123"
      });

      // Add default Footer data
      await firebaseService.updateFooterData({
        labInfo: {
          name: "SESG Research Group",
          description: "Advancing sustainable energy and smart grid technologies",
          logo: "/Logo.jpg"
        },
        quickLinks: [
          { name: "Home", url: "/" },
          { name: "Research", url: "/research-areas" },
          { name: "Publications", url: "/publications" },
          { name: "Contact", url: "/contact" }
        ],
        contactInfo: {
          address: "University of Dhaka, Dhaka-1000",
          phone: "+880-2-9661900",
          email: "contact@sesg.org"
        },
        socialMedia: [
          { platform: "Facebook", url: "https://facebook.com/sesg", icon: "facebook" },
          { platform: "Twitter", url: "https://twitter.com/sesg", icon: "twitter" },
          { platform: "LinkedIn", url: "https://linkedin.com/company/sesg", icon: "linkedin" }
        ]
      });

      console.log('✅ Sample data populated successfully!');
      console.log('📊 Results:', results);
      
      return results;
    } catch (error) {
      console.error('❌ Error populating sample data:', error);
      throw error;
    }
  }

  /**
   * Clear all data from Firebase (use with caution!)
   */
  async clearAllData() {
    try {
      console.log('🗑️ Clearing all data from Firebase...');
      
      const collections = ['people', 'publications', 'projects', 'achievements', 'newsEvents', 'researchAreas', 'gallery', 'contact', 'footer', 'home'];
      
      for (const collectionName of collections) {
        const documents = await firebaseService.getAllDocuments(collectionName);
        for (const doc of documents) {
          await firebaseService.deleteDocument(collectionName, doc.id);
        }
        console.log(`🧹 Cleared ${documents.length} documents from ${collectionName}`);
      }
      
      console.log('✅ All data cleared successfully!');
      return true;
    } catch (error) {
      console.error('❌ Error clearing data:', error);
      throw error;
    }
  }

  /**
   * Complete Firebase setup (test connection + populate data)
   */
  async setupFirebase(clearFirst = false) {
    try {
      console.log('🔧 Starting complete Firebase setup...');
      
      // Test connection first
      await this.testConnection();
      
      // Clear existing data if requested
      if (clearFirst) {
        await this.clearAllData();
      }
      
      // Check existing data
      const existingData = await this.checkExistingData();
      const hasData = Object.values(existingData).some(count => count > 0);
      
      if (!hasData) {
        // Populate with sample data if no data exists
        await this.populateSampleData();
      } else {
        console.log('📋 Firebase already has data, skipping population');
      }
      
      console.log('🎉 Firebase setup completed successfully!');
      return true;
    } catch (error) {
      console.error('❌ Firebase setup failed:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const firebaseSetup = new FirebaseSetup();
export default firebaseSetup;