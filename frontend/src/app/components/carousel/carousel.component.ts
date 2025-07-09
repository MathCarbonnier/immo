import { Component, Input, OnInit } from '@angular/core';
import { getImageSrcFromBase64 } from '../../utils/image.utils';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements OnInit {
  @Input() images: string[] = [];
  @Input() fallbackImageUrl: string = 'https://via.placeholder.com/800x600?text=Pas+d%27image';

  currentImageIndex: number = 0;

  constructor() { }

  ngOnInit(): void {
  }

  getImageSrc(): string {
    if (this.images.length > 0) {
      return getImageSrcFromBase64(
        this.images[this.currentImageIndex],
        this.fallbackImageUrl
      );
    }
    return getImageSrcFromBase64(null, this.fallbackImageUrl);
  }

  nextImage(): void {
    if (this.images.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }
  }

  prevImage(): void {
    if (this.images.length > 1) {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
    }
  }

  goToImage(index: number): void {
    if (index >= 0 && index < this.images.length) {
      this.currentImageIndex = index;
    }
  }
}
