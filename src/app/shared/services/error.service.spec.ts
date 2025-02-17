import { TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ErrorService } from './error.service';

describe('ErrorService', () => {
  let errorService: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot()],
    });
    errorService = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(errorService).toBeTruthy();
  });
});
