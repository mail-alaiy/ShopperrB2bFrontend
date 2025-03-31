import React, { useState, useEffect } from "react";
import StandardProductDetail from "../components/StandardProductDetail";
import "../components/styles.css";

// This is a simple demo version that can be used with your existing project
export default function StandardProductPage({ productId }) {
  const [product, setProduct] = useState(null);
  const [priceTiers, setPriceTiers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // In your project, replace this with your own API endpoints or data fetching method
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Simulating API call to fetch product data
        // Replace with your actual API call
        // Example: const response = await fetch(`/api/products/${productId}`);
        
        // For demonstration purposes, using mock data
        const mockProduct = {
          id: 1,
          name: "Professional Wireless Keyboard and Mouse Combo",
          brand: "TechGear Pro",
          description: "Enhance your productivity with this ergonomic keyboard and precision mouse combo. Perfect for business professionals.",
          regularPrice: 89.99,
          salePrice: 69.99,
          rating: 4.5,
          ratingCount: 246,
          images: [
            "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            "https://images.unsplash.com/photo-1527439188335-cf7cb3fb41ed?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
          ],
          features: [
            "Ergonomic design reduces strain during long work sessions",
            "Wireless connection with up to 33ft range and strong signal stability",
            "12-month battery life for keyboard and 6-month for mouse",
            "Compatible with Windows, macOS, and Linux operating systems",
            "Spill-resistant keyboard with quiet typing experience"
          ],
          variations: [
            { id: 1, name: "Black" },
            { id: 2, name: "White" },
            { id: 3, name: "Silver" }
          ],
          category: "Electronics",
          subcategory: "Computer Accessories",
          stockQuantity: 150
        };
        
        // Mock price tiers
        const mockPriceTiers = [
          { id: 1, productId: 1, minQuantity: 1, maxQuantity: 9, price: 69.99, savingsPercentage: 0 },
          { id: 2, productId: 1, minQuantity: 10, maxQuantity: 49, price: 64.99, savingsPercentage: 7 },
          { id: 3, productId: 1, minQuantity: 50, maxQuantity: 99, price: 59.99, savingsPercentage: 14 },
          { id: 4, productId: 1, minQuantity: 100, maxQuantity: 999999, price: 54.99, savingsPercentage: 21 }
        ];
        
        setProduct(mockProduct);
        setPriceTiers(mockPriceTiers);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching product data:", err);
        setError("Failed to load product data. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchData();
  }, [productId]);
  
  if (loading) {
    return <div className="loading-container">Loading product details...</div>;
  }
  
  if (error) {
    return <div className="error-container">{error}</div>;
  }
  
  if (!product) {
    return <div className="error-container">Product not found</div>;
  }
  
  return (
    <div className="standard-product-page">
      <StandardProductDetail 
        product={product} 
        priceTiers={priceTiers} 
      />
    </div>
  );
}