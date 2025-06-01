"use client";

import React, { useState } from "react";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import type Story from "@/types/story";
import { useToast } from "@/components/ui/toast";

const DownloadButton = ({ story }: { story: Story }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { addToast } = useToast();

  const generatePDF = async () => {
    try {
      setIsGenerating(true);

      const doc = new jsPDF();

      // Helper function to create image element
      const createImageElement = (src: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = reject;
          img.src = src;
        });
      };

      // Helper function to get image data URL
      const getImageDataUrl = (img: HTMLImageElement): string => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0);
        return canvas.toDataURL("image/jpeg");
      };

      // Add title page
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      const titleLines = doc.splitTextToSize(story.title, 170);
      doc.text(titleLines, 105, 60, { align: "center" });

      // Add author information
      doc.setFontSize(16);
      doc.setFont("helvetica", "italic");
      const authorLines = doc.splitTextToSize(`by ${story.authorName}`, 170);
      doc.text(authorLines, 105, 80, { align: "center" });

      // Add genre
      doc.setFontSize(14);
      doc.setFont("helvetica", "normal");
      doc.text(`Genre: ${story.genre}`, 105, 100, { align: "center" });

      // Add cover image if available
      if (story.images[0]) {
        try {
          const coverImageObj = await createImageElement(story.images[0]);
          const coverImageData = getImageDataUrl(coverImageObj);
          doc.addImage(coverImageData, "JPEG", 50, 120, 110, 110);
        } catch (err) {
          console.error("Error loading cover image:", err);
        }
      }

      // Add each page with image and paragraph
      for (let i = 0; i < story.paragraphs.length; i++) {
        doc.addPage();

        // Page number
        doc.setFontSize(12);
        doc.setTextColor(150, 150, 150);
        doc.text(`Page ${i + 2} of ${story.paragraphs.length + 1}`, 105, 280, {
          align: "center",
        });

        // Add page image
        if (story.images[i + 1]) {
          try {
            const pageImageObj = await createImageElement(story.images[i + 1]);
            const pageImageData = getImageDataUrl(pageImageObj);
            doc.addImage(pageImageData, "JPEG", 50, 30, 110, 110);
          } catch (err) {
            console.error(`Error loading image ${i + 1}:`, err);
          }
        }

        // Add paragraph text
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");

        const paragraph = story.paragraphs[i];
        const lines = doc.splitTextToSize(paragraph, 170);
        doc.text(lines, 20, 160);
      }

      // Save the PDF
      doc.save(`${story.title.replace(/\s+/g, "_")}.pdf`);
      addToast("PDF downloaded successfully!", "success");
    } catch (err) {
      console.error("Error generating PDF:", err);
      addToast("Failed to generate PDF. Please try again.", "error");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      title="Download PDF"
      onClick={generatePDF}
      disabled={isGenerating}
      className={`flex gap-x-1.5 items-center bg-white border-2 
                border-indigo-600 text-indigo-600
                font-bold mt-1 py-2.5 px-3 rounded-xl hover:bg-indigo-50 
                active:bg-indigo-100 transition
                ${isGenerating ? "opacity-70 cursor-not-allowed" : ""}`}
    >
      <Download size={18} />
    </button>
  );
};

export default DownloadButton;
