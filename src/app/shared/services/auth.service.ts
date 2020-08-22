import {Injectable} from '@angular/core';
import {Observable, Subject, throwError} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';
import {FormGroup} from '@angular/forms';

@Injectable()
export class AuthService {
  public  error$: Subject<string> = new Subject<string>();
  form: FormGroup;
  public email = localStorage.getItem('user-email');
  constructor(
    public af: AngularFireAuth,
    ) {
  }
  get token(): string {
    const expDate = new Date(localStorage.getItem('fb-token-exp'));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  onSignUp(email: string, password: string): Promise<any> {
    return this.af.createUserWithEmailAndPassword(email, password)
      .then((response) => {
        this.setUserEmail(response.user.email);
        this.email = this.getEmail();
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
        this.setUserEmail(response.user.email);
        this.email = this.getEmail();
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
       this.setUserEmail(response.user.email);
       this.email = this.getEmail();
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
        this.setUserEmail(response.user.email);
        this.email = this.getEmail();
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

  private handleError(error: string): Observable<string> {
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

  private setUserEmail(email: string): void {
    if (email) {
      localStorage.setItem('user-email', email);
    }else {
      localStorage.clear();
    }
  }

  private getEmail(): string {
    return this.email = localStorage.getItem('user-email');
  }

 private setToken(idToken): void {
    if (idToken) {
      const expDate = new Date(new Date().getTime() + 3000 * 1000);
      localStorage.setItem('fb-token', idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }

  }
}

