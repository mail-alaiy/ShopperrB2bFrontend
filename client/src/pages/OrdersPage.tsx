import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Loader2, PackageCheck, Package, RefreshCw, Truck, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CartItem, Product } from "@shared/schema";
import { Link } from "wouter";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

// Mock order data for demo purposes
const mockOrders = [
  { 
    id: 1, 
    orderNumber: "ORD-12345", 
    date: "2025-02-15", 
    status: "Delivered", 
    total: 249.95,
    items: 3,
  },
  { 
    id: 2, 
    orderNumber: "ORD-12346", 
    date: "2025-03-01", 
    status: "Shipped", 
    total: 129.99,
    items: 1,
  },
  { 
    id: 3, 
    orderNumber: "ORD-12347", 
    date: "2025-03-20", 
    status: "Processing", 
    total: 499.99,
    items: 2,
  },
];

// Mock return data for demo purposes
const mockReturns = [
  { 
    id: 1, 
    returnNumber: "RET-5001", 
    orderNumber: "ORD-12340", 
    date: "2025-02-01", 
    status: "Approved", 
    refundAmount: 89.99,
  },
];

export default function OrdersPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: cartItems = [], isLoading: isCartLoading } = useQuery<(CartItem & { product: Product })[]>({
    queryKey: ["/api/cart"],
  });

  // Filter orders by search term
  const filteredOrders = mockOrders.filter(order => 
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Processing":
        return <RefreshCw className="h-5 w-5 text-blue-500" />;
      case "Shipped":
        return <Truck className="h-5 w-5 text-orange-500" />;
      case "Delivered":
        return <CheckCheck className="h-5 w-5 text-green-500" />;
      case "Approved":
        return <CheckCheck className="h-5 w-5 text-green-500" />;
      default:
        return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Processing":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-50">Processing</Badge>;
      case "Shipped":
        return <Badge variant="outline" className="bg-orange-50 text-orange-600 hover:bg-orange-50">Shipped</Badge>;
      case "Delivered":
        return <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">Delivered</Badge>;
      case "Approved":
        return <Badge variant="outline" className="bg-green-50 text-green-600 hover:bg-green-50">Approved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Please login to view your orders</h1>
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
        <p className="text-gray-500">Track, manage, and view your order history</p>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search by order number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="mb-4">
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="returns">Returns & Refunds</TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          {filteredOrders.length > 0 ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <Card key={order.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <CardTitle>{order.orderNumber}</CardTitle>
                        <CardDescription>Placed on {new Date(order.date).toLocaleDateString()}</CardDescription>
                      </div>
                      <div className="flex items-center mt-2 md:mt-0">
                        {getStatusIcon(order.status)}
                        <span className="ml-2">{getStatusBadge(order.status)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">{order.items} items</p>
                        <p className="font-bold">${order.total.toFixed(2)}</p>
                      </div>
                      <div className="flex gap-2 mt-4 md:mt-0">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {order.status === "Delivered" && (
                          <Button variant="outline" size="sm">
                            Request Return
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          Track Package
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
                <PackageCheck className="h-16 w-16 text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold mb-2">No orders found</h3>
                <p className="text-gray-500 mb-4 text-center">
                  {searchTerm ? `No orders matching "${searchTerm}"` : "You haven't placed any orders yet"}
                </p>
                <Link href="/">
                  <Button>Shop Now</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="returns">
          {mockReturns.length > 0 ? (
            <div className="space-y-4">
              {mockReturns.map((returnItem) => (
                <Card key={returnItem.id}>
                  <CardHeader className="pb-2">
                    <div className="flex flex-col md:flex-row justify-between">
                      <div>
                        <CardTitle>{returnItem.returnNumber}</CardTitle>
                        <CardDescription>
                          Return for order {returnItem.orderNumber} • Requested on {new Date(returnItem.date).toLocaleDateString()}
                        </CardDescription>
                      </div>
                      <div className="flex items-center mt-2 md:mt-0">
                        {getStatusIcon(returnItem.status)}
                        <span className="ml-2">{getStatusBadge(returnItem.status)}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                      <div>
                        <p className="text-sm text-gray-500 mb-1">Refund Amount</p>
                        <p className="font-bold">${returnItem.refundAmount.toFixed(2)}</p>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}