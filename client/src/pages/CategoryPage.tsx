import React, { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  StarIcon, 
  StarHalfIcon, 
  ShoppingCartIcon, 
  FilterIcon, 
  ChevronDownIcon 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Checkbox
} from '@/components/ui/checkbox';

export default function CategoryPage() {
  const [match, params] = useRoute('/categories/:category');
  const category = params?.category || '';
  const [sortBy, setSortBy] = useState('featured');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Format category name for display
  const formatCategoryName = (name: string) => {
    return name
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  const displayCategory = formatCategoryName(category);
  
  const { data: products, isLoading } = useQuery({
    queryKey: [`/api/categories/${category}/products`],
  });
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link href="/">
          <a className="hover:text-blue-600 hover:underline">Home</a>
        </Link>
        <span className="mx-2">/</span>
        <span className="font-medium text-gray-700">{displayCategory}</span>
      </div>
      
      {/* Category Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{displayCategory}</h1>
        <p className="text-gray-600 mt-1">
          Shop our selection of {displayCategory.toLowerCase()} for your business needs
        </p>
      </div>
      
      {/* Filters and Sort */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="md:hidden">
          <Button 
            variant="outline" 
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-between"
          >
            <span className="flex items-center">
              <FilterIcon className="w-4 h-4 mr-2" />
              Filters
            </span>
            <ChevronDownIcon 
              className={`w-4 h-4 transition-transform ${showMobileFilters ? 'transform rotate-180' : ''}`} 
            />
          </Button>
        </div>
        
        <div className={`${showMobileFilters ? 'block' : 'hidden'} md:block md:w-1/4 lg:w-1/5`}>
          <div className="border rounded-md p-4 bg-white">
            <h3 className="font-bold text-lg mb-4">Filters</h3>
            
            <Accordion type="multiple" defaultValue={['price', 'brands', 'rating']}>
              <AccordionItem value="price">
                <AccordionTrigger className="text-base font-medium py-2">Price</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox id="price-1" />
                      <label htmlFor="price-1" className="ml-2 text-sm">Under $25</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="price-2" />
                      <label htmlFor="price-2" className="ml-2 text-sm">$25 to $50</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="price-3" />
                      <label htmlFor="price-3" className="ml-2 text-sm">$50 to $100</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="price-4" />
                      <label htmlFor="price-4" className="ml-2 text-sm">$100 to $200</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="price-5" />
                      <label htmlFor="price-5" className="ml-2 text-sm">$200 & Above</label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="brands">
                <AccordionTrigger className="text-base font-medium py-2">Brands</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox id="brand-1" />
                      <label htmlFor="brand-1" className="ml-2 text-sm">Logitech</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="brand-2" />
                      <label htmlFor="brand-2" className="ml-2 text-sm">Microsoft</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="brand-3" />
                      <label htmlFor="brand-3" className="ml-2 text-sm">Dell</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="brand-4" />
                      <label htmlFor="brand-4" className="ml-2 text-sm">HP</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="brand-5" />
                      <label htmlFor="brand-5" className="ml-2 text-sm">Apple</label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="rating">
                <AccordionTrigger className="text-base font-medium py-2">Customer Rating</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox id="rating-4" />
                      <label htmlFor="rating-4" className="ml-2 text-sm flex items-center">
                        <span className="flex text-amber-400 mr-1">
                          {[...Array(4)].map((_, i) => (
                            <StarIcon key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </span>
                        & Up
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="rating-3" />
                      <label htmlFor="rating-3" className="ml-2 text-sm flex items-center">
                        <span className="flex text-amber-400 mr-1">
                          {[...Array(3)].map((_, i) => (
                            <StarIcon key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </span>
                        & Up
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="rating-2" />
                      <label htmlFor="rating-2" className="ml-2 text-sm flex items-center">
                        <span className="flex text-amber-400 mr-1">
                          {[...Array(2)].map((_, i) => (
                            <StarIcon key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </span>
                        & Up
                      </label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox id="rating-1" />
                      <label htmlFor="rating-1" className="ml-2 text-sm flex items-center">
                        <span className="flex text-amber-400 mr-1">
                          {[...Array(1)].map((_, i) => (
                            <StarIcon key={i} className="w-4 h-4 fill-current" />
                          ))}
                        </span>
                        & Up
                      </label>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        
        <div className="md:w-3/4 lg:w-4/5">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-600">
              {isLoading ? 'Loading...' : `${products?.length || 0} results for "${displayCategory}"`}
            </p>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2 hidden sm:inline">Sort by:</span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Avg. Customer Review</SelectItem>
                  <SelectItem value="newest">Newest Arrivals</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="border rounded-md p-4">
                  <Skeleton className="h-48 w-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-4" />
                  <Skeleton className="h-6 w-1/3 mb-2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products?.map((product) => (
                <div key={product.id} className="border rounded-md p-4 hover:shadow-md transition duration-200">
                  <Link href={`/products/${product.id}`}>
                    <a className="block">
                      <div className="h-48 flex items-center justify-center mb-4">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="max-h-full max-w-full object-contain" 
                        />
                      </div>
                      <h3 className="text-lg font-semibold text-blue-600 hover:underline mb-1 line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex text-amber-400 mb-2">
                        {[...Array(Math.floor(product.rating))].map((_, i) => (
                          <StarIcon key={i} className="w-4 h-4 fill-current" />
                        ))}
                        {product.rating % 1 >= 0.5 && (
                          <StarHalfIcon className="w-4 h-4 fill-current" />
                        )}
                        <span className="text-gray-500 text-sm ml-1">({product.ratingCount})</span>
                      </div>
                      <div className="mb-3">
                        <span className="text-gray-500 line-through text-sm mr-2">${product.regularPrice.toFixed(2)}</span>
                        <span className="text-lg font-bold">${product.salePrice.toFixed(2)}</span>
                        {product.regularPrice > product.salePrice && (
                          <span className="text-green-600 text-sm ml-2">
                            Save {Math.round((1 - product.salePrice / product.regularPrice) * 100)}%
                          </span>
                        )}
                      </div>
                    </a>
                  </Link>
                  <Button className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900">
                    <ShoppingCartIcon className="w-4 h-4 mr-2" />
                    Add to Cart
                  </Button>
                </div>
              ))}
              
              {products?.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-xl text-gray-600">No products found in this category.</p>
                  <p className="mt-2 text-gray-500">Try adjusting your filters or check out our other categories.</p>
                  <Link href="/">
                    <a>
                      <Button className="mt-4">
                        Continue Shopping
                      </Button>
                    </a>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}