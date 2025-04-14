import React from "react";
import { usePagination } from "react-instantsearch";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";

export default function CustomPagination(props) {
  const {
    pages,
    currentRefinement,
    nbPages,
    isFirstPage,
    isLastPage,
    refine,
    createURL,
  } = usePagination(props);

  const firstPageIndex = 0;
  const previousPageIndex = currentRefinement - 1;
  const nextPageIndex = currentRefinement + 1;
  const lastPageIndex = nbPages - 1;

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={() => refine(previousPageIndex)}
        disabled={isFirstPage}
        className="h-8 w-8"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1">
        {currentRefinement > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refine(firstPageIndex)}
            className="h-8 w-8"
          >
            1
          </Button>
        )}

        {currentRefinement > 3 && <span className="text-gray-500">...</span>}

        {currentRefinement > 2 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refine(previousPageIndex)}
            className="h-8 w-8"
          >
            {currentRefinement}
          </Button>
        )}

        <Button
          variant="default"
          size="sm"
          className="bg-[#62c8f5] hover:bg-[#06184b] hover:text-white text-gray-900 h-8 w-8"
        >
          {currentRefinement + 1}
        </Button>

        {currentRefinement < nbPages - 2 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refine(nextPageIndex)}
            className="h-8 w-8"
          >
            {currentRefinement + 2}
          </Button>
        )}

        {currentRefinement < nbPages - 3 && (
          <span className="text-gray-500">...</span>
        )}

        {nbPages > 1 && currentRefinement < nbPages - 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => refine(lastPageIndex)}
            className="h-8 w-8"
          >
            {nbPages}
          </Button>
        )}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => refine(nextPageIndex)}
        disabled={isLastPage}
        className="h-8 w-8"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </Button>
    </div>
  );
}
