import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FilterListModule } from '../shared/components/filter-list/filter-list.module';
import { ActualItemModule } from './actual-item/actual-item.module';
import { BudgetItemModule } from './budget-item/budget-item.module';
import { BudgetVarianceModule } from './budget-variance/budget-variance.module';
import { CreateBudgetYearModule } from './budget-year/create-budget-year/create-budget-year.module';
import { DeleteBudgetYearModule } from './budget-year/delete-budget-year/delete-budget-year.module';
import { CreateBudgetModule } from './budget/create-budget/create-budget.module';
import { CategoryModule } from './category/category.module';
import { FeatureRoutingModule } from './feature-routing.module';
import { FeatureComponent } from './feature.component';
import { TripModule } from './trip/trip.module';
import { UnitModule } from './unit/unit.module';
import { CreateVersionModule } from './version/create-version/create-version.module';
import { ModifyVersionModule } from './version/modify-version/modify-version.module';

@NgModule({
  declarations: [FeatureComponent],
  imports: [
    CommonModule,
    FeatureRoutingModule,
    CategoryModule,
    UnitModule,
    TripModule,
    CreateBudgetYearModule,
    DeleteBudgetYearModule,
    CreateVersionModule,
    ModifyVersionModule,
    BudgetItemModule,
    ActualItemModule,
    BudgetVarianceModule,
    CreateBudgetModule,
    FilterListModule
  ],
})
export class FeatureModule {}
