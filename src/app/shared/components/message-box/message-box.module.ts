import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageBoxComponent } from './message-box.component';
import { SkipSanitizeHtmlPipe } from '../../pipes/skip-sanitize-html';
import { MatIconModule } from '@angular/material/icon';
import { MessageBoxService } from './shared/message-box.service';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [MessageBoxComponent],
  imports: [SharedModule],
  exports: [MessageBoxComponent],
  providers: [MessageBoxService],
})
export class MessageBoxModule {}
