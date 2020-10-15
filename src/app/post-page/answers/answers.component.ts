import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Answers, Post} from '../../../environments/interface';
import {Subscription} from 'rxjs';
import {PostService} from '../../shared/services/post.service';
import {ActivatedRoute, Router} from '@angular/router';
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
  complete: boolean;

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
    if (this.card.answers) {
      this.complete = this.card.answers.some(a => a.correct);
    }
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
      correct: false,
    };
    this.answers.push(answer);
    this.answersSub = this.postService.update({
      ...this.card,
      answers: this.answers
    }).subscribe((card) => {
      this.card = card.find(post => {
        return post.id === this.card.id;
      });
      this.submitted = false;
      this.form.markAsPristine();
      this.form.markAsUntouched();
      this.form.reset();
      this.alertService.success('Comment left');
    });
  }

  changeFlag(answer: Answers, event?: Event): void {
    this.answers.map((a) => a === answer ? a.correct = !a.correct : a.correct);
    this.complete = this.answers.some(a => a.correct);
    this.answersSub = this.postService.update({
      ...this.card,
      answers: this.answers,
      complete: this.complete
    }).subscribe((card) => {
      this.card = card.find(post => {
        return post.id === this.card.id;
      });
      this.sortingAnswers();
      this.submitted = false;
      this.form.reset();
    }, err => this.alertService.warning(err.message));
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
