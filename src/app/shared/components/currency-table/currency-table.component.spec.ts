import { CdkTableModule, DataSource } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortHeader, MatSortModule } from '@angular/material/sort';
import {
  MatCell,
  MatCellDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { SharedModule } from '../../shared.module';
import { ConfirmDialogModule } from '../confirm-dialog/confirm-dialog.module';
import { CurrencyFormComponent } from '../currency-form/currency-form.component';
import { MessageBoxModule } from '../message-box/message-box.module';

import { CurrencyTableComponent } from './currency-table.component';

describe('CurrencyTableComponent', () => {
  let component: CurrencyTableComponent;
  let fixture: ComponentFixture<CurrencyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        // CommonModule,
        // HttpClientTestingModule,
        // ConfirmDialogModule,
        // ReactiveFormsModule,
        // NoopAnimationsModule,
        // MatInputModule,
        // MatRadioModule,
        // MatTableModule,
        // CdkTableModule,
        // MatToolbarModule,
        // MatButtonModule,
        // MatIconModule,
        // MatInputModule,
        // MatMenuModule,
        MatTableModule,
        // MatDatepickerModule,
        // MatDividerModule,
        // MatButtonToggleModule,
        // MatRadioModule,
        // MatDialogModule,
        // MatCheckboxModule,
        // MatProgressSpinnerModule,
        // MatSelectModule,
        // MatSortModule,
        // MessageBoxModule,
        // BrowserModule,
        // AppRoutingModule,
        // BrowserAnimationsModule,
        // MatNativeDateModule,
        // // MatTableDataSource,
        // // MatSort,
        // // DataSource,
        // SharedModule,
        // MatPaginator,
        // MatSort,
        // CdkTableModule,
        // MatTable,
        MatTableModule,
      ],
      declarations: [
        CurrencyTableComponent,
        MatHeaderRow,
        MatHeaderCell,
        MatHeaderCellDef,
        MatHeaderRowDef,
        MatSortHeader,
        MatRow,
        MatRowDef,
        MatCell,
        MatCellDef,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
