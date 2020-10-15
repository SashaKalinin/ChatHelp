import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginPageComponent } from './login-page.component';
import {AuthService} from '../../shared/services/auth.service';
import {AlertService} from '../../shared/services/alert.service';
import {HttpClientModule} from '@angular/common/http';
import {AppModule} from '../../app.module';
import {DebugElement} from '@angular/core';
import Spy = jasmine.Spy;
import {By} from '@angular/platform-browser';


xdescribe('LoginPageComponent', () => {
  let component: LoginPageComponent;
  let fixture: ComponentFixture<LoginPageComponent>;
  let authService: AuthService;
  let alertService: AlertService;
  let loginSpy: Spy;
  let loginFacebookSpy: Spy;
  let loginGoogleSpy: Spy;
  let alertSpy: Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, AppModule],
      declarations: [ LoginPageComponent ],
      providers: [AuthService, AlertService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginPageComponent);
    component = fixture.componentInstance;
    authService = fixture.debugElement.injector.get(AuthService);
    alertService = fixture.debugElement.injector.get(AlertService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submit', () => {
    function updateForm(userEmail, userPassword): void {
      component.form.controls.email.setValue(userEmail);
      component.form.controls.password.setValue(userPassword);
    }
    const validUser = {
      email: 's@mail.ru',
      password: '123456'
    };
    const invUser = {
      email: 'smail.ru',
      password: '1234'
    };
    it('should component initial state', () => {
      expect(component.submitted).toBeFalsy();
      expect(component.form).toBeDefined();
      expect(component.form.invalid).toBeTruthy();
    });
    it('should form value should update from when u change the input', (() => {
      updateForm(validUser.email, validUser.password);
      expect(component.form.value).toEqual(validUser);
    }));
    it('Form should invalid should be true when form is invalid', (() => {
      updateForm(invUser.email, invUser.password);
      expect(component.form.invalid).toBeTruthy();
    }));
    it('should submitted should be true when submit()', () => {
      component.form.controls.email.setValue(validUser.email);
      component.form.controls.password.setValue(validUser.password);
      expect(component.form.invalid).toBeFalse();
      component.submit();
      expect(component.submitted).toBeTruthy();
    });
    it('should call authService onLogin method', async(() => {
      let loginElement: DebugElement;
      loginSpy = spyOn(authService, 'onLogin').and.callThrough();
      loginElement = fixture.debugElement.query(By.css('form'));
      component.form.controls.email.setValue(validUser.email);
      component.form.controls.password.setValue(validUser.password);
      loginElement.triggerEventHandler('ngSubmit', null);
      expect(loginSpy).toHaveBeenCalledTimes(1);
    }));
  });
  describe('facebookLogIn', () => {
    it('should cell authService logInWIthFacebook method', async(() => {
      let loginFacebookElement: DebugElement;
      loginFacebookSpy = spyOn(authService, 'logInWIthFacebook').and.callThrough();
      loginFacebookElement = fixture.debugElement.query(By.css('.fa-facebook-official'));
      loginFacebookElement.triggerEventHandler('click', null);
      expect(loginFacebookSpy).toHaveBeenCalled();
    }));
  });
  describe('googleLogIn', () => {
    it('should cell authService logInWIthGoogle method', async(() => {
      let loginGoogleElement: DebugElement;
      loginGoogleSpy = spyOn(authService, 'logInWIthGoogle').and.callThrough();
      loginGoogleElement = fixture.debugElement.query(By.css('.fa-google'));
      loginGoogleElement.triggerEventHandler('click', null);
      expect(loginGoogleSpy).toHaveBeenCalled();
    }));
  });
  describe('greeting', () => {
    it('should cell alertService method success', () => {
      alertSpy = spyOn(alertService, 'success').and.callThrough();
      authService.errFlag = false;
      component.greeting();
      expect(alertSpy).toHaveBeenCalled();
    });
  });
});
