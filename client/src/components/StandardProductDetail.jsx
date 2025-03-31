import React, { useState } from "react";
import StandardProductImages from "./StandardProductImages";
import StandardDynamicPricing from "./StandardDynamicPricing";
import "./styles.css";

export default function StandardProductDetail({ product, priceTiers = [] }) {
  const [quantity, setQuantity] = useState(1);
  const [shippingSource, setShippingSource] = useState("ex-china");
  const [selectedVariation, setSelectedVariation] = useState(
    product?.variations?.[0] || {}
  );
  
  // Determine which price to display based on quantity and shipping source
  const calculatePrice = () => {
    // First get base price from quantity tiers
    let basePrice = product.salePrice;
    if (priceTiers && priceTiers.length > 0) {
      const tier = priceTiers.find(
        tier => quantity >= tier.minQuantity && quantity <= tier.maxQuantity
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
  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`} className="star-icon filled">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half-star" className="star-icon half-filled">★</span>);
    }
    
    return stars;
  };
  
  const handleAddToCart = () => {
    alert(`Added ${quantity} items to cart`);
    // Here you would add your cart functionality
  };
  
  const handleBuyNow = () => {
    alert(`Proceeding to checkout with ${quantity} items`);
    // Here you would add your checkout functionality
  };
  
  const currentPrice = calculatePrice();
  const totalPrice = (currentPrice * quantity).toFixed(2);
  
  return (
    <div className="product-detail-container">
      {/* Product images section - sticky on scroll */}
      <div className="product-images-section">
        <div className="sticky-container">
          <StandardProductImages images={product.images} name={product.name} />
        </div>
      </div>
      
      {/* Product information section */}
      <div className="product-info-section">
        <h1 className="product-title">{product.name}</h1>
        
        {/* Brand and ratings */}
        <div className="brand-rating-container">
          <a href="#" className="brand-link">by {product.brand}</a>
          <div className="rating-container">
            <div className="stars-container">
              {renderRatingStars(product.rating)}
            </div>
            <a href="#" className="ratings-link">{product.ratingCount} business ratings</a>
          </div>
        </div>
        
        {/* Product highlights */}
        <div className="product-highlights">
          <div className="section-title">Key Features:</div>
          <ul className="features-list">
            {product.features && product.features.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          
          {/* Product variations */}
          {product.variations && product.variations.length > 0 && (
            <div className="variations-container">
              <div className="variation-title">Style:</div>
              <div className="variations-buttons">
                {product.variations.map((variation) => (
                  <button
                    key={variation.id}
                    className={`variation-button ${selectedVariation.id === variation.id ? 'selected' : ''}`}
                    onClick={() => setSelectedVariation(variation)}
                  >
                    {variation.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Pricing section */}
        <div className="pricing-section">
          <StandardDynamicPricing
            regularPrice={product.regularPrice}
            salePrice={product.salePrice}
            priceTiers={priceTiers}
            quantity={quantity}
            setQuantity={setQuantity}
          />
          
          {/* Shipping Options */}
          <div className="shipping-options">
            <label htmlFor="shipping-source" className="option-label">Choose Shipping Source:</label>
            <div className="shipping-selector">
              <select 
                id="shipping-source" 
                className="shipping-select" 
                value={shippingSource} 
                onChange={(e) => setShippingSource(e.target.value)}
              >
                <option value="ex-china">Ex-China (USD)</option>
                <option value="ex-india">Ex-India Customs (USD)</option>
                <option value="doorstep">Doorstep Delivery (USD)</option>
              </select>
              <div className="tooltip-container">
                <span className="info-icon">ⓘ</span>
                <div className="tooltip">
                  <p><strong>Ex-China:</strong> Shipping from our China warehouse. You handle shipping and customs.</p>
                  <p><strong>Ex-India Customs:</strong> We handle shipping to India, you handle customs clearance.</p>
                  <p><strong>Doorstep:</strong> We handle all shipping and customs to your location.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Availability and Shipping Time */}
          <div className="availability-container">
            <div className="in-stock">
              <span className="check-icon">✓</span>
              <span className="status-text">In Stock - Ships within 1 business day from warehouse</span>
            </div>
            <div className="shipping-time">
              <span className="time-text">Standard shipping time: 18-20 days for all orders</span>
            </div>
          </div>
        </div>
        
        {/* Call-to-action buttons */}
        <div className="cta-buttons">
          <button 
            className="add-to-cart-button"
            onClick={handleAddToCart}
          >
            🛒 Add to Cart
          </button>
          <button 
            className="buy-now-button"
            onClick={handleBuyNow}
          >
            ⚡ Buy Now
          </button>
        </div>
        
        {/* Business account benefits */}
        <div className="benefits-container">
          <div className="benefits-title">Business Account Benefits:</div>
          <div className="benefits-grid">
            <div className="benefit-item">
              <span className="check-icon">✓</span>
              <span>Quantity discounts automatically applied</span>
            </div>
            <div className="benefit-item">
              <span className="check-icon">✓</span>
              <span>Net 30 payment terms available</span>
            </div>
            <div className="benefit-item">
              <span className="check-icon">✓</span>
              <span>Free business shipping on orders over $499</span>
            </div>
            <div className="benefit-item">
              <span className="check-icon">✓</span>
              <span>Dedicated business customer support</span>
            </div>
          </div>
          <a href="#" className="learn-more-link">Learn more about Shopperr Business Accounts</a>
        </div>
        
        {/* Save for later, Add to list */}
        <div className="action-links">
          <a href="#" className="action-link">❤️ Add to List</a>
          <a href="#" className="action-link">🔖 Save for Later</a>
          <a href="#" className="action-link">🔗 Share</a>
          <a href="#" className="action-link">📄 Download Spec Sheet</a>
        </div>
      </div>
    </div>
  );
}