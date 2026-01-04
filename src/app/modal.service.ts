import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  slideIndex = 1;

  openModal(m: number): void {
    const modal = document.getElementById(`myModal${m}`);
    if (modal) modal.style.display = 'block';
    this.slideIndex = 1;
    this.showSlides(this.slideIndex, m);
  }

  closeModal(m: number): void {
    const modal = document.getElementById(`myModal${m}`);
    if (modal) modal.style.display = 'none';
  }

  plusSlides(n: number, m: number): void {
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
      // Autoplay video if the current slide contains one
      this.autoplayCurrentVideo(m, slideIndex);
    }
    
    this.slideIndex = slideIndex;
  }

  // Stop all videos in the modal when changing slides or closing modal
  stopAllVideos() {
    const modal = document.querySelector('.modal-content');
    if (!modal) return;
    const videoElements = modal.querySelectorAll('video');
    for (let i = 0; i < videoElements.length; i++) {
      videoElements[i].pause();
      videoElements[i].currentTime = 0;
      videoElements[i].muted = true;
    }
  }

  autoplayCurrentVideo(m: number, n: number) {
    const slides = document.getElementsByClassName(`mySlides${m}`) as HTMLCollectionOf<HTMLElement>;
    const currentSlide = slides[n - 1];
    if (!currentSlide) return;
    
    const video = currentSlide.querySelector('video');
    if (video) {
      video.muted = true;
      video.play().catch(() => { /* ignore autoplay block errors */ });
    }
  }
}
