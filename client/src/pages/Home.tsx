import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { StarIcon, StarHalfIcon, ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-blue-700 text-white rounded-lg p-6 mb-8 shadow-md">
        <h1 className="text-3xl font-bold mb-2">Welcome to Shopperr B2B</h1>
        <p className="mb-4">Your one-stop shop for business and office supplies</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="secondary" 
            className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold"
          >
            Shop Business Deals
          </Button>
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
            Learn About Volume Discounts
          </Button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6">Featured Products</h2>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border rounded-md p-4">
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-6 w-1/3 mb-2" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.map((product) => (
            <div key={product.id} className="border rounded-md p-4 hover:shadow-md transition duration-200">
              <Link href={`/products/${product.id}`}>
                <a className="block">
                  <div className="h-48 flex items-center justify-center mb-4">
                    <img 
                      src={product.images[0]} 
                      alt={product.name} 
                      className="max-h-full max-w-full object-contain" 
                    />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-600 hover:underline mb-1 line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="flex text-amber-400 mb-2">
                    {[...Array(Math.floor(product.rating))].map((_, i) => (
                      <StarIcon key={i} className="w-4 h-4 fill-current" />
                    ))}
                    {product.rating % 1 >= 0.5 && (
                      <StarHalfIcon className="w-4 h-4 fill-current" />
                    )}
                    <span className="text-gray-500 text-sm ml-1">({product.ratingCount})</span>
                  </div>
                  <div className="mb-3">
                    <span className="text-gray-500 line-through text-sm mr-2">${product.regularPrice.toFixed(2)}</span>
                    <span className="text-lg font-bold">${product.salePrice.toFixed(2)}</span>
                    {product.regularPrice > product.salePrice && (
                      <span className="text-green-600 text-sm ml-2">
                        Save {Math.round((1 - product.salePrice / product.regularPrice) * 100)}%
                      </span>
                    )}
                  </div>
                </a>
              </Link>
              <Button className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900">
                <ShoppingCartIcon className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
