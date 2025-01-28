import { Component } from '@angular/core';
import { SharedModule } from './shared/shared.module';
import { RouterOutlet } from '@angular/router';
import { SpinnerComponent } from './shared/components/spinner/spinner.component';
import { MessageBoxComponent } from './shared/components/message-box/message-box.component';
import { NavbarComponent } from './core/components/navbar/navbar.component';

/**
 * An expense budget application.
 * @author Lars Norrstrand <lars.norrstrand@cndesign.se>
 * @version 1.0.0
 * @see {@link http://github.com|GitHub}
 * @since 1.0.0
 * @todo Language support for Swedish, English and Spanish.
 * @todo Add a pgae for displaying graphs, trends etc...
 */
@Component({
    selector: 'app-root',
    imports: [SharedModule, RouterOutlet, MessageBoxComponent, SpinnerComponent, NavbarComponent],
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {}
