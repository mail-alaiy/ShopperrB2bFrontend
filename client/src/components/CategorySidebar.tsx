import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CategorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategorySidebar({ isOpen, onClose }: CategorySidebarProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Add no-scroll class to body when sidebar is open
    if (isOpen) {
      document.body.classList.add("overflow-hidden");
    } else {
      document.body.classList.remove("overflow-hidden");
    }
    
    // Cleanup function
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isOpen]);
  
  // Main categories with subcategories
  const categories = [
    {
      name: "Office Supplies",
      icon: "📝",
      subcategories: [
        "Pens & Writing Supplies",
        "Paper & Notebooks",
        "Desk Accessories",
        "Binders & Filing",
        "Calendars & Planners"
      ]
    },
    {
      name: "Technology",
      icon: "💻",
      subcategories: [
        "Computers & Laptops",
        "Monitors & Displays",
        "Printers & Scanners",
        "Networking Equipment",
        "Storage & Hard Drives",
        "Keyboards & Mice"
      ]
    },
    {
      name: "Furniture",
      icon: "🪑",
      subcategories: [
        "Office Chairs",
        "Desks & Workstations",
        "File Cabinets",
        "Conference Tables",
        "Bookcases & Shelving"
      ]
    },
    {
      name: "Business Electronics",
      icon: "🔌",
      subcategories: [
        "Projectors",
        "Phones & Communication",
        "Audio Equipment",
        "Video Conference Gear",
        "Cameras & Accessories"
      ]
    },
    {
      name: "Safety & Security",
      icon: "🔒",
      subcategories: [
        "First Aid Supplies",
        "Security Cameras",
        "Safes & Lock Boxes",
        "Fire Protection",
        "Personal Protective Equipment"
      ]
    },
    {
      name: "Breakroom Supplies",
      icon: "☕",
      subcategories: [
        "Coffee & Tea",
        "Snacks & Beverages",
        "Appliances",
        "Cleaning Supplies",
        "Paper Products"
      ]
    },
    {
      name: "Shipping & Packaging",
      icon: "📦",
      subcategories: [
        "Boxes & Mailers",
        "Packing Materials",
        "Shipping Labels",
        "Tape & Adhesives",
        "Scales & Postage Meters"
      ]
    },
    {
      name: "Bulk Orders",
      icon: "🏭",
      subcategories: [
        "Paper Products",
        "Ink & Toner",
        "Basic Office Supplies",
        "Cleaning Supplies",
        "Technology Bundles"
      ]
    }
  ];

  // If not mounted yet (SSR), don't render anything
  if (!mounted) return null;

  if (!isOpen) return null;

  return (
    <>
      {/* Dark overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-80 bg-white shadow-lg overflow-y-auto">
        {/* Header */}
        <div className="flex items-center p-4 bg-[#232f3e] text-white">
          <span className="text-xl font-bold flex-1">Shop By Category</span>
          <Button 
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-[#3a4553]"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
        
        {/* Categories list */}
        <div className="py-2">
          {categories.map((category, index) => (
            <div key={index} className="border-b">
              <Link href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}>
                <a className="flex items-center justify-between p-3 hover:bg-gray-100">
                  <div className="flex items-center">
                    <span className="mr-3 text-xl">{category.icon}</span>
                    <span>{category.name}</span>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                </a>
              </Link>
              
              {/* Subcategories */}
              <div className="bg-gray-50 pl-8 pr-4 py-1">
                {category.subcategories.map((subcategory, subIndex) => (
                  <Link 
                    key={subIndex} 
                    href={`/subcategories/${subcategory.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <a className="block py-2 text-sm text-gray-700 hover:text-blue-600">
                      {subcategory}
                    </a>
                  </Link>
                ))}
                
                <Link 
                  href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <a className="block py-2 text-sm text-blue-600 font-medium">
                    See all in {category.name}
                  </a>
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Footer */}
        <div className="p-4 bg-gray-50 border-t">
          <div className="text-center">
            <Link href="/categories">
              <a className="text-blue-600 hover:underline font-semibold">
                See All Categories
              </a>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}