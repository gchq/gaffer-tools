import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import { GraphComponent } from './graph/graph.component';
import { EdgeFormComponent } from './graph/edge-form/edge-form.component';
import { MaterializeDirective } from 'angular2-materialize';
import { NodeFormComponent } from './graph/node-form/node-form.component';
import { Ng2Webstorage } from 'ng2-webstorage';
import { SchemaComponent } from './schema/schema.component';
import { TypesComponent } from './types/types.component';
import { PrettyJsonModule } from 'angular2-prettyjson';
import { AppComponent } from './app.component';
import { TypeFormComponent } from './types/type-form/type-form.component';
import { EntityFormComponent } from './graph/entity-form/entity-form.component';
import * as spinner from 'ng2-spin-kit/app/spinners';
import { PropertiesComponent } from './properties/properties.component';
import { PropertyFormComponent } from './properties/property-form/property-form.component';
import { routing } from './app.routes';


@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    EdgeFormComponent,
    MaterializeDirective,
    NodeFormComponent,
    SchemaComponent,
    TypesComponent,
    TypeFormComponent,
    EntityFormComponent,
    spinner.FoldingCubeComponent,
    PropertiesComponent,
    PropertyFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    PrettyJsonModule,
    FlexLayoutModule.forRoot(),
    MaterialModule.forRoot(),
    ReactiveFormsModule,
    Ng2Webstorage,
    routing
  ],
  entryComponents: [
    AppComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private _appRef: ApplicationRef) { }

  ngDoBootstrap() {
    this._appRef.bootstrap(AppComponent);
  }
}
