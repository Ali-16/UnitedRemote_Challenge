import { Injectable } from "@angular/core";
import { Credentials } from "./credentials.model";

@Injectable({
  providedIn: "root"
})

/**
 * The servcie communicates with Backend API
 * Is responsible of Authentication logic
 */
export class AuthService {
  private _loggedIn = false;

  constructor() {}

  get loggedIn() {
    return this._loggedIn;
  }

  set loggedIn(state: boolean) {
    this._loggedIn = state;
  }

  /**
   * Verifies asynchronously if the user is authenticated or not
   * @return Promise (the API response)
   */
  isAuthenticated() {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this._loggedIn);
      }, 1000);
    });
    return promise;
  }

  /**
   * Tries to log the user in the application with passed credentials,
   * @param email
   * @param password
   * @return Promise (the API response)
   */
  signIn({ email, password }: Credentials) {
    this._loggedIn = true;
    console.log(this._loggedIn);
  }

  /**
   * Tries to register the user in the application with passed credentials,
   * @param email
   * @param password
   * @return Promise (the API response)
   */
  signOut({ email, password }: Credentials) {
    this._loggedIn = false;
    console.log(this._loggedIn);
  }
}
