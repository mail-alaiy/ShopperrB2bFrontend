import React from "react";
import ProductGridItem from "./ProductGridItem";
import { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  getFullImageUrl: (imagePath: string) => string;
}

export default function ProductGrid({
  products,
  getFullImageUrl,
}: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {products.map((product) => (
        <ProductGridItem
          key={product._id} // Key is placed here
          product={product}
          getFullImageUrl={getFullImageUrl}
        />
      ))}
    </div>
  );
} 