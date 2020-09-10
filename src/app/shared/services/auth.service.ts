import {Injectable} from '@angular/core';
import {Subject, throwError} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';
import {FormGroup} from '@angular/forms';
import {Constants} from '../../../environments/constants';
import {Router} from '@angular/router';

@Injectable()
export class AuthService {
  public  error$: Subject<string> = new Subject<string>();
  form: FormGroup;
  public email = localStorage.getItem('user-email');
  constructor(
    public af: AngularFireAuth,
    public router: Router
    ) {
  }
  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
    if (new Date() > expDate) {
      this.logout();
      // this.router.navigate(['login']);
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  onSignUp(email: string, password: string): Promise<any> {
    return this.af.createUserWithEmailAndPassword(email, password)
      .then((response) => {
        this.email = this.userEmail(response.user.email);
        response.user.getIdToken()
          .then((resp: string) => {
            this.setToken(resp);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onLogin(email: string, password: string): Promise<any> {
    return this.af.signInWithEmailAndPassword(email, password)
      .then((response) => {
        this.email = this.userEmail(response.user.email);
        response.user.getIdToken()
        .then((resp: string) => {
          this.setToken(resp);
        });
    })
      .catch((err) => {
        const error = err;
        this.handleError(error.code);
      });
  }

  logInWIthFacebook(): Promise<any> {
   return this.af.signInWithPopup(new auth.FacebookAuthProvider())
     .then( (response) => {
       this.email = this.userEmail(response.user.email);
       response.user.getIdToken()
        .then((resp: string) => {
        this.setToken(resp);
      });
     })
     .catch((err) => {
       console.log(err);
     });
  }

  logInWIthGoogle(): Promise<any> {
    return this.af.signInWithPopup(new auth.GoogleAuthProvider())
      .then( (response) => {
        this.email = this.userEmail(response.user.email);
        response.user.getIdToken()
          .then((resp: string) => {
          this.setToken(resp);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  logout(): void  {
    this.setToken(null);
  }

  isAuth(): boolean {
    return !!this.token;
  }

  private handleError(error: string): any {
    switch (error) {
      case 'auth/wrong-password':
        this.error$.next('Invalid password');
        break;
      case 'auth/user-not-found':
        this.error$.next('Email not found');
        break;
    }
    return throwError(error);
  }

  private userEmail(email: string): string {
    if (email) {
      localStorage.setItem('user-email', email);
    }else {
      localStorage.removeItem('user-email');
    }
    return localStorage.getItem('user-email');
  }



 private setToken(idToken): void {
    if (idToken) {
      const expDate = Constants.dateToken;
      localStorage.setItem('fb-token', idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.removeItem('fb-token');
      localStorage.removeItem('fb-token-exp');
    }

  }
}

