import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { UnitComponent } from './unit.component';

@NgModule({
  declarations: [UnitComponent],
  imports: [CommonModule, SharedModule],
})
export class UnitModule {}
