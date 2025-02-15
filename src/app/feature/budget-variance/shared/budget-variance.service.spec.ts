import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { BudgetVarianceService } from './budget-variance.service';

describe('BudgetVarianceService', () => {
  let service: BudgetVarianceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, TranslateModule.forRoot()],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(BudgetVarianceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
