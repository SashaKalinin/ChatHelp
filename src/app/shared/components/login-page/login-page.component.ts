import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {User} from '../../interfaces';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;
  submitted = false;
   provider = new firebase.auth.FacebookAuthProvider();
  private user: firebase.User;
  constructor(
    public auth: AuthService,
    private router: Router,
  ) {

  }

  ngOnInit(): void {

    this.form = new FormGroup({
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ]),
    });
  }

  submit(): any {
    if (this.form.invalid) {
      return;
    }
    this.submitted = true;

    const user: { password: any; email: any; returnSecureToken: boolean } = {
      email: this.form.value.email,
      password: this.form.value.password,
      returnSecureToken: false
    };
    this.auth.login(user).subscribe(() => {
      this.form.reset();
      this.router.navigate(['post']);
      this.submitted = false;
    }, () => {
      this.submitted = false;
    });
  }

  facebookLogIn() {

  }
}
