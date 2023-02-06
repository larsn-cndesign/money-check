import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModifyVersionComponent } from './modify-version.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [ModifyVersionComponent],
  imports: [CommonModule, SharedModule],
})
export class ModifyVersionModule {}
