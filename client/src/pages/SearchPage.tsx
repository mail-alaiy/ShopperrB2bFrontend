import React from "react";
import { Link } from "wouter";
import { liteClient } from "algoliasearch/lite";
import {
  InstantSearch,
  Configure,
} from "react-instantsearch";
import CustomPagination from "@/components/CustomPagination";
import { useSearch } from "@/context/SearchContext";
import ValidatedProductHits from "@/components/ValidatedProductHits";

// Initialize the Algolia client
const searchClient = liteClient(
  "THPR44F5PH",
  "b03c56d4f99df23c60c7898da9add57d"
);

export default function SearchPage() {
  const { searchValue } = useSearch();

  // Scroll to top when search value changes
  React.useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchValue]);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2 sm:mb-4">
        <Link href="/">
            <a className="hover:text-blue-600 hover:underline">Home</a>
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-700">Search Results</span>
      </div>

      {/* Search Header */}
      <div className="mb-4 sm:mb-6 pb-2 border-b">
        <h1 className="text-2xl md:text-3xl font-bold">
          Search Results {searchValue && `for "${searchValue}"`}
        </h1>
      </div>

      {/* Use a key on InstantSearch if searchValue can be empty/null initially */}
      <InstantSearch
        searchClient={searchClient}
        indexName="product_index"
        key={searchValue || 'empty-search'}
        future={{ preserveSharedStateOnUnmount: true }}
      >
        <Configure query={searchValue || ''} hitsPerPage={20} />

        {/* Main content area */}
        <div>
          <ValidatedProductHits />
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-8 mb-4">
          <CustomPagination />
        </div>
      </InstantSearch>
    </div>
  );
}
