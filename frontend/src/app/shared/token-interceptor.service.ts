import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { catchError, tap, switchMap } from 'rxjs/operators';

import * as globals from './globals';
import { AuthService } from '../Authentification/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

/** 
 * The HttpInterceptor service. intercept http requests & responses:
 *  
 * (except signin, signup & refresh token ) sent to backEndApi
 * adds a valid token in their headers and keeps them going to backEnd Api
 * 
 * Handles http response errors 
 */
export class TokenInterceptorService implements HttpInterceptor {
  private apiUrl: string = globals.apiURL;
  auth: any;

  constructor(private tokenService: TokenService,
    private authService: AuthService,
    private router: Router) { }

  /**
     * Main function of the service, which add token headers to intercepted requests
     * 
     * @param req 
     * @param next 
     * 
     * @return HttpHandler
     */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isDataRequest(req)) {
      return this.tokenService.getNotExpiredToken().pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error)),
        switchMap(tokenResponse => {
          const headers = this.generateTokenHeaders(tokenResponse.access_token);
          const newRequest = req.clone({ headers: headers });
          return next.handle(newRequest);
        })
      );
    } else {
      return next.handle(req);
    }
  }

  /** 
   * Cheks if a give httpRequest is data-related request
   * @param HttpRequest
   * @return boolean
   */
  private isDataRequest(req: HttpRequest<any>) {
    return !([`${this.apiUrl}/signin`, `${this.apiUrl}/signup`, `${this.apiUrl}/refresh`].includes(req.url));
  }

  /**
   * Generate Headers for token-Authorization from given token
   * 
   * @param token 
   * @return HttpHeaders
   */
  private generateTokenHeaders(token: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': ('Bearer ' + token)
    });
    return headers;
  }

  /** 
   * Handles Http response Errors 
   */
  private handleError(sentError: HttpErrorResponse) {
    switch (sentError.status) {
      case 401: {
        alert('You have inactive for a long time. You will get logged out..');
        this.authService.logout();
        break;
      }
      case 404: {
        this.router.navigateByUrl('/notfound');
        break;
      }
      default: {
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



  }

}
