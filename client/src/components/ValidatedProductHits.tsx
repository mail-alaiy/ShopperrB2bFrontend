import React, { useState, useEffect } from 'react';
import { useHits, useInstantSearch } from 'react-instantsearch';
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import ProductHit from './ProductHit'; // Import the dedicated ProductHit component
import { checkImageExists, getFullImageUrl } from '@/utils/imageUtils'; // Import utils

// Define type for hits again (or import if defined globally)
interface AlgoliaProductHit {
  objectID: string;
  _id: string;
  name: string;
  imgUrl?: string[];
}

interface RelatedProductImage {
  position: number;
  src: string;
  varient_id: string; // Note: varient_id spelling in API
}

// Simplified interface for the related product data we need
interface RelatedProductItem {
  _id: string;
  objectID: string; // Algolia objectID might be present
  name: string;
  handle: string;
  imgUrl: RelatedProductImage[];
  sp: number; // Sale price
  mrp: number; // Regular price
}

interface RelatedProductResponse {
  message: string;
  payload: RelatedProductItem[];
}

export default function ValidatedProductHits() {
  const { hits } = useHits<AlgoliaProductHit>();
  const { status, results } = useInstantSearch();
  const [validatedHits, setValidatedHits] = useState<AlgoliaProductHit[]>([]);
  const [isValidatingImages, setIsValidatingImages] = useState(false);

  useEffect(() => {
    // Reset validation state if search is loading/stalled or no hits initially
    if (status === 'loading' || status === 'stalled' || !hits || hits.length === 0) {
      setValidatedHits([]);
      setIsValidatingImages(false); // Ensure validation stops if query changes quickly
      return;
    }

    // Only run validation if hits are present and status is idle/ok
    if (status === 'idle' || status === 'error' || status === 'finished') { // Check status before validating
        const validate = async () => {
          setIsValidatingImages(true);
          const results = await Promise.allSettled(
            hits.map(async (hit) => {
              // Get the specific image URL field from your Algolia hit object
              const imageUrl = getFullImageUrl(hit.imgUrl?.[0]);
              const exists = await checkImageExists(imageUrl);
              return { hit, exists };
            })
          );

          const valid = results
            .filter((result): result is PromiseFulfilledResult<{ hit: AlgoliaProductHit; exists: true }> =>
                result.status === 'fulfilled' && result.value.exists
            )
            .map(result => result.value.hit);

          setValidatedHits(valid);
          setIsValidatingImages(false);
        };

        validate();
    }

  }, [hits, status]); // Depend on hits and status

  // --- Combined Loading and Validation State ---
  // Show skeleton if Algolia is loading OR if we are validating images
  if (status === 'stalled' || status === 'loading' || isValidatingImages) {
    return (
      // Using list-view-like skeleton
       <div className="space-y-6">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="border rounded-md p-4 flex gap-4">
                    <Skeleton className="h-36 w-48 shrink-0" />
                    <div className="flex-grow space-y-3">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-10 w-32 mt-2" />
                    </div>
                </div>
            ))}
        </div>
    );
  }

  // --- No Results State ---
  // Check after loading and validation are complete (isValidatingImages will be false here)
  if (validatedHits.length === 0 && (status === 'finished' || status === 'idle')) {
     // Check if the *original* search had hits, to differentiate messages
     if (results?.nbHits > 0) {
         return (
             <div className="col-span-full text-center py-12">
                 <p className="text-xl text-gray-600">
                    No products found with valid images for your search.
                 </p>
                 <p className="mt-2 text-gray-500">
                    {results.nbHits} product(s) matched, but their images could not be loaded.
                 </p>
                 <Link href="/">
                    <a className="inline-block"> <Button className="mt-4">Continue Shopping</Button></a>
                 </Link>
             </div>
         );
     } else {
          // Original search truly found nothing
          return (
             <div className="col-span-full text-center py-12">
                 <p className="text-xl text-gray-600">
                    No products found for your search.
                 </p>
                 <p className="mt-2 text-gray-500">
                    Try different keywords or browse our categories.
                 </p>
                 <Link href="/">
                    <a className="inline-block"><Button className="mt-4">Continue Shopping</Button></a>
                 </Link>
             </div>
          );
     }
  }

  // --- Display Validated Hits ---
  return (
    <div className="space-y-6">
      {validatedHits.map((hit) => (
        <ProductHit key={hit.objectID} hit={hit} />
      ))}
    </div>
  );
} 