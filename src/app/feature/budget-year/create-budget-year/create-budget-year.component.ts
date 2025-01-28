import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCheckboxChange, MatCheckboxModule } from '@angular/material/checkbox';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { pipeTakeUntil } from 'src/app/shared/classes/common.fn';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.service';
import { CurrencyTableService } from 'src/app/shared/components/currency-table/shared/currency-table.service';
import { MessageBox } from 'src/app/shared/components/message-box/shared/message-box.model';
import { MessageBoxService } from 'src/app/shared/components/message-box/shared/message-box.service';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { CommonFormService } from 'src/app/shared/services/common-form.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { BudgetYear, Currency, ManageBudgetYear } from '../shared/budget-year.model';
import { BudgetYearService } from '../shared/budget-year.service';
import { yearExistValidator } from '../shared/budget-year.validators';
import { SharedModule } from 'src/app/shared/shared.module';

/**
 * Class representing creation of a new budget year.
 * @extends CommonFormService
 * @implements OnInit
 */
@Component({
    selector: 'app-create-budget-year',
    imports: [SharedModule, ReactiveFormsModule, MatCheckboxModule],
    templateUrl: './create-budget-year.component.html',
    styleUrls: ['./create-budget-year.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateBudgetYearComponent extends CommonFormService implements OnInit {
  /**
   * Initializes a strictly typed form group.
   * @public
   */
  form: FormGroup<{
    year: FormControl<number | null>;
    currencyForm: FormControl<any | null>;
    copy: FormControl<boolean>;
  }>;

  /**
   * An observer of `ManageBudgetYear` class.
   * @public
   */
  budgetYear$: Observable<ManageBudgetYear>;

  /**
   * An observer of an array of `Currency` objects.
   * @public
   */
  currencies$: Observable<Currency[]>;

  /**
   * Getter property for the year form control
   * @returns The year form control
   */
  get year(): AbstractControl | null {
    return this.form.get('year');
  }

  /**
   * Initializes form controls with validation, observables and services.
   * @param budgetYearService Manage budget year.
   * @param currencyTableService Manage currencies.
   * @param budgetStateService Manage the state of a budget.
   * @param errorService Application error service.
   * @param dialogService Confirmation dialog service.
   * @param messageBoxService Service to handle user messages.
   */
  constructor(
    private budgetYearService: BudgetYearService,
    private currencyTableService: CurrencyTableService,
    private budgetStateService: BudgetStateService,
    protected errorService: ErrorService,
    protected dialogService: ConfirmDialogService,
    protected messageBoxService: MessageBoxService
  ) {
    super(errorService, dialogService, messageBoxService);

    this.form = new FormGroup({
      year: new FormControl<number | null>(null, [
        Validators.required,
        Validators.minLength(4),
        Validators.maxLength(4),
        yearExistValidator(this.budgetYearService),
      ]),
      currencyForm: new FormControl(),
      copy: new FormControl<boolean>(true, { nonNullable: true }),
    });

    this.budgetYear$ = this.budgetYearService.item$;
    this.currencies$ = this.currencyTableService.items$;
  }

  /**
   * @description Set title of HTML document, get availables budget years and listen to budget state changes.
   */
  ngOnInit(): void {
    pipeTakeUntil(this.budgetStateService.item$, this.sub$)
      .pipe(
        tap((budgetState) => {
          this.budgetState = budgetState;
        }),
        switchMap((budgetState: BudgetState) => {
          return pipeTakeUntil(this.budgetYearService.getBudgetYear(budgetState.budgetId), this.sub$);
        })
      )
      .subscribe((budgetYear: ManageBudgetYear) => {
        this.year?.setValue(null);
        this.form.get('copy')?.setValue(budgetYear.copy);
        this.pageLoaded$.next(true);
      });
  }

  /**
   * Handles change event of `mat-checkbox`.
   * @description If checked, currencies and all budget items is copied from the latest open version to the new budget year.
   * @param e Event of the checkbox
   */
  onChangeCopyBudget(e: MatCheckboxChange): void {
    this.budgetYearService.changeCopyBudget(e.checked);
  }

  /**
   * Handles a form submit button event.
   * @description A budget year object and is sent to the server for persistent storage of a new budget year.
   * @param formDirective Bind form controls to DOM. Used for clearing angular material validation errors.
   */
  onCreateBudgetYear(formDirective: FormGroupDirective): void {
    const val = this.form.getRawValue();

    if (val.year) {
      const budgetYear = this.createBudgetYear(+val.year, val.copy);

      pipeTakeUntil(this.budgetYearService.addBudgetYear(budgetYear), this.sub$).subscribe(() => {
        formDirective.resetForm();
        this.form.reset();
        this.messageBoxService.show(
          new MessageBox('Budgetår skapat', 'Budgetår med version och valutor har skapats.', 'success')
        );
      });
    }
  }

  /**
   * Creates a ManageBudgetYear object.
   * @param year The budget year to create.
   * @param copyVersion A flag that indicates if previous version including budget items should be copied.
   * @returns A ManageBudgetYear object.
   */
  private createBudgetYear(year: number, copyVersion: boolean): ManageBudgetYear {
    const item = new ManageBudgetYear();

    const budgetYear: BudgetYear = {
      id: -1,
      budgetId: BudgetState.getSelectedBudgetId(),
      year,
    };
    item.budgetYear = budgetYear;
    item.copy = copyVersion;
    item.currencies = this.currencyTableService.items;

    return item;
  }
}
