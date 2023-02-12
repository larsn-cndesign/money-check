import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatSelectChange } from '@angular/material/select';
import { Sort } from '@angular/material/sort';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { lineCount, pipeTakeUntil, toNumber } from 'src/app/shared/classes/common.fn';
import { DialogOptions } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.model';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.service';
import { MessageBoxService } from 'src/app/shared/components/message-box/shared/message-box.service';
import { Modify } from 'src/app/shared/enums/enums';
import { ImmediateUntouchedErrorMatcher } from 'src/app/shared/models/immediate-error-state';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { CommonFormService } from 'src/app/shared/services/common-form.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { isNumberValidator } from 'src/app/shared/validators/common.validators';
import { ActualItem, CurrencyItem, ManageActualItem } from './shared/actual-item.model';
import { ActualItemService } from './shared/actual-item.service';
import { budgetYearNotExistValidator } from './shared/actual-item.validators';

/**
 * Class representing actual transactions of expenses.
 * @extends CommonFormService
 * @implements OnInit
 * @todo Remember sort order when filtering.
 */
@Component({
  selector: 'app-actual-item',
  templateUrl: './actual-item.component.html',
  styleUrls: ['./actual-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActualItemComponent extends CommonFormService implements OnInit {
  /**
   * Initializes a strictly typed form group.
   * @public
   */
  form: FormGroup<{
    action: FormControl<string>;
    id: FormControl<number>;
    category: FormControl<number | null>;
    trip: FormControl<number>;
    purchaseDate: FormControl<Date | null>;
    currency: FormControl<string | null>;
    amount: FormControl<number | null>;
    note: FormControl<string | null>;
  }>;

  /**
   * An observer of `ManageActualItem` class.
   * @public
   */
  manageActualItem$: Observable<ManageActualItem>;

  /**
   * An observer of an array of ActualItem's.
   * @public
   */
  actualItems$: Observable<ActualItem[]>;

  /**
   * A property that holds all columns to be displayed in a table
   * @public
   */
  displayedColumns: string[] = ['purchaseDate', 'categoryName', 'tripName', 'currency', 'amount', 'note', 'delete'];

  /**
   * A property that holds the sum of all transactions in a specific currency
   * @public
   */
  sumCurrency!: number;

  /**
   * A property holdning the currency selected for calculating the total amount of filtered actual items.
   * @private
   * @default '' No currency selected.
   */
  selectedCurrency = '';

  /**
   * A property to hold a custom error state matcher.
   * @public
   */
  untouchedMatcher = new ImmediateUntouchedErrorMatcher();

  /**
   * A property to hold the number of rows to display for the note form control.
   * @public
   * @default 1 Show one row.
   */
  noteFieldRows = 1;

  /**
   * A Subject that emits and listen to value changes of the note filter input.
   * @private
   * @default new Subject<string>()
   */
  private filterNote$ = new Subject<string>();

  /**
   * Getter property for the action control
   * @returns The action control
   */
  get action(): AbstractControl | null {
    return this.form.get('action');
  }

  /**
   * Getter property for the category control
   * @returns The category control
   */
  get category(): AbstractControl | null {
    return this.form.get('category');
  }

  /**
   * Getter property for the trip control
   * @returns The trip control
   */
  get trip(): AbstractControl | null {
    return this.form.get('trip');
  }

  /**
   * Getter property for the purchaseDate control
   * @returns The purchaseDate control
   */
  get purchaseDate(): AbstractControl | null {
    return this.form.get('purchaseDate');
  }

  /**
   * Getter property for the currency form control
   * @returns The currency form control
   */
  get currency(): AbstractControl | null {
    return this.form.get('currency');
  }

  /**
   * Getter property for the amount form control
   * @returns The amount form control
   */
  get amount(): AbstractControl | null {
    return this.form.get('amount');
  }

  /**
   * Getter property for the v form control
   * @returns The note form control
   */
  get note(): AbstractControl | null {
    return this.form.get('note');
  }

  /**
   * Get error messages for an invalid form control
   * @param ctrl The form control
   * @param {string} [title] The title of the control (optional)
   * @returns The error message as a string
   */
  getErrorMessage(control: AbstractControl | null, title?: string): string {
    return this.errorService.getFormErrorMessage(control, title);
  }

  /**
   * Initializes form controls with validation, observables and services.
   * @param actualItemService Manage actual item expenses.
   * @param budgetStateService Manage the state of a budget.
   * @param errorService Application error service.
   * @param dialogService Confirmation dialog service.
   * @param messageBoxService Service to handle user messages.
   */
  constructor(
    private actualItemService: ActualItemService,
    private budgetStateService: BudgetStateService,
    protected errorService: ErrorService,
    protected dialogService: ConfirmDialogService,
    protected messageBoxService: MessageBoxService
  ) {
    super(errorService, dialogService, messageBoxService);

    this.form = new FormGroup({
      action: new FormControl(Modify.Add.toString(), { nonNullable: true }),
      id: new FormControl(-1, { nonNullable: true }),
      category: new FormControl(-1, Validators.required),
      trip: new FormControl(-1, { validators: Validators.required, nonNullable: true }),
      purchaseDate: new FormControl(new Date(), [
        Validators.required,
        budgetYearNotExistValidator(this.actualItemService),
      ]),
      currency: new FormControl<string | null>(null, Validators.required),
      amount: new FormControl<number | null>(null, [Validators.required, isNumberValidator()]),
      note: new FormControl(''),
    });

    this.manageActualItem$ = this.actualItemService.item$;
    this.actualItems$ = this.actualItemService.items$;
  }

  /**
   * @description Set title of HTML document and get acutal items from server
   */
  ngOnInit(): void {
    pipeTakeUntil(this.budgetStateService.getBudgetStateInStore(), this.sub$)
      .pipe(
        tap((budgetState) => {
          this.budgetState = budgetState;
        }),
        switchMap((budgetState: BudgetState) => {
          return pipeTakeUntil(this.actualItemService.getActualItems(budgetState.budgetId), this.sub$);
        })
      )
      .subscribe(() => {
        this.selectedCurrency = '';
        this.pageLoaded = true;
      });

    pipeTakeUntil(this.filterNote$, this.sub$)
      .pipe(debounceTime(500), distinctUntilChanged())
      .subscribe((note) => {
        this.actualItemService.setFilterItem(note, 'note');
        this.getActualItems();
      });
  }

  /**
   * A method that listens to the focus event of HTMLElement emitted by FucusDirective.
   */
  onFocus(): void {
    this.noteFieldRows = 4;
  }

  /**
   * A method that listens to the focusout event of HTMLElement emitted by FucusDirective.
   */
  onBlur(): void {
    this.noteFieldRows = 1;
  }

  /**
   * Handles change event of a `mat-radio-group`.
   * @description If adding an item, reset form and table state
   */
  onChangeAction(): void {
    if (this.action?.value === Modify.Add) {
      this.actualItemService.clearSelection();
      this.resetForm();
    }
  }

  /**
   * Handles date changed event of a date picker control. Reports an error if the input is invalid.
   * @param e Event of the date picker
   * @param key The name of the control
   */
  onDateChanged(e: MatDatepickerInputEvent<Date>): void {
    if (e.value === null) {
      this.purchaseDate?.setErrors({ invalidDate: true });
    } else {
      this.purchaseDate?.setValue(e.value);
    }
  }

  /**
   * Handles a button click event.
   * @description Opens a confirmation dialog and if accepted the item is sent to the server to be deleted.
   * @param e The button event.
   * @param item The slected actual item to be deleted.
   */
  onDeleteItem(e: Event, item: ActualItem): void {
    e.stopPropagation(); // Do not highlight row

    const options: DialogOptions = {
      title: 'Ta bort transaktion?',
      message: `Klicka OK för att ta bort den markerade transaktionen från budget ${this.budgetState.budgetName}.`,
    };
    this.dialogService.open(options);

    pipeTakeUntil(this.dialogService.confirmed(), this.sub$).subscribe((confirmed) => {
      if (confirmed) {
        this.modifyItem(item, Modify.Delete);
      }
    });
  }

  /**
   * Handles a table row click event and load form controls with values from the selected item.
   * @param item The selected actual item.
   */
  onSelectItem(item: ActualItem): void {
    this.actualItemService.selectItem(item);

    this.noteFieldRows = lineCount(item.note) > 1 ? 4 : 1;

    this.form.patchValue({
      action: Modify.Edit,
      id: item.id,
      category: item.categoryId,
      trip: item.tripId,
      purchaseDate: item.purchaseDate,
      currency: item.currency,
      amount: item.amount,
      note: item.note,
    });
  }

  /**
   * Handles a form submit button event and sends item to be saved to the server.
   */
  onSaveActualItem(): void {
    const val = this.form.getRawValue();

    if (val.category && val.purchaseDate && val.currency && val.amount) {
      const actualItem = new ActualItem();
      actualItem.id = val.id;
      actualItem.budgetId = BudgetState.getSelectedBudgetId();
      actualItem.categoryId = val.category;
      actualItem.tripId = val.trip;
      actualItem.purchaseDate = val.purchaseDate;
      actualItem.currency = val.currency;
      actualItem.amount = toNumber(val.amount);
      actualItem.note = val.note ? val.note : '';

      this.modifyItem(actualItem, val.action);
    }
  }

  /**
   * Handles selection change event on the select.
   * @description Summerize all items in the selected currency.
   * @param e The event object emitted by the select.
   */
  onChangeSumCurrency(e: MatSelectChange): void {
    this.selectedCurrency = e.value as string;
    this.calculateTotalAmount();
  }

  /**
   * Handles selection change event on the select.
   * @description Get actual items for a combination of all filters from the server.
   * @param e The event object emitted by the select.
   * @param filterType A value representing the type of filter used i.e. 'year'.
   */
  onChangeFilter(e: MatSelectChange, filterType: string): void {
    this.actualItemService.setFilterItem(e.value, filterType);
    this.getActualItems();
  }

  /**
   * Handles input event of the note filter field.
   * @description Emits the input value to subscribers, essentially waiting for the user to stop
   * writing before sending requesting the server with the note filter.
   * @param e The event object emitted by the select.
   */
  OnFilterNote(e: Event): void {
    const value = (e.target as HTMLInputElement).value;
    this.filterNote$.next(value);
  }

  /**
   * Sort table based on selected column. All columns except delete column can be sorted.
   * @param sort Holds the name of the column and sorting direction.
   */
  onSortData(sort: Sort): void {
    this.actualItemService.sortData(sort);
  }

  // ------------------------------------
  // Private helper methods
  // ------------------------------------

  /**
   * Helper method to get filtered actual items from server.
   */
  private getActualItems(): void {
    pipeTakeUntil(this.actualItemService.getActualItems(this.budgetState.budgetId), this.sub$).subscribe((item) => {
      this.calculateTotalAmount();
    });
  }

  /**
   * Helper method to modify an item and save it in server.
   * @param item The modified item.
   * @param action The type och action to handle (add or edit).
   */
  private modifyItem(item: ActualItem, action: string): void {
    pipeTakeUntil(this.actualItemService.modifyActualItem(item, action), this.sub$).subscribe(() => {
      this.calculateTotalAmount();
      this.resetForm();
      this.messageBoxService.show();
    });
  }

  /**
   * Calculates the total amount for a currency based on the current filter.
   */
  private calculateTotalAmount(): void {
    if (this.selectedCurrency !== '') {
      let amount = 0;
      const selectedItem = this.findCurrency(this.selectedCurrency);

      this.actualItemService.items.forEach((x) => {
        if (!selectedItem || x.currency === selectedItem.currency) {
          amount += x.amount;
        } else {
          const currencyItem = this.findCurrency(x.currency);
          if (currencyItem) {
            amount += x.amount * (currencyItem.budgetRate / selectedItem.budgetRate);
          }
        }
      });
      this.sumCurrency = amount;
    }
  }

  /**
   * Helper method to search for a currency in store.
   * @param currency The currency to serach for.
   * @returns A `CurrencyItem` object if found. Otherwise undefined.
   */
  private findCurrency(currency: string): CurrencyItem | undefined {
    return this.actualItemService.item.currencyItems.find((c) => c.currency === currency);
  }

  /**
   * Helper method to reset applicable form controls and preset select values.
   */
  private resetForm(): void {
    this.category?.reset();
    this.trip?.reset();
    this.currency?.reset();
    this.amount?.reset();
    this.note?.reset();

    this.form.patchValue({ action: Modify.Add, trip: -1, currency: '' });
  }
}
