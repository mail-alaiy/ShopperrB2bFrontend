import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  SearchIcon, 
  MenuIcon, 
  ShoppingCartIcon, 
  UserIcon, 
  PackageIcon,
  ChevronDownIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();
  
  const { data: cartItems } = useQuery({
    queryKey: ["/api/cart"],
  });
  
  const cartItemCount = cartItems?.length || 0;
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchTerm);
  };
  
  const categories = [
    "Office Supplies",
    "Technology",
    "Furniture",
    "Bulk Orders",
    "Business Deals",
    "Customer Service"
  ];
  
  return (
    <header>
      {/* Top navigation bar */}
      <div className="bg-[#131921] text-white">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/">
              <a className="text-2xl font-bold mr-6">Shopperr<span className="text-[#febd69]">B2B</span></a>
            </Link>
            
            {/* Search bar - hidden on mobile */}
            <div className="hidden md:flex flex-grow max-w-3xl">
              <form onSubmit={handleSearch} className="w-full relative flex">
                <Input
                  type="text"
                  placeholder="Search products"
                  className="w-full rounded-l-md rounded-r-none border-0 text-black"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button 
                  type="submit" 
                  className="rounded-l-none bg-[#febd69] hover:bg-amber-500 text-black"
                >
                  <SearchIcon className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
          
          {/* Account & Orders */}
          <div className="flex items-center">
            <div className="hidden md:block text-sm mx-2">
              <div>Hello, Business Account</div>
              <div className="font-bold">
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none flex items-center">
                    Account & Lists
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <UserIcon className="mr-2 h-4 w-4" /> Your Account
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <PackageIcon className="mr-2 h-4 w-4" /> Your Orders
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="hidden md:block text-sm mx-2">
              <div>Returns</div>
              <div className="font-bold">& Orders</div>
            </div>
            <Link href="/cart">
              <a className="flex items-center mx-2">
                <ShoppingCartIcon className="h-6 w-6" />
                <span className="ml-1 font-bold">Cart</span>
                {cartItemCount > 0 && (
                  <span className="bg-[#f90] text-white rounded-full px-2 ml-1">
                    {cartItemCount}
                  </span>
                )}
              </a>
            </Link>
            
            {/* Mobile menu toggle */}
            <Button 
              variant="ghost" 
              size="icon"
              className="md:hidden ml-2 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <MenuIcon className="h-6 w-6" />
            </Button>
          </div>
        </div>
        
        {/* Mobile search - visible only on mobile */}
        <div className="md:hidden px-4 pb-2">
          <form onSubmit={handleSearch} className="w-full relative flex">
            <Input
              type="text"
              placeholder="Search products"
              className="w-full rounded-l-md rounded-r-none border-0 text-black"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button 
              type="submit" 
              className="rounded-l-none bg-[#febd69] hover:bg-amber-500 text-black"
            >
              <SearchIcon className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
      
      {/* Secondary navigation */}
      <div className="bg-[#232f3e] py-1 px-4">
        <div className="container mx-auto flex items-center text-sm text-white overflow-x-auto">
          <a href="#" className="mr-4 whitespace-nowrap flex items-center">
            <MenuIcon className="mr-1 h-4 w-4" /> All Categories
          </a>
          {categories.map((category, index) => (
            <a key={index} href="#" className="mr-4 whitespace-nowrap hidden md:block">
              {category}
            </a>
          ))}
        </div>
      </div>
      
      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-col">
              <div className="py-2 border-b">
                <div className="font-bold flex items-center">
                  <UserIcon className="mr-2 h-4 w-4" />
                  Account & Lists
                </div>
              </div>
              <div className="py-2 border-b">
                <div className="font-bold flex items-center">
                  <PackageIcon className="mr-2 h-4 w-4" />
                  Returns & Orders
                </div>
              </div>
              {categories.map((category, index) => (
                <a key={index} href="#" className="py-2 border-b">
                  {category}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
