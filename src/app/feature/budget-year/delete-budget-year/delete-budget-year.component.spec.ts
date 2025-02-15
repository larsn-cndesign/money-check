import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { DeleteBudgetYearComponent } from './delete-budget-year.component';
import { TranslateModule } from '@ngx-translate/core';

describe('DeleteBudgetYearComponent', () => {
  let component: DeleteBudgetYearComponent;
  let fixture: ComponentFixture<DeleteBudgetYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, MatDialogModule, DeleteBudgetYearComponent, TranslateModule.forRoot()],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteBudgetYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
