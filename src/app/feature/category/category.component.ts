import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { switchMap, tap } from 'rxjs';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { pipeTakeUntil } from 'src/app/shared/classes/common.fn';
import { DialogOptions } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.model';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.service';
import { MessageBoxService } from 'src/app/shared/components/message-box/shared/message-box.service';
import { Modify } from 'src/app/shared/enums/enums';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { CommonFormService } from 'src/app/shared/services/common-form.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { Category } from './shared/category.model';
import { CategoryService } from './shared/category.service';
import { duplicateValidator } from './shared/category.validators';

/**
 * Class representing expense category management.
 * @extends CommonFormService
 * @implements OnInit
 */
@Component({
  selector: 'app-category',
  imports: [SharedModule, ReactiveFormsModule, MatRadioModule, MatTableModule],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent extends CommonFormService implements OnInit {
  /**
   * Initializes a strictly typed form group.
   * @public
   */
  form: FormGroup<{
    action: FormControl<string>;
    id: FormControl<number>;
    categoryName: FormControl<string | null>;
  }>;

  /**
   * Signal representing the current state of `Category` objects.
   * @public
   */
  categories: Signal<Category[]>;

  /**
   * A property that holds all columns to be displayed in a table
   * @public
   */
  displayedColumns: string[] = ['name', 'delete'];

  /**
   * Getter property for the action form control
   * @returns The action form control
   */
  get action(): AbstractControl | null {
    return this.form.get('action');
  }

  /**
   * Getter property for the categoryName form control
   * @returns The categoryName form control
   */
  get categoryName(): AbstractControl | null {
    return this.form.get('categoryName');
  }

  /**
   * Initializes form controls with validation, observables and services
   * @param categoryService Manage category items
   * @param budgetStateService Manage the state of a budget.
   * @param dialogService Confirmation dialog service
   * @param messageBoxService Service to handle user messages
   */
  constructor(
    private categoryService: CategoryService,
    private budgetStateService: BudgetStateService,
    private dialogService: ConfirmDialogService,
    private messageBoxService: MessageBoxService
  ) {
    super();

    this.form = new FormGroup(
      {
        action: new FormControl(Modify.Add.toString(), { nonNullable: true }),
        id: new FormControl(-1, { nonNullable: true }),
        categoryName: new FormControl('', [Validators.required, Validators.max(50)]),
      },
      { validators: [duplicateValidator(categoryService, 'categoryName', 'action')] }
    );

    this.categories = this.categoryService.items;
  }

  /**
   * @description Set title of HTML document, get budget state from `localStorage` and category items from server.
   */
  ngOnInit(): void {
    pipeTakeUntil(this.budgetStateService.getItem(), this.sub$)
      .pipe(
        tap((budgetState) => (this.budgetState = budgetState)),
        switchMap((budgetState: BudgetState) => {
          return pipeTakeUntil(this.categoryService.getCategories(budgetState.budgetId), this.sub$);
        })
      )
      .subscribe(() => this.pageLoaded.set(true));
  }

  /**
   * Handles change event of a `mat-radio-group`.
   * @description If adding an item, reset form and table state
   */
  onChangeAction(): void {
    if (this.action?.value === Modify.Add) {
      this.categoryService.clearSelection();
      this.resetForm();
    }
  }

  /**
   * Handles a table row click event and load form controls with values from the selected item
   * @param item The selected category item
   */
  onSelectCategory(item: Category): void {
    this.categoryService.getItem(item);

    this.form.patchValue({
      action: Modify.Edit,
      id: item.id,
      categoryName: item.categoryName,
    });
  }

  /**
   * Handles a button click event.
   * @description Opens a confirmation dialog and if accepted the item is sent to the server to be deleted.
   * @param e The button event
   * @param item The selected category item to be deleted
   */
  onDeleteCategory(e: Event, item: Category): void {
    e.stopPropagation(); // Do not highlight row

    const options: DialogOptions = {
      title: `Ta bort kategori`,
      message: `Klicka OK för att ta bort kategori <strong>${item.categoryName}</strong> från budget
        ${this.budgetState.budgetName} permanent.`,
    };
    this.dialogService.open(options);

    pipeTakeUntil(this.dialogService.confirmed(), this.sub$).subscribe((confirmed) => {
      if (confirmed) {
        const category: Category = {
          id: item.id,
          budgetId: BudgetState.getSelectedBudgetId(),
          categoryName: item.categoryName,
          selected: false,
        };

        this.modifyItem(category, Modify.Delete);
      }
    });
  }

  /**
   * Handles a form submit button event.
   * @description Form control values are sent to the server for persistent storage.
   * @param formDirective Bind form controls to DOM. Used for resetting validation errors.
   */
  onSaveCategory(formDirective: FormGroupDirective): void {
    const val = this.form.getRawValue();

    if (val.categoryName) {
      const category: Category = {
        id: val.id,
        budgetId: BudgetState.getSelectedBudgetId(),
        categoryName: val.categoryName,
      };

      this.modifyItem(category, val.action, formDirective);
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
  private modifyItem(item: Category, action: string, formDirective?: FormGroupDirective): void {
    pipeTakeUntil(this.categoryService.modifyCategory(item, action), this.sub$).subscribe(() => {
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
