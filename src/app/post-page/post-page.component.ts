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

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.less']
})
export class PostPageComponent implements OnInit, OnDestroy {
  public isHello = false;
  posts: Post[] = [];
  postSub: Subscription;
  deleteSub: Subscription;
  updateSub: Subscription;
  dir: string[];
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
  themeSub: Subscription;

  constructor(
    private themeService: ThemeService,
    public authService: AuthService,
    private postService: PostService,
    private router: Router,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    if (!localStorage.getItem('adminOnline')) {
      localStorage.setItem('adminOnline', JSON.stringify(this.authService.isAdminOnline));
    }
    this.authService.isAdminOnline = JSON.parse(localStorage.getItem('adminOnline'));
    this.postSub = this.postService.getData().subscribe(post => {
      this.author = this.authService.email;
      this.posts = post.filter(p => this.author === p.author || this.authService.isAdminOnline || p.adminApprove);
      this.displaySelect = this.themeService.get('display_view') || this.displaySelect;
      this.reverseDisplay();
      this.loadingFlag = false;
    });
    this.themeSub = this.themeService.selectTheme$
      .subscribe(item => this.selectedTheme = item);
  }

  getId(post: Post): void {
    this.router.navigate(['post', post.id]);
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
    }).subscribe(() => {     // вынести в сервис воспользоваться switchMap
      this.postSub = this.postService.getData().subscribe(pos => {
        this.posts = pos.filter(p => this.author === p.author || this.authService.isAdminOnline || p.adminApprove);
      });
      this.alertService.success('Question has been approved');
      }
    );
  }

  remove(id: string, $event): void {
    $event.stopPropagation();
    this.deleteSub = this.postService.remove(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
      this.alertService.warning('The question has been deleted');
    });
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
    this.themeService.set('display_view', this.displaySelect);
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
