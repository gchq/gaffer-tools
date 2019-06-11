/*
 * Copyright 2019 Crown Copyright
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

import { async, ComponentFixture, TestBed } from '@angular/core/testing'
import {
  MatTableModule,
  MatCardModule,
  MatTableDataSource
} from '@angular/material'
import { empty } from 'rxjs'

import { TableComponent } from './table.component'
import { ResultsService } from '../gaffer/results.service'

class ResultsServiceStub {
  get = () => {
    return []
  }
}

describe('TableComponent', () => {
  let component: TableComponent
  let fixture: ComponentFixture<TableComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TableComponent],
      imports: [MatTableModule, MatCardModule],
      providers: [{ provide: ResultsService, useClass: ResultsServiceStub }]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent)
    component = fixture.componentInstance
  })

  it('should be created', () => {
    fixture.detectChanges()
    expect(component).toBeTruthy()
  })

  it('should get the results at initialisation', () => {
    const resultsService = TestBed.get(ResultsService)
    const spy = spyOn(resultsService, 'get')

    fixture.detectChanges()

    expect(spy).toHaveBeenCalled()
  })

  it('should update the table at initialisation', () => {
    const spy = spyOn(component, 'onResultsUpdated')

    fixture.detectChanges()

    expect(spy).toHaveBeenCalled()
  })

  it('should be able to update the results', () => {
    component.data = {
      results: new MatTableDataSource([0])
    }
    const arrayNewResults = [0, 1, 2]
    fixture.detectChanges()

    component.onResultsUpdated(arrayNewResults)

    expect(component.data.results.data).toEqual(arrayNewResults)
  })

  it('should be able to calculate the columns', () => {
    component.displayedColumns = new Set()
    const arrayNewResults = [{ key1: 'key1 value' }, { key2: 'key2 value' }]
    const keys = new Set(['key1', 'key2'])
    fixture.detectChanges()

    component.onResultsUpdated(arrayNewResults)

    expect(component.displayedColumns).toEqual(keys)
  })

  it('should not display the properties column', () => {
    const results = [
      { key1: 'key1 value', properties: { count: 10 } },
      { key2: 'key2 value', properties: { count: 20 } }
    ]

    component.onResultsUpdated(results)

    expect(component.displayedColumns.has('properties')).toBeFalsy()
  })

  it('should display the count column if there is count data', () => {
    let results = [
      { key1: 'key1 value', properties: { count: 10 } },
      { key2: 'key2 value', properties: { count: 20 } }
    ]

    component.onResultsUpdated(results)

    expect(component.displayedColumns.has('count')).toBeTruthy()
  })

  it('should strip the class name', () => {
    const results = [
      {
        key1: 'key1 value',
        class: 'test.class.name.Entity',
        properties: { count: 10 }
      }
    ]

    component.onResultsUpdated(results)

    expect(component.data.results.data[0]['class']).toEqual('Entity')
  })
})
