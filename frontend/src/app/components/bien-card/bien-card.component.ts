import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Bien, ImageBien } from '../../models/bien.model';

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

  facadeImages: string[] = [];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.filterFacadeImages();
  }

  filterFacadeImages(): void {
    if (this.bien.images && this.bien.images.length > 0) {
      this.facadeImages = this.bien.images
        .filter(img => img.type === 'FACADE')
        .map(img => img.base64);
    }
  }

  onCardClick(): void {
    if (this.selectable) {
      this.toggleSelect.emit(this.bien.id);
    } else {
      this.router.navigate(['/biens', this.bien.id]);
    }
  }

  onCarouselImageClick(): void {
    if (this.selectable) {
      this.toggleSelect.emit(this.bien.id);
    } else {
      this.router.navigate(['/biens', this.bien.id]);
    }
  }

}
