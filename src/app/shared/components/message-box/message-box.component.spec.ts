import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../shared.module';
import { MessageBoxComponent } from './message-box.component';

describe('MessageBoxComponent', () => {
  let component: MessageBoxComponent;
  let fixture: ComponentFixture<MessageBoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule, MessageBoxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
