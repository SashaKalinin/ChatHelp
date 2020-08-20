import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import * as firebase from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase/app';


@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  private user: firebase.User;

  constructor(
    public Auth: AuthService,
    private router: Router,
    public af: AngularFireAuth,
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

  submit(): void {
    const {email, password} = this.form.value;
    this.Auth.onLogin(email, password)
      .then(() => {
        this.router.navigate(['post']);
      });
  }

   facebookLogIn(): void{
    this.Auth.logInWIthFacebook()
          .then(() => {
            this.router.navigate(['post']);
          });
  }

   googleLogIn(): void {
     this.Auth.logInWIthGoogle()
       .then(() => {
         this.router.navigate(['post']);
       });
  }
}

