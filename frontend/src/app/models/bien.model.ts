// Import the BienStatus enum from the dedicated file
import { BienStatus } from './bien-status.enum';

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
  latitude?: number;
  longitude?: number;
  adresse?: string;
  status: BienStatus;
}
