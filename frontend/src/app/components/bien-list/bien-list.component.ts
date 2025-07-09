import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Bien } from '../../models/bien.model';
import { BienService } from '../../services/bien.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteConfirmationDialogComponent } from '../delete-confirmation-dialog/delete-confirmation-dialog.component';

@Component({
  selector: 'app-bien-list',
  templateUrl: './bien-list.component.html',
  styleUrls: ['./bien-list.component.css']
})
export class BienListComponent implements OnInit {
  biens: Bien[] = [];
  selectedBiens: number[] = [];
  deleteMode = false;
  loading = true;
  error = false;

  constructor(
    private bienService: BienService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBiens();
  }

  loadBiens(): void {
    this.loading = true;
    this.error = false;

    this.bienService.getAllBiens().subscribe({
      next: (data) => {
        this.biens = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading properties', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  toggleDeleteMode(): void {
    this.deleteMode = !this.deleteMode;
    if (!this.deleteMode) {
      this.selectedBiens = [];
    }
  }

  toggleSelectBien(id: number): void {
    const index = this.selectedBiens.indexOf(id);
    if (index === -1) {
      this.selectedBiens.push(id);
    } else {
      this.selectedBiens.splice(index, 1);
    }
  }

  isSelected(id: number): boolean {
    return this.selectedBiens.includes(id);
  }

  deleteSelected(): void {
    if (this.selectedBiens.length === 0) return;

    // Get the selected properties to display in the dialog
    const selectedProperties = this.biens.filter(bien => 
      this.selectedBiens.includes(bien.id!)
    );

    // Open the confirmation dialog
    const dialogRef = this.dialog.open(DeleteConfirmationDialogComponent, {
      width: '600px',
      data: { biens: selectedProperties }
    });

    // Handle the dialog result
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // User confirmed deletion
        // Create a counter to track completed deletions
        let completedCount = 0;
        let hasError = false;

        // Process each deletion
        this.selectedBiens.forEach(id => {
          this.bienService.deleteBien(id).subscribe({
            next: () => {
              completedCount++;
              // When all deletions are complete, reload the list
              if (completedCount === this.selectedBiens.length && !hasError) {
                this.loadBiens();
                this.selectedBiens = [];
                this.deleteMode = false;
              }
            },
            error: (err) => {
              hasError = true;
              console.error(`Error deleting property ${id}`, err);
              alert('Une erreur est survenue lors de la suppression des biens.');
            }
          });
        });
      }
    });
  }

  navigateToNew(): void {
    this.router.navigate(['/biens/new']);
  }
}
