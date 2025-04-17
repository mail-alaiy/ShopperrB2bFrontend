import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductImagesProps {
  images: string[];
  name: string;
}

export default function ProductImages({ images, name }: ProductImagesProps) {
  const [accessibleImages, setAccessibleImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  useEffect(() => {
    const checkImage = (url: string): Promise<string | null> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(url);
        img.onerror = () => resolve(null);
        img.src = url;
      });
    };

    const checkAllImages = async () => {
      setIsLoading(true);
      const results = await Promise.all(images.map(checkImage));
      const validImages = results.filter((url): url is string => url !== null);
      setAccessibleImages(validImages);

      if (validImages.length > 0) {
        setMainImage(validImages[0]);
        setSelectedImageIndex(0);
      } else {
        setMainImage(null);
        setSelectedImageIndex(null);
      }
      setIsLoading(false);
    };

    if (images && images.length > 0) {
      checkAllImages();
    } else {
      setAccessibleImages([]);
      setMainImage(null);
      setSelectedImageIndex(null);
      setIsLoading(false);
    }
  }, [images]);

  const handleThumbnailClick = (image: string, index: number) => {
    setMainImage(image);
    setSelectedImageIndex(index);
  };

  if (isLoading) {
    return (
      <>
        <Skeleton className="w-full aspect-square mb-2" />
        <div className="grid grid-cols-5 gap-2 mt-2">
          {[...Array(Math.min(images.length, 5))].map((_, i) => (
            <Skeleton key={i} className="w-full aspect-square" />
          ))}
        </div>
      </>
    );
  }

  if (accessibleImages.length === 0) {
    return null;
  }

  return (
    <>
      {/* Main product image */}
      <div className="border border-gray-200 p-2 mb-2 bg-white">
        {mainImage ? (
          <img
            src={mainImage}
            alt={name}
            className="w-full h-auto object-contain aspect-square"
          />
        ) : (
          <div className="w-full aspect-square bg-gray-100 flex items-center justify-center text-gray-400">
            No Image
          </div>
        )}
      </div>

      {/* Image thumbnails */}
      {accessibleImages.length > 1 && (
        <div className="grid grid-cols-5 gap-2 mt-2">
          {accessibleImages.map((image, index) => (
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
      )}
    </>
  );
}
