import React, { useState } from "react";
import "./styles.css";

export default function StandardProductImages({ images = [], name = "" }) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  if (!images || images.length === 0) {
    return <div className="no-images">No images available</div>;
  }
  
  return (
    <div className="product-images-container">
      <div className="main-image-container">
        <img 
          src={images[selectedImageIndex]} 
          alt={`${name} - Image ${selectedImageIndex + 1}`} 
          className="main-product-image" 
        />
      </div>
      
      <div className="thumbnail-container">
        {images.map((image, index) => (
          <div 
            key={index}
            className={`thumbnail ${selectedImageIndex === index ? 'selected' : ''}`}
            onClick={() => setSelectedImageIndex(index)}
          >
            <img 
              src={image} 
              alt={`${name} - Thumbnail ${index + 1}`} 
              className="thumbnail-image"
            />
          </div>
        ))}
      </div>
    </div>
  );
}