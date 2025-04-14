import React, { useState } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCartIcon,
  TruckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import ProductListView from "@/components/ProductListView";

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

  // Add page state inside the component
  const [page, setPage] = useState(1);

  // Fetch products from the API
  const {
    data: productsData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["products", "category", category, page], // Include page in the query key
    queryFn: async () => {
      // Clean up the category string by:
      // 1. Replacing multiple hyphens with a single space
      // 2. Removing any commas
      // 3. Removing ampersands
      const cleanCategory = category
        .replace(/-+/g, " ")
        .replace(/,/g, "")
        .replace(/&/g, "")
        .trim();
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_PRODUCTS_API_URL}?query=${encodeURIComponent(
          cleanCategory
        )}&limit=20&page=${page}` // Use the page state here
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
  });

  // Extract products from the response
  const products = productsData?.payload || [];

  // Function to get the full image URL with S3 bucket prefix
  const getFullImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder-image.jpg";
    if (imagePath.startsWith("http")) return imagePath; // Already a full URL
    return `${S3_BUCKET_FILE_URL}/${imagePath}png`;
  };

  // Format category name for display
  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const displayCategory = formatCategoryName(category);

  // Add this function to handle page changes
  const handlePageChange = (newPage: number) => {
    if (newPage < 1) return;
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
              {isLoading ? (
                "Loading..."
              ) : (
                <>
                  {products.length === 0 ? (
                    "No results found"
                  ) : (
                    <>
                      Showing {(page - 1) * 20 + 1}-
                      {(page - 1) * 20 + products.length} results for "
                      {displayCategory}"
                      {page > 1 && <span className="ml-1">- Page {page}</span>}
                    </>
                  )}
                </>
              )}
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
            // List view
            <ProductListView
              products={products}
              getFullImageUrl={getFullImageUrl}
            />
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-8 mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || isLoading || isFetching}
            className="h-8 w-8"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-1">
            {page > 1 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(1)}
                className="h-8 w-8"
              >
                1
              </Button>
            )}

            {page > 3 && <span className="text-gray-500">...</span>}

            {page > 2 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handlePageChange(page - 1)}
                className="h-8 w-8"
              >
                {page - 1}
              </Button>
            )}

            <Button
              variant="default"
              size="sm"
              className="bg-amber-400 hover:bg-amber-500 text-gray-900 h-8 w-8"
            >
              {page}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(page + 1)}
              className="h-8 w-8"
              disabled={
                isLoading ||
                isFetching ||
                (productsData?.payload?.length || 0) < 20
              }
            >
              {page + 1}
            </Button>

            <span className="text-gray-500">...</span>
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(page + 1)}
            disabled={
              isLoading ||
              isFetching ||
              (productsData?.payload?.length || 0) < 20
            }
            className="h-8 w-8"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
