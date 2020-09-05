import { Component, OnInit } from '@angular/core';
import {PostService} from "../../shared/services/post.service";
import {Post} from "../../../environments/interface";
import {AuthService} from "../../shared/services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.less']
})
export class PostCardComponent implements OnInit {
  author: string;
  card: any;
  loading = false;
  constructor(
    public postService: PostService,
    public authService: AuthService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.postService.getData().subscribe(post => {
      this.author = this.authService.email;
    });
    this.postService.getQuestCard(this.router.url.slice(1)).subscribe(post => {
      this.card = post;
      this.loading = true;
    });
  }

  remove(id: string): void {
  this.postService.remove(id).subscribe(() => {
      this.router.navigate(['posts']);
    });
  }


}
