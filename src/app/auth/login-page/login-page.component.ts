import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {AlertService} from '../../shared/services/alert.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;
  authorOnline: string;
  submitted = false;

  constructor(
    public authService: AuthService,
    private router: Router,
    private alertService: AlertService,
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
    this.submitted = true;
    const {email, password} = this.form.value;
    this.authService.onLogin(email, password)
        .then(() => {
          this.greeting();
          this.router.navigate(['posts']);
          this.submitted = false;
        });
  }

   facebookLogIn(): void{
    this.submitted = true;
    this.authService.logInWIthFacebook()
          .then(() => {
            this.greeting();
            this.router.navigate(['posts']);
            this.submitted = false;
          });
  }

   googleLogIn(): void {
     this.submitted = true;
     this.authService.logInWIthGoogle()
       .then(() => {
         this.greeting();
         this.router.navigate(['posts']);
         this.submitted = false;
       });
  }

  greeting(): void {
    if (!this.authService.errFlag) {
      this.authorOnline = this.authService.email;
      this.alertService.success(`Hello ${this.authorOnline}`);
    }
  }

}

