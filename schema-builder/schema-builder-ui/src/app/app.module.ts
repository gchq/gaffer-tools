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
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card'
import { MatToolbarModule } from '@angular/material/toolbar'
import { MatTabsModule } from '@angular/material/tabs'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout'
import { GraphComponent } from './graph/graph.component';
import { EdgeFormComponent } from './graph/edge-form/edge-form.component';
import { NodeFormComponent } from './graph/node-form/node-form.component';
import { NgxWebstorageModule } from 'ngx-webstorage';
import { SchemaComponent } from './schema/schema.component';
import { TypesComponent } from './types/types.component';
import { PrettyJsonModule } from 'angular2-prettyjson';
import { AppComponent } from './app.component';
import { TypeFormComponent } from './types/type-form/type-form.component';
import { NavLinkComponent } from './app.component';
import { EntityFormComponent } from './graph/entity-form/entity-form.component';
import { PropertiesComponent } from './properties/properties.component';
import { PropertyFormComponent } from './properties/property-form/property-form.component';
import { routing } from './app.routes';
import { configFactory, ConfigLoader, ConfigModule } from '@ngx-config/core';

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
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatTabsModule,
    MatToolbarModule,
    HttpClientModule,
    BrowserModule,
    PrettyJsonModule,
    FormsModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    NgxWebstorageModule.forRoot(),
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
  // constructor(private _appRef: ApplicationRef) { }

  // ngDoBootstrap() {
  //   this._appRef.bootstrap(AppComponent);
  // }
}
