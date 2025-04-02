import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { getMockData, modifyMockData } from "./mockData";

// This is the mock implementation of the queryClient for frontend-only development
// It uses the mock data from mockData.ts instead of real API calls

// Simulate async delay to mimic real API calls
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Create a simulated response object
class MockResponse {
  status: number;
  statusText: string;
  ok: boolean;
  _data: any;

  constructor(data: any, status = 200, statusText = 'OK') {
    this.status = status;
    this.statusText = statusText;
    this.ok = status >= 200 && status < 300;
    this._data = data;
  }

  async text() {
    return JSON.stringify(this._data);
  }

  async json() {
    return this._data;
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<MockResponse> {
  // Simulate network delay
  await delay(100);
  
  // Check for authentication-required endpoints
  if (url === '/api/cart' && method !== 'GET') {
    // If we were checking real authentication, we'd verify here
    // But for demo purposes, we'll just assume the user is logged in
  }
  
  try {
    // Process modifications (POST, PUT, PATCH, DELETE)
    if (method !== 'GET') {
      const result = modifyMockData(method, url, data);
      
      if (result === null) {
        return new MockResponse({ message: "Not implemented" }, 501, "Not Implemented");
      }
      
      return new MockResponse(result, 201, "Created");
    }
    
    // Handle GET requests
    const mockData = getMockData(url);
    return new MockResponse(mockData);
  } catch (error: any) {
    return new MockResponse({ message: error.message }, 400, "Bad Request");
  }
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    // Simulate network delay
    await delay(100);
    
    const url = queryKey[0] as string;
    
    // Special case for auth-required endpoints when checking authentication
    if (url === '/api/user' || url === '/api/cart') {
      // For demo, simulate a logged in user by default
      // If you want to test the unauthorized state, you can modify this line
      const isLoggedIn = true; // Change to false to simulate logged out state
      
      if (!isLoggedIn) {
        if (unauthorizedBehavior === "returnNull") {
          return null;
        }
        throw new Error("Not authenticated");
      }
    }
    
    return getMockData(url);
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
