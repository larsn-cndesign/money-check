import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  declarations: [],
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatInputModule, MatMenuModule],
  exports: [MatToolbarModule, MatButtonModule, MatIconModule, MatInputModule, MatMenuModule],
})
export class MaterialModule {}
