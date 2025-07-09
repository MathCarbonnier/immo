import { Component, Inject } from '@angular/core';
import { Bien } from '../../models/bien.model';
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

  getImageSrc(imageData: string | undefined | null): string {
    return getImageSrcFromBase64(imageData);
  }
}