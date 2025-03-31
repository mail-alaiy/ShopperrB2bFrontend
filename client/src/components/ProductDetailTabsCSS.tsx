import React, { useState } from "react";
import "../styles/ProductDetailTabs.css";

interface ProductDetailTabsProps {
  product: any;
}

export default function ProductDetailTabsCSS({ product }: ProductDetailTabsProps) {
  const [activeTab, setActiveTab] = useState("description");
  
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
  };
  
  return (
    <div className="product-detail-tabs">
      <div className="tabs-header">
        <button 
          className={`tab-button ${activeTab === "description" ? "active" : ""}`}
          onClick={() => handleTabClick("description")}
        >
          Description
        </button>
        <button 
          className={`tab-button ${activeTab === "specifications" ? "active" : ""}`}
          onClick={() => handleTabClick("specifications")}
        >
          Specifications
        </button>
        <button 
          className={`tab-button ${activeTab === "reviews" ? "active" : ""}`}
          onClick={() => handleTabClick("reviews")}
        >
          Business Reviews ({product.ratingCount || 0})
        </button>
        <button 
          className={`tab-button ${activeTab === "faq" ? "active" : ""}`}
          onClick={() => handleTabClick("faq")}
        >
          FAQ
        </button>
      </div>
      
      <div className="tab-content">
        <div className={`tab-panel ${activeTab === "description" ? "active" : ""}`}>
          <h3 className="tab-panel-title">Product Description</h3>
          <div className="product-description">
            <p>{product.description}</p>
            {product.longDescription && (
              <div dangerouslySetInnerHTML={{ __html: product.longDescription }} />
            )}
          </div>
        </div>
        
        <div className={`tab-panel ${activeTab === "specifications" ? "active" : ""}`}>
          <h3 className="tab-panel-title">Technical Specifications</h3>
          {product.specifications ? (
            <div className="specifications-table">
              {Object.entries(product.specifications).map(([key, value]: [string, any]) => (
                <div key={key} className="specification-row">
                  <div className="specification-key">{key}</div>
                  <div className="specification-value">{value}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-data-message">No specifications available for this product.</p>
          )}
        </div>
        
        <div className={`tab-panel ${activeTab === "reviews" ? "active" : ""}`}>
          <h3 className="tab-panel-title">Business Customer Reviews</h3>
          {product.ratingCount > 0 ? (
            <div className="reviews-summary">
              <div className="average-rating">
                <div className="rating-number">{product.rating.toFixed(1)}</div>
                <div className="rating-stars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span 
                      key={i} 
                      className={`star ${i < Math.floor(product.rating) ? 'filled' : ''} ${
                        i === Math.floor(product.rating) && product.rating % 1 >= 0.5 ? 'half-filled' : ''
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <div className="rating-count">{product.ratingCount} reviews</div>
              </div>
              
              <div className="reviews-placeholder">
                <p>Reviews would be listed here in a real application.</p>
                <button className="write-review-button">Write a Review</button>
              </div>
            </div>
          ) : (
            <div className="no-reviews">
              <p className="no-data-message">No reviews yet. Be the first to review this product!</p>
              <button className="write-review-button">Write a Review</button>
            </div>
          )}
        </div>
        
        <div className={`tab-panel ${activeTab === "faq" ? "active" : ""}`}>
          <h3 className="tab-panel-title">Frequently Asked Questions</h3>
          {product.faqs && product.faqs.length > 0 ? (
            <div className="faq-list">
              {product.faqs.map((faq: any, index: number) => (
                <div key={index} className="faq-item">
                  <div className="faq-question">{faq.question}</div>
                  <div className="faq-answer">{faq.answer}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-faqs">
              <p className="no-data-message">No FAQs available for this product.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}