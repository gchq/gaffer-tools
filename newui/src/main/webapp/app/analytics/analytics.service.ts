//Used to store and get the selected analytic
export class AnalyticsService {
  selectedAnalytic;

  setAnalytic(analytic) {
    console.log("setting analytic:", analytic);
    this.selectedAnalytic = analytic;
    console.log("set analytic:", this.selectedAnalytic);
  }
  getAnalytic() {
    console.log("getting analytic:", this.selectedAnalytic);
    return this.selectedAnalytic;
  }

  constructor() {}
}
