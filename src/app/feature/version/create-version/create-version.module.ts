import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateVersionComponent } from './create-version.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [CreateVersionComponent],
  imports: [CommonModule, SharedModule],
})
export class CreateVersionModule {}
