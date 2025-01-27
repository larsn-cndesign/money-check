import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';

/** The main entry point of the application */
bootstrapApplication(AppComponent, appConfig).catch((err) => console.error(err));
