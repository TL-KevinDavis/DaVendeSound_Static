import { Component, AfterViewInit } from '@angular/core';
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

  constructor(public media: MediaService, public modalService: ModalService) {}

  ngAfterViewInit(): void {
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

  openModal(id: number): void {
    const modal = document.getElementById(`myModal${id}`);
    if (modal) modal.style.display = 'inline';
    this.slideIndex = 1;
    this.modalService.showSlides(this.slideIndex, id);
  }

  closeModal(id: number): void {
    this.modalService.stopAllVideos();
    const modal = document.getElementById(`myModal${id}`);
    if (modal) modal.style.display = 'none';
  }

  plusSlides(n: number, id: number): void {
    this.modalService.stopAllVideos();
    this.slideIndex += n;
    this.modalService.showSlides(this.slideIndex, id);
  }

  currentSlide(n: number, id: number): void {
    this.slideIndex = n;
    this.modalService.showSlides(this.slideIndex, id);
  }
}
