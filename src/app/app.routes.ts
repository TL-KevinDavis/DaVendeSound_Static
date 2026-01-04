import { Routes } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { DjPackagesComponent } from './dj-packages/dj-packages.component';
import { PhotosVideoComponent } from './photos-video/photos-video.component';
import { ProSound } from './pro-sound/pro-sound.component';

export const routes: Routes = [
  { path: '', component: IndexComponent },
  { path: 'dj-packages', component: DjPackagesComponent },
  { path: 'photos-video', component: PhotosVideoComponent },
  { path: 'pro-sound', component: ProSound }
];
