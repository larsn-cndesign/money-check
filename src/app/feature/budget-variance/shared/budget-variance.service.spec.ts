import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';

import { BudgetVarianceService } from './budget-variance.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('BudgetVarianceService', () => {
  let service: BudgetVarianceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [SharedModule],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(BudgetVarianceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
