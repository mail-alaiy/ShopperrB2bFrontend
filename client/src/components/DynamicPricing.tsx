import React from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface DynamicPricingProps {
  regularPrice: number;
  salePrice: number;
  priceTiers: any[];
  quantity: number;
  setQuantity: (quantity: number) => void;
  isLoading: boolean;
}

export default function DynamicPricing({
  regularPrice,
  salePrice,
  priceTiers,
  quantity,
  setQuantity,
  isLoading,
}: DynamicPricingProps) {
  // Calculate savings percentage
  const savingsPercentage = Math.round((1 - salePrice / regularPrice) * 100);

  // Find the current price tier based on quantity
  const getCurrentPriceTier = () => {
    if (isLoading || !priceTiers || priceTiers.length === 0) return null;

    return priceTiers.find(
      (tier) => quantity >= tier.minQuantity && quantity <= tier.maxQuantity
    );
  };

  const currentTier = getCurrentPriceTier();
  const currentPrice = currentTier ? currentTier.price : salePrice;
  const totalPrice = (currentPrice * quantity).toFixed(2);

  // Handle quantity change
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (isNaN(newQuantity) || newQuantity < 1) {
      setQuantity(1);
    } else {
      setQuantity(newQuantity);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex items-baseline">
          <Skeleton className="h-4 w-16 mr-2" />
          <Skeleton className="h-8 w-24 mr-2" />
          <Skeleton className="h-4 w-20" />
        </div>

        <Skeleton className="h-4 w-48 mt-1 mb-4" />

        <Skeleton className="h-48 w-full my-4" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 my-4">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* <div className="flex items-baseline">
        <span className="text-gray-500 line-through text-sm">${regularPrice.toFixed(2)}</span>
        <span id="base-price" className="text-gray-900 text-2xl font-bold ml-2">${salePrice.toFixed(2)}</span>
        {savingsPercentage > 0 && (
          <span className="ml-2 text-green-600 text-sm">(Save {savingsPercentage}%)</span>
        )}
      </div> */}

      {/* <div className="text-sm text-gray-500 mt-1">
        Base price per unit | Volume discounts available
      </div> */}

      <div className="bg-gray-50 border border-gray-200 rounded p-4 my-4">
        <div className="font-bold mb-2">Volume Pricing</div>
        <div className="grid grid-cols-4 gap-2 text-sm">
          <div className="font-medium">Quantity</div>
          <div className="font-medium">Price Per Unit</div>
          <div className="font-medium">Total</div>
          <div></div>

          {priceTiers.map((tier, index) => (
            <React.Fragment key={`tier-${index}`}>
              <div>
                {tier.minQuantity === tier.maxQuantity
                  ? tier.minQuantity
                  : `${tier.minQuantity}-${
                      tier.maxQuantity === 999999 ? "+" : tier.maxQuantity
                    }`}
              </div>
              <div>${tier.price.toFixed(2)}</div>
              <div>
                $
                {(
                  tier.price *
                  (tier.minQuantity === tier.maxQuantity
                    ? tier.minQuantity
                    : tier.minQuantity)
                ).toFixed(2)}
              </div>
              <div className="text-green-600">
                {tier.savingsPercentage > 0
                  ? `Save ${tier.savingsPercentage}%`
                  : ""}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Quantity selector and calculator */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 my-4">
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium mb-1">
            Quantity:
          </label>
          <div className="flex">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-r-none"
              onClick={handleDecrease}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input
              id="quantity"
              type="number"
              value={quantity}
              min="1"
              onChange={handleQuantityChange}
              className="w-16 rounded-none border-x-0 text-center"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="rounded-l-none"
              onClick={handleIncrease}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded p-3 flex-grow">
          <div className="flex justify-between">
            <span className="font-medium">Your Price:</span>
            <span className="font-bold" id="calculated-price">
              ${currentPrice.toFixed(2)} per unit
            </span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-medium">Total:</span>
            <span className="font-bold text-xl" id="total-price">
              ${totalPrice}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
