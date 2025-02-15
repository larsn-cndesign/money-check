import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { CommonFormService } from './common-form.service';

describe('CommonFormService', () => {
  let service: CommonFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, TranslateModule.forRoot()],
    });
    service = TestBed.inject(CommonFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
