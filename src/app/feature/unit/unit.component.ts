import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { pipeTakeUntil } from 'src/app/shared/classes/common.fn';
import { DialogOptions } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.model';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.service';
import { MessageBoxService } from 'src/app/shared/components/message-box/shared/message-box.service';
import { Modify } from 'src/app/shared/enums/enums';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { CommonFormService } from 'src/app/shared/services/common-form.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { Unit } from './shared/unit.model';
import { UnitService } from './shared/unit.service';
import { duplicateValidator } from './shared/unit.validators';

/**
 * Class representing unit management.
 * @extends CommonFormService
 * @implements OnInit
 */
@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: ['./unit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnitComponent extends CommonFormService implements OnInit {
  /**
   * Initializes a strictly typed form group.
   * @public
   */
  form: FormGroup<{
    action: FormControl<string>;
    id: FormControl<number>;
    unitName: FormControl<string | null>;
    useCurrency: FormControl<boolean>;
  }>;

  /**
   * An observer of an array of `Unit` objects.
   * @public
   */
  units$: Observable<Unit[]>;

  /**
   * A property that holds all columns to be displayed in a table
   * @public
   */
  displayedColumns: string[] = ['name', 'useCurrency', 'delete'];

  /**
   * Getter property for the action form control
   * @returns The action form control
   */
  get action(): AbstractControl | null {
    return this.form.get('action');
  }

  /**
   * Getter property for the unitName form control
   * @returns The unitName form control
   */
  get unitName(): AbstractControl | null {
    return this.form.get('unitName');
  }

  // /**
  //  * Getter property for the useCurrency form control
  //  * @returns The useCurrency form control
  //  */
  // get useCurrency(): AbstractControl | null {
  //   return this.form.get('useCurrency');
  // }

  /**
   * Initializes form controls with validation, observables and services.
   * @param unitService Manage unit items.
   * @param budgetStateService Manage the state of a budget.
   * @param errorService Application error service.
   * @param dialogService Confirmation dialog service.
   * @param messageBoxService Service to handle user messages.
   */
  constructor(
    private unitService: UnitService,
    private budgetStateService: BudgetStateService,
    protected errorService: ErrorService,
    protected dialogService: ConfirmDialogService,
    protected messageBoxService: MessageBoxService
  ) {
    super(errorService, dialogService, messageBoxService);

    this.form = new FormGroup(
      {
        action: new FormControl(Modify.Add.toString(), { nonNullable: true }),
        id: new FormControl(-1, { nonNullable: true }),
        unitName: new FormControl('', [Validators.required, Validators.max(50)]),
        useCurrency: new FormControl<boolean>(false, { nonNullable: true }),
      },
      { validators: [duplicateValidator(unitService, 'unitName', 'action')] }
    );

    this.units$ = this.unitService.items$;
  }

  /**
   * @description Set title of HTML document, get budget state from `localStorage` and unit items from server.
   */
  ngOnInit(): void {
    pipeTakeUntil(this.budgetStateService.getBudgetStateInStore(), this.sub$)
      .pipe(
        tap((budgetState) => {
          this.budgetState = budgetState;
        }),
        switchMap((budgetState: BudgetState) => {
          return pipeTakeUntil(this.unitService.getUnits(budgetState.budgetId), this.sub$);
        })
      )
      .subscribe(() => {
        this.pageLoaded = true;
      });
  }

  /**
   * Handles change event of `mat-checkbox`.
   * @description If checked, currency is required for this unit when budgeting.
   * @param e Event of the checkbox
   */
  onChangeUseCurrency(e: MatCheckboxChange): void {
    this.form.patchValue({ useCurrency: e.checked });
  }

  /**
   * Handles change event of a `mat-radio-group`.
   * @description If adding an item, reset form and table state
   */
  onChangeAction(): void {
    if (this.action?.value === Modify.Add) {
      this.unitService.clearSelection();
      this.resetForm();
    }
  }

  /**
   * Handles a table row click event and load form controls with values from the selected item
   * @param item The selected unit item
   */
  onSelectUnit(item: Unit): void {
    this.unitService.selectItem(item);

    this.form.patchValue({
      action: Modify.Edit,
      id: item.id,
      unitName: item.unitName,
      useCurrency: item.useCurrency,
    });
  }

  /**
   * Handles a button click event.
   * @description Opens a confirmation dialog and if accepted the item is sent to the server to be deleted.
   * @param e The button event
   * @param item The selected unit item to be deleted
   */
  onDeleteUnit(e: Event, item: Unit): void {
    e.stopPropagation(); // Do not highlight row

    const options: DialogOptions = {
      title: `Ta bort enhet?`,
      message: `Klicka OK för att ta bort kategori <strong>${item.unitName}</strong> från budget
        ${this.budgetState.budgetName} permanent.`,
    };
    this.dialogService.open(options);

    pipeTakeUntil(this.dialogService.confirmed(), this.sub$).subscribe((confirmed) => {
      if (confirmed) {
        const unit: Unit = {
          id: item.id,
          budgetId: BudgetState.getSelectedBudgetId(),
          unitName: item.unitName,
          useCurrency: item.useCurrency,
          selected: false,
        };

        this.modifyItem(unit, Modify.Delete);
      }
    });
  }

  /**
   * Handles a form submit button event.
   * @description Form control values are sent to the server for persistent storage.
   * @param formDirective Bind form controls to DOM. Used for resetting validation errors.
   */
  onSaveUnit(formDirective: FormGroupDirective): void {
    const val = this.form.getRawValue();

    if (val.unitName) {
      const unit: Unit = {
        id: val.id,
        budgetId: BudgetState.getSelectedBudgetId(),
        unitName: val.unitName,
        useCurrency: val.useCurrency,
      };

      this.modifyItem(unit, val.action, formDirective);
    }
  }

  // ------------------------------------
  // Private helper methods
  // ------------------------------------

  /**
   * Helper method to modify an item and save it in server.
   * @param item The modified item.
   * @param action The type och action to handle (add or edit).
   * @param formDirective Bind form controls to DOM. Used for resetting validation errors (optional).
   */
  private modifyItem(item: Unit, action: string, formDirective?: FormGroupDirective): void {
    pipeTakeUntil(this.unitService.modifyUnit(item, action), this.sub$).subscribe(() => {
      if (formDirective) {
        formDirective.reset();
      }
      this.resetForm();
      this.messageBoxService.show();
    });
  }

  /**
   * Helper method to reset applicable form controls and preset select values
   */
  private resetForm(): void {
    this.form.reset();
    this.form.patchValue({ action: Modify.Add });
  }
}
