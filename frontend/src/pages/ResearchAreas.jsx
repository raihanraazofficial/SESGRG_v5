import React, { useState } from "react";
import { Lightbulb, Zap, Battery, Shield, Cpu, Network, Leaf, ArrowRight, Folder, FileText, Sun, Brain, ExternalLink, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { researchAreas } from "../mock/data";

const ResearchAreas = () => {
  const [selectedArea, setSelectedArea] = useState(null);

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

  const openDetailedPage = (area) => {
    const detailHtml = `
      <div class="min-h-screen bg-gray-50">
        <!-- Banner Section -->
        <div class="relative h-64 bg-gradient-to-r from-emerald-900 via-emerald-800 to-emerald-900 text-white">
          <div class="absolute inset-0 bg-black/20"></div>
          <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
            <div>
              <h1 class="text-4xl md:text-5xl font-bold mb-4">${area.title}</h1>
              <p class="text-xl text-emerald-100 max-w-3xl">${area.description}</p>
            </div>
          </div>
        </div>

        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <!-- Overview Section -->
          <section class="mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Overview</h2>
            <div class="bg-white rounded-2xl p-8 shadow-lg">
              <p class="text-lg text-gray-700 leading-relaxed">${area.overview}</p>
            </div>
          </section>

          <!-- Objectives Section -->
          <section class="mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Research Objectives</h2>
            <div class="bg-white rounded-2xl p-8 shadow-lg">
              <ul class="space-y-4">
                ${area.objectives.map(obj => `
                  <li class="flex items-start">
                    <div class="w-2 h-2 bg-emerald-500 rounded-full mt-3 mr-4 flex-shrink-0"></div>
                    <span class="text-gray-700 text-lg">${obj}</span>
                  </li>
                `).join('')}
              </ul>
            </div>
          </section>

          <!-- Applications Section -->
          <section class="mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Key Applications</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              ${area.applications.map(app => `
                <div class="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div class="flex items-center">
                    <div class="w-3 h-3 bg-emerald-500 rounded-full mr-3"></div>
                    <span class="text-gray-800 font-medium text-lg">${app}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </section>

          <!-- Statistics Section -->
          <section class="mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Research Output</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white">
                <div class="text-center">
                  <div class="text-5xl font-bold mb-2">${area.projects}</div>
                  <div class="text-emerald-100 text-lg">Active Projects</div>
                </div>
              </div>
              <div class="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
                <div class="text-center">
                  <div class="text-5xl font-bold mb-2">${area.publications}</div>
                  <div class="text-blue-100 text-lg">Published Papers</div>
                </div>
              </div>
            </div>
          </section>

          <!-- Related Publications & Projects -->
          <section class="mb-12">
            <h2 class="text-3xl font-bold text-gray-900 mb-6">Related Publications & Projects</h2>
            <div class="bg-white rounded-2xl p-8 shadow-lg">
              <p class="text-gray-600 mb-6">
                Explore our latest research publications and ongoing projects in ${area.title.toLowerCase()}.
              </p>
              <div class="flex flex-col sm:flex-row gap-4">
                <a href="/publications" class="inline-flex items-center justify-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition-colors">
                  View Publications
                  <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
                <a href="/projects" class="inline-flex items-center justify-center px-6 py-3 border border-emerald-600 rounded-lg shadow-sm text-base font-medium text-emerald-600 bg-white hover:bg-emerald-50 transition-colors">
                  View Projects
                  <svg class="ml-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </div>
            </div>
          </section>

          <!-- Back Button -->
          <div class="text-center">
            <button onclick="window.history.back()" class="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              Back to Research Areas
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
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