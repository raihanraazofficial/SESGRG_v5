import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, Clock, ChevronLeft, ChevronRight, Loader2, ArrowRight, MapPin, RefreshCw, ArrowLeft, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import SkeletonCard from "../components/SkeletonCard";
import LaTeXRenderer, { parseLatexContent } from "../components/LaTeXRenderer";
import { useNewsEvents } from "../contexts/NewsEventsContext";
import { useAuth } from "../contexts/AuthContext";
import googleSheetsService from "../services/googleSheetsApi";
import "../styles/smooth-filters.css";

const NewsEvents = () => {
  const {
    newsEventsData,
    loading,
    categories,
    getPaginatedNewsEvents,
    getFeaturedNewsEvents
  } = useNewsEvents();

  const { isAuthenticated } = useAuth();

  const [newsEvents, setNewsEvents] = useState([]);
  const [featuredNewsEvents, setFeaturedNewsEvents] = useState([]);
  const [pagination, setPagination] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    category_filter: '',
    title_filter: '',
    sort_by: 'date',
    sort_order: 'desc',
    page: 1,
    per_page: 15
  });
  const [showFilters, setShowFilters] = useState(false);
  
  // Calendar settings state
  const [calendarSettings, setCalendarSettings] = useState({
    title: 'Upcoming Events Calendar',
    calendarUrl: 'https://calendar.google.com/calendar/embed?src=en.bd%23holiday%40group.v.calendar.google.com&ctz=Asia%2FDhaka',
    height: '400px',
    description: 'Stay updated with our upcoming events and important dates.'
  });

  // Load news events whenever newsEventsData or filters change
  useEffect(() => {
    if (newsEventsData.length > 0 || !loading) {
      const result = getPaginatedNewsEvents(filters);
      setNewsEvents(result.news_events || []);
      setPagination(result.pagination || {});
      
      // Load featured news events
      const featured = getFeaturedNewsEvents(1);
      setFeaturedNewsEvents(featured || []);
      
      console.log('✅ NewsEvents Page: Regular news loaded:', result.news_events?.length || 0);
      console.log('✅ NewsEvents Page: Featured news loaded:', featured?.length || 0);
    }
  }, [newsEventsData, filters, getPaginatedNewsEvents, getFeaturedNewsEvents, loading]);

  // Load calendar settings from localStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('sesg_calendar_settings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setCalendarSettings(prev => ({
          ...prev,
          ...settings
        }));
      }
    } catch (error) {
      console.error('Error loading calendar settings:', error);
    }
  }, []);

  const fetchNewsEvents = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
      }
      
      // For localStorage system, we just re-apply filters
      const result = getPaginatedNewsEvents(filters);
      setNewsEvents(result.news_events || []);
      setPagination(result.pagination || {});
      console.log('✅ News events loaded:', result.news_events?.length || 0, 'items');
    } catch (error) {
      console.error('❌ Error loading news events:', error);
      alert('Failed to load news & events. Please try again.');
      setNewsEvents([]);
      setPagination({});
    } finally {
      setRefreshing(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= pagination.total_pages) {
      handlePageChange(page);
    }
  };

  const clearFilters = () => {
    setFilters({
      category_filter: '',
      title_filter: '',
      sort_by: 'date',
      sort_order: 'desc',
      page: 1,
      per_page: 15
    });
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'News':
        return 'bg-emerald-100 text-emerald-700';
      case 'Events':
        return 'bg-blue-100 text-blue-700';
      case 'Upcoming Events':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const generateBlogContent = (item) => {
    // Enhanced function to parse and format description content with all advanced features including LaTeX
    const parseDescription = (description) => {
      if (!description) return '';
      
      const lines = description.split('\n');
      let result = '';
      let inList = false;
      let inOrderedList = false;
      let inCodeBlock = false;
      let inMathBlock = false;
      let inTable = false;
      let tableRows = [];
      let codeLanguage = '';
      let mathContent = '';
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const trimmed = line.trim();
        
        // Skip empty lines in special blocks
        if (!trimmed && (inCodeBlock || inMathBlock || inTable)) {
          continue;
        }
        
        // Handle code blocks ```language or ```
        if (trimmed.startsWith('```')) {
          if (!inCodeBlock) {
            codeLanguage = trimmed.substring(3) || 'text';
            inCodeBlock = true;
            result += `<div class="bg-gray-900 rounded-lg p-6 my-6 overflow-x-auto">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs text-gray-400 uppercase tracking-wider">${codeLanguage}</span>
                <button onclick="navigator.clipboard.writeText(this.parentElement.nextElementSibling.textContent)" class="text-xs text-gray-400 hover:text-white px-2 py-1 rounded border border-gray-600 hover:border-gray-400">Copy</button>
              </div>
              <pre class="text-emerald-400 text-sm leading-relaxed"><code>`;
          } else {
            inCodeBlock = false;
            result += `</code></pre></div>`;
          }
          continue;
        }
        
        // Handle math blocks $$
        if (trimmed === '$$') {
          if (!inMathBlock) {
            inMathBlock = true;
            mathContent = '';
            result += '<div class="latex-block-math">';
          } else {
            inMathBlock = false;
            // Use KaTeX for rendering the math content
            result += `<div class="my-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg overflow-x-auto">
              <div class="flex items-center mb-2">
                <svg class="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-xs font-medium text-emerald-800 uppercase tracking-wide">Mathematical Formula</span>
              </div>
              <div class="text-center math-content" data-math="${mathContent.replace(/"/g, '&quot;')}"></div>
            </div>`;
            result += '</div>';
          }
          continue;
        }
        
        // Inside math block - collect LaTeX content
        if (inMathBlock) {
          mathContent += line + '\n';
          continue;
        }
        
        // Handle inline math expressions
        let processedLine = line;
        if (!inCodeBlock) {
          // Process inline math $...$
          processedLine = processedLine.replace(/\$([^$\n]+)\$/g, '<span class="math-inline-content" data-math="$1"></span>');
          
          // Process display math $$...$$ (single line)
          processedLine = processedLine.replace(/\$\$([^$\n]+)\$\$/g, '<div class="math-display-content my-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-center" data-math="$1"></div>');
        }
        
        // Inside code block
        if (inCodeBlock) {
          result += line + '\n';
          continue;
        }
        
        if (!trimmed) {
          // Close lists on empty line
          if (inList) {
            result += '</ul>';
            inList = false;
          }
          if (inOrderedList) {
            result += '</ol>';
            inOrderedList = false;
          }
          result += '<br>';
          continue;
        }
        
        // Format text with markdown-like features
        let formatted = processedLine;
        
        // Bold text **text**
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Italic text *text*
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        // Links [text](url)
        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" class="text-emerald-600 hover:text-emerald-800 underline">$1</a>');
        
        // Code `code`
        formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-emerald-800 px-2 py-1 rounded text-sm font-mono">$1</code>');
        
        // Headings
        if (trimmed.startsWith('### ')) {
          result += `<h3 class="text-xl font-bold text-gray-900 mt-8 mb-4">${formatted.substring(4)}</h3>`;
          continue;
        } else if (trimmed.startsWith('## ')) {
          result += `<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-6">${formatted.substring(3)}</h2>`;
          continue;
        } else if (trimmed.startsWith('# ')) {
          result += `<h1 class="text-3xl font-bold text-gray-900 mt-12 mb-8">${formatted.substring(2)}</h1>`;
          continue;
        }
        
        // Tables (lines starting with |)
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
          if (!inTable) {
            inTable = true;
            tableRows = [];
          }
          tableRows.push(trimmed);
          continue;
        } else if (inTable) {
          // End of table
          result += processTable(tableRows);
          inTable = false;
          tableRows = [];
        }
        
        // Lists (bullet points with - or *)
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          if (!inList) {
            result += '<ul class="list-none space-y-4 my-8">';
            inList = true;
          }
          result += `<li class="flex items-start">
            <div class="flex-shrink-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mt-0.5 mr-4">
              <svg class="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
              </svg>
            </div>
            <span class="text-gray-700 leading-relaxed">${formatted.substring(2)}</span>
          </li>`;
          continue;
        }
        
        // Numbered lists (lines starting with number.)
        const numberedMatch = trimmed.match(/^(\d+)\.\s(.+)$/);
        if (numberedMatch) {
          const [, number, content] = numberedMatch;
          if (!inOrderedList) {
            result += '<ol class="list-none space-y-4 my-8">';
            inOrderedList = true;
          }
          result += `<li class="flex items-start">
            <span class="flex-shrink-0 w-8 h-8 bg-emerald-500 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-4 flex-shrink-0 mt-0.5">${number}</span>
            <span class="text-gray-700 leading-relaxed">${formatted.replace(/^\d+\.\s/, '')}</span>
          </li>`;
          continue;
        }
        
        // Close lists if we're not in a list item
        if (inList) {
          result += '</ul>';
          inList = false;
        }
        if (inOrderedList) {
          result += '</ol>';
          inOrderedList = false;
        }
        
        // Quotes (lines starting with >)
        if (trimmed.startsWith('> ')) {
          result += `<blockquote class="border-l-4 border-emerald-400 bg-gradient-to-r from-emerald-50 to-blue-50 pl-8 pr-6 py-6 my-8 rounded-r-lg">
            <div class="flex items-start">
              <svg class="w-8 h-8 text-emerald-400 mr-4 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
              </svg>
              <div>
                <p class="text-lg text-emerald-800 leading-relaxed italic font-medium">${formatted.substring(2)}</p>
              </div>
            </div>
          </blockquote>`;
          continue;
        }
        
        // Info boxes (lines starting with [INFO])
        if (trimmed.startsWith('[INFO]')) {
          result += `<div class="bg-emerald-50 border border-emerald-200 rounded-lg p-6 my-6">
            <div class="flex items-center mb-3">
              <svg class="w-6 h-6 text-emerald-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
              </svg>
              <span class="font-semibold text-emerald-800">Information</span>
            </div>
            <p class="text-emerald-700">${formatted.substring(6)}</p>
          </div>`;
          continue;
        }
        
        // Warning boxes (lines starting with [WARNING])
        if (trimmed.startsWith('[WARNING]')) {
          result += `<div class="bg-yellow-50 border border-yellow-200 rounded-lg p-6 my-6">
            <div class="flex items-center mb-3">
              <svg class="w-6 h-6 text-yellow-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              </svg>
              <span class="font-semibold text-yellow-800">Warning</span>
            </div>
            <p class="text-yellow-700">${formatted.substring(9)}</p>
          </div>`;
          continue;
        }
        
        // Regular paragraphs
        result += `<p class="mb-6 text-gray-700 leading-relaxed text-lg">${formatted}</p>`;
      }
      
      // Close any remaining lists
      if (inList) result += '</ul>';
      if (inOrderedList) result += '</ol>';
      if (inTable) result += processTable(tableRows);
      
      return result;
    };
    
    // Helper function to process tables
    const processTable = (rows) => {
      if (rows.length === 0) return '';
      
      let tableHtml = '<div class="overflow-x-auto my-8"><table class="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">';
      
      rows.forEach((row, index) => {
        const cells = row.split('|').slice(1, -1); // Remove first and last empty elements
        
        if (index === 0) {
          // Header row
          tableHtml += '<thead class="bg-emerald-50"><tr>';
          cells.forEach(cell => {
            tableHtml += `<th class="px-6 py-3 text-left text-xs font-medium text-emerald-700 uppercase tracking-wider border-b border-emerald-200">${cell.trim()}</th>`;
          });
          tableHtml += '</tr></thead><tbody class="bg-white divide-y divide-gray-200">';
        } else if (index === 1 && cells.every(cell => cell.match(/^:?-+:?$/))) {
          // Skip separator row
          return;
        } else {
          // Data row
          tableHtml += `<tr class="hover:bg-emerald-50">`;
          cells.forEach(cell => {
            tableHtml += `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cell.trim()}</td>`;
          });
          tableHtml += '</tr>';
        }
      });
      
      tableHtml += '</tbody></table></div>';
      return tableHtml;
    };

    // Generate blog-style content from the news/event item
    const blogHtml = `
      <div class="max-w-4xl mx-auto px-4 py-12 bg-white min-h-screen">
        <div class="mb-8">
          <div class="flex items-center text-emerald-600 mb-4">
            <svg class="h-6 w-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3l14 9-14 9V3z"></path>
            </svg>
            <span class="text-sm font-medium uppercase tracking-wide">${item.category || 'News & Events'}</span>
          </div>
          <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">${item.title}</h1>
          <div class="flex items-center text-gray-600 mb-8">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span class="text-lg">${formatDate(item.date)}</span>
          </div>
          ${item.category ? `
          <div class="mb-6">
            <span class="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
              ${item.category}
            </span>
          </div>
          ` : ''}
        </div>
        
        ${item.image ? `<div class="mb-12">
          <img src="${item.image}" alt="${item.title}" class="w-full h-96 object-cover rounded-2xl shadow-2xl">
        </div>` : ''}
        
        <div class="prose prose-lg max-w-none">
          <div class="bg-emerald-50 border-l-4 border-emerald-400 p-6 mb-8 rounded-r-lg">
            <p class="text-emerald-800 font-medium text-lg leading-relaxed">${item.short_description || item.description || ''}</p>
          </div>
          
          <div class="mt-8">
            ${parseDescription(item.full_content || item.description || '')}
          </div>
          
          <div class="mt-12 p-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl">
            <h3 class="text-xl font-bold text-gray-900 mb-4">About This ${item.category || 'News & Events'}</h3>
            <p class="text-gray-700 leading-relaxed">This represents an important update from our research journey at the Sustainable Energy and Smart Grid Research. It demonstrates our commitment to advancing the field through innovative solutions and collaborative efforts.</p>
          </div>
        </div>
        
        <div class="mt-12 text-center">
          <button onclick="window.close()" class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            Close Article
          </button>
        </div>
      </div>
    `;
    
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>${item.title} - SESG Research News & Events</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css">
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          .prose ul { list-style-type: disc; margin-left: 1.5rem; }
          .prose ol { list-style-type: decimal; margin-left: 1.5rem; }
          /* Math Formula Styling */
          .math-formula { 
            font-family: 'Courier New', monospace; 
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border: 1px solid #cbd5e1;
          }
          /* Code Block Styling */
          .prose pre {
            background: #1a202c !important;
            border-radius: 12px;
            border: 1px solid #2d3748;
          }
          .prose code {
            color: #48bb78 !important;
            font-family: 'Fira Code', 'Consolas', monospace;
          }
          /* Table Styling */
          .prose table {
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          /* Video Container */
          .video-container iframe {
            border-radius: 12px;
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          }
          /* LaTeX Inline Styling */
          .math-inline-content {
            background: #ecfdf5;
            color: #047857;
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid #a7f3d0;
            font-family: 'Computer Modern', serif;
          }
          /* LaTeX Display Styling */
          .math-display-content {
            background: #ecfdf5;
            border: 1px solid #a7f3d0;
            border-radius: 8px;
            padding: 16px;
            margin: 16px 0;
            text-align: center;
            overflow-x: auto;
          }
        </style>
      </head>
      <body class="bg-gray-50">
        ${blogHtml}
        
        <script>
          // KaTeX Configuration and Rendering
          document.addEventListener('DOMContentLoaded', function() {
            // Render inline math
            const inlineMathElements = document.querySelectorAll('.math-inline-content');
            inlineMathElements.forEach(function(element) {
              const mathContent = element.getAttribute('data-math');
              try {
                katex.render(mathContent, element, {
                  throwOnError: false,
                  displayMode: false
                });
              } catch (e) {
                element.innerHTML = 'LaTeX Error: ' + mathContent;
                element.style.color = '#dc2626';
              }
            });
            
            // Render display math
            const displayMathElements = document.querySelectorAll('.math-display-content, .math-content');
            displayMathElements.forEach(function(element) {
              const mathContent = element.getAttribute('data-math');
              try {
                katex.render(mathContent, element, {
                  throwOnError: false,
                  displayMode: true
                });
              } catch (e) {
                element.innerHTML = 'LaTeX Error: ' + mathContent;
                element.style.color = '#dc2626';
              }
            });
            
            // Auto-render any remaining LaTeX expressions
            if (typeof renderMathInElement !== 'undefined') {
              renderMathInElement(document.body, {
                delimiters: [
                  {left: '$$', right: '$$', display: true},
                  {left: '$', right: '$', display: false},
                  {left: '\\\\[', right: '\\\\]', display: true},
                  {left: '\\\\(', right: '\\\\)', display: false}
                ],
                throwOnError: false
              });
            }
          });
        </script>
      </body>
      </html>
    `);
    newWindow.document.close();
  };

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      {/* Header - People Style */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white py-16 performance-optimized">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center mb-6">
            <Link to="/" className="flex items-center text-white hover:text-emerald-400 transition-colors">
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </Link>
          </div>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-4">Latest News & Events</h1>
              <p className="text-xl text-gray-300 max-w-3xl">
                Stay updated with our recent achievements, research milestones, upcoming events, and important announcements from our laboratory.
              </p>
            </div>
            
            {/* Only show Admin Login button for non-authenticated users */}
            {!isAuthenticated && (
              <div className="flex flex-col items-end space-y-4">
                <Link
                  to="/admin/login"
                  className="inline-flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors shadow-lg hover:shadow-xl"
                >
                  <Shield className="h-5 w-5 mr-2" />
                  <span>Admin Login</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">

        {/* Category Filter Buttons */}
        <div className="flex justify-center flex-wrap gap-4 mb-8">
          <Button
            variant={filters.category_filter === '' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('category_filter', '')}
            className="px-6 py-2 filter-button"
          >
            All Categories
          </Button>
          <Button
            variant={filters.category_filter === 'News' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('category_filter', 'News')}
            className="px-6 py-2 filter-button"
          >
            News
          </Button>
          <Button
            variant={filters.category_filter === 'Events' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('category_filter', 'Events')}
            className="px-6 py-2 filter-button"
          >
            Events
          </Button>
          <Button
            variant={filters.category_filter === 'Upcoming Events' ? 'default' : 'outline'}
            onClick={() => handleFilterChange('category_filter', 'Upcoming Events')}
            className="px-6 py-2 filter-button"
          >
            Upcoming Events
          </Button>
        </div>


        {/* Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
              </Button>
            </div>

            {/* Search */}
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by title..."
                  value={filters.title_filter}
                  onChange={(e) => handleFilterChange('title_filter', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg dropdown-container" style={{overflow: 'visible'}}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                  <Select
                    value={filters.category_filter || "all"}
                    onValueChange={(value) => handleFilterChange('category_filter', value === "all" ? "" : value)}
                  >
                    <SelectTrigger className="dropdown-container">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64 overflow-y-auto" side="bottom" align="start" sideOffset={4}>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                  <Select
                    value={`${filters.sort_by}-${filters.sort_order}`}
                    onValueChange={(value) => {
                      const [sort_by, sort_order] = value.split('-');
                      handleFilterChange('sort_by', sort_by);
                      handleFilterChange('sort_order', sort_order);
                    }}
                  >
                    <SelectTrigger className="dropdown-container">
                      <SelectValue placeholder="Select Sort Option" />
                    </SelectTrigger>
                    <SelectContent className="max-h-64 overflow-y-auto" side="bottom" align="start" sideOffset={4}>
                      <SelectItem value="date-desc">Date (Newest First)</SelectItem>
                      <SelectItem value="date-asc">Date (Oldest First)</SelectItem>
                      <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                      <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {/* Clear Filters */}
            <div className="flex justify-end">
              <Button variant="outline" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Loading State */}
        {loading && (
          <div className="space-y-8">
            {/* Featured Skeleton */}
            <SkeletonCard variant="featured" />
            
            {/* Regular Skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }, (_, i) => (
                <SkeletonCard key={i} variant="regular" />
              ))}
            </div>
          </div>
        )}

        {/* News & Events Grid */}
        {!loading && newsEvents.length > 0 && (
          <div className="space-y-8">
            {/* First News/Event - Featured/Large Card */}
            {newsEvents[0] && (
              <Card className="hover:shadow-2xl transition-all duration-300 overflow-hidden group bg-gradient-to-r from-white to-blue-50 border-2 border-blue-200">
                <div className="md:flex">
                  {/* Featured Image */}
                  {newsEvents[0].image && (
                    <div className="md:w-1/2 relative h-64 md:h-auto overflow-hidden">
                      <img 
                        src={newsEvents[0].image}
                        alt={newsEvents[0].title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                      <div className="absolute top-6 left-6">
                        <span className={`px-4 py-2 rounded-full text-sm font-medium ${getCategoryColor(newsEvents[0].category)}`}>
                          {newsEvents[0].category}
                        </span>
                      </div>
                      <div className="absolute top-6 right-6">
                        <span className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 text-sm font-medium text-blue-700">
                          Featured Story
                        </span>
                      </div>
                    </div>
                  )}
                  
                  <CardContent className="md:w-1/2 p-8 md:p-12">
                    <div className="space-y-6">
                      {/* Date and Location */}
                      <div className="space-y-2">
                        <div className="flex items-center text-blue-600">
                          <Calendar className="h-5 w-5 mr-3" />
                          <span className="text-lg font-medium">{formatDate(newsEvents[0].date)}</span>
                        </div>
                        {newsEvents[0].location && (
                          <div className="flex items-center text-gray-600">
                            <MapPin className="h-5 w-5 mr-3" />
                            <span className="text-lg">{newsEvents[0].location}</span>
                          </div>
                        )}
                      </div>

                      {/* Title */}
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
                        {newsEvents[0].title}
                      </h2>

                      {/* Description */}
                      <p className="text-gray-700 text-lg leading-relaxed line-clamp-4">
                        {newsEvents[0].short_description || newsEvents[0].description}
                      </p>

                      {/* Read More Button */}
                      <div className="pt-6">
                        <Button 
                          size="lg"
                          className="group-hover:bg-blue-700 bg-blue-600 text-white px-8 py-3"
                          onClick={() => generateBlogContent(newsEvents[0])}
                        >
                          Read Full Story <ArrowRight className="h-5 w-5 ml-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            )}

            {/* Rest of News & Events - Regular Grid */}
            {newsEvents.length > 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsEvents.slice(1).map((item) => (
                  <Card key={item.id} className="hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    {/* Image */}
                    {item.image && (
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute top-4 left-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(item.category)}`}>
                            {item.category}
                          </span>
                        </div>
                      </div>
                    )}
                    
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        {/* Title */}
                        <div className="flex justify-between items-start">
                          <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors flex-1 mr-2">
                            {item.title}
                          </h3>
                        </div>

                        {/* Date and Location */}
                        <div className="space-y-2">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{formatDate(item.date)}</span>
                          </div>
                          {item.location && (
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-2" />
                              <span>{item.location}</span>
                            </div>
                          )}
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                          {item.short_description || item.description}
                        </p>

                        {/* Read More Button */}
                        <div className="pt-4 border-t border-gray-200">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full group-hover:bg-emerald-50 group-hover:border-emerald-200"
                            onClick={() => generateBlogContent(item)}
                          >
                            Read More <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* No Results */}
        {!loading && newsEvents.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">No news or events found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search criteria or filters.</p>
            <Button onClick={clearFilters}>Clear All Filters</Button>
          </div>
        )}

        {/* Pagination */}
        {!loading && pagination.total_pages > 1 && (
          <div className="flex items-center justify-between mt-12 p-6 bg-white rounded-lg shadow">
            <div className="text-sm text-gray-600">
              Showing {((pagination.current_page - 1) * pagination.per_page) + 1} to{' '}
              {Math.min(pagination.current_page * pagination.per_page, pagination.total_items)} of{' '}
              {pagination.total_items} items
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                onClick={() => goToPage(pagination.current_page - 1)}
                disabled={!pagination.has_prev}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              
              {/* Page Numbers */}
              <div className="flex space-x-1">
                {Array.from({ length: Math.min(5, pagination.total_pages) }, (_, i) => {
                  let pageNum;
                  if (pagination.total_pages <= 5) {
                    pageNum = i + 1;
                  } else if (pagination.current_page <= 3) {
                    pageNum = i + 1;
                  } else if (pagination.current_page >= pagination.total_pages - 2) {
                    pageNum = pagination.total_pages - 4 + i;
                  } else {
                    pageNum = pagination.current_page - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === pagination.current_page ? "default" : "outline"}
                      size="sm"
                      onClick={() => goToPage(pageNum)}
                      className="w-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => goToPage(pagination.current_page + 1)}
                disabled={!pagination.has_next}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
            
            {/* Go to Page */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Go to page:</span>
              <Input
                type="number"
                min="1"
                max={pagination.total_pages}
                className="w-20"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    const page = parseInt(e.target.value);
                    if (page && page >= 1 && page <= pagination.total_pages) {
                      goToPage(page);
                      e.target.value = '';
                    }
                  }
                }}
              />
            </div>
          </div>
        )}

        {/* Google Calendar Iframe */}
        <div className="mt-16">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{calendarSettings.title}</h3>
                  {calendarSettings.description && (
                    <p className="text-gray-600">{calendarSettings.description}</p>
                  )}
                </div>
              </div>
              
              <div className="w-full rounded-lg overflow-hidden" style={{ height: calendarSettings.height }}>
                <iframe
                  src={calendarSettings.calendarUrl}
                  style={{ border: 0 }}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  className="rounded-lg"
                  title={calendarSettings.title}
                />
              </div>
            </CardContent>
          </Card>

          {/* Back to Top - Performance Optimized - Added more spacing */}
          <div className="text-center pt-8 pb-16">
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

export default NewsEvents;