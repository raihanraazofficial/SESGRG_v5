import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

// Custom LaTeX renderer component for better error handling and display
const LaTeXRenderer = ({ math, block = false }) => {
  try {
    if (block) {
      return (
        <div className="my-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg overflow-x-auto">
          <div className="flex items-center mb-2">
            <svg className="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="text-xs font-medium text-emerald-800 uppercase tracking-wide">Mathematical Formula</span>
          </div>
          <div className="text-center">
            <BlockMath math={math} />
          </div>
        </div>
      );
    } else {
      return (
        <span className="inline-math bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">
          <InlineMath math={math} />
        </span>
      );
    }
  } catch (error) {
    console.warn('LaTeX rendering error:', error);
    // Fallback display for invalid LaTeX
    return (
      <span className={`${block ? 'block' : 'inline'} bg-red-50 text-red-800 px-2 py-1 rounded border border-red-200 font-mono text-sm`}>
        LaTeX Error: {math}
      </span>
    );
  }
};

// Helper function to parse text and convert LaTeX expressions
export const parseLatexContent = (content) => {
  if (!content) return '';

  // Split content by LaTeX patterns while preserving the delimiters
  const parts = content.split(/(\$\$[^$]*\$\$|\$[^$]*\$)/);
  
  return parts.map((part, index) => {
    // Block math ($$...$$)
    if (part.startsWith('$$') && part.endsWith('$$')) {
      const math = part.slice(2, -2).trim();
      return <LaTeXRenderer key={index} math={math} block={true} />;
    }
    // Inline math ($...$)
    else if (part.startsWith('$') && part.endsWith('$')) {
      const math = part.slice(1, -1).trim();
      return <LaTeXRenderer key={index} math={math} block={false} />;
    }
    // Regular text
    else {
      return part;
    }
  });
};

export default LaTeXRenderer;