import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../core/components/home/home.component';
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
import { canActivate } from '../shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    component: FeatureComponent,
    canActivate: [canActivate],
    children: [
      { path: 'home', title: 'Hem', component: HomeComponent },
      { path: 'category', title: 'Hantera Kategorier', component: CategoryComponent },
      { path: 'unit', title: 'Hantera Enheter', component: UnitComponent },
      { path: 'trip', title: 'Hantera Resor', component: TripComponent },
      { path: 'create-budget-year', title: 'Skapa Budgetår', component: CreateBudgetYearComponent },
      { path: 'delete-budget-year', title: 'Ta Bort Budgetår', component: DeleteBudgetYearComponent },
      { path: 'create-version', title: 'Skapa Version', component: CreateVersionComponent },
      { path: 'modify-version', title: 'Hantera Version', component: ModifyVersionComponent },
      { path: 'budget-item', title: 'Hantera Budget', component: BudgetItemComponent },
      { path: 'actual-item', title: 'Hantera Transaktioner', component: ActualItemComponent },
      { path: 'budget-variance', title: 'Budget vs Utfall', component: BudgetVarianceComponent },
      { path: 'create-budget', title: 'Skapa Budget', component: CreateBudgetComponent },
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeatureRoutingModule {}
