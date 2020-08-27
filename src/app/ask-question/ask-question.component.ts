import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Constants} from '../../environments/constants';
import {Post} from '../../environments/interface';
import {PostService} from '../shared/services/post.service';
import {AuthService} from '../shared/services/auth.service';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.less']
})
export class AskQuestionComponent implements OnInit {
  form: FormGroup;
  dir = new FormControl();
  dirList: string[] = this.constants.dirArr;

  constructor(
    private router: Router,
    public constants: Constants,
    private postService: PostService,
    public aithService: AuthService
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
    const post: Post = {
      title: this.form.value.title,
      text: this.form.value.text,
      date: new Date(),
      direct: this.dir.value,
      author: this.aithService.email,
      complete: false,
      adminApprove: false
    };
    this.postService.create(post).subscribe(() => {
      this.form.reset();
      this.dir.reset();
      this.router.navigate(['post']);
    });
  }
}
