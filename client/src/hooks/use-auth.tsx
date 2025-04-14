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

// Get the base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_REACT_APP_USER_API_URL;

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

type MeResponseUser = {
  id: string;
  company_name: string;
  business_type: string;
  business_street: string;
  business_city: string;
  business_state: string;
  business_country: string;
  full_name: string;
  phone_number: string;
  email: string;
  gst_number: string;
  role: string;
  created_at: string;
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
  } = useQuery<MeResponseUser | null, Error, User | null>({
    queryKey: [`${API_BASE_URL}/me`],
    enabled: !!localStorage.getItem("access_token"),
    select: (data: MeResponseUser | null): User | null => {
      if (!data) {
        return null;
      }

      const formattedUser: User = {
        email: data.email,
        name: data.full_name,
        companyName: data.company_name,
        phone: data.phone_number,
        gstNumber: data.gst_number,
        address: data.business_street || null,
        city: data.business_city,
        state: data.business_state || null,
        pincode: null,
        isVerified: true,
        createdAt: data.created_at,
        updatedAt: data.created_at,
        role: data.role,
        password: "",
      };
      return formattedUser;
    },
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginUser) => {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Login failed");
      }

      return await res.json();
    },
    onSuccess: (data: AuthResponse, variables: LoginUser) => {
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      const formattedUserData: User = {
        email: data.user.email,
        name: data.user.full_name,
        companyName: data.user.company_name,
        phone: data.user.phone_number,
        gstNumber: data.user.gst_number,
        address: data.user.business_street || null,
        city: data.user.business_city,
        state: data.user.business_state || null,
        pincode: null,
        isVerified: true,
        createdAt: data.user.created_at,
        updatedAt: data.user.created_at,
        role: data.user.role,
        password: "",
        businessType: data.user.business_type,
        businessCountry: data.user.business_country,
      };

      queryClient.setQueryData(["/users/me"], formattedUserData);

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });

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
      const formattedData = {
        company_name: credentials.companyName,
        business_type: "Manufacturer",
        business_street: credentials.address || "string",
        business_city: credentials.city,
        business_state: credentials.state || "string",
        business_country: "string",
        full_name: credentials.name,
        phone_number: credentials.phone,
        email: credentials.email,
        gst_number: credentials.gstNumber,
        password: credentials.password,
      };

      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Registration failed");
      }

      return await res.json();
    },
    onSuccess: () => {
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
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      queryClient.setQueryData(["/users/me"], null);
      return;
    },
    onSuccess: () => {
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
