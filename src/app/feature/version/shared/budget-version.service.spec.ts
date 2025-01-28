import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { BudgetVersionService } from './budget-version.service';

describe('BudgetVersionService', () => {
  let service: BudgetVersionService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(BudgetVersionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
