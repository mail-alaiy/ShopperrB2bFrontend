import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ProductListView from "@/components/ProductListView";
import ProductGrid from "@/components/ProductGrid";
import ProductGridSkeleton from "@/components/ProductGridSkeleton";
import NoProductsFound from "@/components/NoProductsFound";
import { Product } from "@/types/product";

interface ProductDisplayProps {
  products: Product[];
  viewMode: "grid" | "list";
  isLoading: boolean;
  getFullImageUrl: (imagePath: string) => string;
}

export default function ProductDisplay({
  products,
  viewMode,
  isLoading,
  getFullImageUrl,
}: ProductDisplayProps) {
  if (isLoading) {
    return viewMode === 'grid'
        ? <ProductGridSkeleton />
        : <ProductListViewSkeleton />;
  }

  if (products.length === 0) {
    return <NoProductsFound />;
  }

  if (viewMode === "grid") {
    return (
      <ProductGrid products={products} getFullImageUrl={getFullImageUrl} />
    );
  }

  // List view
  return (
    <ProductListView products={products} getFullImageUrl={getFullImageUrl} />
  );
}

function ProductListViewSkeleton({ count = 5 }: { count?: number }) {
    return (
        <div className="space-y-6">
            {[...Array(count)].map((_, i) => (
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