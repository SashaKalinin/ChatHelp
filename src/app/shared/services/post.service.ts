import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {FbCreateResponse, Post} from '../../../environments/interface';
import {environment} from '../../../environments/environment';
import {map, catchError} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(
    private http: HttpClient
  ) { }

  create(post: Post): Observable<Post> {
    return this.http.post(`${environment.fbDbUrl}/posts.json`, post)
      .pipe(map( (response: FbCreateResponse) => {
        return {
          ...post,
          id: response.name
        };
      }));
  }

  getData(): Observable<Post[]> {
    return this.http.get(`${environment.fbDbUrl}/posts.json`)
      .pipe(map((response: {[key: string]: any}) => {
       return response ? Object
          .keys(response)
          .map(key => ({
            ...response[key],
            id: key,
            date: new Date(response[key].date)
          })) : [];
      }));
  }

  remove(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.fbDbUrl}/posts/${id}.json`);
  }

  getById(id: string): Observable<Post> {
   return  this.http.get<Post>(`${environment.fbDbUrl}/posts/${id}.json`)
      .pipe(map( (post: Post) => {
        return {
          ...post,
          id
        };
      }));
  }

  getQuestCard(id: string): Observable<any> {
    return this.http.get<any>(`${environment.fbDbUrl}/posts/${id}.json`);
  }
}

