import {PostCardComponent} from './post-card.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {PostService} from '../../shared/services/post.service';
import {Post} from '../../../environments/interface';
import {HttpClientModule} from '@angular/common/http';
import {AppModule} from '../../app.module';
import {of} from 'rxjs';
import {AlertService} from '../../shared/services/alert.service';
import {MatDialog, MatDialogRef} from '@angular/material/dialog';
import {DeletePopapComponent} from '../delete-popap/delete-popap.component';

describe('PostCardComponent', () => {
  let component: PostCardComponent;
  let fixture: ComponentFixture<PostCardComponent>;
  let postService: PostService;
  let alertService: AlertService;
  let dialog: MatDialog;
  let updateSpy: jasmine.Spy;
  let removeSpy: jasmine.Spy;
  let getByIdSpy: jasmine.Spy;
  let alertSpy: jasmine.Spy;
  let dialogSpy: jasmine.Spy;
  let posts: Post[];
  let post: Post;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, AppModule],
      declarations: [ PostCardComponent],
      providers: [PostService, AlertService]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostCardComponent);
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
    updateSpy = spyOn(postService, 'update').and.returnValue(of(posts));
    removeSpy = spyOn(postService, 'remove').and.returnValue(of(null));
    getByIdSpy = spyOn(postService, 'getById').and.returnValue(of(post));
    alertSpy = spyOn(alertService, 'warning').and.callThrough();
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

  describe('openDialog', () => {
    it('should call dialog open and argument is a component and obj', async(() => {
      dialogSpy = spyOn(dialog, 'open').and.returnValue(
        {afterClosed: () => of(true)} as MatDialogRef<any>
      );
      component.openDialog();
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
      component.openDialog();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(dialogSpy.calls.any()).toBeTruthy();
        expect(removeSpy).toHaveBeenCalledTimes(0);
      });
    }));
  });

  describe('remove', () => {
    it('should call remove from postService', async (() => {
      component.remove();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(removeSpy.calls.any()).toBeTruthy();
      });
    }));
    it('should delete post and alertService has been called', async (() => {
      component.remove();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        expect(alertSpy.calls.any()).toBeTruthy();
      });
    }));
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
