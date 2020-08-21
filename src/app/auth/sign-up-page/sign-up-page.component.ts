import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../shared/services/auth.service';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.less']
})

export class SignUpPageComponent implements OnInit {
  form: FormGroup;
  constructor(
    private router: Router,
    public authSeervice: AuthService,
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup( {
      email: new FormControl(null, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

   register(): any {
    const { email, password } = this.form.value;
    this.authSeervice.onSignUp(email, password)
      .then(() => {
        this.router.navigate(['']);
      });
  }

  facebookLogIn(): any {
    this.authSeervice.logInWIthFacebook()
      .then(() => {
        this.router.navigate(['']);
      });
  }

  googleLogIn(): any {
    this.authSeervice.logInWIthGoogle()
      .then(() => {
        this.router.navigate(['']);
      });
    }

  }


