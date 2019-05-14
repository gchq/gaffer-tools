import { Component, OnInit, Injectable, ViewChild } from "@angular/core";
import { MatSort, MatTableDataSource } from "@angular/material";

import { EventsService } from "../dynamic-input/events.service";
import { ResultsService } from "../gaffer/results.service";
import { CommonService } from "../dynamic-input/common.service";

@Component({
  selector: "app-table",
  templateUrl: "./table.component.html"
})
@Injectable()
export class TableComponent implements OnInit {
  data = {
    results: new MatTableDataSource()
  };
  @ViewChild(MatSort) sort: MatSort;
  schema;
  displayedColumns: Set<any>;

  constructor(
    private events: EventsService,
    private results: ResultsService,
  ) {}

  /**
   * Fetches the results and subscribes to resultsUpdated events.
   */
  ngOnInit() {
    this.events.subscribe("resultsUpdated", () => this.onResultsUpdated);
    this.onResultsUpdated(this.results.get());
  }

  /**
   * Unsubscribes from resultsUpdated events.
   */
  ngOnDestroy() {
    this.events.unsubscribe("resultsUpdated", this.onResultsUpdated);
  };

  /** 
   * Updates the results table and recalculates the new columns 
   * */
  onResultsUpdated = function(resultsData) {
    if (resultsData) {
      this.data.results = resultsData;

      //Get all the different column names
      this.displayedColumns = new Set();
      this.data.results.forEach((item, index) => {
        
        let keys = Object.keys(item);
        for (let i in keys) {
  
          //If the key is class then strip the class name to the last part after the full stop
          let key = keys[i];
          if (key === 'class') {
            this.data.results[index][key] = this.data.results[index][key].split('.').pop();
          }
  
          //Get a set of all the different keys to show as columns
          this.displayedColumns.add(key);
        }
      });
    }
    this.columnsToDisplay = this.displayedColumns;
  };
}
