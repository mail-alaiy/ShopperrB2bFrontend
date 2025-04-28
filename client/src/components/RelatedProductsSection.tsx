import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import RelatedProductCard from "./RelatedProductCard"; // Import the card component
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


// Use the RelatedProductItem interface
interface RelatedProductItem {
  _id: string;
  objectID: string;
  name: string;
  handle: string;
  imgUrl: { src: string }[];
  sp: number;
  mrp: number;
}

interface RelatedProductsSectionProps {
  products: RelatedProductItem[] | undefined;
  isLoading: boolean;
  error: Error | null;
}

export default function RelatedProductsSection({
  products,
  isLoading,
  error,
}: RelatedProductsSectionProps) {

  const renderContent = () => {
    if (isLoading) {
      return (
        // Horizontal flex container for skeleton
        <div className="flex space-x-4 py-1">
          {[...Array(5)].map((_, i) => (
             // Skeleton matching the new card size/structure
             <div key={i} className="w-44 flex-shrink-0 border rounded-lg p-2">
                <Skeleton className="h-36 w-full mb-2 rounded" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-5 w-1/2 mb-2"/>
                <Skeleton className="h-7 w-full" />
            </div>
          ))}
        </div>
      );
    }

    if (error) {
      return (
         <Alert variant="destructive" className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Related Products</AlertTitle>
          <AlertDescription>
            Could not fetch related products at this time. Please try again later.
             {/* {error.message} */}
          </AlertDescription>
        </Alert>
      );
    }

    if (!products || products.length === 0) {
      return <p className="text-center text-gray-500 py-4">No related products found.</p>;
    }

    return (
      // Horizontal flex container for actual cards
      <div className="flex space-x-4 py-1">
        {products.map((product) => (
          <RelatedProductCard key={product.objectID || product._id} product={product} />
        ))}
      </div>
    );
  };

  return (
    <div className="mt-12 pt-6 border-t">
      <h2 className="text-xl font-semibold mb-4">Related Products</h2>
       {/* Outer container enabling horizontal scrolling */}
       {/* Add py-4 for padding around the scrollable area */}
      <div className="overflow-x-auto pb-4 no-scrollbar">
        {renderContent()}
      </div>
    </div>
  );
} 