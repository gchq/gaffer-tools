import { Component, OnInit, Injectable } from "@angular/core";
import { OperationService } from '../gaffer/operation.service';
import { ErrorService } from '../dynamic-input/error.service';

@Component({
  selector: "app-analytics",
  templateUrl: "./analytics.component.html",
  styleUrls: ["./analytics.component.css"]
})
@Injectable()
export class AnalyticsComponent implements OnInit {

  constructor(private operationService: OperationService,
              private error: ErrorService) {}

  ngOnInit() {
    this.reloadOperations();
    this.error.handle(null,null,null);
  }
  
  // load the analytics
  reloadOperations = function() {
    this.operationService.reloadOperations(true).subscribe(
      (availableAnalytics) => {
        this.analytics = availableAnalytics;
      },
      (err) => {
        this.error.handle('Error loading operations, see the console for details',null,err);
        console.log(err);
      });
  };
}
