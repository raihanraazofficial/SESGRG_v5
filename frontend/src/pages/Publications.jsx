import React, { useState, useMemo, useEffect } from "react";
import { Search, Filter, FileText, ExternalLink, Calendar, Users } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Badge } from "../components/ui/badge";

const Publications = () => {
  const [publications, setPublications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("year");

  // Fetch publications
  useEffect(() => {
    fetch(process.env.REACT_APP_PUBLICATIONS_API)
      .then(res => res.json())
      .then(data => setPublications(data))
      .catch(err => console.error("Error:", err));
  }, []);

  // Extract categories dynamically
  const categories = useMemo(() => {
    const cats = new Set(publications.map(pub => pub.category).filter(Boolean));
    return ["all", ...Array.from(cats)];
  }, [publications]);

  // Filtered & sorted publications
  const filteredPublications = useMemo(() => {
    return publications
      .filter(pub => {
        const matchesSearch =
          pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (Array.isArray(pub.authors)
            ? pub.authors.some(a => a.toLowerCase().includes(searchTerm.toLowerCase()))
            : false) ||
          (pub.year && pub.year.toString() === searchTerm);

        const matchesCategory = selectedCategory === "all" || pub.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === "year") return b.year - a.year;
        if (sortBy === "citations") return b.citationCount - a.citationCount;
        if (sortBy === "title") return a.title.localeCompare(b.title);
        return 0;
      });
  }, [publications, searchTerm, selectedCategory, sortBy]);

  // Single publication card
  const PublicationCard = ({ publication }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-start justify-between">
            <Badge variant="outline" className="text-emerald-700 border-emerald-200 bg-emerald-50">
              {publication.category}
            </Badge>
            <span className="text-sm text-gray-500 flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              {publication.year}
            </span>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 leading-tight hover:text-emerald-600 transition-colors">
            {publication.title}
          </h3>
          <div className="flex items-center text-gray-600 text-sm">
            <Users className="h-4 w-4 mr-2" />
            {Array.isArray(publication.authors) ? publication.authors.join(", ") : publication.authors}
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            <p><strong>Journal:</strong> {publication.journal}</p>
            <p>
              <strong>Publication:</strong> Vol. {publication.volume}
              {publication.issue && `, Issue ${publication.issue}`}
              {publication.pages && `, pp. ${publication.pages}`}
            </p>
            {publication.doi && <p><strong>DOI:</strong> {publication.doi}</p>}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                <strong>Citations:</strong> {Number(publication.citationcount) || 0}
              </span>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                <FileText className="h-4 w-4 mr-1" /> PDF
              </Button>
              <Button size="sm" variant="outline" className="text-gray-600">
                <ExternalLink className="h-4 w-4 mr-1" /> DOI
              </Button>
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
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Publications</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our research contributions to the scientific community.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-emerald-600">{publications.length}</p>
            <p className="text-sm text-gray-600">Total Publications</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-blue-600">
              {publications.reduce((sum, pub) => sum + (Number(pub.citationcount) || 0), 0)}
            </p>
            <p className="text-sm text-gray-600">Total Citations</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-purple-600">
              {publications.length > 0 ? Math.max(...publications.map(p => p.year)) : "-"}
            </p>
            <p className="text-sm text-gray-600">Latest Year</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-sm">
            <p className="text-2xl font-bold text-amber-600">{categories.length - 1}</p>
            <p className="text-sm text-gray-600">Research Areas</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by title, author, or year..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-4">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>
                      {cat === "all" ? "All Categories" : cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="citations">Citations</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Publications List */}
        <div className="space-y-6">
          {filteredPublications.length > 0
            ? filteredPublications.map(pub => <PublicationCard key={pub.id} publication={pub} />)
            : (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No publications found</h3>
                <p className="text-gray-600">Try adjusting your search or filters.</p>
              </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default Publications;
