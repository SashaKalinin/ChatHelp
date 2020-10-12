import {inject, TestBed} from '@angular/core/testing';

import { PostService } from './post.service';
import {AppModule} from '../../app.module';
import {Post} from '../../../environments/interface';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {AlertService} from './alert.service';
import {environment} from '../../../environments/environment';

const postsData = [
  {title: `asd`, text: `asd`, id: '1', date: 3, complete: false, adminApprove: true},
  {title: `321`, text: `123`, id: '2', date: 4, complete: true, adminApprove: false}
] as Post[];
const post: Post = postsData[0];
const postId = post.id;

describe('PostsService', () => {

  let service: PostService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AppModule, HttpClientTestingModule],
      providers: [PostService, AlertService]
    });
    httpTestingController = TestBed.get(HttpTestingController);
  });

  beforeEach(inject([PostService], s => {
    service = s;
  }));

  // beforeEach(() => {
  //   this.mockPosts = [...postsData];
  //   this.mockPost = this.mockPosts[0];
  //   this.mockId = this.mockPost.id;
  // });

  const apiUrl = (id: string) => {
      return `${environment.fbDbUrl}/posts/${id}.json`;
    };

  afterEach(() => {
      httpTestingController.verify();
    });




});
