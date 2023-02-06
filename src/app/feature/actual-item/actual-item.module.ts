import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActualItemComponent } from './actual-item.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ActualItemComponent],
  imports: [CommonModule, SharedModule],
})
export class ActualItemModule {}
