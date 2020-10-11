import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {FbCreateResponse, Post} from '../../../environments/interface';
import {environment} from '../../../environments/environment';
import {catchError, map} from 'rxjs/operators';
import {AlertService} from './alert.service';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(
    private http: HttpClient,
    private alertService: AlertService
   ) { }

  createPostsData(post: Post): Observable<Post> {
    return this.http.post(`${environment.fbDbUrl}/posts.json`, post)
      .pipe(
        map( (response: FbCreateResponse) => {
        return {
          ...post,
          id: response.name
        };
      }),
        catchError(err => {
          this.alertService.warning(err.message);
          return throwError(err);
        })
    );
  }
  // createAdminData(admin: any): Observable<any> {
  //   return this.http.post(`${environment.fbDbUrl}/admin.json`, admin);
  // }

  getData(): Observable<Post[]> {
    return this.http.get(`${environment.fbDbUrl}/posts.json`)
      .pipe(
        map((response: {[key: string]: any}) => {
       return response ? Object
          .keys(response)
          .map(key => ({
            ...response[key],
            id: key,
            date: new Date(response[key].date)
          })) : [];
      }),
        catchError(err => {
          this.alertService.warning(err.message);
          return throwError(err);
        })
      );
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`)
      .pipe(
        catchError(err => {
          this.alertService.warning(err.message);
          return throwError(err);
        })
      );
  }

  getById(id: string): Observable<Post> {
   return  this.http.get<Post>(`${environment.fbDbUrl}/posts/${id}.json`)
      .pipe(
        map( (post: Post) => {
        return {
          ...post,
          id
        };
      }),
        catchError(err => {
          this.alertService.warning(err.message);
          return throwError(err);
        })
      );
  }

  update(post: Post): Observable<Post> {
    return this.http.patch<Post>(`${environment.fbDbUrl}/posts/${post.id}.json`, post)
      .pipe(
        catchError(err => {
          this.alertService.warning(err.message);
          return throwError(err);
        })
      );
  }

  setItem(name: string, variable: any): void {
    localStorage.setItem(name, variable);
  }
  getItem(name: string): string {
    return localStorage.getItem(name);
  }
  removeItem(name: string): void {
    localStorage.removeItem(name);
  }
}


