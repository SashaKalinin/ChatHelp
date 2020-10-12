import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Constants} from '../../../environments/constants';
import {Post} from '../../../environments/interface';
import {PostService} from '../../shared/services/post.service';
import {AuthService} from '../../shared/services/auth.service';
import {AlertService} from '../../shared/services/alert.service';
import {Subscription} from 'rxjs';
import {ThemeService} from '../../shared/services/theme.service';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.less']
})
export class AskQuestionComponent implements OnInit, OnDestroy {
  form: FormGroup;
  dir = new FormControl();
  dirList: string[] = Constants.dirArr;
  submitted = false;
  selectedTheme: string;
  themeSub: Subscription;

  constructor(
    private router: Router,
    private postService: PostService,
    public authService: AuthService,
    private alert: AlertService,
    private alertService: AlertService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
      ]),
      text: new FormControl(null, [
        Validators.required,
      ])
    });
    this.themeSub = this.themeService.selectTheme$
      .subscribe(item => this.selectedTheme = item, err => this.alertService.warning(err.message));
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.submitted = true;
    let post: Post = {
      title: this.form.value.title,
      text: this.form.value.text,
      date: new Date().getTime(),
      direct: this.dir.value,
      author: this.authService.email,
      complete: false,
      adminApprove: false,
      answers: []
    };
    if (this.authService.isAdminOnline) {
        post = {
          ...post,
          adminApprove: true,
      };
    }
    this.postService.createPostsData(post).subscribe((resp) => {
      this.submitted = false;
      this.form.reset();
      this.dir.reset();
      this.router.navigate(['posts']);
      this.alert.success('Question asked');
    }, err => this.alertService.warning(err.message));
  }
  return(): void {
    this.router.navigate(['posts']);
  }
  ngOnDestroy(): void {
    if (this.themeSub) {
      this.themeSub.unsubscribe();
    }
  }
}
