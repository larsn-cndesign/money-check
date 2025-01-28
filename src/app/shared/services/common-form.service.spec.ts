import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { CommonFormService } from './common-form.service';

describe('CommonFormService', () => {
  let service: CommonFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule],
    });
    service = TestBed.inject(CommonFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
