import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {PostService} from "../shared/services/post.service";
import {Post} from "../../environments/interface";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

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
  postCard: Post;

  constructor(
    public authSeervice: AuthService,
    private postServise: PostService,
    private router: Router
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

  getId(id: string): void {
    const card = this.posts.find((item) => item.id === id);
    this.postCard = card;
    this.router.navigate([this.postCard.id]);
  }

  ngOnDestroy(): void {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }
  }

}
