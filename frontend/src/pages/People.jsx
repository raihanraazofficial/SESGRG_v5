import React, { useState } from "react";
import { Mail, Phone, ExternalLink, Linkedin, Github, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const People = () => {
  const [activeSection, setActiveSection] = useState("advisors");

  const researchAreas = [
    "Smart Grid Technologies",
    "Microgrids & Distributed Energy Systems", 
    "Renewable Energy Integration",
    "Grid Optimization & Stability",
    "Energy Storage Systems",
    "Power System Automation",
    "Cybersecurity and AI for Power Infrastructure"
  ];

  const getResearchAreaColor = (index) => {
    const colors = [
      'bg-emerald-100 text-emerald-700',
      'bg-blue-100 text-blue-700',
      'bg-purple-100 text-purple-700',
      'bg-orange-100 text-orange-700',
      'bg-red-100 text-red-700',
      'bg-indigo-100 text-indigo-700',
      'bg-pink-100 text-pink-700'
    ];
    return colors[index % colors.length];
  };

  // Updated advisor data as per user specifications
  const advisors = [
    {
      id: 1,
      name: "A. S. Nazmul Huda, PhD",
      designation: "Associate Professor",
      affiliation: "Department of EEE, BRAC University",
      description: "Expert in power systems reliability, renewable energy, and smart grid optimization with strong focus on modeling, simulation, and condition monitoring.",
      expertise: [0, 2, 3], // Max 4 areas: Smart Grid Technologies, Renewable Energy Integration, Grid Optimization & Stability
      photo: "https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/Nazmul%20Huda.jpg",
      email: "nazmul.huda@bracu.ac.bd",
      phone: "+880-2-9844051",
      googleScholar: "https://scholar.google.com/citations?user=nazmul-huda",
      researchGate: "https://www.researchgate.net/profile/nazmul-huda",
      orcid: "https://orcid.org/0000-0000-0000-0001",
      linkedin: "https://linkedin.com/in/nazmul-huda",
      github: "https://github.com/nazmul-huda",
      ieee: "https://ieeexplore.ieee.org/author/nazmul-huda",
      website: "https://engineering.bracu.ac.bd/profile/as-nazmul-huda-phd"
    },
    {
      id: 2,
      name: "Shameem Ahmad, PhD",
      designation: "Associate Professor",
      affiliation: "Department of EEE, BRAC University",
      description: "Specialist in smart grids, microgrids, and AI-driven power system control with expertise in renewable energy and advanced power converters.",
      expertise: [1, 3, 0], // Max 4 areas: Microgrids & Distributed Energy Systems, Grid Optimization & Stability, Smart Grid Technologies
      photo: "https://raw.githubusercontent.com/raihanraazofficial/SESGRG_v2/refs/heads/main/imgdirectory/Shameem%20Ahmad.jpg",
      email: "shameem.ahmad@bracu.ac.bd",
      phone: "+880-2-9844052",
      googleScholar: "https://scholar.google.com/citations?user=shameem-ahmad",
      researchGate: "https://www.researchgate.net/profile/shameem-ahmad",
      orcid: "https://orcid.org/0000-0000-0000-0002",
      linkedin: "https://linkedin.com/in/shameem-ahmad",
      github: "https://github.com/shameem-ahmad",
      ieee: "https://ieeexplore.ieee.org/author/shameem-ahmad",
      website: "https://engineering.bracu.ac.bd/profile/shameem-ahmad-phd"
    },
    {
      id: 3,
      name: "Amirul Islam, PhD",
      designation: "Assistant Professor",
      affiliation: "Department of Electrical and Electronic Engineering, BRAC University",
      description: "Researcher in artificial intelligence and power systems with expertise in multimodal signal processing, smart grid automation, and interdisciplinary applications of AI.",
      expertise: [5, 6], // Max 4 areas: Power System Automation, Cybersecurity and AI for Power Infrastructure
      photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face&facepad=3",
      email: "amirul.islam@bracu.ac.bd",
      phone: "+880-2-9844053",
      googleScholar: "https://scholar.google.com/citations?user=amirul-islam",
      researchGate: "https://www.researchgate.net/profile/amirul-islam",
      orcid: "https://orcid.org/0000-0000-0000-0003",
      linkedin: "https://linkedin.com/in/amirul-islam",
      github: "https://github.com/amirul-islam",
      ieee: "https://ieeexplore.ieee.org/author/amirul-islam",
      website: "https://engineering.bracu.ac.bd/profile/amirul-islam-phd"
    }
  ];

  const teamMembers = [
    {
      id: 3,
      name: "Md. Karim Rahman",
      designation: "PhD Research Assistant",
      affiliation: "BRAC University, Department of EEE",
      description: "Researching microgrid integration and distributed energy systems for sustainable power networks.",
      expertise: [1, 2, 4], // Indices for research areas
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
      expertise: [6, 5, 0], // Indices for research areas
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
      expertise: [2, 3, 1], // Indices for research areas
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
      expertise: [4, 0, 5], // Indices for research areas
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
      expertise: [6, 2, 3], // Indices for research areas
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
      expertise: [0, 3, 5], // Indices for research areas
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
      case "team-members":
        return teamMembers;
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
      case "team-members":
        return "Team Members";
      case "collaborators":
        return "Collaborators";
      default:
        return "Advisors";
    }
  };

  const PersonCard = ({ person }) => (
    <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden group performance-optimized">
      <CardContent className="p-0">
        {/* Photo */}
        <div className="relative">
          <img 
            src={person.photo}
            alt={person.name}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-500 lazy-image performance-optimized"
            loading="lazy"
            decoding="async"
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
          <p className="text-gray-600 text-sm leading-relaxed text-justify">
            {person.description}
          </p>

          {/* Expertise Areas */}
          {person.expertise && person.expertise.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Expertise Areas:</h4>
              <div className="flex flex-wrap gap-2">
                {person.expertise.map((areaIndex) => (
                  <span
                    key={areaIndex}
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getResearchAreaColor(areaIndex)}`}
                  >
                    {researchAreas[areaIndex]}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Icons - Using simple-icons CDN */}
          <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
            {person.email && (
              <a 
                href={`mailto:${person.email}`}
                className="p-2 bg-gray-100 hover:bg-red-100 rounded-full transition-colors group/icon"
                title="Email"
              >
                <img 
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/maildotru.svg" 
                  alt="Email"
                  className="h-4 w-4 text-gray-600 group-hover/icon:text-red-600" 
                  style={{filter: 'invert(0.4)'}}
                />
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
                <img 
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlescholar.svg" 
                  alt="Google Scholar"
                  className="h-4 w-4" 
                  style={{filter: 'invert(0.4)'}}
                />
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
                <img 
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/orcid.svg" 
                  alt="ORCID"
                  className="h-4 w-4" 
                  style={{filter: 'invert(0.4)'}}
                />
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
                <img 
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/researchgate.svg" 
                  alt="ResearchGate"
                  className="h-4 w-4" 
                  style={{filter: 'invert(0.4)'}}
                />
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
                <img 
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/ieee.svg" 
                  alt="IEEE"
                  className="h-4 w-4" 
                  style={{filter: 'invert(0.4)'}}
                />
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
                <img 
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" 
                  alt="LinkedIn"
                  className="h-4 w-4" 
                  style={{filter: 'invert(0.4)'}}
                />
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
                <img 
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/github.svg" 
                  alt="GitHub"
                  className="h-4 w-4" 
                  style={{filter: 'invert(0.4)'}}
                />
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
    <div className="min-h-screen pt-20 bg-gray-50 performance-optimized">
      {/* Header - Gallery Style */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 performance-optimized">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link to="/" className="flex items-center text-white hover:text-emerald-400 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Our Team</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Meet the dedicated researchers, advisors, and collaborators who are advancing sustainable energy 
            and smart grid technologies at our research lab.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Section Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white rounded-lg p-2 shadow-lg">
            <div className="flex space-x-2">
              {[
                { key: "advisors", label: "Advisors" },
                { key: "team-members", label: "Team Members" },
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

      {/* Back to Top - Performance Optimized */}
      <div className="text-center pb-16">
        <Button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          size="lg" 
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 performance-optimized"
        >
          Back to Top
        </Button>
      </div>
    </div>
  );
};

export default People;