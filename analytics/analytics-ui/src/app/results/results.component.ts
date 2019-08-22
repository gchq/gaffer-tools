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
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatSort } from '@angular/material';

import { ResultsService } from '../gaffer/results.service';
import { AnalyticsService } from '../gaffer/analytics.service';

@Component({
  selector: 'app-table',
  templateUrl: './results.component.html'
})
export class ResultsComponent implements OnInit, AfterViewInit {

  dataSource = new MatTableDataSource([]);
  tableColumns: string[] = [];
  @ViewChild(MatSort) sort: MatSort;
  outputType = null;

  constructor(
    private results: ResultsService,
    private analyticsService: AnalyticsService
  ) { }

  ngOnInit() {
    let tableData = this.results.get();
    this.outputType = this.analyticsService.getOutputVisualisationType();

    if (this.outputType === 'TABLE') {
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
            if (this.tableColumns.indexOf(key) === -1) {
              this.tableColumns.push(key);
            }
          }
        } else {
          toRemove.push(index);
          toAdd.push({ value: element });
          if (this.tableColumns.indexOf('value') === -1) {
            this.tableColumns.push('value');
          }
        }
      });

      // Iterate in reverse order so that the indices of later objects are unaffected
      toRemove.reverse().forEach(index => {
        tableData.splice(index, 1);
      });

      tableData = tableData.concat(toAdd);

      this.dataSource = new MatTableDataSource(tableData);
      this.dataSource.sort = this.sort;
    }
  }

  ngAfterViewInit() {
    if (this.outputType === 'HTML') {
      const html = '<div>Here is some random text in a div<div>';

      // Display the icon
      const htmlContainer: HTMLElement = document.getElementById('htmlContainer');
      if (htmlContainer) {
        htmlContainer.innerHTML = html;
      }
    }
  }
}
