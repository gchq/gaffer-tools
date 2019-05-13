import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-query",
  templateUrl: "./operation.component.html"
})
export class OperationComponent implements OnInit {
  @Input("model") model;

  constructor() {}

  ngOnInit() {}
}
