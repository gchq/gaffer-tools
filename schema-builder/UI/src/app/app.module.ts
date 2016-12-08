import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { GraphComponent } from './graph/graph.component';
import { EdgeFormComponent } from './graph/edge-form/edge-form.component';
import { MaterializeDirective } from 'angular2-materialize';
import { NodeFormComponent } from './graph/node-form/node-form.component';
import { Ng2Webstorage } from 'ng2-webstorage';
import { SchemaComponent } from './schema/schema.component';
import { TypesComponent } from './types/types.component';
import { PrettyJsonModule, SafeJsonPipe } from 'angular2-prettyjson';
import { JsonPipe } from '@angular/common';
import { AppComponent } from './app.component';
import { TypeFormComponent } from './types/type-form/type-form.component';
import { EntityFormComponent } from './graph/entity-form/entity-form.component';
import * as spinner from 'ng2-spin-kit/app/spinners'

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
    spinner.FoldingCubeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    PrettyJsonModule,
    MaterialModule.forRoot(),
    ReactiveFormsModule,
    Ng2Webstorage
  ],
  entryComponents: [
    AppComponent
  ],
  providers: [
    { provide: JsonPipe, useClass: SafeJsonPipe }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private _appRef: ApplicationRef) { }

  ngDoBootstrap() {
    this._appRef.bootstrap(AppComponent);
  }
}
