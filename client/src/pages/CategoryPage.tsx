import React, { useState, useEffect } from "react";
import { useRoute, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
  StarIcon,
  StarHalfIcon,
  ShoppingCartIcon,
  FilterIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  TruckIcon,
  PercentIcon,
  TagIcon,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

export default function CategoryPage() {
  const [match, params] = useRoute("/categories/:category");
  const category = params?.category || "";
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [location, navigate] = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();

  // Filters state
  const [activeFilters, setActiveFilters] = useState<{
    price: string[];
    brand: string[];
    rating: number | null;
    discount: string[];
    availability: string[];
    shipping: string[];
  }>({
    price: [],
    brand: [],
    rating: null,
    discount: [],
    availability: [],
    shipping: [],
  });

  // Range price state
  const [priceRange, setPriceRange] = useState<{
    min: string;
    max: string;
  }>({
    min: "",
    max: "",
  });

  // Format category name for display
  const formatCategoryName = (name: string) => {
    return name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const displayCategory = formatCategoryName(category);

  // Load products with filters
  const { data: products, isLoading } = useQuery({
    queryKey: [`/api/categories/${category}/products`],
  });

  // Get all unique brands from products for the filter
  const allBrands = React.useMemo(() => {
    if (!products) return [];
    const brandSet = new Set<string>();
    products.forEach((product: any) => {
      if (product.brand) brandSet.add(product.brand);
    });
    return Array.from(brandSet);
  }, [products]);

  // Helper to check if there are any active filters
  const hasActiveFilters = Object.values(activeFilters).some((filter) =>
    Array.isArray(filter) ? filter.length > 0 : !!filter
  );

  // Add to cart handler
  const handleAddToCart = async (productId: number) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add items to your cart",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    try {
      await apiRequest("POST", "/api/cart", {
        productId,
        quantity: 1,
      });

      toast({
        title: "Added to cart",
        description: "Item has been added to your cart",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Failed to add item",
        description: "There was an error adding this item to your cart",
        variant: "destructive",
      });
    }
  };

  // Filter handlers
  const togglePriceFilter = (priceRange: string) => {
    setActiveFilters((prev) => {
      const newPriceFilters = prev.price.includes(priceRange)
        ? prev.price.filter((p) => p !== priceRange)
        : [...prev.price, priceRange];

      return {
        ...prev,
        price: newPriceFilters,
      };
    });
  };

  const toggleBrandFilter = (brand: string) => {
    setActiveFilters((prev) => {
      const newBrandFilters = prev.brand.includes(brand)
        ? prev.brand.filter((b) => b !== brand)
        : [...prev.brand, brand];

      return {
        ...prev,
        brand: newBrandFilters,
      };
    });
  };

  const setRatingFilter = (rating: number | null) => {
    setActiveFilters((prev) => ({
      ...prev,
      rating,
    }));
  };

  const toggleDiscountFilter = (discount: string) => {
    setActiveFilters((prev) => {
      const newDiscountFilters = prev.discount.includes(discount)
        ? prev.discount.filter((d) => d !== discount)
        : [...prev.discount, discount];

      return {
        ...prev,
        discount: newDiscountFilters,
      };
    });
  };

  const toggleAvailabilityFilter = (availability: string) => {
    setActiveFilters((prev) => {
      const newAvailabilityFilters = prev.availability.includes(availability)
        ? prev.availability.filter((a) => a !== availability)
        : [...prev.availability, availability];

      return {
        ...prev,
        availability: newAvailabilityFilters,
      };
    });
  };

  const toggleShippingFilter = (shipping: string) => {
    setActiveFilters((prev) => {
      const newShippingFilters = prev.shipping.includes(shipping)
        ? prev.shipping.filter((s) => s !== shipping)
        : [...prev.shipping, shipping];

      return {
        ...prev,
        shipping: newShippingFilters,
      };
    });
  };

  const handlePriceRangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (priceRange.min || priceRange.max) {
      const rangeStr = `${priceRange.min || "0"}-${priceRange.max || "∞"}`;
      if (!activeFilters.price.includes(rangeStr)) {
        setActiveFilters((prev) => ({
          ...prev,
          price: [...prev.price, rangeStr],
        }));
      }
    }
  };

  const clearAllFilters = () => {
    setActiveFilters({
      price: [],
      brand: [],
      rating: null,
      discount: [],
      availability: [],
      shipping: [],
    });
    setPriceRange({ min: "", max: "" });
  };

  const removeFilter = (
    type: keyof typeof activeFilters,
    value: string | number
  ) => {
    setActiveFilters((prev) => {
      if (type === "rating") {
        return { ...prev, rating: null };
      }
      return {
        ...prev,
        [type]: Array.isArray(prev[type])
          ? (prev[type] as string[]).filter((v) => v !== value)
          : [],
      };
    });
  };

  // Filtered products
  const filteredProducts = React.useMemo(() => {
    if (!products) return [];

    let filtered = [...products];

    // Apply brand filter
    if (activeFilters.brand.length > 0) {
      filtered = filtered.filter((product: any) =>
        activeFilters.brand.includes(product.brand)
      );
    }

    // Apply rating filter
    if (activeFilters.rating) {
      filtered = filtered.filter(
        (product: any) => product.rating >= activeFilters.rating
      );
    }

    // Apply price filter
    if (activeFilters.price.length > 0) {
      filtered = filtered.filter((product: any) => {
        return activeFilters.price.some((range) => {
          const [min, max] = range
            .split("-")
            .map((val) => (val === "∞" ? Infinity : parseFloat(val)));
          const price = product.salePrice;
          return price >= min && price <= max;
        });
      });
    }

    // Apply discount filter
    if (activeFilters.discount.length > 0) {
      filtered = filtered.filter((product: any) => {
        const discount = Math.round(
          (1 - product.salePrice / product.regularPrice) * 100
        );
        return activeFilters.discount.some((range) => {
          const [min, max] = range
            .split("-")
            .map((val) => (val === "∞" ? Infinity : parseFloat(val)));
          return discount >= min && discount <= max;
        });
      });
    }

    // Sort products
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a: any, b: any) => a.salePrice - b.salePrice);
        break;
      case "price-desc":
        filtered.sort((a: any, b: any) => b.salePrice - a.salePrice);
        break;
      case "rating":
        filtered.sort((a: any, b: any) => b.rating - a.rating);
        break;
      case "newest":
        // Assuming there's a createdAt field, or using ID as a proxy for newness
        filtered.sort((a: any, b: any) => b.id - a.id);
        break;
      // Featured is default, no need to sort
    }

    return filtered;
  }, [products, activeFilters, sortBy]);

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-2 sm:mb-4">
        <Link href="/">
          <a className="hover:text-blue-600 hover:underline">Home</a>
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-700">{displayCategory}</span>
      </div>

      {/* Category Header */}
      <div className="mb-4 sm:mb-6 pb-2 border-b">
        <h1 className="text-2xl md:text-3xl font-bold">{displayCategory}</h1>
        {hasActiveFilters && (
          <div className="mt-3 flex flex-wrap gap-2">
            {activeFilters.brand.map((brand) => (
              <Badge
                key={`brand-${brand}`}
                variant="secondary"
                className="gap-1 flex items-center"
              >
                Brand: {brand}
                <button
                  onClick={() => removeFilter("brand", brand)}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {activeFilters.price.map((price) => (
              <Badge
                key={`price-${price}`}
                variant="secondary"
                className="gap-1 flex items-center"
              >
                Price: ${price.replace("-∞", "+")}
                <button
                  onClick={() => removeFilter("price", price)}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {activeFilters.rating && (
              <Badge variant="secondary" className="gap-1 flex items-center">
                {activeFilters.rating}+ Stars
                <button
                  onClick={() =>
                    removeFilter("rating", activeFilters.rating as number)
                  }
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            )}

            {activeFilters.discount.map((discount) => (
              <Badge
                key={`discount-${discount}`}
                variant="secondary"
                className="gap-1 flex items-center"
              >
                Discount: {discount}%
                <button
                  onClick={() => removeFilter("discount", discount)}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {activeFilters.shipping.map((shipping) => (
              <Badge
                key={`shipping-${shipping}`}
                variant="secondary"
                className="gap-1 flex items-center"
              >
                {shipping} Shipping
                <button
                  onClick={() => removeFilter("shipping", shipping)}
                  className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
                >
                  <XIcon className="h-3 w-3" />
                </button>
              </Badge>
            ))}

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="h-6 text-xs px-2"
              >
                Clear All
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Filters and Products layout */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Mobile Filters Toggle */}
        <div className="md:hidden">
          <Button
            variant="outline"
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-between"
          >
            <span className="flex items-center">
              <FilterIcon className="w-4 h-4 mr-2" />
              Filters
            </span>
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${
                showMobileFilters ? "transform rotate-180" : ""
              }`}
            />
          </Button>
        </div>

        <div
          className={`${
            showMobileFilters ? "block" : "hidden"
          } md:block md:w-1/4 lg:w-1/5`}
        >
          <div className="border rounded-md bg-white overflow-hidden">
            <div className="bg-gray-100 p-3 border-b">
              <h3 className="font-bold">Department</h3>
              <ul className="mt-2 space-y-1 text-sm">
                <li className="flex items-center">
                  <ChevronRightIcon className="h-4 w-4 text-gray-500 mr-1" />
                  <span className="text-blue-600 font-medium">
                    {displayCategory}
                  </span>
                </li>
                <li className="pl-5 text-blue-600 hover:underline cursor-pointer">
                  Office Electronics
                </li>
                <li className="pl-5 text-blue-600 hover:underline cursor-pointer">
                  Computer Accessories
                </li>
                <li className="pl-5 text-blue-600 hover:underline cursor-pointer">
                  Business Supplies
                </li>
              </ul>
            </div>

            <div className="p-3 border-b">
              <h3 className="font-bold mb-2">Customer Reviews</h3>
              <div className="space-y-1.5">
                {[4, 3, 2, 1].map((rating) => (
                  <div
                    key={`rating-${rating}`}
                    className="flex items-center cursor-pointer hover:text-blue-600"
                    onClick={() =>
                      setRatingFilter(
                        activeFilters.rating === rating ? null : rating
                      )
                    }
                  >
                    <div className="flex text-amber-400 mr-1">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`w-4 h-4 ${
                            i < rating ? "fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm ml-1">& Up</span>
                    {activeFilters.rating === rating && (
                      <span className="ml-auto text-blue-600">✓</span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Accordion
              type="multiple"
              defaultValue={["price", "brands", "discount", "delivery"]}
            >
              <AccordionItem value="price">
                <AccordionTrigger className="px-3 py-2 text-base font-medium">
                  Price
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox
                        id="price-1"
                        checked={activeFilters.price.includes("0-25")}
                        onCheckedChange={() => togglePriceFilter("0-25")}
                      />
                      <label htmlFor="price-1" className="ml-2 text-sm">
                        Under $25
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="price-2"
                        checked={activeFilters.price.includes("25-50")}
                        onCheckedChange={() => togglePriceFilter("25-50")}
                      />
                      <label htmlFor="price-2" className="ml-2 text-sm">
                        $25 to $50
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="price-3"
                        checked={activeFilters.price.includes("50-100")}
                        onCheckedChange={() => togglePriceFilter("50-100")}
                      />
                      <label htmlFor="price-3" className="ml-2 text-sm">
                        $50 to $100
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="price-4"
                        checked={activeFilters.price.includes("100-200")}
                        onCheckedChange={() => togglePriceFilter("100-200")}
                      />
                      <label htmlFor="price-4" className="ml-2 text-sm">
                        $100 to $200
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="price-5"
                        checked={activeFilters.price.includes("200-∞")}
                        onCheckedChange={() => togglePriceFilter("200-∞")}
                      />
                      <label htmlFor="price-5" className="ml-2 text-sm">
                        $200 & Above
                      </label>
                    </div>

                    <div className="pt-2 border-t mt-3">
                      <form
                        onSubmit={handlePriceRangeSubmit}
                        className="space-y-2"
                      >
                        <div className="flex items-center">
                          <span className="text-sm">$</span>
                          <Input
                            type="number"
                            placeholder="Min"
                            min="0"
                            value={priceRange.min}
                            onChange={(e) =>
                              setPriceRange({
                                ...priceRange,
                                min: e.target.value,
                              })
                            }
                            className="ml-1 h-8 text-xs"
                          />
                          <span className="mx-2">to</span>
                          <span className="text-sm">$</span>
                          <Input
                            type="number"
                            placeholder="Max"
                            min="0"
                            value={priceRange.max}
                            onChange={(e) =>
                              setPriceRange({
                                ...priceRange,
                                max: e.target.value,
                              })
                            }
                            className="ml-1 h-8 text-xs"
                          />
                        </div>
                        <Button
                          type="submit"
                          size="sm"
                          className="w-full h-8 text-xs"
                        >
                          Go
                        </Button>
                      </form>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="brands">
                <AccordionTrigger className="px-3 py-2 text-base font-medium">
                  Brands
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {allBrands.map((brand, index) => (
                      <div
                        className="flex items-center"
                        key={`brand-filter-${index}`}
                      >
                        <Checkbox
                          id={`brand-${index}`}
                          checked={activeFilters.brand.includes(brand)}
                          onCheckedChange={() => toggleBrandFilter(brand)}
                        />
                        <label
                          htmlFor={`brand-${index}`}
                          className="ml-2 text-sm"
                        >
                          {brand}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="discount">
                <AccordionTrigger className="px-3 py-2 text-base font-medium">
                  Discount
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox
                        id="discount-10"
                        checked={activeFilters.discount.includes("10-∞")}
                        onCheckedChange={() => toggleDiscountFilter("10-∞")}
                      />
                      <label
                        htmlFor="discount-10"
                        className="ml-2 text-sm flex items-center"
                      >
                        <PercentIcon className="h-3 w-3 mr-1 text-red-600" />
                        10% Off or more
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="discount-25"
                        checked={activeFilters.discount.includes("25-∞")}
                        onCheckedChange={() => toggleDiscountFilter("25-∞")}
                      />
                      <label
                        htmlFor="discount-25"
                        className="ml-2 text-sm flex items-center"
                      >
                        <PercentIcon className="h-3 w-3 mr-1 text-red-600" />
                        25% Off or more
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="discount-50"
                        checked={activeFilters.discount.includes("50-∞")}
                        onCheckedChange={() => toggleDiscountFilter("50-∞")}
                      />
                      <label
                        htmlFor="discount-50"
                        className="ml-2 text-sm flex items-center"
                      >
                        <PercentIcon className="h-3 w-3 mr-1 text-red-600" />
                        50% Off or more
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="discount-70"
                        checked={activeFilters.discount.includes("70-∞")}
                        onCheckedChange={() => toggleDiscountFilter("70-∞")}
                      />
                      <label
                        htmlFor="discount-70"
                        className="ml-2 text-sm flex items-center"
                      >
                        <PercentIcon className="h-3 w-3 mr-1 text-red-600" />
                        70% Off or more
                      </label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="delivery">
                <AccordionTrigger className="px-3 py-2 text-base font-medium">
                  Shipping & Delivery
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox
                        id="shipping-free"
                        checked={activeFilters.shipping.includes("Free")}
                        onCheckedChange={() => toggleShippingFilter("Free")}
                      />
                      <label htmlFor="shipping-free" className="ml-2 text-sm">
                        Free Shipping
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="shipping-expedited"
                        checked={activeFilters.shipping.includes("Expedited")}
                        onCheckedChange={() =>
                          toggleShippingFilter("Expedited")
                        }
                      />
                      <label
                        htmlFor="shipping-expedited"
                        className="ml-2 text-sm"
                      >
                        Expedited Shipping
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="shipping-same-day"
                        checked={activeFilters.shipping.includes("Same-day")}
                        onCheckedChange={() => toggleShippingFilter("Same-day")}
                      />
                      <label
                        htmlFor="shipping-same-day"
                        className="ml-2 text-sm"
                      >
                        Same-day Delivery
                      </label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>

              {/* Availability Filter */}
              <AccordionItem value="availability">
                <AccordionTrigger className="px-3 py-2 text-base font-medium">
                  Availability
                </AccordionTrigger>
                <AccordionContent className="px-3 pb-3">
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox
                        id="availability-instock"
                        checked={activeFilters.availability.includes(
                          "In Stock"
                        )}
                        onCheckedChange={() =>
                          toggleAvailabilityFilter("In Stock")
                        }
                      />
                      <label
                        htmlFor="availability-instock"
                        className="ml-2 text-sm"
                      >
                        In Stock
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="availability-deals"
                        checked={activeFilters.availability.includes("Deals")}
                        onCheckedChange={() =>
                          toggleAvailabilityFilter("Deals")
                        }
                      />
                      <label
                        htmlFor="availability-deals"
                        className="ml-2 text-sm flex items-center"
                      >
                        <TagIcon className="h-3 w-3 mr-1 text-red-600" />
                        Today's Deals
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox
                        id="availability-prime"
                        checked={activeFilters.availability.includes(
                          "B2B Prime"
                        )}
                        onCheckedChange={() =>
                          toggleAvailabilityFilter("B2B Prime")
                        }
                      />
                      <label
                        htmlFor="availability-prime"
                        className="ml-2 text-sm"
                      >
                        B2B Prime
                      </label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="md:w-3/4 lg:w-4/5">
          {/* Results Header */}
          <div className="bg-gray-100 p-3 rounded-md flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              {isLoading
                ? "Loading..."
                : `${filteredProducts.length} results for "${displayCategory}"`}
            </p>

            <div className="flex items-center gap-3">
              {/* Grid/List View Toggle */}
              <div className="hidden sm:flex border rounded overflow-hidden">
                <button
                  className={`px-2 py-1 ${
                    viewMode === "grid" ? "bg-gray-200" : "bg-white"
                  }`}
                  onClick={() => setViewMode("grid")}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="1"
                      y="1"
                      width="6"
                      height="6"
                      rx="1"
                      fill={viewMode === "grid" ? "#4B5563" : "#D1D5DB"}
                    />
                    <rect
                      x="9"
                      y="1"
                      width="6"
                      height="6"
                      rx="1"
                      fill={viewMode === "grid" ? "#4B5563" : "#D1D5DB"}
                    />
                    <rect
                      x="1"
                      y="9"
                      width="6"
                      height="6"
                      rx="1"
                      fill={viewMode === "grid" ? "#4B5563" : "#D1D5DB"}
                    />
                    <rect
                      x="9"
                      y="9"
                      width="6"
                      height="6"
                      rx="1"
                      fill={viewMode === "grid" ? "#4B5563" : "#D1D5DB"}
                    />
                  </svg>
                </button>
                <button
                  className={`px-2 py-1 ${
                    viewMode === "list" ? "bg-gray-200" : "bg-white"
                  }`}
                  onClick={() => setViewMode("list")}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="1"
                      y="1"
                      width="14"
                      height="4"
                      rx="1"
                      fill={viewMode === "list" ? "#4B5563" : "#D1D5DB"}
                    />
                    <rect
                      x="1"
                      y="7"
                      width="14"
                      height="4"
                      rx="1"
                      fill={viewMode === "list" ? "#4B5563" : "#D1D5DB"}
                    />
                    <rect
                      x="1"
                      y="13"
                      width="14"
                      height="2"
                      rx="1"
                      fill={viewMode === "list" ? "#4B5563" : "#D1D5DB"}
                    />
                  </svg>
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center">
                <span className="text-sm text-gray-600 mr-2 hidden sm:inline">
                  Sort by:
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="rating">Avg. Customer Review</SelectItem>
                    <SelectItem value="newest">Newest Arrivals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Products Display */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border rounded-md p-4">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : viewMode === "grid" ? (
            // Grid view
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product: any) => (
                <div
                  key={product.id}
                  className="border rounded-md bg-white p-4 hover:shadow-md transition duration-200"
                >
                  <Link href={`/products/${product.id}`}>
                    <a className="block">
                      <div className="h-48 flex items-center justify-center mb-4">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                      <h3 className="text-base sm:text-lg font-semibold text-blue-600 hover:underline mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex text-amber-400 mb-2">
                        {[...Array(Math.floor(product.rating))].map((_, i) => (
                          <StarIcon key={i} className="w-4 h-4 fill-current" />
                        ))}
                        {product.rating % 1 >= 0.5 && (
                          <StarHalfIcon className="w-4 h-4 fill-current" />
                        )}
                        <span className="text-gray-500 text-sm ml-1">
                          ({product.ratingCount})
                        </span>
                      </div>
                      <div className="mb-2">
                        <span className="text-gray-500 line-through text-sm mr-2">
                          ${product.regularPrice.toFixed(2)}
                        </span>
                        <span className="text-lg font-bold">
                          ${product.salePrice.toFixed(2)}
                        </span>
                        {product.regularPrice > product.salePrice && (
                          <span className="text-green-600 text-sm ml-2">
                            Save{" "}
                            {Math.round(
                              (1 - product.salePrice / product.regularPrice) *
                                100
                            )}
                            %
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-600 mb-2 flex items-center">
                        <TruckIcon className="h-3 w-3 mr-1" />
                        <span>Free shipping for businesses</span>
                      </div>
                    </a>
                  </Link>
                  <Button
                    className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900"
                    onClick={() => handleAddToCart(product.id)}
                  >
                    <ShoppingCartIcon className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-xl text-gray-600">
                    No products found in this category.
                  </p>
                  <p className="mt-2 text-gray-500">
                    Try adjusting your filters or check out our other
                    categories.
                  </p>
                  <Link href="/">
                    <a>
                      <Button className="mt-4">Continue Shopping</Button>
                    </a>
                  </Link>
                </div>
              )}
            </div>
          ) : (
            // List view - Amazon style
            <div className="space-y-6">
              {filteredProducts.map((product: any) => (
                <div
                  key={product.id}
                  className="border rounded-md bg-white p-4 hover:shadow-md transition duration-200 flex flex-col sm:flex-row gap-4"
                >
                  <Link href={`/products/${product.id}`}>
                    <a className="block sm:w-36 md:w-48 shrink-0">
                      <div className="h-48 sm:h-36 md:h-40 flex items-center justify-center">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </a>
                  </Link>

                  <div className="flex-grow">
                    <Link href={`/products/${product.id}`}>
                      <a className="block">
                        <h3 className="text-lg font-semibold text-blue-600 hover:underline mb-1">
                          {product.name}
                        </h3>
                        <div className="flex text-amber-400 mb-2">
                          {[...Array(Math.floor(product.rating))].map(
                            (_, i) => (
                              <StarIcon
                                key={i}
                                className="w-4 h-4 fill-current"
                              />
                            )
                          )}
                          {product.rating % 1 >= 0.5 && (
                            <StarHalfIcon className="w-4 h-4 fill-current" />
                          )}
                          <span className="text-gray-500 text-sm ml-1">
                            ({product.ratingCount})
                          </span>
                        </div>
                        <div className="mb-2 font-medium">
                          <span className="text-xl font-bold">
                            ${product.salePrice.toFixed(2)}
                          </span>
                          {product.regularPrice > product.salePrice && (
                            <>
                              <span className="text-gray-500 line-through text-sm ml-2">
                                ${product.regularPrice.toFixed(2)}
                              </span>
                              <span className="text-green-600 text-sm ml-2">
                                Save{" "}
                                {Math.round(
                                  (1 -
                                    product.salePrice / product.regularPrice) *
                                    100
                                )}
                                %
                              </span>
                            </>
                          )}
                        </div>
                      </a>
                    </Link>

                    <div className="space-y-1 mb-3 text-sm text-gray-700">
                      <div className="flex items-start">
                        <span className="text-blue-600 flex items-center">
                          <TruckIcon className="h-3 w-3 mr-1" />
                          FREE Business Shipping
                        </span>
                      </div>
                      <div>
                        <span>
                          Brand:{" "}
                          <span className="font-medium">{product.brand}</span>
                        </span>
                      </div>
                      <div className="line-clamp-2 text-gray-600">
                        {product.description?.substring(0, 150)}...
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        className="bg-amber-400 hover:bg-amber-500 text-gray-900"
                        onClick={() => handleAddToCart(product.id)}
                      >
                        <ShoppingCartIcon className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                      <Link href={`/products/${product.id}`}>
                        <a>
                          <Button variant="outline">View Details</Button>
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-600">
                    No products found in this category.
                  </p>
                  <p className="mt-2 text-gray-500">
                    Try adjusting your filters or check out our other
                    categories.
                  </p>
                  <Link href="/">
                    <a>
                      <Button className="mt-4">Continue Shopping</Button>
                    </a>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
