import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Product, CartItem as SharedCartItem } from "@shared/schema";
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
import { Separator } from "@/components/ui/separator";

// Add this constant for the S3 bucket URL
const S3_BUCKET_FILE_URL = "https://shopperrcdn.shopperr.in";

// Define structure based on the new API response
interface CartItemDetail {
  quantity: number;
  source: string;
  variantIndex: number | null;
}

// Define a structure for the flattened cart items list used for rendering
interface CartLineItem {
  lineItemId: string; // Unique ID for this specific line item (e.g., "productId_variantIndex")
  productId: string;
  quantity: number;
  source: string;
  variantIndex: number | null;
  product: any | null; // Use 'any' for now to avoid type conflicts until shared types are updated
}

export default function CartPage() {
  const queryClient = useQueryClient();
  const [cartProducts, setCartProducts] = useState<Record<string, any>>({}); // Use 'any' temporarily

  // Fetch cart items - QueryFn remains the same, processing changes later
  const {
    data: cartData,
    isLoading: isLoadingCart,
    refetch: refetchCart,
  } = useQuery({
    queryKey: ["cart"],
    refetchOnMount: "always",
    queryFn: async () => {
      try {
        const response = await apiRequest("GET", `${import.meta.env.VITE_REACT_APP_CART_API_URL}/`);
        if (!response.ok) throw new Error(`Failed to fetch cart items: ${response.status}`);
        const data = await response.json();
        console.log("Raw Cart API response:", data); // Log raw data
        return data;
      } catch (error) {
        console.error("Error fetching cart:", error);
        throw error;
      }
    },
  });

  // Extract all unique product IDs from the new cart structure
  const productIds = Object.keys(cartData?.items || {});

  // Fetch associated products - Query key depends on productIds, enabled logic adjusted slightly
  useQuery({
    queryKey: ["products/multiple", productIds], // Use the extracted productIds
    enabled: productIds.length > 0, // Enable if there are any product IDs
    refetchOnMount: true,
    queryFn: async () => {
      console.log("Fetching multiple products for IDs:", productIds);
      try {
        const response = await apiRequest(
          "POST",
          `${import.meta.env.VITE_REACT_APP_PRODUCTS_API_URL}/multiple-products`,
          { product_ids: productIds }
        );

        if (!response.ok) throw new Error(`Failed to fetch products: ${response.status}`);
        const data = await response.json();
        const productsData = data.payload || [];

        if (!Array.isArray(productsData)) {
          console.error("Products data payload is not an array:", productsData);
          return {};
        }

        const productsMap: Record<string, any> = {};
        productsData.forEach((product: any) => {
          const pId = product._id?.$oid || product._id; // Handle ObjectId
          if (pId) {
            productsMap[pId] = product;
          }
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

  // Create a flattened array of cart line items with unique IDs
  const cartItems: CartLineItem[] = Object.entries(cartData?.items || {}).flatMap(
    ([productId, detailsArray]: [string, CartItemDetail[]]) => {
      // Ensure detailsArray is actually an array before mapping
      if (!Array.isArray(detailsArray)) {
        console.warn(`Expected array for productId ${productId}, but got:`, detailsArray);
        return []; // Skip this product if data is malformed
      }
      return detailsArray.map((details, index) => {
        // Create a unique ID for the line item
        // Use index from the detailsArray as fallback if variantIndex is null or same for multiple entries (though unlikely)
        const variantSuffix = details.variantIndex !== null ? details.variantIndex : `null_${index}`;
        const lineItemId = `${productId}_${variantSuffix}`;

        return {
          lineItemId: lineItemId,
          productId: productId,
          quantity: details.quantity,
          source: details.source,
          variantIndex: details.variantIndex,
          product: cartProducts[productId] || null, // Assign fetched product data
        };
      });
    }
  );

  console.log("Processed cartItems for rendering:", cartItems);

  const isCartEmpty = !isLoadingCart && cartItems.length === 0;

  // Function to calculate price based on quantity, tiers, and source
  // Note: This currently doesn't use variant-specific pricing. Adjust if needed.
  const calculateItemPrice = (product: any, quantity: number, source: string, variantIndex: number | null) => {
    if (!product) return 0;

    // TODO: Adjust base price if variants have different prices
    // Example:
    // let variantPriceOverride = null;
    // if (variantIndex !== null && product.varients?.[variantIndex]?.price) {
    //    variantPriceOverride = product.varients[variantIndex].price;
    // }
    // let basePrice = variantPriceOverride ?? product.sp;

    let basePrice = product.sp; // Use product's base sale price initially

    if (product.variable_pricing && Array.isArray(product.variable_pricing)) {
      for (const tierObj of product.variable_pricing) {
        // ... (existing tier logic remains the same) ...
        const tierKey = Object.keys(tierObj)[0];
        const tierPrice = tierObj[tierKey];

        if (tierKey.includes('>')) {
          const minQuantity = parseInt(tierKey.replace('>', ''));
          if (quantity >= minQuantity) {
            basePrice = tierPrice;
            break;
          }
        } else if (tierKey.includes('-')) {
          const [min, max] = tierKey.split('-').map(n => parseInt(n));
          if (quantity >= min && quantity <= max) {
            basePrice = tierPrice;
            break;
          }
        }
      }
    }

    const multiplier =
      source === "Ex-india custom" ? 1.15 :
      source === "doorstep delivery" ? 1.25 : 1.0;

    return basePrice * multiplier;
  };

  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => {
    const itemPrice = calculateItemPrice(
      item.product,
      item.quantity,
      item.source,
      item.variantIndex
    );
    return sum + (itemPrice * item.quantity);
  }, 0);

  const total = subtotal; // Assuming no shipping/taxes for now

  // --- Mutations ---
  // IMPORTANT: These mutations assume the backend API needs productId and variantIndex
  // Adjust the `apiRequest` call structure based on actual backend requirements.

  const updateCartMutation = useMutation({
    mutationFn: async ({ productId, variantIndex, quantity }: { productId: string; variantIndex: number | null; quantity: number }) => {
      // TODO: Confirm API endpoint and payload structure with backend
      // Example: Maybe PATCH /items/:productId requires { variantIndex, quantity } in body?
      return apiRequest("PATCH", `${import.meta.env.VITE_REACT_APP_CART_API_URL}/items/${productId}`, {
        variantIndex, // Sending variantIndex in the body (adjust if needed)
        quantity,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      // No need to invalidate products/multiple unless product details change
    },
    // Add onError if needed
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async ({ productId, variantIndex }: { productId: string; variantIndex: number | null }) => {
      // TODO: Confirm API endpoint and payload structure with backend
      // Example: Maybe DELETE /items/:productId requires { variantIndex } in body?
      // Or maybe DELETE /items/:productId/:variantIndex ?
      return apiRequest("DELETE", `${import.meta.env.VITE_REACT_APP_CART_API_URL}/items/${productId}`, {
         variantIndex // Sending variantIndex in the body (adjust if needed)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
    // Add onError if needed
  });

  // Debounce timer ref
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Local state for quantities, keyed by the unique lineItemId
  const [localQuantities, setLocalQuantities] = useState<Record<string, number>>({});

  // Initialize/Update local quantities when cartItems change
  useEffect(() => {
    const newLocalQuantities: Record<string, number> = {};
    let needsUpdate = false;
    cartItems.forEach(item => {
      // Initialize if not present or update if cart quantity changed externally
      if (localQuantities[item.lineItemId] !== item.quantity) {
         newLocalQuantities[item.lineItemId] = item.quantity;
         needsUpdate = true;
      }
    });

    if (needsUpdate) {
       // Update existing entries without overwriting others
       setLocalQuantities(prev => ({ ...prev, ...newLocalQuantities }));
    }
  }, [cartItems]); // Dependency array includes cartItems

  // Use lineItemId for managing local state and triggering mutations
  const handleQuantityChange = (lineItemId: string, productId: string, variantIndex: number | null, newQuantity: number) => {
    if (newQuantity < 1) return;

    setLocalQuantities(prev => ({ ...prev, [lineItemId]: newQuantity }));

    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    debounceTimerRef.current = setTimeout(() => {
      // Pass productId and variantIndex to the mutation
      updateCartMutation.mutate({ productId, variantIndex, quantity: newQuantity });
    }, 500);
  };

  const handleQuantityInputChange = (lineItemId: string, productId: string, variantIndex: number | null, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Allow empty input temporarily, but only mutate if valid number > 0
    if (value === "") {
        setLocalQuantities(prev => ({ ...prev, [lineItemId]: NaN })); // Use NaN or similar placeholder
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
        return;
    }

    const newQuantity = parseInt(value);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setLocalQuantities(prev => ({ ...prev, [lineItemId]: newQuantity }));
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        updateCartMutation.mutate({ productId, variantIndex, quantity: newQuantity });
      }, 500);
    } else if (!isNaN(newQuantity) && newQuantity <= 0) {
        // Handle case where user types 0 or negative, maybe reset to 1 or keep NaN
        setLocalQuantities(prev => ({ ...prev, [lineItemId]: NaN }));
        if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    }
  };

  const handleRemoveItem = (productId: string, variantIndex: number | null) => {
    // Pass productId and variantIndex to the mutation
    removeFromCartMutation.mutate({ productId, variantIndex });
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

        {isLoadingCart || (isLoadingCart && productIds.length > 0 && Object.keys(cartProducts).length === 0) ? ( // Adjusted loading check
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0"
                  >
                    <div className="flex">
                      <Skeleton className="w-24 h-24 rounded mr-4 flex-shrink-0" /> {/* Added flex-shrink-0 */}
                      <div className="flex-1 min-w-0"> {/* Added min-w-0 */}
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-5 w-1/4 mb-2" />
                        <Skeleton className="h-5 w-1/3 mb-3" />
                        <div className="flex justify-between items-center"> {/* Added items-center */}
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
                <Button className="bg-[#62c8f5] hover:bg-[#06184b] hover:text-white text-gray-900 font-medium">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-end mb-4">
                  <div className="text-sm text-gray-500">Price</div>
                </div>

                {/* Map over the processed cartItems */}
                {cartItems.map((item) => {
                  // Find the specific variant detail string if variantIndex exists
                  const variantDetails =
                    item.variantIndex !== null && item.product?.varients?.[item.variantIndex]
                      ? item.product.varients[item.variantIndex].option1 // Display the "Color: X, Size: Y" string
                      : null;

                  // Calculate prices for display
                  const unitPrice = calculateItemPrice(item.product, item.quantity, item.source, item.variantIndex);
                  const lineItemTotalPrice = unitPrice * item.quantity;
                  const displayQuantity = isNaN(localQuantities[item.lineItemId]) ? "" : localQuantities[item.lineItemId];

                  return (
                    <div
                      key={item.lineItemId} // Use unique lineItemId for React key
                      className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0"
                    >
                      <div className="flex flex-col sm:flex-row">
                        <div className="w-full sm:w-24 h-24 bg-gray-50 flex items-center justify-center rounded mb-4 sm:mb-0 sm:mr-4 flex-shrink-0"> {/* Added flex-shrink-0 */}
                          {item.product ? (
                            <img
                              // Use optional chaining for safer access
                              src={`${S3_BUCKET_FILE_URL}/${
                                item.product.imgUrl?.[0]?.src ?? '' // Provide default empty string
                              }${
                                item.product.imgUrl?.[0]?.src?.endsWith(".png") ?? true // Default to true if src is missing
                                  ? ""
                                  : ".png"
                              }`}
                              alt={item.product.name ?? 'Product image'} // Provide default alt text
                              className="max-h-full max-w-full object-contain"
                            />
                          ) : (
                            <Skeleton className="h-24 w-24" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0"> {/* Added min-w-0 */}
                          <div className="flex flex-col sm:flex-row justify-between">
                             {/* Product Name and Link */}
                             <div className="mb-1 sm:mb-0 sm:mr-4">
                               <Link href={`/products/${item.productId}`}>
                                 <a className="text-lg font-medium hover:text-blue-600 hover:underline line-clamp-2">
                                   {item.product ? item.product.name : "Loading product..."}
                                 </a>
                               </Link>
                               {/* Display Variant Details */}
                               {variantDetails && (
                                 <div className="text-sm text-gray-500 mt-1">
                                   {variantDetails}
                                 </div>
                               )}
                             </div>
                             {/* Price */}
                             <div className="text-lg font-bold flex-shrink-0">
                               ₹{lineItemTotalPrice.toFixed(2)}
                             </div>
                          </div>

                          {/* Unit price display */}
                          <div className="text-sm text-gray-600">
                            Unit price: ₹{unitPrice.toFixed(2)}
                          </div>

                          {/* Shipping source information */}
                          <div className="text-sm text-gray-600 mb-2">
                            Shipping source: {item.source || "Shopperr B2B"}
                            {/* Use optional chaining */}
                            {item.product?.pd_location && (
                              <span className="ml-2">
                                ({item.product.pd_location})
                              </span>
                            )}
                          </div>

                          <div className="text-sm text-green-600 mb-2">
                            In Stock {/* Assuming always in stock for now */}
                          </div>

                          <div className="flex flex-wrap gap-4 mt-3">
                            {/* Quantity Control */}
                            <div className="flex items-center">
                              <span className="mr-2 text-sm">Qty:</span>
                              <div className="flex items-center border rounded">
                                <button
                                  className="px-2 py-1 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed" // Added disabled styles
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.lineItemId,
                                      item.productId,
                                      item.variantIndex,
                                      (localQuantities[item.lineItemId] || 1) - 1 // Use local quantity state
                                    )
                                  }
                                  disabled={(localQuantities[item.lineItemId] || 1) <= 1}
                                >
                                  <MinusIcon className="h-4 w-4" />
                                </button>
                                <input
                                  type="number" // Keep type number for semantics
                                  min="1"
                                  value={displayQuantity} // Use displayQuantity which handles NaN
                                  onChange={(e) => handleQuantityInputChange(item.lineItemId, item.productId, item.variantIndex, e)}
                                  className="w-12 text-center border-0 p-1 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" // Hide spinner arrows
                                  aria-label={`Quantity for ${item.product?.name ?? 'item'}${variantDetails ? ` (${variantDetails})` : ''}`}
                                />
                                <button
                                  className="px-2 py-1 hover:bg-gray-100"
                                  onClick={() =>
                                    handleQuantityChange(
                                      item.lineItemId,
                                      item.productId,
                                      item.variantIndex,
                                      (localQuantities[item.lineItemId] || 0) + 1 // Use local quantity state
                                    )
                                  }
                                >
                                  <PlusIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>

                            {/* Remove Button */}
                            <button
                              className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                              onClick={() => handleRemoveItem(item.productId, item.variantIndex)}
                            >
                              <Trash2Icon className="h-4 w-4 mr-1" /> Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Subtotal Display */}
                 <div className="flex justify-between items-center mt-6 text-gray-800">
                   <div className="text-sm">
                     Items ship from{" "}
                     <span className="font-medium">Shopperr B2B</span>
                   </div>
                   <div className="text-xl font-bold text-right"> {/* Added text-right */}
                     Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items):
                     <span className="text-amber-600 ml-2">₹{subtotal.toFixed(2)}</span>
                   </div>
                 </div>
              </div>
            </div>

             {/* Order Summary Section */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                {/* ... Summary details (Subtotal, Accordion) ... */}
                 <div className="mb-4">
                   <div className="text-xl font-bold mb-4 text-right"> {/* Added text-right */}
                     Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items):
                     <span className="text-amber-600 ml-2">₹{subtotal.toFixed(2)}</span>
                   </div>

                   <Accordion type="single" collapsible className="mb-4">
                     <AccordionItem value="shipping">
                       <AccordionTrigger className="text-sm py-2">
                         Shipping details
                       </AccordionTrigger>
                       <AccordionContent>
                         <div className="space-y-2 text-sm">
                           {/* Add more details here if needed */}
                           <div className="flex justify-between font-bold">
                             <span>Order Total:</span>
                             <span>₹{total.toFixed(2)}</span>
                           </div>
                           {/* Example: <p>Shipping costs calculated at checkout.</p> */}
                         </div>
                       </AccordionContent>
                     </AccordionItem>
                   </Accordion>

                   <Link href="/checkout">
                     <Button className="w-full bg-[#62c8f5] hover:bg-[#06184b] hover:text-white text-gray-900 font-medium mb-3">
                       Proceed to Checkout
                     </Button>
                   </Link>

                   {/* Optional delivery info */}
                   {/* <div className="text-sm"> ... </div> */}
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
