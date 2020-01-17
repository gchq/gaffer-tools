import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnalyticStoreService {
  analytic; // The selected analytic

  constructor() { }

  /** Get the chosen analytic on load of parameters page */
  getAnalytic() {
    return this.analytic;
  }
}
