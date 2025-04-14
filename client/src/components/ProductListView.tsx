import React from "react";
import { Link } from "wouter";
import { ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";

interface ProductListViewProps {
  products: Product[];
  getFullImageUrl: (imagePath: string) => string;
}

export default function ProductListView({
  products,
  getFullImageUrl,
}: ProductListViewProps) {
  return (
    <div className="space-y-6">
      {products.map((product) => (
        <div
          key={product._id}
          className="border rounded-md bg-white p-4 hover:shadow-md transition duration-200 flex flex-col sm:flex-row gap-4"
        >
          <Link href={`/products/${product._id}`}>
            <a className="block sm:w-36 md:w-48 shrink-0">
              <div className="h-48 sm:h-36 md:h-40 flex items-center justify-center">
                <img
                  src={getFullImageUrl(product.imgUrl[0]?.src)}
                  alt={product.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </a>
          </Link>

          <div className="flex-grow">
            <Link href={`/products/${product._id}`}>
              <a className="block">
                <h3 className="text-lg font-semibold text-blue-600 hover:underline mb-1">
                  {product.name}
                </h3>
                <div className="mb-2 font-medium"></div>
              </a>
            </Link>

            <div className="space-y-1 mb-3 text-sm text-gray-700">
              <div className="line-clamp-2 text-gray-600">
                {product.description?.substring(0, 150)}...
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Link href={`/products/${product._id}`}>
                <a>
                  <Button className="bg-amber-400 hover:bg-amber-500 text-gray-900">
                    <ShoppingCartIcon className="w-4 h-4 mr-2" />
                    View Product
                  </Button>
                </a>
              </Link>
            </div>
          </div>
        </div>
      ))}

      {products.length === 0 && (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">
            No products found in this category.
          </p>
          <p className="mt-2 text-gray-500">
            Try a different category or check out our other offerings.
          </p>
          <Link href="/">
            <a>
              <Button className="mt-4">Continue Shopping</Button>
            </a>
          </Link>
        </div>
      )}
    </div>
  );
}
