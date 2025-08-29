"use client";
import React, { useRef, useState } from 'react';

interface Highlight {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface PDFHighlightLayerProps {
  highlights: Highlight[];
  page: number;
}

const PDFHighlightLayer: React.FC<PDFHighlightLayerProps> = ({ highlights, page }) => {
  return (
    <>
      {highlights.filter(h => h.page === page).map((h, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: h.x,
            top: h.y,
            width: h.width,
            height: h.height,
            background: h.color,
            opacity: 0.4,
            pointerEvents: 'none',
            borderRadius: '4px',
          }}
        />
      ))}
    </>
  );
};

export default PDFHighlightLayer;
