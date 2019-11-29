import { Component, OnInit } from "@angular/core";
import { AuthService } from "src/app/Authentification/auth.service";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit {
  private isAuthenticated: Boolean;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isAuthenticated = this.authService.loggedIn;
  }
}
