/**
 * Utility functions for handling images in the application.
 */

/**
 * Converts a base64 string to a proper image source URL.
 * If the string already has a data URL prefix, it returns it as is.
 * If the string is a base64 encoded image without prefix, it adds the appropriate prefix.
 * If the string is empty or null, it returns a placeholder image URL.
 * 
 * @param imageData The base64 string or data URL
 * @param placeholderUrl Optional placeholder URL to use when imageData is empty
 * @returns A properly formatted image source URL
 */
export function getImageSrcFromBase64(
  imageData: string | undefined | null,
  placeholderUrl: string = 'https://via.placeholder.com/400x300?text=Pas+d%27image'
): string {
  if (!imageData) {
    return placeholderUrl;
  }

  // Check if the image already has a data URL prefix
  if (imageData.startsWith('data:')) {
    return imageData;
  }

  // Add the data URL prefix if it's missing
  return `data:image/jpeg;base64,${imageData}`;
}