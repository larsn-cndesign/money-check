import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FilterListComponent } from '../shared/components/filter-list/filter-list.component';
import { SharedModule } from '../shared/shared.module';

/**
 * Class representing a landing path for an authenticated user.
 */
@Component({
  selector: 'app-feature',
  standalone: true,
  imports: [SharedModule, RouterOutlet, FilterListComponent],
  templateUrl: './feature.component.html',
  styleUrls: ['./feature.component.scss'],
})
export class FeatureComponent {}
