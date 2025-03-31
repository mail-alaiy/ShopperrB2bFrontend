import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImagesProps {
  images: string[];
  name: string;
}

export default function ProductImages({ images, name }: ProductImagesProps) {
  const [mainImage, setMainImage] = useState(images[0]);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const handleThumbnailClick = (image: string, index: number) => {
    setMainImage(image);
    setSelectedImageIndex(index);
  };
  
  return (
    <>
      {/* Main product image */}
      <div className="border border-gray-200 p-2 mb-2 bg-white">
        <img 
          src={mainImage} 
          alt={name} 
          className="w-full h-auto object-contain aspect-square"
        />
      </div>
      
      {/* Image thumbnails */}
      <div className="grid grid-cols-5 gap-2 mt-2">
        {images.map((image, index) => (
          <div 
            key={index}
            className={cn(
              "border p-1 cursor-pointer",
              selectedImageIndex === index 
                ? "border-amber-400" 
                : "border-gray-200 hover:border-amber-400"
            )}
            onClick={() => handleThumbnailClick(image, index)}
          >
            <img 
              src={image} 
              alt={`${name} - view ${index + 1}`} 
              className="w-full h-auto object-contain aspect-square"
            />
          </div>
        ))}
      </div>
    </>
  );
}
