import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { BudgetStateService } from './budget-state.service';

describe('BudgetStateService', () => {
  let service: BudgetStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(BudgetStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
