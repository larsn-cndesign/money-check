import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { BudgetItemComponent } from './budget-item.component';

@NgModule({
  declarations: [BudgetItemComponent],
  imports: [CommonModule, SharedModule],
})
export class BudgetItemModule {}
