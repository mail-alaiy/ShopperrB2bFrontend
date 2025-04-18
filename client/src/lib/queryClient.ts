import { QueryClient, QueryFunction } from "@tanstack/react-query";

const API_BASE_URL = import.meta.env.REACT_APP_USER_API_URL;

// Define queryClient here or import it if defined elsewhere and exported
// If defined below, move its definition up or import.
// For simplicity, let's assume queryClient is accessible here.
// You might need to adjust imports based on your actual file structure.
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
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

// --- Helper function for logout ---
function forceLogout() {
  console.error("Refresh token failed or missing. Forcing logout.");
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  queryClient.setQueryData(["/api/user"], null); // Clear user data
  queryClient.invalidateQueries(); // Invalidate all queries
  // Redirect to login page
  // Using window.location for simplicity as navigating from here can be tricky
  window.location.href = "/auth?sessionExpired=true"; // Or your login route
}

// --- Modified apiRequest ---
export async function apiRequest(
  method: string,
  url: string, // This should be the relative path, e.g., /some/api/endpoint
  data?: unknown | undefined,
  isRetry = false // Flag to prevent infinite refresh loops
): Promise<Response> {
  console.log(`[API Request] Starting ${method} ${url}${isRetry ? ' (retry)' : ''}`);
  
  const makeRequest = async (token: string | null): Promise<Response> => {
    const headers: Record<string, string> = {};
    if (data) {
      headers["Content-Type"] = "application/json";
      console.log(`[API Request] Sending data payload`, { dataSize: JSON.stringify(data).length });
    }
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
      console.log(`[API Request] Using authorization token (${token.substring(0, 10)}...)`);
    } else {
      console.log(`[API Request] No authorization token provided`);
    }

    console.log(`[API Request] Making request: ${method} ${url}`, { headers: Object.keys(headers) });

    const response = await fetch(url, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined,
      // credentials: "include", // Usually not needed when sending Bearer token explicitly
    });
    
    console.log(`[API Response] Status: ${response.status} ${response.statusText}`);
    return response;
  };

  try {
    let accessToken = localStorage.getItem("access_token");
    console.log(`[API Request] Retrieved token from storage: ${accessToken ? 'Present' : 'Not found'}`);
    
    let response = await makeRequest(accessToken);

    if (!response.ok) {
      console.log(`[API Error] Request failed with status ${response.status}`);
      
      // Check specifically for 422 (or potentially 401 depending on your API)
      // **IMPORTANT**: Confirm with your API documentation if 422 is correct for expired *access* tokens. Often it's 401. Adjust the status code check if needed.
      if (
        (response.status === 422 ||
          response.status === 401 ||
          response.status === 403) &&
        !isRetry
      ) {
        console.log(
          `[Token Refresh] Access token expired (${response.status} received). Attempting refresh...`
        );
        const refreshToken = localStorage.getItem("refresh_token");

        if (!refreshToken) {
          console.log(
            "[Token Refresh] No refresh token found. Forcing logout."
          );
          forceLogout();
          throw new Error("Session expired. No refresh token."); // Throw error after logout
        }

        // --- Attempt Refresh ---
        try {
          console.log("[Token Refresh] Sending refresh token request...");
          const refreshResponse = await fetch(`${API_BASE_URL}/refresh`, {
            method: "POST",
            headers: {
              "refresh-token": refreshToken,
            },
          });

          console.log(
            `[Token Refresh] Response status: ${refreshResponse.status}`
          );

          if (!refreshResponse.ok) {
            // If refresh fails (e.g., 422), logout
            console.log(
              `[Token Refresh] Refresh token request failed with status: ${refreshResponse.status}`
            );
            forceLogout();
            throw new Error(
              `Session expired. Refresh failed (${refreshResponse.status}).`
            ); // Throw error after logout
          }

          const refreshData = await refreshResponse.json();
          console.log(
            `[Token Refresh] Response data:`,
            Object.keys(refreshData)
          );

          const newAccessToken = refreshData.access_token; // Adjust if the key name is different

          if (!newAccessToken) {
            console.log(
              "[Token Refresh] Refresh response did not contain a new access token."
            );
            forceLogout();
            throw new Error("Session expired. Invalid refresh response."); // Throw error after logout
          }

          console.log("[Token Refresh] Successful. Storing new access token.");
          localStorage.setItem("access_token", newAccessToken);

          // --- Retry Original Request ---
          console.log(
            "[Token Refresh] Retrying original request with new token..."
          );
          // Call apiRequest again, marking it as a retry to prevent loops
          // Pass the *original* relative URL
          return await apiRequest(method, url, data, true);
        } catch (refreshError) {
          console.error(
            "[Token Refresh] Error during token refresh:",
            refreshError
          );
          // Ensure logout happens even if the refresh fetch itself throws an error
          forceLogout();
          // Re-throw the error that caused the logout
          throw refreshError;
        }
      } else {
        // If it's not a 422/401 or it's already a retry, throw the error
        const errorText = await response.text();
        console.log(
          `[API Error] Request failed with status ${
            response.status
          }, not refreshing ${isRetry ? "(already retried)" : ""}.`
        );
        console.log(`[API Error] Error details:`, errorText);
        throw new Error(
          `${response.status} ${response.statusText}: ${errorText}`
        );
      }
    }
    // If response was ok initially
    console.log(`[API Success] Request completed successfully`);
    return response;
  } catch (error) {
    console.error(`[API Fatal Error] (${method} ${url}):`, error);
    // Re-throw the error to be caught by React Query or calling function
    throw error;
  }
}

// --- Update getQueryFn to use apiRequest ---
type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401?: UnauthorizedBehavior; // Make optional if needed, default to throw?
}) => QueryFunction<T | null> =  // Return type might be null now
  (
    { on401: unauthorizedBehavior = "throw" } // Default to throw
  ) =>
  async ({ queryKey }) => {
    const apiUrl = queryKey[0] as string; // Expecting relative URL like '/api/user'

    try {
      // Use the modified apiRequest which handles refresh
      const res = await apiRequest("GET", apiUrl);
      // No need for throwIfResNotOk here, apiRequest handles non-OK responses unless it's a handled 422/401
      return await res.json();
    } catch (error: any) {
      // Check if the error is due to forced logout or specific unauthenticated status
      // Note: The specific error checking might need refinement based on what apiRequest throws after logout
      const isAuthError =
        error.message?.includes("Session expired") ||
        error.message?.startsWith("401") ||
        error.message?.startsWith("422");

      if (isAuthError && unauthorizedBehavior === "returnNull") {
        console.log(
          "getQueryFn returning null due to auth error and on401=returnNull"
        );
        return null; // Return null as requested for 401s (or forced logout)
      }
      // Otherwise, re-throw the error for React Query to handle
      console.error(`getQueryFn caught error for key ${queryKey}:`, error);
      throw error;
    }
  };

// Re-assign the default queryFn after it's defined
queryClient.setDefaultOptions({
  queries: {
    ...queryClient.getDefaultOptions().queries, // Keep other defaults
    queryFn: getQueryFn({ on401: "throw" }), // Set default queryFn
  },
});
