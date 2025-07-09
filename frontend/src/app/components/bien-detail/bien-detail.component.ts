import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Bien, ImageBien } from '../../models/bien.model';
import { BienService } from '../../services/bien.service';
import { getImageSrcFromBase64 } from '../../utils/image.utils';

@Component({
  selector: 'app-bien-detail',
  templateUrl: './bien-detail.component.html',
  styleUrls: ['./bien-detail.component.css']
})
export class BienDetailComponent implements OnInit {
  bien: Bien | null = null;
  loading = true;
  error = false;

  facadeImages: ImageBien[] = [];
  otherImages: ImageBien[] = [];
  currentFacadeImageIndex: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bienService: BienService
  ) {}

  ngOnInit(): void {
    this.loadBien();
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
      this.facadeImages = this.bien.images.filter(img => img.type === 'FACADE');
      this.otherImages = this.bien.images.filter(img => img.type === 'AUTRE');
    }
  }

  getFacadeImageSrc(): string {
    if (this.facadeImages.length > 0) {
      return getImageSrcFromBase64(
        this.facadeImages[this.currentFacadeImageIndex].url,
        'https://via.placeholder.com/800x600?text=Pas+d%27image+de+façade'
      );
    }
    return getImageSrcFromBase64(
      null,
      'https://via.placeholder.com/800x600?text=Pas+d%27image+de+façade'
    );
  }

  getOtherImageSrc(index: number): string {
    if (index < this.otherImages.length) {
      return getImageSrcFromBase64(
        this.otherImages[index].url,
        'https://via.placeholder.com/400x400?text=Pas+d%27image'
      );
    }
    return getImageSrcFromBase64(null);
  }

  nextFacadeImage(): void {
    if (this.facadeImages.length > 1) {
      this.currentFacadeImageIndex = (this.currentFacadeImageIndex + 1) % this.facadeImages.length;
    }
  }

  goBack(): void {
    this.router.navigate(['/biens']);
  }
}
