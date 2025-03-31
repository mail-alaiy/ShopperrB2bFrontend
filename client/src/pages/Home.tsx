import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  StarIcon, 
  StarHalfIcon, 
  ShoppingCartIcon, 
  LaptopIcon, 
  PrinterIcon, 
  MonitorIcon, 
  HeadphonesIcon, 
  KeyboardIcon, 
  MouseIcon, 
  HardDriveIcon, 
  BarChartIcon, 
  BriefcaseIcon, 
  PackageIcon,
  ChevronRightIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function Home() {
  const { data: products, isLoading } = useQuery({
    queryKey: ["/api/products"],
  });

  // Define category items
  const categories = [
    { name: "Computers", icon: <LaptopIcon className="h-10 w-10" />, url: "/categories/computers" },
    { name: "Monitors", icon: <MonitorIcon className="h-10 w-10" />, url: "/categories/monitors" },
    { name: "Printers", icon: <PrinterIcon className="h-10 w-10" />, url: "/categories/printers" },
    { name: "Keyboards", icon: <KeyboardIcon className="h-10 w-10" />, url: "/categories/keyboards" },
    { name: "Mice", icon: <MouseIcon className="h-10 w-10" />, url: "/categories/mice" },
    { name: "Headphones", icon: <HeadphonesIcon className="h-10 w-10" />, url: "/categories/headphones" },
    { name: "Storage", icon: <HardDriveIcon className="h-10 w-10" />, url: "/categories/storage" },
    { name: "Office Supplies", icon: <BriefcaseIcon className="h-10 w-10" />, url: "/categories/office-supplies" }
  ];

  // Carousel images
  const carouselImages = [
    {
      url: "/categories/business-deals",
      src: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      title: "Business Essentials",
      subtitle: "Everything you need to boost productivity"
    },
    {
      url: "/categories/keyboards",
      src: "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      title: "Keyboard & Mice Collection",
      subtitle: "Ergonomic designs for all-day comfort"
    },
    {
      url: "/categories/monitors",
      src: "https://images.unsplash.com/photo-1547119957-637f8679db1e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      title: "Display Solutions",
      subtitle: "Ultra-wide monitors for multitasking"
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Carousel */}
        <div className="mb-8">
          <Carousel className="rounded-xl overflow-hidden">
            <CarouselContent>
              {carouselImages.map((item, index) => (
                <CarouselItem key={index}>
                  <Link href={item.url}>
                    <a className="relative block h-72 md:h-96 w-full">
                      <img 
                        src={item.src} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                        <h2 className="text-2xl md:text-4xl font-bold mb-2">{item.title}</h2>
                        <p className="text-lg">{item.subtitle}</p>
                        <Button 
                          className="mt-4 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold"
                        >
                          Shop Now
                        </Button>
                      </div>
                    </a>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>

        {/* Amazon-style Content Blocks */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Pick up where you left off */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold mb-4">Pick up where you left off</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {products?.slice(0, 4).map((product, index) => (
                <Link key={`pickup-${index}`} href={`/products/${product.id}`}>
                  <a className="block">
                    <div className="h-24 flex items-center justify-center bg-gray-50 p-2 mb-1 border border-gray-100">
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="max-h-full max-w-full object-contain" 
                      />
                    </div>
                    <p className="text-xs text-gray-800 line-clamp-2">
                      {product.name.split(' ').slice(0, 5).join(' ')}...
                    </p>
                  </a>
                </Link>
              ))}
            </div>
            
            <div className="mt-3">
              <Link href="/history">
                <a className="text-xs text-blue-600 hover:text-blue-800 hover:underline">
                  See more
                </a>
              </Link>
            </div>
          </div>
          
          {/* Continue shopping deals */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold mb-4">Continue shopping deals</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {products?.slice(0, 4).map((product, index) => (
                <Link key={`deals-${index}`} href={`/products/${product.id}`}>
                  <a className="block">
                    <div className="h-24 flex items-center justify-center bg-gray-50 p-2 mb-1 border border-gray-100">
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="max-h-full max-w-full object-contain" 
                      />
                    </div>
                    <p className="text-xs text-gray-800 line-clamp-2">
                      {product.name.split(' ').slice(0, 5).join(' ')}...
                    </p>
                  </a>
                </Link>
              ))}
            </div>
            
            <div className="mt-3">
              <Link href="/deals">
                <a className="text-xs text-blue-600 hover:text-blue-800 hover:underline">
                  See all deals
                </a>
              </Link>
            </div>
          </div>
          
          {/* Buy again */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h2 className="text-lg font-bold mb-4">Buy again</h2>
            
            <div className="grid grid-cols-2 gap-3">
              {products?.slice(0, 4).map((product, index) => (
                <Link key={`buyagain-${index}`} href={`/products/${product.id}`}>
                  <a className="block">
                    <div className="h-24 flex items-center justify-center bg-gray-50 p-2 mb-1 border border-gray-100">
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="max-h-full max-w-full object-contain" 
                      />
                    </div>
                    <p className="text-xs text-gray-800 line-clamp-2">
                      {product.name.split(' ').slice(0, 5).join(' ')}...
                    </p>
                  </a>
                </Link>
              ))}
            </div>
            
            <div className="mt-3">
              <Link href="/buy-again">
                <a className="text-xs text-blue-600 hover:text-blue-800 hover:underline">
                  More in Buy Again
                </a>
              </Link>
            </div>
          </div>
          
          {/* Get bulk discounts */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-col">
            <h2 className="text-lg font-bold mb-2">Get bulk discounts + Top B2B deals !!</h2>
            
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-orange-500 p-4 inline-block rounded mb-3">
                  <p className="text-white font-bold text-xl">amazon</p>
                  <p className="text-white text-sm">business</p>
                </div>
                
                <div>
                  <Button className="text-sm bg-blue-600 hover:bg-blue-700 py-1 px-4 h-auto">
                    Register now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Selling Items */}
        <div className="mb-12 bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Top Selling Items</h2>
            <Link href="/top-selling">
              <a className="text-blue-600 hover:underline text-sm flex items-center">
                See all <ChevronRightIcon className="w-4 h-4 ml-1" />
              </a>
            </Link>
          </div>
          
          <div className="relative">
            <div className="flex space-x-4 overflow-x-auto pb-4 custom-scrollbar">
              {products?.slice(0, 8).map((product, index) => (
                <div key={`top-selling-${index}`} className="flex-none w-40">
                  <Link href={`/products/${product.id}`}>
                    <a className="block group">
                      <div className="h-40 w-40 bg-gray-50 flex items-center justify-center p-2 mb-2 border border-gray-100">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <h3 className="text-sm text-gray-800 line-clamp-2 group-hover:text-blue-600">
                        {product.name}
                      </h3>
                      <div className="mt-1 flex items-baseline">
                        <span className="font-bold text-sm">${product.salePrice.toFixed(2)}</span>
                        <span className="text-xs text-green-600 ml-1">
                          ({Math.round((1 - product.salePrice / product.regularPrice) * 100)}% off)
                        </span>
                      </div>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Featured Deals Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Featured Business Deals</h2>
            <Link href="/deals">
              <a className="text-blue-600 hover:underline text-sm flex items-center">
                View all deals <ChevronRightIcon className="w-4 h-4 ml-1" />
              </a>
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-3" />
                    <Skeleton className="h-5 w-2/3 mb-3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {products?.map((product) => (
                <div key={product.id} className="group border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 bg-white">
                  <Link href={`/products/${product.id}`}>
                    <a className="block">
                      <div className="relative">
                        <div className="h-48 flex items-center justify-center p-4 bg-gray-50 group-hover:bg-gray-100 transition-colors">
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="max-h-full max-w-full object-contain transform group-hover:scale-105 transition-transform duration-300" 
                          />
                        </div>
                        
                        {/* Discount badge */}
                        {product.regularPrice > product.salePrice && (
                          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                            {Math.round((1 - product.salePrice / product.regularPrice) * 100)}% OFF
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1 line-clamp-2">
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
                          <div className="flex items-baseline">
                            <span className="text-lg font-bold text-gray-900">${product.salePrice.toFixed(2)}</span>
                            {product.regularPrice > product.salePrice && (
                              <span className="text-gray-500 line-through text-sm ml-2">${product.regularPrice.toFixed(2)}</span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            Volume pricing available
                          </div>
                        </div>
                      </div>
                    </a>
                  </Link>
                  
                  <div className="px-4 pb-4">
                    <Button className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-medium">
                      <ShoppingCartIcon className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Recommended Section - Enhanced */}
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 mt-12 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recommended For You</h2>
            <Link href="/recommendations">
              <a className="text-blue-600 hover:underline flex items-center">
                See all recommendations <ChevronRightIcon className="w-4 h-4 ml-1" />
              </a>
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-sm p-3">
                  <Skeleton className="h-32 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {products?.slice(0, 6).map((product) => (
                <div key={`rec-${product.id}`} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300">
                  <Link href={`/products/${product.id}`}>
                    <a className="block p-3">
                      <div className="h-32 flex items-center justify-center mb-3 bg-white">
                        <img 
                          src={product.images[0]} 
                          alt={product.name} 
                          className="max-h-full max-w-full object-contain transform hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <h3 className="text-sm font-medium text-gray-800 hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <div className="flex text-amber-400 text-xs mt-1">
                        {[...Array(Math.floor(product.rating))].map((_, i) => (
                          <StarIcon key={i} className="w-3 h-3 fill-current" />
                        ))}
                        <span className="text-gray-500 text-xs ml-1">({product.ratingCount})</span>
                      </div>
                      <div className="mt-1 flex justify-between items-center">
                        <span className="font-bold text-sm">${product.salePrice.toFixed(2)}</span>
                        <span className="text-xs text-blue-500 whitespace-nowrap">Quick View</span>
                      </div>
                    </a>
                  </Link>
                </div>
              ))}
            </div>
          )}
          
          <div className="mt-6 text-center">
            <Button variant="outline" className="bg-white">
              Explore More Recommendations
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}