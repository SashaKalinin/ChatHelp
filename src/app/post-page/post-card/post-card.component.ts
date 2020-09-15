import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from '../../shared/services/post.service';
import {AuthService} from '../../shared/services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Post} from '../../../environments/interface';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.less']
})
export class PostCardComponent implements OnInit, OnDestroy {
  author: string;
  card: Post;
  isLoaded = false;
  postSub: Subscription;
  deleteSub: Subscription;
  editCardPost: Post;
  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router,
    private rout: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.author = this.authService.email;
    this.postSub = this.rout.params
      .pipe(
        switchMap((params: Params) => {
          return this.postService.getById(params.id);
        })
      ).subscribe(post => {
      this.card = post;
      this.isLoaded = true;
    });
  }

  remove(): void {
  this.deleteSub = this.rout.params
    .pipe(
      switchMap((params: Params) => {
        return this.postService.remove(params.id);
      })
    ).subscribe(() => {
      this.router.navigate(['posts']);
    });
  }

  ngOnDestroy(): void {
    if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    }
    if (this.postSub) {
      this.postSub.unsubscribe();
    }
  }
  edit(post: Post, $event: Event): void {
    $event.stopPropagation();
    this.editCardPost = post;
    this.router.navigate(['post', this.editCardPost.id, 'edit']);
  }

  return(): void {
    this.router.navigate(['posts']);
  }
}
