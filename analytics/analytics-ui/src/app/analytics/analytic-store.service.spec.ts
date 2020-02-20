import { TestBed, async } from '@angular/core/testing';

import { AnalyticStoreService } from './analytic-store.service';
import { testAnalytic } from '../services/test/test.analytic';
import { cloneDeep } from 'lodash';

describe('AnalyticStoreService', () => {
  let service: AnalyticStoreService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        AnalyticStoreService,
      ]
    }).compileComponents();

    service = TestBed.get(AnalyticStoreService);
    service.analytic = cloneDeep(testAnalytic);
  }));

  it('should be created', () => {
    const store: AnalyticStoreService = TestBed.get(AnalyticStoreService);
    expect(store).toBeTruthy();
  });

  it('Should be able to get the analytic', () => {
    const result = service.getAnalytic();

    expect(result).toEqual(testAnalytic);
  });
});
