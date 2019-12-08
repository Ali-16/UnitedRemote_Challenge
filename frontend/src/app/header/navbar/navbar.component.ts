import { Component, OnInit } from "@angular/core";

import { AuthService } from "src/app/Authentification/auth.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  public isAuthenticated: Boolean;
  private userName: string;

  constructor(
    private authService: AuthService,

  ) { }

  /**
   * When initiating the navbar, it subscribes to the authentication status
   */
  ngOnInit() {
    this.authService.authStatus
      .subscribe(value => {
        this.isAuthenticated = value
        if (value) {
          const email = localStorage.getItem('email');
          this.userName = email.substring(0, email.indexOf('@'));
        }
      });
  }

  /**
   * After confirm by the user, he is logging out. remove the token from localStorage
   * All the subscribers to Subject are getting the new status
   */
  confirmLogout() {
    this.authService.logout();
  }
}
