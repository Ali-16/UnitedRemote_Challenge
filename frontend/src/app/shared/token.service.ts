import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as moment from "moment";
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import * as globals from './globals'

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private httpClient: HttpClient) { }

  /**
   * First handle of token sent from auth Service
   */
  handleRecievedToken(token: string, expires: number) {
    this.setToken(token, expires * 60);
  }

  /**
   * Stores JWT token and related data at localStorage of the browser
   * @param token 
   */
  private setToken(token: string, expires: number) {
    localStorage.setItem('token', token);
    localStorage.setItem('tokenLifeTime', expires.toString());
    this.setTokenExpiration();
  }

  /**
   * Stores JWT token at localStorage of the browser
   * @param token 
   */
  setUserData(userId: string, email: string) {
    localStorage.setItem('userId', userId);
    localStorage.setItem('email', email);
  }

  /**
   * Retrieves JWT token from localStorage of the browser
   */
  private getStoredToken() {
    return localStorage.getItem('token');
  }

  /**
   * Stores token-Exiration related data
   * use moment.js Library to handle time operations
   */
  private setTokenExpiration() {
    const now = moment();
    const tokenLifeTime = localStorage.getItem('tokenLifeTime');
    const expirate_at = now.add(tokenLifeTime, "seconds");
    localStorage.setItem('expires_at', expirate_at.toString());
  }

  /**
   * Retrieves JWT token from localStorage of the browser
   */
  getUserId() {
    return localStorage.getItem('userId');
  }

  /** 
   * gets stored life deadline of stored token from localStorage
   */
  private getTokenExpiration() {
    const expires_at_string = localStorage.getItem('expires_at');
    return moment(expires_at_string);
  }

  /**
 * Removes JWT token from localStorage of the browser
 */
  removeToken() {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenLifeTime');
    localStorage.removeItem('expires_at');
  }

  /**
   * Removes JWT token from localStorage of the browser
   */
  removeUserId() {
    localStorage.removeItem('userId');
  }

  private getTokenPayload(token) {
    const payload = token.split('.')[1];
    return this.decodePayload(payload);
  }

  private decodePayload(payload) {
    return JSON.parse(atob(payload));
  }

  /** 
   * Checks if the retrieved token from locaStrorage is real one,
   * by checken its issuer and compare it with trusted backend API
   */
  private isTokenValid() {
    const token = this.getStoredToken();
    if (token) {
      const tokenPayload = this.getTokenPayload(token);
      if (tokenPayload) {
        return (Object.values(globals.trustedTokenIssuer).indexOf(tokenPayload.iss) > -1);
      }
    }
    else {
      return false;
    }
  }

  /**
   * Checks if the current User is authenticated by verrifying the token
   */
  loggedIn() {
    return this.isTokenValid();
  }

  /** 
   * Makes and returns an observable for storedToken/refreshedtoken for token value
   * depending on whether the stored token is avalid one or not
   * 
   * @return Observable
   */
  getNotExpiredToken() {
    const safetyMarginTokenExpiration = this.getTokenExpiration().subtract(5, "minutes");
    const notExpired = moment().isBefore(safetyMarginTokenExpiration);

    if (!notExpired) {
      console.log('is before: ', notExpired);
      return this.makeRefreshTokenObservable();
    }
    else {
      return this.makeTokenObservable();
    }
  }

  /** 
   * Creates Observable for stored token value
   */
  private makeTokenObservable() {
    return new Observable(
      subscriber => {
        const storedToken = this.getStoredToken();
        const expires_in = localStorage.getItem('tokenLifeTime');
        const token = { access_token: storedToken, expires_in: expires_in };
        subscriber.next(token);
        if (!storedToken) {
          subscriber.error(new Error('No token stored!'));
        }
        subscriber.complete();
      }
    );
  }

  /** 
   * Creates Observable for stored token value
   * and stor new token at localStorage
   */
  private makeRefreshTokenObservable() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': ('Bearer ' + this.getStoredToken())
    });
    const RefreshTokenObservable = this.httpClient.get<any>('http://127.0.0.1:8000/api/refresh', { headers: headers }).pipe(
      tap(refreshToken => this.setToken(refreshToken.access_token, refreshToken.expires_in))
    );
    return RefreshTokenObservable;
  }
}
