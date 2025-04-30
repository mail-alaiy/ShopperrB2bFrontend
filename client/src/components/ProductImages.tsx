import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

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
      console.log("images", images);
      const results = await Promise.all(images.map(checkImage));
      console.log("results", results);
      const validImages = results.filter((url): url is string => url !== null);
      console.log("validImages", validImages);
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

      {/* Thumbnails - Use Carousel instead of Grid */}
      {accessibleImages.length > 1 && (
        <Carousel
          opts={{
            align: "start", // Align items to the start
            loop: false, // Don't loop infinitely
            // slidesToScroll: 1, // Scroll one item at a time (default)
          }}
          className="w-full mt-2" // Adjust width and margin as needed
        >
          <CarouselContent className="-ml-1"> {/* Negative margin to counteract item padding */}
            {accessibleImages.map((image, index) => (
              <CarouselItem key={index} className="pl-1 basis-1/4 md:basis-1/5"> {/* Padding and basis for item width */}
                <div className="p-0"> {/* Optional: wrapper if needed */}
                  <div // Keep the interactive thumbnail div
                    className={cn(
                      "border p-1 cursor-pointer aspect-square flex items-center justify-center", // Maintain aspect ratio and center content
                      selectedImageIndex === index
                        ? "border-amber-400"
                        : "border-gray-200 hover:border-amber-400"
                    )}
                    onClick={() => handleThumbnailClick(image, index)}
                  >
                    <img
                      src={image}
                      alt={`${name} - view ${index + 1}`}
                      className="object-contain h-full w-full" // Ensure image fits within the aspect-square container
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {/* Optional: Add Previous/Next Buttons if needed */}
          {accessibleImages.length > 5 && ( // Only show buttons if more images than fit
              <>
                <CarouselPrevious className="absolute left-[-10px] top-1/2 -translate-y-1/2" />
                <CarouselNext className="absolute right-[-10px] top-1/2 -translate-y-1/2" />
              </>
           )}
        </Carousel>
      )}
    </>
  );
}
