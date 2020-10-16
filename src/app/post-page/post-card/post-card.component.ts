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
    }, err => this.alertService.warning(err.message));
    this.themeSub = this.themeService.selectTheme$
      .subscribe(item => this.selectedTheme = item, err => this.alertService.warning(err.message));
  }

  remove(): void {
  this.deleteSub = this.postService.remove(this.card.id)
    .subscribe(() => {
      this.router.navigate(['posts']);
      this.alertService.warning('The question has been deleted');
    }, err => this.alertService.warning(err.message));
  }

  edit(post: Post): void {
    this.router.navigate(['post', post.id, 'edit']);
  }

  approve(post: Post): void {
    this.updateSub = this.postService.update({
      ...post,
      adminApprove: true
    }).subscribe(() => {
      this.router.navigate(['posts']);
      this.alertService.success('Question has been approved');
      }, err => this.alertService.warning(err.message)
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

