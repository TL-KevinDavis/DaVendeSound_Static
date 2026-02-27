import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { DjPackagesComponent } from './dj-packages/dj-packages.component';
import { PhotosVideoComponent } from './photos-video/photos-video.component';
import { ProSound } from './pro-sound/pro-sound.component';

// Location page is standalone; import dynamically for route-level code-splitting and SEO
// Note: we use loadComponent to keep the bundle small and allow prerendering for static routes
export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'dj-packages', component: DjPackagesComponent },
  { path: 'photos-video', component: PhotosVideoComponent },
  { path: 'pro-sound', component: ProSound },

  // Static location routes for SEO - adjust list as needed
  //{ path: 'locations/jackson-ms', loadComponent: () => import('./locations/location-page.component').then(m => m.LocationPageComponent), data: { city: 'Jackson, MS', title: 'Jackson, MS DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound, and lighting services throughout Jackson, Mississippi. Call (601)456-0007 to book.' } },
  //{ path: 'locations/meridian-ms', loadComponent: () => import('./locations/location-page.component').then(m => m.LocationPageComponent), data: { city: 'Meridian, MS', title: 'Meridian, MS DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound, and lighting services throughout Meridian, Mississippi. Call (601)456-0007 to book.' } },
  //{ path: 'locations/columbus-ms', loadComponent: () => import('./locations/location-page.component').then(m => m.LocationPageComponent), data: { city: 'Columbus, MS', title: 'Columbus, MS DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound, and lighting services throughout Columbus, Mississippi. Call (601)456-0007 to book.' } },

  // Optional SEO-friendly param route if you want dynamic location pages too
  //{ path: 'locations/:city', loadComponent: () => import('./locations/location-page.component').then(m => m.LocationPageComponent) }
];
