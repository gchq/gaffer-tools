/*
 * Copyright 2016 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ApplicationRef } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { GraphComponent } from './graph/graph.component';
import { EdgeFormComponent } from './graph/edge-form/edge-form.component';
import { NodeFormComponent } from './graph/node-form/node-form.component';
import { Ng2Webstorage } from 'ng2-webstorage';
import { SchemaComponent } from './schema/schema.component';
import { TypesComponent } from './types/types.component';
import { PrettyJsonModule } from 'angular2-prettyjson';
import { AppComponent } from './app.component';
import { TypeFormComponent } from './types/type-form/type-form.component';
import { NavLinkComponent } from './app.component';
import { EntityFormComponent } from './graph/entity-form/entity-form.component';
import { PropertiesComponent } from './properties/properties.component';
import { PropertyFormComponent } from './properties/property-form/property-form.component';
import { ConfigModule, ConfigLoader, ConfigStaticLoader } from 'ng2-config';
import { routing } from './app.routes';

export function configFactory() {
    return new ConfigStaticLoader('/config.json');
}

@NgModule({
  declarations: [
    AppComponent,
    GraphComponent,
    EdgeFormComponent,
    NodeFormComponent,
    SchemaComponent,
    TypesComponent,
    TypeFormComponent,
    EntityFormComponent,
    PropertiesComponent,
    PropertyFormComponent,
    NavLinkComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    PrettyJsonModule,
    FlexLayoutModule,
    MaterialModule,
    ReactiveFormsModule,
    Ng2Webstorage,
    BrowserAnimationsModule,
    RouterModule,
    routing,
    ConfigModule.forRoot({
      provide: ConfigLoader,
      useFactory: (configFactory)
    })
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
