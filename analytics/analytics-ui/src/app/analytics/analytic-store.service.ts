import { Injectable } from '@angular/core';
import { Analytic } from './interfaces/analytic.interface';

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

  /** Set the chosen analytic */
  setAnalytic(analytic: Analytic) {
    this.analytic = analytic;
  }
}
