import { registerLocaleData } from '@angular/common';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import localeSv from '@angular/common/locales/sv';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { findEl, setFieldValue, triggerEvent } from 'src/app/mock-backend/element.spec-helper';
import { BUDGET_STATE, TRIPS, TRIP_1 } from 'src/app/mock-backend/spec-constants';
import { toDate } from 'src/app/shared/classes/common.fn';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { Modify } from 'src/app/shared/enums/enums';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { Trip } from './shared/trip.model';
import { TripService } from './shared/trip.service';
import { TripComponent } from './trip.component';
registerLocaleData(localeSv);

type OmitFromStore = 'items' | 'getUnselectedItems' | 'addItem' | 'editItem' | 'deleteItem' | 'updateStore';

const tripService: Omit<TripService, OmitFromStore> = {
  getTrips(budgetId: number): Observable<Trip[]> {
    return of(TRIPS);
  },
  modifyTrip(_categoryItem: Trip, _action: string): Observable<Trip> {
    return of(TRIP_1);
  },
  betweenDates(_value: string, _action: string): boolean {
    return false;
  },
  rangeDateError(_fromDate: string, _toDate: string): boolean {
    return false;
  },

  // StoreItems
  clearSelection(): void {},
  getItem(_item: Trip): void {},
  getItems(skipSelected: boolean): Trip[] {
    return TRIPS;
  },
};

describe('TripComponent', () => {
  let component: TripComponent;
  let fixture: ComponentFixture<TripComponent>;
  let budgetStateService: BudgetStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatRadioModule,
        MatDatepickerModule,
        MatNativeDateModule,
        ConfirmDialogComponent,
        TripComponent,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: TripService, useValue: tripService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    budgetStateService = TestBed.inject(BudgetStateService);
    budgetStateService.setBudgetSate(BUDGET_STATE);

    fixture = TestBed.createComponent(TripComponent);
    component = fixture.componentInstance;

    component.trips = signal([...TRIPS]);

    fixture.detectChanges();
  });

  it('creates the component and loads the page', () => {
    expect(component).toBeTruthy();
    expect(component.pageLoaded()).toBeTrue();
  });

  it('clears selection and resets the form when selecting to add an item', () => {
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
    const spy = spyOn(tripService, 'getItem').and.callFake((item) => {
      item.selected = true;
    });

    triggerEvent(fixture, 'select-item', 'click');
    fixture.detectChanges();

    const selectedItems = fixture.debugElement.queryAll(By.css('.selected'));

    expect(spy).toHaveBeenCalled();
    expect(selectedItems.length).toBe(1);
  });

  it('submits the form successfully', () => {
    const trip = {
      id: -1,
      budgetId: 1,
      fromDate: new Date('2023-01-01'),
      toDate: new Date('2023-01-10'),
      note: '',
    } as Trip;

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
