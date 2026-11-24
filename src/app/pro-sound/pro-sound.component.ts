import { Component } from '@angular/core';
import { SeoService } from '../seo.service';

@Component({
  selector: 'app-pro-sound',
  standalone: true,
  imports: [],
  templateUrl: './pro-sound.component.html',
  styleUrl: './pro-sound.component.css'
})    
export class ProSound {
  constructor(private seo: SeoService) {
    this.seo.setPage(
      'Professional Sound Systems | DaVende Sound',
      'Professional live sound systems for large events. 18-channel stage input, Shure Beta mics, in-ear monitors, and lighting. We cover over 1 acre outdoors. Call (601) 456-0007',
      '/pro-sound'
    );
  }
}
