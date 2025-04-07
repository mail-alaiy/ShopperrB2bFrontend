import { createContext, ReactNode, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { getQueryFn } from "../lib/queryClient"; // Assuming you have a generic query function

// Define types based on the API response structure
export interface SubSubCategory {
  name: string;
}

export interface SubCategory {
  name: string;
  subCategory: SubSubCategory[];
}

export interface Category {
  _id: { $oid: string };
  category: string;
  subCategory: SubCategory[];
}

export interface CategoriesApiResponse {
  message: string;
  payload: Category[];
}

// Define the type for the context value
type CategoryContextType = {
  categories: Category[] | null;
  isLoading: boolean;
  error: Error | null;
};

// Create the context
export const CategoryContext = createContext<CategoryContextType | null>(null);

// Define the base URL for the categories API
const CATEGORIES_API_URL = "http://localhost:8002/categories"; // Replace if needed

// Create the provider component
export function CategoryProvider({ children }: { children: ReactNode }) {
  const {
    data: categoriesData,
    isLoading,
    error,
  } = useQuery<CategoriesApiResponse, Error, Category[] | null>({
    queryKey: [CATEGORIES_API_URL], // Use the URL as the query key
    // queryFn is removed - React Query will use the default queryFn from queryClient
    select: (data) => data?.payload ?? null, // Extract the payload array
    staleTime: Infinity, // Fetch only once
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
  });

  return (
    <CategoryContext.Provider
      value={{
        categories: categoriesData ?? null, // Handle initial undefined state
        isLoading,
        error,
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

// Create the custom hook to use the context
export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error("useCategories must be used within a CategoryProvider");
  }
  return context;
}
