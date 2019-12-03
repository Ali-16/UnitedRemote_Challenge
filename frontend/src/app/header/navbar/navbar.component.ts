import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';

import { TokenService } from 'src/app/shared/token.service';
import { AuthService } from "src/app/Authentification/auth.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  public isAuthenticated: Boolean;

  constructor(
    private authService: AuthService,
    private router: Router,
    private tokenService: TokenService
  ) { }

  /**
   * When initiating the navbar, it subscribes to the authentication status
   */
  ngOnInit() {
    this.authService.authStatus
      .subscribe(value => this.isAuthenticated = value);
  }

  /**
   * After confirm by the user, he is logging out. remove the token from localStorage
   * All the subscribers to Subject are getting the new status
   */
  logout(event: MouseEvent) {
    event.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
      this.tokenService.removeToken();
      this.tokenService.removeUserId();
      this.router.navigateByUrl('/signin');
      this.authService.changeAuthStatus(false);
    }
  }
}
