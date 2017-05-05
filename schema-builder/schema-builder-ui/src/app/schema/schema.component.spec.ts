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

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PrettyJsonModule } from 'angular2-prettyjson';
import { GafferService } from '../services/gaffer.service';
import { ConfigModule, ConfigLoader, ConfigStaticLoader, ConfigService } from 'ng2-config';
import { Http, BaseRequestOptions, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { LocalStorageService } from 'ng2-webstorage';
import { Observable } from 'rxjs/Rx';
import { SchemaComponent } from './schema.component';

class MockGafferService {
  getSchemaFromURL() {
    return {};
  }

  validateSchema() {
    return {};
  }
}

describe('SchemaComponent', () => {
  let component: SchemaComponent;
  let fixture: ComponentFixture<SchemaComponent>;
  const routerStub = {} as Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        SchemaComponent
      ],
      imports: [
        FormsModule,
        PrettyJsonModule,
        HttpModule
      ],
      providers: [
        LocalStorageService
      ]
    }).overrideComponent(SchemaComponent, {
      set: {
        providers: [
          {provide: GafferService, useClass: MockGafferService},
          {provide: ActivatedRoute, useValue: { 'params': Observable.from([{ 'id': 1 }]) }},
          {provide: Router, useValue: routerStub},
        ]
    }})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchemaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
