import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {PostService} from "../shared/services/post.service";
import {Post} from "../../environments/interface";
import {Subscription} from "rxjs";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.less']
})
export class PostPageComponent implements OnInit, OnDestroy {
  public isHello = false;
  posts: Post[];
  pSub: Subscription;
  dir: string[];
  author: string;

  constructor(
    public authSeervice: AuthService,
    private postServise: PostService
  ) { }

  ngOnInit(): void {
    this.pSub = this.postServise.getData().subscribe(post => {
      this.posts = post;
      this.author = this.authSeervice.email;
    });
    setTimeout(() => {
      this.isHello = true;
    }, 1500);
  }

  ngOnDestroy(): void {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }
  }

}
