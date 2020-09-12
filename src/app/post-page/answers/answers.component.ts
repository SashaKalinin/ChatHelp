import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../shared/services/auth.service';
import {Post} from '../../../environments/interface';
import {Subscription} from 'rxjs';
import {PostService} from '../../shared/services/post.service';
import {Router} from '@angular/router';


@Component({
  selector: 'app-answers',
  templateUrl: './answers.component.html',
  styleUrls: ['./answers.component.less']
})
export class AnswersComponent implements OnInit, OnDestroy {
  checked = false;
  author: string;
  card: Post;
  postSub: Subscription;
  isLoaded = false;
  constructor(
    private authService: AuthService,
    private postService: PostService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.author = this.authService.email;
    this.postSub = this.postService.getQuestCard(this.router.url.slice(1)).subscribe(post => {
      this.card = post;
      this.isLoaded = true;
    });
  }

  submit(): void {
  }

  ngOnDestroy(): void {
    if (this.postSub) {
      this.postSub.unsubscribe();
    }
  }
}
