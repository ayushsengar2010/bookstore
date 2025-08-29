"use client";
import React, { useRef, useState, useEffect } from 'react';

interface PDFViewerProps {
  fileUrl: string | null;
}

const PDFViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
  const [scale, setScale] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Toolbar */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button
            onClick={handleZoomOut}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Zoom Out"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="text-sm text-gray-600">{Math.round(scale * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title="Zoom In"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>

        {/* Additional tools */}
        <div className="flex items-center gap-2 border-l border-gray-200 pl-4">
          <button className="flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Annotate
          </button>
          <button className="flex items-center gap-1 px-3 py-1 rounded-lg hover:bg-gray-100 transition-colors text-sm">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Bookmark
          </button>
        </div>
      </div>

      {/* PDF Viewer */}
      <div ref={containerRef} className="flex-1 overflow-auto p-4">
        {fileUrl ? (
          <div 
            className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden transition-transform"
            style={{ 
              maxWidth: '900px',
              transform: `scale(${scale})`,
              transformOrigin: 'top center'
            }}
          >
            <iframe
              src={`${fileUrl}#toolbar=0`}
              className="w-full h-[calc(100vh-120px)]"
              style={{ border: 'none' }}
              title="PDF Viewer"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500 text-lg">No PDF selected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PDFViewer;
