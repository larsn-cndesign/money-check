import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { pipeTakeUntil, toDate } from 'src/app/shared/classes/common.fn';
import { DialogOptions } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.model';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.service';
import { MessageBoxService } from 'src/app/shared/components/message-box/shared/message-box.service';
import { Modify } from 'src/app/shared/enums/enums';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { CommonFormService } from 'src/app/shared/services/common-form.service';
import { ErrorService } from 'src/app/shared/services/error.service';
import { Trip } from './shared/trip.model';
import { TripService } from './shared/trip.service';
import { betweenDateValidator, rangeDateValidator } from './shared/trip.validators';

/**
 * Class representing expense category management.
 * @extends CommonFormService
 * @implements OnInit
 * @todo Add field to set name of trip
 */
@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TripComponent extends CommonFormService implements OnInit {
  /**
   * Initializes a strictly typed form group.
   * @public
   */
  form: FormGroup<{
    action: FormControl<string>;
    id: FormControl<number>;
    fromDate: FormControl<Date | null>;
    toDate: FormControl<Date | null>;
    note: FormControl<string | null>;
  }>;

  /**
   * An observer of an array of `Trip` objects.
   * @public
   */
  trips$: Observable<Trip[]>;

  /**
   * A property that holds all columns to be displayed in a table
   * @public
   */
  displayedColumns: string[] = ['fromDate', 'toDate', 'note', 'delete'];

  /**
   * Getter property for the action form control
   * @returns The action form control
   */
  get action(): AbstractControl | null {
    return this.form.get('action');
  }

  /**
   * Getter property for the fromDate form control
   * @returns The fromDate form control
   */
  get fromDate(): AbstractControl | null {
    return this.form.get('fromDate');
  }

  /**
   * Getter property for the toDate form control
   * @returns The toDate form control
   */
  get toDate(): AbstractControl | null {
    return this.form.get('toDate');
  }

  /**
   * Getter property for the v form control
   * @returns The note form control
   */
  get note(): AbstractControl | null {
    return this.form.get('note');
  }

  /**
   * Initializes form controls with validation, observables and services
   * @param tripService Manage trip items
   * @param budgetStateService Manage the state of a budget.
   * @param errorService Application error service
   * @param dialogService Confirmation dialog service
   * @param messageBoxService Service to handle user messages
   */
  constructor(
    private tripService: TripService,
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
        fromDate: new FormControl<Date | null>(null, [
          Validators.required,
          betweenDateValidator(tripService, 'action'),
        ]),
        toDate: new FormControl<Date | null>(null, [Validators.required, betweenDateValidator(tripService, 'action')]),
        note: new FormControl(''),
      },
      { validators: [rangeDateValidator(tripService, 'fromDate', 'toDate')] }
    );

    this.trips$ = this.tripService.items$;
  }

  /**
   * @description Set title of HTML document, get budget state from `localStorage` and trip items from server.
   */
  ngOnInit(): void {
    pipeTakeUntil(this.budgetStateService.getBudgetStateInStore(), this.sub$)
      .pipe(
        tap((budgetState) => {
          this.budgetState = budgetState;
        }),
        switchMap((budgetState: BudgetState) => {
          return pipeTakeUntil(this.tripService.getTrips(budgetState.budgetId), this.sub$);
        })
      )
      .subscribe(() => {
        this.pageLoaded$.next(true);
      });
  }

  /**
   * Handles date changed event of a date picker control. Reports an error if the input is invalid.
   * @param e Event of the date picker.
   * @param key The name of the control.
   */
  onFromDateChanged(e: MatDatepickerInputEvent<Date>): void {
    if (e.value === null) {
      this.fromDate?.setErrors({ invalidDate: true });
    } else {
      this.fromDate?.setValue(toDate(e.value));
    }
  }

  /**
   * Handles date changed event of a date picker control. Reports an error if the input is invalid.
   * @param e Event of the date picker.
   * @param key The name of the control.
   */
  onToDateChanged(e: MatDatepickerInputEvent<Date>): void {
    if (e.value === null) {
      this.toDate?.setErrors({ invalidDate: true });
    } else {
      this.toDate?.setValue(toDate(e.value));
    }
  }

  /**
   * Handles change event of a `mat-radio-group`.
   * @description If adding an item, reset form and table state
   */
  onChangeAction(): void {
    if (this.action?.value === Modify.Add) {
      this.tripService.clearSelection();
      this.resetForm();
    }
  }

  /**
   * Handles a table row click event and load form controls with values from the selected item
   * @param item The selected trip item
   */
  onSelectTrip(item: Trip): void {
    this.tripService.selectItem(item);

    this.form.patchValue({
      action: Modify.Edit,
      id: item.id,
      fromDate: item.fromDate,
      toDate: item.toDate,
      note: item.note,
    });
  }

  /**
   * Handles a button click event.
   * @description Opens a confirmation dialog and if accepted the item is sent to the server to be deleted.
   * @param e The button event
   * @param item The selected trip item to be deleted
   */
  onDeleteTrip(e: Event, item: Trip): void {
    e.stopPropagation();

    const options: DialogOptions = {
      title: 'Ta bort resa?',
      message: `Klicka OK för att ta bort <strong>resan</strong> som började
        <strong>${toDate(item.fromDate)}</strong> från budget ${this.budgetState.budgetName} permanent.`,
    };
    this.dialogService.open(options);

    pipeTakeUntil(this.dialogService.confirmed(), this.sub$).subscribe((confirmed) => {
      if (confirmed) {
        const trip: Trip = {
          id: item.id,
          budgetId: BudgetState.getSelectedBudgetId(),
          fromDate: item.fromDate,
          toDate: item.toDate,
          note: item.note,
        };

        this.modifyItem(trip, Modify.Delete);
      }
    });
  }

  /**
   * Handles a form submit button event.
   * @description Form control values are sent to the server for persistent storage.
   * @param formDirective Bind form controls to DOM. Used for resetting validation errors.
   */
  onSaveTrip(formDirective: FormGroupDirective): void {
    const val = this.form.getRawValue();

    if (val.fromDate && val.toDate) {
      const trip: Trip = {
        id: val.id,
        budgetId: BudgetState.getSelectedBudgetId(),
        fromDate: val.fromDate,
        toDate: val.toDate,
        note: val.note ?? '',
      };

      this.modifyItem(trip, val.action, formDirective);
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
  private modifyItem(item: Trip, action: string, formDirective?: FormGroupDirective): void {
    pipeTakeUntil(this.tripService.modifyTrip(item, action), this.sub$).subscribe(() => {
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
