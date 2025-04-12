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
          <CardTitle className="text-3xl">Order Successful!</CardTitle>
          <CardDescription className="text-lg">
            Thank you for your purchase
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {/* <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-medium text-xl mb-2">Order #ORD-{Math.floor(100000 + Math.random() * 900000)}</h3>
            <p className="text-gray-500">
              We've sent a confirmation email with order details to your registered email address.
            </p>
          </div> */}

          <div className="space-y-2">
            <h3 className="font-medium">Next steps:</h3>
            <ul className="text-gray-600 text-left mx-auto max-w-md space-y-3">
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  1
                </span>
                <span>
                  Your order is being processed and will be prepared for
                  shipping.
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  2
                </span>
                <span>
                  You'll receive shipping confirmation with tracking details
                  once your order is dispatched.
                </span>
              </li>
              <li className="flex items-start">
                <span className="bg-green-100 text-green-800 rounded-full h-6 w-6 flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                  3
                </span>
                <span>
                  You can check your order status anytime in the "Orders"
                  section of your account.
                </span>
              </li>
            </ul>
          </div>
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
