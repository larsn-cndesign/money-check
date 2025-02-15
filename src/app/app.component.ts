import { Component, OnDestroy, OnInit } from '@angular/core';
import { DateAdapter } from '@angular/material/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { NavbarComponent } from './core/components/navbar/navbar.component';
import { pipeTakeUntil } from './shared/classes/common.fn';
import { MessageBoxComponent } from './shared/components/message-box/message-box.component';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { LanguageService } from './shared/services/language.service';
import { SharedModule } from './shared/shared.module';

/**
 * Main component for the Expense Budget Application.
 * This component serves as the root of the application, managing language settings and locale adaptations for various features.
 *
 * @author Lars Norrstrand <lars.norrstrand@cndesign.se>
 * @version 2.3
 * @see {@link http://github.com|GitHub Repository}
 * @since 1.0.0
 *
 * @todo Add language support for Swedish, English, and Spanish.
 * @todo Implement a page for displaying graphs, trends, etc.
 *
 * @description
 * The `AppComponent` initializes the translation service with a default language (English),
 * applies the selected language based on the user's preferences, and adapts the locale for
 * date formats and other locale-dependent features.
 * It listens for language changes and updates the locale accordingly.
 */
@Component({
  selector: 'app-root',
  imports: [SharedModule, RouterOutlet, MessageBoxComponent, SpinnerComponent, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  /** Subject used to manage the lifecycle of subscriptions */
  private sub$ = new Subject<void>();

  /**
   * Constructor for initializing the component with required services.
   *
   * @param translate - The translation service used to manage language settings.
   * @param languageService - Service used to get the current language preference.
   * @param dateAdapter - Adapter used to handle locale-specific date formatting.
   */
  constructor(
    private translate: TranslateService,
    private languageService: LanguageService,
    private dateAdapter: DateAdapter<any>
  ) {
    this.translate.setDefaultLang('en-GB');
    this.translate.use(this.languageService.getLanguage());
  }

  /**
   * Initializes the component and subscribes to language change events.
   * Updates the locale of the date adapter based on the selected language.
   */
  ngOnInit(): void {
    pipeTakeUntil(this.languageService.localeChanged, this.sub$).subscribe((language: string) => {
      this.dateAdapter.setLocale(language);
    });
  }

  /**
   * Cleanup when the component is destroyed. Unsubscribes from all active subscriptions.
   */
  ngOnDestroy(): void {
    this.sub$.next();
    this.sub$.complete();
  }
}
