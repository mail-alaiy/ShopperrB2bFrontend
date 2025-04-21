import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  PackageCheck,
  Package,
  RefreshCw,
  Truck,
  CheckCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CartItem, Product } from "@shared/schema";
import { Link } from "wouter";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";

interface OrderItem {
  sku: string;
  sellerSku: string;
  quantity: number;
  quantityShipped: number;
  consumerPrice: number;
  title: string;
  source: string;
}

interface Order {
  _id: { $oid: string };
  mkpOrderId: string;
  createdAt: { $date: string };
  total_amount: number;
  orderDetails: OrderItem[];
  shippingCity: string;
  shippingState: string;
  pStatus: string;
  recipientName: string;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch orders data
  const {
    data: ordersData,
    isLoading: isOrdersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      try {
        const response = await apiRequest(
          "GET",
          `${import.meta.env.VITE_REACT_APP_ORDER_API_URL}/`
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
    },
  });

  // Filter orders by search term
  const filteredOrders = useMemo(() => {
    if (!ordersData?.payload) return [];

    const trimmedSearchTerm = searchTerm.trim().toLowerCase();
    if (!trimmedSearchTerm) return ordersData.payload;

    return ordersData.payload.filter((order: Order) =>
      order.mkpOrderId.toLowerCase().includes(trimmedSearchTerm)
    );
  }, [ordersData?.payload, searchTerm]);

  // Add a separate check for when there are no orders from the API
  const hasOrders = ordersData?.payload && ordersData.payload.length > 0;

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case "UP":
      case "PU":
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      case "PD":
        return <CheckCheck className="h-5 w-5 text-green-500" />;
      case "PF":
        return <RefreshCw className="h-5 w-5 text-red-500" />;
      case "SHIPPED":
        return <Truck className="h-5 w-5 text-orange-500" />;
      case "DELIVERED":
        return <CheckCheck className="h-5 w-5 text-green-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
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
      case "SHIPPED":
        return (
          <Badge
            variant="outline"
            className="bg-orange-50 text-orange-600 hover:bg-orange-50"
          >
            Shipped
          </Badge>
        );
      case "DELIVERED":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-600 hover:bg-green-50"
          >
            Delivered
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">
            Please login to view your orders
          </h1>
          <Link href="/auth">
            <Button>Login</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Your Orders</h1>
        <p className="text-gray-500">
          Track, manage, and view your order history
        </p>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search by order number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
          aria-label="Search orders"
        />
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          {/* <TabsTrigger value="returns">Returns & Refunds</TabsTrigger> */}
        </TabsList>

        <TabsContent value="orders">
          {isOrdersLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin mr-2" />
              <span>Loading your orders...</span>
            </div>
          ) : ordersError ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-red-500 mb-4">
                  Failed to load orders. Please try again later.
                </p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </CardContent>
            </Card>
          ) : !hasOrders ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <PackageCheck className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
                <p className="text-gray-500 mb-4 text-center">
                  You haven't placed any orders yet. Start shopping to get your business supplies!
                </p>
                <Link href="/">
                  <Button>Start Shopping</Button>
                </Link>
              </CardContent>
            </Card>
          ) : filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order: Order) => (
                <Card key={order._id.$oid}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <CardTitle>{order.mkpOrderId}</CardTitle>
                        <CardDescription>
                          Placed on{" "}
                          {new Date(order.createdAt.$date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center mt-2 md:mt-0">
                        {getStatusIcon(order.pStatus)}
                        <span className="ml-2">
                          {getStatusBadge(order.pStatus)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          {order.orderDetails.length} items
                        </p>
                        <p className="font-bold">
                          ₹{order.total_amount.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-4 md:mt-0">
                        <Link href={`/orders/${order._id.$oid}`}>
                          <Button variant="outline" size="sm">
                            View Details
                          </Button>
                        </Link>
                        {(order.pStatus === "UP" ||
                          order.pStatus === "PF" ||
                          !order.pStatus) && (
                          <Link href={`/order/${order._id.$oid}/payment`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="bg-blue-50 hover:bg-blue-100"
                            >
                              Pay Now
                            </Button>
                          </Link>
                        )}
                        {order.pStatus === "PD" && (
                          <Button variant="outline" size="sm">
                            Track Package
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <PackageCheck className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No matching orders</h3>
                <p className="text-gray-500 mb-4 text-center">
                  No orders matching "{searchTerm}"
                </p>
                <Button onClick={() => setSearchTerm("")}>Clear Search</Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* <TabsContent value="returns">
          {mockReturns.length > 0 ? (
            <div className="space-y-4">
              {mockReturns.map((returnItem) => (
                <Card key={returnItem.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <CardTitle>{returnItem.returnNumber}</CardTitle>
                        <CardDescription>
                          Return for order {returnItem.orderNumber} • Requested
                          on {new Date(returnItem.date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center mt-2 md:mt-0">
                        {getStatusIcon(returnItem.status)}
                        <span className="ml-2">
                          {getStatusBadge(returnItem.status)}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">
                          Refund Amount
                        </p>
                        <p className="font-bold">
                          ${returnItem.refundAmount.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-4 md:mt-0">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <RefreshCw className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No returns found</h3>
                <p className="text-gray-500 mb-4 text-center">
                  You haven't requested any returns or refunds
                </p>
                <Link href="/orders">
                  <Button variant="outline">View Orders</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
