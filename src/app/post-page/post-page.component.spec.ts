import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPageComponent } from './post-page.component';
import {PostService} from '../shared/services/post.service';
import {Post} from '../../environments/interface';
import {Observable, of} from 'rxjs';
import {HttpClientModule} from '@angular/common/http';
import {AppModule} from '../app.module';
import {RouterTestingModule} from '@angular/router/testing';
import {AlertService} from '../shared/services/alert.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DeletePopapComponent} from "./delete-popap/delete-popap.component";

describe('PostsPageComponent', () => {
  let component: PostPageComponent;
  let fixture: ComponentFixture<PostPageComponent>;
  let postService: PostService;
  let alertService: AlertService;
  let dialog: MatDialog;
  let getDataSpy: jasmine.Spy;
  let updateSpy: jasmine.Spy;
  let removeSpy: jasmine.Spy;
  let alertSpy: jasmine.Spy;
  let dialogSpy: jasmine.Spy;
  let posts: Post[];
  let post: Post;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, AppModule, RouterTestingModule],
      declarations: [ PostPageComponent],
      providers: [PostService, AlertService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostPageComponent);
    component = fixture.componentInstance;
    postService = fixture.debugElement.injector.get(PostService);
    alertService = fixture.debugElement.injector.get(AlertService);
    dialog = fixture.debugElement.injector.get(MatDialog);
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
    alertSpy = spyOn(alertService, 'warning').and.callThrough();
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

  describe('onResize', () => {
    let breakpoint: number;
    const size1 = 398;
    const size2 = 400;
    const size3 = 401;
    const size4 = 984;
    const size5 = 985;
    function resize(size): number {
      switch (true) {
        case size <= 400:
          return 1;
        case size <= 984:
          return 2;
        case size > 984:
          return 3;
      }
    }
    it('breakpoint with window size 398 should be equal 1', () => {
      breakpoint = resize(size1);
      expect(breakpoint).toEqual(1);
    });
    it('breakpoint with window size 400 should be equal 1', () => {
      breakpoint = resize(size2);
      expect(breakpoint).toEqual(1);
    });
    it('breakpoint with window size 401 should be equal 2', () => {
      breakpoint = resize(size3);
      expect(breakpoint).toEqual(2);
    });
    it('breakpoint with window size 984 should be equal 2', () => {
      breakpoint = resize(size4);
      expect(breakpoint).toEqual(2);
    });
    it('breakpoint with window size 985 should be equal 3', () => {
      breakpoint = resize(size5);
      expect(breakpoint).toEqual(3);
    });
  });

  describe('openDialog', () => {
    const event = new MouseEvent('click');
    it('should call dialog open and argument is a component and obj', async(() => {
      dialogSpy = spyOn(dialog, 'open').and.returnValue(
        {afterClosed: () => of(true)} as MatDialogRef<any>
      );
      spyOn(event, 'preventDefault');
      component.openDialog(post.id, event);
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(dialogSpy.calls.any()).toBeTruthy();
        expect(removeSpy).toHaveBeenCalled();
        expect(dialogSpy).toHaveBeenCalledWith( DeletePopapComponent, {data: 'Are you sure?'});
      });
    }));
    it('should do not call remove() if return false from dialog', async(() => {
      dialogSpy = spyOn(dialog, 'open').and.returnValue(
        {afterClosed: () => of(undefined)} as MatDialogRef<any>
      );
      spyOn(event, 'preventDefault');
      component.openDialog(post.id, event);
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(dialogSpy.calls.any()).toBeTruthy();
        expect(removeSpy).toHaveBeenCalledTimes(0);
      });
    }));
  });

  describe('approve', () => {
    const event = new MouseEvent('click');
    it('should call update from postService', async (() => {
      spyOn(event, 'preventDefault');
      component.approve(post, event);
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(updateSpy.calls.any()).toBeTruthy();
      });
    }));
    it('should get Update and return posts', async (() => {
      spyOn(event, 'preventDefault');
      component.approve(post, event);
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(component.posts).toEqual(posts);
      });
    }));
  });

  describe('remove', () => {
    it('should call remove from postService', async (() => {
      component.remove(post.id);
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(removeSpy.calls.any()).toBeTruthy();
      });
    }));
    it('should delete post and alertService has been called', async (() => {
      component.remove(post.id);
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(component.posts.includes(post)).toBeFalse();
        expect(alertSpy.calls.any()).toBeTruthy();
      });
    }));
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
