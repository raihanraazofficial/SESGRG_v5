import React, { useState, useRef, useEffect } from 'react';
import { 
  Bold, Italic, Underline, Strikethrough, AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Code, Link2, Image, Video, Type, Palette,
  Subscript, Superscript, Minus, Hash, Table, FileText, Eye, Edit3
} from 'lucide-react';
import { Button } from './ui/button';

const RichTextEditor = ({ value, onChange, placeholder = "Write your content..." }) => {
  const [content, setContent] = useState(value || '');
  const [selectedText, setSelectedText] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [showLatexModal, setShowLatexModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [showTableModal, setShowTableModal] = useState(false);
  const editorRef = useRef(null);
  const [latexInput, setLatexInput] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

  useEffect(() => {
    if (value !== content) {
      setContent(value || '');
    }
  }, [value]);

  const handleContentChange = (newContent) => {
    setContent(newContent);
    onChange(newContent);
  };

  const getSelectedText = () => {
    if (editorRef.current) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const selectedContent = range.toString();
        const start = editorRef.current.selectionStart;
        const end = editorRef.current.selectionEnd;
        return { text: selectedContent, start, end };
      }
    }
    return { text: '', start: 0, end: 0 };
  };

  const insertAtCursor = (before, after = '', replacement = null) => {
    if (editorRef.current) {
      const start = editorRef.current.selectionStart;
      const end = editorRef.current.selectionEnd;
      const selectedText = content.substring(start, end);
      const textToInsert = replacement || selectedText;
      
      const newContent = 
        content.substring(0, start) + 
        before + textToInsert + after + 
        content.substring(end);
      
      handleContentChange(newContent);
      
      // Set cursor position
      setTimeout(() => {
        const newCursorPos = start + before.length + textToInsert.length + after.length;
        editorRef.current.focus();
        editorRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    }
  };

  const formatText = (format) => {
    const selection = getSelectedText();
    const selectedText = selection.text;

    switch (format) {
      case 'bold':
        insertAtCursor('**', '**');
        break;
      case 'italic':
        insertAtCursor('*', '*');
        break;
      case 'underline':
        insertAtCursor('<u>', '</u>');
        break;
      case 'strikethrough':
        insertAtCursor('~~', '~~');
        break;
      case 'code':
        if (selectedText.includes('\n')) {
          insertAtCursor('```\n', '\n```');
        } else {
          insertAtCursor('`', '`');
        }
        break;
      case 'blockquote':
        insertAtCursor('> ', '');
        break;
      case 'h1':
        insertAtCursor('# ', '');
        break;
      case 'h2':
        insertAtCursor('## ', '');
        break;
      case 'h3':
        insertAtCursor('### ', '');
        break;
      case 'ul':
        insertAtCursor('- ', '');
        break;
      case 'ol':
        insertAtCursor('1. ', '');
        break;
      case 'hr':
        insertAtCursor('\n---\n', '');
        break;
      case 'subscript':
        insertAtCursor('<sub>', '</sub>');
        break;
      case 'superscript':
        insertAtCursor('<sup>', '</sup>');
        break;
      default:
        break;
    }
  };

  const insertLatex = () => {
    if (latexInput.trim()) {
      insertAtCursor('$$', '$$', latexInput);
      setLatexInput('');
      setShowLatexModal(false);
    }
  };

  const insertLink = () => {
    if (linkUrl.trim()) {
      const text = linkText.trim() || linkUrl;
      insertAtCursor('', '', `[${text}](${linkUrl})`);
      setLinkText('');
      setLinkUrl('');
      setShowLinkModal(false);
    }
  };

  const insertImage = () => {
    if (imageUrl.trim()) {
      const alt = imageAlt.trim() || 'Image';
      insertAtCursor('', '', `![${alt}](${imageUrl})`);
      setImageUrl('');
      setImageAlt('');
      setShowImageModal(false);
    }
  };

  const insertVideo = () => {
    const url = prompt('Enter video URL (YouTube, Vimeo, etc.):');
    if (url) {
      insertAtCursor('', '', `<iframe width="560" height="315" src="${url}" frameborder="0" allowfullscreen></iframe>`);
    }
  };

  const insertTable = () => {
    let tableMarkdown = '\n';
    
    // Header row
    for (let col = 0; col < tableCols; col++) {
      tableMarkdown += `| Header ${col + 1} `;
    }
    tableMarkdown += '|\n';
    
    // Separator row
    for (let col = 0; col < tableCols; col++) {
      tableMarkdown += '| --- ';
    }
    tableMarkdown += '|\n';
    
    // Data rows
    for (let row = 0; row < tableRows; row++) {
      for (let col = 0; col < tableCols; col++) {
        tableMarkdown += `| Cell ${row + 1}-${col + 1} `;
      }
      tableMarkdown += '|\n';
    }
    
    insertAtCursor('', '', tableMarkdown);
    setShowTableModal(false);
  };

  const renderPreview = (text) => {
    // Simple markdown to HTML conversion for preview
    let html = text
      // LaTeX (basic)
      .replace(/\$\$(.*?)\$\$/g, '<span class="latex-formula bg-blue-50 p-1 rounded">$1</span>')
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold">$1</h1>')
      // Bold and Italic
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Underline and Strikethrough
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/~~(.*?)~~/g, '<del>$1</del>')
      // Code
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/```\n(.*?)\n```/gs, '<pre class="bg-gray-100 p-2 rounded overflow-x-auto"><code>$1</code></pre>')
      // Links
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 underline" target="_blank">$1</a>')
      // Images
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="max-w-full h-auto rounded" />')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
      // Lists
      .replace(/^- (.*$)/gim, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4">$1</li>')
      // Horizontal rule
      .replace(/^---$/gim, '<hr class="my-4 border-gray-300" />')
      // Line breaks
      .replace(/\n/g, '<br>');

    return html;
  };

  const toolbarButtons = [
    { icon: Bold, action: () => formatText('bold'), title: 'Bold (Ctrl+B)', shortcut: 'Ctrl+B' },
    { icon: Italic, action: () => formatText('italic'), title: 'Italic (Ctrl+I)', shortcut: 'Ctrl+I' },
    { icon: Underline, action: () => formatText('underline'), title: 'Underline (Ctrl+U)' },
    { icon: Strikethrough, action: () => formatText('strikethrough'), title: 'Strikethrough' },
    { separator: true },
    { icon: Hash, action: () => formatText('h1'), title: 'Heading 1' },
    { icon: Hash, action: () => formatText('h2'), title: 'Heading 2', className: 'text-sm' },
    { icon: Hash, action: () => formatText('h3'), title: 'Heading 3', className: 'text-xs' },
    { separator: true },
    { icon: List, action: () => formatText('ul'), title: 'Bullet List' },
    { icon: ListOrdered, action: () => formatText('ol'), title: 'Numbered List' },
    { icon: Quote, action: () => formatText('blockquote'), title: 'Blockquote' },
    { separator: true },
    { icon: Code, action: () => formatText('code'), title: 'Code' },
    { icon: FileText, action: () => setShowLatexModal(true), title: 'LaTeX Formula' },
    { separator: true },
    { icon: Link2, action: () => setShowLinkModal(true), title: 'Insert Link' },
    { icon: Image, action: () => setShowImageModal(true), title: 'Insert Image' },
    { icon: Video, action: insertVideo, title: 'Insert Video' },
    { icon: Table, action: () => setShowTableModal(true), title: 'Insert Table' },
    { separator: true },
    { icon: Subscript, action: () => formatText('subscript'), title: 'Subscript' },
    { icon: Superscript, action: () => formatText('superscript'), title: 'Superscript' },
    { icon: Minus, action: () => formatText('hr'), title: 'Horizontal Rule' }
  ];

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
        {toolbarButtons.map((button, index) => (
          button.separator ? (
            <div key={index} className="w-px bg-gray-300 mx-1 self-stretch" />
          ) : (
            <Button
              key={index}
              type="button"
              variant="ghost"
              size="sm"
              onClick={button.action}
              title={button.title}
              className={`h-8 w-8 p-0 hover:bg-gray-200 ${button.className || ''}`}
            >
              <button.icon className="h-4 w-4" />
            </Button>
          )
        ))}
        
        <div className="ml-auto flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="h-8 px-3 hover:bg-gray-200"
          >
            {showPreview ? <Edit3 className="h-4 w-4 mr-1" /> : <Eye className="h-4 w-4 mr-1" />}
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
        </div>
      </div>

      {/* Editor/Preview */}
      <div className="relative">
        {showPreview ? (
          <div 
            className="p-4 min-h-[300px] prose max-w-none bg-white"
            dangerouslySetInnerHTML={{ __html: renderPreview(content) }}
          />
        ) : (
          <textarea
            ref={editorRef}
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={placeholder}
            className="w-full p-4 min-h-[300px] resize-y border-none focus:outline-none focus:ring-0 font-mono text-sm"
            style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
            onKeyDown={(e) => {
              // Handle keyboard shortcuts
              if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                  case 'b':
                    e.preventDefault();
                    formatText('bold');
                    break;
                  case 'i':
                    e.preventDefault();
                    formatText('italic');
                    break;
                  case 'u':
                    e.preventDefault();
                    formatText('underline');
                    break;
                }
              }
            }}
          />
        )}
      </div>

      {/* LaTeX Modal */}
      {showLatexModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Insert LaTeX Formula</h3>
            <input
              type="text"
              value={latexInput}
              onChange={(e) => setLatexInput(e.target.value)}
              placeholder="Enter LaTeX formula (e.g., E = mc^2)"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowLatexModal(false)}>Cancel</Button>
              <Button onClick={insertLatex} className="bg-emerald-600 hover:bg-emerald-700">Insert</Button>
            </div>
          </div>
        </div>
      )}

      {/* Link Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Insert Link</h3>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Link text (optional)"
              className="w-full p-2 border border-gray-300 rounded mb-2"
            />
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="URL"
              className="w-full p-2 border border-gray-300 rounded mb-4"
              autoFocus
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowLinkModal(false)}>Cancel</Button>
              <Button onClick={insertLink} className="bg-emerald-600 hover:bg-emerald-700">Insert</Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Insert Image</h3>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL"
              className="w-full p-2 border border-gray-300 rounded mb-2"
              autoFocus
            />
            <input
              type="text"
              value={imageAlt}
              onChange={(e) => setImageAlt(e.target.value)}
              placeholder="Alt text"
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowImageModal(false)}>Cancel</Button>
              <Button onClick={insertImage} className="bg-emerald-600 hover:bg-emerald-700">Insert</Button>
            </div>
          </div>
        </div>
      )}

      {/* Table Modal */}
      {showTableModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-bold mb-4">Insert Table</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rows</label>
                <input
                  type="number"
                  value={tableRows}
                  onChange={(e) => setTableRows(parseInt(e.target.value) || 1)}
                  min="1"
                  max="10"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Columns</label>
                <input
                  type="number"
                  value={tableCols}
                  onChange={(e) => setTableCols(parseInt(e.target.value) || 1)}
                  min="1"
                  max="10"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowTableModal(false)}>Cancel</Button>
              <Button onClick={insertTable} className="bg-emerald-600 hover:bg-emerald-700">Insert</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;