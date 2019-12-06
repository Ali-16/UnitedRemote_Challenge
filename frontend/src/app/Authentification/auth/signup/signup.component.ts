import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { AuthService } from "../../auth.service";
import { Credentials } from '../../credentials.model';
import { AuthErrors } from '../../auth-errors.model';

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  private signupForm: FormGroup;
  private isLoading: boolean = false;
  private authErrors: AuthErrors;
  get register_email() {
    return this.signupForm.get('register_email');
  }
  get passwords() {
    return this.signupForm.get("passwords")
  }
  get register_password() {
    return this.signupForm.get("passwords").get('register_password');
  }

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.initSignupForm(); //generate Signup Form Reactively
  }

  /**
   * Initialize the signup form in the component,
   * and bind it to template template form
   */
  initSignupForm() {
    this.signupForm = new FormGroup({
      register_email: new FormControl(null, [Validators.required, Validators.email]),
      passwords: new FormGroup({
        register_password: new FormControl(null, [
          Validators.required,
          Validators.pattern(/[a-zA-Z0-9]{6,}/)
        ]),
        register_password_confirmation: new FormControl(null, [
          Validators.required,
          Validators.pattern(/[a-zA-Z0-9]{6,}/)
        ])
      },
        { validators: this.doesPasswordsMatch }
      )
    });
  }

  /**
   *Validator function, Wonder if two given passwords matched.
   * @param passwords
   * @return null if passes match and an object if not.
   */
  doesPasswordsMatch(passwords: FormGroup): { [key: string]: any } | null {
    const password = passwords.get("register_password").value;
    const password_confirmation = passwords.get("register_password_confirmation").value;
    return password === password_confirmation ? null : { dontMatch: true };
  }

  /** 
   * Checks if a passed input that was filled by the the user is **invalid**
   * according to tules defined in initSigninForm
   * @param FormControl
   * @return Boolean
   */
  isInValid(formControl: FormControl): Boolean {
    return (formControl.touched && formControl.dirty && !formControl.valid);
  }

  /** 
   * Checks if a passed input that was filled by the the user is **valid**
   * according to tules defined in initSigninForm
   * @param FormControl
   * @return Boolean
   */
  isValid(formControl: FormControl): Boolean {
    return (formControl.touched && formControl.dirty && formControl.valid);
  }

  /** 
   * Checks if the current passwords formGroup that was filled by the user is **invalid**
   * according to tules defined in initSigninForm
   * @return Boolean
   */
  isConfirmInvalid(): Boolean {
    return (
      (!this.signupForm.get('passwords').valid
        && this.signupForm.get('passwords.register_password_confirmation').dirty)
      || (!this.signupForm.get('passwords.register_password_confirmation').valid
        && this.signupForm.get('passwords.register_password_confirmation').touched
        && this.signupForm.get('passwords.register_password_confirmation').dirty));

  }

  /**
   * generates Credentrials from signup form, according to credentials.model
   * @return Credentials
   */
  generateCredentials(signupForm: FormGroup): Credentials {
    const register_email = signupForm.get("register_email").value;
    const register_password = signupForm.get("passwords").get('register_password').value;
    const register_password_confirmation = signupForm.get("passwords").get('register_password_confirmation').value;
    return new Credentials('signup', register_email, register_password, register_password_confirmation);
  }

  /**
   * triggered when user attempts to register, subscribes to observable sent by AuthService
   * Handle response data and eventual reponse errors
   */
  onSignup() {
    this.isLoading = true;
    const credentials = this.generateCredentials(this.signupForm);
    this.authService.signUp(credentials)
      .subscribe(
        responseData => {
          this.authService.handleSentData(responseData);
          this.isLoading = false;
        },
        responseError => {
          this.authErrors = responseError;
          this.isLoading = false;
        }
      );
  }

}
