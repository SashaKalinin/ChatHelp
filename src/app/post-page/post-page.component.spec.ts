import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPageComponent } from './post-page.component';
import {PostService} from '../shared/services/post.service';
import {Post} from '../../environments/interface';
import {of} from 'rxjs';
import {HttpClientModule} from "@angular/common/http";
import {ThemeService} from "../shared/services/theme.service";
import {AuthService} from "../shared/services/auth.service";
import {AlertService} from "../shared/services/alert.service";
import {AppModule} from "../app.module";

describe('PostsPageComponent', () => {
  let component: PostPageComponent;
  let fixture: ComponentFixture<PostPageComponent>;
  let postService: PostService;
  let spy: jasmine.Spy;
  let spy2: jasmine.Spy;
  let posts: Post[];
  let post: Post;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, AppModule],
      declarations: [ PostPageComponent],
      providers: [PostService, AlertService, AuthService, ThemeService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostPageComponent);
    component = fixture.componentInstance;
    postService = fixture.debugElement.injector.get(PostService);
    posts = [{
      title: `asd`,
      text: `asd`,
      id: '1',
      date: 3,
      complete: false,
      adminApprove: true
    }];
    post = {
      title: `asd`,
      text: `asd`,
      id: '1',
      date: 3,
      complete: false,
      adminApprove: true
    };
    spy = spyOn(postService, 'getData').and.returnValue(of(posts));
    spy2 = spyOn(postService, 'update').and.returnValue(of(post));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getData from postService', () => {
    component.ngOnInit();
    expect(spy.calls.any()).toBeTruthy();
  });

  it('should get Post', () => {
    component.ngOnInit();
    expect(component.posts).toEqual(posts);
  });

  it('should call update from postService', () => {
    component.approve(post);
    expect(spy2.calls.any()).toBeTruthy();
  });

  it('should get Update and return posts', () => {
    component.approve(post);
    expect(component.posts).toEqual(posts);
  });
});
