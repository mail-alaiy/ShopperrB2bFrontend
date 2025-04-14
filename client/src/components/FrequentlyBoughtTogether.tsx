import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCartIcon } from "lucide-react";

interface FrequentlyBoughtTogetherProps {
  productId: number;
}

export default function FrequentlyBoughtTogether({ productId }: FrequentlyBoughtTogetherProps) {
  const { toast } = useToast();
  
  const { data: mainProduct } = useQuery({
    queryKey: [`/api/products/${productId}`],
    enabled: !!productId,
  });
  
  const { data: bundleProducts, isLoading } = useQuery({
    queryKey: [`/api/products/${productId}/related`, { type: "frequently_bought_together" }],
    enabled: !!productId,
  });
  
  const [selectedProducts, setSelectedProducts] = useState<{ [key: number]: boolean }>({});
  
  // Initialize selected products when data is loaded
  useState(() => {
    if (mainProduct && bundleProducts) {
      const initialSelected = { [mainProduct.id]: true };
      bundleProducts.forEach((product: any) => {
        initialSelected[product.id] = true;
      });
      setSelectedProducts(initialSelected);
    }
  });
  
  // Calculate bundle total
  const calculateBundleTotal = () => {
    let total = 0;
    
    if (mainProduct && selectedProducts[mainProduct.id]) {
      total += mainProduct.salePrice;
    }
    
    if (bundleProducts) {
      bundleProducts.forEach((product: any) => {
        if (selectedProducts[product.id]) {
          total += product.salePrice;
        }
      });
    }
    
    return total.toFixed(2);
  };
  
  // Calculate savings
  const calculateSavings = () => {
    // For this example, we'll assume a 10% bundle discount
    const bundleDiscount = 0.10;
    const total = parseFloat(calculateBundleTotal());
    return (total * bundleDiscount).toFixed(2);
  };
  
  // Add to cart mutation
  const addToCartMutation = useMutation({
    mutationFn: async (selectedIds: number[]) => {
      // Add each selected product to cart
      const promises = selectedIds.map(id => 
        apiRequest("POST", "/api/cart", { productId: id, quantity: 1 })
      );
      
      return Promise.all(promises);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
      toast({
        title: "Bundle Added to Cart",
        description: "All selected items have been added to your cart.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: `Failed to add bundle to cart: ${error}`,
      });
    },
  });
  
  const handleAddAllToCart = () => {
    const selectedIds = Object.entries(selectedProducts)
      .filter(([_, isSelected]) => isSelected)
      .map(([id]) => parseInt(id));
    
    addToCartMutation.mutate(selectedIds);
  };
  
  // Toggle product selection
  const toggleProductSelection = (productId: number) => {
    setSelectedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };
  
  if (isLoading) {
    return (
      <div className="border-t border-gray-200 mt-6 pt-6">
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="flex flex-col md:flex-row gap-6">
          <Skeleton className="md:w-3/5 h-40" />
          <Skeleton className="md:w-2/5 h-64" />
        </div>
      </div>
    );
  }
  
  if (!bundleProducts || bundleProducts.length === 0 || !mainProduct) {
    return null;
  }
  
  // Prepare all products for display
  const allProducts = [mainProduct, ...bundleProducts];
  
  return (
    <div className="border-t border-gray-200 mt-6 pt-6">
      <h2 className="text-xl font-bold mb-4">Frequently Bought Together</h2>
      
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="flex flex-wrap items-center justify-center md:w-3/5">
          {allProducts.map((product, index) => (
            <>
              <div key={`product-${product.id}`} className="border border-gray-200 p-3 bg-white m-2">
                <img 
                  src={product.images[0]} 
                  alt={product.name} 
                  className="w-32 h-32 object-contain" 
                />
              </div>
              {index < allProducts.length - 1 && (
                <div key={`plus-${index}`} className="text-3xl mx-2">+</div>
              )}
            </>
          ))}
        </div>
        
        <div className="md:w-2/5 bg-gray-50 border border-gray-200 rounded p-4">
          <div className="font-bold mb-3">Buy all {allProducts.length} items:</div>
          
          {allProducts.map(product => (
            <div key={`select-${product.id}`} className="flex items-center mb-2">
              <Checkbox 
                id={`item-${product.id}`} 
                checked={selectedProducts[product.id] || false}
                onCheckedChange={() => toggleProductSelection(product.id)}
                className="mr-2"
              />
              <Label htmlFor={`item-${product.id}`} className="text-sm flex-grow">
                {product.name}
              </Label>
              <span className="ml-auto text-sm font-medium">${product.salePrice.toFixed(2)}</span>
            </div>
          ))}
          
          <div className="border-t border-gray-200 pt-3 mb-3">
            <div className="flex justify-between font-bold">
              <span>Bundle Total:</span>
              <span>${calculateBundleTotal()}</span>
            </div>
            <div className="text-green-600 text-sm">You save ${calculateSavings()} when purchased together</div>
          </div>
          
          <Button 
            className="w-full bg-[#62c8f5] hover:bg-[#06184b] hover:text-white text-black"
            onClick={handleAddAllToCart}
            disabled={addToCartMutation.isPending}
          >
            <ShoppingCartIcon className="h-4 w-4 mr-2" /> 
            {addToCartMutation.isPending ? "Adding..." : "Add All to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
