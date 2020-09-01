import { Component, OnInit } from '@angular/core';
import {PostService} from "../../shared/services/post.service";
import {Post} from "../../../environments/interface";

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.less']
})
export class PostCardComponent implements OnInit {
  posts: Post[];
  constructor(
    private postServise: PostService
  ) { }

  ngOnInit(): void {
    this.postServise.getData().subscribe(post => {
      this.posts = post;
    });
  }

  public getId(posts: Post[], $event): any {
    posts.forEach((post) => {
      if (post.id === $event.target.id) {
        console.log(post.id);
        return post.id;
      }
    });
  }

}