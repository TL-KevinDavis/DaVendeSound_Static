import { Component } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-pro-sound',
  standalone: true,
  imports: [],
  templateUrl: './pro-sound.component.html',
  styleUrl: './pro-sound.component.css'
})    
export class ProSound {
  constructor(
    private titleService: Title,
    private metaService: Meta
  ) {
    // Set page title and meta description
    this.titleService.setTitle('Professional Sound Systems | DaVende Sound');
    this.metaService.updateTag({ 
      name: 'description', 
      content: 'Professional live sound systems for large events. 18-channel stage input, Shure Beta mics, in-ear monitors, and lighting. We cover over 1 acre outdoors. Call (601) 456-0007'
    });
  }
}
