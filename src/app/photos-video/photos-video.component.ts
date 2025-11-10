import { Component, AfterViewInit } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-photos-video',
  standalone: true,
  templateUrl: './photos-video.component.html',
  styleUrls: ['./photos-video.component.css']
})
export class PhotosVideoComponent implements AfterViewInit {
  constructor(public modalService: ModalService) {}

  ngAfterViewInit() {
    const videos = document.querySelectorAll('video');
    videos.forEach(video => {
      video.muted = true;
      video.autoplay = false;
    });
  }

  openModal(id: number): void {
    this.modalService.openModal(id);
  }
  closeModal(id: number): void {
    this.modalService.closeModal(id);
    this.modalService.stopAllVideos();
  }
  plusSlides(n: number, id: number): void {
    this.modalService.plusSlides(n, id);
    this.modalService.autoplayCurrentVideo(id, this.modalService.slideIndex);
  }
  currentSlide(n: number, id: number): void {
    this.modalService.currentSlide(n, id);
    this.modalService.autoplayCurrentVideo(id, n);
  }
  stopAllVideos(): void {
    this.modalService.stopAllVideos();
  }
  autoplayCurrentVideo(id: number, n: number): void {
    this.modalService.autoplayCurrentVideo(id, n);
  }
}
