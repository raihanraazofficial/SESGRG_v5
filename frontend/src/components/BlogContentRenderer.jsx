import React from 'react';

const BlogContentRenderer = ({ achievement, onClose }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderRichContent = (content) => {
    if (!content) return '';

    // Advanced markdown to HTML conversion with WordPress/Blogger-like features
    let html = content
      // LaTeX formulas - render with MathJax-like styling
      .replace(/\$\$(.*?)\$\$/g, '<div class="latex-formula bg-blue-50 border border-blue-200 p-4 my-4 rounded-lg text-center font-mono text-lg">$1</div>')
      .replace(/\$(.*?)\$/g, '<span class="latex-inline bg-blue-50 px-2 py-1 rounded font-mono">$1</span>')
      
      // Headers with proper styling
      .replace(/^### (.*$)/gim, '<h3 class="text-2xl font-bold text-gray-800 mt-8 mb-4 border-b border-gray-200 pb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-3xl font-bold text-gray-900 mt-10 mb-6 border-b-2 border-emerald-200 pb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-4xl font-bold text-gray-900 mt-12 mb-8 border-b-2 border-emerald-400 pb-4">$1</h1>')
      
      // Text formatting
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-gray-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-gray-700">$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u class="underline">$1</u>')
      .replace(/~~(.*?)~~/g, '<del class="line-through text-gray-500">$1</del>')
      .replace(/<sub>(.*?)<\/sub>/g, '<sub class="text-xs">$1</sub>')
      .replace(/<sup>(.*?)<\/sup>/g, '<sup class="text-xs">$1</sup>')
      
      // Code blocks and inline code
      .replace(/```\n([\s\S]*?)\n```/g, '<pre class="bg-gray-900 text-green-400 p-6 rounded-lg overflow-x-auto my-6 border-l-4 border-emerald-500"><code class="font-mono text-sm leading-relaxed">$1</code></pre>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 text-red-600 px-2 py-1 rounded font-mono text-sm">$1</code>')
      
      // Links with styling
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-emerald-600 hover:text-emerald-800 underline font-medium" target="_blank" rel="noopener noreferrer">$1</a>')
      
      // Images with captions
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<figure class="my-8"><img src="$2" alt="$1" class="w-full max-w-2xl mx-auto rounded-lg shadow-lg" /><figcaption class="text-center text-gray-600 mt-3 italic text-sm">$1</figcaption></figure>')
      
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-emerald-400 bg-emerald-50 pl-6 py-4 my-6 italic text-gray-700 text-lg">$1</blockquote>')
      
      // Lists
      .replace(/^- (.*$)/gim, '<li class="ml-6 mb-2 text-gray-700">• $1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-6 mb-2 text-gray-700 list-decimal">$1</li>')
      
      // Horizontal rules
      .replace(/^---$/gim, '<hr class="my-8 border-t-2 border-gray-300" />')
      
      // Tables (basic markdown table support)
      .replace(/\|(.+)\|/g, (match) => {
        const cells = match.split('|').filter(cell => cell.trim());
        const isHeader = match.includes('---');
        if (isHeader) return '';
        
        const cellType = cells.some(cell => cell.includes('Header')) ? 'th' : 'td';
        const className = cellType === 'th' ? 'px-4 py-3 bg-emerald-100 font-bold text-gray-900 border border-gray-300' : 'px-4 py-3 text-gray-700 border border-gray-300';
        
        return `<tr>${cells.map(cell => `<${cellType} class="${className}">${cell.trim()}</${cellType}>`).join('')}</tr>`;
      })
      
      // Wrap tables
      .replace(/(<tr>.*<\/tr>)/gs, '<table class="w-full my-6 border-collapse rounded-lg overflow-hidden shadow-lg">$1</table>')
      
      // Video embeds (YouTube, Vimeo, etc.)
      .replace(/<iframe([^>]*)><\/iframe>/g, '<div class="video-container my-8 relative w-full" style="padding-bottom: 56.25%; height: 0;"><iframe$1 class="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"></iframe></div>')
      
      // Colored text (custom syntax: {color:text})
      .replace(/\{red:(.*?)\}/g, '<span class="text-red-600 font-medium">$1</span>')
      .replace(/\{blue:(.*?)\}/g, '<span class="text-blue-600 font-medium">$1</span>')
      .replace(/\{green:(.*?)\}/g, '<span class="text-green-600 font-medium">$1</span>')
      .replace(/\{yellow:(.*?)\}/g, '<span class="text-yellow-600 font-medium">$1</span>')
      .replace(/\{purple:(.*?)\}/g, '<span class="text-purple-600 font-medium">$1</span>')
      
      // Highlights
      .replace(/==(.*?)==/g, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>')
      
      // Line breaks and paragraphs
      .replace(/\n\n/g, '</p><p class="mb-4 text-gray-700 leading-relaxed">')
      .replace(/\n/g, '<br>');

    // Wrap in paragraph tags if content doesn't start with a block element
    if (!html.startsWith('<h1>') && !html.startsWith('<h2>') && !html.startsWith('<h3>') && 
        !html.startsWith('<div>') && !html.startsWith('<blockquote>') && !html.startsWith('<pre>')) {
      html = `<p class="mb-4 text-gray-700 leading-relaxed">${html}</p>`;
    }

    return html;
  };

  const blogHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>${achievement.title} - SESG Research Achievement</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
      <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        .latex-formula, .latex-inline {
          font-family: 'Times New Roman', serif;
          color: #1e40af;
        }
        .video-container {
          position: relative;
          padding-bottom: 56.25%;
          height: 0;
          overflow: hidden;
        }
        .video-container iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        pre code {
          display: block;
          overflow-x: auto;
          padding: 1em;
        }
        table {
          border-collapse: collapse;
          margin: 1em 0;
        }
        figure {
          text-align: center;
          margin: 2em 0;
        }
        blockquote {
          position: relative;
        }
        blockquote::before {
          content: '"';
          font-size: 4em;
          color: #10b981;
          position: absolute;
          left: -0.5em;
          top: -0.2em;
          font-family: Georgia, serif;
        }
        .prose {
          max-width: none;
        }
        .prose p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }
        .prose h1, .prose h2, .prose h3 {
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .prose ul, .prose ol {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        .prose li {
          margin-bottom: 0.5rem;
        }
      </style>
      <script>
        window.MathJax = {
          tex: {
            inlineMath: [['$', '$'], ['\\\\(', '\\\\)']],
            displayMath: [['$$', '$$'], ['\\\\[', '\\\\]']]
          },
          svg: {
            fontCache: 'global'
          }
        };
      </script>
    </head>
    <body class="bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <div class="max-w-4xl mx-auto px-4 py-12">
        <!-- Header -->
        <div class="mb-12">
          <div class="flex items-center text-emerald-600 mb-6">
            <svg class="h-6 w-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
            </svg>
            <span class="text-sm font-medium uppercase tracking-wide">Research Achievement</span>
          </div>
          
          <h1 class="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            ${achievement.title}
          </h1>
          
          <div class="flex items-center text-gray-600 mb-8">
            <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span class="text-lg font-medium">${formatDate(achievement.date)}</span>
          </div>
          
          <div class="mb-8">
            <span class="bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium">
              ${achievement.category}
            </span>
            ${achievement.featured ? '<span class="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium ml-3">Featured</span>' : ''}
          </div>
        </div>
        
        <!-- Hero Image -->
        ${achievement.image ? `
        <div class="mb-12">
          <img src="${achievement.image}" alt="${achievement.title}" 
               class="w-full h-96 object-cover rounded-2xl shadow-2xl">
        </div>
        ` : ''}
        
        <!-- Short Description -->
        <div class="bg-gradient-to-r from-emerald-50 to-blue-50 border-l-4 border-emerald-400 p-8 mb-12 rounded-r-2xl">
          <p class="text-emerald-800 font-medium text-xl leading-relaxed">
            ${achievement.short_description}
          </p>
        </div>
        
        <!-- Main Content -->
        <div class="prose prose-lg max-w-none">
          <div class="text-gray-800 leading-relaxed">
            ${renderRichContent(achievement.description)}
          </div>
        </div>
        
        <!-- Footer -->
        <div class="mt-16 p-8 bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl">
          <h3 class="text-2xl font-bold text-gray-900 mb-4">About This Achievement</h3>
          <p class="text-gray-700 text-lg leading-relaxed mb-6">
            This achievement represents a significant milestone in our research journey at the 
            Sustainable Energy and Smart Grid Research. It demonstrates our commitment to 
            advancing the field through innovative solutions and collaborative efforts.
          </p>
          <div class="flex items-center text-gray-600">
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
            <span>SESG Research Group • Sustainable Energy & Smart Grid Research</span>
          </div>
        </div>
        
        <!-- Close Button -->
        <div class="mt-12 text-center">
          <button onclick="window.close()" 
                  class="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-medium text-lg transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform">
            Close Article
          </button>
        </div>
      </div>
    </body>
    </html>
  `;

  return blogHtml;
};

export const generateBlogContent = (achievement) => {
  const blogHtml = BlogContentRenderer({ achievement });
  
  // Open in new tab instead of new window (remove window specifications)
  const newTab = window.open('', '_blank');
  if (newTab) {
    newTab.document.write(blogHtml);
    newTab.document.close();
    
    // Add MathJax processing after content is loaded
    newTab.addEventListener('load', () => {
      if (newTab.MathJax) {
        newTab.MathJax.typesetPromise();
      }
    });
  } else {
    alert('Please allow popups for this site to view the full story.');
  }
};

export default BlogContentRenderer;