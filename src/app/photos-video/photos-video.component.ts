import { Component, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { MediaService } from '../media.service';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-photos-video',
  standalone: true,
  templateUrl: './photos-video.component.html',
  styleUrls: ['./photos-video.component.css']
})
export class PhotosVideoComponent implements AfterViewInit {
  slideIndex = 1;

  constructor(
    public media: MediaService, 
    public modalService: ModalService,
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    // Set page title and meta description
    this.titleService.setTitle('Photos & Videos | DaVende Sound');
    this.metaService.updateTag({ 
      name: 'description', 
      content: 'View our photo and video gallery. See DaVende Sound DJ services, lighting setups, and satisfied clients across Mississippi and Louisiana.'
    });
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const videos = document.querySelectorAll('video');
      videos.forEach(video => {
        video.muted = true;
        video.autoplay = false;
      });

      const list = document.querySelectorAll('.item a');
      for (let i = 0; i < list.length; i++) {
        const url = (list[i].children[0] as HTMLElement).getAttribute('src');
        if (url) (list[i] as HTMLElement).setAttribute('style', `background-image: url('${url}')`);
      }
    }
  }

  openModal(id: number): void {
    if (isPlatformBrowser(this.platformId)) {
      const modal = document.getElementById(`myModal${id}`);
      if (modal) modal.style.display = 'block';
      this.slideIndex = 1;
      this.slideIndex = this.modalService.showSlides(this.slideIndex, id);
    }
  }

  closeModal(id: number): void {
    if (isPlatformBrowser(this.platformId)) {
      this.modalService.stopAllVideos();
      const modal = document.getElementById(`myModal${id}`);
      if (modal) modal.style.display = 'none';
    }
  }

  plusSlides(n: number, id: number): void {
    if (isPlatformBrowser(this.platformId)) {
      this.modalService.stopAllVideos();
      this.slideIndex += n;
      this.slideIndex = this.modalService.showSlides(this.slideIndex, id);
    }
  }

  currentSlide(n: number, id: number): void {
    if (isPlatformBrowser(this.platformId)) {
      this.slideIndex = n;
      this.slideIndex = this.modalService.showSlides(this.slideIndex, id);
    }
  }
}
