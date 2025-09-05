import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import { clearOldLocalStorageData } from "./utils/clearOldData";
import { debugInputFields } from "./utils/debugInputs";

// Import components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import People from "./pages/People";
import ResearchAreas from "./pages/ResearchAreas";
import Publications from "./pages/Publications";
import Projects from "./pages/Projects";
import Achievements from "./pages/Achievements";
import NewsEvents from "./pages/NewsEvents";
import Gallery from "./pages/Gallery";
import Contacts from "./pages/Contacts";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsConditions from "./pages/TermsConditions";

// Import context
import { AuthProvider } from "./contexts/AuthContext";
import { PeopleProvider } from "./contexts/PeopleContext";
import { PublicationsProvider } from "./contexts/PublicationsContext";
import { ProjectsProvider } from "./contexts/ProjectsContext";
import { AchievementsProvider } from "./contexts/AchievementsContext";
import { NewsEventsProvider } from "./contexts/NewsEventsContext";
import { ContactProvider } from "./contexts/ContactContext";
import { GalleryProvider } from "./contexts/GalleryContext";
import { HomeProvider } from "./contexts/HomeContext";
import { ResearchAreasProvider } from "./contexts/ResearchAreasContext";
import { FooterProvider } from "./contexts/FooterContext";

// Import admin components
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import ContentManagement from "./pages/ContentManagement";
import AdminRoute from "./components/AdminRoute";

function App() {
  // Clear old localStorage data on app initialization
  useEffect(() => {
    clearOldLocalStorageData();
    
    // Debug input fields if there are issues
    setTimeout(() => {
      debugInputFields();
    }, 3000);
  }, []);

  return (
    <AuthProvider>
      <PeopleProvider>
        <PublicationsProvider>
          <ProjectsProvider>
            <AchievementsProvider>
              <NewsEventsProvider>
                <ContactProvider>
                  <GalleryProvider>
                    <HomeProvider>
                      <ResearchAreasProvider>
                        <FooterProvider>
                  <div className="App min-h-screen bg-gray-50">
                    <BrowserRouter>
                      <Routes>
                        {/* Admin Routes */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route 
                          path="/admin" 
                          element={
                            <AdminRoute>
                              <AdminDashboard />
                            </AdminRoute>
                          } 
                        />
                        <Route 
                          path="/admin/content/:contentType" 
                          element={
                            <AdminRoute>
                              <ContentManagement />
                            </AdminRoute>
                          } 
                        />
                        
                        {/* Public Routes */}
                        <Route path="/*" element={
                          <>
                            <Navbar />
                            <main className="pt-16">
                              <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/people" element={<People />} />
                                <Route path="/research" element={<ResearchAreas />} />
                                <Route path="/research-areas" element={<ResearchAreas />} />
                                <Route path="/publications" element={<Publications />} />
                                <Route path="/projects" element={<Projects />} />
                                <Route path="/achievements" element={<Achievements />} />
                                <Route path="/news" element={<NewsEvents />} />
                                <Route path="/news-events" element={<NewsEvents />} />
                                <Route path="/gallery" element={<Gallery />} />
                                <Route path="/contact" element={<Contacts />} />
                                <Route path="/faq" element={<FAQ />} />
                                <Route path="/privacy" element={<PrivacyPolicy />} />
                                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                                <Route path="/terms" element={<TermsConditions />} />
                                <Route path="/terms-conditions" element={<TermsConditions />} />
                              </Routes>
                            </main>
                            <Footer />
                          </>
                        } />
                      </Routes>
                    </BrowserRouter>
                  </div>
                        </FooterProvider>
                      </ResearchAreasProvider>
                    </HomeProvider>
                  </GalleryProvider>
                </ContactProvider>
              </NewsEventsProvider>
            </AchievementsProvider>
          </ProjectsProvider>
        </PublicationsProvider>
      </PeopleProvider>
    </AuthProvider>
  );
}

export default App;