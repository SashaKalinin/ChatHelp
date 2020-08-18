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


  register(): any {
    const { email, password } = this.form.value;
    this.af.createUserWithEmailAndPassword(email, password);
  }
  facebookLogIn(): any {
    this.af.signInWithPopup(new auth.FacebookAuthProvider()).then(() => {
      this.router.navigate(['post']);
    });
  }

  googleLogIn(): any {
    this.af.signInWithPopup(new auth.GoogleAuthProvider()).then(() => {
      this.router.navigate(['post']);
    });
  }
}
