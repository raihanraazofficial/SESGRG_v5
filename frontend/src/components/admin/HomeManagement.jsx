import React, { useState } from 'react';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Home, 
  FileText, 
  Image, 
  Target,
  ArrowUp,
  ArrowDown,
  Layers,
  Settings
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useHome } from '../../contexts/HomeContext';
import { useResearchAreas } from '../../contexts/ResearchAreasContext';
import { useFooter } from '../../contexts/FooterContext';

// Import modals
import EditAboutUsModal from '../home/EditAboutUsModal';
import CarouselImageModal from '../home/CarouselImageModal';
import ObjectiveModal from '../home/ObjectiveModal';
import ResearchAreaModal from '../home/ResearchAreaModal';

const HomeManagement = () => {
  const [activeSection, setActiveSection] = useState('about-us');
  
  // Modal states
  const [isAboutUsModalOpen, setIsAboutUsModalOpen] = useState(false);
  const [isCarouselModalOpen, setIsCarouselModalOpen] = useState(false);
  const [isObjectiveModalOpen, setIsObjectiveModalOpen] = useState(false);
  const [isResearchAreaModalOpen, setIsResearchAreaModalOpen] = useState(false);
  
  // Edit states
  const [editingItem, setEditingItem] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [modalMode, setModalMode] = useState('add');

  // Home context
  const {
    aboutUs,
    carouselImages,
    objectives,
    updateAboutUs,
    addCarouselImage,
    updateCarouselImage,
    deleteCarouselImage,
    addObjective,
    updateObjective,
    deleteObjective
  } = useHome();

  // Research areas context  
  const {
    researchAreas,
    addResearchArea,
    updateResearchArea,
    deleteResearchArea
  } = useResearchAreas();

  // Section tabs
  const sections = [
    {
      id: 'about-us',
      label: 'About Us',
      icon: FileText,
      count: 1
    },
    {
      id: 'carousel',
      label: 'Photo Carousel',
      icon: Image,
      count: carouselImages?.length || 0
    },
    {
      id: 'objectives',
      label: 'Our Objectives',
      icon: Target,
      count: objectives?.length || 0
    },
    {
      id: 'research-areas',
      label: 'Research Areas',
      icon: Layers,
      count: researchAreas?.length || 0
    }
  ];

  // Handle About Us edit
  const handleEditAboutUs = () => {
    setIsAboutUsModalOpen(true);
  };

  // Handle carousel operations
  const handleAddCarouselImage = () => {
    setModalMode('add');
    setEditingItem(null);
    setIsCarouselModalOpen(true);
  };

  const handleEditCarouselImage = (image) => {
    setModalMode('edit');
    setEditingItem(image);
    setIsCarouselModalOpen(true);
  };

  const handleDeleteCarouselImage = (imageId) => {
    if (carouselImages.length <= 2) {
      alert('Cannot delete image. Minimum 2 images required in carousel.');
      return;
    }
    
    if (confirm('Are you sure you want to delete this carousel image?')) {
      const result = deleteCarouselImage(imageId);
      if (result.success) {
        alert('Carousel image deleted successfully!');
      } else {
        alert(result.error || 'Failed to delete carousel image');
      }
    }
  };

  // Handle objectives operations
  const handleAddObjective = () => {
    setModalMode('add');
    setEditingItem(null);
    setEditingIndex(null);
    setIsObjectiveModalOpen(true);
  };

  const handleEditObjective = (objective, index) => {
    setModalMode('edit');
    setEditingItem(objective);
    setEditingIndex(index);
    setIsObjectiveModalOpen(true);
  };

  const handleDeleteObjective = (index) => {
    if (confirm('Are you sure you want to delete this objective?')) {
      const result = deleteObjective(index);
      if (result.success) {
        alert('Objective deleted successfully!');
      } else {
        alert(result.error || 'Failed to delete objective');
      }
    }
  };

  // Handle research areas operations
  const handleAddResearchArea = () => {
    setModalMode('add');
    setEditingItem(null);
    setIsResearchAreaModalOpen(true);
  };

  const handleEditResearchArea = (area) => {
    setModalMode('edit');
    setEditingItem(area);
    setIsResearchAreaModalOpen(true);
  };

  const handleDeleteResearchArea = (areaId) => {
    if (confirm('Are you sure you want to delete this research area?')) {
      const result = deleteResearchArea(areaId);
      if (result.success) {
        alert('Research area deleted successfully!');
      } else {
        alert(result.error || 'Failed to delete research area');
      }
    }
  };

  // Render section content
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'about-us':
        return (
          <div className="space-y-6">
            <Card className="border border-gray-200">
              <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-indigo-50">
                <CardTitle className="flex items-center justify-between text-lg font-semibold text-gray-800">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    About Us Section
                  </div>
                  <Button
                    onClick={handleEditAboutUs}
                    className="bg-blue-600 hover:bg-blue-700"
                    size="sm"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Title:</label>
                    <p className="text-gray-900 font-semibold">{aboutUs.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Content:</label>
                    <p className="text-gray-700 text-sm leading-relaxed line-clamp-4">
                      {aboutUs.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'carousel':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Photo Carousel Management</h3>
              <Button
                onClick={handleAddCarouselImage}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {carouselImages.map((image, index) => (
                <Card key={image.id} className="border border-gray-200">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                      #{index + 1}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <p className="font-medium text-sm line-clamp-1">{image.alt}</p>
                      <p className="text-xs text-gray-600 line-clamp-2">{image.caption}</p>
                      {image.link && (
                        <p className="text-xs text-blue-600 line-clamp-1">
                          Link: {image.link}
                        </p>
                      )}
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button
                        onClick={() => handleEditCarouselImage(image)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteCarouselImage(image.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        disabled={carouselImages.length <= 2}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {carouselImages.length < 2 && (
              <div className="text-center py-8 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-yellow-800">
                  ⚠️ Warning: Minimum 2 carousel images required. Currently: {carouselImages.length}
                </p>
              </div>
            )}
          </div>
        );

      case 'objectives':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Our Objectives Management</h3>
              <Button
                onClick={handleAddObjective}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Objective
              </Button>
            </div>
            
            <div className="space-y-4">
              {objectives.map((objective, index) => (
                <Card key={index} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-emerald-600 font-semibold text-sm">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {objective}
                          </p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEditObjective(objective, index)}
                          variant="outline"
                          size="sm"
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteObjective(index)}
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {objectives.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No objectives added yet. Click "Add Objective" to get started.</p>
              </div>
            )}
          </div>
        );

      case 'research-areas':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Research Areas Management</h3>
              <Button
                onClick={handleAddResearchArea}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Research Area
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {researchAreas.map((area) => (
                <Card key={area.id} className="border border-gray-200">
                  <div className="relative">
                    {area.image && (
                      <div className="h-32 overflow-hidden">
                        <img 
                          src={area.image}
                          alt={area.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                      Area #{area.areaNumber}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="space-y-2">
                      <h4 className="font-semibold text-sm line-clamp-2">{area.title}</h4>
                      <p className="text-xs text-gray-600 line-clamp-3">{area.description}</p>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                      <Button
                        onClick={() => handleEditResearchArea(area)}
                        variant="outline"
                        size="sm"
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteResearchArea(area.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {researchAreas.length === 0 && (
              <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                <Layers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No research areas added yet. Click "Add Research Area" to get started.</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 admin-content-management">
      {/* Section Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4">
        {sections.map((section) => (
          <Button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            variant={activeSection === section.id ? "default" : "outline"}
            className={`flex items-center space-x-2 ${
              activeSection === section.id 
                ? 'bg-emerald-600 hover:bg-emerald-700' 
                : 'hover:bg-emerald-50'
            }`}
          >
            <section.icon className="h-4 w-4" />
            <span>{section.label}</span>
            {section.count !== null && (
              <span className={`px-2 py-1 text-xs rounded-full ${
                activeSection === section.id 
                  ? 'bg-emerald-700 text-white' 
                  : 'bg-gray-200 text-gray-700'
              }`}>
                {section.count}
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Section Content */}
      <div className="admin-modal-scrollable">
        {renderSectionContent()}
      </div>

      {/* Modals */}
      <EditAboutUsModal
        isOpen={isAboutUsModalOpen}
        onClose={() => setIsAboutUsModalOpen(false)}
        aboutUs={aboutUs}
        onUpdate={updateAboutUs}
      />

      <CarouselImageModal
        isOpen={isCarouselModalOpen}
        onClose={() => setIsCarouselModalOpen(false)}
        image={editingItem}
        onSave={modalMode === 'add' ? addCarouselImage : (data) => updateCarouselImage(editingItem.id, data)}
        mode={modalMode}
      />

      <ObjectiveModal
        isOpen={isObjectiveModalOpen}
        onClose={() => setIsObjectiveModalOpen(false)}
        objective={editingItem}
        index={editingIndex}
        onSave={modalMode === 'add' ? addObjective : updateObjective}
        mode={modalMode}
      />

      <ResearchAreaModal
        isOpen={isResearchAreaModalOpen}
        onClose={() => setIsResearchAreaModalOpen(false)}
        area={editingItem}
        onSave={modalMode === 'add' ? addResearchArea : updateResearchArea}
        mode={modalMode}
      />
    </div>
  );
};

export default HomeManagement;