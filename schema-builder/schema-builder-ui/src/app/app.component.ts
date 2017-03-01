/*
 * Copyright 2016 Crown Copyright
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

import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css']
})
export class AppComponent{
  activeLinkIndex:number;
  pages:Array<any> = [
    { title: "Graph", route: "graph" },
    { title: "Properties", route: "properties" },
    { title: "Types", route: "types" },
    { title: "Schema", route: "schema" }
  ];

  activateLink(index: number, linkIsActivated: boolean) {
    this.activeLinkIndex = index;
    console.log(linkIsActivated);
  }

  constructor(private router: Router,
    private route: ActivatedRoute) {
    router.events.subscribe((val) => {
      let tab:string = 'graph';
      if (val.url && val.url.length > 2) {
        tab = val.url.substr(1).split(';', 1)[0];
      }
      this.activeLinkIndex = _.findIndex(this.pages, function (o) {
        return o.route === tab;
      });
    });
  }
}
