import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.css"]
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;

  constructor() {}

  ngOnInit() {
    this.signupForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      passwords: new FormGroup(
        {
          password: new FormControl(null, [
            Validators.required,
            Validators.pattern(/[a-zA-Z0-9]{6,}/)
          ]),
          confirmPassword: new FormControl(null, [
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
  doesPasswordsMatch(passwords: FormGroup) {
    const password = passwords.get("password").value;
    const confirmPassword = passwords.get("confirmPassword").value;
    return password === confirmPassword ? null : { dontMatch: true };
  }

  /**
   * To verify if signup feature works
   */
  onSignup() {
    console.log(this.signupForm.get("email").value + " Resgistred!");
  }
}
