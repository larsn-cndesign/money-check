import { Component, OnInit } from '@angular/core';
import { TitleService } from 'src/app/shared/services/title.service';

/**
 * Class representing the landing page after logging in.
 * It contain links to the most common functionalities of the application.
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  /**
   * The title of the component.
   * @private
   * @readonly
   */
  private readonly title = 'Hem';

  /**
   * @param titleService Manage title of the current HTML document
   */
  constructor(private titleService: TitleService) {}

  /**
   * @description Set title of HTML document.
   */
  ngOnInit(): void {
    this.titleService.setTitle(this.title);
  }
}
