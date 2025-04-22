import { useEffect, useState } from "react";
import { Link, useRoute } from "wouter";
import { Spinner } from "@/components/ui/spinner"; // Assuming you have a Spinner component
import { CheckCircle, XCircle, LogIn } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type VerificationStatus = "loading" | "success" | "error";

export default function VerifyEmailPage() {
  const [match, params] = useRoute("/verify-email/:token");
  const [status, setStatus] = useState<VerificationStatus>("loading");
  const [message, setMessage] = useState<string>("");
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    if (match && params?.token) {
      const decodedToken = decodeURIComponent(params.token);
      setToken(decodedToken);
    } else {
      setStatus("error");
      setMessage("Invalid verification link or token missing.");
      setToken(null);
    }
  }, [match, params]);

  useEffect(() => {
    if (token === null) {
      return;
    }

    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    const verify = async () => {
      setStatus("loading");
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_REACT_APP_USER_API_URL
          }/verify-email/${token}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage(data.msg || "Email verified successfully.");
        } else {
          setStatus("error");
          setMessage(
            data.detail || data.msg || "An error occurred during verification."
          );
        }
      } catch (error) {
        setStatus("error");
        setMessage(
          error instanceof Error
            ? error.message
            : "An unexpected network error occurred."
        );
        console.error("Verification failed:", error);
      }
    };

    verify();
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <div className="flex flex-col items-center justify-center gap-4 p-8">
            <Spinner size="large" />
            <p className="text-lg">Verifying your email...</p>
          </div>
        );
      case "success":
        return (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-20 w-20 text-green-500" />
              </div>
              <CardTitle className="text-3xl">Verification Successful</CardTitle>
              <CardDescription className="text-lg">{message}</CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <Link href="/auth">
                  <LogIn className="mr-2 h-4 w-4" />
                  Proceed to Login
                </Link>
              </Button>
            </CardFooter>
          </>
        );
      case "error":
        return (
          <>
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <XCircle className="h-20 w-20 text-red-500" />
              </div>
              <CardTitle className="text-3xl">Verification Failed</CardTitle>
              <CardDescription className="text-lg text-red-600">{message}</CardDescription>
            </CardHeader>
             <CardFooter className="flex justify-center">
              <Button variant="outline" asChild>
                <Link href="/">
                  Go to Homepage
                </Link>
              </Button>
            </CardFooter>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-16 px-4 max-w-lg">
      <Card className="shadow-lg">{renderContent()}</Card>
    </div>
  );
} 