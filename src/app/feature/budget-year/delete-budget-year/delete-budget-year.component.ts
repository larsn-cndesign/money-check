import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { switchMap, tap } from 'rxjs';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { pipeTakeUntil } from 'src/app/shared/classes/common.fn';
import { DialogOptions } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.model';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.service';
import { MessageBoxService } from 'src/app/shared/components/message-box/shared/message-box.service';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { CommonFormService } from 'src/app/shared/services/common-form.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { ManageBudgetYear } from '../shared/budget-year.model';
import { BudgetYearService } from '../shared/budget-year.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

/**
 * Class representing deletion of a budget year.
 * @extends CommonFormService
 * @implements OnInit
 */
@Component({
  selector: 'app-delete-budget-year',
  imports: [SharedModule, ReactiveFormsModule, MatSelectModule, TranslatePipe],
  templateUrl: './delete-budget-year.component.html',
  styleUrls: ['./delete-budget-year.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteBudgetYearComponent extends CommonFormService implements OnInit {
  /**
   * Initializes a strictly typed form group.
   * @public
   */
  form: FormGroup<{
    budgetYearId: FormControl<number>;
  }>;

  /**
   * Signal representing the current state of `ManageBudgetYear`.
   * @public
   */
  budgetYear: Signal<ManageBudgetYear>;

  /**
   * Getter property for the budgetYearId form control
   * @returns The budgetYearId form control
   */
  get budgetYearId(): AbstractControl | null {
    return this.form.get('budgetYearId');
  }

  /**
   * Initializes form controls with validation, observables and services.
   * @param budgetYearService Manage budget year.
   * @param budgetStateService Manage the state of a budget.
   * @param dialogService Confirmation dialog service.
   * @param messageBoxService Service to handle user messages.
   */
  constructor(
    private budgetYearService: BudgetYearService,
    private budgetStateService: BudgetStateService,
    private dialogService: ConfirmDialogService,
    private messageBoxService: MessageBoxService,
    private translate: TranslateService
  ) {
    super();

    this.form = new FormGroup({
      budgetYearId: new FormControl(-1, { validators: [Validators.required], nonNullable: true }),
    });

    this.budgetYear = this.budgetYearService.getItem();
  }

  /**
   * @description Set title of HTML document and get all availables budget years.
   */
  ngOnInit(): void {
    pipeTakeUntil(this.budgetStateService.getItem(), this.sub$)
      .pipe(
        tap((budgetState) => (this.budgetState = budgetState)),
        switchMap((budgetState: BudgetState) => {
          return pipeTakeUntil(this.budgetYearService.getBudgetYear(budgetState.budgetId), this.sub$);
        })
      )
      .subscribe(() => this.pageLoaded.set(true));
  }

  /**
   * Handles a button click event.
   * @description Opens a confirmation dialog and if accepted the item is sent to the server to be deleted.
   * @param e The button event
   * @param item The selected budget year to be deleted
   */
  onDeleteBudgetYear(e: Event): void {
    e.stopPropagation(); // Do not highlight row

    const val = this.form.getRawValue();
    const budgetYear = this.budgetYearService.getSelectedBudgetYear(val.budgetYearId);

    const options: DialogOptions = {
      title: `${this.translate.instant('ctrl.button.delete.budget_year')}?`,
      message: this.translate.instant('dialog.message.delete_year', {
        year: budgetYear.year,
        name: this.budgetState.budgetName,
      }),
    };
    this.dialogService.open(options);

    pipeTakeUntil(this.dialogService.confirmed(), this.sub$).subscribe((confirmed) => {
      if (confirmed) {
        pipeTakeUntil(this.budgetYearService.deleteBudgetYear(budgetYear), this.sub$).subscribe(() => {
          this.form.reset();
          this.messageBoxService.show();
        });
      }
    });
  }
}
