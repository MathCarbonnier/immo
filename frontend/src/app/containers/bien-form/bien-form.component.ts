import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Bien, ImageBien } from '../../models/bien.model';
import { BienStatus, getBienStatusLabel } from '../../models/bien-status.enum';
import { BienService } from '../../services/bien.service';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { getImageSrcFromBase64 } from '../../utils/image.utils';
import { NumberWithSpacesPipe } from '../../shared/pipes/number-with-spaces.pipe';

@Component({
  selector: 'app-bien-form',
  templateUrl: './bien-form.component.html',
  styleUrls: ['./bien-form.component.css'],
  animations: [
    trigger('imageAnimation', [
      // Entry animation
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      // Exit animation
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
      ])
    ])
  ],
  providers: [NumberWithSpacesPipe]
})
export class BienFormComponent implements OnInit {
  // Make enum available to the template
  BienStatus = BienStatus;
  getBienStatusLabel = getBienStatusLabel;

  bienForm: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  imagePreviews: ImageBien[] = [];
  isEditMode = false;
  propertyId: number | null = null;
  pageTitle = 'Ajouter un bien';
  saveButtonText = 'Enregistrer';

  constructor(
    private formBuilder: FormBuilder,
    private bienService: BienService,
    private router: Router,
    private route: ActivatedRoute,
    private numberWithSpacesPipe: NumberWithSpacesPipe
  ) {
    this.bienForm = this.formBuilder.group({
      titre: ['', [Validators.required]],
      surface: ['', [Validators.required, Validators.min(1)]],
      prix: ['', [Validators.required, Validators.min(1)]],
      description: [''],
      status: [BienStatus.A_VENDRE, [Validators.required]],
      images: this.formBuilder.array([])
    });
  }

  // Getter for the images FormArray
  get images(): FormArray {
    return this.bienForm.get('images') as FormArray;
  }

  ngOnInit(): void {
    // Check if we're in edit mode by looking for an ID in the route
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      // We're in edit mode
      this.isEditMode = true;
      this.propertyId = Number(id);
      this.pageTitle = 'Modifier le bien';
      this.saveButtonText = 'Modifier';

      // Load the property data
      this.loading = true;
      this.bienService.getBienById(this.propertyId).subscribe({
        next: (bien) => {
          // Populate the form with the property data
          this.bienForm.patchValue({
            titre: bien.titre,
            surface: bien.surface,
            prix: bien.prix, // We'll format this after patchValue
            description: bien.description || '',
            status: bien.status
          });

          // Format the price with spaces
          // This needs to be done after patchValue to ensure the directive works correctly
          setTimeout(() => {
            const prixControl = this.bienForm.get('prix');
            if (prixControl && bien.prix) {
              // First set the raw value to trigger the directive's formatting
              prixControl.setValue(bien.prix);
            }
          }, 0);

          // Clear any default image forms
          while (this.images.length) {
            this.images.removeAt(0);
          }

          // Add image forms for each image
          if (bien.images && bien.images.length > 0) {
            bien.images.forEach(img => {
              this.addImageForm(img.type as 'FACADE' | 'AUTRE');
              // Add to previews with properly formatted base64 data
              // We store the original base64 data for form submission
              // but use the formatted data for display
              this.imagePreviews.push({
                base64: getImageSrcFromBase64(img.base64),
                type: img.type
              });
            });

            // Update form values for images
            for (let i = 0; i < bien.images.length; i++) {
              const imageGroup = this.images.at(i) as FormGroup;
              imageGroup.get('base64')?.setValue(bien.images[i].base64);
              imageGroup.get('type')?.setValue(bien.images[i].type);
            }
          }

          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading property for editing', err);
          this.error = 'Error loading property: ' + (err.message || err);
          this.loading = false;
        }
      });
    } else {
      // We're in create mode, initialize with one image field for facade
      this.addImageForm('FACADE');
    }
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

    const bienData: Bien = {
      titre: this.f['titre'].value,
      surface: this.f['surface'].value,
      prix: this.f['prix'].value,
      description: this.f['description'].value,
      status: this.f['status'].value,
      images: this.imagePreviews
    };

    // If in edit mode, update the existing property
    if (this.isEditMode && this.propertyId) {
      this.bienService.updateBien(this.propertyId, bienData).subscribe({
        next: () => {
          this.router.navigate(['/biens', this.propertyId]);
        },
        error: error => {
          console.error('Error details:', error);
          this.error = 'Error updating property: ' + (error.message || error) + ' - Status: ' + (error.status || 'unknown');
          this.loading = false;
        }
      });
    } else {
      // Otherwise, create a new property
      this.bienService.createBien(bienData).subscribe({
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
        // We use the full base64 string with data URL prefix for display
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

  handleBack(): void {
    if (this.isEditMode && this.propertyId) {
      this.router.navigate(['/biens', this.propertyId]);
    } else {
      this.router.navigate(['/biens']);
    }
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
