import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('DaVendeSoundStatic');

  constructor(private router: Router) {}

  closeNavbar() {
    const navbarNav = document.getElementById('navbarNav');
    const navbarToggle = document.querySelector('[data-bs-toggle="collapse"]') as HTMLButtonElement;
    
    if (navbarNav?.classList.contains('show') && navbarToggle) {
      navbarToggle.click();
    }
  }
}
