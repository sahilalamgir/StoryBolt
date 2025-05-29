"use client";

import React, { useState } from 'react';
import { Download } from 'lucide-react';
import jsPDF from 'jspdf';
import type Story from '@/types/story';

interface DownloadButtonProps {
  story: Story;
}

const DownloadButton = ({ story }: DownloadButtonProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    try {
      setIsGenerating(true);
      
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set title page
      doc.setFontSize(24);
      doc.setFont('helvetica', 'bold');
      doc.text(story.title, 105, 40, { align: 'center' });
      
      doc.setFontSize(16);
      doc.setFont('helvetica', 'normal');
      doc.text(`Genre: ${story.genre}`, 105, 50, { align: 'center' });
      
      // Load and add cover image
      if (story.images[0]) {
        try {
          // Pre-load all images to ensure they're valid
          const coverImageObj = await createImageElement(story.images[0]);
          // Use toDataURL to get base64 string
          const coverImageData = getImageDataUrl(coverImageObj);
          doc.addImage(coverImageData, 'JPEG', 50, 70, 110, 110);
        } catch (err) {
          console.error('Error loading cover image:', err);
        }
      }
      
      // Add each page with image and paragraph
      for (let i = 0; i < story.paragraphs.length; i++) {
        doc.addPage();
        
        // Page number
        doc.setFontSize(12);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i + 2} of ${story.paragraphs.length + 1}`, 105, 280, { align: 'center' });
        
        // Add page image
        if (story.images[i + 1]) {
          try {
            const pageImageObj = await createImageElement(story.images[i + 1]);
            const pageImageData = getImageDataUrl(pageImageObj);
            doc.addImage(pageImageData, 'JPEG', 50, 30, 110, 110);
          } catch (err) {
            console.error(`Error loading image ${i + 1}:`, err);
          }
        }
        
        // Add paragraph text
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont('helvetica', 'normal');
        
        const paragraph = story.paragraphs[i];
        const lines = doc.splitTextToSize(paragraph, 170);
        doc.text(lines, 20, 160);
      }
      
      // Save the PDF
      doc.save(`${story.title.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Helper function to create image element and wait for it to load
  const createImageElement = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Try with anonymous instead of Anonymous
      
      // For relative URLs, prepend with origin
      if (!src.startsWith('http') && !src.startsWith('data:')) {
        src = `${window.location.origin}${src.startsWith('/') ? '' : '/'}${src}`;
      }
      
      img.onload = () => resolve(img);
      img.onerror = (e) => {
        console.error('Image load error:', e);
        reject(new Error(`Failed to load image: ${src}`));
      };
      
      // Set src after setting up event handlers
      img.src = src;
    });
  };
  
  // Convert image element to data URL
  const getImageDataUrl = (img: HTMLImageElement): string => {
    // Create a canvas element
    const canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    
    // Draw the image onto the canvas
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');
    
    ctx.drawImage(img, 0, 0);
    
    // Get data URL from canvas
    try {
      return canvas.toDataURL('image/jpeg');
    } catch (e) {
      console.error('Canvas toDataURL error:', e);
      throw new Error('Failed to convert image to data URL');
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className={`flex gap-x-1.5 items-center bg-white border-2 
                border-indigo-600 text-indigo-600
                font-bold mt-1 py-2.5 px-3 rounded-xl hover:bg-indigo-50 
                active:bg-indigo-100 transition
                ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      <Download size={18} />
    </button>
  );
};

export default DownloadButton;