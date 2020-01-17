import { TestBed } from '@angular/core/testing';

import { AnalyticStoreService } from './analytic-store.service';

describe('AnalyticStoreService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AnalyticStoreService = TestBed.get(AnalyticStoreService);
    expect(service).toBeTruthy();
  });
});
