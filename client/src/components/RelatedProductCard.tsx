import React from "react";
import { Link } from "wouter";
import { ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getFullImageUrl } from "@/utils/imageUtils"; // Assuming imageUtils.ts exists

// Use the RelatedProductItem interface defined earlier
interface RelatedProductItem {
  _id: string;
  objectID: string;
  name: string;
  handle: string;
  imgUrl: { src: string }[]; // Simplified for usage here
  sp: number;
  mrp: number;
}


interface RelatedProductCardProps {
  product: RelatedProductItem;
}

export default function RelatedProductCard({ product }: RelatedProductCardProps) {
  const imageUrl = getFullImageUrl(product.imgUrl?.[0]?.src);
  console.log(imageUrl);
  const productLink = `/products/${product.objectID || product._id}`; // Prefer objectID if available

  return (
    <div className="w-44 flex-shrink-0 border bg-white rounded-lg shadow-sm p-2 flex flex-col h-full transition-shadow hover:shadow-md">
      <Link href={productLink}>
        <a className="block flex-grow">
          <div className="h-36 mb-2 flex items-center justify-center overflow-hidden rounded bg-gray-50">
            <img
              src={imageUrl}
              alt={product.name}
              className="max-h-full max-w-full object-contain"
              onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")}
            />
          </div>
          <h3 className="text-xs font-medium text-gray-800 hover:text-blue-600 mb-1 line-clamp-2 leading-tight h-8">
            {product.name}
          </h3>
        </a>
      </Link>
      <Link href={productLink} className="mt-2 block pt-1">
        <Button size="sm" className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 text-[11px] h-7">
          View Product
        </Button>
      </Link>
    </div>
  );
} 