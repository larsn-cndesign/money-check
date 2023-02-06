import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';

import { BudgetVarianceService } from './budget-variance.service';

describe('BudgetVarianceService', () => {
  let service: BudgetVarianceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule],
    });
    service = TestBed.inject(BudgetVarianceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
