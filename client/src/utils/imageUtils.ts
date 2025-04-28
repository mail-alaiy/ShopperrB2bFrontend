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
 * Constructs the full image URL, prefixing with the S3 bucket URL if necessary,
 * and ensures the path ends with .png. Handles trailing commas.
 * @param imagePath The path or URL from the product data.
 * @returns The full image URL or a placeholder URL.
 */
export const getFullImageUrl = (imagePath: string | undefined | null): string => {
  if (!imagePath) {
    return "/placeholder-image.jpg"; // Handle null, undefined, or empty string
  }

  if (imagePath.startsWith("http")) {
    // If it's already a full URL, return it directly.
    // We assume external URLs are correctly formatted.
    return imagePath;
  }

  // Clean the path: remove trailing comma if present
  let cleanedPath = imagePath.trim(); // Trim whitespace just in case
  if (cleanedPath.endsWith('.')) {
    cleanedPath = cleanedPath.slice(0, -1); // Remove the last character (comma)
  }

  // Ensure the cleaned path ends with .png
  const finalPath = cleanedPath.endsWith('.png')
    ? cleanedPath
    : cleanedPath + '.png';

  return `${S3_BUCKET_FILE_URL}/${finalPath}`;
}; 