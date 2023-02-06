import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { BudgetYearService } from './budget-year.service';

describe('BudgetYearService', () => {
  let service: BudgetYearService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule, MatDialogModule],
    });
    service = TestBed.inject(BudgetYearService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
