import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {FbAuthResponse, User} from '../interfaces';
import {Observable, Subject, throwError} from 'rxjs';
import {environment} from '../../../environments/environment';
import {catchError, tap} from 'rxjs/operators';

@Injectable()
export class AuthService {
  public  error$: Subject<string> = new Subject<string>();
  constructor(private http: HttpClient) {
  }

  get token(): string {
    return localStorage.getItem('fb-token');
  }

  login(user: { password: any; email: any; returnSecureToken?: boolean }): Observable<any> {
    user.returnSecureToken = true;
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebase.apiKey}`, user)
      .pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      );
  }

  logout(): any  {
    this.setToken(null);
  }


  isAuth(): boolean {
    return !!this.token;
  }

  // tslint:disable-next-line:typedef
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
  // tslint:disable-next-line:typedef
  private  setToken(response: FbAuthResponse | null) {
    if (response) {
      localStorage.setItem('fb-token', response.idToken);
    } else {
      localStorage.clear();
    }

  }
}

