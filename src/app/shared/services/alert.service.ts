import {Injectable} from "@angular/core";
import {Subject} from "rxjs";
import {Alert} from "../../../environments/interface";

export type AlertType = 'success'| 'warning' | 'danger';

@Injectable()
export class AlertService {
  public alert$ = new Subject<Alert>();


  success(text: string): void {
    this.alert$.next({type: 'success', text});
  }

  warning(text: string): void {
    this.alert$.next({type: 'warning', text});
  }

  danger(text: string): void {
    this.alert$.next({type: 'danger', text});
  }
}
