import { AnalyticsComponent } from "./analytics/analytics.component";
import { AboutComponent } from "./about/about.component";
import { TableComponent } from "./table/table.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ParameterInputComponent } from "./parameter-input/parameter-input.component";

const routes: Routes = [
  { path: "about", component: AboutComponent },
  { path: "analytics", component: AnalyticsComponent },
  { path: "parameters", component: ParameterInputComponent },
  { path: "results", component: TableComponent }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}
