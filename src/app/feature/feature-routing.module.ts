import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from '../core/components/home/home.component';
import { AuthGuard } from '../shared/services/auth-guard.service';
import { ActualItemComponent } from './actual-item/actual-item.component';
import { BudgetItemComponent } from './budget-item/budget-item.component';
import { BudgetVarianceComponent } from './budget-variance/budget-variance.component';
import { CreateBudgetYearComponent } from './budget-year/create-budget-year/create-budget-year.component';
import { DeleteBudgetYearComponent } from './budget-year/delete-budget-year/delete-budget-year.component';
import { CreateBudgetComponent } from './budget/create-budget/create-budget.component';
import { CategoryComponent } from './category/category.component';
import { FeatureComponent } from './feature.component';
import { TripComponent } from './trip/trip.component';
import { UnitComponent } from './unit/unit.component';
import { CreateVersionComponent } from './version/create-version/create-version.component';
import { ModifyVersionComponent } from './version/modify-version/modify-version.component';

const routes: Routes = [
  {
    path: '',
    component: FeatureComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: 'category', component: CategoryComponent },
      { path: 'unit', component: UnitComponent },
      { path: 'trip', component: TripComponent },
      { path: 'create-budget-year', component: CreateBudgetYearComponent },
      { path: 'delete-budget-year', component: DeleteBudgetYearComponent },
      { path: 'create-version', component: CreateVersionComponent },
      { path: 'modify-version', component: ModifyVersionComponent },
      { path: 'budget-item', component: BudgetItemComponent },
      { path: 'actual-item', component: ActualItemComponent },
      { path: 'budget-variance', component: BudgetVarianceComponent },
      { path: 'create-budget', component: CreateBudgetComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureRoutingModule {}
