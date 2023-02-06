import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TripComponent } from './trip.component';

@NgModule({
  declarations: [TripComponent],
  imports: [CommonModule, SharedModule],
})
export class TripModule {}
