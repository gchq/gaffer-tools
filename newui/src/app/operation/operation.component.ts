import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-query",
  templateUrl: "./operation.component.html",
  styleUrls: ["./operation.component.css"]
})
export class OperationComponent implements OnInit {
  @Input('model') model;

  constructor() {}

  ngOnInit() {}
}
