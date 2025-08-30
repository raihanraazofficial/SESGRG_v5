import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, Clock, ChevronLeft, ChevronRight, Loader2, ArrowRight, MapPin, RefreshCw } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import SkeletonCard from "../components/SkeletonCard";
import apiService from "../services/api";

const NewsEvents = () => {
  const [newsEvents, setNewsEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    category_filter: '',
    title_filter: '',
    sort_by: 'date',
    sort_order: 'desc',
    page: 1,
    per_page: 15
  });
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["News", "Events", "Upcoming Events"];

  useEffect(() => {
    fetchNewsEvents();
  }, [filters]);

  const fetchNewsEvents = async (forceRefresh = false) => {
    try {
      if (forceRefresh) {
        setRefreshing(true);
        // Clear cache first
        try {
          await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/clear-cache`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
          });
        } catch (cacheError) {
          console.warn('Cache clear failed:', cacheError);
        }
      } else {
        setLoading(true);
      }
      
      // Convert 'all' to empty string for API
      const apiFilters = {
        ...filters,
        category_filter: filters.category_filter === 'all' ? '' : filters.category_filter
      };
      const response = await apiService.getNewsEvents(apiFilters);
      setNewsEvents(response.news_events || []);
      setPagination(response.pagination || {});
    } catch (error) {
      console.error('Error fetching news events:', error);
      // Fallback to empty state on error
      setNewsEvents([]);
      setPagination({});
    } finally {
      setLoading(false);
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
    // Enhanced function to parse and format description content with all advanced features
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
            result += `<div class="bg-emerald-50 border-l-4 border-emerald-400 p-6 my-6 rounded-r-lg">
              <div class="flex items-center mb-3">
                <svg class="w-5 h-5 text-emerald-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span class="text-sm font-medium text-emerald-800">Mathematical Formula</span>
              </div>
              <div class="math-display bg-white p-4 rounded border text-center overflow-x-auto">$$`;
          } else {
            inMathBlock = false;
            result += `$$</div></div>`;
          }
          continue;
        }
        
        // Handle inline math expressions with $ $ or LaTeX patterns
        if (!inCodeBlock && !inMathBlock) {
          // Process inline math $...$
          line = line.replace(/\$([^$]+)\$/g, '<span class="math-inline">$$$1$$</span>');
          
          // Process display math $$...$$ (single line)
          line = line.replace(/\$\$([^$]+)\$\$/g, '<div class="math-display bg-emerald-50 p-4 my-4 rounded border text-center">$$$$1$$$$</div>');
        }
        
        // Inside code block
        if (inCodeBlock) {
          result += line + '\n';
          continue;
        }
        
        // Inside math block - format mathematical expressions
        if (inMathBlock) {
          let mathLine = line
            // Greek letters
            .replace(/α/g, '<span class="text-emerald-600 font-semibold">α</span>')
            .replace(/β/g, '<span class="text-emerald-600 font-semibold">β</span>')
            .replace(/γ/g, '<span class="text-emerald-600 font-semibold">γ</span>')
            .replace(/δ/g, '<span class="text-emerald-600 font-semibold">δ</span>')
            .replace(/ε/g, '<span class="text-emerald-600 font-semibold">ε</span>')
            .replace(/θ/g, '<span class="text-emerald-600 font-semibold">θ</span>')
            .replace(/λ/g, '<span class="text-emerald-600 font-semibold">λ</span>')
            .replace(/μ/g, '<span class="text-emerald-600 font-semibold">μ</span>')
            .replace(/π/g, '<span class="text-emerald-600 font-semibold">π</span>')
            .replace(/σ/g, '<span class="text-emerald-600 font-semibold">σ</span>')
            .replace(/τ/g, '<span class="text-emerald-600 font-semibold">τ</span>')
            .replace(/ω/g, '<span class="text-emerald-600 font-semibold">ω</span>')
            // Subscripts and superscripts
            .replace(/(\w+)_\{([^}]+)\}/g, '$1<sub class="text-sm">$2</sub>')
            .replace(/(\w+)_(\w+)/g, '$1<sub class="text-sm">$2</sub>')
            .replace(/(\w+)\^\{([^}]+)\}/g, '$1<sup class="text-sm">$2</sup>')
            .replace(/(\w+)\^(\w+)/g, '$1<sup class="text-sm">$2</sup>')
            // Mathematical operators
            .replace(/≤/g, '<span class="text-red-600 font-bold">≤</span>')
            .replace(/≥/g, '<span class="text-red-600 font-bold">≥</span>')
            .replace(/∑/g, '<span class="text-purple-600 font-bold text-xl">∑</span>')
            .replace(/∫/g, '<span class="text-purple-600 font-bold text-xl">∫</span>')
            .replace(/√/g, '<span class="text-emerald-600 font-bold">√</span>')
            .replace(/∞/g, '<span class="text-indigo-600 font-bold">∞</span>');
          
          result += mathLine + '<br>';
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
        
        // Handle tables (lines starting with |)
        if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
          if (!inTable) {
            inTable = true;
            tableRows = [];
          }
          tableRows.push(trimmed);
          continue;
        } else if (inTable) {
          // End of table, process it
          result += processTable(tableRows);
          inTable = false;
          tableRows = [];
        }
        
        // YouTube video links
        if (trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)) {
          const videoId = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)[1];
          result += `<div class="video-container my-8">
            <div class="bg-gradient-to-r from-red-500 to-pink-500 p-4 rounded-t-lg">
              <div class="flex items-center text-white">
                <svg class="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.30 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span class="font-medium">Video Content</span>
              </div>
            </div>
            <div class="relative pb-9/16">
              <iframe class="absolute top-0 left-0 w-full h-64 rounded-b-lg" 
                src="https://www.youtube.com/embed/${videoId}" 
                frameborder="0" allowfullscreen>
              </iframe>
            </div>
          </div>`;
          continue;
        }
        
        // Regular video links
        if (trimmed.match(/\.(mp4|avi|mov|wmv|flv|webm)$/i)) {
          result += `<div class="video-container my-8 bg-black rounded-lg overflow-hidden">
            <video controls class="w-full">
              <source src="${trimmed}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          </div>`;
          continue;
        }
        
        // Image with caption [IMG:url:caption]
        if (trimmed.match(/^\[IMG:([^:]+):?(.*?)\]$/)) {
          const matches = trimmed.match(/^\[IMG:([^:]+):?(.*?)\]$/);
          const imageUrl = matches[1];
          const caption = matches[2] || '';
          result += `<div class="my-8">
            <img src="${imageUrl}" alt="${caption}" class="w-full h-auto rounded-lg shadow-lg">
            ${caption ? `<p class="text-center text-gray-600 text-sm mt-2 italic">${caption}</p>` : ''}
          </div>`;
          continue;
        }
        
        // Headers (lines starting with ##)
        if (trimmed.startsWith('## ')) {
          const headerText = trimmed.substring(3);
          result += `<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6 border-b-2 border-emerald-200 pb-3 flex items-center">
            <span class="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-lg mr-4">#</span>
            ${headerText}
          </h2>`;
          continue;
        }
        
        // Subheaders (lines starting with ###)
        if (trimmed.startsWith('### ')) {
          const subHeaderText = trimmed.substring(4);
          result += `<h3 class="text-2xl font-semibold text-gray-800 mt-10 mb-4 flex items-center">
            <span class="w-1 h-8 bg-gradient-to-b from-emerald-500 to-purple-500 rounded-full mr-4"></span>
            ${subHeaderText}
          </h3>`;
          continue;
        }
        
        // Subsubheaders (lines starting with ####)
        if (trimmed.startsWith('#### ')) {
          const subSubHeaderText = trimmed.substring(5);
          result += `<h4 class="text-xl font-medium text-gray-700 mt-8 mb-3 flex items-center">
            <span class="w-2 h-2 bg-emerald-400 rounded-full mr-3"></span>
            ${subSubHeaderText}
          </h4>`;
          continue;
        }
        
        // Process regular text formatting
        let formatted = trimmed;
        
        // Bold text (**text**)
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>');
        
        // Italic text (*text*)
        formatted = formatted.replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>');
        
        // Inline code (`code`)
        formatted = formatted.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-2 py-1 rounded text-sm font-mono">$1</code>');
        
        // Inline math $formula$
        formatted = formatted.replace(/\$([^$]+)\$/g, `<span class="bg-emerald-50 text-emerald-800 px-2 py-1 rounded font-mono">$1</span>`);
        
        // Colored text [color:text]
        formatted = formatted.replace(/\[([a-z]+):(.*?)\]/g, '<span class="text-$1-600 font-medium">$2</span>');
        
        // Links [text](url)
        formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
          `<a href="$2" target="_blank" class="text-emerald-600 hover:text-emerald-800 underline hover:bg-emerald-50 px-1 py-0.5 rounded transition-colors">$1 ↗</a>`);
        
        // Bullet points (lines starting with -)
        if (trimmed.startsWith('- ')) {
          if (!inList) {
            result += '<ul class="list-none space-y-3 my-6">';
            inList = true;
          }
          result += `<li class="flex items-start">
            <span class="w-2 h-2 bg-emerald-500 rounded-full mt-3 mr-4 flex-shrink-0"></span>
            <span class="text-gray-700 leading-relaxed">${formatted.substring(2)}</span>
          </li>`;
          continue;
        }
        
        // Numbered lists (lines starting with number.)
        if (/^\d+\.\s/.test(trimmed)) {
          if (!inOrderedList) {
            result += '<ol class="counter-reset list-none space-y-3 my-6">';
            inOrderedList = true;
          }
          const number = trimmed.match(/^(\d+)\./)[1];
          result += `<li class="flex items-start">
            <span class="bg-emerald-100 text-emerald-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-4 flex-shrink-0 mt-0.5">${number}</span>
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
            <p class="text-emerald-800 font-medium text-lg leading-relaxed">${item.description || item.short_description}</p>
          </div>
          
          <div class="mt-8">
            ${parseDescription(item.description || item.full_content || '')}
          </div>
          
          <div class="mt-12 p-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl">
            <h3 class="text-xl font-bold text-gray-900 mb-4">About This ${item.category || 'News & Events'}</h3>
            <p class="text-gray-700 leading-relaxed">This represents an important update from our research journey at the Sustainable Energy and Smart Grid Research lab. It demonstrates our commitment to advancing the field through innovative solutions and collaborative efforts.</p>
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
        <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
        <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
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
        </style>
      </head>
      <body class="bg-gray-50">
        ${blogHtml}
        
        <script>
          // MathJax Configuration
          window.MathJax = {
            tex: {
              inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
              displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']],
              processEscapes: true,
              processEnvironments: true
            },
            options: {
              skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
            }
          };
        </script>
      </body>
      </html>
    `);
    newWindow.document.close();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">News & Events</h1>
          <div className="flex items-center justify-center gap-4 mb-6">
            <p className="text-xl text-gray-600 max-w-4xl text-center">
              Stay updated with the latest news, events, and achievements from our research lab. 
              Discover our recent breakthroughs and upcoming activities in sustainable energy and smart grid research.
            </p>
            <Button
              onClick={() => fetchNewsEvents(true)}
              disabled={refreshing}
              variant="outline"
              size="sm"
              className="ml-4 flex-shrink-0"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>

          {/* Category Filter Buttons */}
          <div className="flex justify-center flex-wrap gap-4 mb-8">
            <Button
              variant={filters.category_filter === '' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('category_filter', '')}
              className="px-6 py-2"
            >
              All Categories
            </Button>
            <Button
              variant={filters.category_filter === 'News' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('category_filter', 'News')}
              className="px-6 py-2"
            >
              News
            </Button>
            <Button
              variant={filters.category_filter === 'Events' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('category_filter', 'Events')}
              className="px-6 py-2"
            >
              Events
            </Button>
            <Button
              variant={filters.category_filter === 'Upcoming Events' ? 'default' : 'outline'}
              onClick={() => handleFilterChange('category_filter', 'Upcoming Events')}
              className="px-6 py-2"
            >
              Upcoming Events
            </Button>
          </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Category</label>
                  <Select
                    value={filters.category_filter || "all"}
                    onValueChange={(value) => handleFilterChange('category_filter', value === "all" ? "" : value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                    <SelectContent>
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
                    <SelectTrigger>
                      <SelectValue placeholder="Select Sort Option" />
                    </SelectTrigger>
                    <SelectContent>
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
                        {newsEvents[0].description}
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
                        <h3 className="text-lg font-bold text-gray-900 leading-tight group-hover:text-emerald-600 transition-colors">
                          {item.title}
                        </h3>

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
                          {item.description}
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
              <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">Upcoming Events Calendar</h3>
              <div className="w-full h-96 rounded-lg overflow-hidden">
                <iframe
                  src="https://calendar.google.com/calendar/embed?src=en.bd%23holiday%40group.v.calendar.google.com&ctz=Asia%2FDhaka"
                  style={{ border: 0 }}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  className="rounded-lg"
                  title="SESG Research Events Calendar"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewsEvents;
