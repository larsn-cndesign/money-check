import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterListComponent } from './filter-list.component';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
  declarations: [FilterListComponent],
  imports: [CommonModule, MatListModule, MatButtonModule, MatDividerModule],
  exports: [FilterListComponent],
})
export class FilterListModule {}
