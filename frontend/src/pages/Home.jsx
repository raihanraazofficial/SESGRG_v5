import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, BookOpen, Lightbulb, Award, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}>
          </div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Lab Sustainable Energy &<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
                Smart Grid Research
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Pioneering the future of energy through innovative research in smart grids, 
              renewable integration, and AI-powered energy systems.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3">
                <Link to="/research" className="flex items-center">
                  Explore Research <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3">
                <Link to="/people" className="flex items-center">
                  Meet Our Team <Users className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const IconComponent = stat.icon;
              return (
                <div key={index} className="text-center space-y-3">
                  <div className={`inline-flex p-4 rounded-full bg-gray-50 ${stat.color}`}>
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-gray-600 font-medium">{stat.label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Research Highlights */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Research Highlights
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover our cutting-edge research areas that are shaping the future of sustainable energy systems.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 group-hover:text-emerald-600 transition-colors">
                    {highlight.title}
                  </h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {highlight.description}
                  </p>
                  <Link 
                    to={highlight.link}
                    className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-medium group-hover:translate-x-1 transition-all"
                  >
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Latest News & Events
              </h2>
              <p className="text-xl text-gray-600">
                Stay updated with our recent achievements and upcoming events.
              </p>
            </div>
            <Link 
              to="/news"
              className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center"
            >
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "International Smart Grid Symposium 2024",
                date: "Nov 15, 2024",
                type: "Event",
                excerpt: "Successfully hosted symposium with 200+ participants from 25 countries."
              },
              {
                title: "New Tesla Energy Partnership",
                date: "Oct 28, 2024", 
                type: "News",
                excerpt: "Strategic collaboration for next-generation battery management systems."
              },
              {
                title: "PhD Defense Success",
                date: "Oct 10, 2024",
                type: "Achievement", 
                excerpt: "Alex Thompson defended thesis on ML approaches for energy forecasting."
              }
            ].map((news, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      news.type === 'Event' ? 'bg-blue-100 text-blue-700' :
                      news.type === 'News' ? 'bg-emerald-100 text-emerald-700' :
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {news.type}
                    </span>
                    <span className="text-sm text-gray-500">{news.date}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {news.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {news.excerpt}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;