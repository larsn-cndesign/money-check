import { HttpErrorResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { first } from 'rxjs/operators';
import { UNITS, UNIT_1 } from 'src/app/mock-backend/spec-constants';
import { Modify } from 'src/app/shared/enums/enums';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { Unit } from './unit.model';
import { UnitService } from './unit.service';

describe('UnitService', () => {
  let unitService: UnitService;
  let httpMock: HttpTestingController;
  let errorService: ErrorService;

  /**
   * Helper function to test category item modifications.
   * @param action Type of action Add/Edit/Delete
   * @param itemCount The expected number of category items
   */
  function modifyItem(action: string, itemCount: number): void {
    let category: Unit | undefined;
    const expectedUrl = '/api/unit';
    unitService.items.push(UNIT_1); // At least one item

    unitService
      .modifyUnit(UNIT_1, action)
      .pipe(first())
      .subscribe((item) => {
        category = item;
      });

    const req = httpMock.expectOne(expectedUrl);
    req.flush(UNIT_1);
    httpMock.verify();

    switch (action) {
      case Modify.Add:
        expect(req.request.method).toBe('POST');
        break;
      case Modify.Edit:
        expect(req.request.method).toBe('PUT');
        break;
      case Modify.Delete:
        expect(req.request.method).toBe('DELETE');
        break;
    }

    expect(category).toEqual(UNIT_1);
    expect(unitService.items.length).toBe(itemCount);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, HttpClientTestingModule],
    });
    unitService = TestBed.inject(UnitService);
    httpMock = TestBed.inject(HttpTestingController);
    errorService = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(unitService).toBeTruthy();
  });

  it('gets all units for a budget year on page load', () => {
    let categories: Unit[] | undefined;
    const budgetId = 1;
    const expectedUrl = '/api/unit?id=1';

    unitService
      .getUnits(budgetId)
      .pipe(first())
      .subscribe((items) => {
        categories = items;
      });

    const req = httpMock.expectOne(expectedUrl);
    req.flush(UNITS);
    httpMock.verify();

    expect(req.request.method).toBe('GET');
    expect(categories).toEqual(UNITS);
  });

  it('passes through errors when getting unit items', () => {
    let actualError: HttpErrorResponse | undefined;
    const budgetId = 1;
    const expectedUrl = '/api/unit?id=1';

    const spy = spyOn(errorService, 'handleHttpError').and.callThrough();

    unitService
      .getUnits(budgetId)
      .pipe(first())
      .subscribe(
        () => fail('next handler must not be called'),
        (error) => (actualError = error),
        () => fail('complete handler must not be called')
      );

    const req = httpMock.expectOne(expectedUrl);
    req.flush({ error: 'Something went wrong' }, { status: 500, statusText: 'Server Error' });
    httpMock.verify();

    if (!actualError) {
      throw new Error('Error needs to be defined');
    }
    expect(actualError.status).toBe(500);
    expect(actualError.statusText).toBe('Server Error');
    expect(spy).toHaveBeenCalled();
  });

  it('adds a unit item', () => {
    modifyItem(Modify.Add, 2);
  });

  it('edit a unit item', () => {
    modifyItem(Modify.Edit, 1);
  });

  it('delet a unit item', () => {
    modifyItem(Modify.Delete, 0);
  });

  it('validates that a unit name exists or not', () => {
    unitService.items = UNITS;

    const validName = 'Unit 3';
    const invalidName = 'Unit 1';

    let duplicate = unitService.duplicate(validName, Modify.Add);
    expect(duplicate).toBeFalse();

    duplicate = unitService.duplicate(invalidName, Modify.Add);
    expect(duplicate).toBeTrue();

    unitService.items[0].selected = true;

    duplicate = unitService.duplicate(invalidName, Modify.Edit);
    expect(duplicate).toBeFalse();
  });
});
