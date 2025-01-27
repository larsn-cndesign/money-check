import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FilterListComponent } from '../shared/components/filter-list/filter-list.component';
import { CreateVersionComponent } from './version/create-version/create-version.component';
import { ModifyVersionComponent } from './version/modify-version/modify-version.component';
import { UnitComponent } from './unit/unit.component';
import { TripComponent } from './trip/trip.component';
import { CategoryComponent } from './category/category.component';
import { CreateBudgetYearComponent } from './budget-year/create-budget-year/create-budget-year.component';
import { DeleteBudgetYearComponent } from './budget-year/delete-budget-year/delete-budget-year.component';
import { BudgetVarianceComponent } from './budget-variance/budget-variance.component';
import { BudgetItemComponent } from './budget-item/budget-item.component';
import { CreateBudgetComponent } from './budget/create-budget/create-budget.component';
import { ActualItemComponent } from './actual-item/actual-item.component';

/**
 * Class representing a landing path for an authenticated user.
 */
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [
    SharedModule,
    RouterOutlet,
    FilterListComponent,
    CreateVersionComponent,
    ModifyVersionComponent,
    UnitComponent,
    TripComponent,
    CategoryComponent,
    CreateBudgetYearComponent,
    DeleteBudgetYearComponent,
    BudgetVarianceComponent,
    BudgetItemComponent,
    CreateBudgetComponent,
    ActualItemComponent,
  ],
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
})
export class FeatureComponent {}
