import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { MessageBoxModule } from './shared/components/message-box/message-box.module';
import { SpinnerModule } from './shared/components/spinner/spinner.module';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, CoreModule, MessageBoxModule, SpinnerModule],
      declarations: [AppComponent],
    });

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  // it(`should have as title 'money-check'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.componentInstance;
  //   expect(app.title).toEqual('money-check');
  // });

  // it('should render title', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement;
  //   expect(compiled.querySelector('.content span').textContent).toContain('money-check app is running!');
  // });

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
