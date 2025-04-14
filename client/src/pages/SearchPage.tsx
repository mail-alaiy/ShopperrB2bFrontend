import React from "react";
import { Link } from "wouter";
import { liteClient } from "algoliasearch/lite";
import {
  InstantSearch,
  Hits,
  Configure,
  useInstantSearch,
} from "react-instantsearch";
import { ShoppingCartIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import CustomPagination from "@/components/CustomPagination";
import { useSearch } from "@/context/SearchContext";

// Initialize the Algolia client
const searchClient = liteClient(
  "THPR44F5PH",
  "b03c56d4f99df23c60c7898da9add57d"
);

const S3_BUCKET_FILE_URL = "https://shopperrcdn.shopperr.in";

// Product Hit component for rendering each search result
function ProductHit({ hit }: { hit: any }) {
  const getFullImageUrl = (imagePath: string): string => {
    if (!imagePath) return "/placeholder-image.jpg";
    if (imagePath.startsWith("http")) return imagePath;
    return `${S3_BUCKET_FILE_URL}/${imagePath}png`;
  };

  return (
    <div
      key={hit._id}
      className="border rounded-md bg-white p-4 hover:shadow-md transition duration-200 flex flex-col sm:flex-row gap-4"
    >
      <Link href={`/products/${hit._id}`}>
        <a className="block sm:w-36 md:w-48 shrink-0">
          <div className="h-48 sm:h-36 md:h-40 flex items-center justify-center">
            <img
              src={getFullImageUrl(hit.imgUrl?.[0]?.src)}
              alt={hit.name}
              className="max-h-full max-w-full object-contain"
            />
          </div>
        </a>
      </Link>

      <div className="flex-grow">
        <Link href={`/products/${hit._id}`}>
          <a className="block">
            <h3 className="text-lg font-semibold text-blue-600 hover:underline mb-1">
              {hit.name}
            </h3>
            <div className="mb-2 font-medium"></div>
          </a>
        </Link>

        <div className="space-y-1 mb-3 text-sm text-gray-700">
          <div className="line-clamp-2 text-gray-600">
            {hit.description?.substring(0, 150)}...
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Link href={`/products/${hit._id}`}>
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
  );
}

// Status indicator component
function SearchStatus() {
  const { status, results } = useInstantSearch();

  if (status === "stalled" || status === "loading") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="border rounded-md p-4">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (results?.nbHits === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <p className="text-xl text-gray-600">
          No products found for your search.
        </p>
        <p className="mt-2 text-gray-500">
          Try different keywords or browse our categories.
        </p>
        <Link href="/">
          <Button className="mt-4">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return null;
}

export default function SearchPage() {
  const { searchValue } = useSearch();

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2 sm:mb-4">
        <Link href="/">Home</Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-700">Search Results</span>
      </div>

      {/* Search Header */}
      <div className="mb-4 sm:mb-6 pb-2 border-b">
        <h1 className="text-2xl md:text-3xl font-bold">
          Search Results {searchValue && `for "${searchValue}"`}
        </h1>
      </div>

      {/* InstantSearch - key forces re-render when query changes */}
      <InstantSearch
        searchClient={searchClient}
        indexName="production_products"
        key={searchValue}
      >
        <Configure query={searchValue} hitsPerPage={20} />

        {/* Products Grid */}
        <div>
          <SearchStatus />
          <Hits hitComponent={ProductHit} />
        </div>

        {/* Fixed pagination to resolve type errors */}
        <div className="flex justify-center mt-8 mb-4">
          <CustomPagination />
        </div>
      </InstantSearch>
    </div>
  );
}
