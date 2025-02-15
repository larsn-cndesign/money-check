import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterModule, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { AppComponent } from './app.component';
import { DateAdapter, MAT_DATE_LOCALE, NativeDateAdapter } from '@angular/material/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterModule.forRoot([]), RouterOutlet, TranslateModule.forRoot()],
      providers: [
        provideHttpClient(),
        { provide: DateAdapter, useClass: NativeDateAdapter }, // Provide the default DateAdapter (or your custom adapter)
        { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }, // Set the default locale for dates (can be dynamic based on tests)
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  // ----------------------------------------------------------------
  // INTEGRATION TESTS
  // ----------------------------------------------------------------

  it('should have a router outlet', () => {
    const de = fixture.debugElement.query(By.directive(RouterOutlet));

    expect(de).not.toBeNull();
  });

  it('should have a navbar', () => {
    const de = fixture.debugElement.query(By.css('app-navbar'));

    expect(de).not.toBeNull();
  });
});
