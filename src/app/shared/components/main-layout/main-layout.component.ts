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
    private authSeervice: AuthService
  ) {

  }

  ngOnInit(): void {
  }

  logout(event: Event): void {
    event.preventDefault();
    this.authSeervice.logout();
    this.router.navigate(['login']).then(r => this.router.navigate(['login']));
  }

  isAuthUser(): boolean {
    return this.authSeervice.isAuth();
  }

}
