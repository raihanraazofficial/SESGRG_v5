import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, BookOpen, Lightbulb, Award, ChevronLeft, ChevronRight, CheckCircle, RefreshCw } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useNewsEvents } from "../contexts/NewsEventsContext";
import { useGallery } from "../contexts/GalleryContext";
import googleSheetsService from "../services/googleSheetsApi";

// Latest News Section Component
const LatestNewsSection = () => {
  const { newsEventsData, loading, getPaginatedNewsEvents } = useNewsEvents();
  const [latestNews, setLatestNews] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Load latest news from localStorage context
    if (newsEventsData.length > 0 || !loading) {
      const result = getPaginatedNewsEvents({
        page: 1,
        per_page: 8,
        sort_by: 'date',
        sort_order: 'desc'
      });
      setLatestNews(result.news_events || []);
      console.log('✅ Homepage: Latest news loaded from localStorage:', result.news_events?.length || 0, 'items');
    }
  }, [newsEventsData, loading, getPaginatedNewsEvents]);

  const fetchLatestNews = async (forceRefresh = false) => {
    try {
      setError(null);
      
      if (forceRefresh) {
        setRefreshing(true);
        console.log('🔄 Homepage: Force refreshing latest news...');
      }
      
      // For localStorage system, we just re-apply filters
      const result = getPaginatedNewsEvents({
        page: 1,
        per_page: 8,
        sort_by: 'date',
        sort_order: 'desc'
      });
      
      setLatestNews(result.news_events || []);
      console.log('✅ Homepage: Latest news refreshed:', result.news_events?.length || 0, 'items');
      
    } catch (error) {
      console.error('❌ Homepage: Error loading latest news:', error);
      setError('Failed to load latest news. Please try refreshing the page.');
      setLatestNews([]);
    } finally {
      setRefreshing(false);
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Events':
        return 'bg-blue-100 text-blue-700';
      case 'News':
        return 'bg-emerald-100 text-emerald-700';
      case 'Upcoming Events':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Latest News & Events
            </h2>
            <p className="text-xl text-gray-600">
              Stay updated with our recent achievements, news, events, and upcoming activities.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                console.log('🔄 Manual Refresh clicked - Force refreshing...');
                fetchLatestNews(true);
              }}
              disabled={refreshing}
              className="flex items-center space-x-2"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </Button>
            <Link 
              to="/news"
              className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center text-lg"
            >
              View All <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="space-y-8">
            {/* Featured Story Skeleton */}
            <Card className="border-0 shadow-lg overflow-hidden animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                <div className="h-64 lg:h-80 bg-gray-200"></div>
                <div className="p-8 space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div className="h-10 w-32 bg-gray-200 rounded"></div>
                </div>
              </div>
            </Card>
            
            {/* Smaller Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <Card key={index} className="border-0 shadow-md animate-pulse">
                  <div className="p-6 space-y-3">
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                    <div className="h-6 bg-gray-200 rounded"></div>
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-4/5"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/5"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <BookOpen className="h-16 w-16 text-red-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-red-600 mb-2">Loading Error</h3>
              <p className="text-gray-500 mb-4">{error}</p>
            </div>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => fetchLatestNews(true)}
                disabled={refreshing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Try Again
              </Button>
              <Link to="/news">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Visit News Page <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : latestNews.length === 0 && !loading ? (
          <div className="text-center py-16">
            <div className="mb-6">
              <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Recent News</h3>
              <p className="text-gray-500">
                No recent news or events are available at the moment. Please check back later.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={() => fetchLatestNews(true)}
                disabled={refreshing}
                className="flex items-center space-x-2"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
                Try Again
              </Button>
              <Link to="/news">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Visit News Page <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Featured Story Card */}
            {latestNews.length > 0 && (
              <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                  <div 
                    className="h-64 lg:h-80 bg-cover bg-center relative"
                    style={{
                      backgroundImage: `url('https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxuZXdzJTIwZXZlbnR8ZW58MHx8fHwxNzU2NjU0MjE4fDA&ixlib=rb-4.1.0&q=85')`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-full">
                        Featured Story
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(latestNews[0].category)}`}>
                        {latestNews[0].category}
                      </span>
                      <span className="text-sm text-gray-500">
                        {formatDate(latestNews[0].date)}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4 hover:text-emerald-600 transition-colors">
                      {latestNews[0].title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {latestNews[0].short_description || latestNews[0].description}
                    </p>
                    <Button 
                      variant="outline" 
                      className="self-start border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                    >
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardContent>
                </div>
              </Card>
            )}

            {/* Smaller News Cards */}
            {latestNews.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {latestNews.slice(1, 8).map((news, index) => (
                  <Card key={news.id || `news-${index}-${news.title?.slice(0,10)}`} className="hover:shadow-lg transition-all duration-300 border-0 shadow-md group">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(news.category)}`}>
                          {news.category}
                        </span>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                        {news.title}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">{formatDate(news.date)}</p>
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {news.short_description || news.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [animatedObjectives, setAnimatedObjectives] = useState(new Set());

  // Carousel images
  const carouselImages = [
    {
      url: "https://images.unsplash.com/photo-1632103996718-4a47cf68b75e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85",
      alt: "Wind turbine in desert landscape"
    },
    {
      url: "https://images.unsplash.com/photo-1466611653911-95081537e5b7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxzdXN0YWluYWJsZSUyMGVuZXJneXxlbnwwfHx8fDE3NTY1MzUxNTJ8MA&ixlib=rb-4.1.0&q=85",
      alt: "Wind farm at golden hour"
    },
    {
      url: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHwyfHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85",
      alt: "Solar panel farm aerial view"
    },
    {
      url: "https://images.unsplash.com/photo-1467533003447-e295ff1b0435?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzV8MHwxfHNlYXJjaHw0fHxyZW5ld2FibGV8ZW58MHx8fHwxNzU2NTM1MTY0fDA&ixlib=rb-4.1.0&q=85",
      alt: "Modern wind turbines"
    },
    {
      url: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzR8MHwxfHNlYXJjaHwxfHxzbWFydCUyMGdyaWR8ZW58MHx8fHwxNzU2NTM1MTU3fDA&ixlib=rb-4.1.0&q=85",
      alt: "Power transmission infrastructure"
    }
  ];

  // 7 Objectives as per specifications
  const objectives = [
    "Advance smart grid technologies for enhanced energy distribution efficiency",
    "Integrate renewable energy sources into existing power infrastructure",
    "Develop AI-powered solutions for energy forecasting and optimization",
    "Enhance cybersecurity measures for power grid protection",
    "Create sustainable microgrids for distributed energy systems",
    "Research energy storage systems for improved grid stability",
    "Foster interdisciplinary collaboration in sustainable energy research"
  ];

  // Research Areas
  const researchAreas = [
    {
      title: "Smart Grid Technologies",
      description: "Next-generation intelligent grid systems for improved reliability and efficiency.",
      image: carouselImages[0].url
    },
    {
      title: "Microgrids & Distributed Energy Systems", 
      description: "Localized energy grids that can operate independently or with traditional grids.",
      image: carouselImages[1].url
    },
    {
      title: "Renewable Energy Integration",
      description: "Seamless integration of solar, wind, and other renewable sources.",
      image: carouselImages[2].url
    },
    {
      title: "Grid Optimization & Stability",
      description: "Advanced algorithms for power system optimization and stability analysis.",
      image: carouselImages[3].url
    },
    {
      title: "Energy Storage Systems",
      description: "Battery management and energy storage solutions for grid applications.",
      image: carouselImages[4].url
    },
    {
      title: "Power System Automation",
      description: "Automated control systems for modern power grid operations.",
      image: carouselImages[0].url
    },
    {
      title: "Cybersecurity and AI for Power Infrastructure",
      description: "Advanced AI-driven cybersecurity solutions protecting critical power infrastructure from emerging threats.",
      image: carouselImages[1].url
    }
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [carouselImages.length]);

  // Animation on scroll
  useEffect(() => {
    setIsVisible(true);
    
    const observerOptions = {
      threshold: 0.6,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const objectiveIndex = parseInt(entry.target.dataset.objectiveIndex);
          if (objectiveIndex !== undefined) {
            setTimeout(() => {
              setAnimatedObjectives(prev => new Set([...prev, objectiveIndex]));
            }, objectiveIndex * 200);
          }
        }
      });
    }, observerOptions);

    // Observe objective elements
    setTimeout(() => {
      const objectiveElements = document.querySelectorAll('[data-objective-index]');
      objectiveElements.forEach(el => observer.observe(el));
    }, 100);

    return () => observer.disconnect();
  }, []);

  const scrollToResearch = () => {
    const researchSection = document.getElementById('research-areas');
    researchSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className={`transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                <span className="inline-block animate-pulse">Sustainable Energy &</span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 animate-bounce">
                  Smart Grid Research
                </span>
              </h1>
            </div>
            
            <div className={`transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <p className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed animate-fade-in">
                Pioneering Research in Clean Energy, Renewable Integration, and Next-Generation Smart Grid Systems.
              </p>
            </div>
            
            <div className={`flex flex-col sm:flex-row gap-6 justify-center transition-all duration-1000 delay-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <Button 
                size="lg" 
                onClick={scrollToResearch}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg hover:scale-105 transition-all duration-300"
              >
                Explore Research <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 text-lg hover:scale-105 transition-all duration-300"
              >
                <Link to="/people" className="flex items-center">
                  Meet Our Team <Users className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 animate-fade-in">About Us</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed text-justify">
              The Sustainable Energy and Smart Grid Research at BRAC University is dedicated to advancing 
              cutting-edge research in renewable energy systems, smart grid technologies, and sustainable power 
              infrastructure. Our interdisciplinary team works to address the global energy challenges through 
              innovative solutions and collaborative research.
            </p>
          </div>

          {/* Our Objectives & Research in Action - Vertically Centered Layout */}
          <div className="mb-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Image Carousel - Left Side with Vertical Center Alignment */}
              <div className="flex flex-col justify-center">
                <div className="relative">
                  <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                    {carouselImages.map((image, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                          index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                        }`}
                      >
                        <img 
                          src={image.url}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                        <div className="absolute bottom-6 left-6 text-white">
                          <p className="text-lg font-semibold">{image.alt}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Carousel Navigation */}
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-200"
                  >
                    <ChevronLeft className="h-6 w-6 text-white" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex((prev) => (prev + 1) % carouselImages.length)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 rounded-full p-3 transition-all duration-200"
                  >
                    <ChevronRight className="h-6 w-6 text-white" />
                  </button>

                  {/* Carousel Indicators */}
                  <div className="flex justify-center mt-6 space-x-2">
                    {carouselImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentImageIndex 
                            ? 'bg-emerald-600 scale-125' 
                            : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Objectives - Right Side */}
              <div className="flex flex-col justify-center">
                <h3 className="text-3xl font-bold text-gray-900 mb-12 text-center">Our Objectives</h3>
                <div className="space-y-8">
                  {objectives.map((objective, index) => (
                    <div 
                      key={index}
                      data-objective-index={index}
                      className="group"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`relative flex-shrink-0 w-12 h-12 rounded-full border-3 border-emerald-500 flex items-center justify-center transition-all duration-500 ${
                          animatedObjectives.has(index) 
                            ? 'bg-emerald-500 scale-110' 
                            : 'bg-white'
                        }`}>
                          <span className={`text-lg font-bold transition-colors duration-500 ${
                            animatedObjectives.has(index) ? 'text-white' : 'text-emerald-500'
                          }`}>
                            {index + 1}
                          </span>
                          {animatedObjectives.has(index) && (
                            <CheckCircle className="absolute -top-1 -right-1 h-5 w-5 text-emerald-600 animate-ping" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="text-lg text-gray-700 group-hover:text-emerald-600 transition-colors duration-300 leading-relaxed">
                            {objective}
                          </p>
                          <div className={`mt-2 h-0.5 bg-gradient-to-r from-emerald-400 to-transparent transition-all duration-500 ${
                            animatedObjectives.has(index) ? 'w-full opacity-100' : 'w-0 opacity-0'
                          }`}></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Research Areas Section */}
      <section id="research-areas" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Research Areas
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto">
              Explore our comprehensive research domains that are driving innovation in sustainable energy and smart grid technologies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {researchAreas.map((area, index) => (
              <Card key={index} className={`group hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden ${
                index === researchAreas.length - 1 && researchAreas.length % 3 !== 0 
                  ? 'md:col-span-2 lg:col-span-1 lg:col-start-2' 
                  : ''
              }`}>
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={area.image}
                    alt={area.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-bold">{area.title}</h3>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600 leading-relaxed mb-4">
                    {area.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button 
              size="lg" 
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3"
            >
              <Link to="/research" className="flex items-center">
                Know More <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest News & Events Section */}
      <LatestNewsSection />

// Photo Gallery Section Component  
const PhotoGallerySection = () => {
  const { galleryItems } = useGallery();
  
  // Get first 12 gallery items for the scrolling section
  const galleryPhotos = galleryItems.slice(0, 12);
  
  // Duplicate for continuous scroll effect
  const scrollingPhotos = [...galleryPhotos, ...galleryPhotos.slice(0, 6)];

  return (
    <section className="py-20 bg-gray-50 performance-optimized">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Photo Gallery</h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Glimpses of our research activities, laboratory work, and sustainable energy installations.
          </p>
        </div>

        {/* ULTRA-SMOOTH Right-to-Left Scrolling Gallery with GPU Acceleration */}
        <div className="gallery-container relative overflow-hidden">
          <div className="flex animate-scroll-right space-x-8 whitespace-nowrap performance-optimized">
            {scrollingPhotos.map((photo, index) => (
              <div key={`${photo.id}-${index}`} className="flex-shrink-0 w-80 group cursor-pointer inline-block performance-optimized">
                <Card className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden transform hover:scale-105 will-change-transform performance-optimized">
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 lazy-image performance-optimized"
                      loading="lazy"
                      decoding="async"
                      fetchpriority={index < 3 ? "high" : "low"}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/90 text-gray-800">
                        {photo.category}
                      </span>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4 text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300 opacity-0 group-hover:opacity-100">
                      <p className="text-sm font-semibold">{photo.caption}</p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/gallery">
            <Button 
              size="lg" 
              variant="outline"
              className="border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white px-8 py-3"
            >
              View All Photos <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
    </div>
  );
};

export default Home;