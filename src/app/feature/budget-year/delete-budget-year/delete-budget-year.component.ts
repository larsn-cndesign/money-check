import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { pipeTakeUntil } from 'src/app/shared/classes/common.fn';
import { DialogOptions } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.model';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.service';
import { MessageBoxService } from 'src/app/shared/components/message-box/shared/message-box.service';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { CommonFormService } from 'src/app/shared/services/common-form.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { ManageBudgetYear } from '../shared/budget-year.model';
import { BudgetYearService } from '../shared/budget-year.service';

/**
 * Class representing deletion of a budget year.
 * @extends CommonFormService
 * @implements OnInit
 */
@Component({
  selector: 'app-delete-budget-year',
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
   * An observer of `ManageBudgetYear` class.
   * @public
   */
  budgetYear$: Observable<ManageBudgetYear>;

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
   * @param errorService Application error service.
   * @param dialogService Confirmation dialog service.
   * @param messageBoxService Service to handle user messages.
   */
  constructor(
    private budgetYearService: BudgetYearService,
    private budgetStateService: BudgetStateService,
    protected errorService: ErrorService,
    protected dialogService: ConfirmDialogService,
    protected messageBoxService: MessageBoxService
  ) {
    super(errorService, dialogService, messageBoxService);

    this.form = new FormGroup({
      budgetYearId: new FormControl(-1, { validators: [Validators.required], nonNullable: true }),
    });

    this.budgetYear$ = this.budgetYearService.item$;
  }

  /**
   * @description Set title of HTML document and get all availables budget years.
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
      .subscribe(() => {
        this.pageLoaded$.next(true);
      });
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
      title: 'Ta bort budgetår?',
      message: `Klicka OK för att ta bort <strong>budgetåret ${budgetYear.year}</strong> från budget
      ${this.budgetState.budgetName}.<br/>
        Obs! alla versioner, valutor och budgettransaktioner som är kopplade till det här året
        kommer också att tas bort`,
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
