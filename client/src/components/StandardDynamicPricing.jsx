import React from "react";
import "./styles.css";

export default function StandardDynamicPricing({
  regularPrice,
  salePrice,
  priceTiers = [],
  quantity,
  setQuantity
}) {
  // Calculate savings percentage
  const savingsPercentage = Math.round((1 - salePrice / regularPrice) * 100);
  
  // Find the current price tier based on quantity
  const getCurrentPriceTier = () => {
    if (!priceTiers || priceTiers.length === 0) return null;
    
    return priceTiers.find(
      tier => quantity >= tier.minQuantity && quantity <= tier.maxQuantity
    );
  };
  
  const currentTier = getCurrentPriceTier();
  const currentPrice = currentTier ? currentTier.price : salePrice;
  const totalPrice = (currentPrice * quantity).toFixed(2);
  
  // Handle quantity change
  const handleQuantityChange = (e) => {
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
  
  return (
    <div className="dynamic-pricing-container">
      <div className="price-display">
        <span className="original-price">${regularPrice.toFixed(2)}</span>
        <span className="sale-price">${salePrice.toFixed(2)}</span>
        {savingsPercentage > 0 && (
          <span className="savings-badge">Save {savingsPercentage}%</span>
        )}
      </div>
      
      <div className="price-description">
        Base price per unit | Volume discounts available
      </div>
      
      {/* Volume pricing table */}
      <div className="volume-pricing-table">
        <div className="volume-pricing-header">Volume Pricing</div>
        <div className="volume-pricing-grid">
          <div className="grid-header">Quantity</div>
          <div className="grid-header">Price Per Unit</div>
          <div className="grid-header">Total</div>
          <div className="grid-header"></div>
          
          {priceTiers.map((tier, index) => (
            <React.Fragment key={`tier-${index}`}>
              <div className="grid-cell">
                {tier.minQuantity === tier.maxQuantity 
                  ? tier.minQuantity 
                  : `${tier.minQuantity}-${tier.maxQuantity === 999999 ? '+' : tier.maxQuantity}`}
              </div>
              <div className="grid-cell">${tier.price.toFixed(2)}</div>
              <div className="grid-cell">
                ${(tier.price * (tier.minQuantity === tier.maxQuantity 
                  ? tier.minQuantity 
                  : tier.minQuantity)).toFixed(2)}
              </div>
              <div className="grid-cell savings">
                {tier.savingsPercentage > 0 ? `Save ${tier.savingsPercentage}%` : ''}
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Quantity selector and calculator */}
      <div className="quantity-calculator">
        <div className="quantity-selector">
          <label htmlFor="quantity" className="quantity-label">Quantity:</label>
          <div className="quantity-controls">
            <button
              type="button"
              className="quantity-button"
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
              className="quantity-button"
              onClick={handleIncrease}
            >
              +
            </button>
          </div>
        </div>
        
        <div className="price-calculator">
          <div className="calculator-row">
            <span className="calculator-label">Your Price:</span>
            <span className="calculator-value">${currentPrice.toFixed(2)} per unit</span>
          </div>
          <div className="calculator-row">
            <span className="calculator-label">Total:</span>
            <span className="calculator-value total">${totalPrice}</span>
          </div>
        </div>
      </div>
    </div>
  );
}