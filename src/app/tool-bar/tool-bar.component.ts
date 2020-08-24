import { Component, OnInit } from '@angular/core';
import {AddPostService} from '../shared/services/add-post.service';
import {Post} from '../../environments/interface';
import {PostPageComponent} from '../post-page/post-page.component';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.less']
})
export class ToolBarComponent implements OnInit {
  posts: Post[];

  constructor(
    private postServise: AddPostService,
    public postPageComponent: PostPageComponent
  ) { }

  ngOnInit(): void {
  }

  filter(): any {
  }

  sort(): any {
    console.log(this.postPageComponent.posts);
    // this.postPageComponent.posts.sort((a,b) => {
    //   return b.date - a.date;
    // });
  }
}
