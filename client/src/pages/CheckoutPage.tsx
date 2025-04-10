import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Product, CartItem } from "@shared/schema";
import { COUNTRIES } from "@/lib/countries";
import {
  CreditCardIcon,
  TruckIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  ChevronRightIcon,
  MapPinIcon,
  BuildingIcon,
  GlobeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

// Add this constant for the S3 bucket URL (same as CartPage)
const S3_BUCKET_FILE_URL = "https://shopperrcdn.shopperr.in";

export default function CheckoutPage() {
  const [location, navigate] = useLocation();
  const [activeStep, setActiveStep] = useState("shipping");
  const [cartProducts, setCartProducts] = useState<Record<string, Product>>({});

  // Fetch cart items (same as CartPage)
  const {
    data: cartData,
    isLoading: isLoadingCart,
    refetch: refetchCart,
  } = useQuery({
    queryKey: ["cart"],
    refetchOnMount: "always", // Always refetch when component mounts
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", "http://localhost:8001/cart");
        if (!response.ok)
          throw new Error(`Failed to fetch cart items: ${response.status}`);
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
      }
    },
  });

  // Once we have cart data, fetch the associated products
  useQuery({
    queryKey: ["products/multiple", cartData?.items],
    enabled: !!cartData?.items && Object.keys(cartData.items).length > 0,
    refetchOnMount: "always",
    queryFn: async () => {
      try {
        const productIds = Object.keys(cartData.items);
        const response = await apiRequest(
          "POST",
          "http://localhost:8002/multiple-products",
          { product_ids: productIds }
        );

        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();

        // Extract the products array from the payload property
        const productsData = data.payload || [];

        // Create a map of product_id -> product
        const productsMap: Record<string, any> = {};
        if (Array.isArray(productsData)) {
          productsData.forEach((product: any) => {
            // Handling MongoDB ObjectId format
            const productId = product._id.$oid || product._id;
            productsMap[productId] = product;
          });
        }

        setCartProducts(productsMap);
        return productsMap;
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
  });

  // Force refetch cart data when component mounts
  useEffect(() => {
    refetchCart();
  }, [refetchCart]);

  // Create a merged array of cart items with their product details
  const cartItems = Object.entries(cartData?.items || {}).map(
    ([productId, details]: [string, any]) => ({
      id: productId,
      quantity: details.quantity,
      source: details.source,
      product: cartProducts[productId] || null,
    })
  );

  // Check if cart is empty
  const isCartEmpty = !isLoadingCart && (!cartItems || cartItems.length === 0);

  // Calculate cart totals based on the new structure
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.sp || 0) * item.quantity,
    0
  );

  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + tax;

  const handleSubmitShipping = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get form values
      const firstName =
        e.currentTarget.querySelector<HTMLInputElement>("#first-name")?.value ||
        "";
      const lastName =
        e.currentTarget.querySelector<HTMLInputElement>("#last-name")?.value ||
        "";
      const recipientName = `${firstName} ${lastName}`.trim();

      // Get country code and convert to full country name
      const countryCode =
        e.currentTarget.querySelector<HTMLSelectElement>("#country")?.value;
      const countryName =
        COUNTRIES.find((c) => c.code === countryCode)?.name || "India"; // Default to India if not found

      // Create a draft order
      const response = await apiRequest("POST", "http://localhost:8003/order", {
        currency: "INR",
        shippingPhoneNumber:
          e.currentTarget.querySelector<HTMLInputElement>("#phone")?.value,
        shippingAddress1:
          e.currentTarget.querySelector<HTMLInputElement>("#address1")?.value,
        shippingAddress2:
          e.currentTarget.querySelector<HTMLInputElement>("#address2")?.value ||
          "",
        shippingAddress3:
          e.currentTarget.querySelector<HTMLInputElement>("#address3")?.value ||
          "",
        recipientName: recipientName,
        shippingCity:
          e.currentTarget.querySelector<HTMLInputElement>("#city")?.value,
        shippingState:
          e.currentTarget.querySelector<HTMLInputElement>("#state")?.value,
        shippingPostalCode:
          e.currentTarget.querySelector<HTMLInputElement>("#zip")?.value,
        shippingCountry: countryName, // Use the full country name instead of code
        source: 1, // Default source value for web orders
      });

      console.log(response);
      if (!response.ok) {
        throw new Error("Failed to create order");
      } else {
        const order = await response.json();
        // Extract order ID from the correct fields in the response
        const orderId = order.payload?._id?.$oid;
        navigate(`/order/${orderId}`);
      }
    } catch (error) {
      console.error("Error creating order:", error);
      // Show error message
    }
  };

  if (isCartEmpty && !isLoadingCart) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center max-w-2xl mx-auto">
            <div className="text-amber-500 mb-4">
              <ShieldCheckIcon className="h-16 w-16 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">
              You need to add items to your cart before proceeding to checkout.
            </p>
            <Link href="/">
              <Button className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium">
                Continue Shopping
              </Button>
            </Link>
          </div>
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

        {/* Checkout Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center w-full max-w-2xl">
            <div
              className={`flex flex-col items-center ${
                activeStep === "shipping" ? "text-blue-600" : "text-gray-600"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  activeStep === "shipping"
                    ? "bg-blue-100 border-2 border-blue-600"
                    : "bg-green-100 border-2 border-green-600"
                }`}
              >
                {activeStep === "payment" ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                ) : (
                  <TruckIcon
                    className={`h-5 w-5 ${
                      activeStep === "shipping"
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  />
                )}
              </div>
              <span className="text-sm font-medium">Shipping</span>
            </div>

            <div
              className={`flex-1 h-1 mx-4 ${
                activeStep === "shipping" ? "bg-gray-200" : "bg-blue-600"
              }`}
            ></div>

            <div
              className={`flex flex-col items-center ${
                activeStep === "payment" ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                  activeStep === "payment"
                    ? "bg-blue-100 border-2 border-blue-600"
                    : "bg-gray-100 border-2 border-gray-300"
                }`}
              >
                <CreditCardIcon
                  className={`h-5 w-5 ${
                    activeStep === "payment" ? "text-blue-600" : "text-gray-500"
                  }`}
                />
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              {activeStep === "shipping" && (
                <div>
                  <h2 className="text-xl font-bold mb-6">
                    Shipping Information
                  </h2>

                  <div value="business" className="mt-4">
                    <form onSubmit={handleSubmitShipping}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <Label htmlFor="first-name">First Name*</Label>
                          <Input
                            id="first-name"
                            placeholder="First Name"
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="last-name">Last Name*</Label>
                          <Input
                            id="last-name"
                            placeholder="Last Name"
                            className="mt-1"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <Label htmlFor="address1">Address Line 1*</Label>
                        <Input
                          id="address1"
                          placeholder="Street address"
                          className="mt-1"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <Label htmlFor="address2">Address Line 2</Label>
                        <Input
                          id="address2"
                          placeholder="Apartment, suite, unit, building, floor, etc."
                          className="mt-1"
                        />
                      </div>
                      <div className="mb-4">
                        <Label htmlFor="address3">Address Line 3</Label>
                        <Input
                          id="address3"
                          placeholder="Landmark, etc."
                          className="mt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                          <Label htmlFor="city">City*</Label>
                          <Input
                            id="city"
                            placeholder="City"
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State / Province*</Label>
                          <Input
                            id="state"
                            placeholder="State"
                            className="mt-1"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="zip">ZIP / Postal Code*</Label>
                          <Input
                            id="zip"
                            placeholder="ZIP Code"
                            className="mt-1"
                            required
                          />
                        </div>
                      </div>

                      <div className="mb-4">
                        <Label htmlFor="country">Country*</Label>
                        <Select defaultValue="in">
                          <SelectTrigger>
                            <SelectValue placeholder="Select a country" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px]">
                            {COUNTRIES.map((country) => (
                              <SelectItem
                                key={country.code}
                                value={country.code}
                              >
                                {country.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="mb-4">
                        <Label htmlFor="phone">Phone Number*</Label>
                        <Input
                          id="phone"
                          placeholder="Phone Number"
                          className="mt-1"
                          required
                        />
                      </div>

                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium"
                        >
                          Continue to Payment
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {activeStep === "payment" && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Payment Method</h2>

                  <form onSubmit={handleSubmitShipping}>
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
                            <label className="font-medium text-lg">
                              PhonePe
                            </label>
                          </div>

                          <p className="mt-2 text-sm text-gray-600">
                            Secure and fast payments via PhonePe. You'll be
                            redirected to PhonePe to complete your payment.
                          </p>

                          <div className="mt-4 text-xs bg-blue-100 p-3 rounded">
                            <p className="font-medium">How it works:</p>
                            <ol className="list-decimal pl-4 mt-1 space-y-1">
                              <li>Click "Complete Order" below</li>
                              <li>
                                You'll be redirected to PhonePe's secure payment
                                gateway
                              </li>
                              <li>
                                Complete your payment using UPI, wallet, or
                                other methods
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

                    <h3 className="text-lg font-bold mb-4">Billing Address</h3>

                    <div className="mb-6">
                      <div className="flex items-center mb-4">
                        <Checkbox id="same-address" defaultChecked />
                        <label htmlFor="same-address" className="ml-2">
                          Same as shipping address
                        </label>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveStep("shipping")}
                      >
                        Back to Shipping
                      </Button>
                      <Button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium"
                      >
                        Complete Order
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>

              <div className="mb-4">
                <div className="text-sm mb-2">
                  {cartItems.length} {cartItems.length === 1 ? "item" : "items"}{" "}
                  in cart
                </div>

                {isLoadingCart ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <div className="max-h-40 overflow-y-auto mb-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex py-2 text-sm">
                        <div className="text-gray-600 mr-2">
                          {item.quantity} ×
                        </div>
                        <div className="flex-1 line-clamp-1">
                          {item.product ? item.product.name : "Loading..."}
                        </div>
                        <div className="font-medium ml-2">
                          $
                          {((item.product?.sp || 0) * item.quantity).toFixed(2)}
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
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Order Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <div className="text-xs text-gray-500">
                <p className="mb-2">
                  By placing your order, you agree to Shopperr B2B's terms and
                  conditions, privacy policy, and return policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
