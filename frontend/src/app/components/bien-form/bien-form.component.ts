import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Bien, ImageBien } from '../../models/bien.model';
import { BienService } from '../../services/bien.service';

@Component({
  selector: 'app-bien-form',
  templateUrl: './bien-form.component.html',
  styleUrls: ['./bien-form.component.css']
})
export class BienFormComponent implements OnInit {
  bienForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  imagePreviews: ImageBien[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private bienService: BienService,
    private router: Router
  ) {
    this.bienForm = this.formBuilder.group({
      titre: ['', [Validators.required]],
      surface: ['', [Validators.required, Validators.min(1)]],
      prix: ['', [Validators.required, Validators.min(1)]],
      description: [''],
      images: this.formBuilder.array([])
    });
  }

  // Getter for the images FormArray
  get images(): FormArray {
    return this.bienForm.get('images') as FormArray;
  }

  ngOnInit(): void {
    // Component initialization logic
  }

  // Convenience getter for easy access to form fields
  get f() { return this.bienForm.controls; }

  onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.bienForm.invalid) {
      return;
    }

    this.loading = true;

    const newBien: Bien = {
      titre: this.f['titre'].value,
      surface: this.f['surface'].value,
      prix: this.f['prix'].value,
      description: this.f['description'].value,
      image: this.imagePreview // Use the base64 image string
    };

    this.bienService.createBien(newBien).subscribe({
      next: () => {
        this.router.navigate(['/biens']);
      },
      error: error => {
        console.error('Error details:', error);
        this.error = 'Error creating property: ' + (error.message || error) + ' - Status: ' + (error.status || 'unknown');
        this.loading = false;
      }
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length) {
      const file = input.files[0];

      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        this.error = 'Please select an image file';
        return;
      }

      // Check file size (limit to 1MB)
      const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
      if (file.size > maxSizeInBytes) {
        this.error = 'Image file is too large. Please select an image smaller than 1MB.';
        return;
      }

      console.log('File type:', file.type);
      console.log('File size:', file.size, 'bytes');

      // Convert image to base64
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.imagePreview = base64String;

        console.log('Image loaded successfully, length:', base64String.length);
      };
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        this.error = 'Error reading file';
      };
      reader.readAsDataURL(file);
    }
  }

  cancelForm(): void {
    this.router.navigate(['/biens']);
  }
}
