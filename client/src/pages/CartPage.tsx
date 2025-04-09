import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Product, CartItem } from "@shared/schema";
import {
  Trash2Icon,
  PlusIcon,
  MinusIcon,
  ShoppingCartIcon,
  ChevronRightIcon,
  ShieldCheckIcon,
  TruckIcon,
  Clock3Icon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// Add this constant for the S3 bucket URL
const S3_BUCKET_FILE_URL = "https://shopperrcdn.shopperr.in";

export default function CartPage() {
  const queryClient = useQueryClient();
  const [cartProducts, setCartProducts] = useState<Record<string, Product>>({});

  // Fetch cart items
  const {
    data: cartData,
    isLoading: isLoadingCart,
    refetch: refetchCart,
  } = useQuery({
    queryKey: ["cart"],
    refetchOnMount: "always", // Always refetch when component mounts
    queryFn: async () => {
      console.log("Attempting to fetch cart data");
      try {
        const response = await apiRequest("GET", "http://localhost:8001/cart");

        console.log("Cart API response status:", response.status);

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
    // Always refetch products when component mounts
    refetchOnMount: true,
    queryFn: async () => {
      console.log("Fetching multiple products");
      try {
        // Log the exact state of cart data to verify
        console.log("Cart data for product fetch:", cartData);
        console.log("Cart items available:", Object.keys(cartData.items || {}));

        const productIds = Object.keys(cartData.items);
        console.log("Product IDs:", productIds);

        // Using apiRequest instead of direct fetch
        console.log("Sending request to multiple-products endpoint");
        const response = await apiRequest(
          "POST",
          "http://localhost:8002/multiple-products",
          { product_ids: productIds }
        );

        console.log("Products API response status:", response.status);

        if (!response.ok) throw new Error("Failed to fetch products");
        const data = await response.json();
        console.log("Products data received:", data);

        // Extract the products array from the payload property
        const productsData = data.payload || [];
        console.log("Products data extracted:", productsData);

        // Create a map of product_id -> product
        const productsMap: Record<string, any> = {};

        // Check if productsData is actually an array
        if (!Array.isArray(productsData)) {
          console.error("productsData is not an array:", productsData);
          return {};
        }

        productsData.forEach((product: any) => {
          // Handling MongoDB ObjectId format
          const productId = product._id.$oid || product._id;
          productsMap[productId] = product;
        });

        console.log("Products map created:", productsMap);

        setCartProducts(productsMap);
        return productsMap;
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
  });

  // Add a useEffect to debug the cart data when it changes
  useEffect(() => {
    if (cartData) {
      console.log("Cart data updated:", cartData);
      console.log("Cart items:", cartData.items);
      console.log("Cart items keys:", Object.keys(cartData.items || {}));
      console.log(
        "Enabled condition:",
        !!cartData?.items && Object.keys(cartData.items || {}).length > 0
      );
    }
  }, [cartData]);

  // Add this after your useQuery call
  useEffect(() => {
    // Force refetch products when cart data changes
    if (cartData?.items && Object.keys(cartData.items).length > 0) {
      queryClient.invalidateQueries({ queryKey: ["products/multiple"] });
    }
  }, [cartData, queryClient]);

  // Add an effect to force refetch when component mounts
  useEffect(() => {
    // Force refetch cart data when component mounts
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

  console.log(cartItems);

  const isCartEmpty = !isLoadingCart && (!cartItems || cartItems.length === 0);

  // Calculate cart totals (only for products that have been loaded)
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.product?.sp || 0) * item.quantity,
    0
  );

  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;

  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      return apiRequest("PATCH", `http://localhost:8001/cart/items/${id}`, {
        quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["products/multiple"] });
    },
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `http://localhost:8001/cart/items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["products/multiple"] });
    },
  });

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartMutation.mutate({ id, quantity: newQuantity });
  };

  const handleRemoveItem = (id: string) => {
    removeFromCartMutation.mutate(id);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          {!isCartEmpty && (
            <span className="text-gray-500 ml-4">
              ({cartItems.length} {cartItems.length === 1 ? "item" : "items"})
            </span>
          )}
        </div>

        {isLoadingCart ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0"
                  >
                    <div className="flex">
                      <Skeleton className="w-24 h-24 rounded mr-4" />
                      <div className="flex-1">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-5 w-1/4 mb-2" />
                        <Skeleton className="h-5 w-1/3 mb-3" />
                        <div className="flex justify-between">
                          <Skeleton className="h-8 w-28" />
                          <Skeleton className="h-8 w-24" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <Skeleton className="h-5 w-3/4 mb-4" />
                <Skeleton className="h-28 w-full mb-4" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        ) : isCartEmpty ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center max-w-2xl mx-auto">
            <div className="mb-6">
              <ShoppingCartIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">
                Looks like you haven't added any products to your cart yet.
                Browse our products and find something for your business!
              </p>
              <Link href="/">
                <Button className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium">
                  Continue Shopping
                </Button>
              </Link>
            </div>

            <Separator className="my-6" />

            <div>
              <h3 className="font-medium mb-3">
                Sign in to see your saved items
              </h3>
              <div className="flex justify-center space-x-4">
                <Button variant="outline">Sign in</Button>
                <Button variant="secondary">Create an account</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-end mb-4">
                  <div className="text-sm text-gray-500">Price</div>
                </div>

                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0"
                  >
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-24 h-24 bg-gray-50 flex items-center justify-center rounded mb-4 sm:mb-0 sm:mr-4">
                        {item.product ? (
                          <img
                            src={`${S3_BUCKET_FILE_URL}/${
                              item.product.imgUrl?.[0]?.src
                            }${
                              item.product.imgUrl?.[0]?.src.endsWith(".png")
                                ? ""
                                : ".png"
                            }`}
                            alt={item.product.name}
                            className="max-h-full max-w-full object-contain"
                          />
                        ) : (
                          <Skeleton className="h-24 w-24" />
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex justify-between">
                          <Link href={`/products/${item.id}`}>
                            <a className="text-lg font-medium hover:text-blue-600 hover:underline line-clamp-2">
                              {item.product
                                ? item.product.name
                                : "Loading product..."}
                            </a>
                          </Link>
                          <div className="text-lg font-bold">
                            $
                            {((item.product?.sp || 0) * item.quantity).toFixed(
                              2
                            )}
                          </div>
                        </div>

                        {/* Add shipping source information */}
                        <div className="text-sm text-gray-600 mb-2">
                          Shipping source: {item.source || "Shopperr B2B"}
                          {item.product?.pd_location && (
                            <span className="ml-2">
                              ({item.product.pd_location})
                            </span>
                          )}
                        </div>

                        <div className="text-sm text-green-600 mb-2">
                          In Stock
                        </div>

                        {/* <div className="text-sm text-gray-500 mb-2">
                          Eligible for FREE Shipping on orders over $50
                        </div> */}

                        <div className="flex flex-wrap gap-4 mt-3">
                          <div className="flex items-center">
                            <span className="mr-2 text-sm">Qty:</span>
                            <div className="flex items-center border rounded">
                              <button
                                className="px-2 py-1 hover:bg-gray-100"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                              >
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              <span className="px-3 py-1">{item.quantity}</span>
                              <button
                                className="px-2 py-1 hover:bg-gray-100"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          <button
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2Icon className="h-4 w-4 mr-1" /> Remove
                          </button>

                          {/* <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                            Save for later
                          </button> */}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="flex justify-between items-center mt-6 text-gray-800">
                  <div className="text-sm">
                    Items ship from{" "}
                    <span className="font-medium">Shopperr B2B</span>
                  </div>
                  <div className="text-xl font-bold">
                    Subtotal (
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    items):
                    <span className="text-amber-600 ml-2">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              {/* This would be populated with recommended products */}
              {/* <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">You might also like</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded p-3 relative">
                      <div className="h-20 flex items-center justify-center mb-2">
                        <Skeleton className="h-16 w-16" />
                      </div>
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-5 w-1/2 mb-2" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ))}
                </div>
              </div> */}
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <div className="mb-4">
                  {/* <div className="flex items-center text-green-600 mb-2">
                    <ShieldCheckIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">
                      Your order qualifies for SafePay protection
                    </span>
                  </div> */}

                  <div className="text-xl font-bold mb-4">
                    Subtotal (
                    {cartItems.reduce((sum, item) => sum + item.quantity, 0)}{" "}
                    items):
                    <span className="text-amber-600 ml-2">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  <Accordion type="single" collapsible className="mb-4">
                    <AccordionItem value="shipping">
                      <AccordionTrigger className="text-sm py-2">
                        Shipping details
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Standard Shipping:</span>
                            <span>
                              {shipping === 0
                                ? "FREE"
                                : `$${shipping.toFixed(2)}`}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Estimated Tax:</span>
                            <span>${tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span>Order Total:</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* <div className="flex items-center mb-4">
                    <input type="checkbox" id="gift" className="rounded" />
                    <label htmlFor="gift" className="ml-2 text-sm">
                      This order contains a gift
                    </label>
                  </div> */}

                  <Link href="/checkout">
                    <Button className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium mb-3">
                      Proceed to Checkout
                    </Button>
                  </Link>

                  <div className="text-sm">
                    {/* <div className="flex items-center text-gray-600 mb-1">
                      <Clock3Icon className="h-4 w-4 mr-1" />
                      <span>Expected delivery: 2-4 business days</span>
                    </div> */}
                    {/* <div className="flex items-center text-gray-600">
                      <TruckIcon className="h-4 w-4 mr-1" />
                      <span>Free shipping on orders over $50</span>
                    </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
