import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';

const SITE_ORIGIN = 'https://www.davendesound.com';

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private titleService: Title,
    private metaService: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {}

  setPage(title: string, description: string, path: string): void {
    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });
    this.setCanonical(path);
  }

  setCanonical(path: string): void {
    const clean = (path.split('?')[0].split('#')[0] || '/').replace(/\/+$/, '') || '/';
    const href = clean === '/' ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${clean.startsWith('/') ? clean : `/${clean}`}`;
    let link = this.document.querySelector("link[rel='canonical']") as HTMLLinkElement | null;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
