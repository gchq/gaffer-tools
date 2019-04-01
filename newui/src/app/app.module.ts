import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms"; // <-- NgModel lives here
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { UpgradeModule } from "@angular/upgrade/static";

import { AppComponent } from "./app.component";
import { AboutComponent } from "./about/about.component";
import { QueryComponent } from "./query/query.component";
// import { TableComponent } from "./table/table.component";

import { AppRoutingModule } from "./app-routing.module";
import { AnalyticsComponent } from "./analytics/analytics.component";
import { AnalyticComponent } from "./analytic/analytic.component";
import { NavComponent } from "./nav/nav.component";
import { MaterialModule } from "./material.module";
import { LayoutModule } from "@angular/cdk/layout";
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule
} from "@angular/material";

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    AnalyticsComponent,
    AnalyticComponent,
    QueryComponent,
    NavComponent
    // TableComponent
  ],
  imports: [
    BrowserModule,
    UpgradeModule,
    FormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
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
