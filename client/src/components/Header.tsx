import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  SearchIcon,
  MenuIcon,
  ShoppingCartIcon,
  UserIcon,
  PackageIcon,
  ChevronDownIcon,
  LogIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CategorySidebar from "@/components/CategorySidebar";
import { CartItem, Product } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useCategories } from "@/hooks/use-categories";

export default function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategorySidebarOpen, setIsCategorySidebarOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { user, logoutMutation } = useAuth();

  console.log(user);

  const { data: cartItems = [] } = useQuery<
    (CartItem & { product: Product })[]
  >({
    queryKey: ["/api/cart"],
  });

  const cartItemCount = cartItems.length || 0;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchTerm);
  };

  const toggleCategorySidebar = () => {
    setIsCategorySidebarOpen(!isCategorySidebarOpen);
  };

  const { categories } = useCategories();
  const topLevelCategories = categories?.map((cat) => cat.category) ?? [];

  return (
    <header>
      {/* Top navigation bar */}
      <div className="bg-[#131921] text-white">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold mr-6">
              Shopperr<span className="text-[#febd69]">B2B</span>
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
              <div>{user ? `Hello, ${user.name}` : "Hello, Sign in"}</div>
              <div className="font-bold">
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none flex items-center">
                    Account & Lists
                    <ChevronDownIcon className="ml-1 h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {user ? (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/profile">
                            <UserIcon className="mr-2 h-4 w-4" /> Your Account
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/orders">
                            <PackageIcon className="mr-2 h-4 w-4" /> Your Orders
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => logoutMutation.mutate()}
                        >
                          <LogIn className="mr-2 h-4 w-4" /> Sign Out
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <DropdownMenuItem asChild>
                        <Link href="/auth">
                          <LogIn className="mr-2 h-4 w-4" /> Sign In
                        </Link>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <div className="hidden md:block text-sm mx-2">
              <div>Returns</div>
              <div className="font-bold">
                <Link href={user ? "/orders" : "/auth"}>& Orders</Link>
              </div>
            </div>
            <Link href="/cart" className="flex items-center mx-2">
              <ShoppingCartIcon className="h-6 w-6" />
              <span className="ml-1 font-bold">Cart</span>
              {cartItemCount > 0 && (
                <span className="bg-[#f90] text-white rounded-full px-2 ml-1">
                  {cartItemCount}
                </span>
              )}
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
          <button
            onClick={toggleCategorySidebar}
            className="mr-4 whitespace-nowrap flex items-center cursor-pointer"
          >
            <MenuIcon className="mr-1 h-4 w-4" /> All Categories
          </button>
          {topLevelCategories.slice(0, 8).map((category) => (
            <Link
              key={category}
              href={`/categories/${category
                .toLowerCase()
                .replace(/\s+/g, "-")}`}
              className="mr-4 whitespace-nowrap hover:text-gray-300"
            >
              {category}
            </Link>
          ))}
        </div>
      </div>

      {/* Category Sidebar */}
      <CategorySidebar
        isOpen={isCategorySidebarOpen}
        onClose={() => setIsCategorySidebarOpen(false)}
      />

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b text-black">
          <div className="container mx-auto px-4 py-2">
            <div className="flex flex-col">
              {user ? (
                <>
                  <Link href="/profile" className="py-2 border-b">
                    <div className="font-bold flex items-center">
                      <UserIcon className="mr-2 h-4 w-4" />
                      Your Account ({user.name})
                    </div>
                  </Link>
                  <Link href="/orders" className="py-2 border-b">
                    <div className="font-bold flex items-center">
                      <PackageIcon className="mr-2 h-4 w-4" />
                      Your Orders
                    </div>
                  </Link>
                  <button
                    onClick={() => logoutMutation.mutate()}
                    className="py-2 border-b text-left font-bold flex items-center"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign Out
                  </button>
                </>
              ) : (
                <Link href="/auth" className="py-2 border-b">
                  <div className="font-bold flex items-center">
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In / Register
                  </div>
                </Link>
              )}
              <Link href={user ? "/orders" : "/auth"} className="py-2 border-b">
                <div className="font-bold flex items-center">
                  <PackageIcon className="mr-2 h-4 w-4" />
                  Returns & Orders
                </div>
              </Link>
              {topLevelCategories.map((category) => (
                <Link
                  key={category}
                  href={`/categories/${category
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                  className="py-2 border-b block"
                >
                  {category}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
