import { AnalyticsComponent } from "./analytics/analytics.component";
import { AboutComponent } from "./about/about.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
// import { TableComponent } from "./table/table.component";

const routes: Routes = [
  { path: "about", component: AboutComponent },
  { path: "analytics", component: AnalyticsComponent }
  //{ path: "parameters", component: ParametersComponent },
  //{ path: "results", component: TableComponent }
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {}
