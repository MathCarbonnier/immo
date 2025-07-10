import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bien, ImageBien } from '../../models/bien.model';
import { BienService } from '../../services/bien.service';
import { getImageSrcFromBase64 } from '../../utils/image.utils';
import { trigger, transition, style, animate } from '@angular/animations';
import { CarouselComponent } from '../../components/carousel/carousel.component';

@Component({
  selector: 'app-bien-detail',
  templateUrl: './bien-detail.component.html',
  styleUrls: ['./bien-detail.component.css'],
  animations: [
    trigger('fullscreenAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class BienDetailComponent implements OnInit, AfterViewInit {
  bien: Bien | null = null;
  loading = true;
  error = false;

  facadeImages: string[] = [];
  otherImages: ImageBien[] = [];

  isFullscreen = false;
  currentFullscreenIndex = 0;

  @ViewChild('fullscreenCarousel') fullscreenCarousel!: CarouselComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bienService: BienService
  ) {}

  ngOnInit(): void {
    this.loadBien();
  }

  ngAfterViewInit(): void {
    // This method is called after the view has been initialized
  }

  loadBien(): void {
    this.loading = true;
    this.error = false;

    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (isNaN(id)) {
      this.error = true;
      this.loading = false;
      return;
    }

    this.bienService.getBienById(id).subscribe({
      next: (data) => {
        this.bien = data;
        this.filterImages();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading property details', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  filterImages(): void {
    if (this.bien?.images && this.bien.images.length > 0) {
      this.facadeImages = this.bien.images
        .filter(img => img.type === 'FACADE')
        .map(img => img.base64);
      this.otherImages = this.bien.images.filter(img => img.type === 'AUTRE');
    }
  }


  getOtherImageSrc(index: number): string {
    if (index < this.otherImages.length) {
      return getImageSrcFromBase64(
        this.otherImages[index].base64,
        'https://via.placeholder.com/400x400?text=Pas+d%27image'
      );
    }
    return getImageSrcFromBase64(null);
  }


  goBack(): void {
    this.router.navigate(['/biens']);
  }

  onCarouselImageClick(index: number): void {
    this.currentFullscreenIndex = index;
    this.isFullscreen = true;
    // Add a class to the body to prevent scrolling when fullscreen is active
    document.body.classList.add('no-scroll');

    // Use setTimeout to ensure the fullscreen carousel is rendered before trying to access it
    setTimeout(() => {
      if (this.fullscreenCarousel) {
        // Set the current image index in the fullscreen carousel
        this.fullscreenCarousel.goToImage(index);
      }
    }, 100);
  }

  closeFullscreen(): void {
    this.isFullscreen = false;
    // Remove the no-scroll class when fullscreen is closed
    document.body.classList.remove('no-scroll');
  }

  // Handle clicks outside the carousel in fullscreen mode to close it
  onFullscreenBackdropClick(event: MouseEvent): void {
    // Only close if the click was directly on the backdrop, not on the carousel
    if ((event.target as HTMLElement).classList.contains('fullscreen-backdrop')) {
      this.closeFullscreen();
    }
  }

  // Prevent closing when clicking inside the carousel
  onFullscreenCarouselClick(event: MouseEvent): void {
    event.stopPropagation();
  }
}
