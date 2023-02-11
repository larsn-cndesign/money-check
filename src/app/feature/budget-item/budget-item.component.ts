import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { pipeTakeUntil, toNumber } from 'src/app/shared/classes/common.fn';
import { DialogOptions } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.model';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.service';
import { MessageBoxService } from 'src/app/shared/components/message-box/shared/message-box.service';
import { Modify } from 'src/app/shared/enums/enums';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { CommonFormService } from 'src/app/shared/services/common-form.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { isNumberValidator } from 'src/app/shared/validators/common.validators';
import { BudgetItemService } from './shared/budget-item.service';
import { uniqueValidator } from './shared/budget-item.validators';
import { BudgetItem, ManageBudgetItem } from './shared/butget-item.model';

/**
 * Class representing budget transactions.
 * @extends CommonFormService
 * @implements OnInit
 */
@Component({
  selector: 'app-budget-item',
  templateUrl: './budget-item.component.html',
  styleUrls: ['./budget-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BudgetItemComponent extends CommonFormService implements OnInit {
  /**
   * Initializes a strictly typed form group.
   * @public
   */
  form: FormGroup<{
    action: FormControl<string>;
    id: FormControl<number>;
    category: FormControl<number | null>;
    currency: FormControl<string | null>;
    note: FormControl<string | null>;
    versionId: FormControl<number | null>;
    budgetYearId: FormControl<number | null>;
    versionName: FormControl<string | null>;
    unit: FormControl<number | null>;
    unitValue: FormControl<number | null>;
  }>;

  /**
   * An observer of `ManageBudgetItem` class.
   * @public
   */
  manageBudgetItem$: Observable<ManageBudgetItem>;

  /**
   * An observer of an array of `BudgetItem` objects.
   * @public
   */
  budgetItems$: Observable<BudgetItem[]>;

  /**
   * A property that holds all columns to be displayed in a table
   * @public
   */
  displayedColumns: string[] = ['category', 'unit', 'currency', 'unitValue', 'note', 'delete'];

  /**
   * A boolean flag that indicates if the selected unit use currency or not.
   * @public
   */
  useCurrency = true;

  /**
   * A property to hold the number of rows to display for the note form control.
   * @public
   * @default 1 Show one row.
   */
  noteFieldRows = 1;

  /**
   * Getter property for the action form control
   * @returns The action form control
   */
  get action(): AbstractControl | null {
    return this.form.get('action');
  }

  /**
   * Getter property for the budgetYearId form control
   * @returns The budgetYearId form control
   */
  get budgetYearId(): AbstractControl | null {
    return this.form.get('budgetYearId');
  }

  /**
   * Getter property for the action form control
   * @returns The action form control
   */
  get category(): AbstractControl | null {
    return this.form.get('category');
  }

  /**
   * Getter property for the action form control
   * @returns The action form control
   */
  get unit(): AbstractControl | null {
    return this.form.get('unit');
  }

  /**
   * Getter property for the action form control
   * @returns The action form control
   */
  get currency(): AbstractControl | null {
    return this.form.get('currency');
  }

  /**
   * Getter property for the action form control
   * @returns The action form control
   */
  get unitValue(): AbstractControl | null {
    return this.form.get('unitValue');
  }
  /**
   * Getter property for the action form control.
   * @returns The action form control.
   */
  get note(): AbstractControl | null {
    return this.form.get('note');
  }

  /**
   * Initializes form controls with validation, observables and services.
   * @param budgetItemService Manage expense budget items.
   * @param budgetStateService Manage the state of a budget.
   * @param errorService Application error service.
   * @param dialogService Confirmation dialog service.
   * @param messageBoxService Service to handle user messages.
   */
  constructor(
    private budgetItemService: BudgetItemService,
    private budgetStateService: BudgetStateService,
    protected errorService: ErrorService,
    protected dialogService: ConfirmDialogService,
    protected messageBoxService: MessageBoxService
  ) {
    super(errorService, dialogService, messageBoxService);

    this.form = new FormGroup(
      {
        id: new FormControl(-1, { nonNullable: true }),
        action: new FormControl(Modify.Add.toString(), { nonNullable: true }),
        versionId: new FormControl(-1),
        budgetYearId: new FormControl(-1, Validators.required),
        versionName: new FormControl(''),
        category: new FormControl(-1, Validators.required),
        unit: new FormControl(-1, Validators.required),
        currency: new FormControl('', Validators.required),
        unitValue: new FormControl<number | null>(null, [Validators.required, isNumberValidator()]),
        note: new FormControl(''),
      },
      { validators: [uniqueValidator(this.budgetItemService, 'category', 'unit', 'action')] }
    );

    this.manageBudgetItem$ = this.budgetItemService.item$;
    this.budgetItems$ = this.budgetItemService.items$;
  }

  /**
   * @description Set title of HTML document and get budget items from server
   */
  ngOnInit(): void {
    pipeTakeUntil(this.budgetStateService.item$, this.sub$)
      .pipe(
        tap((budgetState) => {
          this.budgetState = budgetState;
        }),
        switchMap((budgetState: BudgetState) => {
          return pipeTakeUntil(this.budgetItemService.getBudgetItems(budgetState.budgetId), this.sub$);
        })
      )
      .subscribe((item) => {
        if (item.budgetYears.length > 0) {
          this.resetForm();
          this.budgetYearId?.setValue(item.filter.budgetYearId);
          this.form.get('versionId')?.setValue(item.version.id);
        }
        this.pageLoaded = true;
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
   * @description If adding an item, reset form and table state.
   */
  onChangeAction(): void {
    if (this.action?.value === Modify.Add) {
      this.budgetItemService.clearSelection();
      this.resetForm();
    }
  }

  /**
   * Handles a table row click event and load form controls with values from the selected item.
   * @param item The selected budget item.
   */
  onSelectItem(item: BudgetItem): void {
    this.budgetItemService.selectItem(item);

    this.useCurrency = this.budgetItemService.item.units.find((x) => x.id === item.unitId)?.useCurrency ?? true;

    this.form.patchValue({
      action: Modify.Edit,
      id: item.id,
      category: item.categoryId,
      unit: item.unitId,
      currency: this.useCurrency ? item.currency : '',
      unitValue: item.unitValue,
      note: item.note,
    });
  }

  /**
   * Handles a button click event.
   * @description Opens a confirmation dialog and if accepted the item is sent to the server to be deleted.
   * @param e The button event.
   * @param item The selected budget item to be deleted.
   */
  onDeleteItem(e: Event, item: BudgetItem): void {
    e.stopPropagation(); // Do not highlight row

    const options: DialogOptions = {
      title: 'Ta bort budgetpost?',
      message: `Klicka OK för att ta bort den markerade budgetposten från budget ${this.budgetState.budgetName}.`,
    };
    this.dialogService.open(options);

    pipeTakeUntil(this.dialogService.confirmed(), this.sub$).subscribe((confirmed) => {
      if (confirmed) {
        this.modifyItem(item, Modify.Delete);
      }
    });
  }

  /**
   * Handles a form submit button event.
   * @description Form control values are sent to the server for persistent storage.
   */
  onSaveBudgetItem(): void {
    const val = this.form.getRawValue();

    if (val.versionId && val.category && val.unit) {
      const budgetItem: BudgetItem = {
        id: val.id,
        versionId: val.versionId,
        categoryId: val.category,
        unitId: val.unit,
        currency: this.useCurrency && val.currency ? val.currency : '',
        unitValue: toNumber(val.unitValue),
        note: val.note ? val.note : '',
      };

      this.modifyItem(budgetItem, val.action);
    }
  }

  /**
   * Handles selection changed event.
   * @description Get current version, currencies and budget items for the selected year.
   * @param e The event object emitted by the select
   */
  onChangeYear(e: MatSelectChange): void {
    this.budgetItemService.setFilterItem(e.value, 'budgetYearId');
    this.getBudgetItems();
  }

  /**
   * Handles selection changed event.
   * @description Hides currency select if the selected unit does not support currency.
   * @param e The event object emitted by the select.
   */
  onChangeUnit(e: MatSelectChange): void {
    this.useCurrency = this.budgetItemService.item.units.find((x) => x.id === +e.value)?.useCurrency ?? true;
  }

  /**
   * Handles selection change event on the select.
   * @description Get budget items for a combination of all filters from the server.
   * @param e The event object emitted by the select.
   * @param filterType A value representing the type of filter used i.e. 'year'.
   */
  onChangeFilter(e: MatSelectChange, filterType: string): void {
    this.budgetItemService.setFilterItem(e.value, filterType);
    this.getBudgetItems();
  }

  // ------------------------------------
  // Private helper methods
  // ------------------------------------

  /**
   * Helper method to get filtered budget items from server.
   */
  private getBudgetItems(): void {
    pipeTakeUntil(this.budgetItemService.getBudgetItems(this.budgetState.budgetId), this.sub$).subscribe((item) => {
      this.resetForm();
      this.budgetYearId?.setValue(item.filter.budgetYearId);
      this.form.get('versionId')?.setValue(item.version.id);
    });
  }

  /**
   * Helper method to modify an item and save it in server.
   * @param item The modified item.
   * @param action The type och action to handle (add or edit).
   */
  private modifyItem(item: BudgetItem, action: string): void {
    pipeTakeUntil(this.budgetItemService.modifyBudgetItem(item, action), this.sub$).subscribe(() => {
      this.resetForm();
      this.messageBoxService.show();
    });
  }

  /**
   * Helper method to reset applicable form controls and preset select values.
   */
  private resetForm(): void {
    this.category?.reset();
    this.unit?.reset();
    this.currency?.reset();
    this.unitValue?.reset();
    this.note?.reset();

    this.form.patchValue({ action: Modify.Add });
  }
}
