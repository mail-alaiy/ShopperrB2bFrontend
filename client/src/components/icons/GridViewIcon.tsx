import React from "react";

interface GridViewIconProps {
  fillColor: string;
}

const GridViewIcon: React.FC<GridViewIconProps> = ({ fillColor }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="1" y="1" width="6" height="6" rx="1" fill={fillColor} />
    <rect x="9" y="1" width="6" height="6" rx="1" fill={fillColor} />
    <rect x="1" y="9" width="6" height="6" rx="1" fill={fillColor} />
    <rect x="9" y="9" width="6" height="6" rx="1" fill={fillColor} />
  </svg>
);

export default GridViewIcon; 