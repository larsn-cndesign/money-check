import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateBudgetYearComponent } from './create-budget-year.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CreateBudgetYearComponent],
  imports: [CommonModule, SharedModule],
})
export class CreateBudgetYearModule {}
