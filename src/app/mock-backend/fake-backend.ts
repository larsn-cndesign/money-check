import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
  HttpResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, dematerialize, materialize, mergeMap } from 'rxjs/operators';
import { AppUser } from '../core/models/app-user.model';
import { ActualItem } from '../feature/actual-item/shared/actual-item.model';
import { BudgetItem } from '../feature/budget-item/shared/butget-item.model';
import { BudgetYear, ManageBudgetYear } from '../feature/budget-year/shared/budget-year.model';
import { Budget } from '../feature/budget/shared/budget.model';
import { Category } from '../feature/category/shared/category.model';
import { Trip } from '../feature/trip/shared/trip.model';
import { Unit } from '../feature/unit/shared/unit.model';
import { ItemFilter } from '../shared/classes/filter';
import { DatabaseService } from './database-service';

// ------------------------------------
// CONSTANTS FOR TEST ONLY
// ------------------------------------
const FAKE_EMAIL = 'test@test.com';
const FAKE_USER_PASSWORD = '123456';
/** Simulate a delay of a http request in milliseconds */
const SIMULATED_HTTPREQUEST_DEALY = 0;
const ACCESS_TOKEN = 'access_token';
const TEST_TOKEN = 'test_token';
/** Fake user credentials */
const users = [{ email: FAKE_EMAIL, password: FAKE_USER_PASSWORD }] as any;

/**
 * Method for storing token in localStorage. Need to run for a user to be able to login as there are no signup form.
 * First login will always fail. Thereafter it will work as expected.
 */
export function setTokenForTestUser(): void {
  const testToken = localStorage.getItem(TEST_TOKEN);
  if (!testToken) {
    localStorage.setItem(ACCESS_TOKEN, 'jwt-token');
    localStorage.setItem(TEST_TOKEN, 'jwt-token');
  }
}

/**
 * Class representing a fake http interceptor to simlulate http requests.
 */
@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body, params } = request;

    // Wrap delayed observable to simulate server api call.
    // Call materialize and dematerialize to ensure delay even if an error is thrown
    // (https://github.com/Reactive-Extensions/RxJS/issues/648)
    return of(null)
      .pipe(mergeMap(handleRoute))
      .pipe(materialize())
      .pipe(delay(SIMULATED_HTTPREQUEST_DEALY))
      .pipe(dematerialize());

    function handleRoute(): Observable<HttpEvent<any>> {
      switch (true) {
        case url.endsWith('/api/authenticate') && method === 'POST':
          setTokenForTestUser();
          return authenticate();

        case url.endsWith('/api/LoadBudgetPage') && method === 'GET':
          return loadBudgetPage();
        case url.endsWith('/api/AddBudget') && method === 'POST':
          return addBudget();
        case url.endsWith('/api/EditBudget') && method === 'POST':
          return editBudget();

        case url.endsWith('/api/category') && method === 'GET':
          return getCategories();
        case url.endsWith('/api/AddCategory') && method === 'POST':
          return addCategory();
        case url.endsWith('/api/EditCategory') && method === 'POST':
          return editCategory();
        case url.endsWith('/api/DeleteCategory') && method === 'POST':
          return deleteCategory();

        case url.endsWith('/api/LoadUnitPage') && method === 'GET':
          return loadUnitPage();
        case url.endsWith('/api/AddUnit') && method === 'POST':
          return addUnit();
        case url.endsWith('/api/EditUnit') && method === 'POST':
          return editUnit();
        case url.endsWith('/api/DeleteUnit') && method === 'POST':
          return deleteUnit();

        case url.endsWith('/api/LoadTripPage') && method === 'GET':
          return loadTripPage();
        case url.endsWith('/api/AddTrip') && method === 'POST':
          return addTrip();
        case url.endsWith('/api/EditTrip') && method === 'POST':
          return editTrip();
        case url.endsWith('/api/DeleteTrip') && method === 'POST':
          return deleteTrip();

        case url.endsWith('/api/GetBudgetYear') && method === 'GET':
          return getBudgetYear();
        case url.endsWith('/api/CreateBudgetYear') && method === 'POST':
          return createBudgetYear();
        case url.endsWith('/api/DeleteBudgetYear') && method === 'POST':
          return deleteBudgetYear();

        case url.endsWith('/api/CreateVersion') && method === 'POST':
          return createVersion();
        case url.endsWith('/api/GetCurrentVersion') && method === 'POST':
          return getCurrentVersion();
        case url.endsWith('/api/DeleteVersion') && method === 'POST':
          return deleteVersion();
        case url.endsWith('/api/UpdateVersion') && method === 'POST':
          return updateVersion();

        case url.endsWith('/api/GetBudgetItems') && method === 'POST':
          return getBudgetItems();
        case url.endsWith('/api/AddBudgetItem') && method === 'POST':
          return addBudgetItem();
        case url.endsWith('/api/EditBudgetItem') && method === 'POST':
          return editBudgetItem();
        case url.endsWith('/api/DeleteBudgetItem') && method === 'POST':
          return deleteBudgetItem();

        case url.endsWith('/api/GetActualItems') && method === 'POST':
          return getActualItems();
        case url.endsWith('/api/AddActualItem') && method === 'POST':
          return addActualItem();
        case url.endsWith('/api/EditActualItem') && method === 'POST':
          return editActualItem();
        case url.endsWith('/api/DeleteActualItem') && method === 'POST':
          return deleteActualItem();

        case url.endsWith('/api/LoadVariancePage') && method === 'GET':
          return loadVariancePage();
        case url.endsWith('/api/GetVarianceItems') && method === 'POST':
          return getVarianceItems();

        case url.endsWith('/api/GetBudgetState') && method === 'GET':
          return getBudgetState();

        default:
          return next.handle(request); // pass through any requests not handled above
      }
    }

    function authenticate(): Observable<HttpEvent<any>> {
      const { email, password } = body;
      const user = users.find((x: any) => x.email === email && x.password === password);
      if (!user) {
        return badRequest({ message: 'Bad request' });
      }
      return ok(headers, {
        name: 'Test user',
        isAdmin: true,
      } as AppUser);
    }

    // Budget
    function loadBudgetPage(): Observable<HttpEvent<any>> {
      return of(new HttpResponse({ status: 200, body: DatabaseService.getBudgets() }));
    }
    function addBudget(): Observable<HttpEvent<any>> {
      const budget = DatabaseService.addBudget(getkey(body) as Budget);
      return of(new HttpResponse({ status: 200, body: budget }));
    }
    function editBudget(): Observable<HttpEvent<any>> {
      const budget = DatabaseService.editBudget(getkey(body) as Budget);
      return of(new HttpResponse({ status: 200, body: budget }));
    }

    // Category
    function getCategories(): Observable<HttpEvent<any>> {
      return of(new HttpResponse({ status: 200, body: DatabaseService.getCategories(getParamId(params) as number) }));
    }
    function addCategory(): Observable<HttpEvent<any>> {
      const categoryItem = DatabaseService.addCategory(getkey(body) as Category);
      return of(new HttpResponse({ status: 200, body: categoryItem }));
    }
    function editCategory(): Observable<HttpEvent<any>> {
      const categoryItem = DatabaseService.editCategory(getkey(body) as Category);
      return of(new HttpResponse({ status: 200, body: categoryItem }));
    }
    function deleteCategory(): Observable<HttpEvent<any>> {
      const categoryItem = DatabaseService.deleteCategory(getkey(body) as Category);
      return of(new HttpResponse({ status: 200, body: categoryItem }));
    }

    // Unit
    function loadUnitPage(): Observable<HttpEvent<any>> {
      return of(new HttpResponse({ status: 200, body: DatabaseService.getUnits(getParamId(params) as number) }));
    }
    function addUnit(): Observable<HttpEvent<any>> {
      const unitItem = DatabaseService.addUnit(getkey(body) as Unit);
      return of(new HttpResponse({ status: 200, body: unitItem }));
    }
    function editUnit(): Observable<HttpEvent<any>> {
      const unitItem = DatabaseService.editUnit(getkey(body) as Unit);
      return of(new HttpResponse({ status: 200, body: unitItem }));
    }
    function deleteUnit(): Observable<HttpEvent<any>> {
      const unitItem = DatabaseService.deleteUnit(getkey(body) as Unit);
      return of(new HttpResponse({ status: 200, body: unitItem }));
    }

    // Trip
    function loadTripPage(): Observable<HttpEvent<any>> {
      return of(new HttpResponse({ status: 200, body: DatabaseService.getTrips(getParamId(params) as number) }));
    }
    function addTrip(): Observable<HttpEvent<any>> {
      const tripItem = DatabaseService.addTrip(getkey(body) as Trip);
      return of(new HttpResponse({ status: 200, body: tripItem }));
    }
    function editTrip(): Observable<HttpEvent<any>> {
      const tripItem = DatabaseService.editTrip(getkey(body) as Trip);
      return of(new HttpResponse({ status: 200, body: tripItem }));
    }
    function deleteTrip(): Observable<HttpEvent<any>> {
      const tripItem = DatabaseService.deleteTrip(getkey(body) as Trip);
      return of(new HttpResponse({ status: 200, body: tripItem }));
    }

    // Budget year
    function getBudgetYear(): Observable<HttpEvent<any>> {
      return of(new HttpResponse({ status: 200, body: DatabaseService.getBudgetYear(getParamId(params) as number) }));
    }
    function createBudgetYear(): Observable<HttpEvent<any>> {
      const item = getkey(body) as ManageBudgetYear;
      DatabaseService.createBudgetYear(item);
      return of(new HttpResponse({ status: 200, body: DatabaseService.getBudgetYear(item.budgetYear.budgetId) }));
    }
    function deleteBudgetYear(): Observable<HttpEvent<any>> {
      const budgetYear = getkey(body) as BudgetYear;
      DatabaseService.deleteBudgetYear(budgetYear);
      return of(new HttpResponse({ status: 200, body: DatabaseService.getBudgetYear(budgetYear.budgetId) }));
    }

    // Version
    function createVersion(): Observable<HttpEvent<any>> {
      DatabaseService.createVersion(getkey(body) as ManageBudgetYear);
      return of(new HttpResponse({ status: 200, body: true }));
    }
    function getCurrentVersion(): Observable<HttpEvent<any>> {
      return of(new HttpResponse({ status: 200, body: DatabaseService.getCurrentVersion(getkey(body) as BudgetYear) }));
    }
    function deleteVersion(): Observable<HttpEvent<any>> {
      DatabaseService.deleteVersion(getkey(body) as ManageBudgetYear);
      return of(new HttpResponse({ status: 200, body: true }));
    }
    function updateVersion(): Observable<HttpEvent<any>> {
      DatabaseService.updateVersion(getkey(body) as ManageBudgetYear);
      return of(new HttpResponse({ status: 200, body: true }));
    }

    // Budget item
    function getBudgetItems(): Observable<HttpEvent<any>> {
      return of(new HttpResponse({ status: 200, body: DatabaseService.getBudgetItems(getkey(body) as ItemFilter) }));
    }
    function addBudgetItem(): Observable<HttpEvent<any>> {
      const budgetItem = DatabaseService.addBudgetItem(getkey(body) as BudgetItem);
      return of(new HttpResponse({ status: 200, body: budgetItem }));
    }
    function editBudgetItem(): Observable<HttpEvent<any>> {
      const budgetItem = DatabaseService.editBudgetItem(getkey(body) as BudgetItem);
      return of(new HttpResponse({ status: 200, body: budgetItem }));
    }
    function deleteBudgetItem(): Observable<HttpEvent<any>> {
      const budgetItem = DatabaseService.deleteBudgetItem(getkey(body) as BudgetItem);
      return of(new HttpResponse({ status: 200, body: budgetItem }));
    }

    // Actual item
    function getActualItems(): Observable<HttpEvent<any>> {
      return of(new HttpResponse({ status: 200, body: DatabaseService.getActualItems(getkey(body) as ItemFilter) }));
    }
    function addActualItem(): Observable<HttpEvent<any>> {
      const budgetItem = DatabaseService.addActualItem(getkey(body) as ActualItem);
      return of(new HttpResponse({ status: 200, body: budgetItem }));
    }
    function editActualItem(): Observable<HttpEvent<any>> {
      const budgetItem = DatabaseService.editActualItem(getkey(body) as ActualItem);
      return of(new HttpResponse({ status: 200, body: budgetItem }));
    }
    function deleteActualItem(): Observable<HttpEvent<any>> {
      const budgetItem = DatabaseService.deleteActualItem(getkey(body) as ActualItem);
      return of(new HttpResponse({ status: 200, body: budgetItem }));
    }

    // Budget variance
    function loadVariancePage(): Observable<HttpEvent<any>> {
      return of(
        new HttpResponse({ status: 200, body: DatabaseService.loadVariancePage(getParamId(params) as number) })
      );
    }
    function getVarianceItems(): Observable<HttpEvent<any>> {
      return of(new HttpResponse({ status: 200, body: DatabaseService.getVarianceItems(getkey(body) as ItemFilter) }));
    }

    // Budget state
    function getBudgetState(): Observable<HttpEvent<any>> {
      return of(new HttpResponse({ status: 200, body: DatabaseService.getBudgetState() }));
    }

    // Helper functions
    function ok(myHeader: any, myBody: any): Observable<HttpResponse<any>> {
      return of(new HttpResponse({ status: 200, body: myBody, headers: myHeader }));
    }
    function badRequest(message: any): Observable<HttpResponse<any>> {
      throw new HttpErrorResponse({ error: message, status: 400 });
    }
    function unauthorized(): Observable<HttpResponse<any>> {
      throw new HttpErrorResponse({ error: 'Unauthorised', status: 404 });
    }

    function getkey(objVal: any): any {
      let obj = {};
      for (const key of Object.keys(objVal)) {
        obj = objVal[key];
      }
      return obj;
    }

    function getParamId(httpParams: HttpParams): number {
      const param = httpParams.get('budgetId');
      return param ? +param : -1;
    }
  }
}

export const fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
