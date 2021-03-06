import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError, BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';


import { TokenService } from 'src/app/shared/token.service';
import { Credentials } from "./credentials.model";
import * as globals from "src/app/shared/globals"

@Injectable({
  providedIn: "root"
})

/**
 * The servcie communicates with Backend API
 * Is responsible of Authentication logic
 */
export class AuthService {
  private isAuthenticated = new BehaviorSubject<boolean>(this.tokenService.loggedIn());
  private apiUrl: string = globals.apiURL;
  public authStatus = this.isAuthenticated.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) { }

  /**
   * Switch the authentication status between true and false
   * Prevents subscribers to this status
   */
  changeAuthStatus(value: boolean) {
    this.isAuthenticated.next(value);
  }

  /**
   * Tries to log the user in the application with passed credentials,
   * by sending a request to backend API
   * @param credentials
   * @return rxjs/Observable
   */
  signIn(credentials: Credentials) {
    return this.http
      .post(`${this.apiUrl}/signin`, credentials)
      .pipe(catchError(respError => this.handleSentError(respError)
      ));
  }

  /**
   * Tries to register the user the application with passed credentials,
   * by sending a request to backend API
   * @param credentials
   * @return rxjs/Observable
   */
  signUp(credentials: Credentials) {
    return this.http.post(`${this.apiUrl}/signup`, credentials)
      .pipe(catchError(respError => this.handleSentError(respError)
      ));
  }

  logout() {
    this.tokenService.removeToken();
    this.tokenService.removeUserId();
    this.router.navigateByUrl('/signin');
    this.changeAuthStatus(false);
  }

  /** 
   * Handles response data
   * Calls tokenService to deal with recieved JWT token
   * Log the user in the application and prevent subscribers to auth status
   */
  handleSentData(data) {
    this.tokenService.setUserData(data.userId,data.email);
    this.tokenService.handleRecievedToken(data.access_token, data.expires_in);
    this.changeAuthStatus(true);
    this.router.navigateByUrl('/shops/all');
  }

  /** 
   * Handles eventual sent Error from api backend to authenticating requests
   * Returns them to sign-related components to display
   * @param sentError
  */
  handleSentError(sentError: HttpErrorResponse) {
    let errorMessage = 'An unknown error occured!';
    if (!sentError.error) {
      return throwError(errorMessage);
    }
    else if (sentError.error && !sentError.error.errors) {
      return throwError(sentError.error.error);
    }
    return throwError(sentError.error.errors);
  }

}
