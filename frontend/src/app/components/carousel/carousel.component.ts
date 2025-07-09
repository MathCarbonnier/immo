import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getImageSrcFromBase64 } from '../../utils/image.utils';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  @Input() images: string[] = [];
  @Input() fallbackImageUrl: string = 'https://via.placeholder.com/800x600?text=Pas+d%27image';
  @Output() imageClick = new EventEmitter<number>();

  currentImageIndex: number = 0;
  previousImageIndex: number = 0;
  direction: 'left' | 'right' = 'right';
  isAnimating: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  getImageSrc(index?: number): string {
    const imageIndex = index !== undefined ? index : this.currentImageIndex;
    if (this.images.length > 0) {
      return getImageSrcFromBase64(
        this.images[imageIndex],
        this.fallbackImageUrl
      );
    }
    return getImageSrcFromBase64(null, this.fallbackImageUrl);
  }

  nextImage(): void {
    if (this.images.length > 1 && !this.isAnimating) {
      this.isAnimating = true;
      this.direction = 'left';
      this.previousImageIndex = this.currentImageIndex;
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
      this.startAnimationTimer();
    }
  }

  prevImage(): void {
    if (this.images.length > 1 && !this.isAnimating) {
      this.isAnimating = true;
      this.direction = 'right';
      this.previousImageIndex = this.currentImageIndex;
      this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
      this.startAnimationTimer();
    }
  }

  goToImage(index: number): void {
    if (index >= 0 && index < this.images.length && index !== this.currentImageIndex && !this.isAnimating) {
      this.isAnimating = true;
      // Determine direction based on index comparison
      this.direction = index > this.currentImageIndex ? 'left' : 'right';
      this.previousImageIndex = this.currentImageIndex;
      this.currentImageIndex = index;
      this.startAnimationTimer();
    }
  }

  private startAnimationTimer(): void {
    // Reset animation state after animation completes
    setTimeout(() => {
      this.isAnimating = false;
    }, 400); // Match this with the CSS animation duration
  }

  onImageClick(): void {
    this.imageClick.emit(this.currentImageIndex);
  }
}
