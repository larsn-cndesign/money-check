import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import { click, findEl, setFieldValue, triggerEvent } from 'src/app/mock-backend/element.spec-helper';
import { BUDGET_STATE, CATEGORIES, CATEGORY_1 } from 'src/app/mock-backend/spec-constants';
import { BudgetState } from 'src/app/shared/classes/budget-state.model';
import { deepCoyp } from 'src/app/shared/classes/common.fn';
import { ConfirmDialogComponent } from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogService } from 'src/app/shared/components/confirm-dialog/shared/confirm-dialog.service';
import { MessageBoxService } from 'src/app/shared/components/message-box/shared/message-box.service';
import { Modify } from 'src/app/shared/enums/enums';
import { BudgetStateService } from 'src/app/shared/services/budget-state.service';
import { CategoryComponent } from './category.component';
import { Category } from './shared/category.model';
import { CategoryService } from './shared/category.service';

type OmitFromStore = 'items' | 'getUnselectedItems' | 'addItem' | 'editItem' | 'deleteItem' | 'updateStore';

const categoryService: Omit<CategoryService, OmitFromStore> = {
  getCategories(_budgetId: number): Observable<Category[]> {
    return of(CATEGORIES);
  },
  modifyCategory(_categoryItem: Category, _action: string): Observable<Category> {
    return of(CATEGORY_1);
  },
  duplicate(_value: string, _action: string): boolean {
    return false;
  },
  // StoreItems
  clearSelection(): void {},
  getItem(_item: Category): void {},
  getItems(skipSelected: boolean): Category[] {
    return CATEGORIES;
  },
};

describe('CategoryComponent', () => {
  let component: CategoryComponent;
  let fixture: ComponentFixture<CategoryComponent>;
  let messageBoxService: MessageBoxService;
  let dialogService: ConfirmDialogService;
  let budgetStateService: BudgetStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatTableModule,
        MatRadioModule,
        ConfirmDialogComponent,
        CategoryComponent,
      ],
      providers: [
        { provide: CategoryService, useValue: categoryService },
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    budgetStateService = TestBed.inject(BudgetStateService);
    budgetStateService.setBudgetSate(BUDGET_STATE);

    fixture = TestBed.createComponent(CategoryComponent);
    messageBoxService = TestBed.inject(MessageBoxService);
    dialogService = TestBed.inject(ConfirmDialogService);
    component = fixture.componentInstance;

    component.categories = signal([...CATEGORIES]);

    fixture.detectChanges();
  });

  it('creates the component and loads the page', () => {
    expect(component).toBeTruthy();
    expect(component.pageLoaded()).toBeTrue();
  });

  it('clears selection and resets the form when selecting to add an item', () => {
    const spy = spyOn(categoryService, 'clearSelection');

    triggerEvent(fixture, 'action', 'change', { value: Modify.Add });

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('does not clear selection or resets the form when selecting to edit an item', () => {
    component.action?.setValue(Modify.Edit);
    fixture.detectChanges();

    const spy = spyOn(categoryService, 'clearSelection');

    triggerEvent(fixture, 'action', 'change', { value: Modify.Edit });

    expect(spy).not.toHaveBeenCalled();
  });

  it('select an item in table when a table row is clicked', () => {
    const spy = spyOn(categoryService, 'getItem').and.callFake((item) => {
      item.selected = true;
    });

    triggerEvent(fixture, 'select-item', 'click');
    fixture.detectChanges();

    const selectedItems = fixture.debugElement.queryAll(By.css('.selected'));

    expect(spy).toHaveBeenCalled();
    expect(selectedItems.length).toBe(1);
  });

  it('submits the form successfully', () => {
    const category = { id: -1, budgetId: 1, categoryName: 'Category 2' } as Category;

    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);

    setFieldValue(fixture, 'category', category.categoryName);
    fixture.detectChanges();

    expect(findEl(fixture, 'submit').properties.disabled).toBe(false);

    const modifyCategorySpy = spyOn(categoryService, 'modifyCategory').and.returnValue(of(category));
    const spyMessage = spyOn(messageBoxService, 'show').and.returnValue();

    findEl(fixture, 'form').triggerEventHandler('submit');
    fixture.detectChanges();

    expect(component.form.value.categoryName).toBeNull(); // Form has been reset
    expect(modifyCategorySpy).toHaveBeenCalledWith(category, Modify.Add);
    expect(spyMessage).toHaveBeenCalled();
  });

  it('deletes a category item', () => {
    const category = deepCoyp(CATEGORY_1) as Category;

    const spyDialog = spyOn(dialogService, 'confirmed').and.returnValue(of(true));
    const spyState = spyOn(BudgetState, 'getSelectedBudgetId').and.returnValue(category.budgetId);
    const spyMessage = spyOn(messageBoxService, 'show').and.returnValue();

    click(fixture, 'delete');

    expect(spyDialog).toHaveBeenCalled();
    expect(spyState).toHaveBeenCalled();
    expect(spyMessage).toHaveBeenCalled();
  });

  it('sets a category name that already exist, when adding an item', () => {
    fixture.detectChanges();

    const spy = spyOn(categoryService, 'duplicate').and.returnValue(true);

    setFieldValue(fixture, 'category', 'Category 1');
    fixture.detectChanges();

    const element = findEl(fixture, 'category-error').nativeElement as HTMLElement;

    expect(findEl(fixture, 'submit').properties.disabled).toBe(true);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(element.innerText).toContain('error.duplicate');
  });

  it('sets a category name that already exist, when editing an item', () => {
    fixture.detectChanges();

    spyOn(categoryService, 'duplicate').and.returnValue(false);

    setFieldValue(fixture, 'category', 'Category 1');
    fixture.detectChanges();

    expect(findEl(fixture, 'submit').properties.disabled).toBe(false);
  });
});
