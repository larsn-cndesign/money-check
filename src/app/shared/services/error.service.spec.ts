import { TestBed } from '@angular/core/testing';
import { ErrorService } from './error.service';

describe('ErrorService', () => {
  let errorService: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    errorService = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(errorService).toBeTruthy();
  });
});
