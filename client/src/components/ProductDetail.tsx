import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import ProductImages from "@/components/ProductImages";
import DynamicPricing from "@/components/DynamicPricing";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  StarIcon,
  StarHalfIcon,
  ShoppingCartIcon,
  BoltIcon,
  HeartIcon,
  BookmarkIcon,
  ShareIcon,
  FileTextIcon,
  CheckCircleIcon,
  InfoIcon,
} from "lucide-react";

interface ProductOption {
  name: string;
  values: string[];
}

// Define a basic variant structure based on the *actual* API response
interface ActualProductVariant {
  option1: string; // Contains the combined option string like "Navy blue, S"
  price?: number; // Add other relevant variant fields if needed
  sku?: string;
  vid?: number;
  specId?: string;
}

interface ProductDetailProps {
  product: any;
  priceTiers: any[];
  isLoadingPriceTiers: boolean;
  options?: ProductOption[];
  varients?: ActualProductVariant[]; // Corrected: Use 'varients' and the actual interface
}

export default function ProductDetail({
  product,
  priceTiers,
  isLoadingPriceTiers,
  options,
  varients, // Corrected: Receive 'varients'
}: ProductDetailProps) {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [shippingSource, setShippingSource] = useState("ex-china");
  const [selectedOptions, setSelectedOptions] = useState<{ [key: string]: string }>({});

  // Initialize selectedOptions when options load
  useEffect(() => {
    const initialOptions: { [key: string]: string } = {};
    if (options && options.length > 0) {
      options.forEach(option => {
        if (option.values && option.values.length > 0) {
          initialOptions[option.name] = option.values[0]; // Default to the first value
        }
      });
    }
    setSelectedOptions(initialOptions);
  }, [options]); // Re-run if options change

  // Handler for when an option selection changes
  const handleOptionChange = (optionName: string, value: string) => {
    setSelectedOptions(prev => ({ ...prev, [optionName]: value }));
    // TODO: Add logic here if price/image needs to update based on selection
  };

  // Determine which price to display based on quantity and shipping source
  const calculatePrice = () => {
    // First get base price from quantity tiers
    let basePrice = product.salePrice;
    if (priceTiers && priceTiers.length > 0) {
      const tier = priceTiers.find(
        (tier) => quantity >= tier.minQuantity && quantity <= tier.maxQuantity
      );
      if (tier) {
        basePrice = tier.price;
      }
    }

    // Apply shipping source multiplier
    switch (shippingSource) {
      case "ex-china":
        return basePrice; // Base price
      case "ex-india":
        return basePrice * 1.15; // 15% more expensive
      case "doorstep":
        return basePrice * 1.25; // 25% more expensive
      default:
        return basePrice;
    }
  };

  // Format ratings display
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <StarIcon key={`star-${i}`} className="h-4 w-4 fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <StarHalfIcon key="half-star" className="h-4 w-4 fill-current" />
      );
    }

    return stars;
  };

  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async () => {
      let variantIndex = -1;

      // Check if options and varients are available
      if (options && options.length > 0 && varients && varients.length > 0) {
        // Construct the target option string from selectedOptions based on the order in the 'options' array
        // Example: if options = [{name: "Color"}, {name: "Size"}] and selectedOptions = { Color: "Navy blue", Size: "S" }
        // targetOptionString should become "Navy blue, S"
        const targetOptionString = options
          .map(option => selectedOptions[option.name]) // Get selected value for each option name in order
          .join(", "); // Join with ", " to match the format in `option1`

        // Find the index by comparing the constructed string with the 'option1' field
        variantIndex = varients.findIndex(
          (variant) => variant.option1 === targetOptionString
        );

      } else if (options && options.length > 0 && (!varients || varients.length === 0)) {
        // Handle inconsistency: Options exist but Varients don't
        console.error("Data inconsistency: Product has options but no varients defined.", { options, varients });
        throw new Error("Product configuration error: Options defined without corresponding varients.");
      }
      // If there are no options, variantIndex remains -1, which is fine (no variant needed)

      const data: { quantity: number; source: string; variantIndex?: number } = {
        quantity: quantity,
        source:
          shippingSource === "ex-china"
            ? "Ex-china"
            : shippingSource === "ex-india"
            ? "Ex-india custom"
            : "doorstep delivery",
      };

      // Only add variantIndex if options *exist* (meaning a variant selection was required)
      if (options && options.length > 0) {
        // If variantIndex is still -1 after the checks, it means the specific combination wasn't found
        if (variantIndex === -1) {
          // Construct the target string again for the error message
           const targetOptionString = options
             .map(option => selectedOptions[option.name])
             .join(", ");
          console.error("Selected options state:", selectedOptions);
          console.error("Constructed target string:", targetOptionString);
          console.error("Available varients[].option1 values:", varients?.map(v => v.option1));
          throw new Error(`Selected product variant combination (${targetOptionString}) is not available.`);
        }
        data.variantIndex = variantIndex;
      }

      console.log(data)

      return apiRequest(
        "POST",
        `${import.meta.env.VITE_REACT_APP_CART_API_URL}/items/${product.id}`,
        data
      );
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/cart/items"] });
      toast({
        title: "Added to Cart",
        description: `${quantity} item${
          quantity > 1 ? "s" : ""
        } added to your cart.`,
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Error Adding to Cart", // More specific title
        description: error.message || "Failed to add item to cart.", // Use error message
      });
    },
  });

  const handleAddToCart = () => {
    addToCartMutation.mutate();
  };

  // const handleBuyNow = () => {
  //   // First add to cart
  //   addToCartMutation.mutate({
  //     productId: product.id,
  //     quantity: quantity,
  //   });

  // Then redirect to checkout (would be implemented in a real app)
  //   toast({
  //     title: "Proceeding to Checkout",
  //     description: `Redirecting to checkout with ${quantity} item${
  //       quantity > 1 ? "s" : ""
  //     }.`,
  //   });
  // };

  const currentPrice = calculatePrice();
  const totalPrice = (currentPrice * quantity).toFixed(2);

  return (
    <div className="flex flex-col md:flex-row">
      {/* Product images section - sticky on scroll */}
      <div className="md:w-2/5 p-4">
        <div className="md:sticky md:top-4">
          <ProductImages images={product.images} name={product.name} />
        </div>
      </div>

      {/* Product information section */}
      <div className="md:w-3/5 p-4">
        <h1 className="text-2xl font-bold mb-1">{product.name}</h1>

        {/* Brand and ratings */}
        {/* <div className="mb-4">
          <a href="#" className="text-blue-600 hover:underline">by {product.brand}</a>
          <div className="flex items-center mt-1">
            <div className="flex text-amber-400">
              {renderRatingStars(product.rating)}
            </div>
            <a href="#" className="ml-2 text-blue-600 hover:underline text-sm">{product.ratingCount} business ratings</a>
          </div>
        </div> */}

        {/* Product highlights */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <div className="text-lg font-bold">Key Features:</div>
          <ul className="list-disc ml-6 mt-2 text-sm">
            {product.features.map((feature: string, index: number) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>

          {/* Product options selection */}
          {options && options.length > 0 && Object.keys(selectedOptions).length > 0 && (
            <div className="mt-4 space-y-3">
              {options.map((option) => (
                <div key={option.name}>
                  <Label htmlFor={`option-${option.name}`} className="font-medium mb-1 block text-sm">
                    {option.name}:
                  </Label>
                  <Select
                    value={selectedOptions[option.name]}
                    onValueChange={(value) => handleOptionChange(option.name, value)}
                  >
                    <SelectTrigger id={`option-${option.name}`} className="w-full md:w-[250px]">
                      <SelectValue placeholder={`Select ${option.name}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {option.values.map((value) => (
                        <SelectItem key={value} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pricing section */}
        <div className="border-b border-gray-200 pb-4 mb-4">
          <DynamicPricing
            regularPrice={product.regularPrice}
            salePrice={product.salePrice}
            priceTiers={priceTiers}
            quantity={quantity}
            setQuantity={setQuantity}
            isLoading={isLoadingPriceTiers}
            shippingSource={shippingSource}
          />

          {/* Shipping Options */}
          <div className="mb-4">
            <Label
              htmlFor="shipping-source"
              className="font-semibold mb-1 block"
            >
              Choose Shipping Source:
            </Label>
            <div className="flex gap-2 items-center">
              <Select value={shippingSource} onValueChange={setShippingSource}>
                <SelectTrigger className="w-[250px]">
                  <SelectValue placeholder="Select shipping source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ex-china">Ex-China (RMB)</SelectItem>
                  <SelectItem value="ex-india">
                    Ex-India Customs (INR)
                  </SelectItem>
                  {/* <SelectItem value="doorstep">
                    Doorstep Delivery (USD)
                  </SelectItem> */}
                </SelectContent>
              </Select>
              <div className="relative group">
                <InfoIcon className="h-4 w-4 text-gray-500 cursor-help" />
                <div className="absolute left-6 top-0 w-64 bg-white shadow-lg rounded-md p-2 text-xs border border-gray-200 z-10 hidden group-hover:block">
                  <p>
                    <strong>Ex-China:</strong> Shipping from our China
                    warehouse. You handle shipping and customs.
                  </p>
                  <p>
                    <strong>Ex-India Customs:</strong> We handle shipping to
                    India, you handle customs clearance.
                  </p>
                  <p>
                    <strong>Doorstep:</strong> We handle all shipping and
                    customs to your location.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Availability and Shipping Time */}
          <div className="flex flex-col gap-2 mb-2">
            <div className="text-green-600 flex items-center">
              <CheckCircleIcon className="h-4 w-4 mr-2" />
              <span className="font-medium">
                In Stock - Ships within 1 business day from warehouse
              </span>
            </div>
            <div className="text-gray-700 flex items-center text-sm">
              <span className="font-medium">
                Standard shipping time: 18-20 days for all orders
              </span>
            </div>
          </div>
        </div>

        {/* Call-to-action buttons */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-3 my-4">
          <Button
            variant="secondary"
            className="bg-amber-400 hover:bg-amber-500 text-black"
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending}
          >
            <ShoppingCartIcon className="h-4 w-4 mr-2" />
            {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
          </Button>
          {/* <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={handleBuyNow}
            disabled={addToCartMutation.isPending}
          >
            <BoltIcon className="h-4 w-4 mr-2" /> Buy Now
          </Button> */}
        </div>

        {/* Business account benefits */}
        <div className="border border-gray-200 rounded p-4 mb-4 bg-gray-50">
          <div className="font-bold mb-2">Business Account Benefits:</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="flex items-start">
              <CheckCircleIcon className="text-green-600 h-4 w-4 mt-1 mr-2" />
              <span>Quantity discounts automatically applied</span>
            </div>
            <div className="flex items-start">
              <CheckCircleIcon className="text-green-600 h-4 w-4 mt-1 mr-2" />
              <span>Net 30 payment terms available</span>
            </div>
            <div className="flex items-start">
              <CheckCircleIcon className="text-green-600 h-4 w-4 mt-1 mr-2" />
              <span>Free business shipping on orders over $499</span>
            </div>
            <div className="flex items-start">
              <CheckCircleIcon className="text-green-600 h-4 w-4 mt-1 mr-2" />
              <span>Dedicated business customer support</span>
            </div>
          </div>
          <a
            href="#"
            className="text-blue-600 hover:underline text-sm block mt-2"
          >
            Learn more about Shopperr Business Accounts
          </a>
        </div>

        {/* Save for later, Add to list */}
        {/* <div className="flex flex-wrap gap-4 text-sm text-blue-600">
          <a href="#" className="hover:underline flex items-center">
            <HeartIcon className="h-4 w-4 mr-1" /> Add to List
          </a>
          <a href="#" className="hover:underline flex items-center">
            <BookmarkIcon className="h-4 w-4 mr-1" /> Save for Later
          </a>
          <a href="#" className="hover:underline flex items-center">
            <ShareIcon className="h-4 w-4 mr-1" /> Share
          </a>
          <a href="#" className="hover:underline flex items-center">
            <FileTextIcon className="h-4 w-4 mr-1" /> Download Spec Sheet
          </a>
        </div> */}
      </div>
    </div>
  );
}
