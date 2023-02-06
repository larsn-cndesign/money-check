import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BudgetVarianceComponent } from './budget-variance.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [BudgetVarianceComponent],
  imports: [CommonModule, SharedModule],
})
export class BudgetVarianceModule {}
