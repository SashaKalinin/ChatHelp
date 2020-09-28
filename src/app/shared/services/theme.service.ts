import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private selectThemeSource = new BehaviorSubject<number>(1);
  selectTheme$ = this.selectThemeSource.asObservable();
  changeTheme(a: number): void {
    this.selectThemeSource.next(a);
  }
}
