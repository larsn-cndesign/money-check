import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CurrencyFormComponent } from './components/currency-form/currency-form.component';
import { CurrencyTableComponent } from './components/currency-table/currency-table.component';
import { FocusDirective } from './directives/focus.directive';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FocusDirective,
    CurrencyTableComponent,
    CurrencyFormComponent,
  ],
  exports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    FocusDirective,
    CurrencyTableComponent,
    CurrencyFormComponent,
  ],
})
export class SharedModule {}
