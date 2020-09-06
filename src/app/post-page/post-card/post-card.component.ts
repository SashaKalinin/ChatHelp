import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from '../../shared/services/post.service';
import {AuthService} from '../../shared/services/auth.service';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.less']
})
export class PostCardComponent implements OnInit, OnDestroy {
  author: string;
  card: any;
  loading = false;
  pSub: Subscription;
  dSub: Subscription;
  constructor(
    public postService: PostService,
    public authService: AuthService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.pSub = this.postService.getData().subscribe(post => {
      this.author = this.authService.email;
    });
    this.postService.getQuestCard(this.router.url.slice(1)).subscribe(post => {
      this.card = post;
      this.loading = true;
    });
  }
  log(card: any): void {
    console.log(card);
  }

  remove(id: string): void {
  this.dSub = this.postService.remove(id).subscribe(() => {
      this.router.navigate(['posts']);
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

  return(): void {
    this.router.navigate(['posts']);
  }
}
