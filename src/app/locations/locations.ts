import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-locations',
  imports: [],
  templateUrl: './locations.html',
  styleUrls: ['./locations.css'],
})
export class Locations implements OnInit {
  
  constructor(
    private route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    // Read the route data you defined in app.routes.ts
    this.route.data.subscribe(data => {
      // Set the page title
      if (data['title']) {
        this.titleService.setTitle(data['title']);
      }
      
      // Set the meta description
      if (data['description']) {
        this.metaService.updateTag({ 
          name: 'description', 
          content: data['description'] 
        });
      }
    });
  }
}
