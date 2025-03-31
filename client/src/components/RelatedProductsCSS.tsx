import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import "../styles/RelatedProducts.css";

interface RelatedProductsProps {
  productId: number;
}

export default function RelatedProductsCSS({ productId }: RelatedProductsProps) {
  const { data: relatedProducts, isLoading, error } = useQuery({
    queryKey: [`/api/products/${productId}/related`],
  });
  
  if (isLoading) {
    return (
      <div className="related-products-container">
        <h2 className="related-products-title">Related Products</h2>
        <div className="related-products-grid">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="related-product-skeleton">
              <div className="image-skeleton"></div>
              <div className="title-skeleton"></div>
              <div className="price-skeleton"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="related-products-error">
        Failed to load related products.
      </div>
    );
  }
  
  if (!relatedProducts || relatedProducts.length === 0) {
    return null;
  }
  
  return (
    <div className="related-products-container">
      <h2 className="related-products-title">Customers Also Purchased</h2>
      <div className="related-products-grid">
        {relatedProducts.map((product: any) => (
          <Link key={product.id} href={`/products/${product.id}`}>
            <a className="related-product-card">
              <div className="related-product-image-container">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="related-product-image" 
                />
              </div>
              <div className="related-product-info">
                <h3 className="related-product-title">{product.name}</h3>
                <div className="related-product-price">
                  <span className="related-product-sale-price">${product.salePrice.toFixed(2)}</span>
                  {product.salePrice < product.regularPrice && (
                    <span className="related-product-regular-price">${product.regularPrice.toFixed(2)}</span>
                  )}
                </div>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </div>
  );
}