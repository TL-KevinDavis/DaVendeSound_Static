import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { DjPackagesComponent } from './dj-packages/dj-packages.component';
import { PhotosVideoComponent } from './photos-video/photos-video.component';
import { ProSound } from './pro-sound/pro-sound.component';
import { Locations } from './locations/locations';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'dj-packages', component: DjPackagesComponent },
  { path: 'photos-video', component: PhotosVideoComponent },
  { path: 'pro-sound', component: ProSound },
  { path: 'locations', component: Locations },

  // Static location routes for SEO - explicit list (safe)
  { path: 'locations/brookhaven-ms', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Brookhaven, MS', title: 'Brookhaven, MS DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Brookhaven, MS. Call (601)456-0007 to book.' } },
  { path: 'locations/biloxi-ms', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Biloxi, MS', title: 'Biloxi, MS DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Biloxi, MS. Call (601)456-0007 to book.' } },
  { path: 'locations/gulfport-ms', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Gulfport, MS', title: 'Gulfport, MS DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Gulfport, MS. Call (601)456-0007 to book.' } },
  { path: 'locations/hattiesburg-ms', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Hattiesburg, MS', title: 'Hattiesburg, MS DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Hattiesburg, MS. Call (601)456-0007 to book.' } },
  { path: 'locations/jackson-ms', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Jackson, MS', title: 'Jackson, MS DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Jackson, MS. Call (601)456-0007 to book.' } },
  { path: 'locations/mccomb-ms', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'McComb, MS', title: 'McComb, MS DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in McComb, MS. Call (601)456-0007 to book.' } },
  { path: 'locations/meridian-ms', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Meridian, MS', title: 'Meridian, MS DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Meridian, MS. Call (601)456-0007 to book.' } },
  { path: 'locations/natchez-ms', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Natchez, MS', title: 'Natchez, MS DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Natchez, MS. Call (601)456-0007 to book.' } },
  { path: 'locations/oxford-ms', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Oxford, MS', title: 'Oxford, MS DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Oxford, MS. Call (601)456-0007 to book.' } },
  { path: 'locations/southaven-ms', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Southaven, MS', title: 'Southaven, MS DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Southaven, MS. Call (601)456-0007 to book.' } },
  { path: 'locations/starkville-ms', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Starkville, MS', title: 'Starkville, MS DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Starkville, MS. Call (601)456-0007 to book.' } },
  { path: 'locations/vicksburg-ms', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Vicksburg, MS', title: 'Vicksburg, MS DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Vicksburg, MS. Call (601)456-0007 to book.' } },

  // Alabama
  { path: 'locations/mobile-al', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Mobile, AL', title: 'Mobile, AL DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Mobile, AL. Call (601)456-0007 to book.' } },
  { path: 'locations/tuscaloosa-al', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Tuscaloosa, AL', title: 'Tuscaloosa, AL DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Tuscaloosa, AL. Call (601)456-0007 to book.' } },

  // Louisiana
  { path: 'locations/alexandria-la', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Alexandria, LA', title: 'Alexandria, LA DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Alexandria, LA. Call (601)456-0007 to book.' } },
  { path: 'locations/baton-rouge-la', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Baton Rouge, LA', title: 'Baton Rouge, LA DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Baton Rouge, LA. Call (601)456-0007 to book.' } },
  { path: 'locations/lafayette-la', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Lafayette, LA', title: 'Lafayette, LA DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Lafayette, LA. Call (601)456-0007 to book.' } },
  { path: 'locations/minden-la', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Minden, LA', title: 'Minden, LA DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Minden, LA. Call (601)456-0007 to book.' } },
  { path: 'locations/monroe-la', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Monroe, LA', title: 'Monroe, LA DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Monroe, LA. Call (601)456-0007 to book.' } },
  { path: 'locations/new-orleans-la', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'New Orleans, LA', title: 'New Orleans, LA DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in New Orleans, LA. Call (601)456-0007 to book.' } },
  { path: 'locations/ruston-la', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Ruston, LA', title: 'Ruston, LA DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Ruston, LA. Call (601)456-0007 to book.' } },
  { path: 'locations/shreveport-la', loadComponent: () => import('./locations/locations').then(m => m.Locations), data: { city: 'Shreveport, LA', title: 'Shreveport, LA DJ Services | DaVende Sound', description: 'DaVende Sound provides professional DJ, sound and lighting services in Shreveport, LA. Call (601)456-0007 to book.' } },
];
