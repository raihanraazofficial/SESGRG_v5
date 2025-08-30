import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Users, BookOpen, Lightbulb, Award } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";

const Home = () => {
  const stats = [
    { icon: Users, label: "Research Team", value: "15+", color: "text-blue-600" },
    { icon: BookOpen, label: "Publications", value: "80+", color: "text-emerald-600" },
    { icon: Lightbulb, label: "Active Projects", value: "12", color: "text-amber-600" },
    { icon: Award, label: "Awards", value: "25+", color: "text-purple-600" }
  ];

  const highlights = [
    {
      title: "Smart Grid Innovation",
      description: "Developing next-generation intelligent grid systems for improved reliability and efficiency.",
      link: "/research"
    },
    {
      title: "Renewable Integration",
      description: "Seamless integration of renewable energy sources into existing infrastructure.",
      link: "/projects"
    },
    {
      title: "AI-Powered Solutions",
      description: "Machine learning applications for energy forecasting and optimization.",
      link: "/publications"
    }
  ];

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