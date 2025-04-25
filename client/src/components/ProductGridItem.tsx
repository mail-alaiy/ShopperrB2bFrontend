import React from "react";
import { Link } from "wouter";
import { ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";

interface ProductGridItemProps {
  product: Product;
  getFullImageUrl: (imagePath: string) => string;
}

export default function ProductGridItem({
  product,
  getFullImageUrl,
}: ProductGridItemProps) {
  return (
    <div
      key={product._id} // Key should ideally be on the mapped element in the parent
      className="border rounded-md bg-white p-4 hover:shadow-md transition duration-200 flex flex-col"
    >
      <Link href={`/products/${product._id}`}>
        <a className="block flex-grow">
          <div className="h-48 flex items-center justify-center mb-4">
            <img
              // Add optional chaining and a fallback just in case
              src={getFullImageUrl(product.imgUrl?.[0]?.src)}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
              // Add error handling for images
              onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
            />
          </div>
          <h3 className="text-base sm:text-lg font-semibold text-blue-600 hover:underline mb-1 line-clamp-2">
            {product.name}
          </h3>
          {/* Price/shipping info could be added here */}
        </a>
      </Link>
      <Link href={`/products/${product._id}`} className="mt-auto">
        <a>
          <Button className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 mt-2">
            <ShoppingCartIcon className="w-4 h-4 mr-2" />
            View Product
          </Button>
        </a>
      </Link>
    </div>
  );
} 