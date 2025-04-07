import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { Loader2, User, ShoppingBag, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { CartItem, Product } from "@shared/schema";
import { Link } from "wouter";

export default function ProfilePage() {
  const { user, logoutMutation } = useAuth();
  const { toast } = useToast();

  const { data: cartItems = [], isLoading: isCartLoading } = useQuery<
    (CartItem & { product: Product })[]
  >({
    queryKey: ["/api/cart"],
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (!user) {
    return (
      <div className="container mx-auto py-10 text-center">
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">
            Please login to view your profile
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
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start gap-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">{user.name}'s Account</h1>
          <p className="text-gray-500">
            {user.company} • {user.city}
          </p>
        </div>
        <Button
          variant="destructive"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          {logoutMutation.isPending ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <LogOut className="h-4 w-4 mr-2" />
          )}
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account details</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-1">
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  asChild
                >
                  <Link href="/orders">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Orders
                  </Link>
                </Button>
                <Button variant="ghost" className="w-full justify-start">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="col-span-1 md:col-span-3">
          <Tabs defaultValue="profile">
            <TabsList className="mb-4">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="orders">Recent Orders</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    View and update your profile details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Full Name
                      </h3>
                      <p>{user.name}</p>
                    </div>
                    {/* <div>
                      <h3 className="text-sm font-medium text-gray-500">Username</h3>
                      <p>{user.username}</p>
                    </div> */}
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Email
                      </h3>
                      <p>{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Phone
                      </h3>
                      <p>{user.phone}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Company
                      </h3>
                      <p>{user.companyName}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        City
                      </h3>
                      <p>{user.city}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        GST Number
                      </h3>
                      <p>{user.gstNumber}</p>
                    </div>
                    {/* Aryan - after company validation functionality */}
                    {/* <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Account Status
                      </h3>
                      <p>
                        {user.isVerified ? "Verified" : "Pending Verification"}
                      </p>
                    </div> */}
                  </div>
                  {/* <div className="pt-4">
                    <Button>Update Profile</Button>
                  </div> */}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Your Recent Orders</CardTitle>
                  <CardDescription>
                    View your order history and status
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {isCartLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                  ) : cartItems.length > 0 ? (
                    <div className="space-y-4">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4 border-b pb-4"
                        >
                          <div className="h-16 w-16 overflow-hidden rounded bg-gray-100">
                            {Array.isArray(item.product.images) &&
                              item.product.images.length > 0 && (
                                <img
                                  src={item.product.images[0]}
                                  alt={item.product.name}
                                  className="h-full w-full object-cover"
                                />
                              )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{item.product.name}</h3>
                            <p className="text-sm text-gray-500">
                              Quantity: {item.quantity} • $
                              {item.product.salePrice.toFixed(2)} each
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">
                              $
                              {(item.quantity * item.product.salePrice).toFixed(
                                2
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="mb-4">You have no recent orders</p>
                      <Link href="/">
                        <Button>Start Shopping</Button>
                      </Link>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
