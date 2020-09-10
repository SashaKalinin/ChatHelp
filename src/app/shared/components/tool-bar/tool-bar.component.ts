import { Component, OnInit } from '@angular/core';
import {PostService} from '../../services/post.service';
import {Post} from '../../../../environments/interface';
import {PostPageComponent} from '../../../post-page/post-page.component';

@Component({
  selector: 'app-tool-bar',
  templateUrl: './tool-bar.component.html',
  styleUrls: ['./tool-bar.component.less']
})
export class ToolBarComponent implements OnInit {
  posts: Post[];
  sortingPosts: any;

  constructor(
    private postServise: PostService
  ) { }

  ngOnInit(): void {
  }

  filter(): any {
  }

  sort(): any {

  }
}
