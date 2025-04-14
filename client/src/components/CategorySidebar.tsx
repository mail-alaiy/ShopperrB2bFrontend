import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCategories } from "@/hooks/use-categories";

interface CategorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CategorySidebar({
  isOpen,
  onClose,
}: CategorySidebarProps) {
  const [mounted, setMounted] = useState(false);
  const { categories, isLoading } = useCategories();

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

  // If not mounted yet (SSR), don't render anything
  if (!mounted) return null;

  if (!isOpen) return null;

  console.log(categories);

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
        <div className="flex items-center p-4 bg-[#06184b] text-white">
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
          {isLoading ? (
            <div className="p-4 text-center">Loading categories...</div>
          ) : (
            categories?.map((category) => (
              <div key={category._id.$oid} className="border-b">
                <Link
                  href={`/categories/${category.category
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`}
                >
                  <a className="flex items-center justify-between p-3 hover:bg-gray-100">
                    <div className="flex items-center">
                      <span>{category.category}</span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-500" />
                  </a>
                </Link>

                {/* Subcategories */}
                <div className="bg-gray-50 pl-8 pr-4 py-1">
                  {category.subCategory &&
                    category.subCategory.map((sub) => (
                      <div key={sub.name}>
                        {/* Main subcategory */}
                        <Link
                          href={`/subcategories/${sub.name
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                        >
                          <a className="block py-2 text-sm font-medium text-gray-700 hover:text-blue-600">
                            {sub.name}
                          </a>
                        </Link>

                        {/* Sub-subcategories */}
                        {/* {sub.subCategory &&
                          sub.subCategory.map((subSub) => (
                            <Link
                              key={subSub.name}
                              href={`/subcategories/${subSub.name
                                .toLowerCase()
                                .replace(/\s+/g, "-")}`}
                            >
                              <a className="block py-1 pl-4 text-sm text-gray-600 hover:text-blue-600">
                                {subSub.name}
                              </a>
                            </Link>
                          ))} */}
                      </div>
                    ))}

                  <Link
                    href={`/categories/${category.category
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    <a className="block py-2 text-sm text-blue-600 font-medium">
                      See all in {category.category}
                    </a>
                  </Link>
                </div>
              </div>
            ))
          )}
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
