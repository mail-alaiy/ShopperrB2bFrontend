import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import ProductDetail from "@/components/ProductDetail";
import ProductDetailTabs from "@/components/ProductDetailTabs";
import RelatedProductsSection from "@/components/RelatedProductsSection";
import FrequentlyBoughtTogether from "@/components/FrequentlyBoughtTogether";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

// Add this constant for the S3 bucket URL
const S3_BUCKET_FILE_URL = "https://shopperrcdn.shopperr.in";

// --- Add Interfaces here or import them ---
interface RelatedProductImage {
  position: number;
  src: string;
  varient_id: string;
}

interface RelatedProductItem {
  _id: string;
  objectID: string;
  name: string;
  handle: string;
  imgUrl: RelatedProductImage[];
  sp: number;
  mrp: number;
}

interface RelatedProductResponse {
  message: string;
  payload: RelatedProductItem[];
}
// --- End Interfaces ---

export default function ProductPage() {
  const { id } = useParams();
  const productId = id || "0";

  // --- Query for Main Product Details ---
  const {
    data: productData,
    isLoading: isLoadingProduct, // Rename for clarity
    error: productError, // Rename for clarity
   } = useQuery({
    queryKey: [`/product/${productId}`],
    enabled: !!productId && productId !== "0", // Ensure productId is valid
    queryFn: () =>
      fetch(`${import.meta.env.VITE_REACT_APP_PRODUCTS_API_URL}/product/${productId}`).then((res) => {
         if (!res.ok) {
            throw new Error(`Failed to fetch product: ${res.status} ${res.statusText}`);
         }
         return res.json();
      }),
      retry: 1, // Optional: Retry once on failure
  });

  // --- Query for Related Products ---
  const {
    data: relatedData,
    isLoading: isLoadingRelated, // Rename for clarity
    error: relatedError, // Rename for clarity
  } = useQuery<RelatedProductResponse>({ // Add type annotation
    queryKey: [`related-products`, productId],
    enabled: !!productId && productId !== "0", // Only run if main product ID exists
    queryFn: () =>
      fetch(`${import.meta.env.VITE_REACT_APP_PRODUCTS_API_URL}/recommend/${productId}`).then((res) => {
          if (!res.ok) {
             throw new Error(`Failed to fetch related products: ${res.status} ${res.statusText}`);
          }
          return res.json();
      }),
    retry: 1, // Optional: Retry once on failure
    staleTime: 1000 * 60 * 5, // Optional: Cache for 5 minutes
  });

  // Parse variable pricing data into price tiers expected by ProductDetail
  const parsePriceTiers = (variablePricing: any[]) => {
    if (!variablePricing || !Array.isArray(variablePricing) || variablePricing.length === 0) {
      return [];
    }

    return variablePricing.map(tier => {
      const key = Object.keys(tier)[0];
      const price = tier[key];

      if (key.includes('>')) {
        const minQuantity = parseInt(key.replace('>', ''), 10); // Add radix
        return { minQuantity, maxQuantity: 999999, price };
      } else if (key.includes('-')) {
        const [min, max] = key.split('-').map(n => parseInt(n, 10)); // Add radix
        return { minQuantity: min, maxQuantity: max, price };
      }
      return null; // Return null for invalid formats
    }).filter((item): item is { minQuantity: number; maxQuantity: number; price: number } => item !== null); // Type guard filter
  };

  const product = productData?.payload;
  const priceTiers = product ? parsePriceTiers(product.variable_pricing) : [];
  const isLoadingPriceTiers = isLoadingProduct;
  const options = product?.options;
  const varients = product?.varients;
  const relatedProducts = relatedData?.payload; // Get related products

  console.log(options, varients);

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

  if (isLoadingProduct) {
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
        <div className="mt-12 pt-6 border-t">
          <Skeleton className="h-8 w-1/4 mb-4" />
          <div className="flex space-x-4 overflow-hidden pb-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-44 flex-shrink-0 border rounded-lg p-2">
                <Skeleton className="h-36 w-full mb-2 rounded" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4 mb-2" />
                <Skeleton className="h-5 w-1/2 mb-2"/>
                <Skeleton className="h-7 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (productError || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive" className="max-w-3xl mx-auto mt-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {productError?.message || "Failed to load product details. Please try again later."}
          </AlertDescription>
        </Alert>
      </div>
    );
  }
  // console.log(product);
  // Transform API data to match component expectations
  const transformedProduct = {
    id: product._id, // Assuming _id is directly accessible
    name: product.name,
    category: product.category,
    description: product.description,
    regularPrice: product.mrp,
    salePrice: product.sp,
    images: Array.isArray(product.imgUrl) ? product.imgUrl.map(
      (img: RelatedProductImage) =>
        `${S3_BUCKET_FILE_URL}/${img.src.endsWith(',') ? img.src.slice(0, -1) : img.src}${
          (img.src.endsWith(".png") || img.src.includes('.')) ? "" : ".png"
        }`
    ) : [],
    brand: product.pd_brand || "Generic",
    rating: 4.5, // Example default
    ratingCount: 120, // Example default
    features: [
      product.weight && `Weight: ${product.weight} grams`,
      product.code && `Product Code: ${product.code}`,
      product.hsn && `HSN Code: ${product.hsn}`,
    ].filter(Boolean) as string[],
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
        priceTiers={priceTiers}
        isLoadingPriceTiers={false}
        options={options}
        varients={varients}
      />

      {/* Product Detail Tabs */}
      <ProductDetailTabs product={transformedProduct} />

      {/* Related Products Section */}
      <RelatedProductsSection
        products={relatedProducts}
        isLoading={isLoadingRelated}
        error={relatedError as Error | null}
      />

      {/* Frequently Bought Together */}
      {/* <FrequentlyBoughtTogether productId={productId} /> */}
    </div>
  );
}
