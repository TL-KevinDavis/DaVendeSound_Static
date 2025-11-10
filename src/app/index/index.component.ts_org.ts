import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-index',
  standalone: true,
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements AfterViewInit {
  slideIndex = 1;

  ngAfterViewInit() {
    // This replaces your first <script> block
    const list = document.querySelectorAll('.item a');
    for (let i = 0; i < list.length; i++) {
      const url = list[i].children[0].getAttribute('src');
      list[i].setAttribute('style', `background-image: url('${url}')`);
    }
  }

  openModal(m: number): void {
    const modal = document.getElementById('myModal' + m);
    if (modal) modal.style.display = 'inline';
  }

  closeModal(m: number): void {
    const modal = document.getElementById('myModal' + m);
    if (modal) modal.style.display = 'none';
  }

  plusSlides(n: number, m: number): void {
    this.showSlides(this.slideIndex += n, m);
  }

  currentSlide(n: number, m: number): void {
    this.showSlides(this.slideIndex = n, m);
  }

  showSlides(n: number, m: number): void {
    let i;
    const slides = document.getElementsByClassName('mySlides' + m) as HTMLCollectionOf<HTMLElement>;
    const dots = document.getElementsByClassName('demo') as HTMLCollectionOf<HTMLElement>;
    const captionText = document.getElementById('caption');
    if (n > slides.length) { this.slideIndex = 1; }
    if (n < 1) { this.slideIndex = slides.length; }
    for (i = 0; i < slides.length; i++) {
      slides[i].style.display = 'none';
    }
    for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(' active', '');
    }
    if (slides.length > 0) {
      slides[this.slideIndex - 1].style.display = 'block';
    }
    if (dots.length > 0) {
      dots[this.slideIndex - 1].className += ' active';
    }
    if (captionText && dots.length > 0) {
      captionText.innerHTML = dots[this.slideIndex - 1].getAttribute('alt') || '';
    }
  }
}
