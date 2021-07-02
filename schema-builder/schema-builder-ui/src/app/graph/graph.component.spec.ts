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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { By } from '@angular/platform-browser';
import { LocalStorageService, LocalStorageStrategy } from 'ngx-webstorage';
import { GraphComponent } from './graph.component';
import { LocalStorageServiceProvider } from 'ngx-webstorage/lib/services/localStorage';
import { LocalStorageProvider } from 'ngx-webstorage/lib/core/nativeStorage';

class MockStorageService {
  storage = new Map<string, any>()

  retrieve = (key: string) => {
    return this.storage.get(key)
  }

}

describe('GraphComponent', () => {
  let component: GraphComponent;
  let fixture: ComponentFixture<GraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        GraphComponent,
        { provide: LocalStorageService, useClass: MockStorageService}
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create GraphComponent', () => {
    TestBed.createComponent(GraphComponent)
    expect(component).toBeTruthy();
  });

  it('should render the vis network', () => {
    TestBed.createComponent(GraphComponent)
    const de = fixture.debugElement.query(By.css('#schema-graph'));
    const el = de.nativeElement;
    expect(el.firstChild.className).toEqual('vis-network');
    expect(el.innerText).toContain('Add Node');
    expect(el.innerText).toContain('Add Edge');
  });
});
