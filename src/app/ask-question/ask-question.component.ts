import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {Directions} from '../../environments/directions';
import {Post} from '../../environments/interface';

@Component({
  selector: 'app-ask-question',
  templateUrl: './ask-question.component.html',
  styleUrls: ['./ask-question.component.less']
})
export class AskQuestionComponent implements OnInit {
  form: FormGroup;
  dir = new FormControl();
  dirList: string[] = [
    this.directions.dotNet,
    this.directions.frontend,
    this.directions.salesforce
  ];
  constructor(
    private router: Router,
    public directions: Directions
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      title: new FormControl(null, [
        Validators.required,
      ]),
      text: new FormControl(null, [
        Validators.required,
      ]),
    });
  }

  submit(): void {
    if (this.form.invalid) {
      return;
    }

    const post: Post = {
      title: this.form.value.title,
      text: this.form.value.text,
      date: new Date()
    };
    console.log(post);
    console.log(this.dir.value);
  }
}
