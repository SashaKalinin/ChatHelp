import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Answers, Post} from '../../../environments/interface';
import {Subscription} from 'rxjs';
import {PostService} from '../../shared/services/post.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormControl, FormGroup} from '@angular/forms';
import {AlertService} from '../../shared/services/alert.service';
import {switchMap} from 'rxjs/operators';

@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.less']
})
export class AnswersComponent implements OnInit, OnDestroy, OnChanges  {
  @Input() card: Post;
  form: FormGroup;
  authorOnline: string;
  answers: Answers[] = [];
  postSub: Subscription;
  answersSub: Subscription;
  isLoaded = false;
  correct = false;
  submitted = false;

  constructor(
    private authService: AuthService,
    private postService: PostService,
    private router: Router,
    private rout: ActivatedRoute,
    private alertService: AlertService //
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnInit(): void {
    this.authorOnline = this.authService.email;
    if (this.card.answers) {
      this.answers = this.card.answers.sort((a, ) => {
        return a.correct ? -1 : 1;
      });
    }
    this.isLoaded = true;

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
      author: this.authorOnline,
      text: this.form.value.text,
      date: new Date().getTime(),
      correct: this.correct,
    };
    this.answers.push(answer);
    this.answersSub = this.postService.update({
      ...this.card,
      answers: this.answers
    }).subscribe((card) => {
      this.card = card;
      this.submitted = false;
      this.form.reset();
      this.alertService.success('Comment left');
    });
  }

  changeFlag(answer: Answers): void {
    this.answers.map((a) => {
        if (a === answer) {
          a.correct = !a.correct;
        }
    });
    this.answersSub = this.postService.update({
      ...this.card,
      answers: this.answers
    }).subscribe((card) => {
      this.card = card;
      if (this.card.answers) {
        this.answers = this.card.answers.sort((a) => {
          return a.correct ? -1 : 1;
        });
      }
      this.submitted = false;
      this.form.reset();
      this.alertService.success('Comment correct');
    });

    this.isLoaded = true;

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
