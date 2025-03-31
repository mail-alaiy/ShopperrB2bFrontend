import React from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ProductDetailCSS from "../components/ProductDetailCSS";
import RelatedProductsCSS from "../components/RelatedProductsCSS";
import "../styles/ProductPage.css";

export default function ProductPageCSS() {
  const [, params] = useRoute("/products/:id");
  const productId = params?.id ? parseInt(params.id) : 0;
  
  const { data: product, isLoading: isLoadingProduct, error: productError } = useQuery({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });
  
  const { data: priceTiers, isLoading: isLoadingPriceTiers } = useQuery({
    queryKey: [`/api/products/${productId}/price-tiers`],
    enabled: !!productId,
  });
  
  if (isLoadingProduct) {
    return (
      <div className="product-page-container">
        <div className="product-page-loading">
          <div className="loading-message">Loading product information...</div>
        </div>
      </div>
    );
  }
  
  if (productError || !product) {
    return (
      <div className="product-page-container">
        <div className="product-page-error">
          <h2 className="error-title">Product Not Found</h2>
          <p className="error-message">
            Sorry, we couldn't find the product you're looking for. It may have been removed or doesn't exist.
          </p>
          <a href="/" className="back-home-link">Back to Home</a>
        </div>
      </div>
    );
  }
  
  return (
    <div className="product-page-container">
      {/* Breadcrumbs navigation */}
      <div className="breadcrumbs">
        <a href="/" className="breadcrumb-link">Home</a>
        <span className="breadcrumb-separator">/</span>
        <a href={`/categories/${product.category}`} className="breadcrumb-link">{product.category}</a>
        <span className="breadcrumb-separator">/</span>
        <a href={`/subcategories/${product.subcategory}`} className="breadcrumb-link">{product.subcategory}</a>
        <span className="breadcrumb-separator">/</span>
        <span className="breadcrumb-current">{product.name}</span>
      </div>
      
      {/* Main product section */}
      <div className="product-detail-wrapper">
        <ProductDetailCSS 
          product={product} 
          priceTiers={priceTiers || []} 
          isLoadingPriceTiers={isLoadingPriceTiers} 
        />
      </div>
      
      {/* Related products section */}
      <RelatedProductsCSS productId={productId} />
      
      {/* Additional product sections can be added here */}
      <div className="additional-sections">
        {/* Product details tab panels */}
        <div className="product-tabs">
          <div className="tabs-header">
            <button className="tab-button active">Description</button>
            <button className="tab-button">Specifications</button>
            <button className="tab-button">Reviews</button>
            <button className="tab-button">FAQ</button>
          </div>
          
          <div className="tab-content">
            <div className="tab-panel active">
              <h3 className="tab-panel-title">Product Description</h3>
              <div className="product-description">
                <p>{product.description}</p>
                {product.longDescription && (
                  <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}