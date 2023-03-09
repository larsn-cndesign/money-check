import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatRadioModule } from '@angular/material/radio';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { CurrencyTableComponent } from './components/currency-table/currency-table.component';
import { CurrencyFormComponent } from './components/currency-form/currency-form.component';
import { FocusDirective } from './directives/focus.directive';
import { SkipSanitizeHtmlPipe } from './pipes/skip-sanitize-html';

@NgModule({
  declarations: [CurrencyTableComponent, CurrencyFormComponent, FocusDirective, SkipSanitizeHtmlPipe],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTableModule,
    MatDatepickerModule,
    MatDividerModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
  ],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatTableModule,
    MatDatepickerModule,
    MatDividerModule,
    MatButtonToggleModule,
    MatRadioModule,
    MatDialogModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSortModule,
    CurrencyTableComponent,
    CurrencyFormComponent,
    FocusDirective,
    SkipSanitizeHtmlPipe,
  ],
})
export class SharedModule {}
