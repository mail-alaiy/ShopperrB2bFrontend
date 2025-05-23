import React from "react";

interface ListViewIconProps {
  fillColor: string;
}

const ListViewIcon: React.FC<ListViewIconProps> = ({ fillColor }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect x="1" y="1" width="14" height="4" rx="1" fill={fillColor} />
    <rect x="1" y="7" width="14" height="4" rx="1" fill={fillColor} />
    <rect x="1" y="13" width="14" height="2" rx="1" fill={fillColor} />
  </svg>
);

export default ListViewIcon; 