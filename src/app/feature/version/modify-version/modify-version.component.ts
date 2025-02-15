import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { pipeTakeUntil } from 'src/app/shared/classes/common.fn';
import { DialogOptions } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.model';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.service';
import { CurrencyFormComponent } from 'src/app/shared/components/currency-form/currency-form.component';
import { CurrencyTableService } from 'src/app/shared/components/currency-table/shared/currency-table.service';
import { MessageBoxService } from 'src/app/shared/components/message-box/shared/message-box.service';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { CommonFormService } from 'src/app/shared/services/common-form.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { Currency, ManageBudgetYear } from '../../budget-year/shared/budget-year.model';
import { BudgetVersionService } from '../shared/budget-version.service';
import { duplicateValidator } from '../shared/budget-version.validators';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

/**
 * Class representing modification of a version.
 * @extends CommonFormService
 * @implements OnInit
 */
@Component({
  selector: 'app-modify-version',
  imports: [SharedModule, MatSelectModule, ReactiveFormsModule, CurrencyFormComponent, TranslatePipe],
  templateUrl: './modify-version.component.html',
  styleUrls: ['./modify-version.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModifyVersionComponent extends CommonFormService implements OnInit {
  /**
   * Initializes a strictly typed form group.
   * @public
   */
  form: FormGroup<{
    year: FormControl<number | null>;
    versionName: FormControl<string | null>;
    currencyForm: FormControl<any | null>;
  }>;

  /**
   * Signal representing the current state of `ManageBudgetYear`.
   * @public
   */
  budgetYear: Signal<ManageBudgetYear>;

  /**
   * Signal representing the current state of `Currency` objects.
   * @public
   */
  currencies: Signal<Currency[]>;

  /**
   * Getter property for the year form control
   * @returns The year form control
   */
  get year(): AbstractControl | null {
    return this.form.get('year');
  }

  /**
   * Getter property for the versionName form control
   * @returns The versionName form control
   */
  get versionName(): AbstractControl | null {
    return this.form.get('versionName');
  }

  /**
   * Initializes form controls with validation, observables and services.
   * @param versionService Manage versions.
   * @param currencyTableService Manage currencies.
   * @param budgetStateService Manage the state of a budget.
   * @param dialogService Confirmation dialog service.
   * @param messageBoxService Service to handle user messages.
   */
  constructor(
    private versionService: BudgetVersionService,
    private currencyTableService: CurrencyTableService,
    private budgetStateService: BudgetStateService,
    private dialogService: ConfirmDialogService,
    private messageBoxService: MessageBoxService,
    private translate: TranslateService
  ) {
    super();

    this.form = new FormGroup({
      year: new FormControl(-1, Validators.required),
      versionName: new FormControl('', [
        Validators.required,
        Validators.max(15),
        duplicateValidator(this.versionService),
      ]),
      currencyForm: new FormControl(),
    });

    this.budgetYear = this.versionService.getItem();
    this.currencies = this.currencyTableService.items;
  }

  /**
   * @description Set title of HTML document and get all availables budget years.
   */
  ngOnInit(): void {
    pipeTakeUntil(this.budgetStateService.getItem(), this.sub$)
      .pipe(
        tap((budgetState) => (this.budgetState = budgetState)),
        switchMap((budgetState: BudgetState) => {
          return pipeTakeUntil(this.versionService.getBudgetYear(budgetState.budgetId), this.sub$);
        })
      )
      .subscribe(() => this.pageLoaded.set(true));
  }

  /**
   * Handles selection changed event.
   * @description Get the current open version with its currencies for the selected year.
   * @param e The event object emitted by the select
   */
  onChangeYear(e: MatSelectChange): void {
    const budgetYear = this.versionService.getBudgetYearItem(+e.value);
    if (budgetYear) {
      pipeTakeUntil(this.versionService.getCurrentVersion(budgetYear.id), this.sub$).subscribe(
        (item: ManageBudgetYear) => {
          this.versionName?.setValue(item.version.versionName);
        }
      );
    }
  }

  /**
   * Handles a button click event.
   * @description Opens a confirmation dialog and if accepted the selected version is sent to the server to be deleted.
   * @param e The button event
   * @param item The selected category item to be deleted
   */
  onDeleteVersion(e: Event): void {
    e.stopPropagation(); // Do not highlight row

    const options: DialogOptions = {
      title: `${this.translate.instant('ctrl.button.delete.version')}`,
      message: this.translate.instant('dialog.message.delete_version', {
        name: this.versionName?.value,
        budget: this.budgetState.budgetName,
      }),
    };
    this.dialogService.open(options);

    pipeTakeUntil(this.dialogService.confirmed(), this.sub$).subscribe((confirmed) => {
      if (confirmed) {
        pipeTakeUntil(this.versionService.deleteVersion(), this.sub$).subscribe(() => {
          this.form.reset();
          this.messageBoxService.show();
        });
      }
    });
  }

  /**
   * Handles a form submit button event.
   * @description The version name is sent to the server for persistent storage of the updated version name.
   * @param formDirective Bind form controls to DOM. Used for clearing angular material validation errors.
   */
  onSaveVersion(formDirective: FormGroupDirective): void {
    const newVersionName = this.form.value.versionName;

    if (!newVersionName) return;

    if (this.form.controls.currencyForm.valid) {
      const options: DialogOptions = {
        title: `${this.translate.instant('dialog.title.change_currency')}`,
        message: this.translate.instant('dialog.message.update_version'),
      };
      this.dialogService.open(options);

      pipeTakeUntil(this.dialogService.confirmed(), this.sub$)
        .pipe(
          switchMap((confirmed) => {
            return confirmed ? pipeTakeUntil(this.versionService.updateVersion(newVersionName), this.sub$) : of(null);
          })
        )
        .subscribe((result) => {
          if (result) {
            this.reset(formDirective);
          }
        });
    } else {
      pipeTakeUntil(this.versionService.updateVersion(newVersionName), this.sub$).subscribe(() => {
        this.reset(formDirective);
      });
    }
  }

  /**
   * Clear form after updateing the version
   * @param formDirective Clear angular material validation errors.
   */
  private reset(formDirective: FormGroupDirective) {
    formDirective.resetForm();
    this.form.reset();
    this.messageBoxService.show();
  }
}
