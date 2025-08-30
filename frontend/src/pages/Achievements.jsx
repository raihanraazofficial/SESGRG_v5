import React, { useState } from "react";
import { Award, Trophy, DollarSign, FileText, Calendar, Filter } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { achievements } from "../mock/data";

const Achievements = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const categories = ["all", "Award", "Funding", "Patent"];

  const filteredAchievements = achievements
    .filter((achievement) => selectedCategory === "all" || achievement.category === selectedCategory)
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date) - new Date(a.date);
      }
      return a.title.localeCompare(b.title);
    });

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Award":
        return <Trophy className="h-5 w-5" />;
      case "Funding":
        return <DollarSign className="h-5 w-5" />;
      case "Patent":
        return <FileText className="h-5 w-5" />;
      default:
        return <Award className="h-5 w-5" />;
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Award":
        return "bg-amber-100 text-amber-700 border-amber-200";
      case "Funding":
        return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Patent":
        return "bg-blue-100 text-blue-700 border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const AchievementCard = ({ achievement }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <Badge className={`${getCategoryColor(achievement.category)} border flex items-center gap-2`}>
              {getCategoryIcon(achievement.category)}
              {achievement.category}
            </Badge>
            <div className="flex items-center text-sm text-gray-500">
              <Calendar className="h-4 w-4 mr-1" />
              {new Date(achievement.date).toLocaleDateString()}
            </div>
          </div>
          
          <h3 className="text-xl font-semibold text-gray-900 leading-tight hover:text-emerald-600 transition-colors">
            {achievement.title}
          </h3>
          
          <p className="text-gray-600 leading-relaxed">
            {achievement.description}
          </p>
          
          <div className="border-t pt-4">
            <div className="flex items-center text-sm text-gray-600">
              <strong className="mr-2">Recipients:</strong>
              {achievement.recipients.join(", ")}
            </div>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Achievements</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Celebrating our research milestones, awards, funding successes, and intellectual property contributions.
          </p>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full mx-auto mb-3">
              <Trophy className="h-6 w-6 text-amber-600" />
            </div>
            <p className="text-2xl font-bold text-amber-600">
              {achievements.filter(a => a.category === "Award").length}
            </p>
            <p className="text-sm text-gray-600">Awards & Honors</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mx-auto mb-3">
              <DollarSign className="h-6 w-6 text-emerald-600" />
            </div>
            <p className="text-2xl font-bold text-emerald-600">
              {achievements.filter(a => a.category === "Funding").length}
            </p>
            <p className="text-sm text-gray-600">Funding Awards</p>
          </div>
          
          <div className="bg-white rounded-lg p-6 text-center shadow-sm">
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mx-auto mb-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {achievements.filter(a => a.category === "Patent").length}
            </p>
            <p className="text-sm text-gray-600">Patents</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === "all" ? "All Categories" : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date (Newest First)</SelectItem>
                  <SelectItem value="title">Title (A-Z)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              Showing {filteredAchievements.length} of {achievements.length} achievements
            </p>
          </div>
        </div>

        {/* Timeline View */}
        <div className="space-y-6">
          {filteredAchievements.map((achievement, index) => (
            <div key={achievement.id} className="flex">
              <div className="flex flex-col items-center mr-6">
                <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getCategoryColor(achievement.category).replace('text-', 'bg-').replace('border-', '').split(' ')[0]} mb-2`}>
                  {getCategoryIcon(achievement.category)}
                </div>
                {index < filteredAchievements.length - 1 && (
                  <div className="w-0.5 h-16 bg-gray-200"></div>
                )}
              </div>
              <div className="flex-1">
                <AchievementCard achievement={achievement} />
              </div>
            </div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No achievements found</h3>
            <p className="text-gray-600">Try adjusting your filters to see more achievements.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;