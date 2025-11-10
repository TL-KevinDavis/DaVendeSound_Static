import { Component, AfterViewInit } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements AfterViewInit {
  constructor(public modalService: ModalService) {}

  ngAfterViewInit() {
    // Set background images for .item a
    const list = document.querySelectorAll('.item a');
    for (let i = 0; i < list.length; i++) {
      const url = list[i].children[0].getAttribute('src');
      list[i].setAttribute('style', `background-image: url('${url}')`);
    }

    // Ensure all videos are muted and autoplay
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.muted = true;
      video.autoplay = true;
      video.load();
      video.play().catch(() => { /* ignore autoplay block errors */ });
    });
  }

  // Modal methods are now handled by ModalService
  openModal(m: number): void {
    this.modalService.openModal(m);
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
