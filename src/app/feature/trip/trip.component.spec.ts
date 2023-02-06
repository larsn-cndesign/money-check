import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { findEl, setFieldValue, triggerEvent } from 'src/app/mock-backend/element.spec-helper';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { deepCoyp, toDate } from 'src/app/shared/classes/common.fn';
import { BUDGET_STATE_VALID, TRIPS, TRIP_1, OmitAllFromStore } from 'src/app/mock-backend/spec-constants';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';
import { Modify } from 'src/app/shared/enums/enums';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { Trip } from './shared/trip.model';
import { TripService } from './shared/trip.service';
import { TripComponent } from './trip.component';
import localeSv from '@angular/common/locales/sv';
import { registerLocaleData } from '@angular/common';
import { MatNativeDateModule } from '@angular/material/core';
registerLocaleData(localeSv);

type OmitFromStore = 'items$' | 'getUnselectedItems' | 'addItem' | 'editItem' | 'deleteItem' | 'updateStore';

const tripService: Omit<TripService, OmitFromStore> = {
  loadTripPage(budgetId: number): Observable<Trip[]> {
    return of(TRIPS);
  },
  modifyTrip(categoryItem: Trip, action: string): Observable<Trip> {
    return of(TRIP_1);
  },
  betweenDates(value: string, action: string): boolean {
    return false;
  },
  rangeDateError(fromDate: string, _toDate: string): boolean {
    return false;
  },

  // StoreItem
  get items(): Trip[] {
    return TRIPS;
  },
  clearSelection(): void {},
  selectItem(item: Trip): void {
    item.selected = true;
  },
};

type OmitFromBudgetState = OmitAllFromStore | 'getBudgetState' | 'setBudgetSate' | 'changeBudget';

const budgetStateService: Omit<BudgetStateService, OmitFromBudgetState> = {
  getBudgetStateInStore(): Observable<BudgetState> {
    return of(BUDGET_STATE_VALID);
  },
};

describe('TripComponent', () => {
  let component: TripComponent;
  let fixture: ComponentFixture<TripComponent>;
  let trips: Trip[];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        ConfirmDialogModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
      ],
      declarations: [TripComponent],
      providers: [
        { provide: BudgetStateService, useValue: budgetStateService },
        { provide: TripService, useValue: tripService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TripComponent);
    component = fixture.componentInstance;
    trips = deepCoyp(TRIPS) as Trip[];
    component.trips$ = of(trips);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clears selection and resets the form when selecting to add an item', () => {
    fixture.detectChanges();

    const spy = spyOn(tripService, 'clearSelection');

    triggerEvent(fixture, 'action', 'change', { value: Modify.Add });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not clear selection or resets the form when selecting to edit an item', () => {
    component.action?.setValue(Modify.Edit);
    fixture.detectChanges();

    const spy = spyOn(tripService, 'clearSelection');

    triggerEvent(fixture, 'action', 'change', { value: Modify.Edit });

    expect(spy).not.toHaveBeenCalled();
  });

  it('select an item in table when a table row is clicked', () => {
    const category = deepCoyp(trips[0]) as Trip;
    fixture.detectChanges();

    component.trips$.subscribe((item) => {
      category.selected = item[0].selected;
    });

    tripService.selectItem(category);

    triggerEvent(fixture, 'select-item', 'click');
    fixture.detectChanges();

    const selectedItems = fixture.debugElement.queryAll(By.css('.selected'));

    expect(selectedItems.length).toBe(1);
    expect(category.selected).toBeTrue();
  });

  it('submits the form successfully', () => {
    const trip = { id: -1, budgetId: -1, fromDate: new Date('2023-01-01'), toDate: new Date('2023-01-10') } as Trip;

    fixture.detectChanges();

    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);

    setFieldValue(fixture, 'fromDate', '2023-01-01');
    setFieldValue(fixture, 'toDate', '2023-01-10');
    fixture.detectChanges();

    expect(findEl(fixture, 'submit').properties.disabled).toBe(false);

    const modifyCategorySpy = spyOn(tripService, 'modifyTrip').and.returnValue(of(trip));

    findEl(fixture, 'form').triggerEventHandler('submit');
    fixture.detectChanges();

    // Form has been reset
    expect(component.form.value.fromDate).toBeNull();
    expect(component.form.value.toDate).toBeNull();
    expect(modifyCategorySpy).toHaveBeenCalledWith(trip, Modify.Add);
  });

  it('changes dates and validates them', async () => {
    fixture.detectChanges();

    triggerEvent(fixture, 'fromDate', 'dateChange', { value: '2023-02-01' });
    expect(toDate(component.fromDate?.value)).toBe('2023-02-01');

    triggerEvent(fixture, 'fromDate', 'dateChange', { value: null });
    expect(component.fromDate?.errors).toEqual({ invalidDate: true });

    triggerEvent(fixture, 'toDate', 'dateChange', { value: '2023-02-11' });
    expect(toDate(component.toDate?.value)).toBe('2023-02-11');

    triggerEvent(fixture, 'toDate', 'dateChange', { value: null });
    expect(component.toDate?.errors).toEqual({ invalidDate: true });
  });
});
