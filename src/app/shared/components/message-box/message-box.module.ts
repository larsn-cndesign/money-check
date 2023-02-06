import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageBoxComponent } from './message-box.component';
import { SharedModule } from '../../shared.module';

@NgModule({
  declarations: [MessageBoxComponent],
  imports: [CommonModule, SharedModule],
  exports: [MessageBoxComponent],
})
export class MessageBoxModule {}
