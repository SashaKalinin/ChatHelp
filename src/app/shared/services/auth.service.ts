import {Injectable} from '@angular/core';
import {Observable, Subject, throwError} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';
import {FormGroup} from '@angular/forms';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';

@Injectable()
export class AuthService {
  public  error$: Subject<string> = new Subject<string>();
  form: FormGroup;
  constructor(
    public af: AngularFireAuth
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
        response.user.getIdToken()
          .then((resp: string) => {
            this.setToken(resp);
          });
      });
  }

  onLogin(email: string, password: string): Promise<any> {
    return this.af.signInWithEmailAndPassword(email, password)
      .then((response) => {
      response.user.getIdToken()
        .then((resp: string) => {
          this.setToken(resp);
        }).catch((err) => {
        console.log(err);
      });
    });
  }

  logInWIthFacebook(): Promise<any> {
   return this.af.signInWithPopup(new auth.FacebookAuthProvider())
     .then( (response) => {
      response.user.getIdToken()
        .then((resp: string) => {
        this.setToken(resp);
      });
     });
  }

  logInWIthGoogle(): Promise<any> {
    return this.af.signInWithPopup(new auth.GoogleAuthProvider())
      // tslint:disable-next-line:no-shadowed-variable
      .then( (response) => {
        // tslint:disable-next-line:no-shadowed-variable
        response.user.getIdToken().then((response: string) => {
          this.setToken(response);
        });
      });
  }

  logout(): any  {
    this.setToken(null);
  }

  isAuth(): boolean {
    return !!this.token;
  }


  private handleError(error: HttpErrorResponse): Observable<any> {
    const {message} = error.error.error;
    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Invalid email');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Invalid password');
        break;
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Email not found');
        break;
    }
    return throwError(error);
  }


 private setToken(idToken): void {
    if (idToken) {
      const expDate = new Date(new Date().getTime() + 6 * 1000);
      localStorage.setItem('fb-token', idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }

  }
}

