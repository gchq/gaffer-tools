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

/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { APP_BASE_HREF } from '@angular/common';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PropertiesComponent } from './properties/properties.component';
import { GraphComponent } from './graph/graph.component';
import { SchemaComponent } from './schema/schema.component';
import { PrettyJsonModule } from 'angular2-prettyjson';
import { TypesComponent } from './types/types.component';
import { routing } from './app.routes';
import { AppComponent } from './app.component';

describe('App: Gaffer Schema Builder', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        AppComponent,
        GraphComponent,
        PropertiesComponent,
        SchemaComponent,
        TypesComponent
      ],
      imports: [
        FormsModule,
        PrettyJsonModule,
        routing
      ],
      providers: [{provide: APP_BASE_HREF, useValue : '/' }]
    });
  });

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const de = fixture.debugElement.query(By.css('h1'));
    const el = de.nativeElement;
    expect(el.innerText).toEqual('Gaffer Schema Builder');
  }));
});
