import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import * as global from '../../shared/models/global-constants';

/**
 * Class representing a document title service.
 */
@Injectable({
  providedIn: 'root',
})
export class TitleService {
  /**
   * Create a title.
   * @param title A service for managing document title.
   */
  constructor(private title: Title) {}

  /**
   * Set title of HTML document.
   * @param title The title of the document.
   */
  setTitle(title: string): void {
    this.title.setTitle(global.appName + ' - ' + title);
  }
}
