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

  // Return the normalized slide index so callers can synchronize
  showSlides(n: number, m: number): number {
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
    return this.slideIndex;
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

    // Look for an existing video element
    let video = currentSlide.querySelector('video') as HTMLVideoElement | null;
    if (!video) {
      // If no video element, check if there is an img whose src points to a video file.
      const img = currentSlide.querySelector('img') as HTMLImageElement | null;
      if (img) {
        const src = img.getAttribute('src') || '';
        const videoExts = ['.mp4', '.mov', '.avi', '.wmv', '.mkv', '.webm'];
        const isVideo = videoExts.some(ext => src.toLowerCase().endsWith(ext));
        if (isVideo) {
          // Create a video element and replace the img placeholder
          video = document.createElement('video') as HTMLVideoElement;
          video.controls = true;
          video.autoplay = true;
          video.preload = 'auto';
          video.muted = true;
          video.loop = true;
          video.width = 700;

          const source = document.createElement('source');
          source.src = src;
          // Try to infer MIME type from extension
          if (src.toLowerCase().endsWith('.mp4')) source.type = 'video/mp4';
          else if (src.toLowerCase().endsWith('.webm')) source.type = 'video/webm';
          else source.type = 'application/octet-stream';

          video.appendChild(source);
          img.replaceWith(video);
        }
      }
    }

    if (video) {
      video.muted = true;
      // Play if possible, ignore autoplay blocked errors
      video.play().catch(() => { /* ignore autoplay block errors */ });
    }
    return this.slideIndex;
  }
}
