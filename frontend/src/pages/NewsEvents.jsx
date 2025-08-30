import React, { useState, useMemo } from "react";
import { Calendar, Clock, Tag, Search } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { newsEvents } from "../mock/data";

const NewsEvents = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const types = ["all", "News", "Event", "Achievement"];

  const filteredNews = useMemo(() => {
    let filtered = newsEvents.filter((item) => {
      const matchesSearch = 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === "all" || item.type === selectedType;
      
      return matchesSearch && matchesType;
    });

    // Sort news items
    filtered.sort((a, b) => {
      if (sortBy === "date") return new Date(b.date) - new Date(a.date);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      return 0;
    });

    return filtered;
  }, [searchTerm, selectedType, sortBy]);

  const getTypeColor = (type) => {
    switch (type) {
      case "News":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Event":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Achievement":
        return "bg-amber-100 text-amber-700 border-amber-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const NewsCard = ({ item, featured = false }) => (
    <Card className={`hover:shadow-lg transition-all duration-300 border-0 shadow-md ${featured ? 'md:col-span-2' : ''}`}>
      <CardContent className="p-0">
        {item.image && (
          <div className="aspect-video overflow-hidden rounded-t-lg">
            <img 
              src={item.image} 
              alt={item.title}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center justify-between mb-3">
            <Badge className={`${getTypeColor(item.type)} border flex items-center gap-1`}>
              <Tag className="h-3 w-3" />
              {item.type}
            </Badge>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(item.date).toLocaleDateString()}
            </div>
          </div>
          
          <h3 className={`font-semibold text-gray-900 mb-3 hover:text-emerald-600 transition-colors ${featured ? 'text-2xl' : 'text-lg'} leading-tight`}>
            {item.title}
          </h3>
          
          <p className="text-gray-600 leading-relaxed">
            {item.description}
          </p>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              {Math.ceil(item.description.length / 100)} min read
            </div>
            <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
              Read More →
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">News & Events</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay updated with the latest developments, research breakthroughs, and upcoming events from our lab.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {types.slice(1).map((type) => {
            const count = newsEvents.filter(item => item.type === type).length;
            return (
              <div key={type} className="bg-white rounded-lg p-6 text-center shadow-sm">
                <div className={`inline-flex p-3 rounded-full ${getTypeColor(type).replace('text-', 'bg-').replace('border-', '').split(' ')[0]} mb-3`}>
                  <Tag className="h-6 w-6" />
                </div>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
                <p className="text-sm text-gray-600">{type}s</p>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search news and events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-4">
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {types.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "all" ? "All Types" : type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Showing {filteredNews.length} of {newsEvents.length} items
            </p>
          </div>
        </div>

        {/* News Grid */}
        {filteredNews.length > 0 && (
          <div className="space-y-8">
            {/* Featured News Item */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Featured</h2>
              <NewsCard item={filteredNews[0]} featured={true} />
            </div>

            {/* Recent News Grid */}
            {filteredNews.length > 1 && (
              <>
                <h2 className="text-2xl font-semibold text-gray-900">Recent Updates</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNews.slice(1).map((item) => (
                    <NewsCard key={item.id} item={item} />
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {filteredNews.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No news or events found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsEvents;