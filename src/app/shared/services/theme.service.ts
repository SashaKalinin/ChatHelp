import { Injectable } from '@angular/core';
import {BehaviorSubject, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AlertService} from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private selectThemeSource = new BehaviorSubject<string>('white');
  constructor(
    private alertService: AlertService
  ) {
  }
  selectTheme$ = this.selectThemeSource.asObservable()
    .pipe(
      catchError(err => {
        this.alertService.warning(err.message);
        return throwError(err);
      })
    );
  changeTheme(a: string): void {
    this.selectThemeSource.next(a);
  }
}
