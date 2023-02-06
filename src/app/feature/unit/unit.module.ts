import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { UnitComponent } from './unit.component';

@NgModule({
  imports: [CommonModule, SharedModule],
  declarations: [UnitComponent],
})
export class UnitModule {}
