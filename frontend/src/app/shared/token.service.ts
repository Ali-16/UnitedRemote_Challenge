import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private trustedTokenIssuer = {
    signin: 'http://127.0.0.1:8000/api/signin',
    signup: 'http://127.0.0.1:8000/api/signup'
  };

  constructor() { }

  handleRecievedToken(token: string) {
    this.setToken(token);
  }

  /**
   * Stores JWT token at localStorage of the browser
   * @param token 
   */
  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  /**
   * Retrieves JWT token from localStorage of the browser
   */
  getToken() {
    return localStorage.getItem('token');
  }

  /**
   * Removes JWT token from localStorage of the browser
   */
  removeToken() {
    localStorage.removeItem('token');
  }

  /**
   * Stores JWT token at localStorage of the browser
   * @param token 
   */
  setUserId(userId: string) {
    localStorage.setItem('userId', userId);
  }

  /**
   * Retrieves JWT token from localStorage of the browser
   */
  getUserId() {
    return localStorage.getItem('userId');
  }

  /**
   * Removes JWT token from localStorage of the browser
   */
  removeUserId() {
    localStorage.removeItem('userId');
  }

  /** 
   * Checks if the retrieved token from locaStrorage is real one,
   * by checken its issuer and compare it with trusted backend API
   */
  isTokenValid() {
    const token = this.getToken();
    if (token) {
      const tokenPayload = this.getTokenPayload(token);
      if (tokenPayload) {
        return (Object.values(this.trustedTokenIssuer).indexOf(tokenPayload.iss) > -1);
      }
    }
    else {
      return false;
    }
  }

  getTokenPayload(token) {
    const payload = token.split('.')[1];
    return this.decodePayload(payload);
  }

  decodePayload(payload) {
    return JSON.parse(atob(payload));
  }

  /**
   * Checks if the current User is authenticated by verrifying the token
   */
  loggedIn() {
    return this.isTokenValid();
  }
}
