import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import * as global from '../../shared/models/global-constants';

/**
 * Class representing a custom document title strategy.
 * Sets the title prefixed with the name of the application.
 */
@Injectable({ providedIn: 'root' })
export class PageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  /**
   * Set the sitle of the HTML document prefixed with the name of the application.
   * @param routerState The snaphot of the router.
   * @override
   */
  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`${global.appName} | ${title}`);
    }
  }
}
