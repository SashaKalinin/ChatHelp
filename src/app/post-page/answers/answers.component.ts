import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Answers, Post} from '../../../environments/interface';
import {Subscription} from 'rxjs';
import {PostService} from '../../shared/services/post.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {AlertService} from '../../shared/services/alert.service';

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
    this.sortingAnswers();
    this.isLoaded = true;
    this.form = new FormGroup({
      text: new FormControl(null, Validators.required)
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
    this.answers.map((a) => a === answer ? a.correct = !a.correct : a.correct);
    this.answersSub = this.postService.update({
      ...this.card,
      answers: this.answers
    }).subscribe((card) => {
      this.card = card;
      this.sortingAnswers();
      this.submitted = false;
      this.form.reset();
      this.alertService.success('Comment correct');
    });
    this.isLoaded = true;
  }

  sortingAnswers(): void {
    if (this.card.answers) {
      this.answers = this.card.answers.sort(a => a.correct ? -1 : 1);
    }
  }

  ngOnDestroy(): void {
    if (this.answersSub) {
      this.answersSub.unsubscribe();
    }
  }
}
