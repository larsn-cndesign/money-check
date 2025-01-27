import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

/**
 * Class representing the landing page after logging in.
 * It contain links to the most common functionalities of the application.
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [SharedModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
