import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CreateBudgetComponent } from './create-budget.component';

@NgModule({
  declarations: [CreateBudgetComponent],
  imports: [CommonModule, SharedModule],
})
export class CreateBudgetModule {}
