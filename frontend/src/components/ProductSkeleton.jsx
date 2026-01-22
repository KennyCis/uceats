import React from "react";

const ProductSkeleton = () => {
  return (
    <div className="skeleton-card">
      {/* Fake Stock Badge */}
      <div className="skeleton-pulse skeleton-badge"></div>
      
      {/* Fake Image */}
      <div className="skeleton-pulse skeleton-img"></div>
      
      {/* Fake Title */}
      <div className="skeleton-pulse skeleton-title"></div>
      
      {/* Fake Category */}
      <div className="skeleton-pulse skeleton-category"></div>
      
      {/* Fake Price */}
      <div className="skeleton-pulse skeleton-price"></div>
    </div>
  );
};

export default ProductSkeleton;