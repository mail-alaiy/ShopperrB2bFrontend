import React from "react";
import "../styles/DynamicPricing.css";

interface DynamicPricingProps {
  regularPrice: number;
  salePrice: number;
  priceTiers: any[];
  quantity: number;
  setQuantity: (quantity: number) => void;
  isLoading: boolean;
}

export default function DynamicPricingCSS({
  regularPrice,
  salePrice,
  priceTiers,
  quantity,
  setQuantity,
  isLoading
}: DynamicPricingProps) {
  // Calculate savings percentage
  const savingsPercentage = Math.round((1 - salePrice / regularPrice) * 100);
  
  // Find the current price tier based on quantity
  const getCurrentPriceTier = () => {
    if (isLoading || !priceTiers || priceTiers.length === 0) return null;
    
    return priceTiers.find(
      tier => quantity >= tier.minQuantity && quantity <= tier.maxQuantity
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
      <div className="dynamic-pricing-loading">
        <div className="skeleton-row">
          <div className="skeleton skeleton-small"></div>
          <div className="skeleton skeleton-medium"></div>
          <div className="skeleton skeleton-small"></div>
        </div>
        
        <div className="skeleton skeleton-small skeleton-mt"></div>
        
        <div className="skeleton skeleton-large skeleton-mt"></div>
        
        <div className="skeleton-row skeleton-mt">
          <div className="skeleton skeleton-medium"></div>
          <div className="skeleton skeleton-large"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="dynamic-pricing">
      <div className="price-header">
        <span className="original-price">${regularPrice.toFixed(2)}</span>
        <span className="sale-price">${salePrice.toFixed(2)}</span>
        {savingsPercentage > 0 && (
          <span className="savings-tag">(Save {savingsPercentage}%)</span>
        )}
      </div>
      
      <div className="price-subtext">
        Base price per unit | Volume discounts available
      </div>
      
      <div className="volume-pricing-card">
        <div className="volume-pricing-title">Volume Pricing</div>
        <div className="tier-grid">
          <div className="tier-header">Quantity</div>
          <div className="tier-header">Price Per Unit</div>
          <div className="tier-header">Total</div>
          <div className="tier-header"></div>
          
          {priceTiers.map((tier, index) => (
            <React.Fragment key={`tier-${index}`}>
              <div className="tier-cell">
                {tier.minQuantity === tier.maxQuantity 
                  ? tier.minQuantity 
                  : `${tier.minQuantity}-${tier.maxQuantity === 999999 ? '+' : tier.maxQuantity}`}
              </div>
              <div className="tier-cell">${tier.price.toFixed(2)}</div>
              <div className="tier-cell">
                ${(tier.price * (tier.minQuantity === tier.maxQuantity 
                  ? tier.minQuantity 
                  : tier.minQuantity)).toFixed(2)}
              </div>
              <div className="tier-cell tier-savings">
                {tier.savingsPercentage > 0 ? `Save ${tier.savingsPercentage}%` : ''}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Quantity selector and calculator */}
      <div className="quantity-calculator">
        <div className="quantity-container">
          <label htmlFor="quantity" className="quantity-label">Quantity:</label>
          <div className="quantity-control">
            <button 
              type="button"
              className="quantity-button minus-button"
              onClick={handleDecrease}
              disabled={quantity <= 1}
            >
              -
            </button>
            <input
              id="quantity"
              type="number"
              value={quantity}
              min="1"
              onChange={handleQuantityChange}
              className="quantity-input"
            />
            <button
              type="button"
              className="quantity-button plus-button"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>
        </div>
        
        <div className="price-summary">
          <div className="price-row">
            <span className="price-label">Your Price:</span>
            <span className="current-price">${currentPrice.toFixed(2)} per unit</span>
          </div>
          <div className="price-row">
            <span className="price-label">Total:</span>
            <span className="total-price">${totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}