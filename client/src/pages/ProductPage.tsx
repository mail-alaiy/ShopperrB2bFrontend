import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import ProductDetail from "@/components/ProductDetail";
import ProductDetailTabs from "@/components/ProductDetailTabs";
import RelatedProducts from "@/components/RelatedProducts";
import FrequentlyBoughtTogether from "@/components/FrequentlyBoughtTogether";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ProductPage() {
  const { id } = useParams();
  const productId = id || "0";

  const { data, isLoading, error } = useQuery({
    queryKey: [`/product/${productId}`],
    enabled: productId !== "0",
    queryFn: () =>
      fetch(`http://localhost:8002/product/${productId}`).then((res) =>
        res.json()
      ),
  });

  const product = data?.payload;

  const { data: priceTiers, isLoading: isLoadingPriceTiers } = useQuery({
    queryKey: [`/api/products/${productId}/price-tiers`],
    enabled: !!product,
  });

  // Build breadcrumb items
  const breadcrumbs = product
    ? [
        { label: "Home", url: "/" },
        {
          label: product.category || "Category",
          url: `/categories/${encodeURIComponent(product.category || "")}`,
        },
        { label: product.name, url: "#" },
      ]
    : [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="h-6 mb-4">
          <Skeleton className="h-6 w-1/2" />
        </div>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/5">
            <Skeleton className="h-96 w-full" />
            <div className="grid grid-cols-5 gap-2 mt-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
          <div className="md:w-3/5">
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/3 mb-8" />
            <div className="space-y-2 mb-8">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            <Skeleton className="h-64 w-full mb-8" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-3xl mx-auto mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load product details. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Transform API data to match component expectations
  const transformedProduct = {
    id: product._id.$oid,
    name: product.name,
    category: product.category,
    description: product.description,
    regularPrice: product.mrp,
    salePrice: product.sp,
    images: product.imgUrl.map((img: any) => ({
      src: img.src,
      alt: product.name,
    })),
    brand: product.pd_brand || "Generic",
    rating: 4.5, // Example default
    ratingCount: 120, // Example default
    variations: [],
    features: [
      `Weight: ${product.weight} grams`,
      `Dimensions: ${product.length}L × ${product.width}B × ${product.height}H`,
      `Location: ${product.pd_location || "Not specified"}`,
      `Product Code: ${product.code}`,
      `HSN Code: ${product.hsn}`,
    ].filter((feature) => !feature.includes("undefined")),
  };

  return (
    <div className="container mx-auto px-4 py-2">
      {/* Breadcrumb navigation */}
      {/* <nav className="text-sm text-gray-500 mb-4">
        <ol className="list-none p-0 inline-flex">
          {breadcrumbs.map((crumb, index) => (
            <li key={index} className="flex items-center">
              <a href={crumb.url} className="hover:underline">
                {crumb.label}
              </a>
              {index < breadcrumbs.length - 1 && (
                <span className="mx-2 text-xs">/</span>
              )}
            </li>
          ))}
        </ol>
      </nav> */}

      {/* Product Details */}
      <ProductDetail
        product={transformedProduct}
        priceTiers={priceTiers || []}
        isLoadingPriceTiers={isLoadingPriceTiers}
      />

      {/* Product Detail Tabs */}
      <ProductDetailTabs product={transformedProduct} />

      {/* Related Products */}
      {/* <RelatedProducts productId={productId} /> */}

      {/* Frequently Bought Together */}
      {/* <FrequentlyBoughtTogether productId={productId} /> */}
    </div>
  );
}
