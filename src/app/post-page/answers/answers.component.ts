import { Component, OnInit } from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';


@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.less']
})
export class AnswersComponent implements OnInit {
  checked = false;
  constructor(
    private authService: AuthService,
  ) { }

  ngOnInit(): void {
  }

  submit(): void {
  }
}
