import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.less']
})
export class MainLayoutComponent implements OnInit {

  constructor(
    private router: Router,
    private auth: AuthService
  ) {
}

  ngOnInit(): void {
  }

  // tslint:disable-next-line:typedef
  Logout(event: Event) {
    event.preventDefault();
    this.auth.logout();
    this.router.navigate(['login']);
  }

  isAuthUser(): boolean {
    return this.auth.isAuth();
  }

}
