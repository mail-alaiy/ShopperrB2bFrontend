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

      {/* Category Grid */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category, index) => (
            <Link key={index} href={category.url}>
              <a className="flex flex-col items-center justify-center p-4 border rounded-lg hover:shadow-md transition duration-200 bg-white">
                <div className="mb-3 text-blue-600">
                  {category.icon}
                </div>
                <span className="text-center font-medium">{category.name}</span>
              </a>
            </Link>
          ))}
        </div>
      </div>

      {/* Business Deals Banner */}
      <div className="bg-blue-700 text-white rounded-lg p-6 mb-8 shadow-md">
        <h1 className="text-3xl font-bold mb-2">Welcome to Shopperr B2B</h1>
        <p className="mb-4">Your one-stop shop for business and office supplies</p>
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            variant="secondary" 
            className="bg-amber-400 hover:bg-amber-500 text-blue-900 font-bold"
          >
            Shop Business Deals
          </Button>
          <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
            Learn About Volume Discounts
          </Button>
        </div>
      </div>

      {/* Featured Deals Section */}
      <h2 className="text-2xl font-bold mb-6">Featured Business Deals</h2>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
        </div>
      )}
      
      {/* Recently Viewed & Recommended Section */}
      <div className="border-t pt-8 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recommended For You</h2>
          <Link href="/recommendations">
            <a className="text-blue-600 hover:underline flex items-center">
              See more recommendations <ChevronRightIcon className="w-4 h-4 ml-1" />
            </a>
          </Link>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="border rounded-md p-3">
                <Skeleton className="h-32 w-full mb-2" />
                <Skeleton className="h-4 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products?.slice(0, 6).map((product) => (
              <div key={`rec-${product.id}`} className="border rounded-md p-3 hover:shadow-md transition duration-200">
                <Link href={`/products/${product.id}`}>
                  <a className="block">
                    <div className="h-32 flex items-center justify-center mb-2">
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="max-h-full max-w-full object-contain" 
                      />
                    </div>
                    <h3 className="text-sm font-medium text-blue-600 hover:underline line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex text-amber-400 text-xs mt-1">
                      {[...Array(Math.floor(product.rating))].map((_, i) => (
                        <StarIcon key={i} className="w-3 h-3 fill-current" />
                      ))}
                      <span className="text-gray-500 text-xs ml-1">({product.ratingCount})</span>
                    </div>
                    <div className="mt-1">
                      <span className="font-bold text-sm">${product.salePrice.toFixed(2)}</span>
                    </div>
                  </a>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
