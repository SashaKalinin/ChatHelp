import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private selectThemeSource = new BehaviorSubject<string>('white');
  selectTheme$ = this.selectThemeSource.asObservable();
  changeTheme(a: string): void {
    this.selectThemeSource.next(a);
  }
  setInLocalStore(name: string, variable: string): void {
    localStorage.setItem(name, variable);
  }
  getFromLocalStore(name: string): string {
    return localStorage.getItem(name);
  }
}
