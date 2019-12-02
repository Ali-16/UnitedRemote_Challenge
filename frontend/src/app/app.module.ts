import { NgModule } from "@angular/core";
import { AppComponent } from "./app.component";
import { ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from "@angular/platform-browser";
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxSpinnerModule } from 'ngx-spinner';
import { ScrollingModule } from '@angular/cdk/scrolling';

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
    ShopsItemComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    InfiniteScrollModule,
    NgxSpinnerModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
