import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import * as firebase from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {HomePageComponent} from '../../../home-page/home-page.component';

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
    public authSeervice: AuthService,
    private router: Router,
    public af: AngularFireAuth
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
    this.authSeervice.onLogin(email, password)
      .then(() => {
        this.router.navigate(['']);
      });
  }

   facebookLogIn(): void{
    this.authSeervice.logInWIthFacebook()
          .then(() => {
            this.router.navigate(['']);
          });
  }

   googleLogIn(): void {
     this.authSeervice.logInWIthGoogle()
       .then(() => {
         this.router.navigate(['']);
       });
  }
}

