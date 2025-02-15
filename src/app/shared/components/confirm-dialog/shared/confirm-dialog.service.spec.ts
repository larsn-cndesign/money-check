import { TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';

import { TranslateModule } from '@ngx-translate/core';
import { ConfirmDialogService } from './confirm-dialog.service';

describe('ConfirmDialogService', () => {
  let service: ConfirmDialogService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MatDialogModule, TranslateModule.forRoot()],
    });
    service = TestBed.inject(ConfirmDialogService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
