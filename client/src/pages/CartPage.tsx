import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Product, CartItem } from "@shared/schema";
import { 
  Trash2Icon, 
  PlusIcon, 
  MinusIcon, 
  ShoppingCartIcon, 
  ChevronRightIcon, 
  ShieldCheckIcon, 
  TruckIcon,
  Clock3Icon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function CartPage() {
  const queryClient = useQueryClient();
  
  const { data: cartItems = [], isLoading } = useQuery<(CartItem & { product: Product })[]>({
    queryKey: ["/api/cart"],
  });
  
  const updateCartMutation = useMutation({
    mutationFn: async ({ id, quantity }: { id: number, quantity: number }) => {
      return apiRequest(`/api/cart/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });
  
  const removeFromCartMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest(`/api/cart/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cart"] });
    },
  });
  
  const handleQuantityChange = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateCartMutation.mutate({ id, quantity: newQuantity });
  };
  
  const handleRemoveItem = (id: number) => {
    removeFromCartMutation.mutate(id);
  };
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.salePrice * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;
  
  // Check if cart is empty
  const isCartEmpty = cartItems.length === 0 && !isLoading;
  
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          {!isCartEmpty && (
            <span className="text-gray-500 ml-4">({cartItems.length} {cartItems.length === 1 ? 'item' : 'items'})</span>
          )}
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0">
                    <div className="flex">
                      <Skeleton className="w-24 h-24 rounded mr-4" />
                      <div className="flex-1">
                        <Skeleton className="h-6 w-3/4 mb-2" />
                        <Skeleton className="h-5 w-1/4 mb-2" />
                        <Skeleton className="h-5 w-1/3 mb-3" />
                        <div className="flex justify-between">
                          <Skeleton className="h-8 w-28" />
                          <Skeleton className="h-8 w-24" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <Skeleton className="h-5 w-3/4 mb-4" />
                <Skeleton className="h-28 w-full mb-4" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        ) : isCartEmpty ? (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center max-w-2xl mx-auto">
            <div className="mb-6">
              <ShoppingCartIcon className="h-16 w-16 mx-auto text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-gray-500 mb-6">
                Looks like you haven't added any products to your cart yet.
                Browse our products and find something for your business!
              </p>
              <Link href="/">
                <Button className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium">
                  Continue Shopping
                </Button>
              </Link>
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h3 className="font-medium mb-3">Sign in to see your saved items</h3>
              <div className="flex justify-center space-x-4">
                <Button variant="outline">Sign in</Button>
                <Button variant="secondary">Create an account</Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <div className="flex justify-end mb-4">
                  <div className="text-sm text-gray-500">Price</div>
                </div>
                
                {cartItems.map((item) => (
                  <div key={item.id} className="mb-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0 last:mb-0">
                    <div className="flex flex-col sm:flex-row">
                      <div className="sm:w-24 h-24 bg-gray-50 flex items-center justify-center rounded mb-4 sm:mb-0 sm:mr-4">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name} 
                          className="max-h-full max-w-full object-contain" 
                        />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <Link href={`/products/${item.product.id}`}>
                            <a className="text-lg font-medium hover:text-blue-600 hover:underline line-clamp-2">
                              {item.product.name}
                            </a>
                          </Link>
                          <div className="text-lg font-bold">
                            ${(item.product.salePrice * item.quantity).toFixed(2)}
                          </div>
                        </div>
                        
                        <div className="text-sm text-green-600 mb-2">In Stock</div>
                        
                        <div className="text-sm text-gray-500 mb-2">
                          Eligible for FREE Shipping on orders over $50
                        </div>
                        
                        <div className="flex flex-wrap gap-4 mt-3">
                          <div className="flex items-center">
                            <span className="mr-2 text-sm">Qty:</span>
                            <div className="flex items-center border rounded">
                              <button 
                                className="px-2 py-1 hover:bg-gray-100"
                                onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <MinusIcon className="h-4 w-4" />
                              </button>
                              <span className="px-3 py-1">{item.quantity}</span>
                              <button 
                                className="px-2 py-1 hover:bg-gray-100"
                                onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              >
                                <PlusIcon className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                          
                          <button 
                            className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2Icon className="h-4 w-4 mr-1" /> Remove
                          </button>
                          
                          <button className="text-sm text-blue-600 hover:text-blue-800 hover:underline">
                            Save for later
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex justify-between items-center mt-6 text-gray-800">
                  <div className="text-sm">
                    Items ship from <span className="font-medium">Shopperr B2B</span>
                  </div>
                  <div className="text-xl font-bold">
                    Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items): 
                    <span className="text-amber-600 ml-2">${subtotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-bold mb-4">You might also like</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {/* This would be populated with recommended products */}
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="border rounded p-3 relative">
                      <div className="h-20 flex items-center justify-center mb-2">
                        <Skeleton className="h-16 w-16" />
                      </div>
                      <Skeleton className="h-4 w-3/4 mb-1" />
                      <Skeleton className="h-5 w-1/2 mb-2" />
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
                <div className="mb-4">
                  <div className="flex items-center text-green-600 mb-2">
                    <ShieldCheckIcon className="h-5 w-5 mr-2" />
                    <span className="text-sm font-medium">Your order qualifies for SafePay protection</span>
                  </div>
                  
                  <div className="text-xl font-bold mb-4">
                    Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items): 
                    <span className="text-amber-600 ml-2">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <Accordion type="single" collapsible className="mb-4">
                    <AccordionItem value="shipping">
                      <AccordionTrigger className="text-sm py-2">Shipping details</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Standard Shipping:</span>
                            <span>{shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Estimated Tax:</span>
                            <span>${tax.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between font-bold">
                            <span>Order Total:</span>
                            <span>${total.toFixed(2)}</span>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                  
                  <div className="flex items-center mb-4">
                    <input type="checkbox" id="gift" className="rounded" />
                    <label htmlFor="gift" className="ml-2 text-sm">This order contains a gift</label>
                  </div>
                  
                  <Link href="/checkout">
                    <Button className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium mb-3">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  
                  <div className="text-sm">
                    <div className="flex items-center text-gray-600 mb-1">
                      <Clock3Icon className="h-4 w-4 mr-1" />
                      <span>Expected delivery: 2-4 business days</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <TruckIcon className="h-4 w-4 mr-1" />
                      <span>Free shipping on orders over $50</span>
                    </div>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="text-sm">
                  <h4 className="font-medium mb-2">Business Account Benefits:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-600">
                    <li>Bulk quantity discounts</li>
                    <li>Tax exemption (with valid certificate)</li>
                    <li>Dedicated account manager</li>
                    <li>Custom payment terms</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}