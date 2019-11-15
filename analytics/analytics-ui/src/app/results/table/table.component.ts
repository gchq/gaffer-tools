/*
 * Copyright 2019 Crown Copyright
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

import { Component, OnInit, Input, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { ResultsService } from 'src/app/services/results.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css']
})
export class TableComponent implements AfterViewInit, OnInit {
  columns = new FormControl();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  data = {
    results: new MatTableDataSource([])
  };
  columnsToDisplay: string[] = [];
  selected: any[];

  constructor(
    private results: ResultsService,
  ) { }

  ngOnInit() {
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

  ngAfterViewInit() {
    this.data.results.paginator = this.paginator;
    this.data.results.sort = this.sort;
  }

  removeColumn() {
    Object.keys(this.columnsToDisplay).forEach(key => {
      this.selected.forEach(column => {
        if (this.columnsToDisplay[key] === column) {
          this.columnsToDisplay.splice(parseInt(key, 10), 1);
        }
      });
    });
  }
}
