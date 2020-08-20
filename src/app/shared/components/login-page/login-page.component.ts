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
    public authh: AuthService,
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
    this.authh.login(user).subscribe(() => {
      this.form.reset();
      this.router.navigate(['post']);
      this.submitted = false;
    }, () => {
      this.submitted = false;
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

