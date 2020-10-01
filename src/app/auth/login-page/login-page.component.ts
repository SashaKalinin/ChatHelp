import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {AlertService} from '../../shared/services/alert.service';
import {PostService} from "../../shared/services/post.service";

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.less']
})
export class LoginPageComponent implements OnInit {
  form: FormGroup;
  authorOnline: string;

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
    const {email, password} = this.form.value;
    this.authService.isAdmin(email).then(s => {
      const arr = s.val();
      for (const i in arr) {
        const v = arr[i];
        this.authService.isAdminOnline = v.includes(email);
        console.log(this.authService.isAdminOnline);
      }
      this.authService.onLogin(email, password)
        .then(() => {
          this.greeting();
          this.router.navigate(['posts']);
        });
    });
  }

   facebookLogIn(): void{
    this.authService.logInWIthFacebook()
          .then(() => {
            this.greeting();
            this.router.navigate(['posts']);
          });
  }

   googleLogIn(): void {
     this.authService.logInWIthGoogle()
       .then(() => {
         this.greeting();
         this.router.navigate(['posts']);
       });
  }

  greeting(): void {
    this.authorOnline = this.authService.email;
    this.alertService.success(`Hello ${this.authorOnline}`);
  }

}

