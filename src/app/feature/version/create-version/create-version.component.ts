import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { switchMap, tap } from 'rxjs/operators';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { pipeTakeUntil } from 'src/app/shared/classes/common.fn';
import { CurrencyFormComponent } from 'src/app/shared/components/currency-form/currency-form.component';
import { CurrencyTableService } from 'src/app/shared/components/currency-table/shared/currency-table.service';
import { MessageBoxService } from 'src/app/shared/components/message-box/shared/message-box.service';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { CommonFormService } from 'src/app/shared/services/common-form.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { BudgetYear, Currency, ManageBudgetYear } from '../../budget-year/shared/budget-year.model';
import { BudgetVersionService } from '../shared/budget-version.service';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Class representing the creating of a version.
 * @extends CommonFormService
 * @implements OnInit
 */
@Component({
  selector: 'app-create-version',
  imports: [
    SharedModule,
    MatSelectModule,
    ReactiveFormsModule,
    CurrencyFormComponent,
    MatCheckboxModule,
    TranslatePipe,
  ],
  templateUrl: './create-version.component.html',
  styleUrls: ['./create-version.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateVersionComponent extends CommonFormService implements OnInit {
  /**
   * Initializes a strictly typed form group.
   * @public
   */
  form: FormGroup<{
    budgetYearId: FormControl<number | null>;
    currencyForm: FormControl<any | null>;
    copy: FormControl<boolean>;
  }>;

  /**
   * Signal representing the current state of `ManageBudgetYear`.
   * @public
   */
  budgetYear: Signal<ManageBudgetYear>;

  /**
   * Signal representing the current state of `Currency`.
   * @public
   */
  currencies: Signal<Currency[]>;

  /**
   * Getter property for the budgetYearId form control
   * @returns The budgetYearId form control
   */
  get budgetYearId(): AbstractControl | null {
    return this.form.get('budgetYearId');
  }

  /**
   * Initializes form controls with validation, observables and services.
   * @param versionService Manage versions.
   * @param currencyTableService Manage currencies.
   * @param budgetStateService Manage the state of a budget.
   * @param errorService Application error service.
   * @param dialogService Confirmation dialog service.
   * @param messageBoxService Service to handle user messages.
   */
  constructor(
    private versionService: BudgetVersionService,
    private currencyTableService: CurrencyTableService,
    private budgetStateService: BudgetStateService,
    private messageBoxService: MessageBoxService
  ) {
    super();

    this.form = new FormGroup({
      budgetYearId: new FormControl<number | null>(-1, Validators.required),
      currencyForm: new FormControl(),
      copy: new FormControl<boolean>(true, { nonNullable: true }),
    });

    this.budgetYear = this.versionService.getItem();
    this.currencies = this.currencyTableService.items;
  }

  /**
   * @description Set title of HTML document, get availables budget years and listen to budget state changes.
   */
  ngOnInit(): void {
    pipeTakeUntil(this.budgetStateService.getItem(), this.sub$)
      .pipe(
        tap((budgetState) => (this.budgetState = budgetState)),
        switchMap((budgetState: BudgetState) => {
          return pipeTakeUntil(this.versionService.getBudgetYear(budgetState.budgetId), this.sub$);
        })
      )
      .subscribe((budgetYear: ManageBudgetYear) => {
        this.form.patchValue({ copy: budgetYear.copy });
        this.pageLoaded.set(true);
      });
  }

  /**
   * Handles selection changed event.
   * @description Get the current open version with its currencies for the selected year.
   * @param e The event object emitted by the select
   */
  onChangeYear(e: MatSelectChange): void {
    this.getCurrentVersion(+e.value);
  }

  /**
   * Handles change event of `mat-checkbox`.
   * @description If checked, currencies can not be removed and all budget items is copied from the current
   * open version to the new version.
   * @param e Event of the checkbox
   */
  onChangeCopyBudget(e: MatCheckboxChange): void {
    this.form.patchValue({ copy: e.checked });
    this.versionService.changeCopyBudget(e.checked);

    if (e.checked && this.budgetYearId && this.budgetYearId.value !== -1) {
      this.getCurrentVersion(+this.budgetYearId.value);
    }
  }

  /**
   * Handles a form submit button event.
   * @description Form control values and currencies are sent to the server for persistent storage creating a new version.
   * @param formDirective Bind form controls to DOM. Used for clearing angular material validation errors.
   */
  onCreateVersion(formDirective: FormGroupDirective): void {
    const val = this.form.getRawValue();

    if (val.budgetYearId) {
      const budgetYear = this.versionService.getBudgetYearItem(val.budgetYearId);
      if (budgetYear) {
        const manageBudgetYear = this.createBudgetYear(budgetYear, val.copy);

        pipeTakeUntil(this.versionService.addVersion(manageBudgetYear), this.sub$).subscribe(() => {
          formDirective.resetForm();
          this.form.reset();
          this.messageBoxService.show();
        });
      }
    }
  }

  // ------------------------------------
  // Private helper methods
  // ------------------------------------

  /**
   * Helper method to get the an open version with its currencies for the selected year.
   * @param budgetYearId Selected identity number of a year to get the current version for.
   */
  getCurrentVersion(budgetYearId: number): void {
    const budgetYear = this.versionService.getBudgetYearItem(budgetYearId);
    if (budgetYear) {
      pipeTakeUntil(this.versionService.getCurrentVersion(budgetYear.id), this.sub$).subscribe();
    }
  }

  /**
   * Create a `ManageBudgetYear` object.
   * @param year The budget year to create.
   * @param copyVersion A flag that indicates if previous version including budget items should be copied.
   * @returns A `ManageBudgetYear` object.
   */
  private createBudgetYear(budgetYear: BudgetYear, copyVersion: boolean): ManageBudgetYear {
    const item = new ManageBudgetYear();

    item.budgetYear = budgetYear;
    item.copy = copyVersion;
    item.currencies = this.currencyTableService.items();

    return item;
  }
}
