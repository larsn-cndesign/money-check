import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { UserService } from 'src/app/shared/services/user.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { AppUser } from '../../models/app-user.model';
import { MatMenuModule } from '@angular/material/menu';

/**
 * Class representing a reusable menu for both `toolbar` and `sidenav`.
 */
@Component({
    selector: 'app-menu',
    imports: [SharedModule, RouterLink, MatMenuModule],
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  /**
   * An observer of a user.
   * @public
   */
  user$: Observable<AppUser>;

  /**
   * An event emitter that emits when a navigation link has been cliked.
   */
  @Output() navigated = new EventEmitter();

  /**
   * Initializes services.
   * @param userService A service that manage user info in `localStorage`.
   * @param authService Manage user authenticaton.
   * @param router Navigation service.
   */
  constructor(private userService: UserService, private authService: AuthService, private router: Router) {
    // Get stored user object if user is logged in, useful if page is refreshed.
    if (this.authService.isLoggedIn()) {
      this.userService.getStoredUser();
    }
    this.user$ = this.userService.item$;
  }

  /**
   * @description Listen to navigation events.
   */
  ngOnInit(): void {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.navigated.emit();
      }
    });
  }

  /**
   * Logging out a user and redirects to login page.
   */
  logout(): void {
    this.authService.logout();
  }
}
