import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { AuthService } from "../../auth.service";
import { Credentials } from '../../credentials.model';
import { AuthErrors } from '../../auth-errors.model';
import { TokenService } from 'src/app/shared/token.service';

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.css"]
})
export class SigninComponent implements OnInit {
  private signinForm: FormGroup;
  private isLoading: boolean = false;
  private authErrors: AuthErrors;
  private unauthenticated: string;
  get email() {
    return this.signinForm.get('email');
  }
  get password() {
    return this.signinForm.get('password');
  }

  constructor(
    private authService: AuthService, 
    private tokenService: TokenService,
    ) { }

  ngOnInit() {
    this.initSigninForm();
  }

  /**
   * Initialize the signup form in the component,
   * and bind it to template template form
   */
  private initSigninForm() {
    this.signinForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/[a-zA-Z0-9]{6,}/)
      ])
    });
  }

  /** 
   * Checks if a passed input that was filled by the the user is **invalid**
   * according to tules defined in initSigninForm
   * @param FormControl
   * @return Boolean
   */
  private isInValid(formControl: FormControl): Boolean {
    return (formControl.touched && formControl.dirty && !formControl.valid);
  }

  /** 
   * Checks if a passed input that was filled by the the user is **valid**
   * according to tules defined in initSigninForm
   * @param FormControl
   * @return Boolean
   */
  private isValid(formControl: FormControl): Boolean {
    return (formControl.touched && formControl.dirty && formControl.valid);
  }

  /**
   * generate Credentrials from signin form, according to credentials.model
   * @return Credentials
   */
  private generateCredentials(signinForm: FormGroup): Credentials {
    const email = signinForm.get("email").value;
    const password = signinForm.get('password').value;
    return new Credentials('signin', email, password);
  }

  /**
   * triggered when user attempts to login, Subscribes to observable sent by AuthService
   * Handle response data and response eventual errors
   */
  private onSignin() {
    this.isLoading = true;
    const credentials = this.generateCredentials(this.signinForm);
    this.authService.signIn(credentials)
      .subscribe(
        responseData => {
          this.authService.handleSentData(responseData);
          this.isLoading = false;
        },
        reponseError => {
          this.handleErrors(reponseError);
          this.isLoading = false;
        }
      );
  }

  /** 
   * Hand errors if it's an authenticated one
   */
  private handleErrors(error) {
    if (error === "Email & Password don't match") {
      this.unauthenticated = error;
    }
    else {
      this.authErrors = error;
    }
  }

}
