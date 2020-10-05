import {Component, OnDestroy, OnInit} from '@angular/core';
import {PostService} from '../../shared/services/post.service';
import {AuthService} from '../../shared/services/auth.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Post} from '../../../environments/interface';
import {switchMap} from 'rxjs/operators';
import {AlertService} from '../../shared/services/alert.service';
import {ThemeService} from '../../shared/services/theme.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.less']
})
export class PostCardComponent implements OnInit, OnDestroy  {
  author: string;
  card: Post;
  isLoaded = false;
  postSub: Subscription;
  deleteSub: Subscription;
  updateSub: Subscription;
  themeSub: Subscription;
  selectedTheme: string;
  constructor(
    private postService: PostService,
    private authService: AuthService,
    private router: Router,
    private rout: ActivatedRoute,
    private alertService: AlertService,
    private themeService: ThemeService
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
    this.themeSub = this.themeService.selectTheme$
      .subscribe(item => this.selectedTheme = item);
  }

  remove(): void {
  this.deleteSub = this.postService.remove(this.card.id)
    .subscribe(() => {
      this.router.navigate(['posts']);
      this.alertService.warning('The question has been deleted');
    });
  }

  edit(post: Post, $event: Event): void {
    $event.stopPropagation();
    this.router.navigate(['post', post.id, 'edit']);
  }

  approve(post: Post, $event: MouseEvent): void {
    $event.stopPropagation();
    this.updateSub = this.postService.update({
      ...post,
      adminApprove: true
    }).subscribe(() => {
      this.router.navigate(['posts']);
      this.alertService.success('Question has been approved');
      }
    );
  }

  return(): void {
    this.router.navigate(['posts']);
  }

  ngOnDestroy(): void {
    if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    }
    if (this.postSub) {
      this.postSub.unsubscribe();
    }
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
    if (this.updateSub) {
      this.updateSub.unsubscribe();
    }
  }
}

