import React, { useState } from "react";
import { Mail, ExternalLink, Linkedin, Github, ArrowLeft, Edit3, UserPlus, Shield, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { usePeople } from "../contexts/PeopleContext";
import { useAuth } from "../contexts/AuthContext";
import EditPersonModal from "../components/EditPersonModal";
import AuthModal from "../components/AuthModal";
import AddPersonModal from "../components/AddPersonModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

const People = () => {
  const [activeSection, setActiveSection] = useState("advisors");
  const [editingPerson, setEditingPerson] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingPerson, setDeletingPerson] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  
  // Use Auth Context instead of local state
  const { isAuthenticated } = useAuth();

  const { peopleData, researchAreas, deletePerson } = usePeople();

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

  const getSectionData = (section) => {
    switch (section) {
      case "advisors":
        return peopleData.advisors;
      case "team-members":
        return peopleData.teamMembers;
      case "collaborators":
        return peopleData.collaborators;
      default:
        return peopleData.advisors;
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

  const handleEditPerson = (person, category) => {
    if (isAuthenticated) {
      setEditingPerson(person);
      setEditingCategory(category);
      setIsEditModalOpen(true);
    } else {
      setPendingAction({ type: 'edit', person, category });
      setIsAuthModalOpen(true);
    }
  };

  const handleDeletePerson = (person, category) => {
    if (isAuthenticated) {
      setDeletingPerson(person);
      setDeletingCategory(category);
      setIsDeleteModalOpen(true);
    } else {
      setPendingAction({ type: 'delete', person, category });
      setIsAuthModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletingPerson || !deletingCategory) return;
    
    setIsDeleting(true);
    try {
      // Simulate slight delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      deletePerson(deletingCategory, deletingPerson.id);
      
      // Close modal and reset state
      setIsDeleteModalOpen(false);
      setDeletingPerson(null);
      setDeletingCategory(null);
    } catch (error) {
      console.error('Error deleting person:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleAddPerson = () => {
    if (isAuthenticated) {
      setIsAddModalOpen(true);
    } else {
      setPendingAction({ type: 'add', category: activeSection === 'team-members' ? 'teamMembers' : activeSection });
      setIsAuthModalOpen(true);
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    
    // Execute pending action
    if (pendingAction) {
      if (pendingAction.type === 'edit') {
        setEditingPerson(pendingAction.person);
        setEditingCategory(pendingAction.category);
        setIsEditModalOpen(true);
      } else if (pendingAction.type === 'add') {
        setIsAddModalOpen(true);
      } else if (pendingAction.type === 'delete') {
        setDeletingPerson(pendingAction.person);
        setDeletingCategory(pendingAction.category);
        setIsDeleteModalOpen(true);
      }
      setPendingAction(null);
    }
  };

  const handleCloseAuthModal = () => {
    setIsAuthModalOpen(false);
    setPendingAction(null);
  };

  const handleCloseEditModal = () => {
    setEditingPerson(null);
    setEditingCategory(null);
    setIsEditModalOpen(false);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingPerson(null);
    setDeletingCategory(null);
  };

  const PersonCard = ({ person, category }) => (
    <Card className="hover:shadow-xl transition-all duration-300 overflow-hidden group performance-optimized h-full flex flex-col">
      <CardContent className="p-0 flex flex-col h-full">
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
          
          {/* Edit and Delete Buttons - Only for authenticated users */}
          {isAuthenticated && (
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 hover:bg-white text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleEditPerson(person, activeSection === 'team-members' ? 'teamMembers' : activeSection)}
                title="Edit Member"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              
              <Button
                size="sm"
                variant="secondary"
                className="bg-red-50/90 hover:bg-red-100 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDeletePerson(person, activeSection === 'team-members' ? 'teamMembers' : activeSection)}
                title="Delete Member"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4 flex-grow flex flex-col">
          {/* Affiliation */}
          <div>
            <p className="text-sm font-medium text-emerald-600">{person.affiliation}</p>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed text-justify flex-grow">
            {person.description}
          </p>

          {/* Research Interest - Limited to max 4 areas */}
          {person.expertise && person.expertise.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-800 mb-2">Research Interest:</h4>
              <div className="flex flex-wrap gap-2">
                {person.expertise.slice(0, 4).map((areaIndex) => (
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

          {/* Fixed Bottom Section - Research Profile Icons and Know More Button */}
          <div className="mt-auto">
            {/* Research Profile Icons - All icons except phone */}
            <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 mb-4">
              {/* Email - Always present */}
              <a 
                href={`mailto:${person.email || 'contact@bracu.ac.bd'}`}
                className="p-2 bg-gray-100 hover:bg-red-100 rounded-full transition-colors group/icon"
                title="Email"
              >
                <img 
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/maildotru.svg" 
                  alt="Email"
                  className="h-4 w-4 filter-red" 
                  style={{filter: 'invert(0.2) sepia(1) saturate(5) hue-rotate(320deg) brightness(0.8)'}}
                />
              </a>
              
              {/* Google Scholar - Always present */}
              <a 
                href={person.googleScholar || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 hover:bg-blue-100 rounded-full transition-colors group/icon"
                title="Google Scholar"
              >
                <img 
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/googlescholar.svg" 
                  alt="Google Scholar"
                  className="h-4 w-4" 
                  style={{filter: 'invert(0.2) sepia(1) saturate(5) hue-rotate(200deg) brightness(0.8)'}}
                />
              </a>
              
              {/* ResearchGate - Always present */}
              <a 
                href={person.researchGate || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 hover:bg-cyan-100 rounded-full transition-colors group/icon"
                title="ResearchGate"
              >
                <img 
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/researchgate.svg" 
                  alt="ResearchGate"
                  className="h-4 w-4" 
                  style={{filter: 'invert(0.2) sepia(1) saturate(5) hue-rotate(170deg) brightness(0.8)'}}
                />
              </a>
              
              {/* ORCID - Always present */}
              <a 
                href={person.orcid || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 hover:bg-green-100 rounded-full transition-colors group/icon"
                title="ORCID"
              >
                <img 
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/orcid.svg" 
                  alt="ORCID"
                  className="h-4 w-4" 
                  style={{filter: 'invert(0.2) sepia(1) saturate(5) hue-rotate(90deg) brightness(0.8)'}}
                />
              </a>
              
              {/* LinkedIn - Always present */}
              <a 
                href={person.linkedin || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 hover:bg-blue-100 rounded-full transition-colors group/icon"
                title="LinkedIn"
              >
                <img 
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg" 
                  alt="LinkedIn"
                  className="h-4 w-4" 
                  style={{filter: 'invert(0.2) sepia(1) saturate(5) hue-rotate(200deg) brightness(0.8)'}}
                />
              </a>
              
              {/* GitHub - Always present */}
              <a 
                href={person.github || '#'}
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
              
              {/* IEEE - Always present, adjusted layout */}
              <a 
                href={person.ieee || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-gray-100 hover:bg-indigo-100 rounded-full transition-colors group/icon"
                title="IEEE Xplore"
              >
                <img 
                  src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/ieee.svg" 
                  alt="IEEE"
                  className="h-4 w-4" 
                  style={{filter: 'invert(0.2) sepia(1) saturate(5) hue-rotate(220deg) brightness(0.8)'}}
                />
              </a>
            </div>

            {/* Know More Button */}
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

  const EmptySection = ({ sectionName }) => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <Mail className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        No Members Found in this Category
      </h3>
      <p className="text-gray-600 mb-6 max-w-md">
        We are seeking members for our {sectionName.toLowerCase()} team. 
        Join us to contribute to cutting-edge research in sustainable energy and smart grid technologies.
      </p>
      <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700">
        <a href="mailto:sesg@bracu.ac.bd" className="flex items-center">
          Express Interest <Mail className="ml-2 h-5 w-5" />
        </a>
      </Button>
    </div>
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
          
          {/* Authentication Status */}
          {isAuthenticated && (
            <div className="mt-6 inline-flex items-center space-x-2 bg-emerald-600/20 text-emerald-300 px-4 py-2 rounded-full border border-emerald-500/30">
              <Shield className="h-4 w-4" />
              <span className="text-sm font-medium">Admin Mode Active</span>
            </div>
          )}
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

        {/* Add New Member Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={handleAddPerson}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg flex items-center space-x-2 shadow-lg hover:shadow-xl transition-all duration-300"
            title={isAuthenticated ? "Add New Member" : "Authentication Required"}
          >
            <UserPlus className="h-5 w-5" />
            <span>Add New {getSectionTitle(activeSection).slice(0, -1)}</span>
            {!isAuthenticated && <Shield className="h-4 w-4 ml-1" />}
          </Button>
        </div>

        {/* Section Content */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            {getSectionTitle(activeSection)}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getSectionData(activeSection).length > 0 ? (
              getSectionData(activeSection).map((person) => (
                <PersonCard key={person.id} person={person} category={activeSection} />
              ))
            ) : (
              <EmptySection sectionName={getSectionTitle(activeSection)} />
            )}
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

      {/* Edit Modal */}
      <EditPersonModal
        person={editingPerson}
        category={editingCategory}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={handleCloseAuthModal}
        onSuccess={handleAuthSuccess}
        title="Authentication Required"
      />

      {/* Add Person Modal */}
      <AddPersonModal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        category={activeSection === 'team-members' ? 'teamMembers' : activeSection}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        person={deletingPerson}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default People;