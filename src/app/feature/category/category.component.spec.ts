import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { Observable, of } from 'rxjs';
import { findEl, setFieldValue } from 'src/app/mock-backend/element.spec-helper';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { deepCoyp } from 'src/app/shared/classes/common.fn';
import {
  BUDGET_STATE,
  CATEGORIES,
  CATEGORY_1,
  OmitAllFromStore,
} from 'src/app/mock-backend/spec-constants';
import { ConfirmDialogModule } from 'src/app/shared/components/confirm-dialog/confirm-dialog.module';
import { Modify } from 'src/app/shared/enums/enums';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { CategoryComponent } from './category.component';
import { Category } from './shared/category.model';
import { CategoryService } from './shared/category.service';

type OmitFromStore = 'items$' | 'getUnselectedItems' | 'addItem' | 'editItem' | 'deleteItem' | 'updateStore';

const categoryService: Omit<CategoryService, OmitFromStore> = {
  loadCategoryPage(budgetId: number): Observable<Category[]> {
    return of(CATEGORIES);
  },
  modifyCategory(categoryItem: Category, action: string): Observable<Category> {
    return of(CATEGORY_1);
  },
  duplicate(value: string, action: string): boolean {
    return false;
  },
  // StoreItem
  get items(): Category[] {
    return CATEGORIES;
  },
  clearSelection(): void {},
  selectItem(item: Category): void {
    item.selected = true;
  },
};

type OmitFromBudgetState = OmitAllFromStore | 'getBudgetState' | 'setBudgetSate' | 'changeBudget';

const budgetStateService: Omit<BudgetStateService, OmitFromBudgetState> = {
  getBudgetStateInStore(): Observable<BudgetState> {
    return of(BUDGET_STATE);
  },
};

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let categories: Category[];

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
      ],
      declarations: [CategoryComponent],
      providers: [
        { provide: BudgetStateService, useValue: budgetStateService },
        { provide: CategoryService, useValue: categoryService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryComponent);
    component = fixture.componentInstance;
    categories = deepCoyp(CATEGORIES) as Category[];
    component.categories$ = of(categories);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('clears selection and resets the form when selecting to add an item', () => {
    fixture.detectChanges();

    const spy = spyOn(categoryService, 'clearSelection');

    const element = findEl(fixture, 'action');
    element.triggerEventHandler('change', { value: Modify.Add });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not clear selection or resets the form when selecting to edit an item', () => {
    component.action?.setValue(Modify.Edit);
    fixture.detectChanges();

    const spy = spyOn(categoryService, 'clearSelection');

    const element = findEl(fixture, 'action');
    element.triggerEventHandler('change', { value: Modify.Edit });

    expect(spy).not.toHaveBeenCalled();
  });

  it('select an item in table when a table row is clicked', () => {
    const category = deepCoyp(categories[0]) as Category;
    fixture.detectChanges();

    component.categories$.subscribe((item) => {
      category.selected = item[0].selected;
    });

    categoryService.selectItem(category);

    const element = findEl(fixture, 'select-item');
    element.triggerEventHandler('click', { item: category });
    fixture.detectChanges();

    const selectedItems = fixture.debugElement.queryAll(By.css('.selected'));

    expect(selectedItems.length).toBe(1);
    expect(category.selected).toBeTrue();
  });

  it('submits the form successfully', () => {
    const category = { id: -1, budgetId: -1, categoryName: 'Category 2' } as Category;

    fixture.detectChanges();

    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);

    setFieldValue(fixture, 'category', category.categoryName);
    fixture.detectChanges();

    expect(findEl(fixture, 'submit').properties.disabled).toBe(false);

    const modifyCategorySpy = spyOn(categoryService, 'modifyCategory').and.returnValue(of(category));

    findEl(fixture, 'form').triggerEventHandler('submit');
    fixture.detectChanges();

    expect(component.form.value.categoryName).toBeNull(); // Form has been reset
    expect(modifyCategorySpy).toHaveBeenCalledWith(category, Modify.Add);
  });
});
