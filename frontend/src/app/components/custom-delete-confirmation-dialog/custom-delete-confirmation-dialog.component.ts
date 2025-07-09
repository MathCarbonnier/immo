import { Component, Input } from '@angular/core';
import { Bien } from '../../models/bien.model';
import { getImageSrcFromBase64 } from '../../utils/image.utils';
import { DialogRef } from '../../services/dialog.service';

@Component({
  selector: 'app-custom-delete-confirmation-dialog',
  templateUrl: './custom-delete-confirmation-dialog.component.html',
  styleUrls: ['./custom-delete-confirmation-dialog.component.css']
})
export class CustomDeleteConfirmationDialogComponent {
  @Input() data: { biens: Bien[] } = { biens: [] };
  dialogRef!: DialogRef<boolean>;

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