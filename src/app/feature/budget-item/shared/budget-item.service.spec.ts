import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { BudgetItemService } from './budget-item.service';

describe('BudgetItemService', () => {
  let service: BudgetItemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [SharedModule,TranslateModule.forRoot()],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    service = TestBed.inject(BudgetItemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
