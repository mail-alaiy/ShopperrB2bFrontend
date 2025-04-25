import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NoProductsFound() {
  return (
    <div className="col-span-full text-center py-12">
      <p className="text-xl text-gray-600">
        No products found in this category.
      </p>
      <p className="mt-2 text-gray-500">
        Try a different category or check out our other offerings.
      </p>
      <Link href="/">
        <a>
          <Button className="mt-4">Continue Shopping</Button>
        </a>
      </Link>
    </div>
  );
} 