import React, { useState, useEffect, useMemo } from "react";
import { Lightbulb, Zap, Battery, Shield, Cpu, Network, Leaf, ArrowRight, Folder, FileText, Sun, Brain, ExternalLink, ArrowLeft, Users, BookOpen, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { researchAreas } from "../mock/data";
import googleSheetsService from "../services/googleSheetsApi";

const ResearchAreas = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [realTimeData, setRealTimeData] = useState({
    projects: [],
    publications: [],
    loading: false,
    lastUpdated: null
  });
  const [peopleData, setPeopleData] = useState([]);

  const iconMap = {
    Lightbulb: Lightbulb,
    Zap: Zap,
    Battery: Battery,
    Shield: Shield,
    Cpu: Cpu,
    Network: Network,
    Leaf: Leaf,
    Sun: Sun,
    Brain: Brain
  };

  const getAreaImage = (areaId) => {
    const imageMap = {
      1: "https://images.unsplash.com/photo-1715605569717-494ac7c5656a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHwzfHxzbWFydCUyMGdyaWQlMjB0ZWNobm9sb2d5fGVufDB8fHx8MTc1NjY2Njg3Mnww&ixlib=rb-4.1.0&q=85", // Smart Grid Technologies
      2: "https://images.unsplash.com/photo-1740240859880-7dcf28028122?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzF8MHwxfHNlYXJjaHw0fHxzbWFydCUyMGdyaWQlMjB0ZWNobm9sb2d5fGVufDB8fHx8MTc1NjY2Njg3Mnww&ixlib=rb-4.1.0&q=85", // Microgrids & Distributed Energy Systems
      3: "https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwxfHxyZW5ld2FibGUlMjBlbmVyZ3l8ZW58MHx8fHwxNzU2NjY2ODc4fDA&ixlib=rb-4.1.0&q=85", // Renewable Energy Integration
      4: "https://images.unsplash.com/photo-1696197302705-7c2cc6a7e8ac?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzh8MHwxfHNlYXJjaHwxfHxwb3dlciUyMHN5c3RlbXN8ZW58MHx8fHwxNzU2NjY2ODgyfDA&ixlib=rb-4.1.0&q=85", // Grid Optimization & Stability
      5: "https://images.unsplash.com/photo-1548337138-e87d889cc369?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwyfHxyZW5ld2FibGUlMjBlbmVyZ3l8ZW58MHx8fHwxNzU2NjY2ODc4fDA&ixlib=rb-4.1.0&q=85", // Energy Storage Systems
      6: "https://images.unsplash.com/photo-1508791290064-c27cc1ef7a9a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwzfHxyZW5ld2FibGUlMjBlbmVyZ3l8ZW58MHx8fHwxNzU2NjY2ODc4fDA&ixlib=rb-4.1.0&q=85", // Power System Automation
      7: "https://images.pexels.com/photos/9799996/pexels-photo-9799996.jpeg" // Cybersecurity and AI for Power Infrastructure
    };
    return imageMap[areaId] || imageMap[1];
  };

  const openDetailedPage = (area) => {
    const areaImage = getAreaImage(area.id);
    const detailHtml = `
      <div class="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <!-- Enhanced Banner Section with Background Image -->
        <div class="relative h-96 overflow-hidden">
          <div class="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-slate-800/80 to-emerald-900/90"></div>
          <img 
            src="${areaImage}" 
            alt="${area.title}" 
            class="absolute inset-0 w-full h-full object-cover"
            style="z-index: -1;"
          />
          <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div class="text-white max-w-4xl">
              <div class="flex items-center mb-4">
                <div class="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mr-4">
                  <span class="text-2xl text-white">⚡</span>
                </div>
                <div>
                  <h1 class="text-5xl md:text-6xl font-bold mb-2">${area.title}</h1>
                  <div class="flex items-center space-x-6 text-emerald-200">
                    <span class="flex items-center"><i class="fas fa-project-diagram mr-2"></i>${area.projects} Active Projects</span>
                    <span class="flex items-center"><i class="fas fa-file-alt mr-2"></i>${area.publications} Publications</span>
                  </div>
                </div>
              </div>
              <p class="text-xl text-gray-200 max-w-3xl leading-relaxed">${area.description}</p>
            </div>
          </div>
          <!-- Decorative elements -->
          <div class="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-50 to-transparent"></div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <!-- Enhanced Overview Section -->
          <section class="mb-16">
            <div class="text-center mb-12">
              <h2 class="text-4xl font-bold text-gray-900 mb-4">Research Overview</h2>
              <div class="w-24 h-1 bg-gradient-to-r from-emerald-500 to-teal-500 mx-auto rounded-full"></div>
            </div>
            <div class="bg-white rounded-3xl p-10 shadow-xl border border-gray-100">
              <div class="flex items-start space-x-6">
                <div class="w-16 h-16 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <span class="text-2xl text-emerald-600">🔬</span>
                </div>
                <div>
                  <p class="text-lg text-gray-700 leading-relaxed">${area.overview}</p>
                </div>
              </div>
            </div>
          </section>

          <!-- Enhanced Objectives Section -->
          <section class="mb-16">
            <div class="text-center mb-12">
              <h2 class="text-4xl font-bold text-gray-900 mb-4">Research Objectives</h2>
              <div class="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              ${area.objectives.map((obj, index) => `
                <div class="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow group">
                  <div class="flex items-start space-x-4">
                    <div class="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <span class="text-lg font-bold text-blue-600">${index + 1}</span>
                    </div>
                    <div>
                      <h3 class="font-semibold text-gray-900 mb-2">Objective ${index + 1}</h3>
                      <p class="text-gray-700">${obj}</p>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- Enhanced Applications Section -->
          <section class="mb-16">
            <div class="text-center mb-12">
              <h2 class="text-4xl font-bold text-gray-900 mb-4">Key Applications</h2>
              <div class="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              ${area.applications.map((app, index) => `
                <div class="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-100">
                  <div class="text-center">
                    <div class="w-14 h-14 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <span class="text-2xl">🎯</span>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-2">Application ${index + 1}</h3>
                    <p class="text-gray-700 text-sm">${app}</p>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- Enhanced Statistics Section -->
          <section class="mb-16">
            <div class="text-center mb-12">
              <h2 class="text-4xl font-bold text-gray-900 mb-4">Research Impact</h2>
              <div class="w-24 h-1 bg-gradient-to-r from-green-500 to-emerald-500 mx-auto rounded-full"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-10 text-white relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mt-16 -mr-16"></div>
                <div class="relative">
                  <div class="text-6xl font-bold mb-3">${area.projects}</div>
                  <div class="text-emerald-100 text-xl font-medium">Active Research Projects</div>
                  <div class="mt-4 text-emerald-200">Ongoing innovative research initiatives</div>
                </div>
              </div>
              <div class="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-10 text-white relative overflow-hidden">
                <div class="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mt-16 -mr-16"></div>
                <div class="relative">
                  <div class="text-6xl font-bold mb-3">${area.publications}</div>
                  <div class="text-blue-100 text-xl font-medium">Published Research Papers</div>
                  <div class="mt-4 text-blue-200">Peer-reviewed scientific contributions</div>
                </div>
              </div>
            </div>
          </section>

          <!-- Enhanced Navigation Section -->
          <section class="mb-16">
            <div class="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 rounded-3xl p-10 text-white">
              <div class="text-center mb-8">
                <h2 class="text-3xl font-bold mb-4">Explore Related Research</h2>
                <p class="text-gray-300 max-w-2xl mx-auto">
                  Discover our latest publications, ongoing projects, and collaborative opportunities in ${area.title.toLowerCase()}.
                </p>
              </div>
              <div class="flex flex-col sm:flex-row gap-6 justify-center">
                <a href="/publications" class="inline-flex items-center justify-center px-8 py-4 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-semibold transition-colors group">
                  <span class="mr-3">📚</span>
                  View Publications
                  <svg class="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
                <a href="/projects" class="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors border border-white/20 group">
                  <span class="mr-3">🔬</span>
                  View Projects
                  <svg class="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </div>
            </div>
          </section>

          <!-- Enhanced Back Button -->
          <div class="text-center">
            <button 
              onclick="window.history.back()" 
              class="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-10 py-4 rounded-xl font-semibold transition-all hover:scale-105 shadow-lg"
            >
              ← Back to Research Areas
            </button>
          </div>
        </div>
      </div>
    `;
    
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${area.title} - SESG Research</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
          .animate-float { animation: float 3s ease-in-out infinite; }
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-10px); } }
        </style>
      </head>
      <body class="bg-gray-50">
        ${detailHtml}
      </body>
      </html>
    `);
    newWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Publications Style */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 performance-optimized -mx-4 sm:-mx-6 lg:-mx-8 mb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center mb-6">
              <Link to="/" className="flex items-center text-white hover:text-emerald-400 transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Home
              </Link>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">Research Areas</h1>
            <p className="text-xl text-gray-300 max-w-3xl">
              Our multidisciplinary research spans across smart grid technologies, renewable energy systems, 
              and AI-driven energy solutions to create a sustainable future.
            </p>
          </div>
        </div>

        {/* Research Areas Grid */}
        <div className="py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 [&>*:nth-last-child(1):nth-child(3n+1)]:lg:col-start-2">
            {researchAreas.map((area) => {
              const IconComponent = iconMap[area.icon];
              return (
                <Card key={area.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:scale-105 cursor-pointer">
                  <CardContent className="p-8" onClick={() => openDetailedPage(area)}>
                    <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl mb-6 group-hover:from-emerald-200 group-hover:to-teal-200 transition-all duration-300">
                      <IconComponent className="h-8 w-8 text-emerald-600" />
                    </div>
                    
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                      {area.title}
                    </h3>
                    
                    <p className="text-gray-600 leading-relaxed mb-6">
                      {area.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Folder className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{area.projects} Projects</span>
                        </div>
                        <div className="flex items-center">
                          <FileText className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-600">{area.publications} Papers</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full group-hover:bg-emerald-50 group-hover:border-emerald-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          openDetailedPage(area);
                        }}
                      >
                        Learn More <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Research Impact Section */}
          <section className="bg-white rounded-2xl shadow-lg p-8 mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Research Impact & Applications</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Grid Modernization</h3>
                <p className="text-sm text-gray-600">Upgrading infrastructure for 21st century energy needs</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <Sun className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Clean Energy Transition</h3>
                <p className="text-sm text-gray-600">Accelerating adoption of renewable energy sources</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900">AI-Driven Optimization</h3>
                <p className="text-sm text-gray-600">Intelligent systems for maximum efficiency</p>
              </div>
              
              <div className="text-center space-y-3">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-amber-600" />
                </div>
                <h3 className="font-semibold text-gray-900">Energy Security</h3>
                <p className="text-sm text-gray-600">Protecting critical infrastructure from threats</p>
              </div>
            </div>
          </section>

          {/* Interdisciplinary Approach */}
          <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white rounded-2xl p-8 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-4">Interdisciplinary Approach</h2>
              <p className="text-gray-300 max-w-2xl mx-auto">
                Our research combines expertise from multiple disciplines to tackle complex energy challenges 
                through innovative, holistic solutions.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              {[
                { label: "Electrical Engineering", color: "bg-blue-500/20 text-blue-300" },
                { label: "Computer Science", color: "bg-emerald-500/20 text-emerald-300" },
                { label: "Environmental Science", color: "bg-amber-500/20 text-amber-300" },
                { label: "Policy & Economics", color: "bg-purple-500/20 text-purple-300" }
              ].map((discipline, index) => (
                <div key={index} className={`p-4 rounded-lg ${discipline.color} border border-current/20`}>
                  <p className="font-medium text-sm">{discipline.label}</p>
                </div>
              ))}
            </div>
          </section>

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
      </div>
    </div>
  );
};

export default ResearchAreas;