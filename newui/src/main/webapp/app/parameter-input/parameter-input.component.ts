import { Component, OnInit, Injectable, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Router } from "@angular/router";
import { AnalyticsService } from "../gaffer/analytics.service";
import { ConfigService } from "../config/config.service";
import { QueryService } from "../gaffer/query.service";

@Component({
  selector: "app-parameter-input",
  templateUrl: "./parameter-input.component.html"
})
@Injectable()
export class ParameterInputComponent implements OnInit {
  analytic; //The chosen analytic
  analyticOperation; //The analytic operation to execute
  timeConfig;
  color = "primary";
  mode = "indeterminate";
  value = 50;
  @ViewChild("operationChainForm") operationChainForm;

  constructor(
    private analyticsService: AnalyticsService,
    private config: ConfigService
  ) {}

  ngOnInit() {
    //Get the analytic from the analyticsService
    this.analytic = this.analyticsService.getAnalytic();
    console.log(this.analytic);

    this.config.get().subscribe(function(conf) {
      this.timeConfig = conf.time;
    });

    //Convert the key value map of parameters into an iterable array
    if (this.analytic.parameters != null) {
      let object = this.analytic.parameters;
      this.analytic.parameters = Object.keys(object).map(function(key) {
        return [key, object[key]];
      });
    }

    //Initialise the analytic operation
    this.analyticsService.createAnalytic(this.analytic.parameters);
  }

  NAMED_VIEW_CLASS = "uk.gov.gchq.gaffer.data.elementdefinition.view.NamedView";
  OPERATION_CHAIN_CLASS = "uk.gov.gchq.gaffer.operation.OperationChain";
  ANALYTIC_CLASS = "uk.gov.gchq.gaffer.operation.analytic.AnalyticOperation";
  ENTITY_SEED_CLASS = "uk.gov.gchq.gaffer.operation.data.EntitySeed";
  PAIR_ARRAY_CLASS =
    "uk.gov.gchq.gaffer.commonutil.pair.Pair<uk.gov.gchq.gaffer.data.element.id.ElementId,uk.gov.gchq.gaffer.data.element.id.ElementId>[]";
  PAIR_CLASS = "uk.gov.gchq.gaffer.commonutil.pair.Pair";

  $onDestroy = function() {
    this.operationChain.setOperationChain(this.operations);
  };

  executeAnalytic = function() {
    this.analyticsService.executeAnalytic();
    this.loading = true;
  };
}
