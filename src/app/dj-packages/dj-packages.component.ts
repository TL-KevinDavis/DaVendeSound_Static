import { Component, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ModalService } from '../modal.service';
import { MediaService } from '../media.service';
import { SeoService } from '../seo.service';

@Component({
  selector: 'app-dj-packages',
  standalone: true,
  templateUrl: './dj-packages.component.html',
  styleUrls: ['./dj-packages.component.css']
})
export class DjPackagesComponent implements AfterViewInit {
  constructor(
    public modalService: ModalService,
    public media: MediaService,
    private seo: SeoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.seo.setPage(
      'DJ Packages in Vicksburg, MS | DaVende Sound',
      'Affordable DJ packages for weddings and events. Choose from small (100-150), medium (200-250), or large systems. Dance floor and accent lighting available. Call (601) 456-0007',
      '/dj-packages'
    );
  }

  ngAfterViewInit() {
    // Only run in browser, not during SSR
    if (isPlatformBrowser(this.platformId)) {
      // Ensure images are visible within the clip-path hexagons
      const images = document.querySelectorAll('.item img');
      images.forEach((img: Element) => {
        const imgElement = img as HTMLImageElement;
        imgElement.style.width = '115%';
        imgElement.style.height = '115%';
        imgElement.style.objectFit = 'cover';
        imgElement.style.objectPosition = 'center';
      });
    }
  }

  openModal(id: number): void {
    this.modalService.openModal(id);
  }

  closeModal(m: number): void {
    this.modalService.closeModal(m);
    this.modalService.stopAllVideos();
  }

  plusSlides(n: number, m: number): void {
    this.modalService.plusSlides(n, m);
    this.modalService.autoplayCurrentVideo(m, this.modalService.slideIndex);
  }

  currentSlide(n: number, m: number): void {
    this.modalService.currentSlide(n, m);
    this.modalService.autoplayCurrentVideo(m, n);
  }

  stopAllVideos(): void {
    this.modalService.stopAllVideos();
  }

  autoplayCurrentVideo(m: number, n: number): void {
    this.modalService.autoplayCurrentVideo(m, n);
  }
}
