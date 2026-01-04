import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MediaService {
  // Default to Azure Blob URL, but can be overridden
  private baseUrl = 'https://davendestaticimages.blob.core.windows.net/davendesiteimages/';

  constructor() {
    // Optional: Load from environment or config file if needed
    // this.baseUrl = this.loadBaseUrlFromConfig();
  }

  url(path: string): string {
    // Normalize to forward slashes, but preserve original casing
    const normalized = (path || '').replace(/\\/g, '/');
    // Ensure baseUrl has trailing slash
    const normalizedBase = this.baseUrl.endsWith('/') ? this.baseUrl : this.baseUrl + '/';
    return normalizedBase + normalized;
  }
}
