import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { CommonFormService } from './common-form.service';
import { CustomDateAdapter } from './custom-date-adapter.service';

describe('CustomDateAdapter', () => {
  let service: CustomDateAdapter;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
    });
    service = TestBed.inject(CustomDateAdapter);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
