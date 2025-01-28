import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedModule } from 'src/app/shared/shared.module';
import { ModifyVersionComponent } from './modify-version.component';

describe('ModifyVersionComponent', () => {
  let component: ModifyVersionComponent;
  let fixture: ComponentFixture<ModifyVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModifyVersionComponent],
      imports: [SharedModule, MatDialogModule],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
