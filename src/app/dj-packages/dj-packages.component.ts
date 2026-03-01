import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { ModalService } from '../modal.service';
import { MediaService } from '../media.service';

@Component({
  selector: 'app-dj-packages',
  standalone: true,
  templateUrl: './dj-packages.component.html',
  styleUrls: ['./dj-packages.component.css']
})
export class DjPackagesComponent {
  constructor(
    public modalService: ModalService, 
    public media: MediaService,
    private titleService: Title,
    private metaService: Meta
  ) {
    // Set page title and meta description
    this.titleService.setTitle('DJ Packages | DaVende Sound');
    this.metaService.updateTag({ 
      name: 'description', 
      content: 'Affordable DJ packages for weddings and events. Choose from small (100-150), medium (200-250), or large systems. Dance floor and accent lighting available. Call (601) 456-0007'
    });
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
