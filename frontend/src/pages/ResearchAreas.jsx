import React from "react";
import { Zap, Sun, Battery, Brain, Leaf, Shield, FileText, Folder } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { researchAreas } from "../mock/data";

const ResearchAreas = () => {
  const iconMap = {
    Zap: Zap,
    Sun: Sun,
    Battery: Battery,
    Brain: Brain,
    Leaf: Leaf,
    Shield: Shield
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Research Areas</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our multidisciplinary research spans across smart grid technologies, renewable energy systems, 
            and AI-driven energy solutions to create a sustainable future.
          </p>
        </div>

        {/* Research Areas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {researchAreas.map((area) => {
            const IconComponent = iconMap[area.icon];
            return (
              <Card key={area.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md hover:scale-105">
                <CardContent className="p-8">
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
        <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-900 text-white rounded-2xl p-8">
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
      </div>
    </div>
  );
};

export default ResearchAreas;