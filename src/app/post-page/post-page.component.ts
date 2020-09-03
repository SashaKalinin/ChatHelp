import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {PostService} from '../shared/services/post.service';
import {Post} from '../../environments/interface';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.less']
})
export class PostPageComponent implements OnInit, OnDestroy {
  public isHello = false;
  posts: Post[] = [];
  pSub: Subscription;
  dSub: Subscription;
  dir: string[];
  author: string;
  questCard: Post;

  constructor(
    public authService: AuthService,
    private postService: PostService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.pSub = this.postService.getData().subscribe(post => {
      this.posts = post;
      this.author = this.authService.email;
    });
    setTimeout(() => {
      this.isHello = true;
    }, 1500);
  }

  getId(id: string): void {
    this.questCard = this.posts.find((item) => item.id === id);
    this.router.navigate(['post-card/' + this.questCard.id]);
  }

  remove(id: string): void {
    this.dSub = this.postService.remove(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
    });
  }

  ngOnDestroy(): void {
    if (this.pSub) {
      this.pSub.unsubscribe();
    }

    if (this.dSub) {
      this.dSub.unsubscribe();
    }
  }
}
