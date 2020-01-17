import { TestBed } from '@angular/core/testing';

import { AnalyticStoreService } from './analytic-store.service';
import { testAnalytic } from '../services/test/test.analytic';

describe('AnalyticStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnalyticStoreService = TestBed.get(AnalyticStoreService);
    expect(service).toBeTruthy();
  });

  it('Should be able to get the analytic', () => {
    const service: AnalyticStoreService = TestBed.get(AnalyticStoreService);
    let result = service.getAnalytic();
    expect(result).toEqual(testAnalytic);
  });
});
