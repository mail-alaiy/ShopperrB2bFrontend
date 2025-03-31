import React, { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "../lib/queryClient";
import ProductImages from "./ProductImages";
import DynamicPricing from "./DynamicPricing";
import "../styles/ProductDetail.css";

interface ProductDetailProps {
  product: any;
  priceTiers: any[];
  isLoadingPriceTiers: boolean;
}

export default function ProductDetail({ product, priceTiers, isLoadingPriceTiers }: ProductDetailProps) {
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [shippingSource, setShippingSource] = useState("ex-china");
  const [selectedVariation, setSelectedVariation] = useState(
    product.variations.find((v: any) => v.selected) || product.variations[0]
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
  const renderRatingStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<span key={`star-${i}`} className="star-full">★</span>);
    }
    
    if (hasHalfStar) {
      stars.push(<span key="half-star" className="star-half">★</span>);
    }
    
    return stars;
  };
  
  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: (data: { productId: number; quantity: number }) => {
      return apiRequest("POST", "/api/cart", data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to Cart",
        description: `${quantity} item${quantity > 1 ? 's' : ''} added to your cart.`,
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add item to cart: ${error}`,
      });
    },
  });
  
  const handleAddToCart = () => {
    addToCartMutation.mutate({
      productId: product.id,
      quantity: quantity,
    });
  };
  
  const handleBuyNow = () => {
    // First add to cart
    addToCartMutation.mutate({
      productId: product.id,
      quantity: quantity,
    });
    
    // Then redirect to checkout (would be implemented in a real app)
    toast({
      title: "Proceeding to Checkout",
      description: `Redirecting to checkout with ${quantity} item${quantity > 1 ? 's' : ''}.`,
    });
  };
  
  const currentPrice = calculatePrice();
  const totalPrice = (currentPrice * quantity).toFixed(2);
  
  return (
    <div className="product-detail-container">
      {/* Product images section - sticky on scroll */}
      <div className="product-images-column">
        <div className="product-images-sticky">
          <ProductImages images={product.images} name={product.name} />
        </div>
      </div>
      
      {/* Product information section */}
      <div className="product-info-column">
        <h1 className="product-title">{product.name}</h1>
        
        {/* Brand and ratings */}
        <div className="brand-ratings">
          <a href="#" className="brand-link">by {product.brand}</a>
          <div className="ratings-container">
            <div className="rating-stars">
              {renderRatingStars(product.rating)}
            </div>
            <a href="#" className="ratings-count-link">{product.ratingCount} business ratings</a>
          </div>
        </div>
        
        {/* Product highlights */}
        <div className="product-highlights">
          <div className="section-title">Key Features:</div>
          <ul className="feature-list">
            {product.features.map((feature: string, index: number) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
          
          {/* Product variations */}
          {product.variations && product.variations.length > 0 && (
            <div className="variations-container">
              <div className="variation-title">Style:</div>
              <div className="variation-options">
                {product.variations.map((variation: any) => (
                  <button
                    key={variation.id}
                    className={`variation-button ${selectedVariation.id === variation.id ? 'variation-selected' : ''}`}
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
          <DynamicPricing
            regularPrice={product.regularPrice}
            salePrice={product.salePrice}
            priceTiers={priceTiers}
            quantity={quantity}
            setQuantity={setQuantity}
            isLoading={isLoadingPriceTiers}
          />
          
          {/* Shipping Options */}
          <div className="shipping-options">
            <label htmlFor="shipping-source" className="shipping-label">Choose Shipping Source:</label>
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
              <div className="shipping-info-tooltip">
                <span className="info-icon">ⓘ</span>
                <div className="tooltip-content">
                  <p><strong>Ex-China:</strong> Shipping from our China warehouse. You handle shipping and customs.</p>
                  <p><strong>Ex-India Customs:</strong> We handle shipping to India, you handle customs clearance.</p>
                  <p><strong>Doorstep:</strong> We handle all shipping and customs to your location.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Availability and Shipping Time */}
          <div className="availability-info">
            <div className="in-stock">
              <span className="check-icon">✓</span>
              <span className="availability-text">In Stock - Ships within 1 business day from warehouse</span>
            </div>
            <div className="shipping-time">
              <span className="shipping-text">Standard shipping time: 18-20 days for all orders</span>
            </div>
          </div>
        </div>
        
        {/* Call-to-action buttons */}
        <div className="cta-buttons">
          <button 
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={addToCartMutation.isPending}
          >
            🛒 {addToCartMutation.isPending ? "Adding..." : "Add to Cart"}
          </button>
          <button 
            className="buy-now-button"
            onClick={handleBuyNow}
            disabled={addToCartMutation.isPending}
          >
            ⚡ Buy Now
          </button>
        </div>
        
        {/* Business account benefits */}
        <div className="business-benefits">
          <div className="benefits-title">Business Account Benefits:</div>
          <div className="benefits-grid">
            <div className="benefit-item">
              <span className="benefit-check">✓</span>
              <span>Quantity discounts automatically applied</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-check">✓</span>
              <span>Net 30 payment terms available</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-check">✓</span>
              <span>Free business shipping on orders over $499</span>
            </div>
            <div className="benefit-item">
              <span className="benefit-check">✓</span>
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