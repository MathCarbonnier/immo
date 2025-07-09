import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
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
    // Initialize with one image field for facade
    this.addImageForm('FACADE');
  }

  // Convenience getter for easy access to form fields
  get f() { return this.bienForm.controls; }

  // Add a new image form group
  addImageForm(type: 'FACADE' | 'AUTRE' = 'FACADE'): void {
    this.images.push(
      this.formBuilder.group({
        base64: ['', Validators.required],
        type: [type, Validators.required]
      })
    );
  }

  // Remove an image form group
  removeImageForm(index: number): void {
    this.images.removeAt(index);
    this.imagePreviews.splice(index, 1);
  }

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
      images: this.imagePreviews
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

  onFileChange(event: Event, index: number, type: 'FACADE' | 'AUTRE'): void {
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

        // Extract the base64 part (after the comma)
        const commaIndex = base64String.indexOf(',');
        const base64Data = commaIndex !== -1 ? base64String.substring(commaIndex + 1) : base64String;

        // Update the form control
        const imageFormGroup = this.images.at(index) as FormGroup;
        imageFormGroup.get('base64')?.setValue(base64Data);
        imageFormGroup.get('type')?.setValue(type);

        // Update the preview
        if (index < this.imagePreviews.length) {
          this.imagePreviews[index] = { base64: base64String, type };
        } else {
          this.imagePreviews.push({ base64: base64String, type });
        }

        console.log('Image loaded successfully, length:', base64Data.length);
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

  // Handle type change event with proper typing
  onTypeChange(event: Event, imageGroup: AbstractControl): void {
    const target = event.target as HTMLSelectElement;
    if (target && target.value) {
      imageGroup.get('type')?.setValue(target.value);
    }
  }

  // Safely get the type value from a form control
  getTypeValue(imageGroup: AbstractControl): 'FACADE' | 'AUTRE' {
    const typeValue = imageGroup.get('type')?.value;
    return typeValue === 'AUTRE' ? 'AUTRE' : 'FACADE'; // Default to 'FACADE' if not set or invalid
  }

  // Safely get a form control from an abstract control
  getFormControl(control: AbstractControl, name: string): FormControl {
    const formControl = control.get(name);
    // If the control doesn't exist, return a new FormControl with a default value
    // This should never happen in practice, but it satisfies TypeScript
    return formControl as FormControl;
  }
}
