import { Component, OnInit, Input } from "@angular/core";
import { modelGroupProvider } from "@angular/forms/src/directives/ng_model_group";

@Component({
  selector: "app-query",
  templateUrl: "./operation.component.html",
  styleUrls: ["./operation.component.css"]
})
export class OperationComponent implements OnInit {
  @Input("model") modelGroupProvider;
  constructor() {}

  ngOnInit() {}
}
