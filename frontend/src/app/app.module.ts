import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { MaterialModule } from "./material/material.module";
import { AuthComponent } from "./Authentification/auth/auth.component";
import { SigninComponent } from "./Authentification/Auth/signin/signin.component";
import { SignupComponent } from "./Authentification/Auth/signup/signup.component";
import { NavbarComponent } from "./header/navbar/navbar.component";
import { FooterComponent } from "./footer/footer.component";
import { ShopsListComponent } from "./shops/shops-list/shops-list.component";
import { ShopsItemComponent } from "./shops/shops-list/shops-item/shops-item.component";

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    SigninComponent,
    SignupComponent,
    NavbarComponent,
    FooterComponent,
    ShopsListComponent,
    ShopsItemComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
