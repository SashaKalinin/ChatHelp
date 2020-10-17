import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPageComponent } from './post-page.component';
import {PostService} from '../shared/services/post.service';
import {Post} from '../../environments/interface';
import {of} from 'rxjs';
import {HttpClientModule} from '@angular/common/http';
import {AppModule} from '../app.module';
import {RouterTestingModule} from '@angular/router/testing';
import {ThemeService} from '../shared/services/theme.service';

describe('PostsPageComponent', () => {
  let component: PostPageComponent;
  let fixture: ComponentFixture<PostPageComponent>;
  let postService: PostService;
  let getDataSpy: jasmine.Spy;
  let updateSpy: jasmine.Spy;
  let removeSpy: jasmine.Spy;
  let posts: Post[];
  let post: Post;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, AppModule, RouterTestingModule],
      declarations: [ PostPageComponent],
      providers: [PostService]
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
    getDataSpy = spyOn(postService, 'getData').and.returnValue(of(posts));
    updateSpy = spyOn(postService, 'update').and.returnValue(of(posts));
    removeSpy = spyOn(postService, 'remove').and.returnValue(of(null));
    fixture.detectChanges();
    const store = {};
    const mockLocalStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      }
    };
    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getData from postService', () => {
      component.ngOnInit();
      expect(getDataSpy.calls.any()).toBeTruthy();
    });
    it('should get Posts', () => {
      component.ngOnInit();
      expect(component.posts).toEqual(posts);
    });
    it('should get localstorage item', () => {
      localStorage.setItem('display_view', '1');
      component.ngOnInit();
      expect(component.displaySelect).toEqual('1');
    });
  });

  describe('approve', () => {
    const event = new MouseEvent('click');
    it('should call update from postService', () => {
      spyOn(event, 'preventDefault');
      component.approve(post, event);
      expect(updateSpy.calls.any()).toBeTruthy();
    });
    it('should get Update and return posts', () => {
      spyOn(event, 'preventDefault');
      component.approve(post, event);
      expect(component.posts).toEqual(posts);
    });
  });

  describe('remove', () => {
    it('should call remove from postService', () => {
      component.remove(post.id);
      expect(removeSpy.calls.any()).toBeTruthy();
    });
  });

  describe('sort', () => {
    it('arrowUpAndDown should be arrow_downward if isDes false and on the contrary', () => {
      component.sort();
      expect(component.arrowUpAndDown).toEqual('arrow_downward');
      expect(component.isDes).toEqual(false);
      component.sort();
      expect(component.arrowUpAndDown).toEqual('arrow_upward');
      expect(component.isDes).toEqual(true);
    });
  });

  describe('reverseDisplay', () => {
    it('should reverse value of isDisplayTiled', () => {
      component.ngOnInit();
      expect(component.isDisplayTiled).toBeTruthy();
      component.displaySelect = 'Liner';
      component.reverseDisplay();
      expect(component.isDisplayTiled).toBeFalse();
    });
    it('should set display information to localStorage', () => {
      component.reverseDisplay();
      expect(localStorage.getItem('display_view')).toBeTruthy();
    });
  });


});
