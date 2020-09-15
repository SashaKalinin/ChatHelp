import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Answers, Post} from '../../../environments/interface';
import {Subscription} from 'rxjs';
import {PostService} from '../../shared/services/post.service';
import {Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {AlertService} from '../../shared/services/alert.service';


@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.less']
})
export class AnswersComponent implements OnInit, OnDestroy {
  form: FormGroup;
  authorOnline: string;
  card: Post;
  answers: Answers[] = [];
  postSub: Subscription;
  answersSub: Subscription;
  isLoaded = false;
  submitted = false;
  id = this.router.url.slice(1);

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private router: Router,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.authorOnline = this.authService.email;
    this.postSub = this.postService.getQuestCard(this.id).subscribe(post => {
      this.card = post;
      if (post.answers) {
        this.answers = post.answers;
      }
      this.isLoaded = true;
    });
    this.form = new FormGroup({
      text: new FormControl()
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.submitted = true;
    const answer: Answers = {
      id: this.id,
      author: this.authorOnline,
      text: this.form.value.text,
      date: new Date().getTime(),
      correct: false
    };
    this.answers.push(answer);
    this.answersSub = this.postService.update({
      ...this.card,
      id: this.id,
      answers: this.answers
    }).subscribe(() => {
      this.submitted = false;
      this.form.reset();
      this.alert.success('Comment left');
    });
  }

  ngOnDestroy(): void {
    if (this.postSub) {
      this.postSub.unsubscribe();
    }
    if (this.answersSub) {
      this.answersSub.unsubscribe();
    }
  }
}
