import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms"; // <-- NgModel lives here
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { UpgradeModule } from "@angular/upgrade/static";
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from "./app.component";
import { AboutComponent } from "./about/about.component";
import { OperationComponent } from "./operation/operation.component";
import { TableComponent } from "./table/table.component";

import { AppRoutingModule } from "./app-routing.module";
import { AnalyticsComponent } from "./analytics/analytics.component";
import { AnalyticComponent } from "./analytic/analytic.component";
import { NavComponent } from "./nav/nav.component";
import { MaterialModule } from "./material.module";
import { LayoutModule } from "@angular/cdk/layout";
import { FlexLayoutModule } from "@angular/flex-layout";
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule
} from "@angular/material";
import { DateRangeComponent } from "./date-range/date-range.component";
import { InputManagerComponent } from "./input-manager/input-manager.component";
import { ParameterFormComponent } from "./parameter-form/parameter-form.component";
import { PairBuilderComponent } from "./pair-builder/pair-builder.component";
import { SeedBuilderComponent } from "./seed-builder/seed-builder.component";
import { OperationFieldComponent } from "./operation-field/operation-field.component";
import { ParameterInputComponent } from "./parameter-input/parameter-input.component";
import { AnalyticsService } from './analytics.service';
import { OperationService } from './gaffer/operation.service';
import { SchemaService } from './gaffer/schema.service';
import { OperationOptionsService } from './options/operation-options.service';
import { ConfigService } from './config/config.service';
import { EventsService } from './dynamic-input/events.service';
import { CommonService } from './dynamic-input/common.service';
import { TypesService } from './gaffer/type.service';
import { ErrorService } from './dynamic-input/error.service';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    AnalyticsComponent,
    AnalyticComponent,
    OperationComponent,
    NavComponent,
    TableComponent,
    DateRangeComponent,
    InputManagerComponent,
    ParameterFormComponent,
    PairBuilderComponent,
    SeedBuilderComponent,
    OperationFieldComponent,
    ParameterInputComponent
  ],
  imports: [
    BrowserModule,
    UpgradeModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    LayoutModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule
  ],
  providers: [
    AnalyticsService,
    OperationService,
    SchemaService,
    OperationOptionsService,
    ConfigService,
    EventsService,
    CommonService,
    TypesService,
    ErrorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private upgrade: UpgradeModule) {}
  ngDoBootstrap() {
    this.upgrade.bootstrap(document.body, ["myApp"], { strictDi: true });
  }
}