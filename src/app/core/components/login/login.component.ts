import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { pipeTakeUntil } from 'src/app/shared/classes/common.fn';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.service';
import { MessageBoxService } from 'src/app/shared/components/message-box/shared/message-box.service';
import { AuthService } from 'src/app/shared/services/auth.service';
import { CommonFormService } from 'src/app/shared/services/common-form.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserCredential } from '../../models/user-credential.model';

/**
 * Class representing a login page.
 */
@Component({
    selector: 'app-login',
    imports: [SharedModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent extends CommonFormService {
  /**
   * Initializes a strictly typed form group.
   * @public
   */
  form: FormGroup<{
    email: FormControl<string | null>;
    password: FormControl<string | null>;
  }>;

  /**
   * A boolean flag that indicates if the login credentials were valid. If the server returns an error
   * the `invalidLogin` is set to true and reveals the error message in the template.
   * @public
   */
  invalidLogin = false;

  /**
   * A boolean flag that indicates if the password should be readable to the user or not.
   * The user can toggle the state, which is managed in the template.
   * @public
   */
  hidePassword = true;

  /**
   * Getter property for the user's email from control
   * @returns The user's email control
   */
  get email(): AbstractControl | null {
    return this.form.get('email');
  }

  /**
   * Getter property for the user's password form control
   * @returns the user's password control
   */
  get password(): AbstractControl | null {
    return this.form.get('password');
  }

  /**
   * Initializes form controls with validation and services
   * @param authService Manage user authenticaton
   * @param router Navigation service
   * @param route Handle url parameters
   * @param errorService Application error service.
   * @param dialogService Confirmation dialog service.
   * @param messageBoxService Service to handle user messages.
   */
  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    protected errorService: ErrorService,
    protected dialogService: ConfirmDialogService,
    protected messageBoxService: MessageBoxService
  ) {
    super(errorService, dialogService, messageBoxService);

    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  /**
   * Send user credentials to server for validation and redirect user to start page
   * or to page beeing redirected from, if successful.
   * If validation fails, display error message to the user.
   */
  login(): void {
    const val = this.form.getRawValue();

    if (val.email && val.password) {
      const credentials: UserCredential = {
        email: val.email,
        password: val.password,
      };

      pipeTakeUntil(this.authService.login(credentials), this.sub$).subscribe((result: boolean) => {
        if (result) {
          const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          this.router.navigate([returnUrl || '/feature/home']);
        } else {
          this.invalidLogin = true;
        }
      });
    }
  }
}
