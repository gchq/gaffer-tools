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
import { PrettyJsonModule } from 'angular2-prettyjson';
import { ConfigModule, ConfigLoader, ConfigStaticLoader } from 'ng2-config';
import { Http, BaseRequestOptions, HttpModule, Response, ResponseOptions } from '@angular/http';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { SchemaComponent } from './schema.component';

let apiEndpoint = '/config.json';
let settingsRepository = {
    'system': {
        'applicationName': 'Mighty Mouse',
        'applicationUrl': 'http://localhost:8000'
    },
    'i18n': {
        'locale': 'en'
    }
};

export function configFactory() {
    return new ConfigStaticLoader(apiEndpoint);
}

describe('SchemaComponent', () => {
  let component: SchemaComponent;
  let fixture: ComponentFixture<SchemaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      declarations: [
        SchemaComponent
      ],
      imports: [
        FormsModule,
        PrettyJsonModule,
        HttpModule,
        ConfigModule.forRoot({ provide: ConfigLoader, useFactory: (configFactory) })
      ],
      providers: [
        {
          provide: Http,
          useFactory: (mockBackend: MockBackend, options: BaseRequestOptions) => {
            return new Http(mockBackend, options);
          },
          deps: [MockBackend, BaseRequestOptions]
        },
        MockBackend,
        BaseRequestOptions
      ]
    })
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
