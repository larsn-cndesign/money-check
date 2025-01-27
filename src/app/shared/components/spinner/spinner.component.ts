import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Observable } from 'rxjs';
import { SharedModule } from '../../shared.module';
import { SpinnerService } from './spinner.service';

/**
 * Class repersenting a spinner.
 */
@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [SharedModule, MatProgressSpinnerModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.scss'],
})
export class SpinnerComponent {
  /**
   * A listener to changes made of a loading spinner object.
   * @private
   */
  loading$: Observable<boolean>;

  /**
   * Crteates a spinner.
   * @param spinnerService Service for managing a spinner.
   */
  constructor(private spinnerService: SpinnerService) {
    this.loading$ = this.spinnerService.loading$;
  }
}
