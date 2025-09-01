import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useGallery } from "../contexts/GalleryContext";

const Gallery = () => {
  const { galleryItems, categories } = useGallery();

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Renewable Energy':
        return 'bg-emerald-100 text-emerald-700';
      case 'Smart Grid':
        return 'bg-blue-100 text-blue-700';
      case 'Research Activities':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50 performance-optimized">
      {/* Header */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 performance-optimized">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link to="/" className="flex items-center text-white hover:text-emerald-400 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Photo Gallery</h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            Explore our comprehensive collection of research activities, laboratory work, renewable energy installations, and smart grid technologies.
          </p>
        </div>
      </div>

      {/* ULTRA-OPTIMIZED Gallery Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="gallery-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {galleryItems.map((photo, index) => (
            <Card key={index} className="group hover:shadow-xl transition-all duration-500 border-0 shadow-lg overflow-hidden performance-optimized">
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={photo.url}
                  alt={photo.caption}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 lazy-image performance-optimized"
                  loading="lazy"
                  decoding="async"
                  fetchpriority={index < 8 ? "high" : "low"}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(photo.category)}`}>
                    {photo.category}
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                  <p className="text-sm font-semibold">{photo.caption}</p>
                </div>
              </div>
            </Card>
          ))}
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

export default Gallery;