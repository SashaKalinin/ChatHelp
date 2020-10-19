import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {PostService} from '../shared/services/post.service';
import {Post} from '../../environments/interface';
import {Subscription} from 'rxjs';
import {Constants} from '../../environments/constants';
import {Router} from '@angular/router';
import {AlertService} from '../shared/services/alert.service';
import {FormControl} from '@angular/forms';
import {ThemeService} from '../shared/services/theme.service';
import {MatDialog} from '@angular/material/dialog';
import {DeletePopapComponent} from './delete-popap/delete-popap.component';

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.less']
})
export class PostPageComponent implements OnInit, OnDestroy {
  posts: Post[] = [];
  postSub: Subscription;
  deleteSub: Subscription;
  updateSub: Subscription;
  themeSub: Subscription;
  direction = Constants.dirArr;
  timeFilter = Constants.timeFilter;
  author: string;
  loadingFlag = true;
  isDes = true;
  arrowUpAndDown = 'arrow_upward';
  direct = new FormControl();
  direFiltersValue: string[] = [];
  filters = new FormControl();
  commentFilter: string[] = Constants.commentFilter;
  commentFiltersValue: string[] = [];
  adminFilter = new FormControl();
  admFilter: string[] = Constants.adminFilter;
  adminFiltersValue: string[] = [];
  authorFilt = new FormControl();
  authorFilterArr: string[] = Constants.authorFilterArr;
  authorFilterValue: string[];
  timeSelect: string;
  displaySelect = 'Tiled';
  isDisplayTiled = true;
  selectedTheme = '';
  removed = false;
  breakpoint = 1;


  constructor(
    public dialog: MatDialog,
    private themeService: ThemeService,
    public authService: AuthService,
    private postService: PostService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    if (this.postService.getItem('adminOnline')) {
      this.authService.isAdminOnline = JSON.parse(this.postService.getItem('adminOnline'));
    }
    this.postSub = this.postService.getData().subscribe(posts => {
      this.author = this.authService.email;
      if (posts) {
        this.posts = posts.filter(p => this.author === p.author || this.authService.isAdminOnline || p.adminApprove);
      }
      this.displaySelect = this.postService.getItem('display_view') || this.displaySelect;
      this.reverseDisplay();
      this.loadingFlag = false;
    }, err => this.alertService.warning(err.message));
    this.themeSub = this.themeService.selectTheme$
      .subscribe(item => this.selectedTheme = item, err => this.alertService.warning(err.message));
  }

  openDialog(id: string, $event: Event): void {
    $event.stopPropagation();
    const dialogRef = this.dialog.open(DeletePopapComponent, {
      data: 'Are you sure?'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.remove(id);
      }
    });
  }

  getId(post: Post): void {
    this.router.navigate(['post', post.id]);
  }

  edit(post: Post, $event: Event): void {
    $event.stopPropagation();
    this.router.navigate(['post', post.id, 'edit']);
  }

  approve(post: Post, $event: Event): void {
    $event.stopPropagation();
    this.updateSub = this.postService.update({
      ...post,
      adminApprove: true
    }).subscribe((posts) => {
        this.posts = posts.filter(p => this.author === p.author || this.authService.isAdminOnline || p.adminApprove);
        this.alertService.success('Question has been approved');
        }, err => this.alertService.warning(err.message));
  }

  remove(id: string): void {
    this.deleteSub = this.postService.remove(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
      this.alertService.warning('The question has been deleted');
    }, err => this.alertService.warning(err.message));
  }

  sort(): void {
    this.arrowUpAndDown = this.isDes ? 'arrow_downward' : 'arrow_upward';
    this.isDes = !this.isDes;
  }

  addFilterArr(): void {
    this.commentFiltersValue = this.filters.value || [];
    this.direFiltersValue = this.direct.value || [];
    this.adminFiltersValue = this.adminFilter.value || [];
    this.authorFilterValue = this.authorFilt.value || [];
  }

  reverseDisplay(): void {
    this.isDisplayTiled = this.displaySelect === 'Tiled';
    this.postService.setItem('display_view', this.displaySelect);
  }

  selectedThemeItem(): void {
    this.themeService.changeTheme(this.selectedTheme);
  }

  ngOnDestroy(): void {
    if (this.postSub) {
      this.postSub.unsubscribe();
    }
    if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    }
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
    if (this.updateSub) {
      this.updateSub.unsubscribe();
    }
  }
}
