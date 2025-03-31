import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "../hooks/use-toast";
import { apiRequest, queryClient } from "../lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import "../styles/FrequentlyBoughtTogether.css";

interface FrequentlyBoughtTogetherProps {
  productId: number;
}

export default function FrequentlyBoughtTogetherCSS({ productId }: FrequentlyBoughtTogetherProps) {
  const { toast } = useToast();
  const [selectedProducts, setSelectedProducts] = useState<number[]>([productId]);
  
  // Simulate the data source for frequently bought together products
  const { data: suggestedProducts, isLoading } = useQuery({
    queryKey: [`/api/products/${productId}/related`],
  });
  
  // Create cart mutation
  const addToCartMutation = useMutation({
    mutationFn: (data: { productId: number; quantity: number }) => {
      return apiRequest("POST", "/api/cart", data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Added to Cart",
        description: "Products added to your cart.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add items to cart: ${error}`,
      });
    },
  });
  
  const toggleProductSelection = (id: number) => {
    if (id === productId) return; // Can't unselect the main product
    
    setSelectedProducts(prev => {
      if (prev.includes(id)) {
        return prev.filter(productId => productId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const handleAddToCart = () => {
    // Add each selected product to cart
    selectedProducts.forEach(id => {
      addToCartMutation.mutate({
        productId: id,
        quantity: 1, // Default quantity for bundle items
      });
    });
  };
  
  // Calculate total price
  const calculateTotalPrice = () => {
    if (!suggestedProducts) return 0;
    
    const selectedItems = suggestedProducts.filter((product: any) => 
      selectedProducts.includes(product.id)
    );
    
    return selectedItems.reduce(
      (total: number, product: any) => total + product.salePrice,
      0
    );
  };
  
  if (isLoading) {
    return (
      <div className="frequently-bought-container">
        <h2 className="section-title">Frequently Bought Together</h2>
        <div className="frequently-bought-loading">
          <div className="product-skeleton"></div>
          <div className="plus-symbol">+</div>
          <div className="product-skeleton"></div>
          <div className="plus-symbol">+</div>
          <div className="product-skeleton"></div>
        </div>
      </div>
    );
  }
  
  if (!suggestedProducts || suggestedProducts.length === 0) {
    return null; // Don't show the section if no suggested products
  }
  
  // Only show up to 3 suggested products
  const displayProducts = suggestedProducts.slice(0, 3);
  const totalPrice = calculateTotalPrice();
  
  return (
    <div className="frequently-bought-container">
      <h2 className="section-title">Frequently Bought Together</h2>
      
      <div className="products-row">
        {/* Main product (always included) */}
        {suggestedProducts.find((p: any) => p.id === productId) && (
          <>
            <div className="product-card selected">
              <div className="product-image-container">
                <img 
                  src={suggestedProducts.find((p: any) => p.id === productId).images[0]} 
                  alt={suggestedProducts.find((p: any) => p.id === productId).name} 
                  className="product-image"
                />
                <div className="selection-indicator">
                  <span className="checkmark">✓</span>
                </div>
              </div>
              <div className="product-info">
                <span className="product-name">{suggestedProducts.find((p: any) => p.id === productId).name}</span>
                <span className="product-price">${suggestedProducts.find((p: any) => p.id === productId).salePrice.toFixed(2)}</span>
              </div>
            </div>
            
            {displayProducts.filter((p: any) => p.id !== productId).length > 0 && (
              <div className="plus-symbol">+</div>
            )}
          </>
        )}
        
        {/* Additional suggested products */}
        {displayProducts
          .filter((product: any) => product.id !== productId)
          .map((product: any, index: number, array: any[]) => (
            <React.Fragment key={product.id}>
              <div 
                className={`product-card ${selectedProducts.includes(product.id) ? 'selected' : ''}`}
                onClick={() => toggleProductSelection(product.id)}
              >
                <div className="product-image-container">
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="product-image"
                  />
                  <div className="selection-indicator">
                    <span className="checkmark">✓</span>
                  </div>
                </div>
                <div className="product-info">
                  <span className="product-name">{product.name}</span>
                  <span className="product-price">${product.salePrice.toFixed(2)}</span>
                </div>
              </div>
              
              {index < array.length - 1 && (
                <div className="plus-symbol">+</div>
              )}
            </React.Fragment>
          ))}
      </div>
      
      <div className="bundle-summary">
        <div className="price-summary">
          <label className="bundle-total-label">
            <input 
              type="checkbox"
              checked={selectedProducts.length > 1}
              onChange={() => {
                // If anything is unselected, select all. Otherwise, unselect all except main product
                if (selectedProducts.length <= displayProducts.length) {
                  setSelectedProducts(displayProducts.map((p: any) => p.id));
                } else {
                  setSelectedProducts([productId]);
                }
              }}
              className="bundle-checkbox"
            />
            <span>Price for all: </span>
          </label>
          <span className="bundle-total-price">${totalPrice.toFixed(2)}</span>
        </div>
        
        <button 
          className="add-all-button"
          onClick={handleAddToCart}
          disabled={addToCartMutation.isPending}
        >
          {addToCartMutation.isPending ? "Adding..." : "Add selected to cart"}
        </button>
      </div>
    </div>
  );
}