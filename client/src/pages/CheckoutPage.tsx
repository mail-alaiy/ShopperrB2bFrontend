import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Product, CartItem } from "@shared/schema";
import { 
  CreditCardIcon, 
  TruckIcon, 
  CheckCircleIcon, 
  ShieldCheckIcon, 
  ChevronRightIcon,
  MapPinIcon,
  BuildingIcon,
  GlobeIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutPage() {
  const [location, navigate] = useLocation();
  const [activeStep, setActiveStep] = useState("shipping");
  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("credit");
  
  const { data: cartItems = [], isLoading } = useQuery<(CartItem & { product: Product })[]>({
    queryKey: ["/api/cart"],
  });
  
  // Calculate cart totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.salePrice * item.quantity), 0);
  const shipping = shippingMethod === "standard" ? (subtotal > 50 ? 0 : 5.99) : 
                  shippingMethod === "expedited" ? 12.99 : 
                  shippingMethod === "priority" ? 19.99 : 0;
  const tax = subtotal * 0.07; // 7% tax
  const total = subtotal + shipping + tax;
  
  const handleSubmitShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveStep("payment");
  };
  
  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveStep("review");
  };
  
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/order-confirmation");
  };
  
  // Check if cart is empty
  const isCartEmpty = cartItems.length === 0 && !isLoading;
  
  if (isCartEmpty && !isLoading) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center max-w-2xl mx-auto">
            <div className="text-amber-500 mb-4">
              <ShieldCheckIcon className="h-16 w-16 mx-auto" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
            <p className="text-gray-600 mb-6">
              You need to add items to your cart before proceeding to checkout.
            </p>
            <Link href="/">
              <Button className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center mb-8">
          <Link href="/">
            <a className="text-2xl font-bold mr-6">Shopperr<span className="text-amber-500">B2B</span></a>
          </Link>
        </div>
        
        {/* Checkout Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center w-full max-w-3xl">
            <div className={`flex flex-col items-center ${activeStep === "shipping" ? "text-blue-600" : "text-gray-600"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep === "shipping" ? "bg-blue-100 border-2 border-blue-600" : activeStep === "payment" || activeStep === "review" ? "bg-green-100 border-2 border-green-600" : "bg-gray-100 border-2 border-gray-300"}`}>
                {activeStep === "payment" || activeStep === "review" ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                ) : (
                  <TruckIcon className={`h-5 w-5 ${activeStep === "shipping" ? "text-blue-600" : "text-gray-500"}`} />
                )}
              </div>
              <span className="text-sm font-medium">Shipping</span>
            </div>
            
            <div className={`flex-1 h-1 mx-4 ${activeStep === "shipping" ? "bg-gray-200" : "bg-blue-600"}`}></div>
            
            <div className={`flex flex-col items-center ${activeStep === "payment" ? "text-blue-600" : activeStep === "review" ? "text-gray-600" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep === "payment" ? "bg-blue-100 border-2 border-blue-600" : activeStep === "review" ? "bg-green-100 border-2 border-green-600" : "bg-gray-100 border-2 border-gray-300"}`}>
                {activeStep === "review" ? (
                  <CheckCircleIcon className="h-6 w-6 text-green-600" />
                ) : (
                  <CreditCardIcon className={`h-5 w-5 ${activeStep === "payment" ? "text-blue-600" : "text-gray-500"}`} />
                )}
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
            
            <div className={`flex-1 h-1 mx-4 ${activeStep === "shipping" || activeStep === "payment" ? "bg-gray-200" : "bg-blue-600"}`}></div>
            
            <div className={`flex flex-col items-center ${activeStep === "review" ? "text-blue-600" : "text-gray-400"}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${activeStep === "review" ? "bg-blue-100 border-2 border-blue-600" : "bg-gray-100 border-2 border-gray-300"}`}>
                <ShieldCheckIcon className={`h-5 w-5 ${activeStep === "review" ? "text-blue-600" : "text-gray-500"}`} />
              </div>
              <span className="text-sm font-medium">Review</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              {activeStep === "shipping" && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                  
                  <Tabs defaultValue="business" className="mb-6">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="business">Business Address</TabsTrigger>
                      <TabsTrigger value="residential">Residential Address</TabsTrigger>
                    </TabsList>
                    <TabsContent value="business" className="mt-4">
                      <form onSubmit={handleSubmitShipping}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label htmlFor="company">Company Name*</Label>
                            <Input id="company" placeholder="Your Company" className="mt-1" required />
                          </div>
                          <div>
                            <Label htmlFor="tax-id">Tax ID / Business Number</Label>
                            <Input id="tax-id" placeholder="Optional" className="mt-1" />
                          </div>
                          <div>
                            <Label htmlFor="first-name">First Name*</Label>
                            <Input id="first-name" placeholder="First Name" className="mt-1" required />
                          </div>
                          <div>
                            <Label htmlFor="last-name">Last Name*</Label>
                            <Input id="last-name" placeholder="Last Name" className="mt-1" required />
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <Label htmlFor="address1">Address Line 1*</Label>
                          <Input id="address1" placeholder="Street address" className="mt-1" required />
                        </div>
                        
                        <div className="mb-4">
                          <Label htmlFor="address2">Address Line 2</Label>
                          <Input id="address2" placeholder="Apartment, suite, unit, building, floor, etc." className="mt-1" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <Label htmlFor="city">City*</Label>
                            <Input id="city" placeholder="City" className="mt-1" required />
                          </div>
                          <div>
                            <Label htmlFor="state">State / Province*</Label>
                            <Input id="state" placeholder="State" className="mt-1" required />
                          </div>
                          <div>
                            <Label htmlFor="zip">ZIP / Postal Code*</Label>
                            <Input id="zip" placeholder="ZIP Code" className="mt-1" required />
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <Label htmlFor="country">Country*</Label>
                          <Select defaultValue="us">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="mx">Mexico</SelectItem>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="mb-4">
                          <Label htmlFor="phone">Phone Number*</Label>
                          <Input id="phone" placeholder="Phone Number" className="mt-1" required />
                        </div>
                        
                        <div className="mb-6">
                          <div className="flex items-center">
                            <Checkbox id="save-address" />
                            <label htmlFor="save-address" className="ml-2 text-sm">
                              Save this address for future orders
                            </label>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-bold mb-4">Shipping Method</h3>
                        
                        <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="mb-6">
                          <div className="flex items-start space-x-4 mb-3 border rounded-md p-3 hover:bg-gray-50">
                            <RadioGroupItem value="standard" id="standard" className="mt-1" />
                            <div className="flex-1">
                              <label htmlFor="standard" className="font-medium">
                                Standard Shipping (2-5 business days)
                              </label>
                              <p className="text-sm text-gray-500">
                                Free for orders over $50, otherwise $5.99
                              </p>
                            </div>
                            <div className="font-bold">
                              {subtotal > 50 ? "FREE" : "$5.99"}
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-4 mb-3 border rounded-md p-3 hover:bg-gray-50">
                            <RadioGroupItem value="expedited" id="expedited" className="mt-1" />
                            <div className="flex-1">
                              <label htmlFor="expedited" className="font-medium">
                                Expedited Shipping (2-3 business days)
                              </label>
                              <p className="text-sm text-gray-500">
                                Get your items faster with expedited shipping
                              </p>
                            </div>
                            <div className="font-bold">$12.99</div>
                          </div>
                          
                          <div className="flex items-start space-x-4 border rounded-md p-3 hover:bg-gray-50">
                            <RadioGroupItem value="priority" id="priority" className="mt-1" />
                            <div className="flex-1">
                              <label htmlFor="priority" className="font-medium">
                                Priority Shipping (1-2 business days)
                              </label>
                              <p className="text-sm text-gray-500">
                                Our fastest shipping method for urgent orders
                              </p>
                            </div>
                            <div className="font-bold">$19.99</div>
                          </div>
                        </RadioGroup>
                        
                        <div className="flex justify-end">
                          <Button type="submit" className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium">
                            Continue to Payment
                          </Button>
                        </div>
                      </form>
                    </TabsContent>
                    
                    <TabsContent value="residential" className="mt-4">
                      <form onSubmit={handleSubmitShipping}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label htmlFor="first-name-res">First Name*</Label>
                            <Input id="first-name-res" placeholder="First Name" className="mt-1" required />
                          </div>
                          <div>
                            <Label htmlFor="last-name-res">Last Name*</Label>
                            <Input id="last-name-res" placeholder="Last Name" className="mt-1" required />
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <Label htmlFor="address1-res">Address Line 1*</Label>
                          <Input id="address1-res" placeholder="Street address" className="mt-1" required />
                        </div>
                        
                        <div className="mb-4">
                          <Label htmlFor="address2-res">Address Line 2</Label>
                          <Input id="address2-res" placeholder="Apartment, suite, unit, etc." className="mt-1" />
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <Label htmlFor="city-res">City*</Label>
                            <Input id="city-res" placeholder="City" className="mt-1" required />
                          </div>
                          <div>
                            <Label htmlFor="state-res">State / Province*</Label>
                            <Input id="state-res" placeholder="State" className="mt-1" required />
                          </div>
                          <div>
                            <Label htmlFor="zip-res">ZIP / Postal Code*</Label>
                            <Input id="zip-res" placeholder="ZIP Code" className="mt-1" required />
                          </div>
                        </div>
                        
                        <div className="mb-4">
                          <Label htmlFor="country-res">Country*</Label>
                          <Select defaultValue="us">
                            <SelectTrigger>
                              <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="mx">Mexico</SelectItem>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="mb-4">
                          <Label htmlFor="phone-res">Phone Number*</Label>
                          <Input id="phone-res" placeholder="Phone Number" className="mt-1" required />
                        </div>
                        
                        <div className="mb-6">
                          <div className="flex items-center">
                            <Checkbox id="save-address-res" />
                            <label htmlFor="save-address-res" className="ml-2 text-sm">
                              Save this address for future orders
                            </label>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-bold mb-4">Shipping Method</h3>
                        
                        <RadioGroup value={shippingMethod} onValueChange={setShippingMethod} className="mb-6">
                          <div className="flex items-start space-x-4 mb-3 border rounded-md p-3 hover:bg-gray-50">
                            <RadioGroupItem value="standard" id="standard-res" className="mt-1" />
                            <div className="flex-1">
                              <label htmlFor="standard-res" className="font-medium">
                                Standard Shipping (2-5 business days)
                              </label>
                              <p className="text-sm text-gray-500">
                                Free for orders over $50, otherwise $5.99
                              </p>
                            </div>
                            <div className="font-bold">
                              {subtotal > 50 ? "FREE" : "$5.99"}
                            </div>
                          </div>
                          
                          <div className="flex items-start space-x-4 mb-3 border rounded-md p-3 hover:bg-gray-50">
                            <RadioGroupItem value="expedited" id="expedited-res" className="mt-1" />
                            <div className="flex-1">
                              <label htmlFor="expedited-res" className="font-medium">
                                Expedited Shipping (2-3 business days)
                              </label>
                              <p className="text-sm text-gray-500">
                                Get your items faster with expedited shipping
                              </p>
                            </div>
                            <div className="font-bold">$12.99</div>
                          </div>
                          
                          <div className="flex items-start space-x-4 border rounded-md p-3 hover:bg-gray-50">
                            <RadioGroupItem value="priority" id="priority-res" className="mt-1" />
                            <div className="flex-1">
                              <label htmlFor="priority-res" className="font-medium">
                                Priority Shipping (1-2 business days)
                              </label>
                              <p className="text-sm text-gray-500">
                                Our fastest shipping method for urgent orders
                              </p>
                            </div>
                            <div className="font-bold">$19.99</div>
                          </div>
                        </RadioGroup>
                        
                        <div className="flex justify-end">
                          <Button type="submit" className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium">
                            Continue to Payment
                          </Button>
                        </div>
                      </form>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
              
              {activeStep === "payment" && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                  
                  <form onSubmit={handleSubmitPayment}>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-6">
                      <div className="flex items-start space-x-4 mb-3 border rounded-md p-3 hover:bg-gray-50">
                        <RadioGroupItem value="credit" id="credit" className="mt-1" />
                        <div className="flex-1">
                          <label htmlFor="credit" className="font-medium">
                            Credit or Debit Card
                          </label>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <div className="bg-gray-100 rounded p-1 w-12 h-8 flex items-center justify-center">
                              <div className="text-xs">VISA</div>
                            </div>
                            <div className="bg-gray-100 rounded p-1 w-12 h-8 flex items-center justify-center">
                              <div className="text-xs">MC</div>
                            </div>
                            <div className="bg-gray-100 rounded p-1 w-12 h-8 flex items-center justify-center">
                              <div className="text-xs">AMEX</div>
                            </div>
                            <div className="bg-gray-100 rounded p-1 w-12 h-8 flex items-center justify-center">
                              <div className="text-xs">DISC</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4 mb-3 border rounded-md p-3 hover:bg-gray-50">
                        <RadioGroupItem value="net30" id="net30" className="mt-1" />
                        <div className="flex-1">
                          <label htmlFor="net30" className="font-medium">
                            Net-30 Terms
                          </label>
                          <p className="text-sm text-gray-500">
                            Business customers only. Subject to credit approval. 
                            Pay within 30 days of invoice date.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-4 border rounded-md p-3 hover:bg-gray-50">
                        <RadioGroupItem value="purchase-order" id="purchase-order" className="mt-1" />
                        <div className="flex-1">
                          <label htmlFor="purchase-order" className="font-medium">
                            Purchase Order
                          </label>
                          <p className="text-sm text-gray-500">
                            Business customers only. Provide a valid purchase order number.
                          </p>
                        </div>
                      </div>
                    </RadioGroup>
                    
                    {paymentMethod === "credit" && (
                      <div className="border rounded-md p-4 mb-6">
                        <div className="mb-4">
                          <Label htmlFor="card-number">Card Number*</Label>
                          <Input id="card-number" placeholder="1234 5678 9012 3456" className="mt-1" required />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label htmlFor="expiry">Expiration Date*</Label>
                            <Input id="expiry" placeholder="MM/YY" className="mt-1" required />
                          </div>
                          <div>
                            <Label htmlFor="cvv">Security Code (CVV)*</Label>
                            <Input id="cvv" placeholder="123" className="mt-1" required />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="name-on-card">Name on Card*</Label>
                          <Input id="name-on-card" placeholder="Full name as displayed on card" className="mt-1" required />
                        </div>
                      </div>
                    )}
                    
                    {paymentMethod === "purchase-order" && (
                      <div className="border rounded-md p-4 mb-6">
                        <div>
                          <Label htmlFor="po-number">Purchase Order Number*</Label>
                          <Input id="po-number" placeholder="Enter PO number" className="mt-1" required />
                        </div>
                      </div>
                    )}
                    
                    <h3 className="text-lg font-bold mb-4">Billing Address</h3>
                    
                    <div className="mb-6">
                      <div className="flex items-center mb-4">
                        <Checkbox id="same-address" defaultChecked />
                        <label htmlFor="same-address" className="ml-2">
                          Same as shipping address
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveStep("shipping")}
                      >
                        Back to Shipping
                      </Button>
                      <Button type="submit" className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium">
                        Review Order
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {activeStep === "review" && (
                <div>
                  <h2 className="text-xl font-bold mb-6">Review Order</h2>
                  
                  <div className="space-y-6 mb-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Shipping Address</h3>
                        <button 
                          type="button"
                          onClick={() => setActiveStep("shipping")}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Change
                        </button>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex items-start">
                          <MapPinIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">Acme Corporation</p>
                            <p>John Doe</p>
                            <p>123 Business Street</p>
                            <p>Suite 100</p>
                            <p>New York, NY 10001</p>
                            <p>United States</p>
                            <p className="text-gray-600 mt-1">+1 (555) 123-4567</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Shipping Method</h3>
                        <button 
                          type="button"
                          onClick={() => setActiveStep("shipping")}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Change
                        </button>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex items-start">
                          <TruckIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                          <div>
                            <p className="font-medium">
                              {shippingMethod === "standard" ? "Standard Shipping (2-5 business days)" : 
                               shippingMethod === "expedited" ? "Expedited Shipping (2-3 business days)" : 
                               "Priority Shipping (1-2 business days)"}
                            </p>
                            <p className="text-gray-600">
                              {shippingMethod === "standard" ? 
                                (subtotal > 50 ? "FREE" : "$5.99") : 
                               shippingMethod === "expedited" ? "$12.99" : "$19.99"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium">Payment Method</h3>
                        <button 
                          type="button"
                          onClick={() => setActiveStep("payment")}
                          className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          Change
                        </button>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex items-start">
                          {paymentMethod === "credit" ? (
                            <CreditCardIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                          ) : paymentMethod === "net30" ? (
                            <BuildingIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                          ) : (
                            <GlobeIcon className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                          )}
                          
                          <div>
                            <p className="font-medium">
                              {paymentMethod === "credit" ? "Credit Card" : 
                               paymentMethod === "net30" ? "Net-30 Terms" : "Purchase Order"}
                            </p>
                            {paymentMethod === "credit" && (
                              <p className="text-gray-600">VISA ending in 4567</p>
                            )}
                            {paymentMethod === "purchase-order" && (
                              <p className="text-gray-600">PO Number: PO-12345</p>
                            )}
                            <p className="text-gray-600">Billing address same as shipping</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-6 mb-6">
                    <h3 className="font-bold mb-4">Order Items</h3>
                    
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex py-3 border-b border-gray-200 last:border-b-0">
                        <div className="w-16 h-16 bg-gray-50 flex items-center justify-center rounded mr-4">
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name} 
                            className="max-h-full max-w-full object-contain" 
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium line-clamp-1">{item.product.name}</p>
                              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="font-medium">${(item.product.salePrice * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <form onSubmit={handlePlaceOrder}>
                    <div className="mb-6">
                      <Label htmlFor="order-notes">Order Notes (Optional)</Label>
                      <Textarea 
                        id="order-notes" 
                        placeholder="Special instructions for your order" 
                        className="mt-1 resize-none" 
                      />
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-start">
                        <Checkbox id="terms" required className="mt-1.5" />
                        <label htmlFor="terms" className="ml-2 text-sm">
                          By placing your order, you agree to Shopperr B2B's 
                          <Link href="/terms">
                            <a className="text-blue-600 hover:underline mx-1">Terms of Service</a>
                          </Link>
                          and
                          <Link href="/privacy">
                            <a className="text-blue-600 hover:underline ml-1">Privacy Policy</a>
                          </Link>
                        </label>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setActiveStep("payment")}
                      >
                        Back to Payment
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium"
                      >
                        Place Order
                      </Button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Order Summary</h2>
              
              <div className="mb-4">
                <div className="text-sm mb-2">
                  {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
                </div>
                
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                ) : (
                  <div className="max-h-40 overflow-y-auto mb-4">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex py-2 text-sm">
                        <div className="text-gray-600 mr-2">{item.quantity} ×</div>
                        <div className="flex-1 line-clamp-1">{item.product.name}</div>
                        <div className="font-medium ml-2">${(item.product.salePrice * item.quantity).toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <Separator className="my-4" />
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="font-medium">
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Estimated Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
              </div>
              
              <Separator className="my-4" />
              
              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Order Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
              
              <div className="text-xs text-gray-500">
                <p className="mb-2">
                  By placing your order, you agree to Shopperr B2B's terms and conditions, privacy policy, and return policy.
                </p>
                
                <div className="flex items-center text-green-600 mt-4">
                  <ShieldCheckIcon className="h-4 w-4 mr-1" />
                  <span className="font-medium">Secure checkout with 100% purchase protection</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}