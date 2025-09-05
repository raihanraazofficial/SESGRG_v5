import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Link, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table,
  Image,
  Code,
  Quote,
  Strikethrough,
  Subscript,
  Superscript
} from 'lucide-react';

const RichTextEditor = ({ value, onChange, placeholder = "Start typing...", className = "" }) => {
  const editorRef = useRef(null);
  const [isEditorFocused, setIsEditorFocused] = useState(false);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // Execute command with real-time formatting
  const executeCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current.focus();
    handleContentChange();
  };

  // Handle content changes
  const handleContentChange = () => {
    if (editorRef.current && onChange) {
      const content = editorRef.current.innerHTML;
      onChange(content);
    }
  };

  // Insert table
  const insertTable = () => {
    const rows = prompt('Number of rows:', '3');
    const cols = prompt('Number of columns:', '3');
    
    if (rows && cols) {
      let tableHTML = '<table border="1" style="border-collapse: collapse; width: 100%; margin: 10px 0;">';
      for (let i = 0; i < parseInt(rows); i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < parseInt(cols); j++) {
          tableHTML += '<td style="padding: 8px; border: 1px solid #ddd;">&nbsp;</td>';
        }
        tableHTML += '</tr>';
      }
      tableHTML += '</table>';
      
      document.execCommand('insertHTML', false, tableHTML);
      handleContentChange();
    }
  };

  // Insert link
  const insertLink = () => {
    const url = prompt('Enter URL:', 'https://');
    if (url) {
      executeCommand('createLink', url);
    }
  };

  // Insert image
  const insertImage = () => {
    const url = prompt('Enter image URL:', 'https://');
    if (url) {
      executeCommand('insertImage', url);
    }
  };

  // Insert formula (LaTeX-like)
  const insertFormula = () => {
    const formula = prompt('Enter formula (LaTeX syntax):', 'E = mc^2');
    if (formula) {
      const formulaHTML = `<span style="font-family: 'Times New Roman', serif; font-style: italic; background: #f0f0f0; padding: 2px 4px; border-radius: 3px;">${formula}</span>`;
      document.execCommand('insertHTML', false, formulaHTML);
      handleContentChange();
    }
  };

  // Toolbar buttons configuration
  const toolbarButtons = [
    { command: 'bold', icon: Bold, title: 'Bold' },
    { command: 'italic', icon: Italic, title: 'Italic' },
    { command: 'underline', icon: Underline, title: 'Underline' },
    { command: 'strikeThrough', icon: Strikethrough, title: 'Strikethrough' },
    { command: 'subscript', icon: Subscript, title: 'Subscript' },
    { command: 'superscript', icon: Superscript, title: 'Superscript' },
    { type: 'separator' },
    { command: 'justifyLeft', icon: AlignLeft, title: 'Align Left' },
    { command: 'justifyCenter', icon: AlignCenter, title: 'Align Center' },
    { command: 'justifyRight', icon: AlignRight, title: 'Align Right' },
    { type: 'separator' },
    { command: 'insertUnorderedList', icon: List, title: 'Bullet List' },
    { command: 'insertOrderedList', icon: ListOrdered, title: 'Numbered List' },
    { command: 'formatBlock', icon: Quote, title: 'Quote', value: 'blockquote' },
    { type: 'separator' },
    { command: 'custom', icon: Link, title: 'Insert Link', action: insertLink },
    { command: 'custom', icon: Image, title: 'Insert Image', action: insertImage },
    { command: 'custom', icon: Table, title: 'Insert Table', action: insertTable },
    { command: 'formatBlock', icon: Code, title: 'Code Block', value: 'pre' },
    { command: 'custom', icon: Code, title: 'Insert Formula', action: insertFormula }
  ];

  return (
    <div className={`rich-text-editor border border-gray-300 rounded-lg ${className}`}>
      {/* Toolbar */}
      <div className="toolbar flex flex-wrap items-center gap-1 p-2 border-b border-gray-200 bg-gray-50">
        {toolbarButtons.map((button, index) => {
          if (button.type === 'separator') {
            return (
              <div key={index} className="w-px h-6 bg-gray-300 mx-1"></div>
            );
          }

          const Icon = button.icon;
          return (
            <button
              key={index}
              type="button"
              className="toolbar-btn flex items-center justify-center w-8 h-8 rounded hover:bg-gray-200 transition-colors"
              title={button.title}
              onClick={() => {
                if (button.command === 'custom' && button.action) {
                  button.action();
                } else if (button.value) {
                  executeCommand(button.command, button.value);
                } else {
                  executeCommand(button.command);
                }
              }}
            >
              <Icon className="w-4 h-4" />
            </button>
          );
        })}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        className="editor-content p-4 min-h-[200px] focus:outline-none"
        style={{ 
          minHeight: '200px',
          maxHeight: '400px',
          overflowY: 'auto'
        }}
        placeholder={placeholder}
        onInput={handleContentChange}
        onFocus={() => setIsEditorFocused(true)}
        onBlur={() => setIsEditorFocused(false)}
        dangerouslySetInnerHTML={{ __html: value || '' }}
      />

      {/* Status bar */}
      <div className="status-bar flex justify-between items-center px-4 py-2 bg-gray-50 border-t border-gray-200 text-xs text-gray-500">
        <span>Rich Text Editor</span>
        <span className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${isEditorFocused ? 'bg-green-500' : 'bg-gray-400'}`}></span>
          {isEditorFocused ? 'Focused' : 'Ready'}
        </span>
      </div>

      <style jsx>{`
        .rich-text-editor .editor-content:empty:before {
          content: attr(placeholder);
          color: #9ca3af;
        }
        
        .rich-text-editor .editor-content h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 0.67em 0;
        }
        
        .rich-text-editor .editor-content h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 0.75em 0;
        }
        
        .rich-text-editor .editor-content h3 {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0.83em 0;
        }
        
        .rich-text-editor .editor-content blockquote {
          border-left: 4px solid #e5e7eb;
          margin: 1em 0;
          padding-left: 1em;
          color: #6b7280;
        }
        
        .rich-text-editor .editor-content pre {
          background-color: #f3f4f6;
          border: 1px solid #e5e7eb;
          border-radius: 0.375rem;
          padding: 1em;
          overflow-x: auto;
          font-family: 'Courier New', monospace;
        }
        
        .rich-text-editor .editor-content ul, 
        .rich-text-editor .editor-content ol {
          padding-left: 2em;
          margin: 1em 0;
        }
        
        .rich-text-editor .editor-content li {
          margin: 0.25em 0;
        }
        
        .rich-text-editor .editor-content a {
          color: #3b82f6;
          text-decoration: underline;
        }
        
        .rich-text-editor .editor-content img {
          max-width: 100%;
          height: auto;
          margin: 0.5em 0;
        }
        
        .rich-text-editor .editor-content table {
          border-collapse: collapse;
          width: 100%;
          margin: 1em 0;
        }
        
        .rich-text-editor .editor-content td, 
        .rich-text-editor .editor-content th {
          border: 1px solid #e5e7eb;
          padding: 0.5em;
        }
      `}</style>
    </div>
  );
};

export default RichTextEditor;