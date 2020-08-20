import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import * as firebase from 'firebase';

@Component({
  selector: 'app-sign-up-page',
  templateUrl: './sign-up-page.component.html',
  styleUrls: ['./sign-up-page.component.less']
})
export class SignUpPageComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  constructor(
    private router: Router,
    private  af: AngularFireAuth
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


  async register(): Promise<any> {
    const { email, password } = this.form.value;
    this.af.createUserWithEmailAndPassword(email, password)
      .then(async (response) => {
      localStorage.setItem('fb-token', await response.user.getIdToken());
      this.router.navigate(['post']);
    });
  }
  async facebookLogIn(): Promise<any> {
    this.af.signInWithPopup(new auth.FacebookAuthProvider())
      .then(async (response) => {
        localStorage.setItem('fb-token', await response.user.getIdToken());
        this.router.navigate(['post']);
      });
  }

  async googleLogIn(): Promise<any> {
    this.af.signInWithPopup(new auth.GoogleAuthProvider())
      .then(async (response) => {
        localStorage.setItem('fb-token', await response.user.getIdToken());
        this.router.navigate(['post']);
      });
  }
}
