import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridSkeletonProps {
    count?: number;
}

export default function ProductGridSkeleton({ count = 8 }: ProductGridSkeletonProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="border rounded-md p-4">
          <Skeleton className="h-48 w-full mb-4" />
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-2" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );
} 