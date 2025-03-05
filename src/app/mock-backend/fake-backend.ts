import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
  HttpResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
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
import { LS_ACCESS_TOKEN } from '../shared/classes/constants';
import { ItemFilter } from '../shared/classes/filter';
import { DatabaseService } from './database-service';
import { MOCK_DATA } from './mock-database';

// ------------------------------------
// CONSTANTS FOR TEST ONLY
// ------------------------------------
export const MOCK_DATA_STORAGE = 'db';
const FAKE_EMAIL = 'test@test.com';
const FAKE_USER_PASSWORD = '123456';
/** Simulate a delay of a http request in milliseconds */
const SIMULATED_HTTPREQUEST_DEALY = 0; // Change to test simulate slow response time
/** Fake user credentials */
const users = [{ email: FAKE_EMAIL, password: FAKE_USER_PASSWORD }] as any;

/**
 * Method for storing token in localStorage. Need to run for a user to be able to login as there are no signup form.
 * First login will always fail. Thereafter it will work as expected.
 * There are no translations for this fake backend http interceptor.
 */
export function setTokenForTestUser(): void {
  const testToken = localStorage.getItem(LS_ACCESS_TOKEN);
  if (!testToken) {
    localStorage.setItem(LS_ACCESS_TOKEN, 'jwt-token');
  }
}

export function loadMockData(): void {
  const mockData = localStorage.getItem(MOCK_DATA_STORAGE);
  if (!mockData) {
    localStorage.setItem(MOCK_DATA_STORAGE, JSON.stringify(MOCK_DATA));
  }
}

/**
 * Class representing a fake http interceptor to simlulate http requests.
 */
@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
  constructor(private translate: TranslateService) {}

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
          loadMockData();
          return authenticate();

        case url.endsWith('/api/budget') && method === 'GET':
          return getBudgets();
        case url.endsWith('/api/budget') && method === 'POST':
          return addBudget();
        case url.endsWith('/api/budget') && method === 'PUT':
          return editBudget();

        case url.endsWith('/api/category') && method === 'GET':
          return getCategories();
        case url.endsWith('/api/category') && method === 'POST':
          return addCategory();
        case url.endsWith('/api/category') && method === 'PUT':
          return editCategory();
        case url.endsWith('/api/category') && method === 'DELETE':
          return deleteCategory();

        case url.endsWith('/api/unit') && method === 'GET':
          return getUnits();
        case url.endsWith('/api/unit') && method === 'POST':
          return addUnit();
        case url.endsWith('/api/unit') && method === 'PUT':
          return editUnit();
        case url.endsWith('/api/unit') && method === 'DELETE':
          return deleteUnit();

        case url.endsWith('/api/trip') && method === 'GET':
          return getTrips();
        case url.endsWith('/api/trip') && method === 'POST':
          return addTrip();
        case url.endsWith('/api/trip') && method === 'PUT':
          return editTrip();
        case url.endsWith('/api/trip') && method === 'DELETE':
          return deleteTrip();

        case url.endsWith('/api/budgetYear') && method === 'GET':
          return getBudgetYear();
        case url.endsWith('/api/budgetYear') && method === 'POST':
          return createBudgetYear();
        case url.endsWith('/api/budgetYear') && method === 'DELETE':
          return deleteBudgetYear();

        case url.endsWith('/api/budgetVersion') && method === 'GET':
          return getCurrentVersion();
        case url.endsWith('/api/budgetVersion') && method === 'POST':
          return createVersion();
        case url.endsWith('/api/budgetVersion') && method === 'PUT':
          return updateVersion();
        case url.endsWith('/api/budgetVersion') && method === 'DELETE':
          return deleteVersion();

        case url.endsWith('/api/budgetItem/get') && method === 'POST':
          return getBudgetItems();
        case url.endsWith('/api/budgetItem') && method === 'POST':
          return addBudgetItem();
        case url.endsWith('/api/budgetItem') && method === 'PUT':
          return editBudgetItem();
        case url.endsWith('/api/budgetItem') && method === 'DELETE':
          return deleteBudgetItem();

        case url.endsWith('/api/actualItem/get') && method === 'POST':
          return getActualItems();
        case url.endsWith('/api/actualItem') && method === 'POST':
          return addActualItem();
        case url.endsWith('/api/actualItem') && method === 'PUT':
          return editActualItem();
        case url.endsWith('/api/actualItem') && method === 'DELETE':
          return deleteActualItem();

        case url.endsWith('/api/varianceItem/get') && method === 'POST':
          return getVarianceItems();

        case url.endsWith('/api/budget/state') && method === 'GET':
          return getBudgetState();

        default:
          return next.handle(request); // pass through any requests not handled above
      }
    }

    function authenticate(): Observable<HttpEvent<any>> {
      const { email, password } = body;
      const user = users.find((x: any) => x.email === email && x.password === password);
      if (!user) {
        return badRequest({
          title: 'Invalid credentials',
          description: 'Incorrect email or password',
        });
      }

      // Add the Authorization header
      const token = localStorage.getItem(LS_ACCESS_TOKEN);
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      return ok(headers, {
        name: 'Test user',
        isAdmin: true,
      } as AppUser);
    }

    // Budget
    function getBudgets(): Observable<HttpEvent<any>> {
      return of(new HttpResponse({ status: 200, body: DatabaseService.getBudgets() }));
    }
    function addBudget(): Observable<HttpEvent<any>> {
      const budget = DatabaseService.addBudget(JSON.parse(body) as Budget);
      return of(new HttpResponse({ status: 200, body: budget }));
    }
    function editBudget(): Observable<HttpEvent<any>> {
      const budget = DatabaseService.editBudget(JSON.parse(body) as Budget);
      return of(new HttpResponse({ status: 200, body: budget }));
    }

    // Category
    function getCategories(): Observable<HttpEvent<any>> {
      return of(new HttpResponse({ status: 200, body: DatabaseService.getCategories(getParamId(params) as number) }));
    }
    function addCategory(): Observable<HttpEvent<any>> {
      const categoryItem = DatabaseService.addCategory(JSON.parse(body) as Category);
      return of(new HttpResponse({ status: 200, body: categoryItem }));
    }
    function editCategory(): Observable<HttpEvent<any>> {
      const categoryItem = DatabaseService.editCategory(JSON.parse(body) as Category);
      return of(new HttpResponse({ status: 200, body: categoryItem }));
    }
    function deleteCategory(): Observable<HttpEvent<any>> {
      const categoryItem = DatabaseService.deleteCategory(JSON.parse(body) as Category);
      return of(new HttpResponse({ status: 200, body: categoryItem }));
    }

    // Unit
    function getUnits(): Observable<HttpEvent<any>> {
      return of(new HttpResponse({ status: 200, body: DatabaseService.getUnits(getParamId(params) as number) }));
    }
    function addUnit(): Observable<HttpEvent<any>> {
      const unitItem = DatabaseService.addUnit(JSON.parse(body) as Unit);
      return of(new HttpResponse({ status: 200, body: unitItem }));
    }
    function editUnit(): Observable<HttpEvent<any>> {
      const unitItem = DatabaseService.editUnit(JSON.parse(body) as Unit);
      return of(new HttpResponse({ status: 200, body: unitItem }));
    }
    function deleteUnit(): Observable<HttpEvent<any>> {
      const unitItem = DatabaseService.deleteUnit(JSON.parse(body) as Unit);
      return of(new HttpResponse({ status: 200, body: unitItem }));
    }

    // Trip
    function getTrips(): Observable<HttpEvent<any>> {
      return of(new HttpResponse({ status: 200, body: DatabaseService.getTrips(getParamId(params) as number) }));
    }
    function addTrip(): Observable<HttpEvent<any>> {
      const tripItem = DatabaseService.addTrip(JSON.parse(body) as Trip);
      return of(new HttpResponse({ status: 200, body: tripItem }));
    }
    function editTrip(): Observable<HttpEvent<any>> {
      const tripItem = DatabaseService.editTrip(JSON.parse(body) as Trip);
      return of(new HttpResponse({ status: 200, body: tripItem }));
    }
    function deleteTrip(): Observable<HttpEvent<any>> {
      const tripItem = DatabaseService.deleteTrip(JSON.parse(body) as Trip);
      return of(new HttpResponse({ status: 200, body: tripItem }));
    }

    // Budget year
    function getBudgetYear(): Observable<HttpEvent<any>> {
      return of(new HttpResponse({ status: 200, body: DatabaseService.getBudgetYear(getParamId(params) as number) }));
    }
    function createBudgetYear(): Observable<HttpEvent<any>> {
      const item = JSON.parse(body) as ManageBudgetYear;
      DatabaseService.createBudgetYear(item);
      const manageBudgetYear = DatabaseService.getBudgetYear(item.budgetYear.budgetId);
      return of(new HttpResponse({ status: 200, body: manageBudgetYear.budgetYear }));
    }
    function deleteBudgetYear(): Observable<HttpEvent<any>> {
      const budgetYear = JSON.parse(body) as BudgetYear;
      DatabaseService.deleteBudgetYear(budgetYear);
      return of(new HttpResponse({ status: 200 }));
    }

    // Version
    function getCurrentVersion(): Observable<HttpEvent<any>> {
      return of(
        new HttpResponse({ status: 200, body: DatabaseService.getCurrentVersion(getParamId(params) as number) })
      );
    }
    function createVersion(): Observable<HttpEvent<any>> {
      DatabaseService.createVersion(JSON.parse(body) as ManageBudgetYear);
      return of(new HttpResponse({ status: 200 }));
    }
    function updateVersion(): Observable<HttpEvent<any>> {
      DatabaseService.updateVersion(JSON.parse(body) as ManageBudgetYear);
      return of(new HttpResponse({ status: 200 }));
    }
    function deleteVersion(): Observable<HttpEvent<any>> {
      DatabaseService.deleteVersion(JSON.parse(body) as BudgetYear);
      return of(new HttpResponse({ status: 200 }));
    }

    // Budget item
    function getBudgetItems(): Observable<HttpEvent<any>> {
      return of(
        new HttpResponse({ status: 200, body: DatabaseService.getBudgetItems(JSON.parse(body) as ItemFilter) })
      );
    }
    function addBudgetItem(): Observable<HttpEvent<any>> {
      const budgetItem = DatabaseService.addBudgetItem(JSON.parse(body) as BudgetItem);
      return of(new HttpResponse({ status: 200, body: budgetItem }));
    }
    function editBudgetItem(): Observable<HttpEvent<any>> {
      const budgetItem = DatabaseService.editBudgetItem(JSON.parse(body) as BudgetItem);
      return of(new HttpResponse({ status: 200, body: budgetItem }));
    }
    function deleteBudgetItem(): Observable<HttpEvent<any>> {
      const budgetItem = DatabaseService.deleteBudgetItem(JSON.parse(body) as BudgetItem);
      return of(new HttpResponse({ status: 200, body: budgetItem }));
    }

    // Actual item
    function getActualItems(): Observable<HttpEvent<any>> {
      return of(
        new HttpResponse({ status: 200, body: DatabaseService.getActualItems(JSON.parse(body) as ItemFilter) })
      );
    }
    function addActualItem(): Observable<HttpEvent<any>> {
      const budgetItem = DatabaseService.addActualItem(JSON.parse(body) as ActualItem);
      return of(new HttpResponse({ status: 200, body: budgetItem }));
    }
    function editActualItem(): Observable<HttpEvent<any>> {
      const budgetItem = DatabaseService.editActualItem(JSON.parse(body) as ActualItem);
      return of(new HttpResponse({ status: 200, body: budgetItem }));
    }
    function deleteActualItem(): Observable<HttpEvent<any>> {
      const budgetItem = DatabaseService.deleteActualItem(JSON.parse(body) as ActualItem);
      return of(new HttpResponse({ status: 200, body: budgetItem }));
    }

    // Budget variance
    function getVarianceItems(): Observable<HttpEvent<any>> {
      return of(
        new HttpResponse({ status: 200, body: DatabaseService.getVarianceItems(JSON.parse(body) as ItemFilter) })
      );
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

    function getParamId(httpParams: HttpParams): number {
      const param = httpParams.get('id');
      return param ? +param : -1;
    }
  }
}

export const fakeBackendProvider = {
  provide: HTTP_INTERCEPTORS,
  useClass: FakeBackendInterceptor,
  multi: true,
};
