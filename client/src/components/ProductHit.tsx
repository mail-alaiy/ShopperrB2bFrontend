import React from "react";
import { Link } from "wouter";
import { ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
// Import the utility function
import { getFullImageUrl } from "@/utils/imageUtils";

// Define a type for the Algolia hit object (adjust properties as needed)
interface AlgoliaProductHit {
  objectID: string;
  _id: string; // Assuming _id might also exist
  name: string;
  imgUrl?: string[]; // Or whatever the image field is named
  // Add other fields used from the hit object
}

interface ProductHitProps {
  hit: AlgoliaProductHit;
}

export default function ProductHit({ hit }: ProductHitProps) {
  // Get the image URL - it should be valid at this point
  // Access the correct image field from your Algolia index (e.g., hit.image, hit.imgUrl[0])
  const imageUrl = getFullImageUrl(hit.imgUrl?.[0]?.src);

  return (
    <div
      key={hit.objectID} // Use objectID for key with Algolia
      className="border rounded-md bg-white p-4 hover:shadow-md transition duration-200 flex flex-col sm:flex-row gap-4"
    >
      <Link href={`/products/${hit.objectID}`}>
        <a className="block sm:w-36 md:w-48 shrink-0">
          <div className="h-48 sm:h-36 md:h-40 flex items-center justify-center">
            <img
              src={imageUrl} // Use the pre-calculated, validated URL
              alt={hit.name}
              className="max-h-full max-w-full object-contain"
               // Add onError fallback just in case validation misses something rare
              onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
            />
          </div>
        </a>
      </Link>

      <div className="flex-grow">
        <Link href={`/products/${hit.objectID}`}>
          <a className="block">
            <h3 className="text-lg font-semibold text-blue-600 hover:underline mb-1">
              {hit.name}
            </h3>
            {/* Add other details if needed */}
          </a>
        </Link>

        <div className="flex flex-col sm:flex-row gap-2 mt-auto pt-2"> {/* Ensure button is at bottom */}
          <Link href={`/products/${hit.objectID}`}>
            <a>
              <Button className="bg-amber-400 hover:bg-amber-500 text-gray-900 w-full sm:w-auto">
                <ShoppingCartIcon className="w-4 h-4 mr-2" />
                View Product
              </Button>
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
} 