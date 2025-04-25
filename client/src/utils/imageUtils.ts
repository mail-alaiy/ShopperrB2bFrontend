// Define or import from a constants file
export const S3_BUCKET_FILE_URL = "https://shopperrcdn.shopperr.in";

/**
 * Checks if an image URL is accessible by trying to load it.
 * @param url The URL of the image to check.
 * @returns Promise<boolean> True if the image loads successfully within the timeout, false otherwise.
 */
export const checkImageExists = (url: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (!url || url === "/placeholder-image.jpg") {
      // Immediately resolve false for invalid or placeholder URLs
      resolve(false);
      return;
    }
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    // Timeout to prevent hanging
    setTimeout(() => {
        // Check if already resolved, if not, resolve false
        resolve(false);
    }, 5000); // 5 second timeout
  });
};

/**
 * Constructs the full image URL, prefixing with the S3 bucket URL if necessary.
 * @param imagePath The path or URL from the product data.
 * @returns The full image URL or a placeholder URL.
 */
export const getFullImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) return "/placeholder-image.jpg";
  if (imagePath.startsWith("http")) return imagePath;
  // Assuming .png is the correct extension, adjust if needed based on your data
  return `${S3_BUCKET_FILE_URL}/${imagePath}`;
}; 