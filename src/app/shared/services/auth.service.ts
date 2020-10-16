import {Injectable} from '@angular/core';
import {Subject, throwError} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';
import {FormGroup} from '@angular/forms';
import {Constants} from '../../../environments/constants';
import {Router} from '@angular/router';
import * as firebase from 'firebase';
import {PostService} from './post.service';
import DataSnapshot = firebase.database.DataSnapshot;

@Injectable()
export class AuthService {
  public  error$: Subject<string> = new Subject<string>();
  form: FormGroup;
  public email = localStorage.getItem('user-email');
  public isAdminOnline: boolean;
  public errFlag = false;
  constructor(
    public af: AngularFireAuth,
    public router: Router,
    private postService: PostService
    ) {
  }
  get token(): string {
    const expDate = new Date(this.postService.getItem('fb-token-exp'));
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  isAdmin(): Promise<firebase.database.DataSnapshot> {
    return firebase.database().ref('admin')
      .once('value');
  }

  isAdminOn(email: string): Promise<string | void> {
    return this.isAdmin()
      .then(s => {
        const arr = s.val();
        for (const adm in arr) {
          const v = arr[adm];
          this.isAdminOnline = v.includes(email);
          this.postService.setItem('adminOnline', JSON.stringify(this.isAdminOnline));
        }
      });
  }

  onLogin(email: string, password: string): Promise<any> {
    return this.af.signInWithEmailAndPassword(email, password)
      .then((response) => {
        this.email = this.userEmail(response.user.email);
        return this.isAdminOn(response.user.email)
          .then(() => {
            response.user.getIdToken()
              .then((resp: string) => {
                this.setToken(resp);
              });
            this.errFlag = false;
          });
      })
      .catch((err) => {
        this.handleError(err.code);
        this.errFlag = true;
      });
  }

  onSignUp(email: string, password: string): Promise<any> {
    return this.af.createUserWithEmailAndPassword(email, password)
      .then((response) => {
        this.email = this.userEmail(response.user.email);
        return this.isAdminOn(response.user.email)
          .then(() => {
            response.user.getIdToken()
              .then((resp: string) => {
                this.setToken(resp);
              });
            this.errFlag = false;
          });
      })
      .catch((err) => {
        this.handleError(err.code);
        this.errFlag = true;
      });
  }


  logInWIthFacebook(): Promise<any> {
   return this.af.signInWithPopup(new auth.FacebookAuthProvider())
     .then( (response) => {
       this.email = this.userEmail(response.user.email);
       return this.isAdminOn(response.user.email)
         .then(() => {
           response.user.getIdToken()
             .then((resp: string) => {
               this.setToken(resp);
             });
           this.errFlag = false;
         });
     })
     .catch((err) => {
       this.handleError(err.code);
     });
  }

  logInWIthGoogle(): Promise<any> {
    return this.af.signInWithPopup(new auth.GoogleAuthProvider())
      .then( (response) => {
        this.email = this.userEmail(response.user.email);
        return this.isAdminOn(response.user.email)
          .then(() => {
            response.user.getIdToken()
              .then((resp: string) => {
                this.setToken(resp);
              });
            this.errFlag = false;
          });
      })
      .catch((err) => {
        this.handleError(err.code);
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
      case 'auth/email-already-in-use':
        this.error$.next('This email is already registered');
    }
    return throwError(error);
  }

  private userEmail(email: string): string {
    email ? this.postService.setItem('user-email', email) : this.postService.removeItem('user-email');
    return this.postService.getItem('user-email');
  }

 private setToken(idToken): void {
    if (idToken) {
      const expDate = Constants.dateToken;
      this.postService.setItem('fb-token', idToken);
      this.postService.setItem('fb-token-exp', expDate.toString());
    } else {
      this.postService.removeItem('fb-token');
      this.postService.removeItem('fb-token-exp');
      this.postService.removeItem('display_view');
      this.postService.removeItem('adminOnline');
    }
  }
}

