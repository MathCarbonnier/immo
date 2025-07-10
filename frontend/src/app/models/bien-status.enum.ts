/**
 * Enum representing the status of a real estate property.
 * This corresponds to the Status enum in the backend.
 */
export enum BienStatus {
  A_VENDRE = 'A_VENDRE',
  EN_COURS_DE_VENTE = 'EN_COURS_DE_VENTE',
  VENDU = 'VENDU'
}

/**
 * Helper function to get the display label for a status.
 */
export function getBienStatusLabel(status: BienStatus): string {
  switch (status) {
    case BienStatus.A_VENDRE:
      return 'À vendre';
    case BienStatus.EN_COURS_DE_VENTE:
      return 'En cours de vente';
    case BienStatus.VENDU:
      return 'Vendu';
    default:
      return 'Unknown';
  }
}