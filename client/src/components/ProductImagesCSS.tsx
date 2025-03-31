import React, { useState } from "react";
import "../styles/ProductImages.css";

interface ProductImagesProps {
  images: string[];
  name: string;
}

export default function ProductImagesCSS({ images, name }: ProductImagesProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  
  if (!images || images.length === 0) {
    // Fallback when no images are available
    return (
      <div className="product-images-container">
        <div className="main-image-container no-image">
          <div className="no-image-placeholder">No image available</div>
        </div>
      </div>
    );
  }
  
  const handleThumbnailClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsZoomed(false);
  };
  
  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };
  
  const mainImageClass = isZoomed ? "main-image-container zoomed" : "main-image-container";
  
  return (
    <div className="product-images-container">
      {/* Main image */}
      <div 
        className={mainImageClass}
        onClick={handleZoomToggle}
      >
        <img 
          src={images[selectedImageIndex]} 
          alt={`${name} - Image ${selectedImageIndex + 1}`} 
          className="main-image"
        />
        <div className="zoom-indicator">
          {isZoomed ? "Click to zoom out" : "Click to zoom in"}
        </div>
      </div>
      
      {/* Thumbnails */}
      <div className="thumbnails-container">
        {images.map((image, index) => (
          <button 
            key={index}
            className={`thumbnail-button ${index === selectedImageIndex ? 'selected' : ''}`}
            onClick={() => handleThumbnailClick(index)}
          >
            <img 
              src={image} 
              alt={`${name} - Thumbnail ${index + 1}`} 
              className="thumbnail-image"
            />
          </button>
        ))}
      </div>
    </div>
  );
}