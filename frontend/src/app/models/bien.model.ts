/**
 * Model representing an image for a real estate property.
 */
export interface ImageBien {
  base64: string;
  type: 'FACADE' | 'AUTRE';
}

/**
 * Model representing a real estate property.
 */
export interface Bien {
  id?: number;
  titre: string;
  surface: number;
  prix: number;
  images?: ImageBien[];
  description?: string;
}
