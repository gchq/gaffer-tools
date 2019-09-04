/*
 * Copyright 2019 Crown Copyright
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { TestBed, async, fakeAsync, tick } from '@angular/core/testing';

import { SchemaService } from './schema.service';
import { QueryService } from './query.service';

class QueryServiceStub {}

describe('SchemaService', () => {
  let service: SchemaService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
          SchemaService,
        { provide: QueryService, useClass: QueryServiceStub },
    ]
    }).compileComponents();

    service = TestBed.get(SchemaService);
  }));

  it('should be able to get the preloaded schema', fakeAsync(() => {
    const schema = 'Test schema';
    let resultSchema;

    service.schema = schema;
    console.log(service.schema);

    service.get().subscribe((testSchema) => {
        resultSchema = testSchema;
    });

    tick();
    expect(resultSchema).toEqual(schema);
  }));
});
