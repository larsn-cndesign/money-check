import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { SharedModule } from 'src/app/shared/shared.module';
import { TripService } from './trip.service';
import { TranslateModule } from '@ngx-translate/core';

describe('TripService', () => {
  let service: TripService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, TranslateModule.forRoot()],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    service = TestBed.inject(TripService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
