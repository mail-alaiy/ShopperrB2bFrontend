import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a utility function for class names

interface SpinnerProps {
  size?: "small" | "medium" | "large";
  className?: string;
}

export function Spinner({ size = "medium", className }: SpinnerProps) {
  const sizeClasses = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-16 w-16",
  };

  return (
    <Loader2
      className={cn("animate-spin text-primary", sizeClasses[size], className)}
    />
  );
} 