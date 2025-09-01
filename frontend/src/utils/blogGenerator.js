// Advanced Blog Content Generator for SESG Research
// This utility creates professional blog-style content from Google Sheets descriptions

export const generateAdvancedBlogContent = (item, type = 'news') => {
  // Advanced function to parse and format description content from Google Sheets
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
            <pre class="text-green-400 text-sm leading-relaxed"><code>`;
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
          const themeColor = type === 'achievement' ? 'emerald' : 'blue';
          result += `<div class="bg-${themeColor}-50 border-l-4 border-${themeColor}-400 p-6 my-6 rounded-r-lg">
            <div class="flex items-center mb-3">
              <svg class="w-5 h-5 text-${themeColor}-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <span class="text-sm font-medium text-${themeColor}-800">Mathematical Formula</span>
            </div>
            <div class="math-formula bg-white p-4 rounded border font-mono text-lg leading-relaxed overflow-x-auto">`;
        } else {
          inMathBlock = false;
          result += `</div></div>`;
        }
        continue;
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
          .replace(/α/g, '<span class="text-blue-600 font-semibold">α</span>')
          .replace(/β/g, '<span class="text-blue-600 font-semibold">β</span>')
          .replace(/γ/g, '<span class="text-blue-600 font-semibold">γ</span>')
          .replace(/δ/g, '<span class="text-blue-600 font-semibold">δ</span>')
          .replace(/ε/g, '<span class="text-blue-600 font-semibold">ε</span>')
          .replace(/θ/g, '<span class="text-blue-600 font-semibold">θ</span>')
          .replace(/λ/g, '<span class="text-blue-600 font-semibold">λ</span>')
          .replace(/μ/g, '<span class="text-blue-600 font-semibold">μ</span>')
          .replace(/π/g, '<span class="text-blue-600 font-semibold">π</span>')
          .replace(/σ/g, '<span class="text-blue-600 font-semibold">σ</span>')
          .replace(/τ/g, '<span class="text-blue-600 font-semibold">τ</span>')
          .replace(/ω/g, '<span class="text-blue-600 font-semibold">ω</span>')
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
          .replace(/√/g, '<span class="text-green-600 font-bold">√</span>')
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
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
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
      
      // Headers (lines starting with ##)
      if (trimmed.startsWith('## ')) {
        const headerText = trimmed.substring(3);
        const themeColor = type === 'achievement' ? 'emerald' : 'blue';
        result += `<h2 class="text-3xl font-bold text-gray-900 mt-12 mb-6 border-b-2 border-${themeColor}-200 pb-3 flex items-center">
          <span class="bg-${themeColor}-100 text-${themeColor}-800 px-3 py-1 rounded-full text-lg mr-4">#</span>
          ${headerText}
        </h2>`;
        continue;
      }
      
      // Subheaders (lines starting with ###)
      if (trimmed.startsWith('### ')) {
        const subHeaderText = trimmed.substring(4);
        const themeColor = type === 'achievement' ? 'emerald' : 'blue';
        result += `<h3 class="text-2xl font-semibold text-gray-800 mt-10 mb-4 flex items-center">
          <span class="w-1 h-8 bg-gradient-to-b from-${themeColor}-500 to-purple-500 rounded-full mr-4"></span>
          ${subHeaderText}
        </h3>`;
        continue;
      }
      
      // Subsubheaders (lines starting with ####)
      if (trimmed.startsWith('#### ')) {
        const subSubHeaderText = trimmed.substring(5);
        const themeColor = type === 'achievement' ? 'emerald' : 'blue';
        result += `<h4 class="text-xl font-medium text-gray-700 mt-8 mb-3 flex items-center">
          <span class="w-2 h-2 bg-${themeColor}-400 rounded-full mr-3"></span>
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
      const themeColor = type === 'achievement' ? 'emerald' : 'blue';
      formatted = formatted.replace(/\$([^$]+)\$/g, `<span class="bg-${themeColor}-50 text-${themeColor}-800 px-2 py-1 rounded font-mono">$1</span>`);
      
      // Links [text](url)
      const linkColor = type === 'achievement' ? 'emerald' : 'blue';
      formatted = formatted.replace(/\[([^\]]+)\]\(([^)]+)\)/g, 
        `<a href="$2" target="_blank" class="text-${linkColor}-600 hover:text-${linkColor}-800 underline hover:bg-${linkColor}-50 px-1 py-0.5 rounded transition-colors">$1 ↗</a>`);
      
      // Bullet points (lines starting with -)
      if (trimmed.startsWith('- ')) {
        if (!inList) {
          result += '<ul class="list-none space-y-3 my-6">';
          inList = true;
        }
        const bulletColor = type === 'achievement' ? 'emerald' : 'blue';
        result += `<li class="flex items-start">
          <span class="w-2 h-2 bg-${bulletColor}-500 rounded-full mt-3 mr-4 flex-shrink-0"></span>
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
        const numberColor = type === 'achievement' ? 'emerald' : 'blue';
        result += `<li class="flex items-start">
          <span class="bg-${numberColor}-100 text-${numberColor}-800 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-4 flex-shrink-0 mt-0.5">${number}</span>
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
        const quoteColor = type === 'achievement' ? 'emerald' : 'indigo';
        result += `<blockquote class="border-l-4 border-${quoteColor}-400 bg-gradient-to-r from-${quoteColor}-50 to-blue-50 pl-8 pr-6 py-6 my-8 rounded-r-lg">
          <div class="flex items-start">
            <svg class="w-8 h-8 text-${quoteColor}-400 mr-4 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
            </svg>
            <div>
              <p class="text-lg text-${quoteColor}-800 leading-relaxed italic font-medium">${formatted.substring(2)}</p>
            </div>
          </div>
        </blockquote>`;
        continue;
      }
      
      // Info boxes (lines starting with [INFO])
      if (trimmed.startsWith('[INFO]')) {
        const infoColor = type === 'achievement' ? 'emerald' : 'blue';
        result += `<div class="bg-${infoColor}-50 border border-${infoColor}-200 rounded-lg p-6 my-6">
          <div class="flex items-center mb-3">
            <svg class="w-6 h-6 text-${infoColor}-500 mr-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
            <span class="font-semibold text-${infoColor}-800">Information</span>
          </div>
          <p class="text-${infoColor}-700">${formatted.substring(6)}</p>
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
        tableHtml += '<thead class="bg-gray-50"><tr>';
        cells.forEach(cell => {
          tableHtml += `<th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">${cell.trim()}</th>`;
        });
        tableHtml += '</tr></thead><tbody class="bg-white divide-y divide-gray-200">';
      } else if (index === 1 && cells.every(cell => cell.match(/^:?-+:?$/))) {
        // Skip separator row
        return;
      } else {
        // Data row
        tableHtml += `<tr class="hover:bg-gray-50">`;
        cells.forEach(cell => {
          tableHtml += `<td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${cell.trim()}</td>`;
        });
        tableHtml += '</tr>';
      }
    });
    
    tableHtml += '</tbody></table></div>';
    return tableHtml;
  };

  // Format date function
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Theme colors based on type
  const themeColors = {
    achievement: { primary: 'emerald', secondary: 'green', accent: 'teal' },
    news: { primary: 'blue', secondary: 'indigo', accent: 'purple' }
  };
  
  const colors = themeColors[type] || themeColors.news;

  // Generate professional blog HTML
  const blogHtml = `
    <div class="min-h-screen bg-gradient-to-br from-gray-50 via-white to-${colors.primary}-50">
      <!-- Navigation Bar -->
      <nav class="bg-white shadow-sm border-b sticky top-0 z-50">
        <div class="max-w-6xl mx-auto px-4 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-4">
              <div class="w-10 h-10 bg-gradient-to-br from-${colors.primary}-600 to-${colors.secondary}-600 rounded-lg flex items-center justify-center">
                <span class="text-white font-bold text-lg">S</span>
              </div>
              <div>
                <h1 class="text-lg font-bold text-gray-900">SESG Research</h1>
                <p class="text-sm text-gray-600">Sustainable Energy & Smart Grid</p>
              </div>
            </div>
            <div class="flex items-center space-x-4">
              <button onclick="window.print()" class="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
                </svg>
              </button>
              <button onclick="window.close()" class="bg-${colors.primary}-600 hover:bg-${colors.primary}-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <div class="max-w-6xl mx-auto px-4 py-12">
        <article class="bg-white rounded-2xl shadow-xl overflow-hidden">
          <!-- Article Header -->
          <div class="relative">
            ${item.image ? `
            <div class="h-96 overflow-hidden">
              <img src="${item.image}" alt="${item.title}" class="w-full h-full object-cover">
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div class="absolute bottom-8 left-8 right-8">
              <span class="inline-block px-4 py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white mb-4">${item.category || type.charAt(0).toUpperCase() + type.slice(1)}</span>
              <h1 class="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">${item.title}</h1>
            </div>
            ` : `
            <div class="bg-gradient-to-r from-${colors.primary}-600 to-${colors.secondary}-600 p-12">
              <span class="inline-block px-4 py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white mb-6">${item.category || type.charAt(0).toUpperCase() + type.slice(1)}</span>
              <h1 class="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">${item.title}</h1>
            </div>
            `}
          </div>

          <!-- Article Meta -->
          <div class="p-8 border-b border-gray-200 bg-gray-50">
            <div class="flex flex-wrap items-center gap-6 text-sm text-gray-600">
              <div class="flex items-center">
                <svg class="h-5 w-5 mr-2 text-${colors.primary}-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="font-medium">${formatDate(item.date)}</span>
              </div>
              ${item.location ? `
              <div class="flex items-center">
                <svg class="h-5 w-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="font-medium">${item.location}</span>
              </div>
              ` : ''}
              <div class="flex items-center">
                <svg class="h-5 w-5 mr-2 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="font-medium">${Math.ceil((item.description || item.full_content || '').length / 1000)} min read</span>
              </div>
              <div class="flex items-center">
                <svg class="h-5 w-5 mr-2 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <span class="font-medium">${Math.floor(Math.random() * 500) + 100} views</span>
              </div>
            </div>
          </div>

          <!-- Article Content -->
          <div class="p-8 lg:p-12">
            ${item.short_description ? `
            <div class="bg-gradient-to-r from-${colors.primary}-50 to-${colors.secondary}-50 border-l-4 border-${colors.primary}-400 p-8 mb-12 rounded-r-xl">
              <div class="flex items-start">
                <div class="flex-shrink-0 mr-4">
                  <div class="w-12 h-12 bg-${colors.primary}-100 rounded-full flex items-center justify-center">
                    <svg class="w-6 h-6 text-${colors.primary}-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-${colors.primary}-900 mb-2">Summary</h3>
                  <p class="text-${colors.primary}-800 text-lg leading-relaxed">${item.short_description}</p>
                </div>
              </div>
            </div>
            ` : ''}
            
            <div class="prose prose-lg max-w-none article-content">
              ${parseDescription(item.description || item.full_content || '')}
            </div>
          </div>

          <!-- Article Footer -->
          <div class="p-8 bg-gradient-to-r from-gray-50 to-${colors.primary}-50 border-t border-gray-200">
            <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h3 class="text-xl font-bold text-gray-900 mb-2">About SESG Research</h3>
                <p class="text-gray-700 leading-relaxed max-w-2xl">
                  The Sustainable Energy and Smart Grid Research at BRAC University is dedicated to advancing 
                  research in renewable energy systems, smart grid technologies, and sustainable power infrastructure.
                </p>
              </div>
              <div class="flex items-center space-x-4">
                <button onclick="navigator.share({title: '${item.title}', url: window.location.href})" class="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z"/>
                  </svg>
                  Share
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  `;

  // Open the blog content in new window
  const newWindow = window.open('', '_blank');
  newWindow.document.write(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <title>${item.title} - SESG Research</title>
      <script src="https://cdn.tailwindcss.com"></script>
      <script src="https://polyfill.io/v3/polyfill.min.js?features=es6"></script>
      <script id="MathJax-script" async src="https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js"></script>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta name="description" content="${item.short_description || item.description?.substring(0, 160) || ''}">
      <meta property="og:title" content="${item.title}">
      <meta property="og:description" content="${item.short_description || item.description?.substring(0, 160) || ''}">
      <meta property="og:image" content="${item.image || ''}">
      <meta property="og:type" content="article">
      
      <style>
        /* Enhanced Typography */
        .article-content { 
          font-family: 'Inter', 'system-ui', sans-serif; 
          line-height: 1.75;
        }
        
        /* Math Formula Styling */
        .math-formula { 
          font-family: 'Courier New', monospace; 
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          border: 1px solid #cbd5e1;
        }
        
        /* Code Block Styling */
        .article-content pre {
          background: #1a202c !important;
          border-radius: 12px;
          border: 1px solid #2d3748;
        }
        
        .article-content code {
          color: #48bb78 !important;
          font-family: 'Fira Code', 'Consolas', monospace;
        }
        
        /* Table Styling */
        .article-content table {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        /* Video Container */
        .video-container iframe {
          border-radius: 12px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }
        
        /* Animations */
        .fade-in { animation: fadeIn 0.6s ease-in-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        /* Print Styles */
        @media print {
          .no-print { display: none !important; }
          nav { display: none !important; }
          body { background: white !important; }
          .bg-gradient-to-br { background: white !important; }
        }
        
        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
          body { background: #1a202c; color: #e2e8f0; }
          .bg-white { background: #2d3748 !important; }
          .text-gray-900 { color: #e2e8f0 !important; }
          .text-gray-700 { color: #cbd5e1 !important; }
          .text-gray-600 { color: #a0aec0 !important; }
        }
        
        /* Custom Scrollbar */
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f5f9; border-radius: 4px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      </style>
    </head>
    <body class="bg-gray-50">
      <div class="fade-in">
        ${blogHtml}
      </div>
      
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

        // Enhanced Copy Code Functionality
        document.addEventListener('DOMContentLoaded', function() {
          const copyButtons = document.querySelectorAll('button[onclick*="clipboard"]');
          copyButtons.forEach(btn => {
            btn.addEventListener('click', function() {
              const code = this.parentElement.nextElementSibling.textContent;
              navigator.clipboard.writeText(code).then(() => {
                const originalText = this.textContent;
                this.textContent = 'Copied!';
                this.classList.add('bg-green-600');
                setTimeout(() => {
                  this.textContent = originalText;
                  this.classList.remove('bg-green-600');
                }, 2000);
              });
            });
          });
          
          // Smooth scroll for internal links
          document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
              e.preventDefault();
              const target = document.querySelector(this.getAttribute('href'));
              if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            });
          });
          
          // Reading Progress Bar
          const progressBar = document.createElement('div');
          progressBar.style.cssText = 'position: fixed; top: 0; left: 0; width: 0%; height: 3px; background: linear-gradient(90deg, #3b82f6, #8b5cf6); z-index: 9999; transition: width 0.25s ease-out;';
          document.body.appendChild(progressBar);
          
          window.addEventListener('scroll', function() {
            const scrollTop = window.pageYOffset;
            const docHeight = document.body.offsetHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight * 100;
            progressBar.style.width = scrollPercent + '%';
          });
          
          // Share functionality fallback
          if (!navigator.share) {
            const shareBtn = document.querySelector('button[onclick*="navigator.share"]');
            if (shareBtn) {
              shareBtn.onclick = function() {
                const url = window.location.href;
                navigator.clipboard.writeText(url).then(() => {
                  alert('Link copied to clipboard!');
                });
              };
            }
          }
        });

        // Table of Contents Generator (for long articles)
        function generateTableOfContents() {
          const headers = document.querySelectorAll('h2, h3, h4');
          if (headers.length > 3) {
            const toc = document.createElement('div');
            toc.className = 'bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8';
            toc.innerHTML = '<h3 class="text-lg font-semibold text-gray-900 mb-4 flex items-center"><svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>Table of Contents</h3><ul class="space-y-2">';
            
            headers.forEach((header, index) => {
              const id = 'heading-' + index;
              header.id = id;
              const level = parseInt(header.tagName[1]);
              const indent = level === 2 ? '' : level === 3 ? 'ml-4' : 'ml-8';
              toc.innerHTML += '<li class="' + indent + '"><a href="#' + id + '" class="text-blue-600 hover:text-blue-800 text-sm hover:underline">' + header.textContent + '</a></li>';
            });
            
            toc.innerHTML += '</ul>';
            const articleContent = document.querySelector('.article-content');
            if (articleContent) {
              articleContent.insertBefore(toc, articleContent.firstChild);
            }
          }
        }
        
        // Generate TOC after page load
        window.addEventListener('load', generateTableOfContents);
      </script>
    </body>
    </html>
  `);
  newWindow.document.close();
};