import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ViewportService {
  private readonly mobileBreakpoint = 768;

  isMobile = signal(this.checkMobile());

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', () => {
        this.isMobile.set(this.checkMobile());
      });
    }
  }

  private checkMobile(): boolean {
    return typeof window !== 'undefined' && window.innerWidth < this.mobileBreakpoint;
  }
}
