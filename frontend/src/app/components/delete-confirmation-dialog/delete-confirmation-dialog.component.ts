import { Component, Inject } from '@angular/core';
import { Bien, ImageBien } from '../../models/bien.model';
import { getImageSrcFromBase64 } from '../../utils/image.utils';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['./delete-confirmation-dialog.component.css']
})
export class DeleteConfirmationDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { biens: Bien[] }
  ) {}

  onCancelClick(): void {
    this.dialogRef.close(false);
  }

  onConfirmClick(): void {
    this.dialogRef.close(true);
  }

  getImageSrc(bien: Bien): string {
    // If the property has images, try to find a FACADE image first
    if (bien.images && bien.images.length > 0) {
      // Try to find a FACADE image
      const facadeImages = bien.images.filter(img => img.type === 'FACADE');
      if (facadeImages.length > 0) {
        return getImageSrcFromBase64(facadeImages[0].base64);
      }

      // If no FACADE image, use the first image
      return getImageSrcFromBase64(bien.images[0].base64);
    }

    // No fallback to old image field as it no longer exists
    // No image found
    return getImageSrcFromBase64(null);
  }
}
