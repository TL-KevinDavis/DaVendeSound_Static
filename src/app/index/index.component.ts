import { Component, AfterViewInit } from '@angular/core';
import { ModalService } from '../modal.service';
import { MediaService } from '../media.service';

@Component({
  selector: 'app-index',
  standalone: true,
  imports: [],
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  providers: [MediaService]
})
export class IndexComponent implements AfterViewInit {
  slideIndex = 1;

  constructor(public modalService: ModalService, public media: MediaService) {}

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

  openModal(m: number): void {
    const modal = document.getElementById(`myModal${m}`);
    if (modal) modal.style.display = 'inline';
    this.slideIndex = 1;
    this.showSlides(this.slideIndex, m);
  }

  closeModal(m: number): void {
    this.modalService.stopAllVideos();
    const modal = document.getElementById(`myModal${m}`);
    if (modal) modal.style.display = 'none';
  }

  plusSlides(n: number, m: number): void {
    this.modalService.stopAllVideos();
    this.showSlides(this.slideIndex += n, m);
  }

  currentSlide(n: number, m: number): void {
    this.showSlides(this.slideIndex = n, m);
  }

  showSlides(n: number, m: number): void {
    const slides = document.getElementsByClassName(`mySlides${m}`) as HTMLCollectionOf<HTMLElement>;
    let slideIndex = n;
    if (n > slides.length) { slideIndex = 1; }
    if (n < 1) { slideIndex = slides.length; }
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }
    if (slides.length > 0) {
      slides[slideIndex - 1].style.display = 'block';
    }
    this.slideIndex = slideIndex;
  }

  autoplayCurrentVideo(m: number, n: number): void {
    this.modalService.autoplayCurrentVideo(m, n);
  }
}
