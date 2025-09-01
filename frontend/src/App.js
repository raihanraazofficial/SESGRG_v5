import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

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
import { PeopleProvider } from "./contexts/PeopleContext";
import { PublicationsProvider } from "./contexts/PublicationsContext";

function App() {
  return (
    <PeopleProvider>
      <PublicationsProvider>
      <div className="App min-h-screen bg-gray-50">
        <BrowserRouter>
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
        </BrowserRouter>
      </div>
    </PeopleProvider>
  );
}

export default App;