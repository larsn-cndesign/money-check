import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import {
  click,
  expectContainedText,
  expectText,
  findEl,
  markFieldAsTouched,
  setFieldValue,
} from '../../../mock-backend/element.spec-helper';
import { UserCredential } from '../../models/user-credential.model';
import { LoginComponent } from './login.component';

/**
 * Fake AuthService class
 */
class FakeAuthService implements Partial<AuthService> {
  login(): Observable<boolean> {
    return of(true);
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let activatedRoute: ActivatedRoute;
  let fakeAuthService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatDialogModule,
        RouterTestingModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatIconModule,
        MatInputModule,
      ],
      declarations: [LoginComponent],
      providers: [{ provide: AuthService, useClass: FakeAuthService }],
    }).compileComponents();
  });

  beforeEach(() => {
    fakeAuthService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    activatedRoute = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(component).toBeTruthy();
  });

  it('submits the form successfully and navigates to provided returnUrl page', () => {
    // Arrange
    const userCred: UserCredential = {
      email: 'test@test.com',
      password: '123456',
    };

    spyOn(router, 'navigate');
    spyOn(activatedRoute.snapshot.queryParamMap, 'get').and.returnValue('/category');
    spyOn(fakeAuthService, 'login').and.returnValue(of(true));

    // Act
    setFieldValue(fixture, 'email', userCred.email);
    setFieldValue(fixture, 'password', userCred.password);
    fixture.detectChanges();

    findEl(fixture, 'form').triggerEventHandler('submit');

    // Assert
    expect(router.navigate).toHaveBeenCalledWith(['/category']);
    expect(fakeAuthService.login).toHaveBeenCalledWith(userCred);
  });

  it('submits the form successfully and navigates to home page', () => {
    const userCred: UserCredential = {
      email: 'test@test.com',
      password: '123456',
    };

    spyOn(router, 'navigate');
    spyOn(fakeAuthService, 'login').and.returnValue(of(true));

    setFieldValue(fixture, 'email', userCred.email);
    setFieldValue(fixture, 'password', userCred.password);
    fixture.detectChanges();

    findEl(fixture, 'form').triggerEventHandler('submit');

    expect(router.navigate).toHaveBeenCalledWith(['/feature/home']);
  });

  it('fails if required fields are empty', () => {
    const requiredFields = ['email', 'password'];

    requiredFields.forEach((field) => {
      markFieldAsTouched(fixture, field);
      setFieldValue(fixture, field, '');

      fixture.detectChanges();

      expectContainedText(fixture, `${field}-error`, 'måste ange');
    });
  });

  it('fails if email is not valid', () => {
    markFieldAsTouched(fixture, 'email');
    setFieldValue(fixture, 'email', 'notavalidemail');

    fixture.detectChanges();

    expectText(fixture, 'email-error', 'Email är inte giltigt');
  });

  it('fails if password is less than 6 characters', () => {
    markFieldAsTouched(fixture, 'password');
    setFieldValue(fixture, 'password', '12345');

    fixture.detectChanges();

    expectText(fixture, 'password-error', 'Lösenord måste vara minst 6 tecken');
  });

  it('fails to login if server returns error', () => {
    const userCred: UserCredential = {
      email: 'test@test.com',
      password: '12345', // <-- fake invalid password
    };

    spyOn(fakeAuthService, 'login').and.returnValue(of(false));

    setFieldValue(fixture, 'email', userCred.email);
    setFieldValue(fixture, 'password', userCred.password);
    fixture.detectChanges();

    findEl(fixture, 'form').triggerEventHandler('submit');

    fixture.detectChanges();

    expect(findEl(fixture, 'server-error')).toBeTruthy();
    expect(fakeAuthService.login).toHaveBeenCalledWith(userCred);
  });

  it('toggles the password display', () => {
    setFieldValue(fixture, 'password', 'top secret');
    const passwordEl = findEl(fixture, 'password');
    expect(passwordEl.attributes.type).toBe('password');

    click(fixture, 'show-password');
    fixture.detectChanges();

    expect(passwordEl.attributes.type).toBe('text');

    click(fixture, 'show-password');
    fixture.detectChanges();

    expect(passwordEl.attributes.type).toBe('password');
  });
});
