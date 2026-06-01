import { Component, signal, ViewChild } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('DaVendeSoundStatic');
  @ViewChild('navbarNav') navbarNav: any;

  closeNavbar() {
    const navbarToggle = document.getElementById('navbarNav');
    if (navbarToggle && navbarToggle.classList.contains('show')) {
      const collapseBtn = document.querySelector('[data-bs-target="#navbarNav"]') as HTMLElement;
      if (collapseBtn) {
        collapseBtn.click();
      }
    }
  }
}
