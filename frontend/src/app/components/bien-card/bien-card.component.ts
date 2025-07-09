import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Bien, ImageBien } from '../../models/bien.model';
import { getImageSrcFromBase64 } from '../../utils/image.utils';

@Component({
  selector: 'app-bien-card',
  templateUrl: './bien-card.component.html',
  styleUrls: ['./bien-card.component.css']
})
export class BienCardComponent implements OnInit {
  @Input() bien!: Bien;
  @Input() selectable: boolean = false;
  @Input() selected: boolean = false;
  @Output() toggleSelect = new EventEmitter<number>();

  facadeImages: ImageBien[] = [];
  currentImageIndex: number = 0;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.filterFacadeImages();
  }

  filterFacadeImages(): void {
    if (this.bien.images && this.bien.images.length > 0) {
      this.facadeImages = this.bien.images.filter(img => img.type === 'FACADE');
    }
  }

  onCardClick(): void {
    if (this.selectable) {
      this.toggleSelect.emit(this.bien.id);
    } else {
      this.router.navigate(['/biens', this.bien.id]);
    }
  }

  onImageClick(event: Event): void {
    if (this.facadeImages.length > 1) {
      event.stopPropagation();
      this.nextImage();
    }
  }

  nextImage(): void {
    if (this.facadeImages.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.facadeImages.length;
    }
  }

  getImageSrc(): string {
    if (this.facadeImages.length > 0) {
      return getImageSrcFromBase64(this.facadeImages[this.currentImageIndex].url);
    }
    return getImageSrcFromBase64(null);
  }
}
