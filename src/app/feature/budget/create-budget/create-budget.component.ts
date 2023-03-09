import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { pipeTakeUntil } from 'src/app/shared/classes/common.fn';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.service';
import { MessageBoxService } from 'src/app/shared/components/message-box/shared/message-box.service';
import { Modify } from 'src/app/shared/enums/enums';
import { CommonFormService } from 'src/app/shared/services/common-form.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { Budget } from '../shared/budget.model';
import { BudgetService } from '../shared/budget.service';
import { duplicateValidator } from '../shared/budget.validators';

/**
 * Class representing budget modification.
 * @extends CommonFormService
 * @implements OnInit
 */
@Component({
  selector: 'app-create-budget',
  templateUrl: './create-budget.component.html',
  styleUrls: ['./create-budget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateBudgetComponent extends CommonFormService implements OnInit {
  /**
   * Initializes a strictly typed form group.
   * @public
   */
  form: FormGroup<{
    action: FormControl<string>;
    id: FormControl<number>;
    budgetName: FormControl<string | null>;
  }>;

  /**
   * An observer of an array of `Budget` objects.
   * @public
   */
  budgets$: Observable<Budget[]>;

  /**
   * A property that holds all columns to be displayed in a table.
   * @public
   */
  displayedColumns: string[] = ['budgetName'];

  /**
   * Getter property for the action form control.
   * @returns The action form control.
   */
  get action(): AbstractControl | null {
    return this.form.get('action');
  }

  /**
   * Getter property for the budgetName form control.
   * @returns The budgetName form control.
   */
  get budgetName(): AbstractControl | null {
    return this.form.get('budgetName');
  }

  /**
   * Initializes form controls with validation, observables and services
   * @param budgetService Manage category items
   * @param errorService Application error service
   * @param dialogService Confirmation dialog service
   * @param messageBoxService Service to handle user messages
   */
  constructor(
    private budgetService: BudgetService,
    protected errorService: ErrorService,
    protected dialogService: ConfirmDialogService,
    protected messageBoxService: MessageBoxService
  ) {
    super(errorService, dialogService, messageBoxService);

    this.form = new FormGroup(
      {
        action: new FormControl(Modify.Add.toString(), { nonNullable: true }),
        id: new FormControl(-1, { nonNullable: true }),
        budgetName: new FormControl('', [Validators.required, Validators.max(45)]),
      },
      { validators: [duplicateValidator(budgetService, 'budgetName', 'action')] }
    );

    this.budgets$ = this.budgetService.items$;
  }

  /**
   * @description Set title of HTML document and get budgets from server.
   */
  ngOnInit(): void {
    pipeTakeUntil(this.budgetService.getBudgets(), this.sub$).subscribe();
  }

  /**
   * Handles change event of a `mat-radio-group`.
   * @description If adding a budget, reset form and table state.
   */
  onChangeAction(): void {
    if (this.action?.value === Modify.Add) {
      this.budgetService.clearSelection();
      this.resetForm();
    }
  }

  /**
   * Handles a table row click event and load form controls with values from the selected item.
   * @param item The selected budget.
   */
  onSelectBudget(item: Budget): void {
    this.budgetService.selectItem(item);

    this.form.patchValue({
      action: Modify.Edit,
      id: item.id,
      budgetName: item.budgetName,
    });
  }

  /**
   * Handles a form submit button event.
   * @description Form control values are sent to the server for persistent storage.
   * @param formDirective Bind form controls to DOM. Used for resetting validation errors.
   */
  onSaveBudget(formDirective: FormGroupDirective): void {
    const val = this.form.getRawValue();

    if (val.budgetName) {
      const budget: Budget = { id: val.id, budgetName: val.budgetName, selected: false };

      this.modifyItem(budget, val.action, formDirective);
    }
  }

  // ------------------------------------
  // Private helper methods
  // ------------------------------------

  /**
   * Helper method to modify a budget and save it in server.
   * @param budget The modified budget.
   * @param action The type och action to handle (add or edit).
   * @param formDirective Bind form controls to DOM. Used for resetting validation errors (optional).
   */
  private modifyItem(budget: Budget, action: string, formDirective?: FormGroupDirective): void {
    pipeTakeUntil(this.budgetService.modifyBudget(budget, action), this.sub$).subscribe(() => {
      if (formDirective) {
        formDirective.reset();
      }
      this.resetForm();
      this.messageBoxService.show();
    });
  }

  /**
   * Helper method to reset applicable form controls and preset select values.
   */
  private resetForm(): void {
    this.form.reset();
    this.form.patchValue({ action: Modify.Add });
  }
}
