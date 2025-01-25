import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterListComponent } from './filter-list.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [FilterListComponent],
  imports: [CommonModule, MatListModule, MatButtonModule, MatDividerModule],
  exports: [FilterListComponent],
})
export class FilterListModule {}
