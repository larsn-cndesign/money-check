import { TestBed } from '@angular/core/testing';

import { CurrencyTableService } from './currency-table.service';

describe('CurrencyTableService', () => {
  let service: CurrencyTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CurrencyTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
