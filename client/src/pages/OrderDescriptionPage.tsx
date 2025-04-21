import React from "react";
import { useRoute, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Loader2,
  PackageCheck,
  ArrowLeft,
  Package,
  RefreshCw,
  Truck,
  CheckCheck,
  Home,
  Phone,
  User,
  Hash,
  CalendarDays,
  Receipt,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

// --- Type Definitions (align with OrdersPage and API response) ---
interface OrderItem {
  sku: string;
  sellerSku: string;
  quantity: number;
  quantityShipped: number;
  consumerPrice: number;
  title: string;
  source: string; // Assuming source might be relevant
  // Add image URL if available from API in the future
  // imgUrl?: string;
}

interface Order {
  _id: { $oid: string };
  mkpOrderId: string;
  createdAt: { $date: string };
  total_amount: number;
  orderDetails: OrderItem[];
  shippingAddress1: string;
  shippingAddress2?: string;
  shippingAddress3?: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingCountry: string;
  shippingPhoneNumber?: string;
  pStatus: string; // Payment Status
  recipientName: string;
  currency: string; // e.g., "INR"
}

interface ApiResponse {
  message: string;
  payload: Order;
}

// --- Helper Functions (copied/adapted from OrdersPage) ---

const getStatusIcon = (status: string) => {
  switch (status?.toUpperCase()) {
    case "UP": // Unpaid
    case "PU": // Payment Under Process (Treat similar to unpaid for icon)
      return <RefreshCw className="h-5 w-5 text-blue-500" />;
    case "PD": // Paid
      return <CheckCheck className="h-5 w-5 text-green-500" />;
    case "PF": // Payment Failed
      return <RefreshCw className="h-5 w-5 text-red-500" />;
    // Add shipment statuses if available in the detailed order view
    // case "SHIPPED": return <Truck className="h-5 w-5 text-orange-500" />;
    // case "DELIVERED": return <CheckCheck className="h-5 w-5 text-green-500" />;
    default:
      return <Package className="h-5 w-5 text-gray-500" />; // Default/Unknown status
  }
};

const getStatusBadge = (status: string) => {
  switch (status?.toUpperCase()) {
    case "UP":
    case "PU":
      return (
        <Badge
          variant="outline"
          className="bg-blue-50 text-blue-600 hover:bg-blue-50"
        >
          Payment Pending
        </Badge>
      );
    case "PD":
      return (
        <Badge
          variant="outline"
          className="bg-green-50 text-green-600 hover:bg-green-50"
        >
          Paid
        </Badge>
      );
    case "PF":
      return (
        <Badge
          variant="outline"
          className="bg-red-50 text-red-600 hover:bg-red-50"
        >
          Payment Failed
        </Badge>
      );
    // Add shipment statuses if available
    // case "SHIPPED": return <Badge variant="outline" className="bg-orange-50 text-orange-600 hover:bg-orange-50">Shipped</Badge>;
    // case "DELIVERED": return <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">Delivered</Badge>;
    default:
      return <Badge variant="secondary">{status || "Unknown"}</Badge>;
  }
};

// --- Component ---
export default function OrderDescriptionPage() {
  const [, params] = useRoute("/orders/:orderId");
  const orderId = params?.orderId;
  console.log("orderId", orderId);

  // --- Add Logs ---
  console.log("[OrderDescriptionPage] Render - Order ID from params:", orderId);
  console.log("[OrderDescriptionPage] Query enabled state:", !!orderId);
  const apiUrl = orderId ? `${import.meta.env.VITE_REACT_APP_ORDER_API_URL}/order/${orderId}` : null;
  console.log("[OrderDescriptionPage] Constructed API URL:", apiUrl);
  // --- End Logs ---

  const {
    data: orderData,
    isLoading,
    error,
  } = useQuery<ApiResponse, Error>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      // --- Add Log Inside queryFn ---
      console.log(`[OrderDescriptionPage] queryFn running for orderId: ${orderId}`);
      // --- End Log ---
      if (!orderId || !apiUrl) throw new Error("Order ID or API URL is missing"); // Added apiUrl check
      const response = await apiRequest("GET", apiUrl);
      if (!response.ok) {
        const errorBody = await response.text();
        console.error("API Error Response:", errorBody);
        throw new Error(
          `Failed to fetch order details: ${response.status} ${response.statusText}`
        );
      }
      return response.json();
    },
    enabled: !!orderId, // Query is enabled only if orderId is truthy
    retry: 1,
  });

  const order = orderData?.payload;

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 max-w-4xl space-y-6">
        <Skeleton className="h-8 w-32" /> {/* Back button */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-4 w-1/3" />
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-32" />
            <Skeleton className="h-24" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/4" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-8 w-1/3 ml-auto" />
          </CardFooter>
        </Card>
      </div>
    );
  }

  // --- Error State ---
  if (error || !order) {
    return (
      <div className="container mx-auto py-8 max-w-4xl">
        <div className="mb-6">
          <Link href="/orders">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
            </Button>
          </Link>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <PackageCheck className="h-16 w-16 text-red-300 mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-red-600">
              Error Loading Order
            </h3>
            <p className="text-gray-600 mb-4">
              We couldn't fetch the details for this order. It might not exist
              or there was a problem connecting.
            </p>
            <p className="text-sm text-gray-500 mb-6">
              {error?.message || "Please try again later."}
            </p>
            <Link href="/orders">
              <Button variant="secondary">View All Orders</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --- Success State ---
  const orderDate = new Date(order.createdAt.$date);

  return (
    <div className="container mx-auto py-8 max-w-4xl space-y-6">
      <div className="mb-6">
        <Link href="/orders">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
          </Button>
        </Link>
      </div>

      {/* Order Header */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <CardTitle className="text-xl md:text-2xl flex items-center gap-2">
                <Receipt className="h-6 w-6 text-gray-600" />
                Order {order.mkpOrderId}
              </CardTitle>
              <CardDescription className="mt-1 flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                Placed on {orderDate.toLocaleDateString()} at{" "}
                {orderDate.toLocaleTimeString()}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 mt-2 sm:mt-0">
              {getStatusIcon(order.pStatus)}
              {getStatusBadge(order.pStatus)}
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Shipping Information */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Truck className="h-5 w-5" /> Shipping Address
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              {order.recipientName}
            </p>
            <p className="flex items-start gap-2">
              <Home className="h-4 w-4 text-gray-500 mt-0.5 flex-shrink-0" />
              <span>
                {order.shippingAddress1}
                {order.shippingAddress2 && <>, {order.shippingAddress2}</>}
                {order.shippingAddress3 && <>, {order.shippingAddress3}</>}
                <br />
                {order.shippingCity}, {order.shippingState}{" "}
                {order.shippingPostalCode}
                <br />
                {order.shippingCountry}
              </span>
            </p>
            {order.shippingPhoneNumber && (
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-500" />
                {order.shippingPhoneNumber}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Payment Information - Simple for now */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Payment</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            {getStatusIcon(order.pStatus)}
            {getStatusBadge(order.pStatus)}
            {(order.pStatus === "UP" ||
              order.pStatus === "PF" ||
              !order.pStatus) && (
              <Link href={`/order/${order._id.$oid}/payment`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto bg-blue-50 hover:bg-blue-100"
                >
                  Pay Now
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.orderDetails.map((item, index) => (
              <React.Fragment key={`${item.sku}-${index}`}>
                <div className="flex items-start gap-4 text-sm">
                  {/* Placeholder for image - Add when API provides imgUrl */}
                  {/* <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                        <img src={getFullImageUrl(item.imgUrl)} alt={item.title} className="max-h-full max-w-full object-contain" />
                                    </div> */}
                  <div className="flex-grow">
                    <p className="font-medium line-clamp-2">{item.title}</p>
                    <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                      <Hash className="h-3 w-3" /> SKU: {item.sku || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Seller SKU: {item.sellerSku || "N/A"}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p>₹{item.consumerPrice.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                    <p className="font-medium mt-1">
                      ₹{(item.consumerPrice * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
                {index < order.orderDetails.length - 1 && <Separator />}
              </React.Fragment>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end pt-4 border-t">
          <div className="text-right">
            <p className="text-sm text-gray-600">Order Total</p>
            <p className="text-xl font-bold">₹{order.total_amount.toFixed(2)}</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
} 