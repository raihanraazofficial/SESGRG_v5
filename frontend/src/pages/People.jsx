import React, { useState } from "react";
import { Mail, Phone, ExternalLink, Linkedin, Github } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const People = () => {
  const [activeSection, setActiveSection] = useState("advisors");

  // Mock data - in production this would come from Google Sheets via API
  const advisors = [
    {
      id: 1,
      name: "Dr. Muhammad Rezwanul Haque",
      designation: "Professor & Research Director",
      affiliation: "BRAC University, Department of Electrical and Electronic Engineering",
      description: "Leading expert in smart grid technologies and renewable energy integration with 20+ years of research experience.",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      email: "mrhaque@bracu.ac.bd",
      phone: "+880-2-9844051",
      googleScholar: "https://scholar.google.com/citations?user=example1",
      orcid: "https://orcid.org/0000-0000-0000-0001",
      linkedin: "https://linkedin.com/in/example1",
      website: "https://faculty.bracu.ac.bd/mrhaque"
    },
    {
      id: 2,
      name: "Dr. Sarah Ahmed",
      designation: "Associate Professor",
      affiliation: "BRAC University, Department of Electrical and Electronic Engineering",
      description: "Specialist in energy storage systems and grid optimization with focus on AI-powered solutions.",
      photo: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300&h=300&fit=crop&crop=face",
      email: "sahmed@bracu.ac.bd",
      phone: "+880-2-9844052",
      googleScholar: "https://scholar.google.com/citations?user=example2",
      researchGate: "https://www.researchgate.net/profile/example2",
      linkedin: "https://linkedin.com/in/example2",
      website: "https://faculty.bracu.ac.bd/sahmed"
    }
  ];

  const researchAssistants = [
    {
      id: 3,
      name: "Md. Karim Rahman",
      designation: "PhD Research Assistant",
      affiliation: "BRAC University, Department of EEE",
      description: "Researching microgrid integration and distributed energy systems for sustainable power networks.",
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
      email: "karim.rahman@g.bracu.ac.bd",
      phone: "+880-1XXXXXXXXX",
      googleScholar: "https://scholar.google.com/citations?user=example3",
      github: "https://github.com/example3",
      linkedin: "https://linkedin.com/in/example3",
      website: "https://karimrahman.dev"
    },
    {
      id: 4,
      name: "Fatima Khan",
      designation: "MS Research Assistant",
      affiliation: "BRAC University, Department of EEE",
      description: "Working on cybersecurity aspects of smart grids and power system automation technologies.",
      photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      email: "fatima.khan@g.bracu.ac.bd",
      phone: "+880-1XXXXXXXXX",
      googleScholar: "https://scholar.google.com/citations?user=example4",
      linkedin: "https://linkedin.com/in/example4",
      website: "https://fatimakhan.research.com"
    },
    {
      id: 5,
      name: "Ahmed Hassan",
      designation: "Undergraduate Research Assistant",
      affiliation: "BRAC University, Department of EEE",
      description: "Contributing to renewable energy integration projects and grid stability analysis research.",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
      email: "ahmed.hassan@g.bracu.ac.bd",
      phone: "+880-1XXXXXXXXX",
      github: "https://github.com/example5",
      linkedin: "https://linkedin.com/in/example5",
      website: "https://ahmedhassan.portfolio.com"
    }
  ];

  const collaborators = [
    {
      id: 6,
      name: "Prof. Dr. James Miller",
      designation: "Professor",
      affiliation: "MIT, Department of Electrical Engineering and Computer Science",
      description: "Collaborating on advanced energy storage and smart grid communication protocols research.",
      photo: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=300&h=300&fit=crop&crop=face",
      email: "jmiller@mit.edu",
      phone: "+1-617-XXX-XXXX",
      googleScholar: "https://scholar.google.com/citations?user=example6",
      ieee: "https://ieeexplore.ieee.org/author/example6",
      linkedin: "https://linkedin.com/in/example6",
      website: "https://www.mit.edu/~jmiller"
    },
    {
      id: 7,
      name: "Dr. Li Wei",
      designation: "Senior Research Scientist",
      affiliation: "Tsinghua University, Department of Electrical Engineering",
      description: "Joint research on AI applications in power systems and renewable energy forecasting models.",
      photo: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=300&h=300&fit=crop&crop=face",
      email: "li.wei@tsinghua.edu.cn",
      phone: "+86-10-XXXXXXXX",
      googleScholar: "https://scholar.google.com/citations?user=example7",
      researchGate: "https://www.researchgate.net/profile/example7",
      linkedin: "https://linkedin.com/in/example7",
      website: "https://www.tsinghua.edu.cn/faculty/liwei"
    },
    {
      id: 8,
      name: "Dr. Emma Thompson",
      designation: "Principal Researcher",
      affiliation: "Imperial College London, Department of Electrical and Electronic Engineering",
      description: "Collaborative projects on grid modernization and sustainable energy policy frameworks.",
      photo: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=300&h=300&fit=crop&crop=face",
      email: "e.thompson@imperial.ac.uk",
      phone: "+44-20-XXXX-XXXX",
      googleScholar: "https://scholar.google.com/citations?user=example8",
      orcid: "https://orcid.org/0000-0000-0000-0008",
      linkedin: "https://linkedin.com/in/example8",
      website: "https://www.imperial.ac.uk/people/e.thompson"
    }
  ];

  const getSectionData = (section) => {
    switch (section) {
      case "advisors":
        return advisors;
      case "research-assistants":
        return researchAssistants;
      case "collaborators":
        return collaborators;
      default:
        return advisors;
    }
  };

  const getSectionTitle = (section) => {
    switch (section) {
      case "advisors":
        return "Advisors";
      case "research-assistants":
        return "Research Assistants";
      case "collaborators":
        return "Collaborators";
      default:
        return "Advisors";
    }
  };

  const getProfileIcon = (type, url) => {
    if (!url) return null;
    
    const iconClass = "h-4 w-4";
    switch (type) {
      case "email":
        return <Mail className={iconClass} />;
      case "phone":
        return <Phone className={iconClass} />;
      case "googleScholar":
        return <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor"><path d="M5.242 13.769L0.5 9.5 12 1l11.5 8.5-4.742 4.269C17.548 12.53 14.978 11.5 12 11.5c-2.977 0-5.548 1.03-6.758 2.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/></svg>;
      case "orcid":
        return <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947 0 .525-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.516.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c2.359 0 3.644-1.506 3.644-3.722 0-2.216-1.284-3.722-3.644-3.722h-2.297z"/></svg>;
      case "researchGate":
        return <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor"><path d="M19.586 0H4.414C1.988 0 0 1.988 0 4.414v15.172C0 22.012 1.988 24 4.414 24h15.172C22.012 24 24 22.012 24 19.586V4.414C24 1.988 22.012 0 19.586 0z"/></svg>;
      case "ieee":
        return <svg className={iconClass} viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 12C1.5 6.2 6.2 1.5 12 1.5S22.5 6.2 22.5 12 17.8 22.5 12 22.5 1.5 17.8 1.5 12zm8.5-4v8h1v-3h2.5c1.4 0 2.5-1.1 2.5-2.5S14.9 8 13.5 8H10zm1 1h2.5c.8 0 1.5.7 1.5 1.5S14.3 12 13.5 12H11V9z"/></svg>;
      case "linkedin":
        return <Linkedin className={iconClass} />;
      case "github":
        return <Github className={iconClass} />;
      case "website":
        return <ExternalLink className={iconClass} />;
      default:
        return <ExternalLink className={iconClass} />;
    }
  };

  const PersonCard = ({ person }) => (
    <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <CardContent className="p-0">
        {/* Photo */}
        <div className="relative">
          <img 
            src={person.photo}
            alt={person.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-4 left-4 text-white">
            <h3 className="text-lg font-bold">{person.name}</h3>
            <p className="text-sm opacity-90">{person.designation}</p>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Affiliation */}
          <div>
            <p className="text-sm font-medium text-emerald-600">{person.affiliation}</p>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed">
            {person.description}
          </p>

          {/* Contact Icons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            {person.email && (
              <a 
                href={`mailto:${person.email}`}
                className="p-2 bg-gray-100 hover:bg-emerald-100 rounded-full transition-colors group/icon"
                title="Email"
              >
                <Mail className="h-4 w-4 text-gray-600 group-hover/icon:text-emerald-600" />
              </a>
            )}
            {person.phone && (
              <a 
                href={`tel:${person.phone}`}
                className="p-2 bg-gray-100 hover:bg-emerald-100 rounded-full transition-colors group/icon"
                title="Phone"
              >
                <Phone className="h-4 w-4 text-gray-600 group-hover/icon:text-emerald-600" />
              </a>
            )}
            {person.googleScholar && (
              <a 
                href={person.googleScholar}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 hover:bg-blue-100 rounded-full transition-colors group/icon"
                title="Google Scholar"
              >
                <svg className="h-4 w-4 text-gray-600 group-hover/icon:text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M5.242 13.769L0.5 9.5 12 1l11.5 8.5-4.742 4.269C17.548 12.53 14.978 11.5 12 11.5c-2.977 0-5.548 1.03-6.758 2.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
                </svg>
              </a>
            )}
            {person.orcid && (
              <a 
                href={person.orcid}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 hover:bg-green-100 rounded-full transition-colors group/icon"
                title="ORCID"
              >
                <svg className="h-4 w-4 text-gray-600 group-hover/icon:text-green-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947 0 .525-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.516.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.016-5.325 5.016h-3.919V7.416zm1.444 1.303v7.444h2.297c2.359 0 3.644-1.506 3.644-3.722 0-2.216-1.284-3.722-3.644-3.722h-2.297z"/>
                </svg>
              </a>
            )}
            {person.researchGate && (
              <a 
                href={person.researchGate}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 hover:bg-cyan-100 rounded-full transition-colors group/icon"
                title="ResearchGate"
              >
                <svg className="h-4 w-4 text-gray-600 group-hover/icon:text-cyan-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.586 0H4.414C1.988 0 0 1.988 0 4.414v15.172C0 22.012 1.988 24 4.414 24h15.172C22.012 24 24 22.012 24 19.586V4.414C24 1.988 22.012 0 19.586 0z"/>
                </svg>
              </a>
            )}
            {person.ieee && (
              <a 
                href={person.ieee}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 hover:bg-indigo-100 rounded-full transition-colors group/icon"
                title="IEEE Xplore"
              >
                <svg className="h-4 w-4 text-gray-600 group-hover/icon:text-indigo-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1.5 12C1.5 6.2 6.2 1.5 12 1.5S22.5 6.2 22.5 12 17.8 22.5 12 22.5 1.5 17.8 1.5 12zm8.5-4v8h1v-3h2.5c1.4 0 2.5-1.1 2.5-2.5S14.9 8 13.5 8H10zm1 1h2.5c.8 0 1.5.7 1.5 1.5S14.3 12 13.5 12H11V9z"/>
                </svg>
              </a>
            )}
            {person.linkedin && (
              <a 
                href={person.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 hover:bg-blue-100 rounded-full transition-colors group/icon"
                title="LinkedIn"
              >
                <Linkedin className="h-4 w-4 text-gray-600 group-hover/icon:text-blue-600" />
              </a>
            )}
            {person.github && (
              <a 
                href={person.github}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors group/icon"
                title="GitHub"
              >
                <Github className="h-4 w-4 text-gray-600 group-hover/icon:text-gray-800" />
              </a>
            )}
          </div>

          {/* Know More Button */}
          <div className="pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full group-hover:bg-emerald-50 group-hover:border-emerald-200"
              onClick={() => window.open(person.website, '_blank')}
            >
              Know More <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Team</h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto mb-8">
            Meet the dedicated researchers, advisors, and collaborators who are advancing sustainable energy 
            and smart grid technologies at our research lab.
          </p>
        </div>

        {/* Section Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-2 shadow-lg">
            <div className="flex space-x-2">
              {[
                { key: "advisors", label: "Advisors" },
                { key: "research-assistants", label: "Research Assistants" },
                { key: "collaborators", label: "Collaborators" }
              ].map((section) => (
                <Button
                  key={section.key}
                  variant={activeSection === section.key ? "default" : "ghost"}
                  onClick={() => setActiveSection(section.key)}
                  className="px-6 py-2"
                >
                  {section.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Section Content */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {getSectionTitle(activeSection)}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getSectionData(activeSection).map((person) => (
              <PersonCard key={person.id} person={person} />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Research Team</h3>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Interested in contributing to sustainable energy and smart grid research? 
              We welcome collaborations with researchers, students, and industry partners.
            </p>
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
              <a href="mailto:sesg@bracu.ac.bd" className="flex items-center">
                Get In Touch <Mail className="ml-2 h-5 w-5" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default People;