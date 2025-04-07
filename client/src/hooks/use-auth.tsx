import { createContext, ReactNode, useContext } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
} from "@tanstack/react-query";
import { User, RegisterUser, LoginUser } from "@shared/schema";
import { getQueryFn, apiRequest, queryClient } from "../lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

type AuthResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
    id: string;
    email: string;
    full_name: string;
    company_name: string;
    phone_number: string;
    gst_number: string;
    business_street: string;
    business_city: string;
    business_state: string;
    role: string;
    business_type: string;
    business_country: string;
    created_at: string;
  };
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<AuthResponse, Error, LoginUser>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterUser>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const {
    data: user,
    error,
    isLoading,
  } = useQuery<User | null, Error>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginUser) => {
      const res = await fetch("http://localhost:8000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Login failed");
      }

      return await res.json();
    },
    onSuccess: (data: AuthResponse, variables: LoginUser) => {
      // Store tokens
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      // Store complete user data
      queryClient.setQueryData(["/api/user"], {
        id: data.user.id,
        email: data.user.email,
        name: data.user.full_name,
        companyName: data.user.company_name,
        phone: data.user.phone_number,
        gstNumber: data.user.gst_number,
        address: data.user.business_street,
        city: data.user.business_city,
        state: data.user.business_state,
        // No direct mapping for pincode in the response
        isVerified: true, // Assuming user is verified if they can login
        createdAt: data.user.created_at,
        // No direct mapping for updatedAt
        role: data.user.role,
        // You can also store additional fields from the response
        businessType: data.user.business_type,
        businessCountry: data.user.business_country,
      });

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

      // Navigate to home page
      setLocation("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (credentials: RegisterUser) => {
      // Format the data to match the required API structure
      const formattedData = {
        company_name: credentials.companyName,
        business_type: "Manufacturer", // Default value or you could add this field to the form
        business_street: credentials.address || "string",
        business_city: credentials.city,
        business_state: credentials.state || "string",
        business_country: "string", // You might want to add this to your form
        full_name: credentials.name,
        phone_number: credentials.phone,
        email: credentials.email,
        gst_number: credentials.gstNumber,
        password: credentials.password,
      };

      const res = await fetch("http://localhost:8000/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Registration failed");
      }

      return await res.json();
    },
    onSuccess: () => {
      // Don't store user data, just show success message
      toast({
        title: "Registration successful",
        description: "Please login with your credentials",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      // Remove tokens from localStorage
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");

      // No API request needed
      return;
    },
    onSuccess: () => {
      queryClient.setQueryData(["/api/user"], null);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <AuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
