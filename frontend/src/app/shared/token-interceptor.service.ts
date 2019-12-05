import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { catchError, retry } from 'rxjs/operators';

import * as globals from './globals';
import { stringify } from 'querystring';

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

  constructor(private tokenService: TokenService) { }

  /**
   * Main function of the service, which add token headers to intercepted requests
   * 
   * @param req 
   * @param next 
   * 
   * @return HttpRequest
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!([`${this.apiUrl}/signin`, `${this.apiUrl}/signup`, `${this.apiUrl}/refresh`].includes(req.url))) {

      const token = this.getValidToken();
      const headers = this.generateTokenHeaders(token);
      const clonedReq = req.clone({ headers: headers });

      return next.handle(clonedReq).pipe(
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
    }

    return next.handle(req);
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
   * Subscribe to tokenService Observable to get a valid Token
   * @return token
   */
  getValidToken() {
    let validToken: string;

    const tokenSubscriber = this.tokenService.getNotExpiredToken()
      .subscribe(
        tokenResponse => {
          validToken = tokenResponse.access_token;
        },
        error => {
          console.log(error);
        }
      );

    return validToken;
  }

  /** 
   * Handles Http response Errors 
   */
  private handleError(sentError) {
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
