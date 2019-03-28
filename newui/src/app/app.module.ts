import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms"; // <-- NgModel lives here
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { UpgradeModule } from "@angular/upgrade/static";

import { AppComponent } from "./app.component";
import { AboutComponent } from "./about/about.component";
import { AppRoutingModule } from "./app-routing.module";
import { AnalyticsComponent } from "./analytics/analytics.component";
import { QueryComponent } from "./query/query.component";
import { AnalyticComponent } from "./analytic/analytic.component";
// import { TableComponent } from "./table/table.component";
import { MaterialModule } from "./material.module";

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    AnalyticsComponent,
    QueryComponent,
    AnalyticComponent
    // TableComponent
  ],
  imports: [
    BrowserModule,
    UpgradeModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
    // TableComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private upgrade: UpgradeModule) {}
  ngDoBootstrap() {
    this.upgrade.bootstrap(document.body, ["myApp"], { strictDi: true });
  }
}
