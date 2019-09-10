/*
 * Copyright 2019 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Location } from '@angular/common';
import { Component, OnInit, Injectable, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort, MatTableDataSource, MatPaginator } from '@angular/material';

import { AnalyticsService } from '../services/analytics.service';
import { ResultsService } from '../services/results.service';
import { HtmlComponent } from './html/html.component';

@Component({
  selector: 'app-table',
  templateUrl: './results.component.html'
})
@Injectable()
export class ResultsComponent implements AfterViewInit, OnInit {
  columns = new FormControl();
  data = {
    results: new MatTableDataSource([])
  };
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  outputType = null;
  schema = { edges: {}, entities: {}, types: {} };
  columnsToDisplay: string[] = [];
  selected;

  constructor(
    private analyticsService: AnalyticsService,
    private results: ResultsService,
    private location: Location
  ) { }

  removeColumn() {
    Object.keys(this.columnsToDisplay).forEach(key => {
      if (this.columnsToDisplay[key] === this.selected) {
        this.columnsToDisplay.splice(parseInt(key), 1);
      }
    });
  }

  goback() {
    this.location.back();
  }

  ngOnInit() {
    this.outputType = this.analyticsService.getOutputVisualisationType();

    if (this.outputType === 'TABLE') {
      let tableData = this.results.get();
      if (tableData == null) {
        return;
      }
      // To transform non-object results into objects, we need to build an array of replacements and indexes
      const toAdd: any[] = [];
      const toRemove: number[] = [];

      tableData.forEach((element, index) => {
        if (element instanceof Object) {
          // Use the keys of objects as the tableColumns
          for (const key of Object.keys(element)) {
            if (this.columnsToDisplay.indexOf(key) === -1) {
              this.columnsToDisplay.push(key);
            }
          }
        } else {
          toRemove.push(index);
          toAdd.push({ value: element });
          if (this.columnsToDisplay.indexOf('value') === -1) {
            this.columnsToDisplay.push('value');
          }
        }
      });

      // Iterate in reverse order so that the indices of later objects are unaffected
      toRemove.reverse().forEach(index => {
        tableData.splice(index, 1);
      });

      tableData = tableData.concat(toAdd);

      this.data.results = new MatTableDataSource(tableData);
      this.data.results.sort = this.sort;
    }
  }


  ngAfterViewInit() {
    this.data.results.paginator = this.paginator;
    this.data.results.sort = this.sort;
    if (this.outputType === 'HTML') {
      const html = this.results.get();

      // Display the icon
      const htmlContainer: HTMLElement = document.getElementById('htmlContainer');
      if (htmlContainer) {
        htmlContainer.innerHTML = html;
      }
    }
  }
}
