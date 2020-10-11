import { TestBed } from '@angular/core/testing';

import { PostService } from './post.service';
import {HttpClientModule} from '@angular/common/http';
import {AppModule} from '../../app.module';

describe('PostsService', () => {
  let service: PostService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, AppModule]
    });
    service = TestBed.inject(PostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
