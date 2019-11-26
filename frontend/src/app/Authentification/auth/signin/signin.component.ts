import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-signin",
  templateUrl: "./signin.component.html",
  styleUrls: ["./signin.component.css"]
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;

  constructor() {}

  ngOnInit() {
    this.signinForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(/[a-zA-Z0-9]{6,}/)
      ])
    });
  }

  /**
   * To verify if signin feature works
   */
  onSignin() {
    console.log(this.signinForm.get("email").value + " Logged in!");
  }
}
