import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteBudgetYearComponent } from './delete-budget-year.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [DeleteBudgetYearComponent],
  imports: [CommonModule, SharedModule],
})
export class DeleteBudgetYearModule {}
