import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ResultsService } from 'src/app/services/results.service';

@Component({
  selector: 'app-html',
  templateUrl: './html.component.html',
  styleUrls: ['./html.component.css']
})

export class HtmlComponent implements AfterViewInit, OnInit {

  constructor(
    private results: ResultsService,
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    const html = this.results.get();

    // Display the icon
    const htmlContainer: HTMLElement = document.getElementById('htmlContainer');
    if (htmlContainer) {
      htmlContainer.innerHTML = html;
    }
  }
}
