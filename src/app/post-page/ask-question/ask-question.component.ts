import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Constants} from '../../../environments/constants';
import {Post} from '../../../environments/interface';
import {PostService} from '../../shared/services/post.service';
import {AuthService} from '../../shared/services/auth.service';
import {AlertService} from "../../shared/services/alert.service";

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.less']
})
export class AskQuestionComponent implements OnInit {
  form: FormGroup;
  dir = new FormControl();
  dirList: string[] = Constants.dirArr;
  submitted = false;

  constructor(
    private router: Router,
    private postService: PostService,
    public aithService: AuthService,
    private alert: AlertService
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
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.submitted = true;
    const post: Post = {
      title: this.form.value.title,
      text: this.form.value.text,
      date: new Date().getTime(),
      direct: this.dir.value,
      author: this.aithService.email,
      complete: false,
      adminApprove: false
    };
    this.postService.create(post).subscribe(() => {
      this.submitted = false;
      this.form.reset();
      this.dir.reset();
      this.router.navigate(['posts']);
      this.alert.success('Question asked');
    });
  }
  return(): void {
    this.router.navigate(['posts']);
  }
}
