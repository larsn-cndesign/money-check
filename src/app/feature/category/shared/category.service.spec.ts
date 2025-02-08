import { HttpErrorResponse, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { first } from 'rxjs/operators';
import { CATEGORIES, CATEGORY_1 } from 'src/app/mock-backend/spec-constants';
import { Modify } from 'src/app/shared/enums/enums';
import { ErrorService } from 'src/app/shared/services/error.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { Category } from './category.model';
import { CategoryService } from './category.service';

describe('CategoryService', () => {
  let categoryService: CategoryService;
  let httpMock: HttpTestingController;
  let errorService: ErrorService;

  /**
   * Helper function to test category item modifications.
   * @param action Type of action Add/Edit/Delete
   * @param itemCount The expected number of category items
   */
  function modifyItem(action: string, itemCount: number): void {
    let category: Category | undefined;
    const expectedUrl = '/api/category';
    categoryService.addItem(CATEGORY_1); // At least one item

    categoryService
      .modifyCategory(CATEGORY_1, action)
      .pipe(first())
      .subscribe((item) => {
        category = item;
      });

    const req = httpMock.expectOne(expectedUrl);
    req.flush(CATEGORY_1);
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

    expect(category).toEqual(CATEGORY_1);
    expect(categoryService.items().length).toBe(itemCount);
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    });
    categoryService = TestBed.inject(CategoryService);
    httpMock = TestBed.inject(HttpTestingController);
    errorService = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(categoryService).toBeTruthy();
  });

  it('gets all categories for a budget year on page load', () => {
    let categories: Category[] | undefined;
    const budgetId = 1;
    const expectedUrl = '/api/category?id=1';

    categoryService
      .getCategories(budgetId)
      .pipe(first())
      .subscribe((items) => {
        categories = items;
      });

    const req = httpMock.expectOne(expectedUrl);
    req.flush(CATEGORIES);
    httpMock.verify();

    expect(req.request.method).toBe('GET');
    expect(categories).toEqual(CATEGORIES);
  });

  it('passes through errors when getting category items', () => {
    let actualError: HttpErrorResponse | undefined;
    const budgetId = 1;
    const expectedUrl = '/api/category?id=1';

    const spy = spyOn(errorService, 'handleHttpError').and.callThrough();

    categoryService
      .getCategories(budgetId)
      .pipe(first())
      .subscribe({
        next: () => fail('next handler must not be called'),
        error: (error) => (actualError = error),
        complete: () => fail('complete handler must not be called'),
      });

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

  it('adds a category item', () => {
    modifyItem(Modify.Add, 2);
  });

  it('edit a category item', () => {
    modifyItem(Modify.Edit, 1);
  });

  it('delet a category item', () => {
    modifyItem(Modify.Delete, 0);
  });

  it('validates that a category name exists or not', () => {
    categoryService.items = CATEGORIES;

    const validName = 'Category 3';
    const invalidName = 'Category 1';

    let duplicate = categoryService.duplicate(validName, Modify.Add);
    expect(duplicate).toBeFalse();

    duplicate = categoryService.duplicate(invalidName, Modify.Add);
    expect(duplicate).toBeTrue();

    categoryService.items()[0].selected = true;

    duplicate = categoryService.duplicate(invalidName, Modify.Edit);
    expect(duplicate).toBeFalse();
  });
});
