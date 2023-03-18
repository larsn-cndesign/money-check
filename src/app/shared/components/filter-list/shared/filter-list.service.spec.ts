import { TestBed } from '@angular/core/testing';

import { FilterListService } from './filter-list.service';

describe('FilterListService', () => {
  let service: FilterListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
