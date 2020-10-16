import {PostCardComponent} from './post-card.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PostService} from '../../shared/services/post.service';
import {Post} from '../../../environments/interface';
import {HttpClientModule} from '@angular/common/http';
import {AppModule} from '../../app.module';
import {of} from 'rxjs';

describe('PostCardComponent', () => {
  let component: PostCardComponent;
  let fixture: ComponentFixture<PostCardComponent>;
  let postService: PostService;
  let updateSpy: jasmine.Spy;
  let removeSpy: jasmine.Spy;
  let getByIdSpy: jasmine.Spy;
  let posts: Post[];
  let post: Post;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, AppModule],
      declarations: [ PostCardComponent],
      providers: [PostService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCardComponent);
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
    updateSpy = spyOn(postService, 'update').and.returnValue(of(posts));
    removeSpy = spyOn(postService, 'remove').and.returnValue(of(null));
    getByIdSpy = spyOn(postService, 'getById').and.returnValue(of(post));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getById from postService', () => {
      component.ngOnInit();
      expect(getByIdSpy.calls.any()).toBeTruthy();
    });
    it('should change isLoaded to true and should get Post', async(() => {
      component.ngOnInit();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(component.isLoaded).toBeTruthy();
        expect(component.card).toEqual(post);
      });

    }));
  });
  describe('remove', () => {
    it('should call remove from postService', () => {
      component.remove();
      expect(removeSpy.calls.any()).toBeTruthy();
    });
    it('should remove post and return null', () => {
      postService.remove(component.card.id).subscribe(resp => expect(resp).toBe(null));
    });
  });

  describe('approve', () => {
    it('should call update from postService', () => {
      component.approve(component.card);
      expect(updateSpy.calls.any()).toBeTruthy();
    });
    it('should get Update and return posts', () => {
      component.approve(component.card);
      expect(component.card).toEqual(post);
    });
  });
});
