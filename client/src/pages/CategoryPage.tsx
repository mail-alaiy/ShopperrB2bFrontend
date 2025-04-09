import React, { useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCartIcon, TruckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

// Add this constant for the S3 bucket URL
const S3_BUCKET_FILE_URL = "https://shopperrcdn.shopperr.in";

// Add this interface to define the product data structure
interface ProductImage {
  position: number;
  src: string;
  varient_id: string;
}

interface Product {
  _id: string;
  name: string;
  handle: string;
  price: number;
  mrp: number;
  sp: number;
  quantity: number;
  description: string;
  imgUrl: ProductImage[];
  brand?: string;
  category: string;
  code: string;
}

interface ProductResponse {
  message: string;
  payload: Product[];
}

export default function CategoryPage() {
  const [matchCategory] = useRoute("/categories/:category");
  const [matchSubcategory] = useRoute("/subcategories/:category");
  const [location] = useLocation();

  // Extract category from either route
  const category = matchCategory
    ? location.split("/")[2]
    : matchSubcategory
    ? location.split("/")[2]
    : "";
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { user } = useAuth();

  // Fetch products from the API
  const { data: productsResponse, isLoading } = useQuery<ProductResponse>({
    queryKey: [`/api/categories/${category}/products`],
    queryFn: async () => {
      // Clean up the category string by:
      // 1. Replacing multiple hyphens with a single space
      // 2. Removing any commas
      const cleanCategory = category
        .replace(/-+/g, " ")
        .replace(/,/g, "")
        .trim();
      console.log(cleanCategory);
      const response = await fetch(
        `http://localhost:8002/products?query=${encodeURIComponent(
          cleanCategory
        )}&limit=20&page=1`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
  });

  // Extract products from the response
  const products = productsResponse?.payload || [];

  // Function to get the full image URL with S3 bucket prefix
  const getFullImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder-image.jpg";
    if (imagePath.startsWith("http")) return imagePath; // Already a full URL
    return `${S3_BUCKET_FILE_URL}/${imagePath}`;
  };

  // Format category name for display
  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const displayCategory = formatCategoryName(category);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2 sm:mb-4">
        <Link href="/">
          <a className="hover:text-blue-600 hover:underline">Home</a>
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-700">{displayCategory}</span>
      </div>

      {/* Category Header */}
      <div className="mb-4 sm:mb-6 pb-2 border-b">
        <h1 className="text-2xl md:text-3xl font-bold">{displayCategory}</h1>
      </div>

      {/* Products layout */}
      <div className="flex flex-col gap-4 mb-6">
        {/* Main Content Area */}
        <div className="w-full">
          {/* Results Header */}
          <div className="bg-gray-100 p-3 rounded-md flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              {isLoading
                ? "Loading..."
                : `${products.length} results for "${displayCategory}"`}
            </p>

            <div className="flex items-center gap-3">
              {/* Grid/List View Toggle */}
              <div className="hidden sm:flex border rounded overflow-hidden">
                <button
                  className={`px-2 py-1 ${
                    viewMode === "grid" ? "bg-gray-200" : "bg-white"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="1"
                      y="1"
                      width="6"
                      height="6"
                      rx="1"
                      fill={viewMode === "grid" ? "#4B5563" : "#D1D5DB"}
                    />
                    <rect
                      x="9"
                      y="1"
                      width="6"
                      height="6"
                      rx="1"
                      fill={viewMode === "grid" ? "#4B5563" : "#D1D5DB"}
                    />
                    <rect
                      x="1"
                      y="9"
                      width="6"
                      height="6"
                      rx="1"
                      fill={viewMode === "grid" ? "#4B5563" : "#D1D5DB"}
                    />
                    <rect
                      x="9"
                      y="9"
                      width="6"
                      height="6"
                      rx="1"
                      fill={viewMode === "grid" ? "#4B5563" : "#D1D5DB"}
                    />
                  </svg>
                </button>
                <button
                  className={`px-2 py-1 ${
                    viewMode === "list" ? "bg-gray-200" : "bg-white"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="1"
                      y="1"
                      width="14"
                      height="4"
                      rx="1"
                      fill={viewMode === "list" ? "#4B5563" : "#D1D5DB"}
                    />
                    <rect
                      x="1"
                      y="7"
                      width="14"
                      height="4"
                      rx="1"
                      fill={viewMode === "list" ? "#4B5563" : "#D1D5DB"}
                    />
                    <rect
                      x="1"
                      y="13"
                      width="14"
                      height="2"
                      rx="1"
                      fill={viewMode === "list" ? "#4B5563" : "#D1D5DB"}
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Products Display */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          ) : viewMode === "grid" ? (
            // Grid view
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="border rounded-md bg-white p-4 hover:shadow-md transition duration-200"
                >
                  <Link href={`/products/${product._id}`}>
                    <a className="block">
                      <div className="h-48 flex items-center justify-center mb-4">
                        <img
                          src={getFullImageUrl(product.imgUrl[0]?.src)}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-blue-600 hover:underline mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      {/* <div className="mb-2">
                        <span className="text-gray-500 line-through text-sm mr-2">
                          ₹{product.mrp.toFixed(2)}
                        </span>
                        <span className="text-lg font-bold">
                          ₹{product.sp.toFixed(2)}
                        </span>
                        {product.mrp > product.sp && (
                          <span className="text-green-600 text-sm ml-2">
                            Save{" "}
                            {Math.round((1 - product.sp / product.mrp) * 100)}%
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 mb-2 flex items-center">
                        <TruckIcon className="h-3 w-3 mr-1" />
                        <span>Free shipping for businesses</span>
                      </div> */}
                    </a>
                  </Link>
                  <Link href={`/products/${product._id}`}>
                    <a>
                      <Button className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900">
                        <ShoppingCartIcon className="w-4 h-4 mr-2" />
                        View Product
                      </Button>
                    </a>
                  </Link>
                </div>
              ))}

              {products.length === 0 && (
                <div className="col-span-full text-center py-12">
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
          ) : (
            // List view - Amazon style
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
                        <div className="mb-2 font-medium">
                          {/* <span className="text-xl font-bold">
                            ₹{product.sp.toFixed(2)}
                          </span>
                          {product.mrp > product.sp && (
                            <>
                              <span className="text-gray-500 line-through text-sm ml-2">
                                ₹{product.mrp.toFixed(2)}
                              </span>
                              <span className="text-green-600 text-sm ml-2">
                                Save{" "}
                                {Math.round(
                                  (1 - product.sp / product.mrp) * 100
                                )}
                                %
                              </span>
                            </>
                          )} */}
                        </div>
                      </a>
                    </Link>

                    <div className="space-y-1 mb-3 text-sm text-gray-700">
                      {/* <div className="flex items-start">
                        <span className="text-blue-600 flex items-center">
                          <TruckIcon className="h-3 w-3 mr-1" />
                          FREE Business Shipping
                        </span>
                      </div>
                      <div>
                        <span>
                          Brand:{" "}
                          <span className="font-medium">{product.brand}</span>
                        </span>
                      </div> */}
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
          )}
        </div>
      </div>
    </div>
  );
}
