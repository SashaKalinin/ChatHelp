import { Component, OnInit } from '@angular/core';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.less']
})
export class PostPageComponent implements OnInit {
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
