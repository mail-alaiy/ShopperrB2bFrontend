import { useState, useEffect } from "react";
import { Link, useLocation, useRoute, useRoute as useParams } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { CreditCardIcon, ShieldCheckIcon, CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

interface OrderItem {
  sku: string;
  sellerSku: string;
  quantity: number;
  quantityShipped: number;
  consumerPrice: number;
  title: string;
  source: string;
}

export default function PaymentPage() {
  const [location, navigate] = useLocation();
  const [, params] = useRoute("/order/:orderId");
  const queryClient = useQueryClient();
  const orderId = params?.orderId;
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  // Fetch order data
  const { data: orderData, isLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      try {
        const response = await apiRequest(
          "GET",
          `${import.meta.env.VITE_REACT_APP_ORDER_API_URL}/order/${orderId}`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch order: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching order:", error);
        throw error;
      }
    },
  });

  // Handle payment submission
  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Process payment with the correct endpoint
      const response = await apiRequest(
        "GET",
        `${
          import.meta.env.VITE_REACT_APP_PAYMENT_API_URL
        }/pay/${orderId}`
      );

      if (!response.ok) {
        throw new Error("Payment processing failed");
      }

      const paymentData = await response.json();

      // Redirect to payment gateway
      if (paymentData.paymentUrl) {
        window.location.href = paymentData.paymentUrl;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setPaymentError(
        error instanceof Error
          ? error.message
          : "Payment failed. Please try again."
      );
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-8">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
            <div>
              <Skeleton className="h-96 w-full rounded-lg" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!orderData) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
          <p className="mb-6">
            The order you're looking for could not be found.
          </p>
          <Link href="/cart">
            <Button className="bg-[#62c8f5] hover:bg-[#06184b] hover:text-white text-gray-900 font-medium">
              Return to Cart
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <Link href="/">
            <a className="text-2xl font-bold mr-6">
              Shopperr<span className="text-amber-500">B2B</span>
            </a>
          </Link>
        </div>

        {/* Checkout Steps - Simplified to just show we're on payment */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center w-full max-w-2xl">
            <div className="flex flex-col items-center text-gray-600">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-green-100 border-2 border-green-600">
                <CheckCircleIcon className="h-6 w-6 text-green-600" />
              </div>
              <span className="text-sm font-medium">Shipping</span>
            </div>

            <div className="flex-1 h-1 mx-4 bg-blue-600"></div>

            <div className="flex flex-col items-center text-blue-600">
              <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 bg-blue-100 border-2 border-blue-600">
                <CreditCardIcon className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h2 className="text-xl font-bold mb-6">Payment Method</h2>

              {paymentError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-300 rounded text-red-800">
                  {paymentError}
                </div>
              )}

              <form onSubmit={handleSubmitPayment}>
                <div className="mb-6">
                  <div className="flex items-start space-x-4 border rounded-md p-4 bg-blue-50">
                    <div className="flex-1">
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full p-2 mr-3">
                          <img
                            src="/phonepe-logo.png"
                            alt="PhonePe"
                            className="h-6 w-6"
                            onError={(e) => {
                              e.currentTarget.src =
                                "https://www.phonepe.com/favicon.ico";
                            }}
                          />
                        </div>
                        <label className="font-medium text-lg">PhonePe</label>
                      </div>

                      <p className="mt-2 text-sm text-gray-600">
                        Secure and fast payments via PhonePe. You'll be
                        redirected to PhonePe to complete your payment.
                      </p>

                      <div className="mt-4 text-xs bg-blue-100 p-3 rounded">
                        <p className="font-medium">How it works:</p>
                        <ol className="list-decimal pl-4 mt-1 space-y-1">
                          <li>Click "Complete Payment" below</li>
                          <li>
                            You'll be redirected to PhonePe's secure payment
                            gateway
                          </li>
                          <li>
                            Complete your payment using UPI, wallet, or other
                            methods
                          </li>
                          <li>
                            Once payment is successful, you'll return to
                            complete your order
                          </li>
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Processing...
                      </div>
                    ) : (
                      "Complete Payment"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="mb-4">
                <div className="text-sm mb-2">
                  Order #{orderData.payload?.mkpOrderId || orderId}
                </div>

                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <div className="max-h-40 overflow-y-auto mb-4">
                    {orderData.payload?.orderDetails?.map((item: OrderItem) => (
                      <div key={item.sku} className="flex py-2 text-sm">
                        <div className="text-gray-600 mr-2">
                          {item.quantity} ×
                        </div>
                        <div className="flex-1 line-clamp-1">{item.title}</div>
                        <div className="font-medium ml-2">
                          ₹{(item.consumerPrice * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">
                    ₹{orderData.payload?.total_amount?.toFixed(2) || "0.00"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium">FREE</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (included)</span>
                  <span className="font-medium">-</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Order Total</span>
                <span>
                  ₹{orderData.payload?.total_amount?.toFixed(2) || "0.00"}
                </span>
              </div>

              <div className="text-xs text-gray-500">
                <p className="mb-2">
                  By completing your payment, you agree to Shopperr B2B's terms
                  and conditions, privacy policy, and return policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
