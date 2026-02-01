import { Component } from '@angular/core';
import { ModalService } from '../modal.service';
import { MediaService } from '../media.service';

@Component({
  selector: 'app-dj-packages',
  standalone: true,
  templateUrl: './dj-packages.component.html',
  styleUrls: ['./dj-packages.component.css']
})
export class DjPackagesComponent {
  constructor(public modalService: ModalService, public media: MediaService) {}

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
