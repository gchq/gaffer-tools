import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent {
  isDarkTheme: boolean = false;
  tab: string;

  constructor(private router: Router,
    private route: ActivatedRoute) {
    this.tab = 'graph';
    router.events.subscribe((val) => {
      if (val.url && val.url.length > 2) {
        this.tab = val.url.substr(1);
      }
    });
  }

  changeTab(newTab) {
    this.router.navigate(['/' + newTab]);
  }
}
