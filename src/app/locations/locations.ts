import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SeoService } from '../seo.service';

@Component({
  selector: 'app-locations',
  imports: [],
  templateUrl: './locations.html',
  styleUrls: ['./locations.css'],
})
export class Locations implements OnInit {
  heading = 'Wedding & Event DJ Locations in Vicksburg, MS';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private seo: SeoService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      const path = this.router.url.split('?')[0].split('#')[0] || '/locations';
      this.heading = data['city']
        ? `DJ Services in ${data['city']}`
        : 'Wedding & Event DJ Locations in Vicksburg, MS';
      this.seo.setPage(
        data['title'] || 'Wedding & Event DJ Locations in Vicksburg, MS | DaVende Sound',
        data['description'] || 'DaVende Sound provides DJ, sound, and lighting for weddings and events across Mississippi, Louisiana, Alabama, and the Greater Memphis area. Call (601) 456-0007.',
        path
      );
    });
  }
}
