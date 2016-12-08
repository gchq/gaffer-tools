import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  isDarkTheme: boolean = false;
  tab: string;

  constructor() {
    this.tab = 'graph';
  }

  changeTab(newTab) {
    this.tab = newTab;
  }
}
