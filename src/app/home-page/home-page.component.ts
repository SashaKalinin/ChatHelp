import { Component, OnInit } from '@angular/core';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.less']
})
export class HomePageComponent implements OnInit {
  public isHello = false;
  constructor(
    public authSeervice: AuthService
  ) { }

  ngOnInit(): void {
    setTimeout(() => {
      this.isHello = true;
    }, 3000);
  }
}
