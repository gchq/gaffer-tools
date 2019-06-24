/*
 * Copyright 2019 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, OnInit} from '@angular/core'
import { ResultsService } from '../gaffer/results.service'

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html'
})
export class TableComponent implements OnInit {
  tableData = [];
  tableColumns = [];

  constructor(
    private results: ResultsService
  ) {}

  ngOnInit() {
    this.tableData = this.results.get();

    // Trying to think of a more efficient way of implementing this.
    this.tableData.forEach(element => {
      for (const key of Object.keys(element)) {
        if (this.tableColumns.indexOf(key) == -1) {
          this.tableColumns.push(key);
        }
      }
    });


  }
}