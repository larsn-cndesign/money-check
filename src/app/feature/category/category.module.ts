import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CategoryComponent } from './category.component';

@NgModule({
  imports: [SharedModule],
  declarations: [CategoryComponent],
})
export class CategoryModule {}
