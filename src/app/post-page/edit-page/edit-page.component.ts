import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {PostService} from '../../shared/services/post.service';
import {switchMap} from 'rxjs/operators';
import {Post} from '../../../environments/interface';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Constants} from '../../../environments/constants';
import {Subscription} from 'rxjs';
import {AlertService} from '../../shared/services/alert.service';

@Component({
  selector: 'app-edit-page',
  templateUrl: './edit-page.component.html',
  styleUrls: ['./edit-page.component.less']
})
export class EditPageComponent  implements OnInit, OnDestroy {
  form: FormGroup;
  post: Post;
  dir = new FormControl();
  dirList: string[] = Constants.dirArr;
  submitted = false;
  updateSub: Subscription;
  postSub: Subscription;
  constructor(
    private rout: ActivatedRoute,
    private postService: PostService,
    private router: Router,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.postSub =  this.rout.params
      .pipe(
        switchMap((params: Params) => {
          return this.postService.getById(params.id);
        })
      ).subscribe( (post: Post) => {
        this.post = post;
        this.form = new FormGroup({
          title: new FormControl(post.title, Validators.required),
          text: new FormControl(post.text, Validators.required),
          dir: new FormControl(post.direct)
        });
    });
  }
  return(): void {
    this.router.navigate(['posts']);
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.submitted = true;
    this.updateSub = this.postService.update( {
      ...this.post,
      title: this.form.value.title,
      text: this.form.value.text,
      direct: this.form.value.dir,
    }).subscribe( () => {
      this.alert.success('Question has been changed');
      this.router.navigate(['posts']);
      this.submitted = false;
    });
  }

  comparer(a: string, b: string): boolean {
    return a === b;
  }

  ngOnDestroy(): void {
    if (this.updateSub) {
      this.updateSub.unsubscribe();
    }
    if (this.postSub) {
      this.postSub.unsubscribe();
    }
  }

}
