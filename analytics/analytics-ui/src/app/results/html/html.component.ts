/*
 * Copyright 2019-2020 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, AfterViewInit } from '@angular/core';

import { ResultsService } from 'src/app/services/results.service';

@Component({
  selector: 'app-html',
  templateUrl: './html.component.html',
  styleUrls: ['./html.component.css']
})

export class HtmlComponent implements AfterViewInit {

  constructor(
    private results: ResultsService,
  ) { }

  ngAfterViewInit() {
    const html = this.results.get();

    // Display the icon
    const htmlContainer: HTMLElement = document.getElementById('htmlContainer');
    if (htmlContainer) {
      htmlContainer.innerHTML = html;
    }
  }
}
