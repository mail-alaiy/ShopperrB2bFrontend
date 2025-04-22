import { CheckCircle, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "wouter";
import { useEffect } from "react";
import { queryClient } from "@/lib/queryClient";

export default function OrderSuccessPage() {
  // Clear the cart when this page loads
  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
  }, []);

  return (
    <div className="container mx-auto py-16 px-4 max-w-3xl">
      <Card className="shadow-lg">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="h-20 w-20 text-green-500" />
          </div>
          <CardTitle className="text-3xl">Order Submitted</CardTitle>
          <CardDescription className="text-lg">
             Please check the 'My Orders' page shortly to verify payment status and confirm your order.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-gray-600">
            If your payment was successful, you will receive a confirmation email.
            Please visit the <Link href="/orders"><a className="text-blue-600 hover:underline">My Orders</a></Link> page for the latest status.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="outline" className="w-full sm:w-auto" asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
          </Button>
          <Button className="w-full sm:w-auto" asChild>
            <Link href="/orders">
              <ShoppingBag className="mr-2 h-4 w-4" />
              View My Orders
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
