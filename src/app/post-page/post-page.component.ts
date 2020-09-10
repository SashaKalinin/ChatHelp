import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../shared/services/auth.service';
import {PostService} from '../shared/services/post.service';
import {Post} from '../../environments/interface';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';
import {AlertService} from "../shared/services/alert.service";

@Component({
  selector: 'app-post-page',
  templateUrl: './post-page.component.html',
  styleUrls: ['./post-page.component.less']
})
export class PostPageComponent implements OnInit, OnDestroy {
  public isHello = false;
  posts: Post[] = [];
  postSub: Subscription;
  deleteSub: Subscription;
  dir: string[];
  author: string;
  questCard: Post;
  editCardPost: Post;
  loadingFlag = true;

  constructor(
    public authService: AuthService,
    private postService: PostService,
    private router: Router,
    private alert: AlertService
  ) { }

  ngOnInit(): void {
    this.postSub = this.postService.getData().subscribe(post => {
      this.author = this.authService.email;
      this.posts = post;
      this.loadingFlag = false;
    });
  }

  getId(post: Post): void {
    this.questCard = post;
    this.router.navigate([this.questCard.id]);
  }

  edit(post: Post, $event: Event): void {
    $event.stopPropagation();
    this.editCardPost = post;
    this.router.navigate(['post', this.editCardPost.id, 'edit']);
  }

  remove(id: string, $event): void {
    $event.stopPropagation();
    this.deleteSub = this.postService.remove(id).subscribe(() => {
      this.posts = this.posts.filter(post => post.id !== id);
      this.alert.warning('The question has been deleted');
    });
  }

  ngOnDestroy(): void {
    if (this.postSub) {
      this.postSub.unsubscribe();
    }

    if (this.deleteSub) {
      this.deleteSub.unsubscribe();
    }
  }
}
