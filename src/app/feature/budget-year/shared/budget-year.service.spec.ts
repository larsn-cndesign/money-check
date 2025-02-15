import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BudgetYearService } from './budget-year.service';

describe('BudgetYearService', () => {
  let service: BudgetYearService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, MatDialogModule, TranslateModule.forRoot()],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(BudgetYearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
