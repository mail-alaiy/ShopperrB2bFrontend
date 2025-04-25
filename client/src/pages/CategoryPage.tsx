import React, { useState, useEffect } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  ShoppingCartIcon,
  TruckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import GridViewIcon from "@/components/icons/GridViewIcon";
import ListViewIcon from "@/components/icons/ListViewIcon";
import ProductDisplay from "@/components/ProductDisplay";
import { Product } from "@/types/product";

// Add this constant for the S3 bucket URL
const S3_BUCKET_FILE_URL = "https://shopperrcdn.shopperr.in";

interface ProductResponse {
  message: string;
  payload: Product[];
}

// Helper function to check if an image URL is accessible
const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    // Add a timeout in case the request hangs indefinitely
    setTimeout(() => resolve(false), 5000); // 5 second timeout
  });
};

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

  // State for products with validated images
  const [validatedProducts, setValidatedProducts] = useState<Product[]>([]);
  // State to track validation process
  const [isValidatingImages, setIsValidatingImages] = useState(false);

  // Fetch products from the API
  const {
    data: productsData,
    isLoading: isLoadingData,
    isFetching,
  } = useQuery<ProductResponse>({
    queryKey: ["products", "category", category, page],
    queryFn: async () => {
      const cleanCategory = category
        .replace(/-+/g, " ")
        .replace(/,/g, "")
        .replace(/&/g, "")
        .trim();
      const response = await fetch(
        `${import.meta.env.VITE_REACT_APP_PRODUCTS_API_URL}?query=${encodeURIComponent(
          cleanCategory
        )}&limit=20&page=${page}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch products");
      }
      return response.json();
    },
  });

  const rawProducts = productsData?.payload || [];

  // Effect to validate images when rawProducts change
  useEffect(() => {
    if (rawProducts.length === 0) {
        setValidatedProducts([]);
        setIsValidatingImages(false);
        return;
    }

    const validate = async () => {
        setIsValidatingImages(true);
        const results = await Promise.allSettled(
            rawProducts.map(async (product) => {
                const imageUrl = getFullImageUrl(product.imgUrl?.[0]?.src);
                // Don't bother checking the placeholder URL
                if (imageUrl === "/placeholder-image.jpg") {
                    return { product, exists: false };
                }
                const exists = await checkImageExists(imageUrl);
                return { product, exists };
            })
        );

        const valid = results
            .filter((result): result is PromiseFulfilledResult<{ product: Product; exists: true }> =>
                result.status === 'fulfilled' && result.value.exists
            )
            .map(result => result.value.product);

        setValidatedProducts(valid);
        setIsValidatingImages(false);
    };

    validate();
  }, [rawProducts]); // Depend on rawProducts

  // Function to get the full image URL with S3 bucket prefix
  const getFullImageUrl = (imagePath: string) => {
    if (!imagePath) return "/placeholder-image.jpg";
    if (imagePath.startsWith("http")) return imagePath;
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
    setValidatedProducts([]); // Clear validated products on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Combine loading states
  const isLoading = isLoadingData || isFetching || isValidatingImages;

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
              {isLoadingData || isFetching ? (
                "Loading products..."
              ) : isValidatingImages ? (
                "Validating images..."
              ) : (
                <>
                  {validatedProducts.length === 0 ? (
                    "No results found"
                  ) : (
                     <>
                      Showing {(page - 1) * 20 + 1}-
                      {(page - 1) * 20 + validatedProducts.length} results for "
                      {displayCategory}"
                      {page > 1 && <span className="ml-1">- Page {page}</span>}
                      {rawProducts.length !== validatedProducts.length && (
                        <span className='text-xs ml-1 text-gray-500'>({rawProducts.length - validatedProducts.length} hidden due to image issues)</span>
                      )}
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
                  aria-label="Grid view"
                >
                  <GridViewIcon
                    fillColor={viewMode === "grid" ? "#4B5563" : "#D1D5DB"}
                  />
                </button>
                <button
                  className={`px-2 py-1 ${
                    viewMode === "list" ? "bg-gray-200" : "bg-white"
                  }`}
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                >
                  <ListViewIcon
                    fillColor={viewMode === "list" ? "#4B5563" : "#D1D5DB"}
                  />
                </button>
              </div>
            </div>
          </div>

          {/* Products Display */}
          <ProductDisplay
            products={validatedProducts}
            viewMode={viewMode}
            isLoading={isLoading}
            getFullImageUrl={getFullImageUrl}
          />
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-center items-center mt-8 mb-4">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1 || isLoading}
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
                (rawProducts.length < 20 && !isLoadingData && !isFetching)
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
              (rawProducts.length < 20 && !isLoadingData && !isFetching)
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
