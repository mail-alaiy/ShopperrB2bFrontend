import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ChevronLeft, ChevronRight, StarIcon, StarHalfIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useState, useRef } from "react";

interface RelatedProductsProps {
  productId: number;
}

export default function RelatedProducts({ productId }: RelatedProductsProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const { data: relatedProducts, isLoading } = useQuery({
    queryKey: [`/api/products/${productId}/related`, { type: "related" }],
    enabled: !!productId,
  });
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };
  
  // Format ratings display
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<StarIcon key={`star-${i}`} className="h-4 w-4 fill-current" />);
    }
    
    if (hasHalfStar) {
      stars.push(<StarHalfIcon key="half-star" className="h-4 w-4 fill-current" />);
    }
    
    return stars;
  };
  
  if (isLoading) {
    return (
      <div className="border-t border-gray-200 mt-6 pt-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="flex gap-4 overflow-x-auto py-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-48">
              <Skeleton className="h-32 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-1/2 mb-2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }
  
  return (
    <div className="border-t border-gray-200 mt-6 pt-6">
      <h2 className="text-xl font-bold mb-3">Customers Who Bought This Item Also Bought</h2>
      
      <div className="relative">
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md z-10 hover:bg-gray-100"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <div 
          ref={scrollContainerRef}
          className="flex overflow-x-auto py-4 px-8 gap-4 scrollbar-hide hide-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {relatedProducts.map((product: any) => (
            <div 
              key={product.id} 
              className="flex-shrink-0 w-48 border border-gray-200 rounded hover:shadow-md p-3 transition-all bg-white"
            >
              <Link href={`/products/${product.id}`}>
                <a className="block">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-32 object-contain mb-2" 
                  />
                  <div className="text-blue-600 hover:text-orange-600 hover:underline text-sm font-medium line-clamp-2">
                    {product.name}
                  </div>
                  <div className="flex text-amber-400 text-xs mt-1">
                    {renderRatingStars(product.rating)}
                    <span className="text-gray-500 ml-1">({product.ratingCount})</span>
                  </div>
                  <div className="text-gray-500 text-sm mt-1">${product.salePrice.toFixed(2)}</div>
                </a>
              </Link>
            </div>
          ))}
        </div>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full shadow-md z-10 hover:bg-gray-100"
          onClick={scrollRight}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
